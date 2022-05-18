import { Button, message, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'umi';
import { service } from '../index';
import { ApiModel } from '@/pages/system/Platforms/Api/base';

interface TableProps {
  data: any;
  operations: string[];
  // 是否只暂时已授权的接口
  isShowGranted?: boolean;
}

export default (props: TableProps) => {
  const [selectKeys, setSelectKeys] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const getApiGrant = useCallback(() => {
    const param = new URLSearchParams(location.search);
    const code = param.get('code');

    service.getApiGranted(code!).then((resp: any) => {
      if (resp.status === 200) {
        setSelectKeys(resp.result);
      }
    });
  }, [location]);

  const getOperations = async (apiData: any[], operations: string[]) => {
    // 过滤只能授权的接口，当isShowGranted为true时，过滤为已赋权的接口
    console.log(
      apiData.filter((item) => item && item.operationId && operations.includes(item.operationId)),
    );
    setDataSource(
      apiData.filter((item) => item && item.operationId && operations.includes(item.operationId)),
    );
  };

  useEffect(() => {
    if (props.isShowGranted) {
      if (props.data && selectKeys) {
        getOperations(props.data, selectKeys);
      } else {
        setDataSource([]);
      }
    }
  }, [props.isShowGranted, selectKeys, props.data]);

  useEffect(() => {
    if (!props.isShowGranted) {
      if (props.data && props.data.length && props.operations) {
        getOperations(props.data, props.operations);
      } else {
        setDataSource([]);
      }
    }
  }, [props.data, props.operations, props.isShowGranted]);

  useEffect(() => {
    getApiGrant();
  }, []);

  const save = useCallback(async () => {
    const param = new URLSearchParams(location.search);
    const code = param.get('code');
    const operations = selectKeys.map((a: string) => {
      const item = dataSource.find((b) => b.operationId === a);
      return {
        id: a,
        permissions: item.security,
      };
    });

    setLoading(true);
    const resp = await service.saveApiGrant(code!, { operations });
    setLoading(false);
    if (resp.status === 200) {
      message.success('操作成功');
    }
  }, [selectKeys, location, dataSource]);

  console.log(dataSource);

  return (
    <div className={'platforms-api-table'}>
      <Table<any>
        rowKey={'operationId'}
        columns={[
          {
            title: 'API',
            dataIndex: 'url',
            render: (text: string, record) => {
              return (
                <Button
                  type={'link'}
                  style={{ padding: 0 }}
                  onClick={() => {
                    ApiModel.swagger = record;
                    ApiModel.showTable = false;
                  }}
                >
                  {text}
                </Button>
              );
            },
          },
          {
            title: '说明',
            dataIndex: 'summary',
          },
        ]}
        pagination={false}
        dataSource={dataSource}
        rowSelection={
          props.isShowGranted !== true
            ? {
                selectedRowKeys: selectKeys,
                onSelect: (record, selected) => {
                  if (selected) {
                    const newArr = [...selectKeys, record.operationId];
                    setSelectKeys(newArr);
                  } else {
                    setSelectKeys([...selectKeys.filter((key) => key !== record.operationId)]);
                  }
                },
                onSelectAll: (selected, selectedRows) => {
                  if (selected) {
                    setSelectKeys(
                      selectedRows.filter((item) => !!item).map((item) => item.operationId),
                    );
                  } else {
                    setSelectKeys([]);
                  }
                },
              }
            : undefined
        }
        scroll={{ y: 600 }}
      />
      {props.isShowGranted !== true && (
        <div className={'platforms-api-save'}>
          <Button type={'primary'} onClick={save} loading={loading}>
            保存
          </Button>
        </div>
      )}
    </div>
  );
};
