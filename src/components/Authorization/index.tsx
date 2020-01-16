import { Button, Checkbox, Drawer, Form, Input, Select, Table, message, } from "antd";
import React, { Fragment, useState, useEffect } from "react";
import apis from "@/services";
import { DimensionsItem, DimensionType } from "@/pages/system/dimensions/data";
import { groupBy } from "lodash";
import { FormComponentProps } from "antd/es/form";
import styles from './index.less';
import DataAccess from "./DataAccess";
import encodeQueryParam from "@/utils/encodeParam";

interface Props extends FormComponentProps {
  close: Function,
  target?: any,
  targetType?: string,
}

interface State {
  dataAccessVisible: boolean;
  permissionList: any[];
  checkPermission: any;
  permissionType: string;
  searchText: string;
  dimensionList: any[];
  targetAutz: any[];
  tempAccess: any[];
}
const Authorization: React.FC<Props> = (props) => {

  const initState: State = {
    dataAccessVisible: false,
    permissionList: [],
    checkPermission: {},
    permissionType: 'all',
    searchText: '',
    dimensionList: [],
    targetAutz: [],
    tempAccess: []
  }
  const [permissionList, setPermissionList] = useState(initState.permissionList);
  const [dataAccessVisible, setDataAccessVisible] = useState(initState.dataAccessVisible);
  const [checkPermission, setCheckPermission] = useState(initState.checkPermission);
  const [permissionType, setPermissionType] = useState(initState.permissionType);
  const [searchText, setSearchText] = useState(initState.searchText);
  const [dimensionList, setDimensionList] = useState(initState.dimensionList);
  const [targetAutz, setTargetAutz] = useState(initState.targetAutz);
  const [tempAccess, setTempAccess] = useState(initState.tempAccess);

  const { form: { getFieldDecorator }, form } = props;

  useEffect(() => {
    apis.permission.listNoPaging().then(response => {
      if (response.status === 200) {
        const temp: any[] = response.result;
        const list = temp.filter(item => (item.actions || []).length > 0);
        setPermissionList(list);
      }
    });
    if (props.target.targetId) {
      apis.authorization.list(encodeQueryParam({
        'paging': false,
        'terms': {
          'dimensionTarget': props.target.targetId
        }
      })).then(response => {
        if (response.status === 200) {
          setTargetAutz(response.result);
        }
      })
    }

    // apis.authorization.autzDetail({ type: props.targetType, id: props.targetId }).then(response => {
    //   console.log(response, 'response');
    // })
    getDimensions();
  }, []);

  const getDimensions = () => {
    apis.dimensions.typeList().then(e => {
      if (e && e.status === 200) {
        apis.dimensions.treeList().then(d => {
          if (d.status === 200) {
            const dimensionList = d.result.map((dr: DimensionsItem) => {
              let type = e.result.find((t: DimensionType) => t.id === dr.typeId);
              if (type) {
                let typeName = type.name;
                return { typeName, ...dr }
              }
              return dr;
            });
            setDimensionList(dimensionList);
          }
        });
      }
    });
  }
  const saveDataAccess = (data: any) => {
    //如果有，删除原数据
    let temp = tempAccess.filter(i => i.permissionId !== data.permissionId);
    //保存数据
    setTempAccess([...temp, data]);
    //字段权限
    //先创建Map
    let tempMap = new Map();
    let key = new Set();
    //遍历出所有操作
    let fieldAccess = data.fieldAccess;
    for (let item of fieldAccess) {
      for (let action of item.action) {
        key.add(action)
      }
    }
    //创建Map
    Array.from(key).forEach(i => tempMap.set(i, []));
    //赋值
    for (let item of fieldAccess) {
      for (let action of item.action) {
        let temp = tempMap.get(action);
        tempMap.set(action, [...temp, item.name])
      }
    }
    //构造数据结构
    let tempFiledAccess = [...tempMap.keys()].map(action => {
      return {
        action,
        type: 'DENY_FIELDS',
        describe: '不能操作的字段',
        config: {
          fields: tempMap.get(action)
        }
      }
    });

    //数据权限
    let dataAccess = data.dataAccess;
    let tempDataMap = new Map();
    let dataKey = new Set();
    for (let item of dataAccess) {
      for (const type of item.action) {
        dataKey.add(type);
      }
    }
    //
    Array.from(dataKey).forEach(i => tempDataMap.set(i, []));
    //赋值
    for (const item of dataAccess) {
      for (const action of item.action) {
        let temp = tempDataMap.get(action);
        tempDataMap.set(action, [...temp, item.type]);
      }
    }

    //构造数据结构
    let tempDataAccess = [...tempDataMap.keys()].map(action => {
      return {
        action,
        type: 'DIMENSION_SCOPE',
        config: {
          scopeType: tempDataMap.get(action).join(','),
          children: true
        }
      }
    });

    //修改数据
    const update = targetAutz.find(i => i.permission === data.permissionId);
    update.dataAccesses = [...tempFiledAccess, ...tempDataAccess];
    //删除修改的数据。
    let tempAutz = targetAutz.filter(i => i.permission !== data.permissionId);
    setTargetAutz([...tempAutz, update]);
    message.success('保存成功');
    // autzSetting(data)
    //TODO 此处调用接口保存数据
  }

  const autzSetting = () => {

    // console.log(tempAccess, form.getFieldsValue(), 'list');
    const { permissions } = form.getFieldsValue();
    // console.log(permissions, 'perim');
    let tempAutz: any[] = [];
    for (const key in permissions) {
      if (permissions.hasOwnProperty(key)) {
        const element = permissions[key];
        if (element) {
          const access = tempAccess.find(i => i.permissionId === key);
          tempAutz.push({ id: key, actions: element, ...access })
        }
      }
    }
    apis.authorization.saveAutz({
      targetId: props.target.id,
      targetType: props.targetType,
      permissionList: tempAutz
    }).then(response => {
      if (response.status === 200) {
        message.success('授权成功');
      }
    });
    // console.log({
    //   targetId: props.targetId,
    //   targetType: props.targetType,
    //   permissionList: tempAutz
    // }, 'auzt');
    // console.log(authorization, 'logs');
    // let tempAutz = {
    //   targetId: authorization.autz.dimensionTarget,
    //   targetType: 'user',
    //   permisionList: [

    //   ]
    // }
    // let tempAutz = {
    //   permission: authorization.id,
    //   dimensionType: props.targetType,
    //   dimensionTypeName: '用户',
    //   dimensionTarget: props.targetId,
    //   dimensionTargetName: '用户名',
    //   state: 1,
    //   actions: (authorization.actions || []).map((i: any) => i.action),
    //   id: 'test',
    //   merge: true,
    //   dataAccesses: (authorization.fieldAccess || []).map((i: any) => {
    //     return {
    //       action: i.name,
    //       type: 'DENY_FIELDS',
    //       describe: '不能操作字段',
    //       config: {

    //       }
    //     }
    //   })
    // }
  }

  return (
    <Drawer
      title='授权'
      visible
      width={'50VW'}
      onClose={() => props.close()}
    >
      <Form>
        <Form.Item label="被授权主体">
          {
            getFieldDecorator('targetId', {
              rules: [{ required: true }],
              initialValue: props.target.id ? props.target.name : ''
            })(
              <Select mode="multiple" disabled={props.target.id}>
                {Array.from(new Set<string>(dimensionList.map((item: any) => item.typeName))).map((type, index) => {
                  const typeData = groupBy(dimensionList, item => item.typeName)[type];
                  return (
                    <Select.OptGroup label={type} key={index}>
                      {
                        typeData.map((e: any) => {
                          return <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>
                        })
                      }
                    </Select.OptGroup>
                  );
                })}
              </Select>
            )
          }

        </Form.Item>
        <Form.Item label="选择权限">
          <Input.Group compact style={{ marginBottom: '10px' }}>
            <Select style={{ width: '15%' }} defaultValue='all' onChange={(value: string) => setPermissionType(value)}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="default">默认</Select.Option>
              <Select.Option value="system">系统</Select.Option>
              <Select.Option value="biz">业务功能</Select.Option>
              <Select.Option value="open-api">OpenAPI</Select.Option>
            </Select>
            <Input.Search style={{ width: '85%' }} placeholder="请输入权限名称" onChange={(event) => { setSearchText(event.target.value) }} />
            {/* <Button type="primary" style={{ width: '5%' }}><Icon type='search' /></Button> */}
          </Input.Group>
          <Table
            rowKey={'id'}
            style={{ height: '65vh', overflow: 'auto' }}
            pagination={false}
            columns={[
              {
                dataIndex: 'name',
                title: '权限名称',
              },
              {
                dataIndex: 'actions',
                title: '权限操作',
                render: (text: { action: string, name: string }[], record: any) => {
                  const id = record.id;
                  const temp = targetAutz.find(item => item.permission === id) || {};
                  return (
                    <div className={styles.permissionForm}>
                      <Form.Item >
                        {getFieldDecorator(`permissions.${id}`, {
                          initialValue: temp.actions,
                        })(
                          <Checkbox.Group
                            options={
                              (text || []).
                                map((e: { action: string, name: string }) => {
                                  return { 'label': e.name, 'value': e.action }
                                })
                            }
                          />
                        )}
                      </Form.Item>
                    </div>

                  )
                }
              },
              {
                dataIndex: 'properties',
                title: '操作',
                render: (text, record: any) => {
                  const autz = targetAutz.find(item => item.permission === record.id);
                  return (
                    <Fragment>
                      {
                        (text && text.supportDataAccessTypes || [])
                          .some((i: string) => i === 'DENY_FIELDS') &&
                        <a onClick={() => {
                          setDataAccessVisible(true);
                          setCheckPermission({ ...record, autz })
                        }}>数据权限</a>
                      }
                    </Fragment>
                  )
                }
              }
            ]}
            dataSource={
              permissionType !== 'all' ?
                searchText.length > 0 ?
                  JSON.parse(JSON.stringify(permissionList))
                    .filter((item: any) => (item.properties || {}).type === permissionType)
                    .filter((item: any) => item.name.indexOf(searchText) > -1) :
                  JSON.parse(JSON.stringify(permissionList))
                    .filter((item: any) => (item.properties || {}).type === permissionType)
                : searchText.length > 0 ?
                  JSON.parse(JSON.stringify(permissionList))
                    .filter((item: any) => item.name.indexOf(searchText) > -1) :
                  permissionList}
          />
        </Form.Item>
      </Form>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={() => { props.close() }} style={{ marginRight: 8 }}>
          关闭
        </Button>
        <Button onClick={() => { autzSetting() }} type="primary">
          保存
        </Button>
      </div>
      {
        dataAccessVisible &&
        <DataAccess
          checkPermission={checkPermission}
          close={() => setDataAccessVisible(false)}
          save={(item: any) => {
            saveDataAccess(item);
          }}
        />
      }
    </Drawer>
  )
}
export default Form.create<Props>()(Authorization);
