import { PageContainer } from '@ant-design/pro-layout';
import AMapComponent from '@/components/AMapComponent';
import { useIntl } from '@@/plugin-locale/localeExports';

const Location = () => {
  const intl = useIntl();
  return (
    <PageContainer
      title={intl.formatMessage({
        id: 'pages.device.productLocation.geographic.location',
        defaultMessage: '地理位置',
      })}
    >
      <AMapComponent />
    </PageContainer>
  );
};
export default Location;
