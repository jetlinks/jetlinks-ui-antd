import {
  DownOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  StopOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Button, Input, Tree, Space, Popconfirm, Tooltip, Tag } from 'antd';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { Ellipsis, Empty, PermissionButton } from '@/components';
import styles from './index.less';
import service from '@/pages/link/DataCollect/service';
import { useEffect } from 'react';
import Save from '../../components/Channel/Save/index';
import CollectorSave from '../../components/Device/Save/index';
import { onlyMessage } from '@/utils/util';
// import { StatusColorEnum } from '@/components/BadgeStatus';
import { useIntl } from '@@/plugin-locale/localeExports';
import { DataCollectModel } from '../../DataGathering';

const TreeModel = model<{
  selectedKeys: string[];
  dataSource: any[];
  loading: boolean;
  param: any;
  visible: boolean;
  current: any;
  c_visible: boolean;
  c_current: any;
}>({
  selectedKeys: [],
  dataSource: [],
  loading: true,
  param: {},
  visible: false,
  current: {},
  c_visible: false,
  c_current: {},
});
interface Props {
  change: (
    key: string,
    type: 'channel' | 'device',
    provider: 'OPC_UA' | 'MODBUS_TCP',
    data?: any,
  ) => void;
  reload?: boolean;
  onReload: () => void;
}

