// 部门-资产分配
import { Tabs } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import Product from './product';
import Device from '@/pages/system/Department/Assets/deivce';
import Member from '@/pages/system/Department/Member';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { isNoCommunity } from '@/utils/util';

interface AssetsProps {
  parentId: string;
}

export enum ASSETS_TABS_ENUM {
  'ProductCategory' = 'ProductCategory',
  'Product' = 'Product',
  'Device' = 'Device',
  'User' = 'User',
}

export const AssetsModel = model<{
  tabsIndex: string;
  bindModal: boolean;
  parentId: string;
  params: any;
  tabsArray: any[];
}>({
  tabsIndex: ASSETS_TABS_ENUM.Product,
  bindModal: false,
  parentId: '',
  params: {},
  tabsArray: [],
});

const Assets = observer((props: AssetsProps) => {
  const intl = useIntl();

  // 资产类型
  const TabsArray = [
    // {
    //   intlTitle: '1',
    //   defaultMessage: '产品分类',
    //   key: ASSETS_TABS_ENUM.ProductCategory,
    //   components: ProductCategory,
    // },
    {
      intlTitle: '2',
      defaultMessage: '产品',
      key: ASSETS_TABS_ENUM.Product,
      components: Product,
    },
    {
      intlTitle: '3',
      defaultMessage: '设备',
      key: ASSETS_TABS_ENUM.Device,
      components: Device,
    },
    {
      intlTitle: '4',
      defaultMessage: '用户',
      key: ASSETS_TABS_ENUM.User,
      components: Member,
    },
  ];

  useEffect(() => {
    if (isNoCommunity) {
      AssetsModel.tabsIndex = ASSETS_TABS_ENUM.Product;
      AssetsModel.tabsArray = [...TabsArray];
    } else {
      AssetsModel.tabsIndex = ASSETS_TABS_ENUM.User;
      AssetsModel.tabsArray = [
        {
          intlTitle: '1',
          defaultMessage: '用户',
          key: ASSETS_TABS_ENUM.User,
          components: Member,
        },
      ];
    }
  }, []);

  useEffect(() => {
    AssetsModel.parentId = props.parentId;
  }, [props.parentId]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* <div style={{ position: 'absolute', top: 12, left: 180 }}>
        <ExclamationCircleOutlined style={{ marginRight: 12 }} />
        部门拥有的资产为所有类型资产的并集
      </div> */}
      <Tabs
        activeKey={AssetsModel.tabsIndex}
        onChange={(key) => {
          AssetsModel.tabsIndex = key;
        }}
      >
        {(AssetsModel?.tabsArray || []).map((item) => (
          <Tabs.TabPane
            tab={intl.formatMessage({
              id: item.intlTitle,
              defaultMessage: item.defaultMessage,
            })}
            key={item.key}
          >
            <item.components parentId={props.parentId} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
});

export default Assets;
