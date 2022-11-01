import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Tree, List, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
// import { service } from '..';
import './index.less';

interface Props {
  close: any;
  deviceId: string;
}

const MapTree = (props: Props) => {
  const [data, setData] = useState<any>([]);
  const [checked, setChecked] = useState<any>([]);
  const filterRef = useRef<any>([]);
  const [expandedKey, setExpandedKey] = useState<any>();
  const [list, setList] = useState<any>([]);

  const treeData = [
    {
      name: '通道1',
      id: '1',
      collectors: [
        {
          name: '设备1',
          id: '1-1',
          parentId: '1',
          points: [
            {
              name: '点位1',
              id: '1-1-1',
            },
            {
              name: '点位2',
              id: '1-1-2',
            },
          ],
        },
        {
          name: '设备2',
          id: '1-2',
        },
      ],
    },
    {
      name: '通道2',
      id: '2',
      collectors: [],
    },
  ];

  const filterTree = (nodes: any[], lists: any[]) => {
    if (!nodes?.length) {
      return nodes;
    }
    return nodes.filter((item) => {
      if (lists.indexOf(item.id) > -1) {
        filterRef.current.push(item);
        return false;
      }
      // 符合条件的保留，并且需要递归处理其子节点
      item.collectors = filterTree(item.collectors, lists);
      return true;
    });
  };

  const pushTree = (node: any) => {
    const newTree = data.map((item: any) => {
      if (item.id === node.parentId) {
        item.collectors.push(node);
        console.log(item, 'item');
      }
      return item;
    });
    console.log(newTree, 'newTree');
    setData(newTree);
    const array = filterRef.current.filter((element: any) => element.id !== node.id);
    setList(array);
    // console.log(list,'list')
  };

  useEffect(() => {
    // service.treeMap(props.deviceId).then(
    //   res => {
    //     if (res.status === 200) {
    //       setData(res.result)
    //     }
    //   }
    // )
    setData(treeData);
    setExpandedKey([treeData?.[0].id]);
  }, []);

  useEffect(() => {
    console.log(filterRef.current);
    setList(filterRef.current);
  }, [filterRef.current]);

  return (
    <Modal
      title="批量映射"
      visible
      onCancel={() => {
        props.close();
      }}
      onOk={() => {
        props.close();
      }}
      width="900px"
    >
      <div className="map-tree">
        <div className="map-tree-top">
          采集器的点位名称与属性名称一致时将自动映射绑定；有多个采集器点位名称与属性名称一致时以第1个采集器的点位数据进行绑定
        </div>
        <div className="map-tree-content">
          <Card title="源数据" className="map-tree-card">
            <Tree
              key={'id'}
              checkable
              selectable={false}
              expandedKeys={expandedKey}
              onExpand={(expandedKeys) => {
                setExpandedKey(expandedKeys);
              }}
              onCheck={(checkeds) => {
                setChecked(checkeds);
              }}
            >
              {data?.map((item: any) => (
                <Tree.TreeNode key={item.id} title={item.name} checkable={false}>
                  {(item?.collectors || []).map((collector: any) => (
                    <Tree.TreeNode key={collector.id} title={collector.name}>
                      {(collector?.points || []).map((i: any) => (
                        <Tree.TreeNode checkable={false} key={i.id} title={i.name}></Tree.TreeNode>
                      ))}
                    </Tree.TreeNode>
                  ))}
                </Tree.TreeNode>
              ))}
            </Tree>
          </Card>
          <div>
            <Button
              onClick={() => {
                const item = filterTree(data, checked);
                setData(item);
              }}
            >
              加入右侧
            </Button>
          </div>
          <Card title="采集器" className="map-tree-card">
            <List
              size="small"
              dataSource={list}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title="确定删除?"
                      onConfirm={() => {
                        pushTree(item);
                      }}
                    >
                      <DeleteOutlined />
                    </Popconfirm>,
                  ]}
                >
                  {item.name}
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
    </Modal>
  );
};
export default MapTree;
