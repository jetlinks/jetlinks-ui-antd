import { RadioCard, TitleComponent } from '@/components';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, FormButtonGroup, FormGrid, FormItem, Input } from '@formily/antd';
import { createForm, Field, onFieldReact, onFormInit } from '@formily/core';
import { createSchemaField, observer } from '@formily/react';
import { Button, Card, Col, Row } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'umi';
import { onlyMessage, useAsyncDataSource } from '@/utils/util';
import { service } from '../index';
import { useModel } from '@@/plugin-model/useModel';
import Doc from '../doc';

const Detail = observer(() => {
  const params = useParams<{ id: string }>();
  const { initialState } = useModel('@@initialState');
  const [docType, setDocType] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFormInit(async (form1) => {
            if (params.id === ':id') return;
            const resp = await service.detail(params.id);
            if (resp.status === 200) {
              form1.setValues(resp.result);
            }
          });
          onFieldReact('operatorName', (field) => {
            const value = (field as Field).value;
            setDocType(value);
            // console.log(value)
          });
        },
      }),
    [],
  );

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      Input,
      RadioCard,
    },
  });

  const schema: any = {
    type: 'object',
    properties: {
      operatorName: {
        title: '平台类型',
        'x-component': 'RadioCard',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 1,
        },
        default: params.id === ':id' ? 'onelink' : undefined,
        'x-component-props': {
          model: 'singular',
          itemStyle: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            minWidth: '130px',
          },
          options: [
            {
              label: '移动OneLink',
              value: 'onelink',
              imgUrl: require('/public/images/iot-card/onelink.png'),
              imgSize: [78, 20],
            },
            {
              label: '电信Ctwing',
              value: 'ctwing',
              imgUrl: require('/public/images/iot-card/ctwingcmp.png'),
              imgSize: [52, 25],
            },
            {
              label: '联通Unicom',
              value: 'unicom',
              imgUrl: require('/public/images/iot-card/unicom.png'),
              imgSize: [56, 41],
            },
          ],
        },
        'x-validator': [
          {
            required: true,
            message: '请选择类型',
          },
        ],
      },
      name: {
        type: 'string',
        title: '名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入名称',
        },
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
          {
            required: true,
            message: '请输入名称',
          },
        ],
      },
      onelink: {
        type: 'void',
        'x-reactions': {
          dependencies: ['.operatorName'],
          fulfill: {
            state: {
              visible: '{{$deps[0] ==="onelink"}}',
            },
          },
        },
        properties: {
          config: {
            type: 'object',
            properties: {
              appId: {
                type: 'string',
                title: 'App ID',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入App ID',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                  {
                    required: true,
                    message: '请输入App ID',
                  },
                ],
              },
              passWord: {
                type: 'string',
                title: 'Password',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入Password',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                  {
                    required: true,
                    message: '请输入App ID',
                  },
                ],
              },
              apiAddr: {
                type: 'string',
                title: '接口地址',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入接口地址',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                  {
                    required: true,
                    message: '请输入接口地址',
                  },
                ],
              },
            },
          },
        },
      },
      ctwing: {
        type: 'void',
        'x-reactions': {
          dependencies: ['.operatorName'],
          fulfill: {
            state: {
              visible: '{{$deps[0] ==="ctwing"}}',
            },
          },
        },

        properties: {
          config: {
            type: 'object',
            properties: {
              userId: {
                type: 'string',
                title: '用户id',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入用户id',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                  {
                    required: true,
                    message: '请输入用户id',
                  },
                ],
              },
              passWord: {
                type: 'string',
                title: 'Password',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入Password',
                },
                'x-validator': [
                  {
                    required: true,
                    message: '请输入Password',
                  },
                ],
              },
              secretKey: {
                type: 'string',
                title: 'secretKey',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入secretKey',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                  {
                    required: true,
                    message: '请输入secretKey',
                  },
                ],
              },
            },
          },
        },
      },
      unicom: {
        type: 'void',
        'x-reactions': {
          dependencies: ['.operatorName'],
          fulfill: {
            state: {
              visible: '{{$deps[0] ==="unicom"}}',
            },
          },
        },

        properties: {
          config: {
            type: 'object',
            properties: {
              appId: {
                type: 'string',
                title: 'App ID',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入App ID',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                  {
                    required: true,
                    message: '请输入App ID',
                  },
                ],
              },
              appSecret: {
                type: 'string',
                title: 'App Secret',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入App Secret',
                },
                'x-validator': [
                  {
                    required: true,
                    message: '请输入App Secret',
                  },
                ],
              },
              openId: {
                type: 'string',
                title: '创建者ID',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入创建者ID',
                },
                'x-validator': [
                  {
                    max: 64,
                    message: '最多可输入64个字符',
                  },
                  {
                    required: true,
                    message: '请输入创建者ID',
                  },
                ],
              },
            },
          },
        },
      },
      explain: {
        title: '说明',
        'x-component': 'Input.TextArea',
        'x-decorator': 'FormItem',
        'x-component-props': {
          rows: 3,
          showCount: true,
          maxLength: 200,
          placeholder: '请输入说明',
        },
        'x-validator': [
          {
            max: 200,
            message: '最多可输入200个字符',
          },
        ],
      },
    },
  };

  const handleSave = async () => {
    const data: any = await form.submit();
    setLoading(true);
    const res: any = params.id === ':id' ? await service.save(data) : await service.update(data);
    if (res.status === 200) {
      onlyMessage('保存成功');
      history.back();
    }
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      if (initialState?.settings?.title) {
        document.title = `物联卡 - ${initialState?.settings?.title}`;
      } else {
        document.title = '物联卡';
      }
    }, 0);
  }, []);

  return (
    <PageContainer>
      <Card>
        <Row gutter={24}>
          <Col span={14}>
            <TitleComponent data={'详情'} />
            <Form form={form} layout="vertical">
              <SchemaField
                schema={schema}
                scope={{
                  useAsyncDataSource,
                }}
              />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  <Button type="primary" onClick={() => handleSave()} loading={loading}>
                    保存
                  </Button>
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={10}>
            <Doc type={docType} />
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
});

export default Detail;
