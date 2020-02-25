import React, { useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Row, Col, Select, Modal } from 'antd';
import { NodeProps } from '../data';
import styles from '../index.less';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps, NodeProps {}

interface State {
  typeList: any[];
  configList: any[];
  templateList: any[];
}
const MqttClient: React.FC<Props> = props => {
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
    typeList: [],
    configList: [],
    templateList: [],
  };

  const [typeList, setTypeList] = useState(initState.typeList);
  const [configList, setConfigList] = useState(initState.configList);
  const [templateList, setTemplateList] = useState(initState.templateList);
  // const [type, setType] = useState(initState.type);

  const getConfigLit = (e: string) => {
    apis.notifier
      .config(
        encodeQueryParam({
          paging: false,
          terms: {
            type: e,
          },
        }),
      )
      .then(response => {
        if (response) {
          setConfigList(response.result.data);
        }
      });
  };

  const getTemplate = (e: string) => {
    apis.notifier
      .template(
        encodeQueryParam({
          paging: false,
          terms: {
            type: e,
          },
        }),
      )
      .then(response => {
        if (response) {
          setTemplateList(response.result.data);
        }
      });
  };

  useEffect(() => {
    apis.notifier.configType().then(response => {
      if (response) {
        setTypeList(response.result);
      }
    });
    if (props.config && props.config.type) {
      getConfigLit(props.config.type);
      getTemplate(props.config.type);
    }
  }, []);

  const config: any[] = [
    {
      label: '通知类型',
      key: 'notifyType',
      component: (
        <Select
          onChange={(e: string) => {
            form.resetFields();
            getConfigLit(e);
            getTemplate(e);
          }}
        >
          {typeList.map(i => (
            <Select.Option key={i.id} value={i.id}>
              {i.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: '通知配置',
      key: 'notifierId',
      component: (
        <Select>
          {configList.map(e => (
            <Select.Option key={e.id} value={e.id}>
              {e.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: '通知模版',
      key: 'templateId',
      // styles: {
      //     lg: { span: 24 },
      //     md: { span: 24 },
      //     sm: { span: 24 },
      // },
      component: (
        <Select>
          {templateList.map(e => (
            <Select.Option key={e.id} value={e.id}>
              {e.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  const saveModelData = () => {
    const temp = form.getFieldsValue();
    props.save(temp);
    props.close();
  };

  return (
    <Modal
      title="编辑属性"
      visible
      width={640}
      onCancel={() => props.close()}
      onOk={() => saveModelData()}
    >
      <Form {...inlineFormItemLayout} className={styles.configForm}>
        <Row gutter={16}>
          {config.map(item => (
            <Col
              key={item.key}
              {...item.styles}
              // onBlur={() => {
              //   saveModelData();
              // }}
            >
              <Form.Item label={item.label} {...item.formStyle}>
                {getFieldDecorator<string>(item.key, {
                  initialValue: props.config ? props.config[item.key] : '',
                })(item.component)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(MqttClient);
