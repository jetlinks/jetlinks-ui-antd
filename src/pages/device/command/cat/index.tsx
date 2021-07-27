import { Divider, Input, Modal } from 'antd';
import React from 'react';

interface Props {
  close: Function;
  data: any;
}
const Cat = (props: Props) => {
  return (
    <Modal footer={null} title="查看指令" visible onCancel={() => props.close()} width="70VW">
      下发指令:
      <Input.TextArea
        rows={7}
        name="downstream"
        value={JSON.stringify(props.data.downstream, null, 2)}
      />
      <Divider />
      回复内容:
      <Input.TextArea
        rows={7}
        name="upstream"
        value={JSON.stringify(props.data.upstream, null, 2)}
      />
    </Modal>
  );
};
export default Cat;
