import { Descriptions } from 'antd';
import { InstanceModel } from '@/pages/device/Instance';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { useHistory } from 'umi';

const Info = observer(() => {
  const intl = useIntl();
  const history = useHistory();
  return (
    <>
      <Descriptions size="small" column={5}>
        <Descriptions.Item label={'ID'}>{InstanceModel.detail?.id}</Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.device.firmware.productName',
            defaultMessage: '链接协议',
          })}
        >
          <a
            onClick={() => {
              history.push({
                pathname: `${getMenuPathByCode(MENUS_CODE['device/Product'])}`,
                state: {
                  id: InstanceModel.detail?.productId,
                },
              });
            }}
          >
            {InstanceModel.detail?.productName}
          </a>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
});
export default Info;
