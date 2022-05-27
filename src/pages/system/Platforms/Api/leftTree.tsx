import { Tree } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { service } from '@/pages/system/Platforms';
import { ApiModel } from '@/pages/system/Platforms/Api/base';

type LeftTreeType = {
  onSelect: (data: any) => void;
  /**
   * 是否只展示已授权的接口
   */
  isShowGranted?: boolean;
  grantKeys?: string[];
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

  const getLevelOne = async () => {
    const resp = await service.getApiFirstLevel();
    if (resp.urls && resp.urls.length) {
      setTreeData(resp.urls.map((item: any) => ({ ...item, id: item.url })));
    }
  };

  const updateTreeData = useCallback(
    (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] => {
      return list.map((node) => {
        if (node.id === key) {
          const newChildren = node.children ? [...node.children, ...children] : children;
          // api详情时，过滤掉没有授权的接口
          const filterChildren = props.isShowGranted
            ? newChildren.filter(
                (item: any) =>
                  item.extraData &&
                  item.extraData.some((extraItem: any) =>
                    props.grantKeys?.includes(extraItem.operationId),
                  ),
              )
            : newChildren;
          return {
            ...node,
            children: filterChildren,
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
    },
    [props.isShowGranted, props.grantKeys],
  );

  const handleTreeData = (data: any) => {
    const newArr = data.tags.map((item: any) => ({ id: item.name, name: item.name, isLeaf: true }));

    Object.keys(data.paths).forEach((a: any) => {
      Object.keys(data.paths[a]).forEach((b) => {
        const { tags, ...extraData } = data.paths[a][b];
        const tag = tags[0];
        const obj = {
          url: a,
          method: b,
          ...extraData,
        };
        const item = newArr.find((c: any) => c.id === tag);
        if (item) {
          item.extraData = item.extraData ? [...item.extraData, obj] : [obj];
        }
      });
    });
    return newArr;
  };

  const getChildren = (key: string, name: string): Promise<any> => {
    return new Promise(async (resolve) => {
      const resp = await service.getApiNextLevel(name);
      if (resp) {
        ApiModel.components = { ...ApiModel.components, ...resp.components.schemas };
        const handleData = handleTreeData(resp);
        setTreeData((origin) => {
          const data = updateTreeData(origin, key, handleData);

          return data;
        });
        resolve(resp.result);
      }
    });
  };

  const onLoadData = (node: any): Promise<void> => {
    return new Promise(async (resolve) => {
      if (node.children) {
        resolve();
        return;
      }
      await getChildren(node.key, node.name);
      resolve();
    });
  };

  useEffect(() => {
    getLevelOne();
  }, []);

  return (
    <Tree
      showIcon
      showLine={{ showLeafIcon: false }}
      height={700}
      fieldNames={{
        title: 'name',
        key: 'id',
      }}
      onSelect={(_, { node }: any) => {
        if (node.isLeaf && props.onSelect) {
          props.onSelect(node.extraData);
        }
      }}
      loadData={onLoadData}
      treeData={treeData}
    />
  );
};
