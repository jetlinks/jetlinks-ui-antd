import { Drawer, Button, Table, Switch, Input, message } from "antd";
import React, { useState, useEffect, useRef } from "react";
import encodeQueryParam from "@/utils/encodeParam";
import { zip } from "rxjs";
import Service from "../../../service";
import { TenantItem } from "../../../data";

interface Props {
  close: Function;
  data: Partial<TenantItem>
}

const Save = (props: Props) => {
  const service = new Service('tenant');

  const [tempMap, setTempMap] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userList, setUserList] = useState<any[]>();
  const [selectedRow, setSelectedRow] = useState<any[]>([]);

  const { data: { id } } = props;
  const handleSearch = (params: any) => {
    if (id) {
      zip(service.member.userlist(encodeQueryParam(params)),
        service.member.query(id, {})).subscribe(data => {
          setLoading(false);
          const all: any[] = data[0];
          const checked: any[] = data[1].data.map((i: any) => i.userId);

          const unchecked = all.filter(item => !checked.includes(item.id));
          setLoading(false);
          setUserList(unchecked);
        })

    }
  };

  useEffect(() => {
    handleSearch({});
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
      admin: tempMap.find((i: { id: string }) => i.id === item.id)?.tag || false
    }));
    const tempId = props.data?.id;
    if (tempId) {
      service.member.bind(tempId, tempData).subscribe(() => {
        setLoading(false);
        message.success('保存成功');
        setSelectedRow([]);
        props.close();
      })
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
      render: (text: string) =>
        <Switch
          onChange={(e: boolean) => {
            if (e === false) {
              //移除
              const t = tempMap.filter((i: { id: string }) => i.id !== text);
              setTempMap(t);
            } else {
              tempMap.push({ 'id': text, 'tag': e })
              setTempMap(tempMap);
            }
          }} />
    },
  ];


  return (
    <Drawer
      visible
      width="40VW"
      title="添加用户"
      onClose={() => props.close()}
    >
      <Input.Search style={{ marginBottom: 10 }} />

      <Table
        size="small"
        loading={loading}
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={userList}
      />,
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
            saveData()
          }}
          type="primary"
        >
          保存
        </Button>
      </div>
    </Drawer>
  )
};
export default Save;
