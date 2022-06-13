// 部门-资产分配
import { Tabs } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import ProductCategory from './productCategory';
import Product from './product';
import Device from '@/pages/system/Department/Assets/deivce';
import Member from '@/pages/system/Department/Member';

interface AssetsProps {
  parentId: string;
}

const Assets = (props: AssetsProps) => {
  const intl = useIntl();

  // 资产类型
  const TabsArray = [
    {
      intlTitle: '1',
      defaultMessage: '产品分类',
      key: 'ProductCategory',
      components: ProductCategory,
    },
    {
      intlTitle: '2',
      defaultMessage: '产品',
      key: 'Product',
      components: Product,
    },
    {
      intlTitle: '3',
      defaultMessage: '设备',
      key: 'Device',
      components: Device,
    },
    {
      intlTitle: '4',
      defaultMessage: '用户',
      key: 'User',
      components: Member,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="ProductCategory">
        {TabsArray.map((item) => (
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
};

export default Assets;
