import { TitleComponent } from '@/components';
import ReactJson from 'react-json-view';
import { request } from 'umi';
import MonacoEditor from 'react-monaco-editor';
import { Button, Input } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createSchemaField, FormProvider, observer } from '@formily/react';
import { ApiModel } from '@/pages/system/Platforms/Api/base';
import { createForm } from '@formily/core';
import { ArrayTable, Editable, FormItem, Input as FormilyInput } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import SystemConst from '@/utils/const';
import classNames from 'classnames';

export default observer(() => {
  const [result, setResult] = useState({});
  const [body, setBody] = useState({});

  const editor: any = useRef(null);

  useEffect(() => {
    if (ApiModel.debugger.body && editor.current) {
      const { editor: MEditor } = editor.current;
      MEditor.setValue(JSON.stringify(ApiModel.debugger.body));
      setTimeout(() => {
        MEditor.getAction('editor.action.formatDocument').run();
      }, 300);
      // MEditor.trigger('anyString', 'editor.action.formatDocument');//自动格式化代码
      MEditor.setValue(MEditor.getValue());
    }
  }, [ApiModel.debugger, editor.current]);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Editable,
      Input: FormilyInput,
      ArrayTable,
    },
  });

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
      }),
    [],
  );

  const onSearch = useCallback(async () => {
    const formData: any = await form.submit();
    console.log(formData);
    let newUrl = ApiModel.swagger.url;
    if (formData && formData.params && formData.params.length) {
      const params = formData.params;
      params.forEach((item: any) => {
        if (newUrl.includes(`{${item.name}}`)) {
          newUrl = newUrl.replace(`{${item.name}}`, item.values);
        }
      });
      console.log(newUrl);
    }

    // 判断请求类型
    const method = ApiModel.swagger.method && ApiModel.swagger.method.toUpperCase();
    let options = {};
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      options = {
        method,
        data: body || {},
      };
    } else if (['GET', 'DELETE'].includes(method)) {
      options = {
        method,
        params: body || {},
      };
    }

    request(`/${SystemConst.API_BASE}${newUrl}`, options).then((resp) => {
      if (resp.status === 200) {
        setResult(resp);
      } else {
        resp
          .clone()
          .text()
          .then((res: string) => {
            if (res) {
              setResult(JSON.parse(res));
            } else {
              resp
                .clone()
                .json()
                .then((res2: any) => {
                  setResult(res2);
                });
            }
          });
      }
    });
  }, [body]);

  useEffect(() => {
    if (form && ApiModel.debugger && ApiModel.debugger.params) {
      const arr = ApiModel.debugger.params.map((item: any) => {
        return {
          name: item.name,
          values: '',
        };
      });
      form.setValues({ params: arr });
    }
  }, [form, ApiModel.debugger]);

  const schema: ISchema = {
    type: 'object',
    properties: {
      params: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          pagination: { pageSize: 10 },
          scroll: { x: '100%' },
        },
        items: {
          type: 'object',
          properties: {
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '参数名称' },
              properties: {
                name: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  required: true,
                },
              },
            },
            column2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '参数值' },
              properties: {
                values: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  required: true,
                },
              },
            },
            column6: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '操作',
                dataIndex: 'operations',
                width: 100,
                fixed: 'right',
                align: 'center',
              },
              properties: {
                item: {
                  type: 'void',
                  'x-component': 'FormItem',
                  properties: {
                    remove: {
                      type: 'void',
                      'x-component': 'ArrayTable.Remove',
                    },
                  },
                },
              },
            },
          },
        },
        properties: {
          add: {
            type: 'void',
            'x-component': 'ArrayTable.Addition',
            title: '新增',
          },
        },
      },
    },
  };

  return (
    <div className={'platforms-api-swagger-content'}>
      <div className={'swagger-content-title'}>{ApiModel.swagger.summary}</div>
      <div className={'swagger-content-url'}>
        <Input.Group compact>
          <Button className={classNames('url-method', ApiModel.swagger.method)}>
            {ApiModel.swagger.method ? ApiModel.swagger.method.toUpperCase() : ''}
          </Button>
          <Input
            allowClear
            style={{
              width: `calc(100% - ${ApiModel.swagger.method !== 'delete' ? '140px' : '150px'})`,
            }}
            value={ApiModel.swagger.url}
          />
          <Button type="primary" onClick={onSearch}>
            发送
          </Button>
        </Input.Group>
      </div>
      <div className={'swagger-content-item'}>
        <TitleComponent data={'请求参数'} />
        <div>
          {ApiModel.debugger.params && (
            <FormProvider form={form}>
              <SchemaField schema={schema} />
            </FormProvider>
          )}
          {ApiModel.debugger.body && (
            <MonacoEditor
              height={200}
              language={'json'}
              theme={'dark'}
              ref={editor}
              onChange={(value) => {
                try {
                  setBody(JSON.parse(value));
                } catch (e) {
                  console.warn(e);
                }
              }}
              editorDidMount={(_editor) => {
                _editor.getAction('editor.action.formatDocument').run();
              }}
            />
          )}
        </div>
      </div>
      <div className={'swagger-content-item'}>
        <TitleComponent data={'响应内容'} />
        <div>
          {
            // @ts-ignore
            <ReactJson
              displayObjectSize={false}
              displayDataTypes={false}
              name={false}
              src={result}
            />
          }
        </div>
      </div>
    </div>
  );
});
