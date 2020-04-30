import React, { useEffect, useState } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Card, Col, Popconfirm, Row, Select } from 'antd';
import { AlarmAction } from '@/pages/device/alarm/data';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
  action: Partial<AlarmAction>;
  save: Function;
  remove: Function;
  position: number;
}

interface State {
  actionData: any;
  messageConfig: any[];
  notifyTypeConfig: any[];
  templateConfig: any[];
}

const Action: React.FC<Props> = props => {
  const initState: State = {
    actionData: props.action,
    messageConfig: [],
    notifyTypeConfig: [],
    templateConfig: [],
  };

  const [actionData, setActionData] = useState(initState.actionData);
  const [actionType, setActionType] = useState('');
  const [notifyType, setNotifyType] = useState('');
  const [messageConfig, setMessageConfig] = useState(initState.messageConfig);
  const [templateConfig, setTemplateConfig] = useState(initState.templateConfig);
  const [notifyTypeConfig, setNotifyTypeConfig] = useState(initState.notifyTypeConfig);

  const submitData = () => {
    props.save({ ...actionData });
  };

  useEffect(() => {
    setActionType(actionData.executor);
    if (actionData.configuration) {
      setNotifyType(actionData.configuration.notifyType);
    }
  }, []);

  useEffect(() => {
    if (actionType === 'notifier') {
      apis.notifier.configType().then((res: any) => {
        if (res) {
          setNotifyTypeConfig(res.result);
        }
      });

      /*apis.notifier.config(encodeQueryParam({ paging: false}))
        .then((response: any) => {
          if (response.status === 200) {
            setMessageConfig(response.result.data);
          }
        })
        .catch(() => {
        });*/
    }
  }, [actionType]);

  useEffect(() => {
    findNotifier({ id: notifyType });
  }, [notifyType]);

  const findNotifier = (value: any) => {
    apis.notifier.config(
      encodeQueryParam({
        paging: false,
        terms: {
          type: value.id,
        },
      }))
      .then((response: any) => {
        if (response.status === 200) {
          setMessageConfig(response.result.data);
          response.result.data.map((item: any) => {
            if (item.id === actionData.configuration.notifierId) {
              findTemplate(item);
            }
          });
        }
      })
      .catch(() => {
      });
  };

  const findTemplate = (value: any) => {
    apis.notifier.template(
      encodeQueryParam({
        paging: false,
        terms: {
          type: value.type,
          provider: value.provider,
        },
      }),
    )
      .then(res => {
        if (res.status === 200) {
          setTemplateConfig(res.result?.data);
        }
      })
      .catch(() => {
      });
  };

  const renderActionType = () => {
    switch (actionType) {
      case 'notifier':
        return (
          <div>
            <Col span={4}>
              <Select placeholder="选择通知类型" value={actionData.configuration?.notifyType}
                      onChange={(value: string, event: any) => {
                        findNotifier(event.props.data);
                        if (!actionData.configuration) {
                          actionData.configuration = {};
                        }
                        actionData.configuration.notifyType = value;
                        setActionData({ ...actionData });
                        submitData();
                      }}
              >
                {notifyTypeConfig.length > 0 && notifyTypeConfig.map((item: any) => (
                  <Select.Option key={item.id} data={item}>{item.name}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select placeholder="选择通知配置" value={actionData.configuration?.notifierId}
                      onChange={(value: string, event: any) => {
                        findTemplate(event.props.data);
                        if (!actionData.configuration) {
                          actionData.configuration = {};
                        }
                        actionData.configuration.notifierId = value;
                        setActionData({ ...actionData });
                        submitData();
                      }}
              >
                {messageConfig.length > 0 && messageConfig.map((item: any) => (
                  <Select.Option key={item.id} data={item}>{item.name}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select placeholder="选择通知模板" value={actionData.configuration?.templateId}
                      onChange={(value: string) => {
                        if (!actionData.configuration) {
                          actionData.configuration = {};
                        }
                        actionData.configuration.templateId = value;
                        setActionData({ ...actionData });
                        submitData();
                      }}
              >
                {templateConfig.length > 0 && templateConfig.map((item: any) => (
                  <Select.Option key={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </Col>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ paddingBottom: 5 }}>
      <Card size="small" bordered={false} style={{ backgroundColor: '#F5F5F6' }}>
        <Row>
          <span>执行动作: {props.position + 1}</span>
          <Popconfirm title="确认删除此执行动作？"
                      onConfirm={() => props.remove(props.position)}
          >
            <a style={{ paddingLeft: 30 }}>删除</a>
          </Popconfirm>
        </Row>

        <Row gutter={16} key={props.position + 1} style={{ paddingLeft: 10 }}>
          <Col span={4}>
            <Select placeholder="选择动作类型" value={actionData.executor} key="trigger"
                    onChange={(value: string) => {
                      setActionType(value);
                      actionData.executor = value;
                      setActionData({ ...actionData });
                      submitData();
                    }}
            >
              <Select.Option value="notifier">消息通知</Select.Option>
            </Select>
          </Col>
          {renderActionType()}
        </Row>
      </Card>
    </div>
  );
};

export default Form.create<Props>()(Action);
