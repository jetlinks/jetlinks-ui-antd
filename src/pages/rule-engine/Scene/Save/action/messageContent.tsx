import { Col, Form, Row } from 'antd';
import type { FormInstance } from 'antd';
import VarItem from './VariableItem';

interface MessageContentProps {
  name: number;
  template?: any;
  form: FormInstance;
  notifyType: string;
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
                return (
                  <Col span={12} key={`${item.id}_${index}`}>
                    <Form.Item
                      name={[props.name, 'notify', 'variables', item.id]}
                      label={item.name}
                      initialValue={{
                        source: 'fixed',
                        value: undefined,
                      }}
                    >
                      <VarItem form={props.form} data={item} notifyType={props.notifyType} />
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
