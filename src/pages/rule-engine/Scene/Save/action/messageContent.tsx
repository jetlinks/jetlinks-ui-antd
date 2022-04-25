import { Col, Form, Row, Select, Input, DatePicker, InputNumber } from 'antd';
import type { FormInstance } from 'antd';
import { ItemGroup, InputFile } from '@/pages/rule-engine/Scene/Save/components';
import { useEffect, useState } from 'react';
import { TriggerWayType } from '@/pages/rule-engine/Scene/Save/components/TriggerWay';

interface MessageContentProps {
  name: number;
  template?: any;
  form: FormInstance;
}

const rowGutter = 12;

const BuiltInSelectOptions = {
  [TriggerWayType.timing]: [
    { label: '设备名称', value: 'device-name' },
    { label: '设备ID', value: 'device-id' },
    { label: '产品名称', value: 'product-name' },
    { label: '产品ID', value: 'product-id' },
    { label: '系统时间', value: 'device-name' },
    { label: '设备名称', value: 'device-name' },
  ],
  [TriggerWayType.manual]: [],
  [TriggerWayType.device]: [],
};

export default (props: MessageContentProps) => {
  const [triggerType, setTriggerType] = useState('');

  useEffect(() => {
    const trigger = props.form.getFieldsValue([['trigger', 'type']]);
    if (trigger) {
      setTriggerType(trigger.type);
    }
  }, []);

  // const inputNodeByType = useCallback((data: any) => {
  //   const { actions } = props.form.getFieldsValue([['actions',props.name, 'notify']])
  //   console.log(actions);
  //   if (actions && actions[props.name].notify && actions[props.name].notify.variables) {
  //     const type = actions[props.name].notify.variables[data.id].type
  //
  //     if (type === 2) {
  //       return <Select options={BuiltInSelectOptions[triggerType] || []} style={{ width: '100%'}} />
  //     }
  //   }
  //
  //   switch (data.type) {
  //     case 'enum':
  //       return <Select placeholder={`请选择${data.name}`} style={{ width: '100%' }} />;
  //     case 'date':
  //       // @ts-ignore
  //       return <DatePicker style={{ width: '100%' }} format={data.format || 'YYYY-MM-DD HH:mm:ss'} />;
  //     case 'number':
  //       return <InputNumber placeholder={`请输入${data.name}`} style={{ width: '100%' }} />;
  //     case 'file':
  //       return <InputFile />;
  //     default:
  //       return <Input placeholder={`请输入${data.name}`} />;
  //   }
  // }, [triggerType]);

  return (
    <>
      {props.template && (
        <div className={'template-variable'}>
          {props.template.variableDefinitions ? (
            <Row gutter={rowGutter}>
              {props.template.variableDefinitions.map((item: any, index: number) => {
                return (
                  <Col span={12} key={`${item.id}_${index}`}>
                    <Form.Item label={item.name} style={{ margin: 0 }}>
                      <ItemGroup>
                        <Form.Item
                          name={[props.name, 'notify', 'variables', item.id, 'type']}
                          initialValue={'1'}
                        >
                          <Select
                            options={[
                              { label: '手动输入', value: '1' },
                              { label: '内置参数', value: '2' },
                            ]}
                            style={{ width: 120 }}
                          />
                        </Form.Item>
                        <Form.Item
                          name={[props.name, 'notify', 'variables', item.id, 'value']}
                          shouldUpdate={(prevValues, curValues) => {
                            const oldNotify = prevValues.actions[props.name].notify.variables;
                            const curNotify = curValues.actions[props.name].notify.variables;

                            if (oldNotify && curNotify) {
                              if (oldNotify[item.id] && curNotify[item.id]) {
                                return oldNotify[item.id].type !== curNotify[item.id].type;
                              }
                            }
                            return false;
                          }}
                        >
                          {() => {
                            const { actions } = props.form.getFieldsValue([
                              ['actions', props.name, 'notify'],
                            ]);
                            console.log(actions);
                            if (
                              actions &&
                              actions[props.name].notify &&
                              actions[props.name].notify.variables
                            ) {
                              const type = actions[props.name].notify.variables[item.id].type;

                              if (type === 2) {
                                return (
                                  <Select
                                    options={BuiltInSelectOptions[triggerType] || []}
                                    style={{ width: '100%' }}
                                  />
                                );
                              }
                            }

                            switch (item.type) {
                              case 'enum':
                                return (
                                  <Select
                                    placeholder={`请选择${item.name}`}
                                    style={{ width: '100%' }}
                                  />
                                );
                              case 'date':
                                // @ts-ignore
                                return (
                                  <DatePicker
                                    style={{ width: '100%' }}
                                    format={data.format || 'YYYY-MM-DD HH:mm:ss'}
                                  />
                                );
                              case 'number':
                                return (
                                  <InputNumber
                                    placeholder={`请输入${item.name}`}
                                    style={{ width: '100%' }}
                                  />
                                );
                              case 'file':
                                return <InputFile />;
                              default:
                                return <Input placeholder={`请输入${item.name}`} />;
                            }
                          }}
                        </Form.Item>
                      </ItemGroup>
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
          ) : null}
        </div>
      )}
    </>
  );
};
