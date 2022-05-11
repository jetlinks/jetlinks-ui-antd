import { TitleComponent } from '@/components';
import { PageContainer } from '@ant-design/pro-layout';
import {
  ArrayItems,
  Form,
  FormButtonGroup,
  FormGrid,
  FormItem,
  Input,
  Select,
  Submit,
  ArrayCollapse,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Card, Col, Row, Image } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'umi';
import './index.less';

const Detail = () => {
  const params = useParams<{ id: string }>();

  const form = createForm({
    validateFirst: true,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      Input,
      Select,
      ArrayItems,
      ArrayCollapse,
    },
  });

  const schema = {
    type: 'object',
    properties: {
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
        ],
      },
      address: {
        type: 'string',
        title: '服务地址',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: '请选择服务地址',
        },
        'x-decorator-props': {
          tooltip: '阿里云内部给每台机器设置的唯一编号',
        },
      },
      accessKey: {
        type: 'string',
        title: 'accessKey',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入accessKey',
        },
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
        ],
        'x-decorator-props': {
          tooltip: '用于程序通知方式调用云服务API的用户标识',
        },
      },
      accessSecret: {
        type: 'string',
        title: 'accessSecret',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入accessSecret',
        },
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
        ],
        'x-decorator-props': {
          tooltip: '用于程序通知方式调用云服务费API的秘钥标识',
        },
      },
      network: {
        type: 'string',
        title: '网桥产品',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: '请选择网桥产品',
        },
        'x-decorator-props': {
          tooltip: '物联网平台对应的阿里云产品',
        },
      },
      array: {
        type: 'array',
        'x-component': 'ArrayCollapse',
        title: '产品映射',
        items: {
          type: 'object',
          'x-component': 'ArrayCollapse.CollapsePanel',
          'x-component-props': {
            header: '产品映射',
          },
          properties: {
            grid: {
              type: 'void',
              'x-component': 'FormGrid',
              'x-component-props': {
                minColumns: [24],
                maxColumns: [24],
              },
              properties: {
                product1: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  title: '阿里云产品',
                  required: true,
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '请选择阿里云产品',
                  },
                  'x-decorator-props': {
                    gridSpan: 12,
                    tooltip: '阿里云物联网平台产品标识',
                  },
                },
                product2: {
                  type: 'string',
                  title: '平台产品',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-decorator-props': {
                    gridSpan: 12,
                  },
                  'x-component-props': {
                    placeholder: '请选择平台产品',
                  },
                },
              },
            },
            remove: {
              type: 'void',
              'x-component': 'ArrayCollapse.Remove',
            },
          },
        },
        properties: {
          addition: {
            type: 'void',
            title: '添加',
            'x-component': 'ArrayCollapse.Addition',
          },
        },
      },
      description: {
        title: '说明',
        'x-component': 'Input.TextArea',
        'x-decorator': 'FormItem',
        'x-component-props': {
          rows: 3,
          showCount: true,
          maxLength: 200,
          placeholder: '请输入说明',
        },
      },
    },
  };

  useEffect(() => {}, [params.id]);

  return (
    <PageContainer>
      <Card>
        <Row gutter={24}>
          <Col span={14}>
            <TitleComponent data={'基本信息'} />
            <Form form={form} layout="vertical" onAutoSubmit={console.log}>
              <SchemaField schema={schema} />
              <FormButtonGroup.FormItem>
                <Submit>保存</Submit>
              </FormButtonGroup.FormItem>
            </Form>
          </Col>
          <Col span={10}>
            <div className="doc">
              <div className="url">
                阿里云物联网平台：
                <a
                  style={{ wordBreak: 'break-all' }}
                  href="https://help.aliyun.com/document_detail/87368.html"
                >
                  https://help.aliyun.com/document_detail/87368.html
                </a>
              </div>
              <h1>1. 概述</h1>
              <div>
                在特定场景下，设备无法直接接入阿里云物联网平台时，您可先将设备接入物联网云平台，再使用阿里云“云云对接SDK”，快速构建桥接服务，搭建物联网平台与阿里云物联网平台的双向数据通道。
              </div>
              <div className={'image'}>
                <Image width="100%" src={require('/public/images/northbound/aliyun2.png')} />
              </div>
              <h1>2.配置说明</h1>
              <div>
                <h2> 1、服务地址</h2>
                <div>
                  阿里云内部给每台机器设置的唯一编号。请根据购买的阿里云服务器地址进行选择。
                </div>
                <h2> 2、AccesskeyID/Secret</h2>
                <div>
                  用于程序通知方式调用云服务费API的用户标识和秘钥获取路径：“阿里云管理控制台”--“用户头像”--“”--“AccessKey管理”--“查看”
                </div>
                <div className={'image'}>
                  <Image width="100%" src={require('/public/images/northbound/aliyun1.jpg')} />
                </div>
                <h2> 3. 网桥产品</h2>
                <div>
                  物联网平台对于阿里云物联网平台，是一个网关设备，需要映射到阿里云物联网平台的具体产品
                </div>
                <h2> 4. 产品映射</h2>
                <div>将阿里云物联网平台中的产品实例与物联网平台的产品实例进行关联</div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Detail;
