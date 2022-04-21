import { Button, Col, Input, Modal, Row, Tree } from 'antd';
import { observer } from '@formily/react';
import { state } from '..';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useRef } from 'react';

const SyncUser = observer(() => {
  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'name',
      title: '微信用户名',
    },
    {
      dataIndex: 'name',
      title: '用户',
    },
    {
      dataIndex: 'name',
      title: '绑定状态',
    },
  ];
  const actionRef = useRef<ActionType>();

  return (
    <Modal title="同步用户" visible={true} onCancel={() => (state.syncUser = false)} width="80vw">
      <Row>
        <Col span={4}>
          <Input.Search style={{ marginBottom: 8 }} placeholder="Search" onChange={() => {}} />
          <Tree
            onExpand={() => {}}
            // expandedKeys={expandedKeys}
            // autoExpandParent={autoExpandParent}
            // treeData={loop(gData)}
          />
          这是一颗没有数据的树
        </Col>
        <Col span={20}>
          <ProTable
            rowKey="id"
            actionRef={actionRef}
            search={false}
            columns={columns}
            headerTitle={<Button>保存</Button>}
          />
        </Col>
      </Row>
    </Modal>
  );
});

export default SyncUser;
