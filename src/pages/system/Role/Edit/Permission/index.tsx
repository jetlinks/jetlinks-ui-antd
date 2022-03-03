import { useEffect, useState } from 'react';
import { Button, Card, message, Steps } from 'antd';
import Service from '@/pages/system/Role/service';
import styles from './index.less';
import DataPermission from './DataPermission';
import MenuPermission from './MenuPermission';
import encodeQuery from '@/utils/encodeQuery';
import { useParams } from 'umi';
import _ from 'lodash';

const Permission = () => {
  const service = new Service('role');
  const params = useParams<{ id: string }>();
  const [current, setCurrent] = useState<number>(0);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [initialValues, setInitialValues] = useState<any>({});
  const [menuPermissions, setMenuPermissions] = useState<any[]>([]);
  const [dataPermissions, setDataPermissions] = useState<any[]>([]);
  const [info, setInfo] = useState<RoleItem>();

  const getDetail = async (id: string) => {
    const res = await service.detail(id);
    if (res.status === 200) {
      setInfo(res.result);
      setDataPermissions(res.result?.dataAccess || []);
    }
  };

  const handleSearch = (data: any) => {
    service.queryMenuTreeList(encodeQuery(data)).subscribe((resp) => {
      if (resp.status === 200) {
        setDataSource(resp.result);
      }
    });
  };

  const breadthQuery = (tree: any[], id: string) => {
    let stark: any[] = [];
    stark = stark.concat(tree);
    while (stark.length) {
      const temp = stark.shift();
      if (temp.children) {
        stark = stark.concat(temp.children);
      }
      if (temp.id === id) {
        return temp;
      }
    }
    return undefined;
  };

  const initToMenu = (initList: any[], list: any[]) => {
    if (Array.isArray(initList) && initList.length > 0) {
      return initList.map((item) => {
        const data = breadthQuery(list, item.id);
        if ((item?.children.length > 0 || item?.buttons.length > 0 || item.check) && data) {
          const dt: any = { ...data, buttons: [], children: [] };
          if (item?.children && item?.children?.length > 0) {
            dt.children = initToMenu(item.children, list);
          }
          if (
            item?.buttons &&
            item?.buttons?.length > 0 &&
            data?.buttons &&
            data?.buttons?.length > 0
          ) {
            const buttons = data.buttons.filter((i: any) => item.buttons.includes(i.id));
            dt.buttons = [...buttons];
          }
          return dt;
        }
      });
    }
    return [];
  };

  const initToPermission = (list: any[]) => {
    if (Array.isArray(list) && list.length > 0) {
      return list.map((item) => {
        const data = breadthQuery(dataSource, item.id);
        const ilen: number =
          (initToPermission(item.children) || []).filter((i: any) => i.indeterminate || i.check)
            ?.length || 0;
        const clen: number =
          (initToPermission(item.children) || []).filter((i: any) => i.check)?.length || 0;
        const check =
          clen + (item?.buttons?.length || 0) ===
          (data?.children?.length || 0) + (data?.buttons?.length || 0);
        return {
          id: item.id,
          check: check,
          indeterminate: (ilen > 0 || item?.buttons?.length > 0) && !check,
          buttons: _.map(item.buttons || [], 'id') || [],
          children: initToPermission(item.children) || [],
        };
      });
    }
    return [];
  };

  const initialMenu = (id: string) => {
    service.queryGrantTree('role', id).subscribe((resp) => {
      if (resp.status === 200) {
        const data = initToPermission(resp.result);
        const len = data.filter((i: any) => i.indeterminate)?.length;
        const lenC = data.filter((i: any) => i.check)?.length;
        const d = {
          id: 'menu-permission',
          check: dataSource.length === lenC,
          children: [...data],
          indeterminate: len > 0,
          buttons: [],
        };
        setInitialValues(d);
      }
    });
  };

  useEffect(() => {
    handleSearch({ paging: false });
    if (params?.id) {
      getDetail(params.id);
    }
  }, []);

  useEffect(() => {
    if (dataSource.length > 0) {
      initialMenu(params.id);
    }
  }, [dataSource]);

  return (
    <Card className={styles.rolePermission}>
      <Steps current={current}>
        <Steps.Step title="菜单权限" />
        <Steps.Step title="数据权限" />
      </Steps>
      <div style={{ marginTop: '15px' }}>
        {current === 0 && (
          <div className={styles.rolePermission}>
            {/* <Input.Search enterButton placeholder="请输入权限名称" onSearch={() => { }} style={{ width: 300, marginBottom: '15px' }} /> */}
            <div style={{ border: '1px solid #f0f0f0' }}>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '15px',
                  width: '100%',
                  paddingLeft: '10px',
                  backgroundColor: '#fafafa',
                  height: '55px',
                  lineHeight: '55px',
                  fontWeight: 600,
                }}
              >
                菜单权限
              </div>
              <div style={{ padding: '0 20px', overflowY: 'scroll', height: '500px' }}>
                <MenuPermission
                  initialValues={initialValues}
                  key={'menu-permission'}
                  value={{
                    id: 'menu-permission',
                    buttons: [],
                    name: '菜单权限',
                    children: [...dataSource],
                  }}
                  change={(data: any) => {
                    setInitialValues(data);
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {current === 1 && (
          <DataPermission
            initialValues={info?.dataAccess || []}
            data={menuPermissions}
            change={(data: any) => {
              const dataAccess: any[] = [];
              Object.keys(data).forEach((key) => {
                if (data[key].value) {
                  const dimensions = (data[key]?.type || []).map((i: string) => {
                    return { dimensionType: i };
                  });
                  dataAccess.push({
                    assetType: key,
                    dimensions,
                  });
                }
              });
              setDataPermissions(dataAccess);
            }}
          />
        )}
      </div>
      <div style={{ marginTop: '15px' }}>
        {current === 0 && (
          <Button
            type="primary"
            onClick={() => {
              const data = initToMenu(initialValues.children, dataSource).filter((i) => i);
              if (data.length > 0) {
                setCurrent(1);
                setMenuPermissions(data);
              } else {
                message.error('请选择菜单权限！');
              }
            }}
          >
            下一步
          </Button>
        )}
        {current === 1 && (
          <>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                setCurrent(0);
                initialMenu(params.id);
              }}
            >
              上一步
            </Button>
            <Button
              type="primary"
              onClick={async () => {
                const res = await service.modify(params?.id, {
                  id: params?.id || '',
                  name: info?.name,
                  description: info?.description,
                  dataAccess: [...dataPermissions],
                });
                if (res.status === 200) {
                  getDetail(params.id);
                }
                service
                  .saveGrantTree('role', params.id, {
                    merge: true,
                    priority: 0,
                    menus: [...menuPermissions],
                  })
                  .subscribe((resp) => {
                    if (resp.status === 200) {
                      message.success('操作成功！');
                      initialMenu(params.id);
                    }
                  });
              }}
            >
              保存
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
export default Permission;
