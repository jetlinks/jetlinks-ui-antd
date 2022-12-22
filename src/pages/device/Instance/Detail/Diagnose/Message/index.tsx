import TitleComponent from '@/components/TitleComponent';
import './index.less';
import Dialog from './Dialog';
import { Badge, Button, Col, Row } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import { InstanceModel, service } from '@/pages/device/Instance';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs/operators';
import { Field } from '@formily/core';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import {
  ArrayTable,
  DatePicker as FDatePicker,
  FormItem,
  Input as FInput,
  NumberPicker,
  PreviewText,
  FormGrid,
  Select as FSelect,
} from '@formily/antd';
import { randomString } from '@/utils/util';
import Log from './Log';
import { DiagnoseStatusModel, messageStatusMap, messageStyleMap } from '../Status/model';
import { observer } from '@formily/reactive-react';
import DiagnoseForm from './form';
import { model } from '@formily/reactive';
import { Empty } from '@/components';
import _ from 'lodash';

export const DiagnoseMessageModel = model<{
  input: any;
  inputs: any[];
  data: any;
  _inputs: any;
}>({
  input: {},
  inputs: [],
  data: {
    type: 'function',
  },
  _inputs: {},
});

const Message = observer(() => {
  const [subscribeTopic] = useSendWebsocketMessage();
  const DiagnoseFormRef = useRef<{ save: any }>();
  const diagnoseRef = useRef<any>();

  const metadata = JSON.parse(InstanceModel.detail?.metadata || '{}');

  const subscribeLog = () => {
    const id = `device-debug-${InstanceModel.detail?.id}`;
    const topic = `/debug/device/${InstanceModel.detail?.id}/trace`;
    diagnoseRef.current = subscribeTopic!(id, topic, {})
      ?.pipe(map((res) => res.payload))
      .subscribe((payload: any) => {
        if (payload.type === 'log') {
          DiagnoseStatusModel.logList = [
            ...DiagnoseStatusModel.logList,
            {
              key: randomString(),
              ...payload,
            },
          ];
        } else {
          const data = { key: randomString(), ...payload };
          DiagnoseStatusModel.allDialogList.push(data);
          const flag = [...DiagnoseStatusModel.allDialogList]
            .filter(
              (i) =>
                i.traceId === data.traceId &&
                (data.downstream === i.downstream || data.upstream === i.upstream),
            )
            .every((item) => {
              return !item.error;
            });
          if (!data.upstream) {
            DiagnoseStatusModel.message.down = {
              text: !flag ? '下行消息通信异常' : '下行消息通信正常',
              status: !flag ? 'error' : 'success',
            };
          } else {
            DiagnoseStatusModel.message.up = {
              text: !flag ? '上行消息通信异常' : '上行消息通信正常',
              status: !flag ? 'error' : 'success',
            };
          }
          const list: any[] = _.cloneDeep(DiagnoseStatusModel.dialogList);
          const t = list.find(
            (item) =>
              item.traceId === data.traceId &&
              data.downstream === item.downstream &&
              data.upstream === item.upstream,
          );
          if (t) {
            const arr = list.map((item) => {
              if (item.traceId === data.traceId) {
                item.list.push(data);
              }
              return item;
            });
            DiagnoseStatusModel.dialogList = _.cloneDeep(arr);
          } else {
            list.push({
              key: randomString(),
              traceId: data.traceId,
              downstream: data.downstream,
              upstream: data.upstream,
              list: [data],
            });
            DiagnoseStatusModel.dialogList = _.cloneDeep(list);
          }
        }
        const chatBox = document.getElementById('dialog');
        if (chatBox) {
          chatBox.scrollTop = chatBox.scrollHeight;
        }
      });
  };

  useEffect(() => {
    if (DiagnoseStatusModel.state === 'success') {
      subscribeLog();
    }
    return () => {
      if (diagnoseRef.current) {
        diagnoseRef.current.unsubscribe();
      }
    };
  }, [DiagnoseStatusModel.state]);

  const _form = useMemo(
    () =>
      createForm({
        initialValues: DiagnoseMessageModel.data,
        effects() {
          onFieldValueChange('property', (field) => {
            const value = (field as Field).value;
            const valueType = (metadata?.properties || []).find((it: any) => it.id === value)
              ?.valueType?.type;
            const format = field.query('.propertyValue').take() as any;
            format.setValue('');
            switch (valueType) {
              case 'date':
                format.setComponent(FDatePicker);
                format.setComponentProps({
                  placeholder: '请选择',
                });
                break;
              case 'boolean':
                format.setComponent(FSelect);
                format.setDataSource([
                  { label: '是', value: true },
                  { label: '否', value: false },
                ]);
                format.setComponentProps({
                  placeholder: '请选择',
                });
                break;
              case 'int':
              case 'long':
              case 'float':
              case 'double':
                format.setComponent(NumberPicker);
                format.setComponentProps({
                  placeholder: '请输入',
                });
                break;
              default:
                format.setComponent(FInput);
                format.setComponentProps({
                  placeholder: '请输入',
                });
                break;
            }
          });
          onFieldValueChange('function', (field) => {
            const value = (field as Field).value;
            // setInputs([]);
            // setInput({});
            DiagnoseMessageModel.inputs = [];
            DiagnoseMessageModel.input = {};
            if (value) {
              const data = (metadata?.functions || []).find((item: any) => item.id === value);
              // setInput(data);
              // setInputs(data?.inputs || []);
              DiagnoseMessageModel.inputs = data?.inputs || [];
              DiagnoseMessageModel.input = data;
            }
          });
        },
      }),
    [],
  );

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FInput,
      FormGrid,
      ArrayTable,
      PreviewText,
      FSelect,
      FDatePicker,
      NumberPicker,
    },
  });

  const _schema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          minColumns: [4],
        },
        properties: {
          type: {
            type: 'string',
            title: '',
            'x-decorator': 'FormItem',
            'x-component': 'FSelect',
            'x-component-props': {
              placeholder: '请选择',
            },
            enum: [
              { label: '调用功能', value: 'function' },
              { label: '操作属性', value: 'property' },
            ],
            'x-validator': [
              {
                required: true,
                message: '请选择',
              },
            ],
          },
          function: {
            type: 'string',
            title: '',
            'x-decorator': 'FormItem',
            'x-component': 'FSelect',
            'x-component-props': {
              placeholder: '请选择',
            },
            enum: (metadata?.functions || []).map((item: any) => {
              return { label: item.name, value: item.id };
            }),
            'x-validator': [
              {
                required: true,
                message: '请选择',
              },
            ],
            'x-reactions': [
              {
                dependencies: ['.type'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0] === "function"}}',
                  },
                },
              },
            ],
          },
          propertyType: {
            type: 'string',
            title: '',
            'x-decorator': 'FormItem',
            'x-component': 'FSelect',
            'x-component-props': {
              placeholder: '请选择',
            },
            enum: [
              { label: '读取属性', value: 'read' },
              { label: '设置属性', value: 'setting' },
            ],
            'x-validator': [
              {
                required: true,
                message: '请选择',
              },
            ],
            'x-reactions': [
              {
                dependencies: ['.type'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0] === "property"}}',
                  },
                },
              },
            ],
          },
          property: {
            type: 'string',
            title: '',
            'x-decorator': 'FormItem',
            'x-component': 'FSelect',
            'x-component-props': {
              placeholder: '请选择属性',
            },
            enum: (metadata?.properties || []).map((item: any) => {
              return { label: item.name, value: item.id };
            }),
            'x-validator': [
              {
                required: true,
                message: '请选择属性',
              },
            ],
            'x-reactions': [
              {
                dependencies: ['.type'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0] === "property"}}',
                  },
                },
              },
            ],
          },
          propertyValue: {
            type: 'string',
            title: '',
            'x-decorator': 'FormItem',
            'x-component': 'FInput',
            'x-validator': [
              {
                required: true,
                message: '改字段必填',
              },
            ],
            'x-reactions': [
              {
                dependencies: ['.property', 'propertyType'],
                fulfill: {
                  state: {
                    visible: '{{!!$deps[0] && $deps[1] === "setting"}}',
                  },
                },
              },
            ],
          },
        },
      },
    },
  };

  return (
    <Row gutter={24}>
      <Col span={16}>
        <div>
          <div style={{ marginBottom: 20 }}>
            <Row gutter={24}>
              {Object.keys(DiagnoseStatusModel.message).map((key) => {
                const obj = DiagnoseStatusModel.message[key];
                return (
                  <Col key={key} span={12}>
                    <div style={messageStyleMap.get(obj.status)} className="message-status">
                      <Badge status={messageStatusMap.get(obj.status)} style={{ marginRight: 5 }} />
                      {obj.text}
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
          <div>
            <TitleComponent data="调试" />
            <div className="content">
              <div className="dialog" id="dialog">
                {DiagnoseStatusModel.dialogList.map((item) => (
                  <Dialog data={item} key={item.key} />
                ))}
              </div>
            </div>
            <div className="function">
              <div className={'function-item'}>
                <div className={'function-item-form'}>
                  <FormProvider form={_form}>
                    <SchemaField schema={_schema} />
                  </FormProvider>
                </div>
                <Button
                  type="primary"
                  className={'function-item-btn'}
                  onClick={async () => {
                    const values = await _form.submit<any>();
                    DiagnoseMessageModel.data = values;
                    let _inputs = undefined;
                    if (DiagnoseMessageModel.inputs.length) {
                      _inputs = await DiagnoseFormRef.current?.save();
                      if (!_inputs) {
                        return;
                      }
                    }
                    if (values.type === 'function') {
                      const list = (_inputs?.data || []).filter((it: any) => !!it.value);
                      const obj = {};
                      list.map((it: any) => {
                        obj[it.id] = it.value;
                      });
                      await service.executeFunctions(
                        InstanceModel.detail?.id || '',
                        DiagnoseMessageModel?.input?.id,
                        {
                          ...obj,
                        },
                      );
                    } else {
                      if (values.propertyType === 'read') {
                        await service.readProperties(InstanceModel.detail?.id || '', [
                          values.property,
                        ]);
                      } else {
                        await service.settingProperties(InstanceModel.detail?.id || '', {
                          [values.property]: values.propertyValue,
                        });
                      }
                    }
                  }}
                >
                  发送
                </Button>
              </div>
              {DiagnoseMessageModel?.inputs?.length > 0 && (
                <div className="inputs-parameter">
                  <h4>功能参数</h4>
                  <DiagnoseForm data={DiagnoseMessageModel.inputs} ref={DiagnoseFormRef} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Col>
      <Col span={8}>
        <div
          style={{
            paddingLeft: 20,
            borderLeft: '1px solid rgba(0, 0, 0, .09)',
            overflow: 'hidden',
            maxHeight: 600,
            overflowY: 'auto',
            minHeight: 400,
          }}
        >
          <TitleComponent data={'日志'} />
          <div style={{ marginTop: 10 }}>
            {DiagnoseStatusModel.logList.length > 0 ? (
              DiagnoseStatusModel.logList.map((item) => <Log data={item} key={item.key} />)
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
});

export default Message;
