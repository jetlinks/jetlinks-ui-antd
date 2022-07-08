import { Tree } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { service } from '@/pages/system/Platforms';
import { ApiModel } from '@/pages/system/Platforms/Api/base';
import { forkJoin, from, defer } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingOutlined } from '@ant-design/icons';

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
  const [loading, setLoading] = useState(false);

  const updateTreeData = useCallback(
    (list: DataNode[], parentItem: any): DataNode[] => {
      let newArray: any[] = list;
      console.log(list, props.grantKeys);
      if (props.type === 'empowerment') {
        newArray = list.filter(
          (item: any) =>
            item.extraData &&
            item.extraData.some((extraItem: any) =>
              props.operations?.includes(extraItem.operationId),
            ),
        );
      } else if (props.type === 'authorize') {
        newArray = list.filter(
          (item: any) =>
            item.extraData &&
            item.extraData.some((extraItem: any) =>
              props.grantKeys?.includes(extraItem.operationId),
            ),
        );
      }
      parentItem.children = newArray;

      return parentItem;
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

  const getChildrenData = async (data: any[], extraData?: any) => {
    const ofArray: any[] = [];
    data.forEach((item: any) => {
      ofArray.push(
        defer(() =>
          from(service.getApiNextLevel(item.name)).pipe(
            map((resp: any) => {
              if (resp && resp.components) {
                ApiModel.components = { ...ApiModel.components, ...resp.components.schemas };
                return handleTreeData(resp);
              }
              return undefined;
            }),
            map((resp: any) => resp && updateTreeData(resp, item)),
          ),
        ),
      );
    });

    forkJoin(ofArray).subscribe((res) => {
      console.log(res);
      setLoading(false);
      setTreeData(extraData ? [extraData, ...res] : res);
    });
  };

  const getLevelOne = async () => {
    setLoading(true);
    const resp = await service.getApiFirstLevel();
    if (resp.urls && resp.urls.length) {
      if (props.showHome) {
        const home = {
          id: 'home',
          name: '首页',
          isLeaf: true,
        };
        ApiModel.data = undefined;
        getChildrenData(
          resp.urls.map((item: any) => ({ ...item, id: item.url })),
          home,
        );
      } else {
        // setTreeData(resp.urls.map((item: any) => ({ ...item, id: item.url })));
        getChildrenData(resp.urls.map((item: any) => ({ ...item, id: item.url })));
      }
    }
  };

  // const getChildren = (key: string, name: string): Promise<any> => {
  //   return new Promise(async (resolve) => {
  //     const resp = await service.getApiNextLevel(name);
  //     if (resp && resp.components) {
  //       ApiModel.components = { ...ApiModel.components, ...resp.components.schemas };
  //       const handleData = handleTreeData(resp);
  //       setTreeData((origin) => {
  //         const data = updateTreeData(origin, key, handleData);
  //
  //         return data;
  //       });
  //       resolve(resp.result);
  //     } else {
  //       resolve([])
  //     }
  //   });
  // };

  // const onLoadData = (node: any): Promise<void> => {
  //   return new Promise(async (resolve) => {
  //     if (node.children) {
  //       resolve();
  //       return;
  //     }
  //     await getChildren(node.key, node.name);
  //     resolve();
  //   });
  // };

  useEffect(() => {
    if (props.type === 'all') {
      getLevelOne();
    } else if (props.type === 'empowerment' && props.grantKeys) {
      getLevelOne();
    } else if (props.type === 'authorize' && props.operations) {
      getLevelOne();
    }
  }, [props.operations, props.grantKeys, props.type]);

  console.log(treeData);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {!loading ? (
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
          // loadData={onLoadData}
          treeData={treeData}
        />
      ) : (
        <div style={{ paddingTop: 32, display: 'flex', justifyContent: 'center' }}>
          <LoadingOutlined style={{ fontSize: 32 }} />
        </div>
      )}
    </div>
  );
};
