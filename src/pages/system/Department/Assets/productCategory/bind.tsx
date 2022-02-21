// 资产-产品分类-绑定
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service } from './index';
import { Modal } from 'antd';
import { useParams } from 'umi';
import Models from './model';
import { useRef, useState } from 'react';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ProductCategoryItem } from '@/pages/system/Department/typings';
import PermissionModal from '@/pages/system/Department/Assets/permissionModal';

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
  const columns: ProColumns<ProductCategoryItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 48,
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
      // service.bind('deviceCategory', [{
      //   "targetType": "org",
      //   "targetId": param.id,
      //   "assetType": "deviceCategory",
      //   "assetIdList": Models.bindKeys,
      //   "permission": [
      //     "read"
      //   ]
      // }]).subscribe({
      //   next: () => message.success('操作成功'),
      //   error: () => message.error('操作失败'),
      //   complete: () => {
      //     Models.bindKeys = [];
      //     actionRef.current?.reload();
      //     props.reload();
      //     props.onCancel()
      //   },
      // });
      setPerVisible(true);
    } else {
      props.onCancel();
    }
  };

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
      <ProTable<ProductCategoryItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 5,
        }}
        rowSelection={{
          selectedRowKeys: Models.bindKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            Models.bindKeys = selectedRows.map((item) => item.id);
          },
        }}
        params={{
          terms: [
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
          ],
        }}
        request={(params) => service.queryProductCategoryList(params)}
      />
    </Modal>
  );
});
export default Bind;
