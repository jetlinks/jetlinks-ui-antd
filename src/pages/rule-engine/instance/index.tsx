import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Dropdown, Icon, List, Menu, message, Popconfirm, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { connect } from 'dva';
import { ConnectState, Dispatch } from '@/models/connect';
import encodeQueryParam from '@/utils/encodeParam';
import apis from '@/services';
import SearchForm from '@/components/SearchForm';
import { RuleInstanceItem } from './data.d';
import Save from './save';
import Detail from './save/detail';
import SqlRuleSave from '@/pages/rule-engine/sqlRule/save/index';
import cardStyles from "@/pages/device/product/index.less";
import DeviceAlarm from "@/pages/rule-engine/instance/img/DeviceAlarm.png";
import NodeRed from "@/pages/rule-engine/instance/img/NodeRed.png";
import SqlServer from "@/pages/rule-engine/instance/img/SqlServer.png";
import SceneImg from '@/pages/rule-engine/scene/img/scene.svg';
import AutoHide from "@/pages/device/location/info/autoHide";
import AlarmSave from "@/pages/device/alarm/save/index";
import SceneSave from '../scene/save';

interface Props {
  ruleInstance: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  detailVisible: boolean,
  current: Partial<RuleInstanceItem>;
  deviceAlarm: any;
  deviceMateData: string;
  detailData: any;
}

