import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Dropdown, Icon, List, Menu, message, Popconfirm, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { connect } from 'dva';
import { ConnectState, Dispatch } from '@/models/connect';
import encodeQueryParam from '@/utils/encodeParam';
import apis from '@/services';
import SearchForm from '@/components/SearchForm';
import AutoHide from '@/pages/analysis/components/Hide/autoHide';
// import DeviceAlarm from "@/pages/rule-engine/scene/img/DeviceAlarm.png";
import DeviceAlarm from '@/pages/rule-engine/scene/img/scene.svg'
import Save from './save/index';
import Detail from './detail/index';

interface Props {
  ruleInstance: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  sceneList: any,
  saveVisible: boolean;
  detailVisible: boolean,
  detailData: any;
}

const RuleInstanceList: React.FC<Props> = props => {
  const { result } = props.ruleInstance;

  const initState: State = {
    data: result,
    searchParam: {
      pageSize: 8, sorts: {
        order: "descend",
        field: "createTime"
      }
    },
    sceneList: {},
    saveVisible: false,
    detailVisible: false,
    detailData: {},
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [sceneList, setSceneList] = useState(initState.sceneList);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [detailVisible, setDetailVisible] = useState(initState.detailVisible);
  const [detailData, setDetailData] = useState(initState.detailData);
  const statusType = new Map();
  statusType.set('disable', '已禁用');
  statusType.set('started', '已启动');
  statusType.set('stopped', '已停止');

  const statusColor = new Map();
  statusColor.set('disable', 'red');
  statusColor.set('started', 'green');
  statusColor.set('stopped', 'blue');

  const triggerType = new Map();
  triggerType.set("manual", '手动触发')
  triggerType.set("timer", '定时触发')
  triggerType.set("device", '设备触发')
  triggerType.set("scene", '场景触发')

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    apis.scene.list(encodeQueryParam(params)).then(res => {
      if (res.status === 200) {
        setSceneList(res.result);
      }
    })
  };

  const onChange = (page: number, pageSize: number) => {
    handleSearch({
      pageIndex: page - 1,
      pageSize,
      terms: searchParam.terms,
      sorts: searchParam.sorts,
    });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  return (
    <PageHeaderWrapper title="场景联动">
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
                      { id: 'started', name: '已启动' },
                      { id: 'disable', name: '已禁用' },
                    ]
                  }
                },
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
                setDetailData({
                  id: '',
                  name: '',
                  triggers: [],
                  parallel: false,
                  actions: []
                })
              }}>
              新增场景联动
            </Button>
          </div>
        </div>
      </Card>
      <br />
      <div>
        {sceneList.data && (
          <List<any>
            rowKey="id"
            loading={props.loading}
            grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            dataSource={sceneList?.data || []}
            pagination={{
              current: sceneList?.pageIndex + 1,
              total: sceneList?.total,
              pageSize: sceneList?.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['8', '16', '40', '80'],
              style: { marginTop: -20 },
              onChange,
              showTotal: (total: number) =>
                `共 ${total} 条记录 第  ${sceneList.pageIndex + 1}/${Math.ceil(
                  sceneList.total / sceneList.pageSize,
                )}页`
            }}
            renderItem={item => {
              if (item && item.id) {
                return (
                  <List.Item key={item.id}>
                    <Card hoverable bodyStyle={{ paddingBottom: 20 }}
                      actions={[
                        // <Tooltip key="seeProduct" title="查看">
                        //   <Icon
                        //     type="eye"
                        //     onClick={() => {
                        //       setDetailVisible(true);
                        //       setDetailData(item);
                        //     }}
                        //   />
                        // </Tooltip>,
                        <Tooltip key="update" title='编辑'>
                          <Icon
                            type="edit"
                            onClick={() => {
                              setDetailData(item);
                              setSaveVisible(true)
                            }}
                          />
                        </Tooltip>,
                        <Tooltip key="more_actions" title=''>
                          <Dropdown overlay={
                            <Menu>
                              {item.state?.value === 'started' && (
                                <Menu.Item key="2">
                                  <Popconfirm
                                    placement="topRight"
                                    title="确定执行场景吗？"
                                    onConfirm={() => {
                                      apis.scene.perform(item.id).then(res => {
                                        if (res.status === 200) {
                                          message.success('操作成功')
                                          handleSearch(searchParam);
                                        }
                                      })
                                    }}
                                  >
                                    <Button icon="tool" type="link">执行</Button>
                                  </Popconfirm>
                                </Menu.Item>)}
                              {item.state?.value === 'started' && (
                                <Menu.Item key="1">
                                  <Popconfirm
                                    placement="topRight"
                                    title='确认停止？'
                                    onConfirm={() => {
                                      apis.scene.stop(item.id).then(res => {
                                        if (res.status === 200) {
                                          message.success('操作成功')
                                          handleSearch(searchParam);
                                        }
                                      })
                                    }}
                                  >
                                    <Button icon='close' type="link">停止</Button>
                                  </Popconfirm>
                                </Menu.Item>
                              )}
                              {item.state?.value === 'stopped' && (
                                <Menu.Item key="3">
                                  <Popconfirm
                                    placement="topRight"
                                    title='确认启动？'
                                    onConfirm={() => {
                                      apis.scene.start(item.id).then(res => {
                                        if (res.status === 200) {
                                          message.success('操作成功')
                                          handleSearch(searchParam);
                                        }
                                      })
                                    }}
                                  >
                                    <Button icon='check' type="link">启动</Button>
                                  </Popconfirm>
                                </Menu.Item>)}
                              {item.state?.value === 'stopped' && (
                                <Menu.Item key="4">
                                  <Popconfirm
                                    placement="topRight"
                                    title="确定删除此场景吗？"
                                    onConfirm={() => {
                                      apis.scene.remove(item.id).then(res => {
                                        if (res.status === 200) {
                                          message.success('操作成功')
                                          handleSearch(searchParam);
                                        }
                                      })
                                    }}
                                  >
                                    <Button icon="delete" type="link">删除</Button>
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
                        avatar={<Avatar size={40} src={DeviceAlarm} />}
                        title={<AutoHide title={item.name} style={{ width: '95%', fontWeight: 600 }} />}
                        description={<AutoHide title={item.id} style={{ width: '95%' }} />}
                      />
                      <div>
                        <div style={{ display: 'flex', marginTop: '10px', height: '70px' }}>
                          <div style={{ textAlign: 'center', width: '50%' }}>
                            <p>触发方式</p>
                            <p style={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }}>
                              {
                                item.triggers.map((i: any) => {
                                  return triggerType.get(i.trigger) + ' '
                                })
                              }
                            </p>
                          </div>
                          <div style={{ textAlign: 'center', width: '50%' }}>
                            <p>场景状态</p>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>
                              <Badge color={statusColor.get(item.state?.value)}
                                text={statusType.get(item.state?.value) || "---"} />
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
      {saveVisible && (
        <Save
          data={detailData}
          close={() => {
            setSaveVisible(false);
            setDetailData({});
            handleSearch(searchParam);
          }}
          save={(data: any) => {
            setSaveVisible(false);
            handleSearch(searchParam);
          }}
        />
      )}
      {detailVisible && (
        <Detail
          data={detailData}
          close={() => {
            setDetailData({});
            setDetailVisible(false);
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ ruleInstance, loading }: ConnectState) => ({
  ruleInstance,
  loading: loading.models.ruleInstance,
}))(RuleInstanceList);
