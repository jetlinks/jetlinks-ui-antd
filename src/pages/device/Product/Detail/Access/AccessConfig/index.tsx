import { useEffect, useState } from 'react';
import { Col, Modal, Pagination, Row } from 'antd';
import { service } from '@/pages/link/AccessConfig';
import { productModel } from '@/pages/device/Product';
import SearchComponent from '@/components/SearchComponent';
import type { ProColumns } from '@jetlinks/pro-table';
import styles from './index.less';
import Service from '@/pages/device/Product/service';

import AccessConfigCard from '@/components/ProTableCard/CardItems/AccessConfig';
import { getMenuPathByCode } from '@/utils/menu';
import PermissionButton from '@/components/PermissionButton';
import { onlyMessage } from '@/utils/util';
import Empty from '@/components/Empty';
import _ from 'lodash';
import MetadataAction from '@/pages/device/components/Metadata/DataBaseAction';

interface Props {
  close: () => void;
  data?: any;
}

const AccessConfig = (props: Props) => {
  const { close } = props;
  const service1 = new Service('device-product');
  const { permission } = PermissionButton.usePermission('link/AccessConfig');

  const [dataSource, setDataSource] = useState<any>({
    data: [],
    pageSize: 4,
    pageIndex: 0,
    total: 0,
  });
  const [param, setParam] = useState<any>({
    pageSize: 4,
    terms: [],
  });

  const [currrent, setCurrrent] = useState<any>({
    id: productModel.current?.accessId,
    name: productModel.current?.accessName,
    protocol: productModel.current?.messageProtocol,
    transport: productModel.current?.transportProtocol,
    protocolDetail: {
      name: productModel.current?.protocolName,
    },
  });

  const handleSearch = (params: any) => {
    setParam(params);
    const temp = {
      ...params,
      terms:
        productModel.current?.deviceType?.value === 'childrenDevice'
          ? [
              ...params.terms,
              {
                terms: [
                  {
                    column: 'provider',
                    termType: 'in',
                    value: 'child-device,edge-child-device',
                  },
                  {
                    column: 'state',
                    termType: 'eq',
                    value: 'enabled',
                  },
                ],
              },
            ]
          : [
              ...params?.terms,
              {
                terms: [
                  {
                    column: 'state',
                    termType: 'eq',
                    value: 'enabled',
                  },
                ],
              },
            ],
    };
    service.queryList({ ...temp, sorts: [{ name: 'createTime', order: 'desc' }] }).then((resp) => {
      setDataSource(resp?.result);
      setCurrrent(resp?.result?.data?.[0]);
    });
  };

  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '网关类型',
      dataIndex: 'provider',
      renderText: (text) => text?.text,
      valueType: 'select',
      request: () =>
        service.getProviders().then((resp: any) => {
          return (resp?.result || []).map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
        }),
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        disabled: {
          text: '禁用',
          status: 'disabled',
        },
        enabled: {
          text: '正常',
          status: 'enabled',
        },
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
    },
  ];

  useEffect(() => {
    handleSearch(param);
  }, []);

  const modifyArray = (oldData: any[], newData: any[]) => {
    newData.map((item) => {
      if (!_.map(oldData, 'id').includes(item.id)) {
        oldData.push(item);
      }
    });
    return oldData.map((item, index) => {
      return { ...item, sortsIndex: index };
    });
  };

  return (
    <Modal
      onCancel={() => {
        close();
      }}
      visible
      width={1200}
      title={'设备接入配置'}
      onOk={async () => {
        if (!!currrent) {
          const obj: any = {
            ...productModel.current,
            transportProtocol: currrent.transport,
            protocolName: currrent.protocolDetail.name,
            accessId: currrent.id,
            accessName: currrent.name,
            accessProvider: currrent.provider,
            messageProtocol: currrent.protocol,
          };
          const metatdata = JSON.parse(productModel.current?.metadata || '{}');
          if (!productModel.current?.metadata) {
            const response = await service.getConfigView(
              obj?.messageProtocol || '',
              obj?.transportProtocol || '',
            );
            if (response.status === 200) {
              const ndata = JSON.parse(response.result?.metadata || '{}');
              const mdata = {
                events: modifyArray(metatdata?.events || [], ndata?.events || []),
                properties: modifyArray(metatdata?.properties || [], ndata?.properties || []),
                functions: modifyArray(metatdata?.functions || [], ndata?.functions || []),
                tags: modifyArray(metatdata?.tags || [], ndata?.tags || []),
              };
              MetadataAction.insert(mdata);
              obj.metadata = JSON.stringify(mdata);
            }
          }
          const resp: any = await service1.update(obj);
          if (resp.status === 200) {
            service1.detail(productModel.current?.id || '').then((res) => {
              if (res.status === 200) {
                productModel.current = { ...res.result };
                onlyMessage('操作成功！');
              }
              close();
            });
          }
        } else {
          onlyMessage('请选择接入方式', 'error');
        }
      }}
    >
      <div className={styles.search}>
        <SearchComponent
          field={columns}
          enableSave={false}
          model="simple"
          onSearch={(data: any) => {
            const dt = {
              pageSize: 4,
              terms: [...data.terms],
            };
            handleSearch(dt);
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <PermissionButton
            isPermission={permission.add}
            onClick={() => {
              const url = getMenuPathByCode('link/AccessConfig/Detail');
              const tab: any = window.open(`${origin}/#${url}`);
              tab!.onTabSaveSuccess = (value: any) => {
                if (value.status === 200) {
                  handleSearch(param);
                }
              };
            }}
            key="button"
            type="primary"
          >
            新增
          </PermissionButton>
        </div>
      </div>
      {dataSource?.data?.length > 0 ? (
        <Row gutter={[16, 16]}>
          {(dataSource?.data || []).map((item: any) => (
            <Col
              key={item.id}
              span={12}
              onClick={() => {
                setCurrrent(item);
              }}
            >
              <AccessConfigCard
                {...item}
                showTool={false}
                activeStyle={currrent?.id === item.id ? 'active' : ''}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty />
      )}
      {dataSource?.data?.length > 0 && (
        <div style={{ display: 'flex', marginTop: 20, justifyContent: 'flex-end' }}>
          <Pagination
            showSizeChanger
            size="small"
            className={'pro-table-card-pagination'}
            total={dataSource?.total || 0}
            current={dataSource?.pageIndex + 1}
            onChange={(page, size) => {
              handleSearch({
                ...param,
                pageIndex: page - 1,
                pageSize: size,
              });
            }}
            pageSizeOptions={[4, 8, 16, 32]}
            pageSize={dataSource?.pageSize}
            showTotal={(num) => {
              const minSize = dataSource?.pageIndex * dataSource?.pageSize + 1;
              const MaxSize = (dataSource?.pageIndex + 1) * dataSource?.pageSize;
              return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
            }}
          />
        </div>
      )}
    </Modal>
  );
};
export default AccessConfig;
