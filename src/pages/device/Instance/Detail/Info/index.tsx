import { Card, Descriptions } from 'antd';
import { InstanceModel } from '@/pages/device/Instance';
import moment from 'moment';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import Config from '@/pages/device/Instance/Detail/Config';
import Save from '../../Save';
import { useState } from 'react';
import type { DeviceInstance } from '../../typings';

const Info = observer(() => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <Card
        title={'设备信息'}
        extra={
          <a
            onClick={() => {
              setVisible(true);
            }}
          >
            编辑
          </a>
        }
      >
        <Descriptions size="small" column={3} bordered>
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
            {moment(InstanceModel.detail?.registerTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.device.instanceDetail.lastTimeOnline',
              defaultMessage: '最后上线时间',
            })}
          >
            {InstanceModel.detail?.onlineTime
              ? moment(InstanceModel.detail?.onlineTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'}
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
      </Card>
      <Config />
      <Save
        data={{ ...InstanceModel?.detail, describe: InstanceModel?.detail?.description || '' }}
        close={(data: DeviceInstance | undefined) => {
          setVisible(false);
          if (data) {
            InstanceModel.detail = {
              ...InstanceModel.detail,
              name: data?.name,
              description: data?.describe,
            };
          }
        }}
        visible={visible}
      />
    </>
  );
});
export default Info;
