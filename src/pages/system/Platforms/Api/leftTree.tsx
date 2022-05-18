import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { service } from '@/pages/system/Platforms';
import { ApiModel } from '@/pages/system/Platforms/Api/base';

type LeftTreeType = {
  onSelect: (data: any) => void;
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
    console.log(newArr);
    return newArr;
  };

  const getChildren = (key: string, name: string): Promise<any> => {
    return new Promise(async (resolve) => {
      const resp = await service.getApiNextLevel(name);
      if (resp) {
        ApiModel.components = resp.components;
        ApiModel.baseUrl = resp.servers[0].url;
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
    console.log(node);
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
