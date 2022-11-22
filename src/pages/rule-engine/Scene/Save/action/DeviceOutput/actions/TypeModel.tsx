import ParamsSelect, { ItemProps } from '@/pages/rule-engine/Scene/Save/components/ParamsSelect';
import { useEffect, useState } from 'react';
import { DataNode } from 'antd/es/tree';
import { Input, InputNumber, Tree } from 'antd';
import MTimePicker from '../../../components/ParamsSelect/components/MTimePicker';

interface Props {
  value: any;
  type: string;
  onChange?: (data: any) => void;
}

export default (props: Props) => {
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

  const renderNode = (type: string) => {
    switch (type) {
      case 'int':
      case 'long':
      case 'float':
      case 'double':
        return (
          <InputNumber
            value={value}
            onChange={(e: any) => {
              setShowValue(e);
              setValue(e);
            }}
            style={{ width: '100%' }}
            placeholder={'请输入'}
          />
        );
      case 'date':
        return (
          <MTimePicker
            value={value}
            onChange={(time: any, timeString: string) => {
              setShowValue(timeString);
              setValue(time);
            }}
          />
        );
      default:
        return <Input value={value} placeholder={'请输入' + name} />;
    }
  };

  const itemList: ItemProps[] = [
    {
      label: `手动输入`,
      key: 'manual',
      content: renderNode(props.type),
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

  useEffect(() => {
    setShowValue(value);
  }, [props.value]);

  return (
    <div>
      <ParamsSelect
        style={{ width: '100%', height: '100%' }}
        inputProps={{
          placeholder: '请选择',
        }}
        tabKey={'manual'}
        itemList={itemList}
        value={showValue}
        onChange={(val: any) => {
          setValue(val);
        }}
      />
    </div>
  );
};
