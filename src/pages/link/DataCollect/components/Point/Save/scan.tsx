import { Button, Col, Modal, Row, Spin, Tree, Checkbox } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import service from '@/pages/link/DataCollect/service';
import './scan.less';
import { onlyMessage } from '@/utils/util';
import { createSchemaField, FormProvider } from '@formily/react';
import { ArrayTable, FormItem, Input } from '@formily/antd';
import MyInput from '@/pages/link/DataCollect/components/Point/Save/components/MyInput';
import MySelect from '@/pages/link/DataCollect/components/Point/Save/components/MySelect';
import {
  createForm,
  Field,
  FormPath,
  onFieldValueChange,
  registerValidateRules,
} from '@formily/core';
import RemoveData from './components/RemoveData';

interface Props {
  collector?: any;
  close: () => void;
  reload: () => void;
  data: any[];
}

export default (props: Props) => {
  const [checkedKeys, setCheckedKeys] = useState<any>();
  const [treeData, setTreeData] = useState<any[]>([]);
  const [treeAllData, setTreeAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [selectKeys, setSelectKeys] = useState<any[]>([]);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    setSelectKeys(props.data.map((item) => item.pointKey));
  }, [props.data]);

  useEffect(() => {
    if (props.collector?.channelId) {
      setLoading(true);
      service
        .scanOpcUAList({
          id: props.collector?.channelId,
        })
        .then((resp) => {
          if (resp.status === 200) {
            const list = resp.result.map((item: any) => {
              return {
                ...item,
                key: item.id,
                title: item.name,
                disabled: item?.folder,
              };
            });
            setTreeAllData(list);
          }
          setLoading(false);
        });
    }
  }, [props.collector?.channelId]);

  const updateTreeData = (list: any[], key: string, children: any[]): any[] => {
    const arr = list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node?.children && node.children.length) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
    return arr;
  };

  const onLoadData = (node: any) =>
    new Promise<void>(async (resolve) => {
      if ((node?.children && node.children?.length) || !node?.folder) {
        resolve();
        return;
      }
      const resp = await service.scanOpcUAList({
        id: props.collector?.channelId,
        nodeId: node.key,
      });
      if (resp.status === 200) {
        const list = resp.result.map((item: any) => {
          return {
            ...item,
            key: item.id,
            title: item.name,
            disabled: item?.folder,
            isLeaf: !item?.folder,
          };
        });
        setTreeAllData((origin) => updateTreeData(origin, node.key, [...list]));
      }
      resolve();
    });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      ArrayTable,
      MyInput,
      MySelect,
      RemoveData,
    },
  });

  const form = useMemo(
    () =>
      createForm({
        initialValues: { array: [] },
        effects: () => {
          onFieldValueChange('array.*.accessModes', (field, f) => {
            const nextPath = FormPath.transform(field.path, /\d+/, (index) => {
              return `array.${parseInt(index + 1)}.accessModes`;
            });
            const nextValue = (field.query(nextPath).take() as Field)?.value;
            if (nextValue && nextValue.check) {
              f.setFieldState(nextPath, (state) => {
                state.value = {
                  ...field.value,
                  check: nextValue.check,
                };
              });
            }
          });
          onFieldValueChange('array.*.configuration.interval', (field, f) => {
            const nextPath = FormPath.transform(field.path, /\d+/, (index) => {
              return `array.${parseInt(index + 1)}.configuration.interval`;
            });
            const nextValue = (field.query(nextPath).take() as Field)?.value;
            if (nextValue && nextValue.check) {
              f.setFieldState(nextPath, (state) => {
                state.value = {
                  ...field.value,
                  check: nextValue.check,
                };
              });
            }
          });
          onFieldValueChange('array.*.features', (field, f) => {
            const nextPath = FormPath.transform(field.path, /\d+/, (index) => {
              return `array.${parseInt(index + 1)}.features`;
            });
            const nextValue = (field.query(nextPath).take() as Field)?.value;
            if (nextValue && nextValue.check) {
              f.setFieldState(nextPath, (state) => {
                state.value = {
                  ...field.value,
                  check: nextValue.check,
                };
              });
            }
          });
        },
      }),
    [],
  );

  registerValidateRules({
    checkLength(value) {
      if (String(value.value).length > 64) {
        return {
          type: 'error',
          message: '最多可输入64个字符',
        };
      }
      if (!(Number(value.value) % 1 === 0) || Number(value.value) < 0) {
        return {
          type: 'error',
          message: '请输入正整数',
        };
      }
      return '';
    },
    checkAccessModes(value) {
      if (value?.value && value?.value.length) {
        return '';
      } else {
        return {
          type: 'error',
          message: '请选择访问类型',
        };
      }
    },
  });

  const schema = {
    type: 'object',
    properties: {
      array: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          // pagination: { pageSize: 10 },
          scroll: { x: '100%' },
        },
        items: {
          type: 'object',
          properties: {
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '名称' },
              properties: {
                name: {
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入点位名称',
                  },
                  'x-validator': [
                    {
                      required: true,
                      message: '请输入点位名称',
                    },
                    {
                      max: 64,
                      message: '最多可输入64个字符',
                    },
                  ],
                },
              },
            },
            column2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: 'nodeId' },
              properties: {
                'configuration.nodeId': {
                  type: 'string',
                  'x-component': 'Input',
                  'x-component-props': {
                    readOnly: true,
                  },
                },
              },
            },
            column3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '访问类型' },
              properties: {
                accessModes: {
                  'x-component': 'MySelect',
                  'x-component-props': {
                    placeholder: '请选择访问类型',
                    mode: 'multiple',
                    options: [
                      { label: '读', value: 'read' },
                      { label: '写', value: 'write' },
                      { label: '订阅', value: 'subscribe' },
                    ],
                  },
                  'x-validator': [
                    {
                      checkAccessModes: true,
                    },
                  ],
                },
              },
            },
            column4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '采集频率' },
              properties: {
                'configuration.interval': {
                  'x-decorator': 'FormItem',
                  'x-component': 'MyInput',
                  'x-component-props': {
                    placeholder: '请输入采集频率',
                  },
                  'x-validator': [
                    {
                      checkLength: true,
                    },
                  ],
                },
              },
            },
            column5: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '只推送变化的数据' },
              properties: {
                features: {
                  'x-decorator': 'FormItem',
                  'x-component': 'MySelect',
                  'x-component-props': {
                    options: [
                      {
                        label: '是',
                        value: true,
                      },
                      {
                        label: '否',
                        value: false,
                      },
                    ],
                  },
                },
              },
            },
            column6: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '操作',
                dataIndex: 'operations',
                width: 50,
              },
              properties: {
                item: {
                  type: 'void',
                  'x-component': 'FormItem',
                  properties: {
                    remove: {
                      type: 'number',
                      'x-component': 'RemoveData',
                      'x-component-props': {
                        onDelete: (item: any) => {
                          setCheckedKeys({
                            ...checkedKeys,
                            checked: checkedKeys.checked.filter((i: any) => {
                              return i !== item.id;
                            }),
                          });
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const handleData = (arr: any[]): any[] => {
    const data = arr.filter((item) => {
      return (isSelected && !selectKeys.includes(item.id)) || !isSelected;
    });
    return data.map((item) => {
      if (item.children && item.children?.length) {
        return {
          ...item,
          children: handleData(item.children),
        };
      } else {
        return item;
      }
    });
  };

  useEffect(() => {
    if (isSelected) {
      const arr = handleData(treeAllData);
      setTreeData(arr);
    } else {
      setTreeData(treeAllData);
    }
  }, [isSelected, treeAllData]);

  return (
    <Modal
      title={'扫描'}
      maskClosable={false}
      visible
      onCancel={props.close}
      width={1300}
      footer={[
        <Button key={1} onClick={props.close}>
          取消
        </Button>,
        <Button
          type="primary"
          key={2}
          loading={spinning}
          onClick={async () => {
            const data = await form.submit<any>();
            const arr = data?.array || [];
            if (!arr.length) {
              onlyMessage('请选择目标数据', 'error');
              return;
            }
            const list = arr.map((item: any) => {
              return {
                name: item.name,
                provider: 'OPC_UA',
                collectorId: props.collector?.id,
                collectorName: props.collector?.name,
                pointKey: item.id,
                configuration: {
                  interval: item.configuration?.interval?.value,
                },
                features: !item.features?.value ? [] : ['changedOnly'],
                accessModes: item.accessModes?.value || [],
              };
            });
            setSpinning(true);
            const resp = await service.savePointBatch([...list]);
            if (resp.status === 200) {
              onlyMessage('操作成功');
              props.reload();
            }
            setSpinning(false);
          }}
        >
          确定
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Row gutter={24}>
          <Col span={6}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>数据源</h4>
              <Checkbox
                checked={isSelected}
                onChange={(e) => {
                  setIsSelected(e.target.checked);
                }}
              >
                隐藏已有节点
              </Checkbox>
            </div>
            <div style={{ padding: '10px 0' }}>
              <Tree
                blockNode
                checkable
                checkStrictly
                checkedKeys={checkedKeys}
                height={500}
                treeData={treeData}
                loadData={onLoadData}
                onCheck={(checkedKeysValue, info) => {
                  setCheckedKeys(checkedKeysValue);
                  const one: any = { ...info.node };
                  const list = form.getState().values?.array || [];
                  if (info.checked) {
                    const last: any = list.length ? list[list.length - 1] : undefined;
                    if (list.map((i: any) => i?.id).includes(one.id)) {
                      return;
                    }
                    const item = {
                      features: {
                        value: last
                          ? last?.features?.value
                          : (one?.features || []).includes('changedOnly'),
                        check: true,
                      },
                      id: one?.id || '',
                      name: one?.name || '',
                      accessModes: {
                        value: last ? last?.accessModes?.value : one?.accessModes || [],
                        check: true,
                      },
                      configuration: {
                        ...one?.configuration,
                        interval: {
                          value: last
                            ? last?.configuration?.interval?.value
                            : one?.configuration?.interval || 3000,
                          check: true,
                        },
                        nodeId: one?.id,
                      },
                    };
                    form.setValues({
                      array: [...list, item],
                    });
                  } else {
                    form.setValues({
                      array: list.filter((item: any) => item?.id !== one.id),
                    });
                  }
                }}
                titleRender={(nodeData) => {
                  return (
                    <div style={{ color: selectKeys.includes(nodeData.key) ? '#1d39c4' : 'black' }}>
                      {nodeData.name}
                    </div>
                  );
                }}
              />
            </div>
          </Col>
          <Col span={18}>
            <div>
              <FormProvider form={form}>
                <SchemaField schema={schema} />
              </FormProvider>
            </div>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};
