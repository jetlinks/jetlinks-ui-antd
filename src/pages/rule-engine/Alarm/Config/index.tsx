import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Row } from 'antd';
import TitleComponent from '@/components/TitleComponent';
import { createSchemaField } from '@formily/react';
import { ArrayItems, Form, FormButtonGroup, FormGrid, FormItem, Input } from '@formily/antd';
import { ISchema } from '@formily/json-schema';
import { useMemo, useState } from 'react';
import { createForm } from '@formily/core';

const Config = () => {
  const [tab, setTab] = useState<'io' | 'config' | string>('config');
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      ArrayItems,
      FormGrid,
    },
  });

  const form = useMemo(() => createForm({}), []);
  const schema1: ISchema = {
    type: 'object',
    properties: {
      level: {
        type: 'array',
        'x-component': 'ArrayItems',
        'x-decorator': 'FormItem',
        items: {
          type: 'void',
          'x-decorator': 'FormGrid',
          'x-decorator-props': {
            maxColumns: 24,
            minColumns: 24,
            columnGap: 2,
          },
          properties: {
            index: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-component': 'ArrayItems.Index',
              title: '级别',
              'x-decorator-props': {
                gridSpan: 24,
              },
            },
            input: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-decorator-props': {
                gridSpan: 22,
              },
            },
            remove: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-component': 'ArrayItems.Remove',
              'x-decorator-props': {
                gridSpan: 1,
              },
            },
          },
        },
        properties: {
          add: {
            type: 'void',
            title: '添加级别',
            'x-component': 'ArrayItems.Addition',
          },
        },
      },
    },
  };

  const schema2: ISchema = {
    type: 'object',
    properties: {
      kafka: {
        title: 'kafka地址',
        type: 'string',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      topic: {
        title: 'topic',
        type: 'string',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      layout2: {
        type: 'void',
        'x-decorator': 'FormGrid',
        'x-decorator-props': {
          maxColumns: 2,
          minColumns: 2,
          columnGap: 24,
        },
        properties: {
          username: {
            title: '用户名',
            type: 'string',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 1,
            },
          },
          password: {
            title: '密码',
            type: 'string',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 1,
            },
          },
        },
      },
    },
  };

  const level = (
    <Card>
      <TitleComponent data="告警级别配置" />
      <Form form={form}>
        <SchemaField schema={schema1} />
        <FormButtonGroup.Sticky>
          <FormButtonGroup.FormItem>
            <Button type="primary" onClick={() => {}}>
              保存
            </Button>
          </FormButtonGroup.FormItem>
        </FormButtonGroup.Sticky>
      </Form>
    </Card>
  );

  const io = (
    <Card>
      <TitleComponent data="告警数据输出" />
      <Form form={form} layout="vertical">
        <SchemaField schema={schema2} />
      </Form>
      <TitleComponent data="告警处理结果输入" />
      <Form form={form} layout="vertical">
        <SchemaField schema={schema2} />
        <FormButtonGroup.Sticky>
          <FormButtonGroup.FormItem>
            <Button type="primary" onClick={() => {}}>
              保存
            </Button>
          </FormButtonGroup.FormItem>
        </FormButtonGroup.Sticky>
      </Form>
    </Card>
  );

  const list = [
    { key: 'config', tab: '告警级别', component: level },
    { key: 'io', tab: '数据流转', component: io },
  ];

  return (
    <PageContainer onTabChange={setTab} tabActiveKey={tab} tabList={list}>
      <Row>
        <Col span={16}>{list.find((k) => k.key === tab)?.component}</Col>
        <Col span={8}></Col>
      </Row>
    </PageContainer>
  );
};
export default Config;
