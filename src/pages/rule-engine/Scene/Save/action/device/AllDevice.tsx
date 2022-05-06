import { Input } from 'antd';
import { useEffect } from 'react';
import { queryAllDevice } from '@/pages/rule-engine/Scene/Save/action/device/service';

interface AllDeviceProps {
  productId?: string;
  value?: any;
  onChange?: (value: any) => void;
}

export default (props: AllDeviceProps) => {
  useEffect(() => {
    console.log(props.productId);
    queryAllDevice({
      terms: [{ column: 'productId', value: props.productId }],
      paging: false,
    }).then((resp) => {
      if (resp.status === 200 && props.onChange) {
        props.onChange(resp.result.map((item: any) => ({ id: item.id, name: item.name })));
      }
    });
  }, [props.productId]);

  return (
    <Input
      style={{ width: '100%' }}
      value={props.value ? props.value.map((item: any) => item.name).toString() : undefined}
      readOnly
    />
  );
};
