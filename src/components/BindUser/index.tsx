import { Col, Row } from 'antd';
import type { ProColumns } from '@jetlinks/pro-table';
import { observer } from '@formily/react';
import { BindModel } from '@/components/BindUser/model';
import Bound from '@/components/BindUser/Bound';
import Unbound from '@/components/BindUser/Unbound';
import Service from '@/components/BindUser/service';

export const service = new Service('user');

export const columns: ProColumns<UserItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    copyable: true,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '用户名',
    dataIndex: 'username',
  },
];
const BindUser = observer(() => {
  return (
    <Row gutter={[4, 4]}>
      <Col span={BindModel.bind ? 12 : 24}>
        <Bound />
      </Col>
      <Col span={BindModel.bind ? 12 : 0}>
        <Unbound />
      </Col>
    </Row>
  );
});
export default BindUser;
