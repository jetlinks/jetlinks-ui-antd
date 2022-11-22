import ParamsSelect, { ItemProps } from '@/pages/rule-engine/Scene/Save/components/ParamsSelect';
import { useEffect, useState } from 'react';
import { DataNode } from 'antd/es/tree';
import { Input, InputNumber, Tree } from 'antd';
import MTimePicker from '../../../components/ParamsSelect/components/MTimePicker';
import moment from 'moment';

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

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

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
              setValue(e);
              if (props.onChange) {
                props.onChange(e);
              }
            }}
            style={{ width: '100%' }}
            placeholder={'请输入'}
          />
        );
      case 'date':
        return (
          <MTimePicker
            value={moment(value, 'HH:mm:ss')}
            onChange={(_: any, timeString: string) => {
              setValue(timeString);
              if (props.onChange) {
                props.onChange(timeString);
              }
            }}
          />
        );
      default:
        return (
          <Input
            value={value}
            placeholder={'请输入' + name}
            onChange={(e) => {
              setValue(e.target.value);
              if (props.onChange) {
                props.onChange(e.target.value);
              }
            }}
          />
        );
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
            if (props.onChange) {
              props.onChange(selectedKeys[0]);
            }
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <ParamsSelect
        style={{ width: '100%', height: '100%' }}
        inputProps={{
          placeholder: '请选择',
        }}
        tabKey={'manual'}
        itemList={itemList}
        value={value}
        onChange={(val: any) => {
          setValue(val);
        }}
      />
    </div>
  );
};
