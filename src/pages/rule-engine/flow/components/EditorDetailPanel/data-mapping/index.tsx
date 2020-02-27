import React, { useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Row, Col, Select, Input, Modal, Radio, Card, Icon, Divider } from 'antd';
import { NodeProps } from '../data';
import styles from '../index.less';
import { randomString } from '@/utils/utils';

interface Props extends FormComponentProps, NodeProps {}

interface State {
  httpList: any[];
  rules: {
    id: string;
    source: string;
    target: string;
    type: string | undefined;
  }[];
}
const DataMapping: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const inlineFormItemLayout = {
    labelCol: {
      sm: { span: 5 },
    },
    wrapperCol: {
      sm: { span: 19 },
    },
  };

  const initState: State = {
    httpList: [],
    rules: props.config?.mappings || [
      {
        id: randomString(8),
        source: '',
        target: '',
        type: undefined,
      },
    ],
  };

  const [rules, setRules] = useState(initState.rules);

  const config: any[] = [
    {
      label: '保留原字段',
      key: 'keepSourceData',
      component: (
        <Radio.Group>
          <Radio.Button value>是</Radio.Button>
          <Radio.Button value={false}>否</Radio.Button>
        </Radio.Group>
      ),
    },
  ];

  const saveModelData = () => {
    const temp = form.getFieldsValue();
    props.save({ ...temp, mappings: rules });
    props.close();
  };

  return (
    <Modal
      title="编辑属性"
      visible
      width={840}
      onCancel={() => props.close()}
      onOk={() => saveModelData()}
    >
      <Form {...inlineFormItemLayout} className={styles.configForm}>
        <Row gutter={16}>
          {config.map(item => (
            <Col key={item.key} {...item.styles}>
              <Form.Item label={item.label} {...item.formStyle}>
                {getFieldDecorator<string>(item.key, {
                  initialValue: props.config ? props.config[item.key] : '',
                })(item.component)}
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Form.Item label="转换规则">
          <Card>
            {rules.map((i, index) => (
              <Row key={i.id} style={{ marginBottom: 5 }}>
                <Col span={6}>
                  <Input
                    value={i.source}
                    onChange={e => {
                      rules[index].source = e.target.value;
                      setRules([...rules]);
                    }}
                    placeholder="源字段"
                  />
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  <Divider type="vertical" />
                </Col>
                <Col span={6}>
                  <Input
                    value={i.target}
                    onChange={e => {
                      rules[index].target = e.target.value;
                      setRules([...rules]);
                    }}
                    placeholder="目标字段"
                  />
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  <Divider type="vertical" />
                </Col>
                <Col span={6}>
                  <Select
                    value={i.type}
                    onChange={(e: string) => {
                      rules[index].type = e;
                      setRules([...rules]);
                    }}
                    placeholder="数据类型"
                  >
                    <Select.Option value="int">INT</Select.Option>
                    <Select.Option value="string">STRING</Select.Option>
                    <Select.Option value="date">DATE</Select.Option>
                  </Select>
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  {index === 0 ? (
                    <Icon
                      type="plus"
                      onClick={() => {
                        rules.push({
                          id: randomString(8),
                          source: '',
                          target: '',
                          type: undefined,
                        });
                        setRules([...rules]);
                      }}
                    />
                  ) : (
                    <Icon
                      type="minus"
                      onClick={() => {
                        const tempRules = rules.filter(temp => temp.id !== i.id);
                        setRules([...tempRules]);
                      }}
                    />
                  )}
                </Col>
              </Row>
            ))}
          </Card>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(DataMapping);
