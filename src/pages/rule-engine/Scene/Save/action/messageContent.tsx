import type { FormInstance } from 'antd';
import { Col, Form, Input, Row } from 'antd';
import {
  BuiltIn,
  OrgList,
  TagSelect,
  UserList,
} from '@/pages/rule-engine/Scene/Save/action/VariableItems';
import { InputFile } from '@/pages/rule-engine/Scene/Save/components';
import { useCallback } from 'react';

interface MessageContentProps {
  name: number;
  template?: any;
  form: FormInstance;
  notifyType: string;
  triggerType: string;
  configId: string;
}

const rowGutter = 12;

export default (props: MessageContentProps) => {
  const getRules = useCallback(
    (item: any, type: string): any[] => {
      const rules = [];
      if (item.required) {
        rules.push({
          validator: async (_: any, value: any) => {
            if (type === 'file' && !value) {
              return Promise.reject(new Error('请输入' + item.name));
            } else {
              if (!value || !value.value) {
                if (['date', 'org', 'user'].includes(type)) {
                  if (
                    ['sms', 'voice', 'email'].includes(props.notifyType) &&
                    value.source !== 'relation'
                  ) {
                    return Promise.reject(new Error('请输入' + item.name));
                  }
                  return Promise.reject(new Error('请选择' + item.name));
                } else {
                  return Promise.reject(new Error('请输入' + item.name));
                }
              }
            }
            return Promise.resolve();
          },
        });
      }

      if (type === 'link') {
        rules.push({ max: 64, message: '最多64个字符' });
      }

      if (type === 'user') {
        if (props.notifyType === 'email') {
          rules.push({
            validator: async (_: any, value: any) => {
              if (value.value) {
                const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (!reg.test(value.value)) {
                  return Promise.reject(new Error('请输入正确的邮箱地址'));
                }
              }
              return Promise.resolve();
            },
          });
        }

        if (['sms', 'voice'].includes(props.notifyType)) {
          rules.push({
            validator: async (_: any, value: any) => {
              if (value.value) {
                const reg = /^[1][3-9]\d{9}$/;
                if (!reg.test(value.value)) {
                  return Promise.reject(new Error('请输入正确的手机号码'));
                }
              }
              return Promise.resolve();
            },
          });
        }
      }

      return rules;
    },
    [props.notifyType],
  );

  return (
    <>
      {props.template && (
        <div className={'template-variable'}>
          {props.template.variableDefinitions ? (
            <Row gutter={rowGutter}>
              {props.template.variableDefinitions.map((item: any, index: number) => {
                const type = item.expands?.businessType || item.type;
                const _name = [props.name, 'notify', 'variables', item.id];
                let initialValue = undefined;
                const rules = getRules(item, type);
                if (type === 'user') {
                  initialValue = {
                    source: 'relation',
                    value: undefined,
                  };
                } else if (['date', 'number', 'string'].includes(type)) {
                  initialValue = {
                    source: 'fixed',
                    value: undefined,
                  };
                }
                return (
                  <Col span={12} key={`${item.id}_${index}`}>
                    <Form.Item
                      name={_name}
                      label={item.name}
                      initialValue={initialValue}
                      required={!!item.required}
                      rules={rules}
                    >
                      {type === 'user' ? (
                        <UserList
                          notifyType={props.notifyType}
                          configId={props.configId}
                          type={props.triggerType}
                        />
                      ) : type === 'org' ? (
                        <OrgList notifyType={props.notifyType} configId={props.configId} />
                      ) : type === 'file' ? (
                        <InputFile />
                      ) : type === 'tag' ? (
                        <TagSelect configId={props.configId} />
                      ) : type === 'link' ? (
                        <Input placeholder={'请输入' + item.name} />
                      ) : (
                        <BuiltIn type={props.triggerType} data={item} />
                      )}
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
          ) : null}
        </div>
      )}
    </>
  );
};
