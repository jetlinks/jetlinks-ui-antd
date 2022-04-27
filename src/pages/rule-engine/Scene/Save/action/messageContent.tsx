import { Col, Form, Row } from 'antd';
import type { FormInstance } from 'antd';
import { BuiltIn, OrgList, UserList } from '@/pages/rule-engine/Scene/Save/action/VariableItems';
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
                return (
                  <Col span={12} key={`${item.id}_${index}`}>
                    {type === 'user' ? (
                      <Form.Item
                        name={_name}
                        label={item.name}
                        initialValue={{
                          source: 'relation',
                          value: undefined,
                        }}
                      >
                        <UserList
                          notifyType={props.notifyType}
                          configId={props.configId}
                          type={props.triggerType}
                        />
                      </Form.Item>
                    ) : type === 'org' ? (
                      <Form.Item name={_name} label={item.name}>
                        <OrgList notifyType={props.notifyType} configId={props.configId} />
                      </Form.Item>
                    ) : type === 'file' ? (
                      <Form.Item name={_name} label={item.name}>
                        <InputFile />
                      </Form.Item>
                    ) : (
                      <Form.Item
                        name={_name}
                        label={item.name}
                        initialValue={{
                          source: 'fixed',
                          value: undefined,
                        }}
                      >
                        <BuiltIn type={props.triggerType} data={item} />
                      </Form.Item>
                    )}
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
