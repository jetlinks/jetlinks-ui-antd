import { Button, Modal, Transfer, Tree } from 'antd';
import type { TransferDirection, TransferItem } from 'antd/es/transfer';
import { DataNode } from 'antd/es/tree';
import { useEffect, useState } from 'react';

interface Props {
  // data: Partial<PointItem>;
  close: () => void;
  reload: () => void;
}

interface TreeTransferProps {
  dataSource: DataNode[];
  targetKeys: string[];
  onChange: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
}

const TreeTransfer = ({ dataSource, targetKeys, ...restProps }: TreeTransferProps) => {
  const transferDataSource: TransferItem[] = [];
  function flatten(list: DataNode[] = []) {
    list.forEach((item) => {
      transferDataSource.push(item as TransferItem);
      flatten(item.children);
    });
  }
  useEffect(() => {
    flatten(dataSource);
  }, [dataSource]);

  // Customize Table Transfer
  const isChecked = (selectedKeys: (string | number)[], eventKey: string | number) =>
    selectedKeys.includes(eventKey);

  const generateTree = (treeNodes: DataNode[] = [], checkedKeys: string[] = []): DataNode[] =>
    treeNodes.map(({ children, ...props }) => ({
      ...props,
      disabled: checkedKeys.includes(props.key as string),
      children: generateTree(children, checkedKeys),
    }));

  // const queryTree = (treeNodes: DataNode[] = [], key: string) => {
  //   treeNodes.forEach(item => {
  //     if(item.key === key){
  //       return item
  //     }
  //     if (item.children) {
  //       return queryTree(item.children)
  //     }
  //     return {}
  //   })
  //   return {}
  // }
  //
  // const generateTargetTree = (treeNodes: DataNode[] = []) => {
  //   return targetKeys.map(item => {
  //     const obj = {}
  //     const obj = treeNodes.find(i => item === i.key)
  //     return obj
  //   })
  // }

  console.log(targetKeys);

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={(item) => item.title!}
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={checkedKeys}
              treeData={generateTree(dataSource, targetKeys)}
              onCheck={(_, { node: { key } }) => {
                onItemSelect(key as string, !isChecked(checkedKeys, key));
              }}
              onSelect={(_, { node: { key } }) => {
                onItemSelect(key as string, !isChecked(checkedKeys, key));
              }}
            />
          );
        } else {
          return <Tree blockNode defaultExpandAll treeData={[]} />;
        }
      }}
    </Transfer>
  );
};

export default (props: Props) => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const onChange = (keys: string[]) => {
    setTargetKeys(keys);
  };

  const treeData: DataNode[] = [
    { key: '0-0', title: '0-0' },
    {
      key: '0-1',
      title: '0-1',
      children: [
        { key: '0-1-0', title: '0-1-0' },
        { key: '0-1-1', title: '0-1-1' },
      ],
    },
    { key: '0-2', title: '0-3' },
  ];

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
      <TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={onChange} />;
    </Modal>
  );
};
