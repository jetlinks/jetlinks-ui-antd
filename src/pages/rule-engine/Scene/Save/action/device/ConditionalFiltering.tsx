import { Col, Form, Select, InputNumber, Input, DatePicker, Space, TreeSelect } from 'antd';
import { ItemGroup } from '@/pages/rule-engine/Scene/Save/components';
import type { FormInstance } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { queryBuiltInParams } from '@/pages/rule-engine/Scene/Save/action/service';

interface ConditionalFilteringProps {
  name: number;
  form: FormInstance;
}

export default (props: ConditionalFilteringProps) => {
  const [builtInList, setBuiltInList] = useState<any[]>([]);
  const [source, setSource] = useState<any>('fixed');
  const [type, setType] = useState('string');
  const [termTypes, setTermTypes] = useState([]);

  const valueTypeMap = (_type: string) => {
    switch (_type) {
      case 'init':
      case 'float':
      case 'double':
      case 'long':
        return <InputNumber />;
      case 'date':
        return (
          <>
            {
              // @ts-ignore
              <DatePicker />
            }
          </>
        );
      case 'boolean':
        return (
          <Select
            options={[
              { label: '是', value: 'true' },
              { label: '否', value: 'false' },
            ]}
          />
        );
      default:
        return <Input />;
    }
  };

  const handleName = (data: any) => {
    return (
      <Space>
        {data.name}
        {data.description && (
          <div style={{ color: 'grey', marginLeft: '5px' }}>({data.description})</div>
        )}
      </Space>
    );
  };

  const handleTreeData = (data: any): any[] => {
    if (data.length > 0) {
      return data.map((item: any) => {
        const name = handleName(item);
        if (item.children) {
          return { ...item, name, disabled: true, children: handleTreeData(item.children) };
        }
        return { ...item, name };
      });
    }
    return [];
  };

  const getItemByChildren = (id: string, data: any[]) => {
    let BuiltItem = undefined;
    data.forEach((_item) => {
      if (_item.id === id) {
        BuiltItem = _item;
      } else if (_item.children) {
        BuiltItem = getItemByChildren(id, _item.children);
      }
    });
    return BuiltItem;
  };

  const getBuiltItemById = useCallback(
    (id: string) => {
      const builtItem: any = getItemByChildren(id, builtInList);
      console.log(builtItem, id);
      if (builtItem) {
        setType(builtItem.type);
        setTermTypes(builtItem.termTypes);
      }
      return builtItem ? builtItem : {};
    },
    [builtInList],
  );

  useEffect(() => {
    const data = props.form.getFieldsValue();
    queryBuiltInParams(data, { action: props.name }).then((res: any) => {
      if (res.status === 200) {
        const actionParams = res.result.filter(
          (item: any) => item.id === `action_${props.name + 1}`,
        );
        setBuiltInList(handleTreeData(actionParams));
      }
    });
  }, []);

  return (
    <>
      <Col span={4}>
        <Form.Item name={[props.name, 'terms[0].column']}>
          <TreeSelect
            placeholder={'请选择参数'}
            fieldNames={{
              value: 'id',
              label: 'name',
            }}
            treeData={builtInList}
            onSelect={(v: any) => {
              getBuiltItemById(v);
              props.form.resetFields([props.name, 'terms[0].termType']);
            }}
          />
        </Form.Item>
      </Col>
      <Col span={2}>
        <Form.Item name={[props.name, 'terms[0].termType']}>
          <Select
            style={{ width: '100%' }}
            options={termTypes}
            fieldNames={{ value: 'id', label: 'name' }}
            placeholder={'操作符'}
          />
        </Form.Item>
      </Col>
      <Col span={7}>
        <Form.Item noStyle>
          <ItemGroup>
            <Form.Item name={[props.name, 'terms[0].value.source']}>
              <Select
                options={[
                  { label: '手动输入', value: 'fixed' },
                  { label: '内置参数', value: 'upper' },
                ]}
                style={{ width: 120 }}
                onSelect={(v: any) => {
                  setSource(v);
                }}
              />
            </Form.Item>
            <Form.Item name={[props.name, 'terms[0].value.value[0]']}>
              {source === 'fixed' ? (
                valueTypeMap(type)
              ) : (
                <TreeSelect
                  placeholder={'请选择参数'}
                  fieldNames={{ value: 'id', label: 'name' }}
                  treeData={builtInList}
                />
              )}
            </Form.Item>
          </ItemGroup>
        </Form.Item>
      </Col>
      <Col span={1}>不执行后续动作</Col>
    </>
  );
};