const RuleInstanceList: React.FC<Props> = props => {
  const { dispatch } = props;

  const { result } = props.ruleInstance;

  const initState: State = {
    data: result,
    searchParam: {
      pageSize: 8, sorts: {
        order: "descend",
        field: "createTime"
      }
    },
    saveVisible: false,
    detailVisible: false,
    current: {},
    deviceAlarm: {},
    deviceMateData: "",
    detailData: {},
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [detailVisible, setDetailVisible] = useState(initState.detailVisible);
  const [detailData, setDetailData] = useState(initState.detailData);
  const [saveSqlRuleVisible, setSaveSqlRuleVisible] = useState(false);
  const [saveAlarmVisible, setSaveAlarmVisible] = useState(false);
  const [current, setCurrent] = useState(initState.current);
  const [ruleData, setRuleData] = useState(initState.current);
  const [deviceAlarm, setDeviceAlarm] = useState(initState.deviceAlarm);
  const [deviceMateData, setDeviceMateData] = useState(initState.deviceMateData);

  const modelType = new Map();
  modelType.set('device_alarm', '设备告警');
  modelType.set('sql_rule', '数据转发');
  modelType.set('node-red', '规则编排');
  modelType.set('rule-scene', '场景联动');

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    dispatch({
      type: 'ruleInstance/query',
      payload: encodeQueryParam(params),
    });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const startInstance = (record: any) => {
    if(record.modelType === "device_alarm"){
      apis.ruleInstance
      .startDeviceAlarm(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('启动成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => {
      });
    }else if(record.modelType === "rule-scene"){
      apis.ruleInstance
      .startScene(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('启动成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => {
      });
    }else{
      apis.ruleInstance
      .start(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('启动成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => {
      });
    }
  };

  const stopInstance = (record: any) => {
    if(record.modelType === "device_alarm"){
      apis.ruleInstance
      .stopDeviceAlarm(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('停止成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => {
      });
    }else if(record.modelType === "rule-scene"){
      apis.ruleInstance
      .stopScene(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('停止成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => {
      });
    }else{
      apis.ruleInstance
      .stop(record.id)
      .then(response => {
        if (response.status === 200) {
          message.success('停止成功');
          handleSearch(searchParam);
        }
      })
      .catch(() => {
      });
    }
  };

  const handleDelete = (params: any) => {
    dispatch({
      type: 'ruleInstance/remove',
      payload: params.id,
      callback: () => {
        message.success('删除成功');
        handleSearch(searchParam);
      },
    });
  };

  const onChange = (page: number, pageSize: number) => {
    handleSearch({
      pageIndex: page - 1,
      pageSize,
      terms: searchParam.terms,
      sorts: searchParam.sorts,
    });
  };

  const onShowSizeChange = (current: number, size: number) => {
    handleSearch({
      pageIndex: current - 1,
      pageSize: size,
      terms: searchParam.terms,
      sorts: searchParam.sorts,
    });
  };

  const saveOrUpdate = (item: RuleInstanceItem) => {
    apis.sqlRule.saveOrUpdate(item)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('保存成功');
          setSaveSqlRuleVisible(false);
          setCurrent({});
          handleSearch(searchParam);
        }
      })
      .catch(() => {
      });
  };

  const updateDeviceAlarm = (item: any) => {
    let data: any;
    try {
      data = JSON.parse(item.modelMeta);
    } catch (error) {
      message.error("数据结构异常");
      return;
    }
    if (data.target === 'product') {
      apis.deviceProdcut.info(data.targetId)
        .then((response: any) => {
          if (response.status === 200 && response.result) {
            setDeviceMateData(response.result.metadata);
            setDeviceAlarm(data);
            setSaveAlarmVisible(true);
          } else {
            message.error("告警相关产品不存在。");
          }
        })
        .catch(() => {
        })
    } else {
      apis.deviceInstance.info(data.targetId)
        .then((response: any) => {
          if (response.status === 200 && response.result) {
            setDeviceMateData(response.result.metadata);
            setDeviceAlarm(data);
            setSaveAlarmVisible(true);
          } else {
            message.error("告警相关设备不存在。");
          }
        })
        .catch(() => {
        })
    }
  };

  const submitData = (data: any) => {
    apis.deviceAlarm.saveProductAlarms(deviceAlarm.target, deviceAlarm.targetId, data)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('保存成功');
          setSaveAlarmVisible(false);
          handleSearch(searchParam);
        }
      })
      .catch(() => {
      });
  };

  const cardInfoTitle = {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.85)'
  };

  const [sceneVisible, setSceneVisible] = useState<boolean>(false);
  const logoMap = {
    'device_alarm': <Avatar size={40} src={DeviceAlarm} />,
    'sql_rule': <Avatar size={40} src={SqlServer} />,
    'node-red': <Avatar size={40} src={NodeRed} />,
    'rule-scene': <Avatar size={40} src={SceneImg} />
  }
  return (
    <PageHeaderWrapper title="规则实例">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <SearchForm
              formItems={[
                {
                  label: '名称',
                  key: 'name$LIKE',
                  type: 'string',
                },
                {
                  label: '状态',
                  key: 'state$IN',
                  type: 'list',
                  props: {
                    data: [
                      { id: 'stopped', name: '已停止' },
                      { id: 'started', name: '运行中' },
                      { id: 'disable', name: '已禁用' },
                    ]
                  }
                },
                {
                  label: '规则类型',
                  key: 'modelType$IN',
                  type: 'list',
                  props: {
                    data: [
                      { id: 'node-red', name: '规则编排' },
                      { id: 'sql_rule', name: '数据转发' },
                      { id: 'device_alarm', name: '设备告警' },
                      { id: 'rule-scene', name: '场景联动' }
                    ]
                  }
                }
              ]}
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({
                  terms: params, pageSize: 8, sorts: searchParam.sorts || {
                    order: "descend",
                    field: "createTime"
                  }
                });
              }}
            />
          </div>
          <div className={styles.tableListOperator}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                setSaveVisible(true)
              }}>
              创建规则
            </Button>
          </div>
        </div>
      </Card>
      <br />
      <div className={cardStyles.filterCardList}>
        {result.data && (
          <List<any>
            rowKey="id"
            loading={props.loading}
            grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            dataSource={(result || {}).data}
            pagination={{
              current: result?.pageIndex + 1,
              total: result?.total,
              pageSize: result?.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              // hideOnSinglePage: true,
              pageSizeOptions: ['8', '16', '40', '80'],
              style: { marginTop: -20 },
              showTotal: (total: number) =>
                `共 ${total} 条记录 第  ${result.pageIndex + 1}/${Math.ceil(
                  result.total / result.pageSize,
                )}页`,
              onChange,
              onShowSizeChange,
            }}
            renderItem={item => {
              if (item && item.id) {
                return (
                  <List.Item key={item.id}>
                    <Card hoverable bodyStyle={{ paddingBottom: 20 }}
                      actions={[
                        <Tooltip key="seeProduct" title="查看">
                          <Icon
                            type="eye"
                            onClick={() => {
                              setDetailVisible(true);
                              setDetailData(item);
                              // message.warn('该功能规划中，敬请期待');
                            }}
                          />
                        </Tooltip>,
                        <Tooltip key="update" title='编辑'>
                          <Icon
                            type="edit"
                            onClick={() => {
                              if (item.modelType === 'node-red') {
                                window.open(`/jetlinks/rule-editor/index.html#flow/${item.id}`)
                              } else if (item.modelType === 'sql_rule') {
                                try {
                                  let data = JSON.parse(item.modelMeta);
                                  data['id'] = item.id;
                                  setCurrent(data);
                                  setSaveSqlRuleVisible(true);
                                } catch (error) {
                                  message.error('数据异常，请至数据转发界面检查数据');
                                }
                              } else if (item.modelType === 'device_alarm') {
                                updateDeviceAlarm(item);
                              } else if (item.modelType === 'rule-scene') {
                                setDetailData(item);
                                setSceneVisible(true);
                              }
                            }}
                          />
                        </Tooltip>,
                        <Tooltip key="more_actions" title=''>
                          <Dropdown overlay={
                            <Menu>
                              <Menu.Item key="1">
                                <Popconfirm
                                  placement="topRight"
                                  title={item.state?.value === 'stopped' ? '确认启动？' : '确认停止？'}
                                  onConfirm={() => {
                                    if (item.state?.value === 'stopped') {
                                      startInstance(item);
                                    } else {
                                      stopInstance(item);
                                    }
                                  }}
                                >
                                  <Button icon={item.state?.value === 'stopped' ? 'check' : 'close'} type="link">
                                    {item.state?.value === 'stopped' ? '启动' : '停止'}
                                  </Button>
                                </Popconfirm>
                              </Menu.Item>
                              <Menu.Item key="4">
                                <Button icon="copy" type="link"
                                  onClick={() => {
                                    startInstance(item);
                                  }}>
                                  重启
                                      </Button>
                              </Menu.Item>
                              {item.modelType === 'node-red' && (
                                <Menu.Item key="3">
                                  <Button icon="copy" type="link"
                                    onClick={() => {
                                      setRuleData(item);
                                      setSaveVisible(true);
                                    }}>
                                    复制
                                      </Button>
                                </Menu.Item>
                              )}
                              {item.state?.value === 'stopped' && (
                                <Menu.Item key="2">
                                  <Popconfirm
                                    placement="topRight"
                                    title="确定删除此组件吗？"
                                    onConfirm={() => {
                                      handleDelete(item);
                                    }}
                                  >
                                    <Button icon="delete" type="link">
                                      删除
                                        </Button>
                                  </Popconfirm>
                                </Menu.Item>
                              )}
                            </Menu>
                          }>
                            <Icon type="ellipsis" />
                          </Dropdown>
                        </Tooltip>,
                      ]}
                    >
                      <Card.Meta
                        avatar={logoMap[item.modelType]}
                        title={<AutoHide title={item.name} style={{ width: '95%', fontWeight: 600 }} />}
                        description={<AutoHide title={item.id} style={{ width: '95%' }} />}
                      />
                      <div className={cardStyles.cardItemContent}>
                        <div className={cardStyles.cardInfo}>
                          {/* <div style={{ textAlign: 'center', width: '33%' }}>
                            <p style={cardInfoTitle}>模型版本</p>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>{item.modelVersion}</p>
                          </div> */}
                          <div style={{ textAlign: 'center', width: '50%' }}>
                            <p style={cardInfoTitle}>规则类型</p>
                            <p style={{ fontSize: 14 }}>
                              {modelType.get(item.modelType)}
                            </p>
                          </div>
                          <div style={{ textAlign: 'center', width: '50%' }}>
                            <p style={cardInfoTitle}>状态</p>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>
                              <Badge color={item.state?.value === 'stopped' ? 'red' : 'green'}
                                text={item.state?.value === 'stopped' ? '已停止' : '已启动'} />
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                );
              }
              return '';
            }}
          />
        )}
      </div>
      {sceneVisible && (
        <SceneSave
          data={detailData}
          close={() => {
            setSceneVisible(false);
            setDetailData({});
            handleSearch(searchParam);
          }}
        />
      )}
      {saveVisible && (
        <Save
          data={ruleData}
          close={() => {
            setSaveVisible(false);
            setRuleData({});
            handleSearch(searchParam);
          }}
        />
      )}
      {detailVisible && (
        <Detail
          data={detailData}
          close={() => {
            setDetailVisible(false);
            setDetailData({});
          }}
        />
      )}
      {saveSqlRuleVisible && (
        <SqlRuleSave
          data={current}
          close={() => {
            setSaveSqlRuleVisible(false);
            setCurrent({});
          }}
          save={(item: RuleInstanceItem) => {
            saveOrUpdate(item);
          }}
        />
      )}
      {saveAlarmVisible && <AlarmSave
        close={() => {
          setDeviceAlarm({});
          setDeviceMateData("");
          setSaveAlarmVisible(false);
        }}
        save={(data: any) => {
          submitData(data);
        }}
        data={deviceAlarm} targetId={deviceAlarm.targetId}
        target={deviceAlarm.target} metaData={deviceMateData}
        name={deviceAlarm.name} productName={deviceAlarm.alarmRule.productName}
        productId={deviceAlarm.alarmRule.productId}
      />}
    </PageHeaderWrapper>
  );
};
export default connect(({ ruleInstance, loading }: ConnectState) => ({
  ruleInstance,
  loading: loading.models.ruleInstance,
}))(RuleInstanceList);
