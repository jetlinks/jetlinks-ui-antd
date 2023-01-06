import { EditOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useState } from 'react';
import ObjModel from '../DeviceOutput/actions/ObjModel';

interface Props {
  value: any;
  onChange?: (data: any) => void;
}

export default (props: Props) => {
  const [objVisiable, setObjVisable] = useState<boolean>(false);
  const [value, setValue] = useState<any>(JSON.stringify(props.value) || undefined);
  return (
    <>
      <Input
        value={value}
        style={{ width: '100%', textAlign: 'left' }}
        readOnly
        onClick={() => {
          setObjVisable(true);
        }}
        addonAfter={
          <EditOutlined
            onClick={() => {
              setObjVisable(true);
            }}
          />
        }
        placeholder={'请选择'}
      />
      {objVisiable && (
        <ObjModel
          value={value}
          close={() => {
            setObjVisable(false);
          }}
          ok={(param) => {
            // console.log('------', param);
            if (props.onChange) {
              props.onChange(JSON.parse(param));
            }
            setValue(param);
            setObjVisable(false);
          }}
        />
      )}
    </>
  );
};
