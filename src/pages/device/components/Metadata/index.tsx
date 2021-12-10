import { observer } from '@formily/react';
import { Button, Space, Tabs } from 'antd';
import BaseMetadata from './Base';
import { useIntl } from '@@/plugin-locale/localeExports';
import Import from './Import';
import type { ReactNode } from 'react';
import { useState } from 'react';
import Cat from './Cat';
import Service from '@/pages/device/components/Metadata/service';

interface Props {
  tabAction?: ReactNode;
  type: 'product' | 'device';
}

export const service = new Service();
const Metadata = observer((props: Props) => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);
  const [cat, setCat] = useState<boolean>(false);
  return (
    <>
      <Tabs
        tabBarExtraContent={
          <Space>
            {props?.tabAction}
            <Button onClick={() => setVisible(true)}>
              {intl.formatMessage({
                id: 'pages.device.productDetail.metadata.quickImport',
                defaultMessage: '快速导入',
              })}
            </Button>
            <Button onClick={() => setCat(true)}>
              {intl.formatMessage({
                id: 'pages.device.productDetail.metadata',
                defaultMessage: '物模型',
              })}
              TSL
            </Button>
          </Space>
        }
        destroyInactiveTabPane
      >
        <Tabs.TabPane
          tab={intl.formatMessage({
            id: 'pages.device.productDetail.metadata.propertyDefinition',
            defaultMessage: '属性定义',
          })}
          key="properties"
        >
          <BaseMetadata target={props.type} type={'properties'} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={intl.formatMessage({
            id: 'pages.device.productDetail.metadata.functionDefinition',
            defaultMessage: '功能定义',
          })}
          key="functions"
        >
          <BaseMetadata target={props.type} type={'functions'} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={intl.formatMessage({
            id: 'pages.device.productDetail.metadata.eventDefinition',
            defaultMessage: '事件定义',
          })}
          key="events"
        >
          <BaseMetadata target={props.type} type={'events'} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={intl.formatMessage({
            id: 'pages.device.productDetail.metadata.tagDefinition',
            defaultMessage: '标签定义',
          })}
          key="tags"
        >
          <BaseMetadata target={props.type} type={'tags'} />
        </Tabs.TabPane>
      </Tabs>
      <Import visible={visible} close={() => setVisible(false)} />
      <Cat visible={cat} close={() => setCat(false)} />
    </>
  );
});
export default Metadata;
