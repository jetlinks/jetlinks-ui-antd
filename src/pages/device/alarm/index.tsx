import React, {Fragment, useEffect, useState} from 'react';
import {Badge, Button, Card, Divider, Input, message, Modal, Popconfirm, Select, Spin, Table, Tabs, Tag} from 'antd';
import apis from '@/services';
import {ColumnProps, SorterResult} from 'antd/es/table';
import {alarm, AlarmLog} from '@/pages/device/alarm/data';
import moment from 'moment';
import Save from '@/pages/device/alarm/save';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {PaginationConfig} from 'antd/lib/table';
import encodeQueryParam from '@/utils/encodeParam';
import styles from '@/utils/table.less';

interface Props extends FormComponentProps {
  target: string;
  targetId?: string;
  metaData?: string;
  name?: string;
  productId?: string;
  productName?: string;
}

interface State {
  data: any[];
  saveAlarmData: Partial<alarm>;
  searchParam: any;
  alarmLogData: any;
  alarmDataList: any[];
}

const Alarm: React.FC<Props> = props => {

  const {
    form: {getFieldDecorator},
    form,
  } = props;

  const initState: State = {
    data: [],
    saveAlarmData: {},
    searchParam: {
      pageSize: 10, sorts: {
        order: "descend",
        field: "alarmTime"
      }
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
  const [alarmLogId, setAlarmLogId] = useState<any>(null);
  const [solveAlarmLogId, setSolveAlarmLogId] = useState();
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [alarmLogData, setAlarmLogData] = useState(initState.alarmLogData);
  const [alarmDataList, setAlarmDataList] = useState(initState.alarmDataList);

  const statusMap = new Map();
  statusMap.set('运行中', 'success');
  statusMap.set('已停止', 'error');

  const getProductAlarms = () => {
    alarmDataList.splice(0, alarmDataList.length);
    apis.deviceAlarm.getProductAlarms(props.target, props.targetId)
      .then((response: any) => {
        if (response.status === 200) {
          setData(response.result);
          response.result.map((item: any) => {
            alarmDataList.push(item);
          });
          setAlarmDataList([...alarmDataList]);
        }
        setSpinning(false);
      }).catch(() => {
    });

    if (props.target === 'device') {
      apis.deviceAlarm.getProductAlarms('product', props.productId)
        .then((response: any) => {
          if (response.status === 200) {
            response.result.map((item: any) => {
              alarmDataList.push(item);
            });
            setAlarmDataList([...alarmDataList]);
          }
        }).catch(() => {
      });
    }
  };

  useEffect(() => {
    setAlarmActiveKey('info');
    getProductAlarms();
  }, []);

  const submitData = (data: any) => {
    apis.deviceAlarm.saveProductAlarms(props.target, props.targetId, data)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('保存成功');
          setSaveVisible(false);
          getProductAlarms();
        }
        setSpinning(false);
      })
      .catch(() => {
      });
  };

  const _start = (item: alarm) => {
    apis.deviceAlarm._start(item.id)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('启动成功');
          getProductAlarms();
        } else {
          setSpinning(false);
        }
      })
      .catch();
  };

  const _stop = (item: any) => {
    apis.deviceAlarm._stop(item.id)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('停止成功');
          getProductAlarms();
        } else {
          setSpinning(false);
        }
      })
      .catch();
  };

  const deleteAlarm = (id: string) => {
    apis.deviceAlarm.remove(id)
      .then((response: any) => {
        if (response.status === 200) {
          getProductAlarms();
        } else {
          setSpinning(false);
        }
      })
      .catch(() => {
      });
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
      render: record => record ? <Badge status={statusMap.get(record.text)} text={record.text}/> : '',
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
          }}>查看</a>
          <Divider type="vertical"/>
          <a onClick={() => {
            setAlarmLogId(record.id);
            setAlarmActiveKey('logList');
          }}>告警日志</a>
          <Divider type="vertical"/>
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
              <Divider type="vertical"/>
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
                    <br/><br/>
                    <span style={{fontSize: 16}}>处理结果：</span>
                    <br/>
                    <p>{record.description}</p>
                  </>
                )}
                       </pre>,
              okText: '确定',
              cancelText: '关闭',
            })
          }}>详情</a>
          <Divider type="vertical"/>
          {
            record.state !== 'solve' && (
              <a onClick={() => {
                setSolveAlarmLogId(record.id);
                setSolveVisible(true);
              }}>处理</a>
            )
          }
        </Fragment>
      )
    },
  ];

  const alarmSolve = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      apis.deviceAlarm.alarmLogSolve(solveAlarmLogId || '', fileValue.description)
        .then((response: any) => {
          if (response.status === 200) {
            message.success('保存成功');
            setSolveAlarmLogId(undefined);
            setSolveVisible(false);
            handleSearch(searchParam);
          }
        })
        .catch(() => {
        })
    });
  };

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    apis.deviceAlarm.findAlarmLog(encodeQueryParam(params))
      .then((response: any) => {
        if (response.status === 200) {
          setAlarmLogData(response.result);
        }
      })
      .catch(() => {
      });
  };

  const onAlarmProduct = (value: string) => {
    let {terms} = searchParam;
    if (terms) {
      terms.alarmId = value;
    } else {
      terms = {
        alarmId: value,
      };
    }
    handleSearch({
      pageIndex: searchParam.pageIndex,
      pageSize: searchParam.pageSize,
      terms,
      sorts: searchParam.sorter || {
        order: "descend",
        field: "alarmTime"
      },
    });
  };

  useEffect(() => {
    if (alarmActiveKey === 'logList') {
      if (props.target === 'device') {
        searchParam.terms = {
          deviceId: props.targetId,
        };
        if (alarmLogId != '' && alarmLogId != null && alarmLogId) {
          searchParam.terms.alarmId = alarmLogId;
        }
      } else {
        searchParam.terms = {
          productId: props.targetId,
        };
        if (alarmLogId != '' && alarmLogId != null && alarmLogId) {
          searchParam.terms.alarmId = alarmLogId;
        }
      }
      handleSearch(searchParam);
    }
  }, [alarmActiveKey]);

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<AlarmLog>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter,
    });
  };

  return (
    <Spin tip="加载中..." spinning={spinning}>
      <Card>
        <Tabs activeKey={alarmActiveKey} onTabClick={(key: any) => {
          setAlarmLogId(undefined);
          setAlarmActiveKey(key);
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
              <Table rowKey="id" columns={columns} dataSource={data} pagination={false}/>
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab="告警记录" key="logList">
            <div>
              <Select placeholder="选择告警设置" allowClear style={{width: 300}} value={alarmLogId}
                      onChange={(value: string) => {
                        onAlarmProduct(value);
                        setAlarmLogId(value);
                      }}
              >
                {alarmDataList.length > 0 && alarmDataList.map(item => (
                  <Select.Option key={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </div>
            <div className={styles.StandardTable} style={{marginTop: 10}}>
              <Table
                dataSource={alarmLogData.data}
                columns={alarmLogColumns}
                rowKey='id'
                onChange={onTableChange}
                pagination={{
                  current: alarmLogData.pageIndex + 1,
                  total: alarmLogData.total,
                  pageSize: alarmLogData.pageSize,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showTotal: (total: number) => (
                    `共 ${total} 条记录 第  ${
                      alarmLogData.pageIndex + 1
                    }/${
                      Math.ceil(alarmLogData.total / alarmLogData.pageSize)
                    }页`
                  ),
                }}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {saveVisible && <Save
        close={() => {
          setSaveAlarmData({});
          setSaveVisible(false);
          getProductAlarms();
        }}
        save={(data: any) => {
          setSpinning(true);
          submitData(data);
        }}
        data={saveAlarmData} targetId={props.targetId}
        target={props.target} metaData={props.metaData}
        name={props.name} productName={props.productName}
        productId={props.productId}
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
            setSolveAlarmLogId(undefined);
          }}
        >
          <Form labelCol={{span: 3}} wrapperCol={{span: 21}} key="solve_form">
            <Form.Item key="description" label="处理结果">
              {getFieldDecorator('description', {
                rules: [
                  {required: true, message: '请输入处理结果'},
                  {max: 2000, message: '处理结果不超过2000个字符'}
                ],
              })(
                <Input.TextArea rows={8} placeholder="请输入处理结果"/>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Spin>
  );
};
export default Form.create<Props>()(Alarm);
