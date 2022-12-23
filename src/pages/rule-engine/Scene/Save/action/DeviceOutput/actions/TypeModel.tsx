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
import { observer } from '@formily/reactive-react';
import DeviceModel from '../model';
import { Empty } from '@/components';

interface Props {
  value: any;
  type: string;
  onChange?: (data: any, source?: any, text?: any) => void;
  record?: any; //功能-枚举
  elements?: []; //属性-枚举
  name?: any;
  source?: string;
  format?: any;
  onColumns?: (col: any) => void;
  thenName: number;
  branchGroup?: number;
  label?: string; //枚举回显
}

export default observer((props: Props) => {
  const [value, setValue] = useState<any>(props.value || undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const [objVisiable, setObjVisable] = useState<boolean>(false);
  const [source, setSource] = useState<string>(props.source || 'fixed');
  const [builtInList, setBuiltInList] = useState<any[]>([]);
  const [labelValue, setLabelValue] = useState<any>('');
  const [open, setOpen] = useState<boolean>(false);

  const filterLabel = (nodes: any[]) => {
    let lable: any;
    nodes.forEach((item) => {
      lable = item.children?.find((it: any) => it.id === props.value);
    });
    return lable?.description;
  };
  const filterParamsData = (type?: string, data?: any[]): any[] => {
    if (type && data) {
      return data.filter((item) => {
        if (item.children) {
          const _children = filterParamsData(type, item.children);
          item.children = _children;
          return _children.length ? true : false;
        } else if (item.type === type) {
          return true;
        }
        return false;
      });
    }
    return data || [];
  };

  const sourceChangeEvent = async () => {
    // const params = props?.name - 1 >= 0 ? { action: props?.name - 1 } : undefined;
    const _params = {
      branch: props.thenName,
      branchGroup: props.branchGroup,
      action: props.name,
    };
    queryBuiltInParams(FormModel.current, _params).then((res: any) => {
      if (res.status === 200) {
        const _data = BuiltInParamsHandleTreeData(res.result);
        const filterData = filterParamsData(props.type, _data);
        // console.log('_data', _data);
        // console.log('filterData', filterData);
        // console.log('type',props.type)
        setBuiltInList(filterData);
        const label = filterLabel(filterData);
        setLabelValue(label);
      }
    });
  };

  const onChange = (params: any) => {
    setValue(params);
    setLabelValue(params);
    if (props.onChange) {
      props.onChange(params, source);
    }
  };

  useEffect(() => {
    if (source === 'upper') {
      sourceChangeEvent();
    }
  }, [source]);

  useEffect(() => {
    setValue(props.value);
    // setLabelValue(props.label);
    // console.log('typemodel', props.value);
  }, [props.value]);

  useEffect(() => {
    setLabelValue(props.label);
  }, []);

  const renderNode = (type: string) => {
    switch (type) {
      case 'int':
      case 'long':
      case 'float':
      case 'double':
        return (
          <InputNumber
            value={value}
            min={0}
            precision={type === 'double' || type === 'float' ? 2 : 0}
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
            options={props.record?.options || props.elements || []}
            fieldNames={{ label: 'text', value: 'value' }}
            placeholder={'请选择'}
            onChange={(e, options: any) => {
              setValue(e);
              setLabelValue(options?.text);
              // DeviceModel.propertiesValue = options?.text
              if (props.onChange) {
                props.onChange(e, source, options?.text);
              }
              // onChange(e)
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
            readOnly
            onClick={() => {
              setVisible(true);
            }}
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
            onChange={(e) => {
              onChange(e);
            }}
          />
        );
      case 'date':
        return (
          <MTimePicker
            type={props.format === 'yyyy-MM-dd' ? 'time' : 'date'}
            value={moment(
              value ? value : new Date(),
              props.format === 'yyyy-MM-dd' ? 'HH:mm:ss' : 'yyyy-MM-dd HH:mm:ss',
            )}
            onOpen={() => {
              setOpen(false);
            }}
            onChange={(_: any, timeString: string) => {
              // setDateOpen(false)
              console.log('timeString', timeString);
              setValue(timeString);
              setLabelValue(timeString);
              if (props.onChange) {
                props.onChange(timeString);
              }
              // setOpen(false)
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
              setLabelValue(e.target.value);
              if (props.onChange) {
                props.onChange(e.target.value, source);
              }
            }}
          />
        );
    }
  };

  const itemList: ItemProps[] = [
    {
      label: `手动输入`,
      key: 'fixed',
      content: renderNode(props.type),
    },
    {
      label: `内置参数`,
      key: 'upper',
      content:
        builtInList.length !== 0 ? (
          <Tree
            treeData={builtInList}
            height={300}
            defaultExpandAll
            fieldNames={{ title: 'name', key: 'id' }}
            onSelect={(selectedKeys, e) => {
              // console.log('e.node', e.node);
              if (e.node.metadata) {
                if (props.onColumns) {
                  props.onColumns(e.node.column);
                }
              }
              setOpen(false);
              setLabelValue(e.node.description);
              DeviceModel.actionName = e.node.description;
              setValue(selectedKeys[0]);
              if (props.onChange) {
                props.onChange(selectedKeys[0], source, e.node.description);
              }
            }}
          />
        ) : (
          <Empty />
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
        tabKey={source}
        itemList={itemList}
        value={value}
        onChange={(val: any, tabKey: any) => {
          // setOpen(false)
          setValue(val);
          setSource(tabKey);
          if (props.onChange) {
            props.onChange(val, tabKey);
          }
        }}
        open={open}
        openChange={setOpen}
        type={props.type}
        labelValue={labelValue}
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
});
