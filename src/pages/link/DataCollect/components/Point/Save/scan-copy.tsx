import { Button, Empty, Modal, Popconfirm, Spin, Transfer, Tree } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { useEffect, useState } from 'react';
import service from '@/pages/link/DataCollect/service';
import './scan.less';
import { CloseOutlined } from '@ant-design/icons';
import { Ellipsis } from '@/components';
import { onlyMessage } from '@/utils/util';

interface Props {
  collector?: any;
  close: () => void;
  reload: () => void;
}

interface TreeTransferProps {
  dataSource: any[];
  targetKeys: string[];
  onChange: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
  channelId?: string;
  arrChange: (arr: any[]) => void;
}

const TreeTransfer = ({
  dataSource,
  targetKeys,
  channelId,
  arrChange,
  ...restProps
}: TreeTransferProps) => {
  const [transferDataSource, setTransferDataSource] = useState<any[]>(dataSource);

  useEffect(() => {
    setTransferDataSource([...dataSource]);
  }, [dataSource]);

  const isChecked = (selectedKeys: (string | number)[], eventKey: string | number) =>
    selectedKeys.includes(eventKey);

  const generateTree = (treeNodes: any[] = [], checkedKeys: string[] = []): any[] =>
    treeNodes.map(({ children, ...props }) => ({
      ...props,
      disabled: checkedKeys.includes(props.key as string) || props?.folder,
      children: generateTree(children, checkedKeys),
    }));

  const queryDataByID = (list: any[] = [], key: string): any => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].key === key) {
        return list[i];
      }
      if (list[i].children) {
        return queryDataByID(list[i].children, key);
      }
    }
  };

  const generateTargetTree = (treeNodes: any[] = []): any[] => {
    const arr = treeNodes.map((item) => queryDataByID(transferDataSource, item));
    return arr;
  };

  const updateTreeData = (list: any[], key: string, children: any[]): any[] => {
    const arr = list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node?.children && node.children.length) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
    return arr;
  };

  useEffect(() => {
    arrChange(generateTargetTree(targetKeys));
  }, [targetKeys]);

  const onLoadData = (node: any) =>
    new Promise<void>(async (resolve) => {
      if (node.children.length || !node?.folder) {
        resolve();
        return;
      }
      const resp = await service.scanOpcUAList({
        id: channelId,
        nodeId: node.key,
      });
      if (resp.status === 200) {
        const list = resp.result.map((item: any) => {
          return {
            ...item,
            key: item.id,
            title: item.name,
            disabled: item?.folder,
            isLeaf: !item?.folder,
          };
        });
        const arr = updateTreeData(transferDataSource, node.key, [...list]);
        setTransferDataSource([...arr]);
      }
      resolve();
    });

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      render={(item) => item?.title}
      showSelectAll={false}
      titles={['源数据', '目标数据']}
      oneWay
    >
      {({ direction, onItemSelect, selectedKeys, onItemRemove }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <div style={{ margin: '10px' }}>
              <Tree
                blockNode
                checkable
                checkStrictly
                checkedKeys={checkedKeys}
                height={250}
                treeData={generateTree(transferDataSource, targetKeys)}
                onCheck={(_, { node: { key } }) => {
                  onItemSelect(key as string, !isChecked(checkedKeys, key));
                }}
                onSelect={(_, { node: { key } }) => {
                  onItemSelect(key as string, !isChecked(checkedKeys, key));
                }}
                loadData={onLoadData}
              />
            </div>
          );
        } else {
          if (targetKeys.length) {
            return (
              <div>
                {generateTargetTree(targetKeys).map((item) => {
                  return (
                    <div className={'right-item'} key={item.key}>
                      <div style={{ width: 'calc(100% - 30px)' }}>
                        <Ellipsis title={item?.title || item.key} />
                      </div>
                      <div style={{ width: 20, marginLeft: 10 }}>
                        <Popconfirm
                          title={'确认删除？'}
                          onConfirm={() => {
                            if (onItemRemove) {
                              onItemRemove([item.key]);
                            }
                          }}
                        >
                          <CloseOutlined />
                        </Popconfirm>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          } else {
            return <Empty style={{ marginTop: 10 }} />;
          }
        }
      }}
    </Transfer>
  );
};

export default (props: Props) => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [arr, setArr] = useState<any[]>([]);
  const onChange = (keys: any[]) => {
    setTargetKeys(keys);
  };

  useEffect(() => {
    if (props.collector?.channelId) {
      setLoading(true);
      service
        .scanOpcUAList({
          id: props.collector?.channelId,
        })
        .then((resp) => {
          if (resp.status === 200) {
            const list = resp.result.map((item: any) => {
              return {
                ...item,
                key: item.id,
                title: item.name,
                disabled: item?.folder,
              };
            });
            setTreeData(list);
          }
          setLoading(false);
        });
    }
  }, [props.collector?.channelId]);

  return (
    <Modal
      title={'扫描'}
      maskClosable={false}
      visible
      onCancel={props.close}
      width={700}
      footer={[
        <Button key={1} onClick={props.close}>
          取消
        </Button>,
        <Button
          type="primary"
          key={2}
          loading={spinning}
          onClick={async () => {
            if (!arr.length) {
              onlyMessage('请选择目标数据', 'error');
              return;
            }
            const list = arr.map((item) => {
              return {
                id: item.key,
                name: item.title,
                type: item.type,
              };
            });
            setSpinning(true);
            const resp = await service.savePointBatch(props.collector?.id, props.collector?.name, [
              ...list,
            ]);
            if (resp.status === 200) {
              onlyMessage('操作成功');
              props.reload();
            }
            setSpinning(false);
          }}
        >
          确定
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <TreeTransfer
          channelId={props.collector?.channelId}
          dataSource={treeData}
          targetKeys={targetKeys}
          onChange={onChange}
          arrChange={(li) => {
            setArr(li);
          }}
        />
      </Spin>
    </Modal>
  );
};
