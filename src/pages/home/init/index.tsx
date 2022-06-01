import { Button, Radio } from 'antd';
import { useState } from 'react';
import { service } from '..';

interface Props {
  changeView: (view: any) => void;
}

const Init = (props: Props) => {
  const options = [
    { label: '设备接入视图', value: 'device' },
    { label: '运维管理视图', value: 'ops' },
    { label: '综合管理视图', value: 'comprehensive' },
  ];

  const [value, setValue] = useState<string>('device');

  return (
    <div>
      <Radio.Group
        options={options}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        optionType="button"
      />
      <div>
        <Button
          onClick={() => {
            service
              .setView({
                name: 'view',
                content: value,
              })
              .then((resp) => {
                if (resp.status === 200) {
                  props.changeView(value);
                }
              });
          }}
        >
          确定
        </Button>
      </div>
    </div>
  );
};
export default Init;
