import { observer } from '@formily/react';
import { Button, Space, Tabs } from 'antd';
import BaseMetadata from '@/pages/device/Product/Detail/Metadata/Base';
import { useIntl } from '@@/plugin-locale/localeExports';

const Metadata = observer(() => {
  const intl = useIntl();
  return (
    <Tabs
      tabBarExtraContent={
        <Space>
          <Button>
            {intl.formatMessage({
              id: 'pages.device.productDetail.metadata.quickImport',
              defaultMessage: '快速导入',
            })}
          </Button>
          <Button>
            {intl.formatMessage({
              id: 'pages.device.productDetail.metadata',
              defaultMessage: '物模型',
            })}{' '}
            TSL
          </Button>
        </Space>
      }
      destroyInactiveTabPane
    >
      <Tabs.TabPane
        tab={intl.formatMessage({
          id: 'pages.device.productDetail.metadata.attributeDefinition',
          defaultMessage: '属性定义',
        })}
        key="property"
      >
        <BaseMetadata type={'property'} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={intl.formatMessage({
          id: 'pages.device.productDetail.metadata.functionDefinition',
          defaultMessage: '功能定义',
        })}
        key="functions"
      >
        <BaseMetadata type={'function'} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={intl.formatMessage({
          id: 'pages.device.productDetail.metadata.eventDefinition',
          defaultMessage: '事件定义',
        })}
        key="events"
      >
        <BaseMetadata type={'events'} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={intl.formatMessage({
          id: 'pages.device.productDetail.metadata.labelDefinition',
          defaultMessage: '标签定义',
        })}
        key="tag"
      >
        <BaseMetadata type={'tag'} />
      </Tabs.TabPane>
    </Tabs>
  );
});
export default Metadata;
