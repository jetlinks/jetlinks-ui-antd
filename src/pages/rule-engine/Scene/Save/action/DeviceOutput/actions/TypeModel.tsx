import ParamsSelect, { ItemProps } from '@/pages/rule-engine/Scene/Save/components/ParamsSelect';
import { useEffect, useState } from 'react';
import { Input, InputNumber, Select, Tree } from 'antd';
import MTimePicker from '../../../components/ParamsSelect/components/MTimePicker';
import moment from 'moment';
import { EditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import AMap from '@/components/GeoPoint/AMap';
import ObjModel from './ObjModel';
import { FormModel } from '../../..';
import { BuiltInParamsHandleTreeData } from '@/pages/rule-engine/Scene/Save/components/BuiltInParams';
import { queryBuiltInParams } from '@/pages/rule-engine/Scene/Save/action/service';

interface Props {
  value: any;
  type: string;
  onChange?: (data: any, source?: any) => void;
  record?: any; //枚举值使用
  name?: any;
}

export default (props: Props) => {
  const [value, setValue] = useState<any>(props.value || '');
  const [visible, setVisible] = useState<boolean>(false);
  const [objVisiable, setObjVisable] = useState<boolean>(false);
  const [source, setSource] = useState<string>('');
  const [builtInList, setBuiltInList] = useState<any[]>([]);

  const sourceChangeEvent = async () => {
    const params = props?.name - 1 >= 0 ? { action: props?.name - 1 } : undefined;
    queryBuiltInParams(FormModel, params).then((res: any) => {
      if (res.status === 200) {
        const _data = BuiltInParamsHandleTreeData(res.result);
        console.log(_data);
        setBuiltInList(_data);
      }
    });
  };

  const onChange = (params: any) => {
    setValue(params);
    if (props.onChange) {
      props.onChange(params);
    }
  };

  useEffect(() => {
    if (props.onChange) {
      props.onChange(value, source);
    }
    if (source === 'upper') {
      sourceChangeEvent();
    }
  }, [source, value]);

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
              onChange(e);
            }}
            style={{ width: '100%' }}
            placeholder={'请输入'}
          />
        );
      case 'enum':
        return (
          <Select
            value={value}
            style={{ width: '100%', textAlign: 'left' }}
            options={props.record.options || []}
            fieldNames={{ label: 'text', value: 'value' }}
            placeholder={'请选择'}
            mode="multiple"
            onChange={(e) => {
              onChange(e);
            }}
          />
        );
      case 'boolean':
        return (
          <Select
            value={value}
            style={{ width: '100%', textAlign: 'left' }}
            options={[
              { label: 'true', value: true },
              { label: 'false', value: false },
            ]}
            placeholder={'请选择'}
            onChange={(e) => {
              onChange(e);
            }}
          />
        );
      case 'geoPoint':
        return (
          <Input
            value={value}
            style={{ width: '100%', textAlign: 'left' }}
            addonAfter={
              <EnvironmentOutlined
                onClick={() => {
                  setVisible(true);
                }}
              />
            }
            placeholder={'请选择'}
            onChange={(e) => {
              onChange(e);
            }}
          />
        );
      case 'object':
        return (
          <Input
            value={value}
            style={{ width: '100%', textAlign: 'left' }}
            addonAfter={
              <EditOutlined
                onClick={() => {
                  setObjVisable(true);
                }}
              />
            }
            placeholder={'请选择'}
            onChange={(e) => {
              onChange(e);
            }}
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
            placeholder={'请输入'}
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
      key: 'upper',
      content: (
        <Tree
          treeData={builtInList}
          height={300}
          defaultExpandAll
          fieldNames={{ title: 'name', key: 'id' }}
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
        onChange={(val: any, tabKey: any) => {
          setValue(val);
          setSource(tabKey);
        }}
        type={props.type}
      />
      {visible && (
        <AMap
          value={value}
          close={() => {
            setVisible(false);
          }}
          ok={(param) => {
            if (props.onChange) {
              props.onChange(param);
            }
            setValue(param);
            setVisible(false);
          }}
        />
      )}

      {objVisiable && (
        <ObjModel
          value={value}
          close={() => {
            setObjVisable(false);
          }}
          ok={(param) => {
            if (props.onChange) {
              props.onChange(param);
            }
            setValue(param);
            setObjVisable(false);
          }}
        />
      )}
    </div>
  );
};
