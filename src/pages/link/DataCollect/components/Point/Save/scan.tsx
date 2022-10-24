import { Button, Empty, Modal, Transfer, Tree } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { useEffect, useState } from 'react';
import service from '@/pages/link/DataCollect/service';
import './scan.less';
import { CloseOutlined } from '@ant-design/icons';

interface Props {
  channelId?: string;
  close: () => void;
  reload: () => void;
}

interface TreeTransferProps {
  dataSource: any[];
  targetKeys: string[];
  onChange: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
  channelId?: string;
}

const TreeTransfer = ({ dataSource, targetKeys, channelId, ...restProps }: TreeTransferProps) => {
  const [transferDataSource, setTransferDataSource] = useState<any[]>(dataSource);

  const isChecked = (selectedKeys: (string | number)[], eventKey: string | number) =>
    selectedKeys.includes(eventKey);

  const generateTree = (treeNodes: any[] = [], checkedKeys: string[] = []): any[] =>
    treeNodes.map(({ children, ...props }) => ({
      ...props,
      disabled: checkedKeys.includes(props.key as string),
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
    return treeNodes.map((item) => queryDataByID(transferDataSource, item));
  };

  const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] =>
    list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });

  const onLoadData = ({ key, children }: any) =>
    new Promise<void>(async (resolve) => {
      if (children) {
        resolve();
        return;
      }
      const resp = await service.scanOpcUAList({
        id: channelId,
        nodeId: key,
      });
      if (resp.status === 200) {
        setTransferDataSource((origin) => updateTreeData(origin, key, resp.result));
      }
      resolve();
    });

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      render={(item) => item.title!}
      showSelectAll={false}
      titles={['源数据', '目标数据']}
      oneWay
    >
      {({ direction, onItemSelect, selectedKeys, onItemRemove }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <div style={{ margin: '10px 0' }}>
              <Tree
                blockNode
                checkable
                checkStrictly
                checkedKeys={checkedKeys}
                height={250}
                treeData={generateTree(dataSource, targetKeys)}
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
                      <div>{item.title || item.key}</div>
                      <div>
                        <CloseOutlined
                          onClick={() => {
                            if (onItemRemove) {
                              onItemRemove([item.key]);
                            }
                          }}
                        />
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
  // const [treeData, setTreeData] = useState<any[]>([]);
  const onChange = (keys: string[]) => {
    setTargetKeys(keys);
  };

  useEffect(() => {
    if (props.channelId) {
      service
        .scanOpcUAList({
          id: props.channelId,
        })
        .then((resp) => {
          if (resp.status === 200) {
            const list = resp.result.map((item: any) => {
              return {
                ...item,
                key: item.id,
                title: item.name,
              };
            });
            setTreeData(list);
          }
        });
    }
  }, [props.channelId]);

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
          onClick={() => {
            // save();
          }}
        >
          确定
        </Button>,
      ]}
    >
      <TreeTransfer
        channelId={props.channelId}
        dataSource={treeData}
        targetKeys={targetKeys}
        onChange={onChange}
      />
    </Modal>
  );
};