export default observer((props: Props) => {
  const channelImg = require('/public/images/DataCollect/tree-channel.png');
  const deviceImg = require('/public/images/DataCollect/tree-device.png');
  const { permission } = PermissionButton.usePermission('link/DataCollect/DataGathering');
  const intl = useIntl();

  const handleSearch = (params: any, reload?: boolean) => {
    TreeModel.loading = true;
    TreeModel.param = params;
    service
      .queryChannelTree({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
      .then((resp) => {
        if (resp.status === 200) {
          TreeModel.dataSource = resp.result;
          if (resp.result.length) {
            if (!reload) {
              TreeModel.selectedKeys = [resp.result[0].id];
            }
            const provider = !reload ? resp.result[0].provider : DataCollectModel.provider;
            props.change(TreeModel.selectedKeys[0], 'channel', provider);
          }
        }
        TreeModel.loading = false;
      });
  };

  useEffect(() => {
    handleSearch(TreeModel.param, false);
  }, [TreeModel.param]);

  useEffect(() => {
    handleSearch(TreeModel.param, true);
  }, [props.reload]);

  const getState = (record: any) => {
    if (record) {
      const colorMap = new Map();
      colorMap.set('running', 'success');
      colorMap.set('partialError', 'warning');
      colorMap.set('failed', 'error');
      colorMap.set('stopped', 'default');
      if (record?.state?.value === 'enabled') {
        return (
          record?.runningState && (
            <Tag color={colorMap.get(record?.runningState?.value)}>
              {record?.runningState?.text}
            </Tag>
          )
        );
      } else {
        return <Tag color="processing">禁用</Tag>;
      }
    } else {
      return '';
    }
  };

  return (
    <div>
      <div>
        <Input.Search
          placeholder="请输入名称"
          allowClear
          onSearch={(val) => {
            TreeModel.param = {
              terms: [{ column: 'name', value: `%${val}%`, termType: 'like' }],
            };
          }}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ margin: '16px 0' }}>
        <Button
          type="primary"
          ghost
          style={{ width: '100%' }}
          icon={<PlusOutlined />}
          onClick={() => {
            TreeModel.visible = true;
            TreeModel.current = {};
          }}
        >
          新增通道
        </Button>
      </div>
      <div>
        {TreeModel.dataSource.length ? (
          <Tree
            style={{ overflow: 'hidden' }}
            showIcon
            selectedKeys={TreeModel.selectedKeys}
            switcherIcon={<DownOutlined />}
          >
            {(TreeModel.dataSource || []).map((item: any) => (
              <Tree.TreeNode
                key={item.id}
                title={() => {
                  return (
                    <div className={styles.treeTitle}>
                      <div
                        className={styles.title}
                        onClick={() => {
                          TreeModel.selectedKeys = [item.id];
                          props.change(item.id, 'channel', item.provider);
                        }}
                      >
                        <img width={'20px'} style={{ marginRight: 5 }} src={channelImg} />
                        <div style={{ display: 'flex' }}>
                          <Ellipsis title={item.name} style={{ marginRight: 5, maxWidth: 120 }} />
                          {getState(item)}
                        </div>
                      </div>
                      <div>
                        <Space className={styles.iconColor}>
                          <Tooltip title={!permission.update ? '暂无权限，请联系管理员' : ''}>
                            <FormOutlined
                              onClick={() => {
                                if (permission.update) {
                                  TreeModel.current = item;
                                  TreeModel.visible = true;
                                }
                              }}
                            />
                          </Tooltip>
                          <Popconfirm
                            title={intl.formatMessage({
                              id: `pages.data.option.${
                                item?.state?.value !== 'disabled' ? 'disabled' : 'enabled'
                              }.tips`,
                              defaultMessage: '确认禁用？',
                            })}
                            onConfirm={async () => {
                              const resp =
                                item?.state?.value !== 'disabled'
                                  ? await service.updateChannel(item.id, {
                                      state: 'disabled',
                                      runningState: 'stopped',
                                    })
                                  : await service.updateChannel(item.id, {
                                      state: 'enabled',
                                      runningState: 'running',
                                    });
                              if (resp.status === 200) {
                                TreeModel.param = {};
                                handleSearch(TreeModel.param);
                                props.onReload();
                                onlyMessage('操作成功');
                              } else {
                                onlyMessage('操作失败！', 'error');
                              }
                            }}
                          >
                            <Tooltip title={!permission.action ? '暂无权限，请联系管理员' : ''}>
                              {item?.state?.value !== 'disabled' ? (
                                <StopOutlined />
                              ) : (
                                <PlayCircleOutlined />
                              )}
                            </Tooltip>
                          </Popconfirm>
                          <Popconfirm
                            title={'该操作将会删除下属采集器与点位，确定删除？'}
                            disabled={item?.state?.value !== 'disabled'}
                            onConfirm={async () => {
                              const resp = await service.removeChannel(item.id);
                              if (resp.status === 200) {
                                TreeModel.param = {};
                                handleSearch(TreeModel.param);
                                onlyMessage('操作成功');
                              }
                            }}
                          >
                            <Tooltip
                              title={
                                !permission.delete
                                  ? '暂无权限，请联系管理员'
                                  : item?.state?.value !== 'disabled'
                                  ? '正常的通道不能删除'
                                  : ''
                              }
                            >
                              <DeleteOutlined />
                            </Tooltip>
                          </Popconfirm>
                        </Space>
                      </div>
                    </div>
                  );
                }}
              >
                {(item?.collectors || []).map((i: any) => (
                  <Tree.TreeNode
                    key={i.id}
                    title={() => {
                      return (
                        <div className={styles.treeTitle} style={{ paddingRight: 24 }}>
                          <div
                            className={styles.title}
                            onClick={() => {
                              TreeModel.selectedKeys = [i.id];
                              props.change(i.id, 'device', item.provider, i);
                            }}
                          >
                            <img width={'20px'} style={{ marginRight: 5 }} src={deviceImg} />
                            <div style={{ display: 'flex' }}>
                              <span
                                className={'ellipsis'}
                                style={{
                                  marginRight: 5,
                                  maxWidth: 90,
                                  color: 'rgba(0, 0, 0, 0.6)',
                                }}
                              >
                                {i.name}
                              </span>
                              {getState(i)}
                            </div>
                          </div>
                          <div>
                            <Space className={styles.iconColor}>
                              <Tooltip title={!permission.update ? '暂无权限，请联系管理员' : ''}>
                                <FormOutlined
                                  onClick={() => {
                                    if (permission.update) {
                                      TreeModel.current = item;
                                      TreeModel.c_visible = true;
                                      TreeModel.c_current = i;
                                    }
                                  }}
                                />
                              </Tooltip>
                              <Popconfirm
                                title={intl.formatMessage({
                                  id: `pages.data.option.${
                                    i?.state?.value !== 'disabled' ? 'disabled' : 'enabled'
                                  }.tips`,
                                  defaultMessage: '确认禁用？',
                                })}
                                onConfirm={async () => {
                                  const resp =
                                    i?.state?.value !== 'disabled'
                                      ? await service.updateCollector(i.id, {
                                          state: 'disabled',
                                          runningState: 'stopped',
                                        })
                                      : await service.updateCollector(i.id, {
                                          state: 'enabled',
                                          runningState: 'running',
                                        });
                                  if (resp.status === 200) {
                                    TreeModel.param = {};
                                    handleSearch(TreeModel.param);
                                    props.onReload();
                                    onlyMessage('操作成功');
                                  } else {
                                    onlyMessage('操作失败！', 'error');
                                  }
                                }}
                              >
                                <Tooltip title={!permission.action ? '暂无权限，请联系管理员' : ''}>
                                  {i?.state?.value !== 'disabled' ? (
                                    <StopOutlined />
                                  ) : (
                                    <PlayCircleOutlined />
                                  )}
                                </Tooltip>
                              </Popconfirm>
                              <Popconfirm
                                title={'该操作将会删除下属点位，确定删除？'}
                                disabled={i?.state?.value !== 'disabled'}
                                onConfirm={async () => {
                                  const resp = await service.removeCollector(i.id);
                                  if (resp.status === 200) {
                                    TreeModel.param = {};
                                    handleSearch(TreeModel.param);
                                    onlyMessage('操作成功');
                                  }
                                }}
                              >
                                <Tooltip
                                  title={
                                    !permission.delete
                                      ? '暂无权限，请联系管理员'
                                      : i?.state?.value !== 'disabled'
                                      ? '正常的采集器不能删除'
                                      : ''
                                  }
                                >
                                  <DeleteOutlined />
                                </Tooltip>
                              </Popconfirm>
                            </Space>
                          </div>
                        </div>
                      );
                    }}
                  />
                ))}
              </Tree.TreeNode>
            ))}
          </Tree>
        ) : (
          <Empty />
        )}
      </div>
      {TreeModel.visible && (
        <Save
          data={TreeModel.current}
          close={() => {
            TreeModel.visible = false;
          }}
          reload={() => {
            TreeModel.visible = false;
            handleSearch(TreeModel.param);
          }}
        />
      )}
      {TreeModel.c_visible && (
        <CollectorSave
          data={TreeModel.c_current}
          channelId={TreeModel.current.id}
          provider={TreeModel.current.provider}
          close={() => {
            TreeModel.c_visible = false;
          }}
          reload={() => {
            TreeModel.c_visible = false;
            TreeModel.param = {};
            handleSearch(TreeModel.param);
          }}
        />
      )}
    </div>
  );
});
