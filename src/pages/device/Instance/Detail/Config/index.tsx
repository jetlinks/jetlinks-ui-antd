import { Descriptions, Card, Button } from 'antd';
import { InstanceModel, service } from '@/pages/device/Instance';
import moment from 'moment';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useParams } from 'umi';
import Save from '@/pages/device/Instance/Save';

const Info = observer(() => {
  const intl = useIntl();
  const [visible, setVisible] = useState(false);
  const param = useParams<{ id: string }>();

  const getDetailInfo = async () => {
    const res = await service.detail(param.id);
    if (res.status === 200) {
      InstanceModel.detail = res.result;
    }
  };

  return (
    <Card>
      <Descriptions
        size="small"
        column={3}
        bordered
        title={[
          <span key={1}>
            {intl.formatMessage({
              id: 'pages.device.instanceDetail.info',
              defaultMessage: '设备信息',
            })}
          </span>,
          <Button
            key={2}
            type={'link'}
            onClick={() => {
              setVisible(true);
            }}
          >
            <EditOutlined />
          </Button>,
        ]}
      >
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.instanceDetail.deviceType',
            defaultMessage: '设备类型',
          })}
        >
          {InstanceModel.detail?.deviceType?.text}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.instanceDetail.transportProtocol',
            defaultMessage: '链接协议',
          })}
        >
          {InstanceModel.detail?.protocolName}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.instanceDetail.protocolName',
            defaultMessage: '消息协议',
          })}
        >
          {InstanceModel.detail?.transport}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.instanceDetail.IPAddress',
            defaultMessage: 'IP地址',
          })}
        >
          {InstanceModel.detail?.address}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.instanceDetail.createTime',
            defaultMessage: '创建时间',
          })}
        >
          {moment(InstanceModel.detail?.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.instanceDetail.registerTime',
            defaultMessage: '注册时间',
          })}
        >
          {InstanceModel.detail?.createTime}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.instanceDetail.lastTimeOnline',
            defaultMessage: '最后上线时间',
          })}
        >
          {InstanceModel.detail?.createTime}
        </Descriptions.Item>
        <Descriptions.Item label={''}>{}</Descriptions.Item>
        <Descriptions.Item label={''}>{}</Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.table.description',
            defaultMessage: '说明',
          })}
          span={3}
        >
          {InstanceModel.detail?.description}
        </Descriptions.Item>
      </Descriptions>
      <Save
        data={InstanceModel.detail}
        model={'edit'}
        close={() => {
          setVisible(false);
        }}
        reload={getDetailInfo}
        visible={visible}
      />
    </Card>
  );
});
export default Info;
