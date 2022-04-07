import { PageContainer } from '@ant-design/pro-layout';
import { createForm, onFieldValueChange } from '@formily/core';
import { Card, Col, Input, Row } from 'antd';
import { ISchema } from '@formily/json-schema';
import { useMemo } from 'react';
import { createSchemaField } from '@formily/react';
import { FormButtonGroup, FormItem, Select, Submit, Switch, Form } from '@formily/antd';
import styles from './index.less';
import { service } from '@/pages/notice/Config';
import { useAsyncDataSource } from '@/utils/util';
import { useParams } from 'umi';
import { typeList } from '@/pages/notice';

const Detail = () => {
  const { id } = useParams<{ id: string }>();

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFieldValueChange('type', async (field, f) => {
            const type = field.value;
            if (!type) return;
            f.setFieldState('provider', (state) => {
              state.value = undefined;
              // state.dataSource = providerRef.current
              //   .find((item) => type === item.id)
              //   ?.providerInfos.map((i) => ({ label: i.name, value: i.id }));
            });
          });
          onFieldValueChange('provider', async () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            // currentType = field.value;
            // await createSchema();
          });
        },
      }),
    [id],
  );

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Switch,
    },
  });

  const getTypes = async () =>
    service.getTypes().then((resp) => {
      return resp.result.map((item: NetworkType) => ({
        label: item.name,
        value: item.id,
      }));
    });

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        title: '名称',
        'x-component': 'Input',
        'x-decorator': 'FormItem',
      },
      type: {
        title: '分类',
        'x-component': 'Input',
        'x-value': id,
      },
      provider: {
        title: '类型',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {
          optionType: 'button',
        },
        required: true,
        'x-visible': typeList[id]?.length > 0,
        enum: typeList[id] || [],
      },
      configuration: {
        type: 'object',
        properties: {
          weixin: {
            type: 'void',
            properties: {
              corpId: {
                title: 'corpID',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 企业消息
              },
              corpSecret: {
                title: 'corpSecret',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 企业消息
              },
              AppId: {
                title: 'appId',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 服务号
              },
              AppSecret: {
                title: 'appSecret',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 服务号
              },
            },
          },
          dingTalk: {
            type: 'void',
            properties: {
              AppKey: {
                title: 'AppKey',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 钉钉消息通知
              },
              AppSecret: {
                title: 'AppSecret',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 钉钉消息通知
              },
              Webhook: {
                title: 'webHook',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                // 群机器人
              },
            },
          },
          // 阿里云语音/短信
          voiceOrSms: {
            type: 'void',
            properties: {
              RegionId: {
                title: 'regionId',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              AccessKeyId: {
                title: 'accessKeyId',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              Secret: {
                title: 'secret',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
            },
          },
          email: {
            type: 'void',
            properties: {
              host: {
                title: '服务器地址',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              port: {
                title: '端口',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              enableSSL: {
                title: '开启SSL',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              sender: {
                title: '发件人',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              username: {
                title: '用户名',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              password: {
                title: '密码',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
            },
          },
        },
      },
    },
  };

  return (
    <PageContainer>
      <Card>
        <Row>
          <Col span={10}>
            <Form className={styles.form} form={form} layout={'vertical'}>
              <SchemaField scope={{ useAsyncDataSource, getTypes }} schema={schema} />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  <Submit>保存</Submit>
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={12} push={2}>
            结果
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Detail;
