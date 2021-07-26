import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Card, Divider, Input, message, Modal, Popconfirm, Select, Spin, Table, Tabs, Tag } from 'antd';
import { ColumnProps, SorterResult } from 'antd/es/table';
import { alarm, AlarmLog } from '@/pages/device/alarm/data';
import moment from 'moment';
import AlarmSave from './save';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { PaginationConfig } from 'antd/lib/table';
import Service from './service';
import styles from '@/utils/table.less';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
  device: any;
}

interface State {
  data: any;
  saveAlarmData: Partial<alarm>;
  searchParam: any;
  alarmLogData: any;
  alarmDataList: any[];
  searchAlarmParam: any;
}

const Alarm: React.FC<Props> = props => {
  const service = new Service('rule-engine-alarm');
  const {
    form: { getFieldDecorator },
    form,
  } = props;

  const initState: State = {
    data: {},
    saveAlarmData: {},
    searchParam: {
      pageSize: 10,
      sorts:[{name:"alarmTime",order: 'desc' }]
    },
    searchAlarmParam: {
      pageSize: 10
    },
    alarmLogData: {},
    alarmDataList: [],
  };

  const [data, setData] = useState(initState.data);
  const [spinning, setSpinning] = useState(true);
  const [saveVisible, setSaveVisible] = useState(false);
  const [solveVisible, setSolveVisible] = useState(false);
  const [saveAlarmData, setSaveAlarmData] = useState(initState.saveAlarmData);
  const [alarmActiveKey, setAlarmActiveKey] = useState('');
  const [alarmLogId, setAlarmLogId] = useState<string>("");
  const [solveAlarmLog, setSolveAlarmLog] = useState<any>({});
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [searchAlarmParam, setSearchAlarmParam] = useState(initState.searchAlarmParam);
  const [alarmLogData, setAlarmLogData] = useState(initState.alarmLogData);
  const [alarmDataList, setAlarmDataList] = useState(initState.alarmDataList);

  const statusMap = new Map();
  statusMap.set('运行中', 'success');
  statusMap.set('已停止', 'error');

  const getProductAlarms = () => {
    alarmDataList.splice(0, alarmDataList.length);
    setSpinning(false)
    service.getAlarmsList(props.device.id, {
      paging: false
    }).subscribe(
      (res) => {
        res.data.map((item: any) => {
          alarmDataList.push(item);
        });
        setAlarmDataList([...alarmDataList]);
      },
      () => setSpinning(false)
    )
  };
  const getData = (params?: any) => {
    setSearchAlarmParam(params)
    service.getAlarmsList(props.device.id, params).subscribe(
      (res) => {
        setData(res);
      },
      () => setSpinning(false)
    )
  }

  useEffect(() => {
    setAlarmActiveKey('info');
    getProductAlarms();
    getData(searchAlarmParam);
    handleSearch(searchParam);
  }, []);

  const submitData = (data: any) => {
    service.saveAlarms(props.device.id, data).subscribe(
      res => {
        message.success('保存成功');
        setSaveVisible(false);
        getProductAlarms();
        getData(searchAlarmParam);
      },
      () => setSpinning(false)
    )
  };

  const _start = (item: alarm) => {
    service._start(props.device.id, { id: item.id }).subscribe(
      () => {
        message.success('启动成功');
        getProductAlarms();
        getData(searchAlarmParam);
        setSpinning(false)
      },
      () => { },
      () => setSpinning(false)
    )
  };

  const _stop = (item: any) => {
    service._stop(props.device.id, { id: item.id }).subscribe(
      () => {
        message.success('停止成功');
        getProductAlarms();
        getData(searchAlarmParam);
        setSpinning(false)
      },
      () => { },
      () => setSpinning(false)
    )
  };

  const deleteAlarm = (id: string) => {
    service._remove(props.device.id, { id: id }).subscribe(
      () => {
        message.success('删除成功');
        getProductAlarms();
        getData(searchAlarmParam);
        setSpinning(false)
      },
      () => { },
      () => setSpinning(false)
    )
  };

  const columns: ColumnProps<alarm>[] = [
    {
      title: '告警名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/',
    },
    {
      title: '运行状态',
      dataIndex: 'state',
      render: record => record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : '',
    },
    {
      title: '操作',
      width: '250px',
      align: 'center',
      render: (record: any) => (
        <Fragment>
          <a onClick={() => {
            setSaveAlarmData(record);
            setSaveVisible(true);
          }}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => {
            setAlarmLogId(record.id);
            onAlarmProduct(record.id);
            setAlarmActiveKey('logList');
          }}>告警日志</a>
          <Divider type="vertical" />
          {record.state?.value === 'stopped' ? (
            <span>
              <Popconfirm
                title="确认启动此告警？"
                onConfirm={() => {
                  setSpinning(true);
                  _start(record);
                }}
              >
                <a>启动</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除此告警？"
                onConfirm={() => {
                  setSpinning(true);
                  deleteAlarm(record.id);
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          ) : (
            <Popconfirm
              title="确认停止此告警？"
              onConfirm={() => {
                setSpinning(true);
                _stop(record);
              }}
            >
              <a>停止</a>
            </Popconfirm>
          )}
        </Fragment>
      ),
    },
  ];

  const alarmLogColumns: ColumnProps<AlarmLog>[] = [
    {
      title: '设备ID',
      dataIndex: 'deviceId',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '告警名称',
      dataIndex: 'alarmName',
    },
    {
      title: '告警时间',
      dataIndex: 'alarmTime',
      width: '300px',
      render: (text: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/',
      sorter: true,
      defaultSortOrder: 'descend'
    },
    {
      title: '处理状态',
      dataIndex: 'state',
      align: 'center',
      width: '100px',
      render: text => text === 'solve' ? <Tag color="#87d068">已处理</Tag> : <Tag color="#f50">未处理</Tag>,
    },
    {
      title: '操作',
      width: '120px',
      align: 'center',
      render: (record: any) => (
        <Fragment>
          <a onClick={() => {
            let content: string;
            try {
              content = JSON.stringify(record.alarmData, null, 2);
            } catch (error) {
              content = record.alarmData;
            }
            Modal.confirm({
              width: '40VW',
              title: '告警数据',
              content: <pre>{content}
                {record.state === 'solve' && (
                  <>
                    <br /><br />
                    <span style={{ fontSize: 16 }}>处理结果：</span>
                    <br />
                    <p>{record.description}</p>
                  </>
                )}
              </pre>,
              okText: '确定',
              cancelText: '关闭',
            })
          }}>详情</a>
          {

            record.state !== 'solve' && (
              <>
                <Divider type="vertical" />
                <a onClick={() => {
                  setSolveAlarmLog(record);
                  setSolveVisible(true);
                }}>处理</a>
              </>
            )
          }
        </Fragment>
      )
    },
  ];

  const alarmSolve = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      let params = {
        descriptionMono: fileValue.description,
        id: solveAlarmLog.id,
        state: 'solve'
      }
      service.updataAlarmLog(props.device.id, params).subscribe(res => {
        setSolveVisible(false);
        handleSearch(searchParam);
        message.success('操作成功！');
      })
    });
  };

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    service.getAlarmLogList(props.device.id, params).subscribe(
      res => {
        setAlarmLogData(res);
      }
    )
  };

  const onAlarmProduct = (value?: string) => {
    handleSearch({
      pageSize: 10,
      where: `alarmId=${value}`
    });
  };

  // useEffect(() => {
  //   handleSearch(searchParam);
  // }, [alarmActiveKey]);

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<AlarmLog>,
  ) => {
    handleSearch({
      ...searchParam,
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      sorts:[{name:"alarmTime",order: sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : searchParam.sorts[0].order}]
    });
  };

  const onTableAlarmChange = (
    pagination: PaginationConfig,
  ) => {
    getData({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
    })
  };

  return (
    <Spin tip="加载中..." spinning={spinning}>
      <Card>
        <Tabs tabPosition="top" type="card" activeKey={alarmActiveKey} onTabClick={(key: any) => {
          setAlarmActiveKey(key);
          // if (key = 'logList') {
          //   setAlarmLogId("");
          //   handleSearch(searchParam);
          // }
        }}>
          <Tabs.TabPane tab="告警设置" key="info">
            <Card title={
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  setSaveAlarmData({});
                  setSaveVisible(true);
                }}
              >
                新增告警
              </Button>
            } bordered={false}>
              <Table rowKey="id" columns={columns} dataSource={data.data}
                onChange={onTableAlarmChange}
                pagination={{
                  current: data.pageIndex + 1,
                  total: data.total,
                  pageSize: data.pageSize
                }} />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab="告警记录" key="logList">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Select placeholder="选择告警设置" allowClear style={{ width: 300 }} value={alarmLogId}
                onChange={(value: string) => {
                  setAlarmLogId(value);
                  if (value !== '' && value !== undefined) {
                    onAlarmProduct(value);
                  } else {
                    handleSearch({
                      pageIndex: searchParam.pageIndex,
                      pageSize: searchParam.pageSize
                    });
                  }
                }}
              >
                {alarmDataList.length > 0 && alarmDataList.map(item => (
                  <Select.Option key={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
              <div>
                <Button type="primary" onClick={() => {
                  handleSearch(searchParam);
                }}>刷新</Button>
              </div>
            </div>
            <div className={styles.StandardTable} style={{ marginTop: 10 }}>
              <Table
                dataSource={alarmLogData.data}
                columns={alarmLogColumns}
                rowKey='id'
                onChange={onTableChange}
                pagination={{
                  current: alarmLogData.pageIndex + 1,
                  total: alarmLogData.total,
                  pageSize: alarmLogData.pageSize
                }}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {saveVisible && <AlarmSave
        close={() => {
          setSaveAlarmData({});
          setSaveVisible(false);
          getProductAlarms();
        }}
        save={(data: any) => {
          setSpinning(true);
          submitData(data);
        }}
        data={saveAlarmData}
        deviceId={props.device.id}
      />}

      {solveVisible && (
        <Modal
          title='告警处理结果'
          visible
          okText="确定"
          cancelText="取消"
          width='700px'
          onOk={() => {
            alarmSolve();
          }}
          onCancel={() => {
            setSolveVisible(false);
            setSolveAlarmLog({});
          }}
        >
          <Form labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} key="solve_form">
            <Form.Item key="description" label="处理结果">
              {getFieldDecorator('description', {
                rules: [
                  { required: true, message: '请输入处理结果' },
                  { max: 2000, message: '处理结果不超过2000个字符' }
                ],
              })(
                <Input.TextArea rows={8} placeholder="请输入处理结果" />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Spin>
  );
};
export default Form.create<Props>()(Alarm);
