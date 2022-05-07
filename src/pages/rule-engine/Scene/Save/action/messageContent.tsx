import type { FormInstance } from 'antd';
import { Col, Form, Input, Row } from 'antd';
import {
  BuiltIn,
  OrgList,
  TagSelect,
  UserList,
} from '@/pages/rule-engine/Scene/Save/action/VariableItems';
import { InputFile } from '@/pages/rule-engine/Scene/Save/components';

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
                const rules = [];
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
                if (item.required) {
                  rules.push({
                    validator: async (_: any, value: any) => {
                      if (!value.value) {
                        if (['date'].includes(type)) {
                          return Promise.reject(new Error('请选择' + item.name));
                        } else {
                          return Promise.reject(new Error('请输入' + item.name));
                        }
                      }
                      return Promise.resolve();
                    },
                  });
                }
                if (type === 'link') {
                  rules.push({ max: 64, message: '最多64个字符' });
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
