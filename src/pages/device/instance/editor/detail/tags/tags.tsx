import React, { useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import Form from 'antd/es/form';
import { Col, Icon, Input, message, Modal, Row, Spin } from 'antd';
import apis from '@/services';

interface Props extends FormComponentProps {
  data?: any;
  deviceId?: string;
  close: Function;
  save: (data: any) => void;
}

interface State {
  tagsData: any[];
  spinning:boolean;
}

const Tags: React.FC<Props> = props => {
  const initState: State = {
    tagsData: props.data.length > 0 ? props.data : [{ key: '', value: '', name: '', _id: 0 }],
    spinning:true
  };

  const [tagsData, setTagsData] = useState(initState.tagsData);
  const [spinning, setSpinning] = useState(initState.spinning);

  useEffect(() => {
    setSpinning(false);
  }, []);

  const saveData = () => {
    if (tagsData.length > 0){
      props.save(tagsData);
    } else {
      props.close();
    }
  };

  const removeTags = (val: number) => {
    setSpinning(true);
    if (tagsData[val].id) {
      apis.deviceInstance.removeTags(props.deviceId, tagsData[val].id).then((res:any) => {
        if (res.status === 200) {
          setSpinning(false);
          message.success('删除成功');
          tagsData.splice(val, 1);
          setTagsData([...tagsData]);
        }
      }).catch(() => {
      });
    } else {
      setSpinning(false);
      tagsData.splice(val, 1);
      setTagsData([...tagsData]);
    }
  };

  return (
    <Modal
      title='编辑配置'
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        saveData();
      }}
      width="40%"
      onCancel={() => props.close()}
    >
      <Spin tip="操作中..." spinning={spinning}>
        <Form>
          <Form.Item key="item">
            {tagsData.map((item:any, index) => (
              <Row key={item._id}>
                <Col span={5}>
                  <Input placeholder="请输入标签key"
                         key="key"
                         value={item.key}
                         disabled={!!item.id}
                         onChange={event => {
                           tagsData[index].key = event.target.value;
                           setTagsData([...tagsData]);
                         }}
                  />
                </Col>
                <Col span={1} style={{ textAlign: 'center' }}/>
                <Col span={5}>
                  <Input placeholder="请输入标签名称"
                         key="name"
                         value={item.name}
                         onChange={event => {
                           tagsData[index].name = event.target.value;
                           setTagsData([...tagsData]);
                         }}
                  />
                </Col>
                <Col span={1} style={{ textAlign: 'center' }}/>
                <Col span={10}>
                  <Input placeholder="请输入标签value"
                         value={item.value}
                         key="value"
                         onChange={event => {
                           tagsData[index].value = event.target.value;
                           setTagsData([...tagsData]);
                         }}
                  />
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  {index === 0 ? (
                    <Row>
                    <Icon
                      type="plus-circle"
                      title="新增标签"
                      onClick={() => {
                        setTagsData([...tagsData, { _id: tagsData.length + 1 }]);
                      }}
                    />
                      <Icon style={{marginLeft:5}}
                        type="minus-circle"
                        title="删除标签"
                        onClick={() => {
                          removeTags(index);
                        }}
                      />
                    </Row>
                  ) : (
                    <Icon
                      type="minus-circle"
                      title="删除标签"
                      onClick={() => {
                        removeTags(index);
                      }}
                    />
                  )}
                </Col>
              </Row>
            ))}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Form.create<Props>()(Tags);
