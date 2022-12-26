// 资产-产品分类-绑定
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { service } from './index';
import { Badge, message, Modal, Space } from 'antd';
import Models from './model';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import PermissionModal from '@/pages/system/Department/Assets/permissionModal';
import type { ProductItem } from '@/pages/system/Department/typings';
import SearchComponent from '@/components/SearchComponent';
import { ExtraProductCard } from '@/components/ProTableCard/CardItems/product';
import { ProTableCard } from '@/components';
import { AssetsModel } from '@/pages/system/Department/Assets';

interface Props {
  reload: () => void;
  visible: boolean;
  onCancel: () => void;
  parentId: string;
}

const status = {
  1: <Badge status="success" text={'正常'} />,
  0: <Badge status="error" text={'禁用'} />,
};

const Bind = observer((props: Props) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [searchParam, setSearchParam] = useState({});
  const saveRef = useRef<{ saveData: Function }>();
  const [loading, setLoading] = useState(false);

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
      // search: {
      //   transform: (value) => ({ name$LIKE: value }),
      // },
    },
    {
      dataIndex: 'describe',
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (_, row) => <Space size={0}>{status[row.state]}</Space>,
      valueType: 'select',
      width: '90px',
      valueEnum: {
        // 2: {
        //   text: intl.formatMessage({
        //     id: 'pages.searchTable.titleStatus.all',
        //     defaultMessage: '全部',
        //   }),
        //   status: 2,
        // },
        0: {
          text: intl.formatMessage({
            id: 'pages.device.product.status.disabled',
            defaultMessage: '禁用',
          }),
          status: 0,
        },
        1: {
          text: intl.formatMessage({
            id: 'pages.device.product.status.enabled',
            defaultMessage: '正常',
          }),
          status: 1,
        },
      },
    },
  ];

  const handleBind = () => {
    if (Models.bindKeys.length && saveRef.current) {
      setLoading(true);
      saveRef.current?.saveData();
    } else {
      message.warn('请先勾选数据');
      // props.onCancel();
    }
  };

  const unSelect = () => {
    Models.bindKeys = [];
    AssetsModel.params = {};
  };

  const getSelectedRowsKey = (selectedRows) => {
    return selectedRows.map((item) => item?.id).filter((item2) => !!item2 !== false);
  };

  useEffect(() => {
    if (props.visible) {
      actionRef.current?.reload();
    }
  }, [props.visible]);

  return (
    <>
      <Modal
        visible={props.visible}
        onOk={handleBind}
        onCancel={props.onCancel}
        width={'75vw'}
        title="绑定"
        confirmLoading={loading}
      >
        <PermissionModal
          type="product"
          parentId={props.parentId}
          bindKeys={Models.bindKeys}
          ref={saveRef}
          onCancel={(type) => {
            if (type) {
              props.reload();
              props.onCancel();
            }
          }}
        />
        <SearchComponent
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
            unSelect();
            setSearchParam(data);
          }}
          // onReset={() => {
          //   // 重置分页及搜索参数
          //   actionRef.current?.reset?.();
          //   setSearchParam({});
          // }}
          target="department-assets-product"
        />
        <div
          style={{
            height: 'calc(100vh - 440px)',
            overflowY: 'auto',
          }}
        >
          <ProTableCard<ProductItem>
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            search={false}
            gridColumn={2}
            columnEmptyText={''}
            tableAlertRender={({ selectedRowKeys }) => (
              <div>已选择 {selectedRowKeys.length} 项</div>
            )}
            tableAlertOptionRender={() => {
              return (
                <a
                  onClick={() => {
                    unSelect();
                  }}
                >
                  取消选择
                </a>
              );
            }}
            rowSelection={{
              selectedRowKeys: Models.bindKeys,
              // onChange: (selectedRowKeys, selectedRows) => {
              //   Models.bindKeys = selectedRows.map((item) => item.id);
              //   AssetsModel.params = {
              //     productId: selectedRows.map((item) => item.id),
              //   };
              // },
              onSelect: (record, selected, selectedRows) => {
                if (selected) {
                  Models.bindKeys = [
                    ...new Set([...Models.bindKeys, ...getSelectedRowsKey(selectedRows)]),
                  ];
                } else {
                  Models.bindKeys = Models.bindKeys.filter((item) => item !== record.id);
                }
                AssetsModel.params = {
                  productId: Models.bindKeys,
                };
              },
              onSelectAll: (selected, selectedRows, changeRows) => {
                if (selected) {
                  Models.bindKeys = [
                    ...new Set([...Models.bindKeys, ...getSelectedRowsKey(selectedRows)]),
                  ];
                } else {
                  const unChangeRowsKeys = getSelectedRowsKey(changeRows);
                  Models.bindKeys = Models.bindKeys
                    .concat(unChangeRowsKeys)
                    .filter((item) => !unChangeRowsKeys.includes(item));
                }
                AssetsModel.params = {
                  productId: Models.bindKeys,
                };
              },
            }}
            request={(params) =>
              service.queryProductList({
                ...params,
                sorts: [{ name: 'createTime', order: 'desc' }],
              })
            }
            params={searchParam}
            cardRender={(record) => (
              <ExtraProductCard
                showBindBtn={false}
                showTool={false}
                {...record}
                cardType={'bind'}
              />
            )}
            height={'none'}
          />
        </div>
      </Modal>
    </>
  );
});
export default Bind;
