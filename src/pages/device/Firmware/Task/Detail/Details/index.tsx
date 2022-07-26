import { Modal } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  data: string;
  close: () => void;
}

const Details = (props: Props) => {
  const [data, setDada] = useState<string>(props.data || '');

  useEffect(() => {
    setDada(props.data);
  }, [props.data]);

  return (
    <Modal title={'详情'} visible onCancel={props.close} onOk={props.close} width={500}>
      <p>失败原因： {String(data)}</p>
    </Modal>
  );
};
export default Details;
