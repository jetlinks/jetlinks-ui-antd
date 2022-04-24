import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Divider, message, Row } from 'antd';
import TitleComponent from '@/components/TitleComponent';
import { createSchemaField } from '@formily/react';
import { ArrayItems, Form, FormButtonGroup, FormGrid, FormItem, Input } from '@formily/antd';
import { ISchema } from '@formily/json-schema';
import { useMemo, useState } from 'react';
import { createForm, onFieldReact, onFormInit } from '@formily/core';
import FLevelInput from '@/components/FLevelInput';
import { IOConfigItem } from '@/pages/rule-engine/Alarm/Config/typing';
import Service from '@/pages/rule-engine/Alarm/Config/service';

export const service = new Service('alarm/config');
const Config = () => {
  const [tab, setTab] = useState<'io' | 'config' | string>('config');
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      ArrayItems,
      FormGrid,
      FLevelInput,
    },
  });

  const levelForm = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFormInit(async (form) => {
            const resp: any = await service.queryLevel();
            if (resp.status === 200) {
              const _level = resp.result.levels.map(
                (item: { level: number; title: string }) => item.title,
              );
              form.setValuesIn('level', _level);
            }
          });
          onFieldReact('level.0.remove', (state, f1) => {
            state.setState({ display: 'none' });
            f1.setFieldState('level.add', (state1) => {
              const length = f1.values.level?.length;
              if (length > 4) {
                state1.display = 'none';
              } else {
                state1.display = 'visible';
              }
            });
          });
        },
      }),
    [],
  );

  const inputForm = useMemo(() => createForm(), []);
  const outputForm = useMemo(() => createForm(), []);

  const levelSchema: ISchema = {
    type: 'object',
    properties: {
      level: {
        type: 'array',
        'x-component': 'ArrayItems',
        'x-decorator': 'FormItem',
        maxItems: 5,
        items: {
          type: 'void',
          'x-decorator': 'FormGrid',
          'x-decorator-props': {
            maxColumns: 24,
            minColumns: 24,
            columnGap: 2,
          },
          properties: {
            input: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'FLevelInput',
              'x-decorator-props': {
                gridSpan: 23,
              },
            },
            remove: {
              type: 'void',
              title: <div style={{ width: '20px' }} />,
              'x-decorator': 'FormItem',
              'x-component': 'ArrayItems.Remove',
              'x-decorator-props': {
                gridSpan: 1,
              },
              'x-component-props': {
                style: { marginTop: '40px' },
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

  const ioSchema: ISchema = {
    type: 'object',
    properties: {
      kafka: {
        title: 'kafka地址',
        type: 'string',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入kafka地址',
        },
      },
      topic: {
        title: 'topic',
        type: 'string',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入topic',
        },
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
            'x-component-props': {
              placeholder: '请输入用户名',
            },
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
            'x-component-props': {
              placeholder: '请输入密码',
            },
          },
        },
      },
    },
  };

  const handleSaveIO = async () => {
    const inputConfig: IOConfigItem = await inputForm.submit();
    const outputConfig: IOConfigItem = await outputForm.submit();
    const inputResp = await service.saveOutputData({
      config: {
        type: 'kafka',
        config: inputConfig,
      },
      exchangeType: 'producer',
    });
    const outputResp = await service.saveOutputData({
      config: {
        type: 'kafka',
        config: outputConfig,
      },
      exchangeType: 'consume',
    });

    if (inputResp.status === 200 && outputResp.status === 200) {
      message.success('操作成功');
    }
  };

  const handleSaveLevel = async () => {
    const values: { level: string[] } = await levelForm.submit();
    const _level = values?.level.map((l: string, i: number) => ({ level: i + 1, title: l }));
    const resp = await service.saveLevel(_level);
    if (resp.status === 200) {
      message.success('操作成功');
    }
  };

  const level = (
    <Card>
      <TitleComponent data="告警级别配置" />
      <Form form={levelForm}>
        <SchemaField schema={levelSchema} />
        <FormButtonGroup.Sticky>
          <FormButtonGroup.FormItem>
            <Button type="primary" onClick={handleSaveLevel}>
              保存
            </Button>
          </FormButtonGroup.FormItem>
        </FormButtonGroup.Sticky>
      </Form>
    </Card>
  );
  const io = (
    <div>
      <Card>
        <TitleComponent data="告警数据输出" />
        <Form form={outputForm} layout="vertical">
          <SchemaField schema={ioSchema} />
        </Form>
        <Divider />
        <TitleComponent data="告警处理结果输入" />
        <Form form={inputForm} layout="vertical">
          <SchemaField schema={ioSchema} />
          <FormButtonGroup.Sticky>
            <FormButtonGroup.FormItem>
              <Button type="primary" onClick={handleSaveIO}>
                保存
              </Button>
            </FormButtonGroup.FormItem>
          </FormButtonGroup.Sticky>
        </Form>
      </Card>
    </div>
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
