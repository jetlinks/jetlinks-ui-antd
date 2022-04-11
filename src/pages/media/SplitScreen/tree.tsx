import { Tree } from 'antd';
import { getMediaTree, queryChannel } from './service';
import React, { useEffect, useState } from 'react';
import { VideoCameraOutlined } from '@ant-design/icons';

type LeftTreeTYpe = {
  onSelect?: (deviceId: string, channelId: string) => void;
};

interface DataNode {
  name: string;
  id: string;
  isLeaf?: boolean;
  channelNumber?: number;
  icon?: React.ReactNode;
  status: {
    text: string;
    value: string;
  };
  children?: DataNode[];
}

const LeftTree = (props: LeftTreeTYpe) => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  /**
   * 是否为子节点
   * @param node
   */
  const isLeaf = (node: DataNode): boolean => {
    if (node.channelNumber) {
      return false;
    }
    return true;
  };

  /**
   * 获取设备列表
   */
  const getDeviceList = async () => {
    const resp = await getMediaTree({ paging: false });
    if (resp.status === 200) {
      setTreeData(
        resp.result.map((item: any) => {
          const extra: any = {};
          extra.isLeaf = isLeaf(item);

          return {
            ...item,
            ...extra,
          };
        }),
      );
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

  /**
   * 获取子节点
   * @param key
   * @param params
   */
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
              icon: <VideoCameraOutlined className={item.status.value} />,
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

  useEffect(() => {
    getDeviceList();
  }, []);

  return (
    <div className="left-content">
      {/*<Input*/}
      {/*  className={'left-search'}*/}
      {/*  placeholder={'请输入设备名称'}*/}
      {/*  suffix={<SearchOutlined />}*/}
      {/*  onChange={debounce(ThreeNodeSearch, 300)}*/}
      {/*/>*/}
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
            props.onSelect(node.deviceId, node.channelId);
          }
        }}
        loadData={onLoadData}
        treeData={treeData}
      />
    </div>
  );
};

export default LeftTree;
