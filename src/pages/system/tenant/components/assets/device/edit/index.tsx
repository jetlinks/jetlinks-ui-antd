import { Button, Drawer, message, } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import Service from "@/pages/system/tenant/service";
import encodeQueryParam from "@/utils/encodeParam";
import SearchForm from "@/components/SearchForm";
import ProTable from "@/pages/system/permission/component/ProTable";
import Add from "./add";
import User from "./user";
import { router } from 'umi';

interface Props {
  close: Function;
  data: any;
  user: any;
}

interface State {
  list: any
}

const Edit = (props: Props) => {
  const service = new Service('tenant');

  const initState: State = {
    list: {}
  };

  const [list, setList] = useState(initState.list);
  const [add, setAdd] = useState<boolean>(false);
  const { data } = props;
  const [cat, setCat] = useState<boolean>(false);
  const [asset, setAsset] = useState();
  const [selected, setSelected] = useState<any[]>([]);
  const [tenant, setTenant] = useState<any[]>([]);

  const initSearch = {
    terms: {
      id$assets: JSON.stringify({
        tenantId: data?.id,
        assetType: 'device',
        memberId: props.user,
        // not: true,
      })
    },
    pageIndex: 0,
    pageSize: 10,
  };
  const [searchParam, setSearchParam] = useState<any>(initSearch);
  useEffect(() => {
    list.data?.map((item: any) => {
      service.assets.members(data.id, 'device', item.id).subscribe(resp => {
        tenant[item.id] = resp.filter((item: any) => item.binding === true).map((i: any) => i.userName).join('、')
        setTenant({ ...tenant });
      });
    });
  }, [list]);

  // let device = (tempSearch: any, datalist: any[]) => {
  //   return new Promise((resolve) => {
  //     service.assets.device(encodeQueryParam(tempSearch)).subscribe(res => {
  //       if (res.data.length > 0) {
  //         res.data.forEach((value: any) => {
  //           service.assets.members(data.id, 'device', value.id).subscribe(resp => {
  //             let str = '';
  //             resp.filter((item: any) => item.binding === true).map((i: any) => i.userName).forEach((i: string) => {
  //               str += i + '、'
  //             });
  //             datalist.push({
  //               id: value.id,
  //               name: value.name,
  //               tenant: str.substring(0, str.length - 1)
  //             });
  //             if (datalist.length == res.data.length) {
  //               resolve({
  //                 pageIndex: res.pageIndex,
  //                 pageSize: res.pageSize,
  //                 total: res.total,
  //                 data: datalist
  //               })
  //             }
  //           });
  //         })
  //       }else {
  //         resolve({
  //           pageIndex: res.pageIndex,
  //           pageSize: res.pageSize,
  //           total: res.total,
  //           data: []
  //         })
  //       }
  //     })
  //   })
  // };

  const handleSearch = (params: any) => {
    const tempParam = { ...searchParam, ...params, };
    const defaultItem = searchParam.terms;
    const tempTerms = params?.terms;
    const terms = tempTerms ? { ...defaultItem, ...tempTerms } : initSearch;
    let tempSearch: {};

    if (tempTerms) {
      tempParam.terms = terms;
      tempSearch = tempParam
    } else {
      tempSearch = initSearch
    }
    setSearchParam(tempSearch);
    service.assets.device(encodeQueryParam(tempSearch)).subscribe(res => {
      if (res.data.length > 0) {
        let datalist: any = [];
        res.data.forEach((value: any) => {
          datalist.push({
            id: value.id,
            name: value.name
          })
        })
        setList({
          pageIndex: res.pageIndex,
          pageSize: res.pageSize,
          total: res.total,
          data: datalist
        })
      } else {
        setList({
          pageIndex: res.pageIndex,
          pageSize: res.pageSize,
          total: res.total,
          data: []
        })
      }
    })
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);
  const rowSelection = {
    onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
      setSelected(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      name: record.name,
    }),
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center'
    }, {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '租户名称',
      ellipsis: true,
      align: 'left',
      width: 400,
      render: (record: any) => <div
        style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
        onClick={() => {
          setAsset(record);
          setCat(true);
        }}><span style={{ color: '#1890ff' }}>{tenant[record.id]}</span></div>
    },
    {
      title: '操作',
      align: 'center',
      render: (_: string, record: any) => (
        <Fragment>
          <a onClick={() => {
            router.push(`/device/instance/save/${record.id}`);
          }}>查看</a>
        </Fragment>
      )
    }
  ];
  const unbind = () => {
    service.assets.unbind(data.id, [{
      assetIdList: selected.map(item => item.id),
      assetType: 'device'
    }]).subscribe(() => {
      message.success('解绑成功');
      setSelected([]);
      handleSearch(searchParam);
    })
  };
  return (
    <Drawer
      title="编辑设备资产"
      visible
      width='75VW'
      onClose={() => props.close()}
    >

      <SearchForm
        search={(params: any) => {
          handleSearch({ terms: params })
        }}
        formItems={[
          {
            label: "ID",
            key: "id$LIKE",
            type: 'string'
          },
          {
            label: "名称",
            key: "name$LIKE",
            type: 'string'
          }
        ]}
      />
      <Button
        type="primary"
        style={{ marginBottom: 10 }}
        onClick={() => setAdd(true)}>添加</Button>
      {
        selected.length > 0 && (
          <Button
            type="danger"
            style={{ marginBottom: 10, marginLeft: 10 }}
            onClick={() => {
              unbind()
            }}>
            {`解绑${selected.length}项`}
          </Button>
        )
      }
      <ProTable
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={list?.data || []}
        onSearch={(searchData: any) => handleSearch(searchData)}
        paginationConfig={list || {}}
      />

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
      </div>
      {add && (
        <Add
          user={props.user}
          data={data}
          close={() => {
            setAdd(false);
            handleSearch(searchParam);
          }} />
      )}
      {cat && <User asset={asset} close={() => {
        setCat(false);
        handleSearch(searchParam);
      }} />}
    </Drawer>
  )
};
export default Edit;
