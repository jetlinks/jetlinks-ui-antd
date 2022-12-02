import ProTable from '@jetlinks/pro-table';
import SearchComponent from '@/components/SearchComponent';
import { TriggerDeviceModel } from './addModel';
import type { DepartmentItem } from '@/pages/system/Department/typings';
import { service } from '@/pages/system/Department';
import { useState, useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { observer } from '@formily/reactive-react';

export default observer(() => {
  const actionRef = useRef<ActionType>();
  const [sortParam, setSortParam] = useState<any>({ name: 'sortIndex', order: 'asc' });
  const [param, setParam] = useState({});

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
