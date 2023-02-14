import { Button, Table } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'umi';
import { service } from '../index';
import { ApiModel } from '@/pages/system/Platforms/Api/base';
import { onlyMessage } from '@/utils/util';
import PermissionButton from '@/components/PermissionButton';
import _ from 'lodash';

interface TableProps {
  data: any;
  operations: string[] | undefined;
  // 是否只展示已授权的接口
  isShowGranted?: boolean;
  //
  isOpenGranted?: boolean;
  //
  grantKeys: string[] | undefined;
}

export default (props: TableProps) => {
  const [selectKeys, setSelectKeys] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [GrantKeys, setGrantKeys] = useState<string[] | undefined>(undefined);
  const { permission } = PermissionButton.usePermission('system/Platforms/Setting');

  const grantCache = useRef<string[]>([]);

  const location = useLocation();

  const getOperations = async (apiData: any[], operations: string[]) => {
    // 过滤只能授权的接口，当isShowGranted为true时，过滤为已赋权的接口
    setDataSource(
      apiData.filter((item) => item && item.operationId && operations.includes(item.operationId)),
    );
  };

  const getApiGrant = useCallback(() => {
    const param = new URLSearchParams(location.search);
    const code = param.get('code');

    if (props.isOpenGranted === false) {
      service.apiOperations().then((resp: any) => {
        if (resp.status === 200) {
          setGrantKeys(resp.result);
        }
      });
    } else {
      service.getApiGranted(code!).then((resp: any) => {
        if (resp.status === 200) {
          setGrantKeys(resp.result);
        }
      });
    }
  }, [location, props.isOpenGranted]);

  /**
   * 获取已授权的接口ID
   */
  useEffect(() => {
    grantCache.current = props.grantKeys || [];
    setSelectKeys(props.grantKeys || []);
    setGrantKeys(props.grantKeys);
  }, [props.grantKeys]);

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
    if (props.isOpenGranted === false) {
      setDataSource(props.data);
    } else if (!props.isShowGranted) {
      if (props.data && props.data.length && props.operations) {
        getOperations(props.data, props.operations);
      } else {
        setDataSource([]);
      }
    }
  }, [props.data, props.operations, props.isShowGranted, props.isOpenGranted]);

  const save = useCallback(async () => {
    const param = new URLSearchParams(location.search);
    const code = param.get('code');
    // 和原有已授权数据进行对比
    const addGrant = selectKeys.filter((key) => {
      if (grantCache.current.includes(key)) {
        return false;
      }
      return true;
    });

    // 获取删除的数据
    const removeGrant = grantCache.current.filter((key) => {
      if (selectKeys.includes(key)) {
        return false;
      }
      return true;
    });

    const addOperations = addGrant.map((a: string) => {
      const item = dataSource.find((b) => b.operationId === a);
      return {
        id: a,
        permissions: item?.security,
      };
    });

    const removeOperations = removeGrant.map((a: string) => {
      const item = dataSource.find((b) => b.operationId === a);
      return {
        id: a,
        permissions: item?.security,
      };
    });

    grantCache.current = addGrant;

    setLoading(true);
    if (props.isOpenGranted === false) {
      console.log('del-------', removeGrant);
      console.log('add-------', addGrant);
      const resp2 = removeGrant.length ? await service.apiOperationsRemove(removeGrant) : {};
      const resp = await service.apiOperationsAdd(addGrant);
      if (resp.status === 200 || resp2.status === 200) {
        getApiGrant();
        onlyMessage('操作成功');
      }
    } else {
      const resp2 = await service.removeApiGrant(code!, {
        operations: removeOperations.filter((item) => item.permissions),
      });
      const resp = await service.addApiGrant(code!, {
        operations: addOperations.filter((item) => item.permissions),
      });
      if (resp.status === 200 || resp2.status === 200) {
        getApiGrant();
        onlyMessage('操作成功');
      }
    }
    setLoading(false);
  }, [selectKeys, location, dataSource, props.isOpenGranted]);

  useEffect(() => {
    console.log('GrantKeys-=========', GrantKeys);
    if (GrantKeys) {
      setSelectKeys(GrantKeys);
    }
  }, [GrantKeys]);

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
                  style={{ padding: 0, width: '100%', textAlign: 'left' }}
                  onClick={() => {
                    console.log(record);
                    ApiModel.showTable = false;
                    ApiModel.swagger = record;
                  }}
                >
                  <span className={'ellipsis'}>{text}</span>
                </Button>
              );
            },
          },
          {
            title: '说明',
            dataIndex: 'summary',
            ellipsis: true,
          },
        ]}
        pagination={false}
        dataSource={dataSource}
        rowSelection={
          props.isShowGranted !== true
            ? {
                selectedRowKeys: selectKeys,
                onSelect: (record, selected) => {
                  console.log('selected----', selected);
                  if (selected) {
                    const newArr = [...selectKeys, record.operationId];
                    setSelectKeys(newArr);
                  } else {
                    setSelectKeys([...selectKeys.filter((key) => key !== record.operationId)]);
                  }
                },
                onSelectAll: (selected, selectedRows) => {
                  // console.log('selectedRows',selected,selectedRows)
                  if (selected) {
                    // const items = selectedRows.filter((item) => !!item).map((item) => item.operationId).concat(props.grantKeys)
                    // console.log(items)
                    setSelectKeys(
                      selectedRows
                        .filter((item) => !!item)
                        .map((item) => item.operationId)
                        .concat(GrantKeys),
                    );
                  } else {
                    // setSelectKeys([]);
                    // console.log(dataSource,GrantKeys)
                    const diffList = _.difference(
                      GrantKeys,
                      dataSource.map((item) => item.operationId),
                    );
                    setSelectKeys(diffList);
                  }
                },
              }
            : undefined
        }
        scroll={{ y: 600 }}
      />
      {props.isShowGranted !== true && (
        <div className={'platforms-api-save'}>
          <PermissionButton
            isPermission={permission.update}
            onClick={save}
            key={'update'}
            type={'primary'}
            style={{ padding: 0, width: 80 }}
            loading={loading}
          >
            保存
          </PermissionButton>
          {/* <Button type={'primary'} onClick={save} >
            保存
          </Button> */}
        </div>
      )}
    </div>
  );
};
