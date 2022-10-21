import { DownOutlined, PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Tree, Space, Popconfirm } from 'antd';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { Empty } from '@/components';
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
  change: (key: string, type: 'channel' | 'device', provider: 'OPC_UA' | 'MODBUS_TCP') => void;
}

export default observer((props: Props) => {
  const channelImg = require('/public/images/DataCollect/tree-channel.png');
  const deviceImg = require('/public/images/DataCollect/tree-device.png');

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
  }, [TreeModel.param]);

  return (
    <div>
      <div>
        <Input.Search
          placeholder="搜索"
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
                        <div className={'ellipsis'}>{item.name}</div>
                      </div>
                      <div>
                        <Space className={styles.iconColor}>
                          <FormOutlined
                            onClick={() => {
                              TreeModel.current = item;
                              TreeModel.visible = true;
                            }}
                          />
                          <Popconfirm
                            title={'确认删除？'}
                            onConfirm={async () => {
                              const resp = await service.removeChannel(item.id);
                              if (resp.status === 200) {
                                TreeModel.param = {};
                                handleSearch(TreeModel.param);
                                onlyMessage('操作成功');
                              }
                            }}
                          >
                            <DeleteOutlined />
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
                            props.change(i.id, 'device', item.provider);
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
          }}
        />
      )}
    </div>
  );
});
