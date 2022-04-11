import { Tree, Input } from 'antd';
import { useRequest } from 'umi';
import { service } from '../index';
import { useEffect } from 'react';
import './index.less';
import { SearchOutlined } from '@ant-design/icons';

interface TreeProps {
  deviceId: string;
}

export default (props: TreeProps) => {
  const { data: TreeData, run: getTreeData } = useRequest(service.queryTree, {
    manual: true,
    formatResult: (res) => res.result,
  });

  useEffect(() => {
    if (props.deviceId) {
      getTreeData(props.deviceId, {});
    }
  }, [props.deviceId]);

  return (
    <div className={'channel-tree'}>
      <div className={'channel-tree-query'}>
        <Input placeholder={'请输入目录名称'} suffix={<SearchOutlined />} />
      </div>
      <div className={'channel-tree-content'}>
        <Tree height={500} treeData={TreeData} />
      </div>
    </div>
  );
};
