import { DownOutlined, PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Tree, Space, Popconfirm, Badge, Tooltip } from 'antd';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { Empty, PermissionButton } from '@/components';
import styles from './index.less';
import service from '@/pages/link/DataCollect/service';
import { useEffect } from 'react';
import Save from '../../components/Channel/Save/index';
import { onlyMessage } from '@/utils/util';

const TreeModel = model<{
  selectedKeys: string[];
  dataSource: any[];
  loading: boolean;
  param: any;
  visible: boolean;
  current: Partial<ChannelItem>;
}>({
  selectedKeys: [],
  dataSource: [],
  loading: true,
  param: {},
  visible: false,
  current: {},
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
          <Tree showIcon selectedKeys={TreeModel.selectedKeys} switcherIcon={<DownOutlined />}>
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
                          <Badge status={item.state?.value === 'enabled' ? 'success' : 'error'} />
                          {item.name}
                        </div>
                      </div>
                      <div>
                        <Space className={styles.iconColor}>
                          <Tooltip title={!permission.edit ? '暂无权限，请联系管理员' : ''}>
                            <FormOutlined
                              onClick={() => {
                                if (permission.edit) {
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
                        <div
                          className={styles.title}
                          onClick={() => {
                            TreeModel.selectedKeys = [i.id];
                            props.change(i.id, 'device', item.provider, i);
                          }}
                        >
                          <img width={'20px'} style={{ marginRight: 5 }} src={deviceImg} />
                          <div className={'ellipsis'}>{i.name}</div>
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
    </div>
  );
});
