import { Button, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { service } from '../index';

interface TableProps {
  parentId: string;
  onJump: (id: string) => void;
}

export default (props: TableProps) => {
  const [selectKeys, setSelectKeys] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState([]);

  const queryData = async (pId: string) => {
    const resp: any = service.queryRoleList(pId);
    if (resp.status === 200) {
      setDataSource(resp.result);
    }
  };

  useEffect(() => {
    queryData(props.parentId);
  }, [props.parentId]);

  const save = useCallback(async () => {}, [selectKeys]);

  return (
    <div className={'platforms-api-table'}>
      <Table<any>
        columns={[
          {
            title: 'API',
            dataIndex: 'name',
            render: (text: string, record) => {
              return (
                <Button
                  type={'link'}
                  style={{ padding: 0 }}
                  onClick={() => {
                    props.onJump(record.id);
                  }}
                >
                  {text}
                </Button>
              );
            },
          },
          {
            title: '说明',
            dataIndex: '',
          },
        ]}
        dataSource={dataSource}
        rowSelection={{
          selectedRowKeys: selectKeys,
          onSelect: (record, selected) => {
            if (selected) {
              const newArr = [...selectKeys, record];
              setSelectKeys(newArr);
            } else {
              setSelectKeys([...selectKeys.filter((key) => key !== record)]);
            }
          },
          onSelectAll: (_, selectedRows) => {
            setSelectKeys(selectedRows);
          },
        }}
      />
      <div className={'platforms-api-save'}>
        <Button type={'primary'} onClick={save}>
          保存
        </Button>
      </div>
    </div>
  );
};
