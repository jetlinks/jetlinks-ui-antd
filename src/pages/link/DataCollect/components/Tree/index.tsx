import {
  DownOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  StopOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Button, Input, Tree, Space, Popconfirm, Tooltip } from 'antd';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { BadgeStatus, Empty, PermissionButton } from '@/components';
import styles from './index.less';
import service from '@/pages/link/DataCollect/service';
import { useEffect } from 'react';
import Save from '../../components/Channel/Save/index';
import CollectorSave from '../../components/Device/Save/index';
import { onlyMessage } from '@/utils/util';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { useIntl } from '@@/plugin-locale/localeExports';

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
}

export default observer((props: Props) => {
  const channelImg = require('/public/images/DataCollect/tree-channel.png');
  const deviceImg = require('/public/images/DataCollect/tree-device.png');
  const { permission } = PermissionButton.usePermission('link/DataCollect/DataGathering');
  const intl = useIntl();

  const handleSearch = (params: any) => {
    TreeModel.loading = true;
    TreeModel.param = params;
    service
      .queryChannelTree({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
      .then((resp) => {
        if (resp.status === 200) {
          TreeModel.dataSource = resp.result;
          if (resp.result.length) {
            TreeModel.selectedKeys = [resp.result[0].id];
            props.change(resp.result[0].id, 'channel', resp.result[0].provider);
          }
        }
        TreeModel.loading = false;
      });
  };

  useEffect(() => {
    handleSearch(TreeModel.param);
  }, [TreeModel.param, props.reload]);

  const getState = (record: Partial<ChannelItem>): { text: string; value: string } => {
    if (record) {
      if (record?.state?.value === 'enabled') {
        return {
          text: record?.runningState?.text || '',
          value: record?.runningState?.value || '',
        };
      } else {
        return {
          text: '禁用',
          value: 'disabled',
        };
      }
    }
    return {
      text: '',
      value: '',
    };
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
          style={{ width: '100%' }}
          icon={<PlusOutlined />}
          onClick={() => {
            TreeModel.visible = true;
            TreeModel.current = {};
          }}
        >
          新增
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
                        <div className={'ellipsis'}>
                          <BadgeStatus
                            status={
                              item && getState(item) && getState(item)?.value
                                ? getState(item).value
                                : ''
                            }
                            text={item.name}
                            statusNames={{
                              running: StatusColorEnum.success,
                              disabled: StatusColorEnum.processing,
                              partialError: StatusColorEnum.warning,
                              failed: StatusColorEnum.error,
                              stopped: StatusColorEnum.default,
                            }}
                          />
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
                            title={'该操作将会删除下属采集器与点位，确定删除？'}
                            onConfirm={async () => {
                              const resp = await service.removeChannel(item.id);
                              if (resp.status === 200) {
                                TreeModel.param = {};
                                handleSearch(TreeModel.param);
                                onlyMessage('操作成功');
                              }
                            }}
                          >
                            <Tooltip title={!permission.delete ? '暂无权限，请联系管理员' : ''}>
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
                            <div style={{ width: '120px' }} className={'ellipsis'}>
                              {i.name}
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
                                        })
                                      : await service.updateCollector(i.id, {
                                          state: 'enabled',
                                        });
                                  if (resp.status === 200) {
                                    TreeModel.param = {};
                                    handleSearch(TreeModel.param);
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
                                title={'该操作将会删除下属采集器与点位，确定删除？'}
                                onConfirm={async () => {
                                  const resp = await service.removeCollector(i.id);
                                  if (resp.status === 200) {
                                    TreeModel.param = {};
                                    handleSearch(TreeModel.param);
                                    onlyMessage('操作成功');
                                  }
                                }}
                              >
                                <Tooltip title={!permission.delete ? '暂无权限，请联系管理员' : ''}>
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
