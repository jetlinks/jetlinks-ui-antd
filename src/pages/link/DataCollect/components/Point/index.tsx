import { observer } from '@formily/react';
import SearchComponent from '@/components/SearchComponent';
import type { ProColumns } from '@jetlinks/pro-table';
import { useEffect, useState } from 'react';
import { useDomFullHeight } from '@/hooks';
import service from '@/pages/link/DataCollect/service';
import CollectorCard from './CollectorCard/index';
import { Empty, PermissionButton } from '@/components';
import { Card, Col, Pagination, Row } from 'antd';
import { model } from '@formily/reactive';
import ModbusSave from '@/pages/link/DataCollect/components/Point/Save/modbus';
import Scan from '@/pages/link/DataCollect/components/Point/Save/scan';

interface Props {
  type: boolean; // true: 综合查询  false: 数据采集
  data?: Partial<CollectorItem>;
  provider?: 'OPC_UA' | 'MODBUS_TCP';
}

const PointModel = model<{
  m_visible: boolean;
  p_add_visible: boolean;
  current: Partial<PointItem>;
}>({
  m_visible: false,
  p_add_visible: false,
  current: {},
});

export default observer((props: Props) => {
  const { minHeight } = useDomFullHeight(`.data-collect-point`, 24);
  const [param, setParam] = useState({
    terms: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { permission } = PermissionButton.usePermission('device/Instance');
  const [dataSource, setDataSource] = useState<any>({
    data: [],
    pageSize: 10,
    pageIndex: 0,
    total: 0,
  });

  const columns: ProColumns<PointItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '通讯协议',
      dataIndex: 'provider',
      valueType: 'select',
      valueEnum: {
        OPC_UA: {
          text: 'OPC_UA',
          status: 'OPC_UA',
        },
        MODBUS_TCP: {
          text: 'MODBUS_TCP',
          status: 'MODBUS_TCP',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        enabled: {
          text: '正常',
          status: 'enabled',
        },
        disabled: {
          text: '禁用',
          status: 'disabled',
        },
      },
    },
  ];
  const handleSearch = (params: any) => {
    setLoading(true);
    setParam(params);
    service
      .queryPoint({
        ...params,
        terms: [
          ...params?.terms,
          {
            terms: [{ column: 'collectorId', value: props.data?.id }],
          },
        ],
        sorts: [{ name: 'createTime', order: 'desc' }],
      })
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.result);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch(param);
  }, [props.data?.id]);

  return (
    <div>
      <SearchComponent<PointItem>
        field={columns}
        target="data-collect-point"
        onSearch={(data) => {
          const dt = {
            pageSize: 10,
            terms: [...data?.terms],
          };
          handleSearch(dt);
        }}
      />
      <Card loading={loading} bordered={false}>
        <div style={{ position: 'relative', minHeight }}>
          <div style={{ height: '100%', paddingBottom: 48 }}>
            {!props.type && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <PermissionButton
                  isPermission={permission.add}
                  onClick={() => {
                    if (props.provider === 'OPC_UA') {
                      PointModel.p_add_visible = true;
                    } else {
                      PointModel.m_visible = true;
                    }
                    PointModel.current = {};
                  }}
                  key="button"
                  type="primary"
                >
                  新增
                </PermissionButton>
              </div>
            )}
            {dataSource?.data.length ? (
              <>
                <Row gutter={[18, 18]} style={{ marginTop: 10 }}>
                  {(dataSource?.data || []).map((record: any) => (
                    <Col key={record.id} span={12}>
                      <CollectorCard
                        item={record}
                        reload={() => {
                          handleSearch(param);
                        }}
                      />
                    </Col>
                  ))}
                </Row>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    position: 'absolute',
                    width: '100%',
                    bottom: 0,
                  }}
                >
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
                    pageSizeOptions={[10, 20, 50, 100]}
                    pageSize={dataSource?.pageSize}
                    showTotal={(num) => {
                      const minSize = dataSource?.pageIndex * dataSource?.pageSize + 1;
                      const MaxSize = (dataSource?.pageIndex + 1) * dataSource?.pageSize;
                      return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
                    }}
                  />
                </div>
              </>
            ) : (
              <div style={{ height: minHeight - 150 }}>
                <Empty />
              </div>
            )}
          </div>
        </div>
      </Card>
      {PointModel.m_visible && (
        <ModbusSave
          data={PointModel.current}
          // channelId={props.id}
          close={() => {
            PointModel.m_visible = false;
          }}
          reload={() => {
            PointModel.m_visible = false;
            handleSearch(param);
          }}
        />
      )}
      {PointModel.p_add_visible && (
        <Scan
          close={() => {
            PointModel.p_add_visible = false;
          }}
          channelId={props.data?.channelId}
          reload={() => {
            PointModel.p_add_visible = false;
            handleSearch(param);
          }}
        />
      )}
    </div>
  );
});
