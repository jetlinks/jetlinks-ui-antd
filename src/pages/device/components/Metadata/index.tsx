import { observer } from '@formily/react';
import { Button, Space, Tabs } from 'antd';
import BaseMetadata from './Base';
import { useIntl } from '@@/plugin-locale/localeExports';
import Import from './Import';
import type { ReactNode } from 'react';
import { useState } from 'react';
import Cat from './Cat';
import Service from '@/pages/device/components/Metadata/service';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import { InstanceModel } from '@/pages/device/Instance';

interface Props {
  tabAction?: ReactNode;
  type: 'product' | 'device';
  independentMetadata?: boolean;
}

export const service = new Service();
const Metadata = observer((props: Props) => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);
  const [cat, setCat] = useState<boolean>(false);
  console.log(InstanceModel.detail, 'test');
  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.tips}>
        <InfoCircleOutlined style={{ marginRight: '3px' }} />
        {InstanceModel.detail?.independentMetadata
          ? '该设备已脱离产品物模型，修改产品物模型对该设备无影响'
          : '设备会默认继承产品的物模型，修改设备物模型后将脱离产品物模型'}
      </div>
      <Tabs
        className={styles.metadataNav}
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
    </div>
  );
});
export default Metadata;
