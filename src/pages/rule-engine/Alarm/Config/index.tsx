import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Divider, Image, message, Row, Table, Tooltip } from 'antd';
import TitleComponent from '@/components/TitleComponent';
import { createSchemaField } from '@formily/react';
import { ArrayItems, Form, FormButtonGroup, FormGrid, FormItem, Input } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { useMemo, useState } from 'react';
import { createForm, onFormInit } from '@formily/core';
import FLevelInput from '@/components/FLevelInput';
import type { IOConfigItem } from '@/pages/rule-engine/Alarm/Config/typing';
import Service from '@/pages/rule-engine/Alarm/Config/service';
import styles from './index.less';
import ReactMarkdown from 'react-markdown';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const service = new Service('alarm/config');
const ioImg = require('/public/images/alarm/io.png');
const Config = () => {
  const [tab, setTab] = useState<'io' | 'config' | string>('config');
  const outputData = [
    {
      key: 'alarmName',
      name: '告警名称',
      type: 'string',
      desc: '推送的告警名称',
    },
    {
      key: 'id',
      name: '告警ID',
      type: 'string',
      desc: '告警唯一性标识',
    },
    {
      key: 'targetType',
      name: '告警类型',
      type: 'string',
      desc: '告警所属的业务类型，具体有产品、设备、部门、其他',
    },
    {
      key: 'targetId',
      name: '告警目标ID',
      type: 'string',
      desc: '告警目标唯一性标识',
    },
    {
      key: 'targetName',
      name: '告警目标名称',
      type: 'string',
      desc: '告警目标实例名称',
    },
    {
      key: 'alarmDate',
      name: '最近告警时间',
      type: 'date',
      desc: '最近一次的告警触发时间',
    },
    {
      key: 'level',
      name: '告警级别',
      type: 'int',
      desc: '告警严重程度指标',
    },
    {
      key: 'state',
      name: '告警状态',
      type: 'object',
      desc: 'value：告警状态 text：告警值',
    },
    {
      key: 'description',
      name: '告警说明',
      type: 'string',
      desc: '告警规则说明',
    },
  ];
  const outputColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '标识',
      dataIndex: 'key',
      key: 'key',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
    },
    {
      title: '说明',
      dataIndex: 'desc',
      key: 'desc',
      ellipsis: true,
    },
  ];

  const subData = [
    {
      key: 'id',
      name: '告警ID',
      type: 'string',
      require: '是',
      desc: '订阅的告警唯一性标识',
    },
    {
      key: 'describe',
      name: '处理内容',
      type: 'string',
      require: '是',
      desc: '告警处理内容详细描述说明',
    },
    {
      key: 'state',
      name: '告警状态',
      type: 'string',
      require: '是',
      desc: '告警中, 无告警',
    },
    {
      key: 'handleTime',
      name: '处理时间',
      type: 'long',
      require: '否',
      desc: '告警处理时间，不填是默认为消息处理时间',
    },
  ];

  const subColumns = [...outputColumns];
  subColumns.splice(3, 0, {
    title: '必填',
    dataIndex: 'require',
    key: 'require',
    ellipsis: true,
  });

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
              while (_level.length < 5) {
                _level.push('');
              }
              form.setValuesIn('level', _level);
            }
          });
          // onFieldReact('level.0.remove', (state, f1) => {
          //   state.setState({ display: 'none' });
          //   f1.setFieldState('level.add', (state1) => {
          //     const length = f1.values.level?.length;
          //     if (length > 4) {
          //       state1.display = 'none';
          //     } else {
          //       state1.display = 'visible';
          //     }
          //   });
          // });
        },
      }),
    [],
  );

  const inputForm = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFormInit(async (f) => {
            const resp = await service.getDataExchange('consume');
            if (resp.status === 200) {
              f.setInitialValues(resp.result?.config.config);
              f.setValuesIn('id', resp.result?.id);
            }
          });
        },
      }),
    [],
  );
  const outputForm = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFormInit(async (f) => {
            const resp = await service.getDataExchange('producer');
            if (resp.status === 200) {
              f.setInitialValues(resp.result?.config.config);
              f.setValuesIn('id', resp.result?.id);
            }
          });
        },
      }),
    [],
  );

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
            // remove: {
            //   type: 'void',
            //   title: <div style={{ width: '20px' }} />,
            //   'x-decorator': 'FormItem',
            //   'x-component': 'ArrayItems.Remove',
            //   'x-decorator-props': {
            //     gridSpan: 1,
            //   },
            //   'x-component-props': {
            //     style: { marginTop: '40px' },
            //   },
            // },
          },
        },
        // properties: {
        //   add: {
        //     type: 'void',
        //     title: '添加级别',
        //     'x-component': 'ArrayItems.Addition',
        //   },
        // },
      },
    },
  };

  const ioSchema: ISchema = {
    type: 'object',
    properties: {
      id: {
        'x-component': 'Input',
        'x-hidden': true,
      },
      address: {
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
      // layout2: {
      //   type: 'void',
      //   'x-decorator': 'FormGrid',
      //   'x-decorator-props': {
      //     maxColumns: 2,
      //     minColumns: 2,
      //     columnGap: 24,
      //   },
      //   properties: {
      //     username: {
      //       title: '用户名',
      //       type: 'string',
      //       // required: true,
      //       'x-decorator': 'FormItem',
      //       'x-component': 'Input',
      //       'x-component-props': {
      //         placeholder: '请输入用户名',
      //       },
      //       'x-decorator-props': {
      //         gridSpan: 1,
      //       },
      //     },
      //     password: {
      //       title: '密码',
      //       type: 'string',
      //       // required: true,
      //       'x-decorator': 'FormItem',
      //       'x-component': 'Input',
      //       'x-decorator-props': {
      //         gridSpan: 1,
      //       },
      //       'x-component-props': {
      //         placeholder: '请输入密码',
      //       },
      //     },
      //   },
      // },
    },
  };

  const handleSaveIO = async () => {
    outputForm.validate();
    inputForm.validate();
    const inputConfig: IOConfigItem = await inputForm.submit();
    const outputConfig: IOConfigItem = await outputForm.submit();
    const inputResp = await service.saveOutputData({
      config: {
        config: outputConfig,
      },
      id: outputConfig.id,
      sourceType: 'kafka',
      exchangeType: 'producer',
    });
    const outputResp = await service.saveOutputData({
      config: {
        sourceType: 'kafka',
        config: inputConfig,
      },
      id: inputConfig.id,
      sourceType: 'kafka',
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

  const outputText = `
  ~~~json
  {
    "id": "1518055745863864320",
    "alarmConfigId": "1511601633016569856",
    "alarmName": "一楼烟感告警",
    "targetType": "product",
    "targetId": "product-01",
    "targetName": "产品-001",
    "alarmTime": "1651233650840",
    "level": 3,
    "state": {
      "text": "告警中",
      "value": "warning"
    },
    "description": "一楼烟感告警设置"
  }
  ~~~
  `;

  const subText = `
  ~~~json
  {
    "id": "1518055745863864320",
    "state": "normal",
     "describe": "已处理"
  }
  ~~~
  `;

  const level = (
    <Row>
      <Col span={14}>
        <Card>
          <TitleComponent data={'告警级别配置'} />
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
      </Col>
      <Col span={10}>
        <div style={{ marginLeft: 20 }} className={styles.doc}>
          <h1>功能说明</h1>
          <div>1、告警级别用于描述告警的严重程度，请根据业务管理方式进行自定义。</div>
          <div>2、告警级别将会在告警配置中被引用</div>
          <div>3、最多可配置5个级别</div>
        </div>
      </Col>
    </Row>
  );
  const io = (
    <Row>
      <Col span={14}>
        <div>
          <Card>
            <TitleComponent
              data={
                <span>
                  告警数据输出
                  <Tooltip title={'将告警数据输出到其他第三方系统'}>
                    <QuestionCircleOutlined style={{ marginLeft: 5 }} />
                  </Tooltip>
                </span>
              }
            />
            <Form form={outputForm} layout="vertical">
              <SchemaField schema={ioSchema} />
            </Form>
            <Divider />
            <TitleComponent
              data={
                <span>
                  告警处理结果输入
                  <Tooltip title={'接收第三方系统处理的告警结果'}>
                    <QuestionCircleOutlined style={{ marginLeft: 5 }} />
                  </Tooltip>
                </span>
              }
            />
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
      </Col>
      <Col span={10}>
        <div style={{ height: 560, marginLeft: 20, paddingBottom: 24 }}>
          <div className={styles.doc}>
            <h1>功能图示</h1>
            <div className={styles.image}>
              <Image width="100%" src={ioImg} />
            </div>
            <h1>功能说明</h1>
            <div>
              1、平台支持将告警数据输出到kafka，第三方系统可订阅kafka中的告警数据，进行业务处理。
            </div>
            <h2>输出参数</h2>
            <div>
              <Table dataSource={outputData} pagination={false} columns={outputColumns} />
            </div>
            <h2>示例</h2>
            <ReactMarkdown className={styles.code}>{outputText}</ReactMarkdown>
            <div>2、平台支持订阅kafka中告警处理数据，并更新告警记录状态。</div>
            <h2>订阅参数</h2>
            <div>
              <Table dataSource={subData} pagination={false} columns={subColumns} />
            </div>
            <h2>示例</h2>
            <ReactMarkdown className={styles.code}>{subText}</ReactMarkdown>
          </div>
        </div>
      </Col>
    </Row>
  );

  const list = [
    {
      key: 'config',
      tab: '告警级别',
      component: level,
    },
    { key: 'io', tab: '数据流转', component: io },
  ];

  return (
    <PageContainer onTabChange={setTab} tabActiveKey={tab} tabList={list}>
      {list.find((k) => k.key === tab)?.component}
    </PageContainer>
  );
};
export default Config;
