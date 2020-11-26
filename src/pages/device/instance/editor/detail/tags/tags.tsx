import React, {useEffect, useState} from 'react';
import {FormComponentProps} from 'antd/lib/form';
import Form from 'antd/es/form';
import {Col, Icon, Input, message, Modal, Row, Spin} from 'antd';
import apis from '@/services';
import Location from './location/index';

interface Props extends FormComponentProps {
  data?: any;
  deviceId?: string;
  close: Function;
  save: (data: any) => void;
}

interface State {
  tagsData: any[];
  spinning: boolean;
  tagInfo: any;
  tagSequence: number;
}

const Tags: React.FC<Props> = props => {
  const initState: State = {
    tagsData: props.data.length > 0 ? props.data : [{key: '', value: '', name: '', _id: 0}],
    spinning: true,
    tagInfo: {},
    tagSequence: -1,
  };

  const [tagsData, setTagsData] = useState(initState.tagsData);
  const [spinning, setSpinning] = useState(initState.spinning);
  const [location, setLocation] = useState(false);
  const [tagInfo, setTagInfo] = useState(initState.tagInfo);
  const [tagSequence, setTagSequence] = useState(initState.tagSequence);

  useEffect(() => {
    setSpinning(false);
  }, []);

  const saveData = () => {
    let data = tagsData.filter(item => {
      return (item.key != '') && (item.name != '') && (item.value != '') && (item.key != undefined) && (item.name != undefined) && (item.value != undefined)
    })
    if (data.length > 0) {
      props.save(data);
    } else {
      props.close();
    }
  };

  const removeTags = (val: number) => {
    setSpinning(true);
    if (tagsData[val].id) {
      apis.deviceInstance.removeTags(props.deviceId, tagsData[val].id).then((res: any) => {
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
      title='编辑标签'
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
        <Form key='tags_form'>
          <Form.Item key="tags_item">
            {tagsData.map((item: any, index) => (
              <Row key={`tags_${item._id || item.id}`}>
                <Col span={5}>
                  <Input placeholder="请输入标签key"
                         value={item.key}
                         disabled={!!item.id}
                         onChange={event => {
                           tagsData[index].key = event.target.value;
                           setTagsData([...tagsData]);
                         }}
                  />
                </Col>
                <Col span={1} style={{textAlign: 'center'}}/>
                <Col span={5}>
                  <Input placeholder="请输入标签名称"
                         value={item.name}
                         onChange={event => {
                           tagsData[index].name = event.target.value;
                           setTagsData([...tagsData]);
                         }}
                  />
                </Col>
                <Col span={1} style={{textAlign: 'center'}}/>
                <Col span={10}>
                  {item.type === 'geoPoint' ? (
                    <Input addonAfter={<Icon onClick={() => {
                      setTagInfo(item);
                      setTagSequence(index);
                      setLocation(true);
                    }
                    } type="environment" title="点击选择经纬度"/>}
                           placeholder="请输入标签value"
                           value={item.value}
                           onChange={event => {
                             tagsData[index].value = event.target.value;
                             setTagsData([...tagsData]);
                           }}/>
                  ) : (
                    <Input placeholder="请输入标签value"
                           value={item.value}
                           onChange={event => {
                             tagsData[index].value = event.target.value;
                             setTagsData([...tagsData]);
                           }}
                    />
                  )}
                </Col>
                <Col span={2} style={{textAlign: 'center'}}>
                  <Icon
                    type="minus-circle"
                    title="删除标签"
                    onClick={() => {
                      removeTags(index);
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
        {location && (
          <Location close={() => {
            setLocation(false);
            setTagInfo({});
            setTagSequence(-1);
          }} save={(tagsInfo: any, sequence: number) => {
            tagsData[sequence].value = tagsInfo.value;
            setTagsData([...tagsData]);
            setLocation(false);
            setTagInfo({});
            setTagSequence(-1);
          }} tagInfo={tagInfo} tagSequence={tagSequence}/>
        )}
      </Spin>
    </Modal>
  );
};

export default Form.create<Props>()(Tags);
