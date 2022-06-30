// 资产-产品分类-绑定
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { service } from './index';
import { message, Modal } from 'antd';
import Models from './model';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import PermissionModal from '@/pages/system/Department/Assets/permissionModal';
import type { ProductItem } from '@/pages/system/Department/typings';
import SearchComponent from '@/components/SearchComponent';
import { ExtraProductCard } from '@/components/ProTableCard/CardItems/product';
import { ProTableCard } from '@/components';
import { ASSETS_TABS_ENUM, AssetsModel } from '@/pages/system/Department/Assets';

interface Props {
  reload: () => void;
  visible: boolean;
  onCancel: () => void;
  parentId: string;
}

const Bind = observer((props: Props) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [searchParam, setSearchParam] = useState({});
  const saveRef = useRef<{ saveData: Function }>();
  const [deviceVisible, setDeviceVisible] = useState(false);

  const columns: ProColumns<ProductItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      dataIndex: 'describe',
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
      hideInSearch: true,
    },
  ];

  const handleBind = () => {
    if (Models.bindKeys.length && saveRef.current) {
      saveRef.current?.saveData();
    } else {
      message.warn('请先勾选数据');
      // props.onCancel();
    }
  };

  useEffect(() => {
    if (props.visible) {
      actionRef.current?.reload();
    }
  }, [props.visible]);

  return (
    <Modal
      visible={props.visible}
      onOk={handleBind}
      onCancel={props.onCancel}
      width={800}
      title="绑定"
    >
      <Modal
        visible={deviceVisible}
        width={800}
        onCancel={() => {
          setDeviceVisible(false);
          props.reload();
          props.onCancel();
        }}
        onOk={() => {
          setDeviceVisible(false);
          AssetsModel.tabsIndex = ASSETS_TABS_ENUM.Device;
          AssetsModel.bindModal = true;
          props.onCancel();
        }}
        title={'绑定'}
      >
        是否继续分配产品下的具体设备
      </Modal>
      <PermissionModal
        type="product"
        parentId={props.parentId}
        bindKeys={Models.bindKeys}
        ref={saveRef}
        onCancel={(type) => {
          if (type) {
            setDeviceVisible(true);
          }
        }}
      />
      <SearchComponent<ProductItem>
        field={columns}
        model={'simple'}
        enableSave={false}
        defaultParam={[
          {
            column: 'id',
            termType: 'dim-assets$not',
            value: {
              assetType: 'product',
              targets: [
                {
                  type: 'org',
                  id: props.parentId,
                },
              ],
            },
          },
        ]}
        onSearch={async (data) => {
          actionRef.current?.reset?.();
          setSearchParam(data);
        }}
        // onReset={() => {
        //   // 重置分页及搜索参数
        //   actionRef.current?.reset?.();
        //   setSearchParam({});
        // }}
        target="department-assets-product"
      />
      <ProTableCard<ProductItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        search={false}
        gridColumn={2}
        rowSelection={{
          selectedRowKeys: Models.bindKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            Models.bindKeys = selectedRows.map((item) => item.id);
          },
        }}
        request={(params) => service.queryProductList(params)}
        params={searchParam}
        cardRender={(record) => (
          <ExtraProductCard showBindBtn={false} {...record} cardType={'bind'} />
        )}
      />
    </Modal>
  );
});
export default Bind;
