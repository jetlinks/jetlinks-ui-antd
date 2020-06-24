import React, {useEffect, useState} from 'react';
import {FormComponentProps} from 'antd/lib/form';
import Form from 'antd/es/form';
import {Col, Icon, Input, Modal, Row} from 'antd';

interface Props extends FormComponentProps {
  data?: any;
  deviceId?: string;
  close: Function;
  save: (data: any) => void;
}

interface State {
  tagsData: any[];
}

const Tags: React.FC<Props> = props => {
  const initState: State = {
    tagsData: props.data.length > 0 ? props.data : [{key: '', value: '', _id: 0}],
  };

  const [tagsData, setTagsData] = useState(initState.tagsData);

  useEffect(() => {

  }, []);

  const saveData = () => {
    if (tagsData.length > 0) {
      props.save(tagsData);
    } else {
      props.close();
    }
  };

  return (
    <Modal
      title='筛选条件'
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        saveData();
      }}
      width="40%"
      onCancel={() => props.close()}
    >
      <span>设备标签：</span>
      <Form key='tags_form'>
        <Form.Item key="tags_item">
          {tagsData.map((item: any, index) => (
            <Row key={item._id}>
              <Col span={10}>
                <Input placeholder="请输入标签key"
                       value={item.key}
                       onChange={event => {
                         tagsData[index].key = event.target.value;
                         setTagsData([...tagsData]);
                       }}
                />
              </Col>
              <Col span={1} style={{textAlign: 'center'}}/>
              <Col span={10}>
                <Input placeholder="请输入标签value"
                       value={item.value}
                       onChange={event => {
                         tagsData[index].value = event.target.value;
                         setTagsData([...tagsData]);
                       }}
                />
              </Col>
              <Col span={2} style={{textAlign: 'center'}}>
                <Icon
                  type="minus-circle"
                  title="删除标签"
                  onClick={() => {
                    tagsData.splice(index, 1);
                    setTagsData([...tagsData]);
                  }}
                />
              </Col>
            </Row>
          ))}
          <Col span={24}>
            <a onClick={() => {
              setTagsData([...tagsData, {_id: Math.round(Math.random() * 100000)}]);
            }}>添加</a>
          </Col>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(Tags);
