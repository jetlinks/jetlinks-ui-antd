import { Col, Form, Input, Row, Select, TimePicker } from 'antd';
import { ItemGroup } from '@/pages/rule-engine/Scene/Save/components';

interface MessageContentProps {
  name: number;
  template?: any;
}

const rowGutter = 12;

export default (props: MessageContentProps) => {
  const inputNodeByType = (data: any) => {
    switch (data.type) {
      case 'enum':
        return <Select placeholder={`请选择${data.name}`} style={{ width: '100%' }} />;
      case 'timmer':
        return <TimePicker style={{ width: '100%' }} />;
      case 'number':
        return <Input placeholder={`请输入${data.name}`} style={{ width: '100%' }} />;
      default:
        return <Input placeholder={`请输入${data.name}`} />;
    }
  };

  return (
    <>
      {props.template && (
        <div className={'template-variable'}>
          {props.template.variableDefinitions ? (
            <Row gutter={rowGutter}>
              {props.template.variableDefinitions.map((item: any) => {
                // const rules = !item.required ? [{ required: true, message: '请输入'+ item.name }] : undefined
                return (
                  <Col span={12} key={item.id}>
                    <Form.Item
                      name={[props.name, 'notify', 'variables', item.id]}
                      label={item.name}
                    >
                      <ItemGroup>
                        <Select
                          defaultValue={'1'}
                          options={[
                            { label: '手动输入', value: '1' },
                            { label: '内置参数', value: '2' },
                          ]}
                          style={{ width: 120 }}
                        />
                        {inputNodeByType(item)}
                      </ItemGroup>
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
