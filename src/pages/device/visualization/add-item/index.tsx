import React, { useState, useEffect } from 'react';
// import 'antd/dist/antd.css';

import { List, Modal, Row, Col } from 'antd';

import loadable from '@loadable/component';
import styles from './index.less';
import { ChartsConfig } from '../config';

interface Props {
  close: Function;
  save: Function;
  metaData: any;
  current: any
}

export interface EditProps {
  save: Function;
  metadata: any;
  data: any;
}

const AddItem = (props: Props) => {

  // 父组件直接调用子组件方法感觉不太友好。可以给子组件传个state，子组件useEffect监听改变后触发操作
  // 如果用redux的话，数据放redux里，父组件直接dispatch就行
  const [type, setType] = useState<any>();

  let submit: Function;
  const renderEdit = (t: string) => {
    const EditComponent = loadable<EditProps>(() => import(`./edit/${t}Edit`));

    return (
      <EditComponent
        data={props.current}
        save={(onSubmit: Function) => { submit = onSubmit }}
        metadata={props.metaData}
      />
    )
  }

  const getConfigData = () => {
    const data = submit();
    if (data) {
      if (props.current?.id) {
        props.save({ component: type, ...data, id: props.current.id });
      } else {
        props.save({ component: type, ...data });
      }
    }
  }

  useEffect(() => {
    setType(props.current?.config?.component);

  }, []);

  return (

    <Modal
      visible
      title="新增"
      width="80vw"
      onCancel={() => props.close()}
      onOk={() => getConfigData()}
      okText="确定"
      cancelText="关闭"
    >
      <Row>

        <Col xs={12} sm={14} md={16} lg={16} xl={16}>
          <div
            className={styles.basicinfo}
          >
            <Row style={{ paddingBottom: 15 }}>选择图表</Row>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 4,
              }}
              dataSource={ChartsConfig}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  onClick={() => {
                    setType(item.id);
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      height: 180,
                      width: 180,
                      paddingTop: 10,
                    }}
                    className={item.id === type ? styles.checked : styles.item}
                  >
                    <img height={150} width={150} src={item.preview} alt="" />
                  </div>
                </List.Item>
              )}
            />
          </div>

        </Col>

        <Col xs={12} sm={10} md={8} lg={8} xl={8} style={{ paddingLeft: 20 }}>
          <Row style={{ paddingBottom: 15 }}>基本信息</Row>
          {type && renderEdit(type)}
        </Col>
      </Row>
    </Modal >
  );
};
export default AddItem;
