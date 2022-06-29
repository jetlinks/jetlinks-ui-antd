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
  grantKeys?: string[]; // 已授权的接口
  type?: 'all' | 'empowerment' | 'authorize'; // 全部、赋权、授权
  operations?: string[]; // 能赋权的key
  showHome?: boolean;
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
      if (props.showHome) {
        const home = [
          {
            id: 'home',
            name: '首页',
            isLeaf: true,
          },
        ];
        ApiModel.data = undefined;
        setTreeData(home.concat(resp.urls.map((item: any) => ({ ...item, id: item.url }))));
      } else {
        setTreeData(resp.urls.map((item: any) => ({ ...item, id: item.url })));
      }
    }
  };

  const updateTreeData = useCallback(
    (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] => {
      return list.map((node) => {
        if (node.id === key) {
          const newChildren = node.children ? [...node.children, ...children] : children;
          // // 屏蔽掉没有子节点的接口
          // const noOperations = newChildren.filter((item: any) => {
          //   return item.extraData &&
          //     item.extraData.some((extraItem: any) =>
          //       props.operations?.includes(extraItem.operationId),
          //     )
          // })

          let filterChildren = newChildren;
          // api详情时，过滤掉没有授权的接口
          if (props.type === 'empowerment') {
            filterChildren = newChildren.filter(
              (item: any) =>
                item.extraData &&
                item.extraData.some((extraItem: any) =>
                  props.operations?.includes(extraItem.operationId),
                ),
            );
          } else if (props.type === 'authorize') {
            filterChildren = newChildren.filter(
              (item: any) =>
                item.extraData &&
                item.extraData.some((extraItem: any) =>
                  props.grantKeys?.includes(extraItem.operationId),
                ),
            );
          }

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
    [props.isShowGranted, props.grantKeys, props.type, props.operations],
  );

  const handleTreeData = (data: any) => {
    if (!data || !(data && Object.keys(data).length)) {
      return [];
    }
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
      style={{ minWidth: 145 }}
      fieldNames={{
        title: 'name',
        key: 'id',
      }}
      onSelect={(_, { node }: any) => {
        if (node.isLeaf && props.onSelect) {
          props.onSelect(node.extraData);
        }
      }}
      // onExpand={(_,{node}:any)=>{
      //   if (node.isLeaf && props.onSelect) {
      //     props.onSelect(node.extraData);
      //   }
      // }}
      defaultSelectedKeys={['home']}
      loadData={onLoadData}
      treeData={treeData}
    />
  );
};
