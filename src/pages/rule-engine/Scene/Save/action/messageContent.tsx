import { Col, Form, Row, Select } from 'antd';
import { ItemGroup } from '@/pages/rule-engine/Scene/Save/components';
import { ProFormText, ProFormSelect, ProFormDatePicker } from '@ant-design/pro-form';

interface MessageContentProps {
  type?: string;
  template?: any;
}

const rowGutter = 12;

export default (props: MessageContentProps) => {
  const inputNodeByType = (data: any) => {
    switch (data.type) {
      case 'enum':
        return (
          <ProFormSelect
            name={['variables', data.id]}
            placeholder={`请选择${name}`}
            style={{ width: '100%' }}
          />
        );
      case 'timmer':
        return (
          <ProFormDatePicker
            name={['variables', data.id]}
            placeholder={'请选择时间'}
            style={{ width: '100%' }}
          />
        );
      case 'number':
        return (
          <ProFormText
            name={['variables', data.id]}
            placeholder={`请输入${name}`}
            style={{ width: '100%' }}
          />
        );
      default:
        return <ProFormText name={['variables', data.id]} placeholder={`请输入${name}`} />;
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
                    <Form.Item label={item.name} required={!item.required}>
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
