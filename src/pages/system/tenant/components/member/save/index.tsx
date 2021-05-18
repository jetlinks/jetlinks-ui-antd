import { Drawer, Button, Table, Switch, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import encodeQueryParam from '@/utils/encodeParam';
import { zip } from 'rxjs';
import Service from '../../../service';
import { TenantItem } from '../../../data';

interface Props {
  close: Function;
  data: Partial<TenantItem>;
}

const Save = (props: Props) => {
  const service = new Service('tenant');

  const [tempMap, setTempMap] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userList, setUserList] = useState<any[]>();
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [result, setResult] = useState<any>({});
  const {
    data: { id },
  } = props;
  const [searchParam, setSearchParam] = useState<any>({
    pageSize: 10,
    terms: {
      'id$tenant-user$not': id || undefined,
    },
  });

  const handleSearch = (params: any) => {
    setSearchParam(params);
    if (id) {
      zip(
        service.member.userlist(encodeQueryParam(params)),
        service.member.query(id, {}),
      ).subscribe(data => {
        setLoading(false);
        const all: any[] = data[0].data;
        const checked: any[] = data[1].map((i: any) => i.userId);
        setResult(data[0]);
        const unchecked = all.filter(item => !checked.includes(item.id));
        setLoading(false);

        setUserList(unchecked);
      });
    }
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);
  const rowSelection = {
    selectedRowKeys: selectedRow.map(item => item.id),
    onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
      setSelectedRow(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      name: record.name,
    }),
  };

  const saveData = () => {
    if (selectedRow.length <= 0) {
      message.error('请勾选绑定用户');
      return;
    }
    setLoading(true);
    const tempData = selectedRow.map(item => ({
      name: item.name,
      userId: item.id,
      admin: tempMap.find((i: { id: string }) => i.id === item.id)?.tag || false,
    }));
    const tempId = props.data?.id;
    if (tempId) {
      service.member.bind(tempId, tempData).subscribe(() => {
        setLoading(false);
        message.success('保存成功');
        setSelectedRow([]);
        props.close();
      });
    }
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '是否管理员',
      dataIndex: 'id',
      render: (text: string) => (
        <Switch
          onChange={(e: boolean) => {
            if (e === false) {
              //移除
              const t = tempMap.filter((i: { id: string }) => i.id !== text);
              setTempMap(t);
            } else {
              tempMap.push({ id: text, tag: e });
              setTempMap(tempMap);
            }
          }}
        />
      ),
    },
  ];
  const onTableChange = (pagination: any, filters: any, sorter: any) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      // sorts: sorter.field ? sorter : searchParam.sorter,
    });
  };

  return (
    <Drawer visible width="40VW" title="添加用户" onClose={() => props.close()}>
      <Input.Search
        placeholder="输入姓名搜索"
        style={{ marginBottom: 10 }}
        onSearch={value => {
          handleSearch({
            pageSize: 10,
            terms: { name$LIKE: value },
          });
        }}
      />
      <div style={{ marginBottom: '30px' }}>
        <Table
          size="small"
          loading={loading}
          rowKey="id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={result.data}
          onChange={onTableChange}
          pagination={{
            current: result.pageIndex + 1,
            total: result.total,
            pageSize: result.pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total: number) =>
              `共 ${total} 条记录 第  ${result.pageIndex + 1}/${Math.ceil(
                result.total / result.pageSize,
              )}页`,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button
          onClick={() => {
            props.close();
          }}
          style={{ marginRight: 8 }}
        >
          关闭
        </Button>
        <Button
          onClick={() => {
            saveData();
          }}
          type="primary"
        >
          保存
        </Button>
      </div>
    </Drawer>
  );
};
export default Save;
