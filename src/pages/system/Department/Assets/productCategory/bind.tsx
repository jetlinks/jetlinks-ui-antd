// 资产-产品分类-绑定
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { getTableKeys, service } from './index';
import { Button, message, Modal, Space } from 'antd';
import Models from './model';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ProductCategoryItem } from '@/pages/system/Department/typings';
import PermissionModal from '@/pages/system/Department/Assets/permissionModal';
import SearchComponent from '@/components/SearchComponent';
import { difference } from 'lodash';

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
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.system.name',
        defaultMessage: '分类名称',
      }),
      search: {
        transform: (value) => ({ username$LIKE: value }),
      },
    },
  ];

  const handleBind = () => {
    if (Models.bindKeys.length && saveRef.current) {
      saveRef.current.saveData();
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
      width={1300}
      title="绑定"
    >
      <PermissionModal
        type="deviceCategory"
        bindKeys={Models.bindKeys}
        ref={saveRef}
        parentId={props.parentId}
        onCancel={(type) => {
          if (type) {
            props.reload();
            props.onCancel();
          }
        }}
      />
      <SearchComponent<ProductCategoryItem>
        field={columns}
        enableSave={false}
        // pattern="simple"
        defaultParam={[
          {
            column: 'id',
            termType: 'dim-assets$not',
            value: {
              assetType: 'deviceCategory',
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
          onSelect: (record, selected, selectedRows) => {
            const keys = getTableKeys(selected ? selectedRows : [record]);
            if (selected) {
              const _map = new Map();
              keys.forEach((k) => {
                _map.set(k, k);
              });
              Models.bindKeys = [..._map.values()];
            } else {
              // 去除重复的key
              Models.bindKeys = difference(Models.bindKeys, keys);
            }
          },
          onSelectAll: (selected, selectedRows) => {
            if (selected) {
              Models.bindKeys = selectedRows.map((item) => item.id);
            } else {
              Models.bindKeys = [];
            }
          },
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <Button
                type={'link'}
                onClick={() => {
                  Models.bindKeys = [];
                }}
              >
                取消选择
              </Button>
            </Space>
          );
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
