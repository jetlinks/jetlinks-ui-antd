import { Descriptions } from 'antd';
import { InstanceModel } from '@/pages/device/Instance';
import moment from 'moment';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';

const Info = observer(() => {
  const intl = useIntl();
  return (
    <>
      <Descriptions size="small" column={3}>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.table.deviceId',
            defaultMessage: '设备ID',
          })}
        >
          {InstanceModel.detail?.id}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.table.productName',
            defaultMessage: '产品名称',
          })}
        >
          {InstanceModel.detail?.name}
        </Descriptions.Item>
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
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.table.description',
            defaultMessage: '说明',
          })}
        >
          {InstanceModel.detail?.description}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
});
export default Info;
