import ProTable from '@jetlinks/pro-table';
import SearchComponent from '@/components/SearchComponent';
import { TriggerDeviceModel } from './addModel';
import type { DepartmentItem } from '@/pages/system/Department/typings';
import { service } from '@/pages/system/Department';
import { useState, useRef, useEffect } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { observer } from '@formily/reactive-react';

const orgOptions = new Map();
export default observer(() => {
  const actionRef = useRef<ActionType>();
  const [sortParam, setSortParam] = useState<any>({ name: 'sortIndex', order: 'asc' });
  const [param, setParam] = useState({});
  const [openKeys, setOpenKeys] = useState<any[]>([]);

  useEffect(() => {
    return () => {
      orgOptions.clear();
    };
  }, []);

  const columns: ProColumns<DepartmentItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '排序',
      dataIndex: 'sortIndex',
      valueType: 'digit',
      sorter: true,
      render: (_, record) => <>{record.sortIndex}</>,
    },
  ];

  const handleOptions = (data: any[]) => {
    if (!data) return;
    data.forEach((item) => {
      orgOptions.set(item.id, { id: item.id, parentId: item.parentId });
      if (item.children) {
        handleOptions(item.children);
      }
    });
  };

  const findPid = (id: string, keys: string[]): string[] => {
    const _item = orgOptions.get(id);
    keys.push(_item.id);
    if (_item.parentId) {
      return findPid(_item.parentId, keys);
    }
    return keys;
  };

  return (
    <>
      <SearchComponent<DepartmentItem>
        field={columns}
        enableSave={false}
        onSearch={(data) => {
          setParam(data);
        }}
        bodyStyle={{ padding: 0, paddingBottom: 16 }}
        model={'simple'}
        target="scene-triggrt-device-category"
      />
      <ProTable<DepartmentItem>
        params={param}
        rowKey="id"
        search={false}
        tableClassName={''}
        columns={columns}
        pagination={false}
        actionRef={actionRef}
        columnEmptyText={''}
        tableAlertRender={false}
        options={false}
        scroll={{
          y: 350,
        }}
        expandable={{
          expandedRowKeys: openKeys,
          onExpandedRowsChange: (keys) => {
            setOpenKeys(keys as any[]);
          },
        }}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: [TriggerDeviceModel.orgId],
          onChange: (_, selectedRows) => {
            if (selectedRows.length) {
              const item = selectedRows[0];
              TriggerDeviceModel.orgId = item.id;
              TriggerDeviceModel.selectorValues = [
                { value: TriggerDeviceModel.orgId, name: item.name },
              ];
            } else {
              TriggerDeviceModel.orgId = '';
              TriggerDeviceModel.selectorValues = [];
            }
          },
        }}
        onChange={(_, f, sorter: any) => {
          if (sorter.order) {
            setSortParam({ name: sorter.columnKey, order: sorter.order.replace('end', '') });
          } else {
            setSortParam({ name: 'sortIndex', value: 'asc' });
          }
        }}
        request={async (params) => {
          const response = await service.queryOrgThree({
            paging: false,
            sorts: [sortParam],
            ...params,
          });

          handleOptions(response.result);
          if (TriggerDeviceModel.orgId) {
            const _openKeys = findPid(TriggerDeviceModel.orgId, []);
            setOpenKeys(_openKeys);
          }
          return {
            code: response.message,
            result: {
              data: response.result as DepartmentItem[],
              pageIndex: 0,
              pageSize: 0,
              total: 0,
            },
            status: response.status,
          };
        }}
      />
    </>
  );
});
