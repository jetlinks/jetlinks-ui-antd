import React, { useState } from 'react';
import { Button, Card, Descriptions, message } from 'antd';
import moment from 'moment';
import { DeviceInstance } from '../../data';
import Configuration from '@/pages/device/instance/editor/detail/configuration';
import apis from '@/services';

interface Props {
  data: Partial<DeviceInstance>;
  configuration: any;
}
interface State {
  updateVisible:boolean;
}
const Info: React.FC<Props> = props => {
  const initState: State = {
    updateVisible:false,
  };

  const [updateVisible, setUpdateVisible] = useState(initState.updateVisible);

  const updateData = (item?: any) => {
    props.data.configuration = item.configuration;
    setUpdateVisible(false);
    apis.deviceInstance
      .update(props.data.id,item)
      .then(reponse => {
        if (reponse.status === 200) {
          message.success('配置信息修改成功');
          setUpdateVisible(false)
        } else {
          message.error("配置信息修改失败")
        }
      })
      .catch(() => {});
  };

  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <Descriptions style={{ marginBottom: 20 }} bordered column={3} size="small"
                      title={<span>型号信息</span>}>
          <Descriptions.Item label="设备名称" span={1}>
            {props.data.name}
          </Descriptions.Item>
          <Descriptions.Item label="设备型号" span={1}>
            {props.data.productName}
          </Descriptions.Item>
          <Descriptions.Item label="设备类型" span={1}>
            {props.data.deviceType?.text}
          </Descriptions.Item>
          <Descriptions.Item label="所属机构" span={1}>
            {props.data.orgName}
          </Descriptions.Item>
          <Descriptions.Item label="链接协议" span={1}>
            {props.data.transport}
          </Descriptions.Item>
          <Descriptions.Item label="消息协议" span={1}>
            {props.data.protocol}
          </Descriptions.Item>
          <Descriptions.Item label="IP地址" span={1}>
            {props.data.address}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1}>
            {moment(props.data.createTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间" span={1}>
            {moment(props.data.registerTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="最后上线时间" span={1}>
            {moment(props.data.onlineTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="说明" span={3}>
            {props.data.describe}
          </Descriptions.Item>
        </Descriptions>

        {props.configuration && props.configuration.name && (
          <Descriptions style={{ marginBottom: 20 }} bordered size="small" column={3}
            title={
              <span>
                {props.configuration.name}
                <Button icon="edit" style={{ marginLeft: 20 }} type="link"
                  onClick={() => setUpdateVisible(true)}
                >编辑</Button>
              </span>
            }>
            {props.configuration.properties &&
            props.configuration.properties.map((item: any) => (
              <Descriptions.Item label={item.property} span={1} key={item.property}>
                {props.data.configuration[item.property]}
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </Card>
      {updateVisible && (
        <Configuration data={props.data} configuration={props.configuration}
          close={() => setUpdateVisible(false)}
          save={(item: any) => {
            updateData(item);
          }}
        />
      )}
    </div>
  )
};

export default Info;
