import { onlyMessage } from '@/utils/util';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Tree, List, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { service } from '..';
import './index.less';

interface Props {
  close: any;
  deviceId: string;
  edgeId: string;
  metaData: any;
  addDevice?: any;
}

const MapTree = (props: Props) => {
  const { deviceId, edgeId, close, metaData } = props;
  const [data, setData] = useState<any>([]);
  const [checked, setChecked] = useState<any>([]);
  const filterRef = useRef<any>([]);
  const [expandedKey, setExpandedKey] = useState<any>();
  const [list, setList] = useState<any>([]);

  const filterTree = (nodes: any[], lists: any[]) => {
    if (!nodes?.length) {
      return nodes;
    }
    return nodes.filter((item) => {
      if (lists.indexOf(item.id) > -1) {
        filterRef.current.push(item);
        // console.log(filterRef.current, 'filterRef.current');
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
      }
      return item;
    });
    setData(newTree);
    filterRef.current = filterRef.current.filter((element: any) => element.id !== node.id);
  };

  const save = async () => {
    // console.log(list,'list')
    const params: any[] = [];
    const metadataId = metaData.map((item: any) => item.metadataId);
    list.forEach((item: any) => {
      const array = item.points.map((element: any) => ({
        channelId: item.parentId,
        collectorId: element.collectorId,
        pointId: element.id,
        metadataType: 'property',
        metadataId: metadataId.find((i: any) => i === element.id),
        provider: data.find((it: any) => it.id === item.parentId).provider,
      }));
      params.push(...array);
    });
    const filterParms = params.filter((item) => !!item.metadataId);
    if (deviceId) {
      if (filterParms && filterParms.length !== 0) {
        const res = await service.saveMap(edgeId, {
          deviceId: deviceId,
          provider: filterParms[0].provider,
          requestList: filterParms,
        });
        if (res.status === 200) {
          onlyMessage('保存成功');
          close();
        }
      } else {
        onlyMessage('暂无属性映射', 'warning');
      }
    } else {
      const res = await service.addDevice(props.addDevice);
      if (res.status === 200) {
        const resp = await service.saveMap(edgeId, {
          deviceId: res.result.id,
          provider: filterParms[0].provider,
          requestList: filterParms,
        });
        if (resp.status === 200) {
          onlyMessage('保存成功');
          close();
        }
      }
    }
  };

  useEffect(() => {
    service.treeMap(edgeId).then((res) => {
      if (res.status === 200) {
        console.log(res.result?.[0], 'data');
        setData(res.result?.[0]);
        setExpandedKey([res.result?.[0].id]);
      }
    });
  }, []);

  useEffect(() => {
    setList(filterRef.current);
  }, [filterRef.current]);

  return (
    <Modal
      title="批量映射"
      visible
      onCancel={() => {
        close();
      }}
      onOk={() => {
        save();
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
              disabled={checked && checked.length === 0}
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
