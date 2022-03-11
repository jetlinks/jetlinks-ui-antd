// 资产-产品分类-绑定
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service, getTableKeys } from './index';
import { Modal, message } from 'antd';
import { useParams } from 'umi';
import Models from './model';
import { useRef, useState, useEffect } from 'react';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ProductCategoryItem } from '@/pages/system/Department/typings';
import PermissionModal from '@/pages/system/Department/Assets/permissionModal';
import SearchComponent from '@/components/SearchComponent';

interface Props {
  reload: () => void;
  visible: boolean;
  onCancel: () => void;
}

const Bind = observer((props: Props) => {
  const intl = useIntl();
  const param = useParams<{ id: string }>();
  const actionRef = useRef<ActionType>();
  const [perVisible, setPerVisible] = useState(false);
  const [searchParam, setSearchParam] = useState({});

  const columns: ProColumns<ProductCategoryItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220,
    },
    {
      dataIndex: 'key',
      title: intl.formatMessage({
        id: 'pages.system.name',
        defaultMessage: '标识',
      }),
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.system.name',
        defaultMessage: '分类名称',
      }),
      search: false,
    },
  ];

  const handleBind = () => {
    if (Models.bindKeys.length) {
      setPerVisible(true);
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
      width={990}
      title="绑定"
    >
      <PermissionModal
        visible={perVisible}
        type="deviceCategory"
        bindKeys={Models.bindKeys}
        onCancel={(type) => {
          setPerVisible(false);
          if (type) {
            props.reload();
            props.onCancel();
          }
        }}
      />
      <SearchComponent<ProductCategoryItem>
        field={columns}
        pattern="simple"
        defaultParam={[
          {
            column: 'id',
            termType: 'dim-assets$not',
            value: {
              assetType: 'deviceCategory',
              targets: [
                {
                  type: 'org',
                  id: param.id,
                },
              ],
            },
          },
        ]}
        onSearch={async (data) => {
          actionRef.current?.reset?.();
          setSearchParam(data);
        }}
        target="department-assets-category"
      />
      <ProTable<ProductCategoryItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        search={false}
        pagination={false}
        rowSelection={{
          selectedRowKeys: Models.bindKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            Models.bindKeys = getTableKeys(selectedRows);
          },
        }}
        params={searchParam}
        request={async (params) => {
          const response = await service.queryProductCategoryList(params);
          return {
            code: response.message,
            result: {
              data: response.result,
              pageIndex: 0,
              pageSize: 0,
              total: 0,
            },
            status: response.status,
          };
        }}
      />
    </Modal>
  );
});
export default Bind;
