import { Input, Tree } from 'antd';
import { useRequest } from 'umi';
import { service } from '../index';
import React, { useEffect, useState } from 'react';
import './index.less';
import { SearchOutlined } from '@ant-design/icons';

interface TreeProps {
  deviceId: string;
  onSelect: (id: React.Key) => void;
}

export default (props: TreeProps) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['']);
  const { run: getTreeData } = useRequest(service.queryTree, {
    manual: true,
    formatResult: (res) => res.result,
    onSuccess: (res) => {
      treeData[0].children = res.result || [];
      setTreeData(treeData);
    },
  });

  /**
   * 获取设备详情
   * @param id
   */
  const getDeviceDetail = async (id: string) => {
    const deviceResp = await service.deviceDetail(id);
    if (deviceResp.status === 200) {
      setTreeData([
        {
          id,
          name: deviceResp.result.name,
          children: [],
        },
      ]);
      setSelectedKeys([id]);
      getTreeData(props.deviceId, {});
    }
  };

  useEffect(() => {
    if (props.deviceId) {
      getDeviceDetail(props.deviceId);
    }
  }, [props.deviceId]);

  return (
    <div className={'channel-tree'}>
      <div className={'channel-tree-query'}>
        <Input placeholder={'请输入目录名称'} suffix={<SearchOutlined />} />
      </div>
      <div className={'channel-tree-content'}>
        <Tree
          height={500}
          selectedKeys={selectedKeys}
          treeData={treeData}
          onSelect={(keys) => {
            if (keys.length) {
              setSelectedKeys(keys);
              if (props.onSelect) {
                props.onSelect(keys[0]);
              }
            }
          }}
          fieldNames={{
            key: 'id',
            title: 'name',
          }}
        />
      </div>
    </div>
  );
};
