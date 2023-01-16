import { PageContainer } from '@ant-design/pro-layout';
import { Badge, Card, Col, Descriptions, Divider, Image, Row, Table, Tooltip } from 'antd';
import TitleComponent from '@/components/TitleComponent';
import { createSchemaField } from '@formily/react';
import { ArrayItems, Form, FormGrid, FormItem, Input } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { useEffect, useMemo, useState } from 'react';
import { createForm, onFormInit } from '@formily/core';
import FLevelInput from '@/components/FLevelInput';
import Service from '@/pages/rule-engine/Alarm/Config/service';
import styles from './index.less';
import ReactMarkdown from 'react-markdown';
import { EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { onlyMessage } from '@/utils/util';
import OutputSave from './Save/output';
import InputSave from './Save/input';
import PermissionButton from '@/components/PermissionButton';

export const service = new Service('alarm/config');
const ioImg = require('/public/images/alarm/io.png');
const Config = () => {
  const [tab, setTab] = useState<'io' | 'config' | string>('config');
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [outputVisible, setOutputVisible] = useState<boolean>(false);
  const [input, setInput] = useState<any>({});
  const [output, setOutput] = useState<any>({});
  const { permission } = PermissionButton.usePermission('rule-engine/Alarm/Config');

  const outputData = [
    {
      key: 'alarmConfigName',
      name: '告警配置名称',
      type: 'string',
      desc: '推送的告警配置名称',
      example: '烟感告警',
    },
    {
      key: 'alarmConfigId',
      name: '告警配置ID',
      type: 'string',
      desc: '推送的告警配置ID',
      example: '1605111722418597888',
    },
    {
      key: 'Id',
      name: '告警数据ID',
      type: 'string',
      desc: '告警唯一性标识',
      example: '1515992841393119232',
    },
    {
      key: 'alarmRecordId',
      name: '告警记录ID',
      type: 'string',
      desc: '告警记录的唯一标识，可根据此ID处理告警',
      example: 'ba33a59ca5ebe3dccfcd75fd0575be4e',
    },
    {
      key: 'targetType',
      name: '告警目标类型',
      type: 'string',
      desc: '告警所属的业务类型，具体有产品、设备、部门、其他',
      example: '产品',
    },
    {
      key: 'targetId',
      name: '告警目标ID',
      type: 'string',
      desc: '告警目标唯一性标识',
      example: '1583300346713661440',
    },
    {
      key: 'targetName',
      name: '告警目标名称',
      type: 'string',
      desc: '告警目标实例名称',
      example: '海康烟感',
    },
    {
      key: 'alarmTime',
      name: '告警时间',
      type: 'long',
      desc: '告警触发时间',
      example: '1651233650840',
    },
    {
      key: 'sourceType',
      name: '告警源类型',
      type: 'string',
      desc: '触发告警的源类型。当前只有device',
      example: 'device',
    },
    {
      key: 'sourceId',
      name: '告警源ID',
      type: 'string',
      desc: '触发告警的源Id。如设备Id',
      example: '1605138218826821632',
    },
    {
      key: 'sourceName',
      name: '告警源名称',
      type: 'string',
      desc: '触发告警的源名称。如设备名称',
      example: '1楼烟感S01',
    },
    {
      key: 'level',
      name: '告警级别',
      type: 'int',
      desc: '告警严重程度指标',
      example: 1,
    },
    {
      key: 'description',
      name: '告警说明',
      type: 'string',
      desc: '告警规则说明',
      example: '1楼烟感统一告警规则设置',
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
      width: 100,
      ellipsis: true,
    },
    {
      title: '示例值',
      dataIndex: 'example',
      key: 'example',
      width: 100,
      ellipsis: true,
    },
  ];

  const subColumns = [...outputColumns];
  subColumns.splice(3, 0, {
    title: '必填',
    dataIndex: 'require',
    key: 'require',
    ellipsis: true,
  });

  const subData = [
    {
      key: 'alarmRecordId',
      name: '告警记录ID',
      type: 'string',
      require: '是',
      desc: '告警记录的唯一标识，可根据此ID处理告警',
      example: 'ba33a59ca5ebe3dccfcd75fd0575be4e',
    },
    {
      key: 'alarmConfigId',
      name: '告警配置ID',
      type: 'string',
      require: '是',
      desc: '推送的告警配置ID',
      example: '1605111722418597888',
    },
    {
      key: 'alarmTime',
      name: '告警时间',
      type: 'long',
      require: '是',
      desc: '告警触发时间',
      example: '1651233650840',
    },
    {
      key: 'handleTime',
      name: '处理时间',
      type: 'long',
      require: '是',
      desc: '告警处理时间，不填是默认为消息处理时间',
      example: '1651233650840',
    },
    {
      key: 'describe',
      name: '处理说明',
      type: 'string',
      require: '是',
      desc: '告警处理内容详细描述说明',
      example: '已联系第三方人员进行告警处理，现告警已恢复',
    },
    {
      key: 'type',
      name: '处理类型',
      type: 'enum',
      require: '是',
      desc: '支持system、user',
      example: 'user',
    },
    {
      key: 'state',
      name: '处理后的状态',
      type: 'enum',
      require: '是',
      desc: 'warning、normal',
      example: 'normal',
    },
  ];

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
                gridSpan: 24,
              },
              'x-validator': [
                {
                  max: 64,
                  message: '最多输入64个字符',
                },
              ],
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

  const handleSaveLevel = async () => {
    const values: { level: string[] } = await levelForm.submit();
    const _level = values?.level.map((l: string, i: number) => ({ level: i + 1, title: l }));
    const resp = await service.saveLevel(_level);
    if (resp.status === 200) {
      onlyMessage('操作成功');
    }
  };

  const handleInputSearch = () => {
    service.getDataExchange('consume').then((resp) => {
      if (resp.status === 200) {
        setInput(resp.result);
      }
    });
  };

  const handleOutputSearch = () => {
    service.getDataExchange('producer').then((resp) => {
      if (resp.status === 200) {
        setOutput(resp.result);
      }
    });
  };

  useEffect(() => {
    handleOutputSearch();
    handleInputSearch();
  }, []);

  const outputText = `
  ~~~json
  {
    "alarmConfigId": "1605111722418597888",
    "id": "1515992841393119232",
    "alarmConfigId": "1586989804257853441",
    "alarmConfigName": "烟感告警",
    "alarmRecordId": "ba33a59ca5ebe3dccfcd75fd0575be4e",
    "level": "3",
    "description": "设备温度过高",
    "alarmTime": "1667202964007",
    "sourceType": "device",
    "sourceId": "1605138218826821632",
    "sourceName": "1楼烟感S01",
    "targetType": "device",
    "targetName": "温度探测设备",
    "targetId": "1583300346713661440"
  }
  ~~~
  `;

  const subText = `
  ~~~json
  {
    "alarmRecordId": "ba33a59ca5ebe3dccfcd75fd0575be4e",
    "alarmConfigId": "1605111722418597888",
    "alarmTime": "1651233650840",
    "handleTime": "1651233650841",
    "describe": "已联系第三方人员进行告警处理，现告警已恢复",
    "type": "user",
    "state": "normal"
  }
  ~~~
  `;

  const level = (
    <Row>
      <Col span={14}>
        <Card style={{ height: 780 }}>
          <TitleComponent data={'告警级别配置'} style={{ marginBottom: 16 }} />
          <Form form={levelForm}>
            <SchemaField schema={levelSchema} />
            <PermissionButton
              key={'update'}
              type={'primary'}
              style={{ padding: 0, width: 50 }}
              isPermission={permission.update}
              onClick={handleSaveLevel}
            >
              保存
            </PermissionButton>
          </Form>
        </Card>
      </Col>
      <Col span={10}>
        <div style={{ marginLeft: 20, height: 780 }} className={styles.doc}>
          <h1>功能说明</h1>
          <div>1、告警级别用于描述告警的严重程度，请根据业务管理方式进行自定义。</div>
          <div>2、告警级别将会在告警配置中被引用。</div>
          <div>3、最多可配置5个级别。</div>
        </div>
      </Col>
    </Row>
  );
  const io = (
    <Row>
      <Col span={14}>
        <div>
          <Card style={{ height: 780 }}>
            <TitleComponent
              data={
                <span>
                  告警数据输出
                  <Tooltip title={'将告警数据输出到其他第三方系统'}>
                    <QuestionCircleOutlined style={{ marginLeft: 5 }} />
                  </Tooltip>
                  <PermissionButton
                    key={'update'}
                    type={'link'}
                    style={{ padding: 0, marginLeft: 10 }}
                    isPermission={permission.update}
                    onClick={() => {
                      setOutputVisible(true);
                    }}
                  >
                    <EditOutlined />
                  </PermissionButton>
                  {/* <a
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      setOutputVisible(true);
                    }}
                  >
                    <EditOutlined />
                  </a> */}
                </span>
              }
            />
            <Descriptions
              key={'output'}
              bordered
              column={2}
              labelStyle={{ width: 112 }}
              contentStyle={{ minWidth: 100 }}
            >
              <Descriptions.Item label="kafka地址" contentStyle={{ minWidth: 200 }}>
                {output?.data?.config?.config?.address && (
                  <Badge
                    status={output?.running ? 'success' : 'error'}
                    text={output?.data?.config?.config?.address || ''}
                  />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="topic">
                {output?.data?.config?.config?.topic || ''}
              </Descriptions.Item>
              <Descriptions.Item label="状态" span={2}>
                {output?.data?.state && (
                  <Badge
                    status={output?.data?.state?.value === 'enabled' ? 'success' : 'error'}
                    text={output?.data?.state?.text || ''}
                  />
                )}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <TitleComponent
              data={
                <span>
                  告警处理结果输入
                  <Tooltip title={'接收第三方系统处理的告警结果'}>
                    <QuestionCircleOutlined style={{ marginLeft: 5 }} />
                  </Tooltip>
                  <PermissionButton
                    key={'update'}
                    type={'link'}
                    style={{ padding: 0, marginLeft: 10 }}
                    isPermission={permission.update}
                    onClick={() => {
                      setInputVisible(true);
                    }}
                  >
                    <EditOutlined />
                  </PermissionButton>
                  {/* <a
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      setInputVisible(true);
                    }}
                  >
                    <EditOutlined />
                  </a> */}
                </span>
              }
            />
            <Descriptions
              key={'input'}
              bordered
              column={2}
              labelStyle={{ width: 112 }}
              contentStyle={{ minWidth: 150 }}
            >
              <Descriptions.Item label="kafka地址">
                {input?.data?.config?.config?.address && (
                  <Badge
                    status={input?.running ? 'success' : 'error'}
                    text={input?.data?.config?.config?.address || ''}
                  />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="topic">
                {input?.data?.config?.config?.topic || ''}
              </Descriptions.Item>
              <Descriptions.Item label="状态" span={2}>
                {input?.data?.state && (
                  <Badge
                    status={input?.data?.state?.value === 'enabled' ? 'success' : 'error'}
                    text={input?.data?.state?.text || ''}
                  />
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </Col>
      <Col span={10}>
        <div style={{ height: 780, marginLeft: 20, paddingBottom: 24, backgroundColor: '#fff' }}>
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
      {inputVisible && (
        <InputSave
          data={input}
          close={() => {
            setInputVisible(false);
          }}
          save={() => {
            setInputVisible(false);
            handleInputSearch();
          }}
        />
      )}
      {outputVisible && (
        <OutputSave
          data={output}
          close={() => {
            setOutputVisible(false);
          }}
          save={() => {
            setOutputVisible(false);
            handleOutputSearch();
          }}
        />
      )}
    </PageContainer>
  );
};
export default Config;
