import React, { useEffect } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Checkbox, Modal } from 'antd';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: any[];
}

const Content: React.FC<Props> = props => {

  const {
    form: { getFieldDecorator },
    form,
  } = props;

  useEffect(() => {

  }, []);

  const onContentForm = async () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      props.save(fileValue.data);
    });
  };

  return (
    <Modal
      title='地图显示要素'
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        onContentForm();
      }}
      onCancel={() => props.close()}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item key="data" label="显示要素">
          {getFieldDecorator('data', {
            initialValue: props.data,
          })(
            <Checkbox.Group options={[
              { label: '区域面(bg)', value: 'bg' },
              { label: '线/道路(road)', value: 'road' },
              { label: '标注(point)', value: 'point' },
              { label: '建筑物(building)', value: 'building' },
            ]}/>,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(Content);
