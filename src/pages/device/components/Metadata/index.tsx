import { observer } from '@formily/react';
import { Space, Tabs, Tooltip } from 'antd';
import BaseMetadata from './Base';
import { useIntl } from '@@/plugin-locale/localeExports';
import Import from './Import';
import type { ReactNode } from 'react';
import { useState } from 'react';
import Cat from './Cat';
import Service from '@/pages/device/components/Metadata/service';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import { InstanceModel, service as instanceService } from '@/pages/device/Instance';
import { PermissionButton } from '@/components';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { useParams } from 'umi';
import { onlyMessage } from '@/utils/util';

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
  const { permission } = PermissionButton.usePermission(
    props.type === 'device' ? 'device/Instance' : 'device/Product',
  );

  const params = useParams<{ id: string }>();

  const resetMetadata = async () => {
    const resp = await instanceService.deleteMetadata(params.id);
    if (resp.status === 200) {
      const res = await instanceService.detail(params.id);
      if (res.status === 200) {
        InstanceModel.detail = res?.result || [];
      }
      onlyMessage('操作成功');
      Store.set(SystemConst.REFRESH_DEVICE, true);
      setTimeout(() => {
        Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
      }, 400);
    }
  };

  return (
    <div className={'device-detail-metadata'} style={{ position: 'relative' }}>
      <div className={styles.tips} style={{ width: 'calc(100% - 670px)' }}>
        <Tooltip
          title={
            InstanceModel.detail?.independentMetadata && props.type === 'device'
              ? '该设备已脱离产品物模型，修改产品物模型对该设备无影响'
              : '设备会默认继承产品的物模型，修改设备物模型后将脱离产品物模型'
          }
        >
          <div className={'ellipsis'}>
            <InfoCircleOutlined style={{ marginRight: '3px' }} />
            {InstanceModel.detail?.independentMetadata && props.type === 'device'
              ? '该设备已脱离产品物模型，修改产品物模型对该设备无影响'
              : '设备会默认继承产品的物模型，修改设备物模型后将脱离产品物模型'}
          </div>
        </Tooltip>
      </div>
      <Tabs
        className={styles.metadataNav}
        type="card"
        tabBarExtraContent={
          <Space>
            {InstanceModel.detail?.independentMetadata && props.type === 'device' && (
              <PermissionButton
                isPermission={permission.update}
                popConfirm={{
                  title: '确认重置？',
                  onConfirm: resetMetadata,
                }}
                tooltip={{
                  title: '重置后将使用产品的物模型配置',
                }}
                key={'reload'}
              >
                重置操作
              </PermissionButton>
            )}
            <PermissionButton isPermission={permission.update} onClick={() => setVisible(true)}>
              {intl.formatMessage({
                id: 'pages.device.productDetail.metadata.quickImport',
                defaultMessage: '快速导入',
              })}
            </PermissionButton>
            <PermissionButton isPermission={true} onClick={() => setCat(true)}>
              {intl.formatMessage({
                id: 'pages.device.productDetail.metadata',
                defaultMessage: '物模型TSL',
              })}
              TSL
            </PermissionButton>
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
          <BaseMetadata target={props.type} type={'properties'} permission={permission} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={intl.formatMessage({
            id: 'pages.device.productDetail.metadata.functionDefinition',
            defaultMessage: '功能定义',
          })}
          key="functions"
        >
          <BaseMetadata target={props.type} type={'functions'} permission={permission} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={intl.formatMessage({
            id: 'pages.device.productDetail.metadata.eventDefinition',
            defaultMessage: '事件定义',
          })}
          key="events"
        >
          <BaseMetadata target={props.type} type={'events'} permission={permission} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={intl.formatMessage({
            id: 'pages.device.productDetail.metadata.tagDefinition',
            defaultMessage: '标签定义',
          })}
          key="tags"
        >
          <BaseMetadata target={props.type} type={'tags'} permission={permission} />
        </Tabs.TabPane>
      </Tabs>
      <Import visible={visible} type={props.type} close={() => setVisible(false)} />
      <Cat visible={cat} close={() => setCat(false)} type={props.type} />
    </div>
  );
});
export default Metadata;
