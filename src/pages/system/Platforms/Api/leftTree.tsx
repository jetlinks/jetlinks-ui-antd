import { Tree } from 'antd';
import React, { useState } from 'react';
import { queryChannel } from '@/pages/media/SplitScreen/service';

type LeftTreeType = {
  onSelect: (id: string) => void;
};

interface DataNode {
  name: string;
  id: string;
  isLeaf?: boolean;
  icon?: React.ReactNode;
  children?: DataNode[];
}

export default (props: LeftTreeType) => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  /**
   * 是否为子节点
   * @param node
   */
  const isLeaf = (node: DataNode): boolean => {
    if (node.children) {
      return false;
    }
    return true;
  };

  const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] => {
    return list.map((node) => {
      if (node.id === key) {
        return {
          ...node,
          children: node.children ? [...node.children, ...children] : children,
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
  };

  const getChildren = (key: React.Key, params: any): Promise<any> => {
    return new Promise(async (resolve) => {
      const resp = await queryChannel(params);
      if (resp.status === 200) {
        const { total, pageIndex, pageSize } = resp.result;
        setTreeData((origin) => {
          const data = updateTreeData(
            origin,
            key,
            resp.result.data.map((item: DataNode) => ({
              ...item,
              isLeaf: isLeaf(item),
            })),
          );

          if (total > (pageIndex + 1) * pageSize) {
            setTimeout(() => {
              getChildren(key, {
                ...params,
                pageIndex: params.pageIndex + 1,
              });
            }, 50);
          }

          return data;
        });
        resolve(resp.result);
      }
    });
  };

  const onLoadData = ({ key, children }: any): Promise<void> => {
    return new Promise(async (resolve) => {
      if (children) {
        resolve();
        return;
      }
      await getChildren(key, {
        pageIndex: 0,
        pageSize: 100,
        terms: [
          {
            column: 'deviceId',
            value: key,
          },
        ],
      });
      resolve();
    });
  };

  return (
    <Tree
      showIcon
      showLine={{ showLeafIcon: false }}
      height={550}
      fieldNames={{
        title: 'name',
        key: 'id',
      }}
      onSelect={(_, { node }: any) => {
        if (props.onSelect && node.isLeaf) {
          props.onSelect(node.id);
        }
      }}
      loadData={onLoadData}
      treeData={treeData}
    />
  );
};
