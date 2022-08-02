import { Button, Col, DatePicker, Input, InputNumber, Modal, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface TagModalProps {
  tagData: any[];
  value?: any[];
  onChange?: (value: any[]) => void;
  id?: string;
}

/**
 * 数据格式 [{"value":{"key":"value"},"name":"标签名称"}]
 * @param props
 */
export default (props: TagModalProps) => {
  const [visible, setVisible] = useState(false);
  const [tagList, setTagList] = useState<any[]>([{}]);
  const [options, setOptions] = useState<any[]>([]);
  const [nameList, setNameList] = useState<string[]>([]);

  const handleItem = (data: any) => {
    return {
      ...data,
      valueType: data.valueType ? data.valueType.type : '-',
      format: data.valueType ? data.valueType.format : undefined,
      options: data.valueType ? data.valueType.elements : undefined,
      value: data.value,
    };
  };

  useEffect(() => {
    if (visible) {
      setOptions(
        props.tagData.map((item: any) => {
          return { label: item.name, value: item.id, ...item };
        }),
      );
    }
  }, [visible, props.tagData]);

  useEffect(() => {
    if (
      props.value &&
      props.value[0] &&
      props.value[0].name &&
      props.tagData &&
      props.tagData.length
    ) {
      const names: string[] = [];
      const newTagList = props.value[0].value
        .filter((valueItem: any) => {
          return props.tagData.some((item) => valueItem.column === item.id);
        })
        .map((valueItem: any) => {
          const oldItem = props.tagData.find((item) => item.id === valueItem.column);
          if (oldItem) {
            names.push(oldItem.name);
            return {
              ...handleItem(oldItem),
              value: valueItem.value,
              type: valueItem.type,
            };
          }
          return valueItem;
        });
      setNameList(names);
      setTagList(newTagList);
    } else {
      setTagList([{}]);
    }
  }, [props.value, props.tagData]);

  const getItemNode = (record: any) => {
    const type = record.valueType;
    const name = record.name;

    switch (type) {
      case 'enum':
        return (
          <Select
            value={record.value}
            style={{ width: '100%', textAlign: 'left' }}
            options={record.options}
            fieldNames={{ label: 'text', value: 'value' }}
            placeholder={'请选择' + name}
            onChange={(key) => {
              record.value = key;
            }}
          />
        );
      case 'boolean':
        return (
          <Select
            value={record.value}
            style={{ width: '100%', textAlign: 'left' }}
            options={[
              { label: 'true', value: true },
              { label: 'false', value: false },
            ]}
            placeholder={'请选择' + name}
            onChange={(key) => {
              record.value = key;
            }}
          />
        );
      case 'int':
      case 'long':
      case 'float':
      case 'double':
        return (
          <InputNumber
            value={record.value}
            style={{ width: '100%' }}
            placeholder={'请输入' + name}
            onChange={(key) => {
              record.value = key;
            }}
          />
        );
      case 'date':
        return (
          <>
            {
              // @ts-ignore
              <DatePicker
                value={record.value && moment(record.value, 'YYYY-MM-DD HH:mm:ss')}
                format={record.format || 'YYYY-MM-DD HH:mm:ss'}
                style={{ width: '100%' }}
                onChange={(_, date) => {
                  record.value = date;
                }}
              />
            }
          </>
        );
      default:
        return (
          <Input
            value={record.value}
            placeholder={'请输入标签值'}
            onChange={(e) => {
              record.value = e.target.value;
            }}
          />
        );
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        title={'标签'}
        width={660}
        onOk={() => {
          const newValue = tagList
            .filter((item) => !!item.value)
            .map((item: any) => {
              return {
                column: item.id,
                type: item.type,
                value: item.value,
              };
            });
          if (props.onChange) {
            props.onChange([{ value: newValue, name: '标签' }]);
          }
          setVisible(false);
          setTagList([{}]);
        }}
        onCancel={() => {
          setVisible(false);
          setTagList([{}]);
          setOptions([]);
        }}
      >
        <div>
          {tagList.map((tag, index) => (
            <Row gutter={12} key={tag.id || index} style={{ marginBottom: 12 }}>
              <Col span={4}>
                {index === 0 ? (
                  <span>标签选择</span>
                ) : (
                  <Select
                    value={tag.type}
                    options={[
                      { label: '并且', value: 'and' },
                      { label: '或者', value: 'or' },
                    ]}
                    style={{ width: '100%' }}
                    onSelect={(key: string) => {
                      const indexItem = tagList[index];
                      indexItem.type = key;
                      tagList[index] = indexItem;
                      setTagList([...tagList]);
                    }}
                  />
                )}
              </Col>
              <Col span={16}>
                <Row gutter={12}>
                  <Col flex="120px">
                    <Select
                      value={tag.id}
                      style={{ width: '120px' }}
                      options={options}
                      onSelect={(_: any, data: any) => {
                        const newList = [...tagList];
                        const indexType = newList[index].type;
                        newList.splice(
                          index,
                          1,
                          handleItem({ ...data, value: undefined, type: indexType }),
                        );
                        setTagList(newList);
                      }}
                      placeholder={'请选择标签'}
                    />
                  </Col>
                  <Col flex={'auto'}>{getItemNode(tag)}</Col>
                </Row>
              </Col>
              <Col span={4}>
                <Space>
                  <Button
                    style={{ padding: '0 8px' }}
                    onClick={() => {
                      setTagList([...tagList, { type: 'and' }]);
                    }}
                  >
                    <PlusOutlined />
                  </Button>
                  {tagList.length !== 1 && (
                    <Button
                      style={{ padding: '0 8px' }}
                      onClick={() => {
                        const newTagList = [...tagList];
                        newTagList.splice(index, 1);
                        setTagList(newTagList);
                      }}
                      danger
                    >
                      <DeleteOutlined />
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>
          ))}
        </div>
      </Modal>
      <Input
        id={props.id}
        value={nameList.length ? nameList.toString() : undefined}
        readOnly
        style={{ width: 300 }}
        onClick={() => {
          setVisible(true);
        }}
        placeholder={'请选择标签'}
      />
    </>
  );
};
