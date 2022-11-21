import { DownOutlined } from '@ant-design/icons';
import { Input, Tabs } from 'antd';
import { useState } from 'react';
import './index.less';

export default () => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className={'select-wrapper'}>
      <Input
        suffix={<DownOutlined style={{ color: "rgba('#000', .45)" }} />}
        onFocus={() => {
          setVisible(true);
        }}
      />
      {visible && (
        <div className={'select-box'}>
          <Tabs
            defaultActiveKey="1"
            onChange={() => {}}
            items={[
              {
                label: `Tab 1`,
                key: '1',
                children: `Content of Tab Pane 1`,
              },
              {
                label: `Tab 2`,
                key: '2',
                children: `Content of Tab Pane 2`,
              },
              {
                label: `Tab 3`,
                key: '3',
                children: `Content of Tab Pane 3`,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};
