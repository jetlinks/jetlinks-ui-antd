import Terms from '@/pages/rule-engine/Scene/Save/terms';
import ParamsSelect, { ItemProps } from '@/pages/rule-engine/Scene/Save/components/ParamsSelect';
import { useState } from 'react';
import { DataNode } from 'antd/es/tree';
import { Tree } from 'antd';
import MTimePicker from '../components/ParamsSelect/components/MTimePicker';

export default () => {
  const [value, setValue] = useState<any>(null);
  const treeData: DataNode[] = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [{ title: 'sss', key: '0-0-1-0' }],
        },
      ],
    },
  ];
  const [showValue, setShowValue] = useState<any>('');
  const itemList: ItemProps[] = [
    {
      label: `手动输入`,
      key: 'manual',
      content: (
        <MTimePicker
          value={value}
          onChange={(time: any, timeString: string) => {
            setShowValue(timeString);
            setValue(time);
          }}
        />
      ),
    },
    {
      label: `内置参数`,
      key: 'built-in',
      content: (
        <Tree
          treeData={treeData}
          height={300}
          defaultExpandAll
          onSelect={(selectedKeys) => {
            setValue(selectedKeys[0]);
            setShowValue(selectedKeys[0]);
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <div>
        <ParamsSelect
          style={{ width: 250 }}
          inputProps={{
            placeholder: '请选择',
          }}
          tabKey={'manual'}
          itemList={itemList}
          value={showValue}
          onChange={(val: any) => {
            setValue(val.timeString);
          }}
        />
      </div>
      <Terms />
    </div>
  );
};
