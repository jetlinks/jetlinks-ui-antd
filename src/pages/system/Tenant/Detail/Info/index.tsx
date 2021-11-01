import { Descriptions } from 'antd';
import TenantModel from '@/pages/system/Tenant/model';
import { useIntl } from '@@/plugin-locale/localeExports';

const Info = () => {
  const intl = useIntl();
  return (
    <div>
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="ID">{TenantModel.detail?.id}</Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.table.name',
            defaultMessage: '名称',
          })}
        >
          {TenantModel.detail?.name}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.searchTable.titleStatus',
            defaultMessage: '状态',
          })}
        >
          {TenantModel.detail?.state?.text}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};
export default Info;
