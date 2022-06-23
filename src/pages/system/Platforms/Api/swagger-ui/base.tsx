import { observer } from '@formily/react';
import { ApiModel } from '@/pages/system/Platforms/Api/base';
import { TitleComponent } from '@/components';
import ReactJson from 'react-json-view';
import { Button, Input, Table, Tabs } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { cloneDeep, isArray, isObject } from 'lodash';
import classNames from 'classnames';

export default observer(() => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [responseData, setResponseData] = useState<any[]>([]);

  const getContent = (data: any) => {
    return Object.keys(data)[0];
  };

  const ObjectFindValue = (name: string, obj: any): any => {
    let value: any = '';
    if (obj[name]) {
      value = obj[name];
    } else {
      Object.keys(obj).some((key) => {
        const _value = isObject(obj[key]) ? ObjectFindValue(name, obj[key]) : undefined;
        if (_value) {
          value = _value;
          return true;
        }
        return false;
      });
    }
    return value;
  };

  const titleCase = (value: string) => {
    return value.slice(0, 1).toLowerCase() + value.slice(1);
  };

  const handleEntityTable = useCallback(
    (entityName: string, entityData: any, entityType: string, required: boolean) => {
      let propertiesData: any[] = [];

      if (entityData) {
        propertiesData = Object.keys(entityData).map((key) => {
          return {
            name: key,
            description: entityData[key].description,
            method: '',
            required: !!entityData[key].required,
            type: entityData[key].type,
          };
        });
      }
      // 数组类型，实体名末尾加s
      const _isArray = entityType === 'array' ? 's' : '';

      setDataSource([
        ...dataSource,
        {
          name: titleCase(entityName) + _isArray,
          description: entityName,
          method: 'body',
          required: required,
          type: entityType || entityName,
          children: propertiesData,
        },
      ]);
    },
    [dataSource],
  );

  const getEntity = () => {
    const contentType: any = Object.values(ApiModel.swagger.requestBody.content);
    if (contentType) {
      const refUrl = ObjectFindValue('$ref', ApiModel.swagger.requestBody.content);
      if (refUrl) {
        const entityName = refUrl.split('/').pop();
        const entityType = ObjectFindValue('type', ApiModel.swagger.requestBody.content);
        const entityRequired = ApiModel.swagger.requestBody.required;
        console.log(entityName);
        const entity: any = ApiModel.components[entityName];
        const file = ObjectFindValue('file', ApiModel.swagger.requestBody.content);
        // 是否为文件上传
        if (file && isObject(file)) {
          const fileObj = [
            {
              name: 'file',
              description: '',
              method: 'query',
              required: true,
              type: 'file',
            },
          ];
          setDataSource(fileObj);
          ApiModel.debugger.params = fileObj;
        } else if (entity) {
          handleEntityTable(entityName, entity.properties || entity, entityType, !!entityRequired);
        }
        return entityType === 'array' ? [entity.properties || entity] : entity.properties || entity;
      }
      return '';
    }
    return '';
  };

  const handleEntity = (entityData: any): any => {
    let newEntity = {};
    if (isArray(entityData)) {
      newEntity = [handleEntity(entityData[0])];
    } else if (isObject(entityData)) {
      Object.keys(entityData).forEach((key) => {
        const type = entityData[key].type;
        if (type) {
          if (type.includes('integer')) {
            newEntity[key] = 0;
          } else if (type === 'boolean') {
            newEntity[key] = true;
          } else if (type === 'object') {
            newEntity[key] = {};
          } else if (type === 'array') {
            newEntity[key] = [];
          } else {
            newEntity[key] = '';
          }
        } else {
          newEntity[key] = '';
        }
      });
    }
    return newEntity;
  };

  const getResult = (name: string, oldName: string = '') => {
    if (name === oldName) {
      // 禁止套娃
      return [];
    }
    const entity = cloneDeep(ApiModel.components[name].properties);
    Object.keys(entity).forEach((key) => {
      const type = entity[key].type;
      if ((entity[key].items && entity[key].items.$ref) || entity[key].$ref) {
        const _ref = entity[key].$ref || entity[key].items.$ref;
        const refName = _ref.split('/').pop();
        if (type === 'array') {
          entity[key] = [getResult(refName, name)];
        } else {
          entity[key] = getResult(refName, name);
        }
      } else if (type) {
        if (type.includes('integer')) {
          entity[key] = 0;
        } else if (type === 'boolean') {
          entity[key] = true;
        } else {
          entity[key] = '';
        }
      }
    });
    return entity;
  };

  const handleResponseParam = (name: any, oldName: string = ''): any[] => {
    if (!ApiModel.components[name]) {
      return [];
    }

    const entity = cloneDeep(ApiModel.components[name].properties);

    const newArr: any[] = [];
    if (name === oldName) {
      return newArr;
    }

    Object.keys(entity).forEach((key) => {
      const type = entity[key].type;
      const obj: any = {
        code: key,
        description: entity[key].description,
        type: type,
      };

      if ((entity[key].items && entity[key].items.$ref) || entity[key].$ref) {
        const _ref = entity[key].$ref || entity[key].items.$ref;
        const refName = _ref.split('/').pop();
        if (refName) {
          obj.type = refName;
          obj.children = handleResponseParam(refName, name);
        }
      }
      newArr.push(obj);
    });
    return newArr;
  };

  const handleResponse = () => {
    const newArr: any[] = [];
    Object.keys(ApiModel.swagger.responses).forEach((key) => {
      const refUrl = ObjectFindValue('$ref', ApiModel.swagger.responses[key]);
      const entityName = refUrl.split('/').pop();

      newArr.push({
        code: key,
        description: ApiModel.swagger.responses[key].description,
        schema: key !== '400' ? entityName : '',
        entityName: entityName,
        result: key !== '400' ? getResult(entityName) : {},
      });
    });
    setResponseData(newArr);
  };

  useEffect(() => {
    if (ApiModel.swagger.parameters) {
      const params = ApiModel.swagger.parameters.map((item: any) => {
        return {
          name: item.name,
          required: item.required,
          type: item.schema.type,
          description: item.description,
          method: item.in,
        };
      });
      ApiModel.debugger.params = params;
      setDataSource(params);
    }
    if (ApiModel.swagger.requestBody) {
      ApiModel.debugger.body = handleEntity(getEntity());
    }

    if (ApiModel.swagger.responses) {
      handleResponse();
    }
  }, []);

  return (
    <div className={'platforms-api-swagger-content'}>
      <div className={'swagger-content-title'}>{ApiModel.swagger.summary}</div>
      <div className={'swagger-content-url'}>
        <Input.Group compact>
          <Button className={classNames('url-method', ApiModel.swagger.method)}>
            {ApiModel.swagger.method ? ApiModel.swagger.method.toUpperCase() : ''}
          </Button>
          <Input
            style={{
              width: `calc(100% - ${ApiModel.swagger.method !== 'delete' ? '70px' : '80px'})`,
            }}
            value={ApiModel.swagger.url}
            readOnly
          />
        </Input.Group>
      </div>
      <div className={'swagger-content-item swagger-content-request-type'}>
        <span>请求数据类型</span>
        <span>
          {ApiModel.swagger.requestBody
            ? getContent(ApiModel.swagger.requestBody.content)
            : 'application/x-www-form-urlencoded'}
        </span>
        <span>响应数据类型</span>
        <span>{`["/"]`}</span>
      </div>
      {ApiModel.swagger.description && (
        <div className={'swagger-content-item'}>
          <TitleComponent data={'接口描述'} />
          <div> {ApiModel.swagger.description} </div>
        </div>
      )}
      {ApiModel.swagger.requestBody &&
        ApiModel.debugger.body &&
        !!Object.keys(ApiModel.debugger.body).length && (
          <div className={'swagger-content-item'}>
            <TitleComponent data={'请求示例'} />
            <div>
              {
                // @ts-ignore
                <ReactJson
                  displayObjectSize={false}
                  displayDataTypes={false}
                  name={false}
                  src={ApiModel.debugger.body}
                />
              }
            </div>
          </div>
        )}
      <div className={'swagger-content-item'}>
        <TitleComponent data={'请求参数'} />
        <Table
          pagination={false}
          size={'small'}
          columns={[
            { title: '参数名', dataIndex: 'name' },
            { title: '参数说明', dataIndex: 'description' },
            { title: '请求类型', dataIndex: 'method' },
            {
              title: '是否必须',
              dataIndex: 'required',
              render: (text) => <span>{`${!!text}`}</span>,
            },
            { title: '参数类型', dataIndex: 'type' },
          ]}
          dataSource={dataSource}
        />
      </div>
      <div className={'swagger-content-item'}>
        <TitleComponent data={'响应状态'} />
        <Table
          pagination={false}
          size={'small'}
          columns={[
            { title: '状态码', dataIndex: 'code' },
            { title: '说明', dataIndex: 'description' },
            { title: 'schema', dataIndex: 'schema' },
          ]}
          dataSource={responseData}
        />
      </div>
      <div className={'swagger-content-item'}>
        <Tabs>
          {responseData
            .filter((item) => item.code !== '400')
            .map((item) => {
              return (
                <Tabs.TabPane key={item.code} tab={item.code}>
                  <div>
                    <div>
                      <TitleComponent data={'响应参数'} style={{ margin: 0 }} />
                      <Table
                        pagination={false}
                        size={'small'}
                        columns={[
                          { title: '参数名称', dataIndex: 'code' },
                          { title: '参数说明', dataIndex: 'description' },
                          { title: '类型', dataIndex: 'type' },
                        ]}
                        dataSource={handleResponseParam(item.entityName)}
                      />
                    </div>
                    <div
                      style={{
                        padding: 1,
                        border: '1px solid #f0f0f0',
                        borderRadius: 2,
                        marginTop: 12,
                      }}
                    >
                      {
                        // @ts-ignore
                        <ReactJson
                          displayObjectSize={false}
                          displayDataTypes={false}
                          name={false}
                          src={item.result}
                        />
                      }
                    </div>
                  </div>
                </Tabs.TabPane>
              );
            })}
        </Tabs>
      </div>
    </div>
  );
});
