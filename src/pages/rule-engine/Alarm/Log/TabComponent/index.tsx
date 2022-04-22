import SearchComponent from '@/components/SearchComponent';
import { BellFilled, FileFilled, FileTextFilled, ToolFilled } from '@ant-design/icons';
import type { ProColumns } from '@jetlinks/pro-table';
import { Button, Card, Col, Empty, Pagination, Row, Space } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect, useState } from 'react';
import './index.less';
import SolveComponent from '../SolveComponent';
import { AlarmLogModel } from '../model';
import Service from '../service';

export const service = new Service('alarm/record');

interface Props {
  type: string;
}
const defaultImage = require('/public/images/alarm/log.png');

const imgMap = new Map();
imgMap.set(1, require('/public/images/alarm/level_1.png'));
imgMap.set(2, require('/public/images/alarm/level_2.png'));
imgMap.set(3, require('/public/images/alarm/level_3.png'));
imgMap.set(4, require('/public/images/alarm/level_4.png'));
imgMap.set(5, require('/public/images/alarm/level_5.png'));

const TabComponent = (props: Props) => {
  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    // {
    //     title: '状态',
    //     dataIndex: 'state',
    //     valueType: 'select',
    //     valueEnum: {
    //         disabled: {
    //             text: '已停止',
    //             status: 'disabled',
    //         },
    //         enabled: {
    //             text: '已启动',
    //             status: 'enabled',
    //         },
    //     },
    // },
    // {
    //     title: '说明',
    //     dataIndex: 'description',
    // },
  ];

  const [param, setParam] = useState<any>({ pageSize: 10, terms: [] });

  const [dataSource, setDataSource] = useState<any>({
    data: [],
    pageSize: 10,
    pageIndex: 0,
    total: 0,
  });

  const handleSearch = (params: any) => {
    setParam(params);
    service
      .query({
        ...params,
        terms: [
          ...params.terms,
          {
            termType: 'eq',
            column: 'targetType',
            value: props.type,
            type: 'and',
          },
        ],
        sorts: [{ name: 'createTime', order: 'desc' }],
      })
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.result);
        }
      });
  };

  useEffect(() => {
    handleSearch(param);
  }, [props.type]);

  return (
    <div className="alarm-log-card">
      <SearchComponent<any>
        field={columns}
        target="alarm-log"
        onSearch={(data) => {
          const dt = {
            pageSize: 10,
            terms: [...data?.terms],
          };
          handleSearch(dt);
        }}
      />
      <Card>
        {dataSource?.data.length > 0 ? (
          <Row gutter={24} style={{ marginTop: 10 }}>
            {(dataSource?.data || []).map((item: any, index: number) => (
              <Col key={item.id} span={24}>
                <div className="alarm-log-item">
                  <div className="alarm-log-title">
                    <div>{item.name}</div>
                  </div>
                  <div className="alarm-log-content">
                    <div className="alarm-log-image">
                      <img
                        width={88}
                        height={88}
                        src={defaultImage}
                        alt={''}
                        style={{ marginRight: 20 }}
                      />
                      <div className="alarm-type">
                        <div className="name">产品</div>
                        <div className="text">海康烟感A海康烟感A</div>
                      </div>
                    </div>
                    <div className="alarm-log-time">
                      <div className="log-title">最近告警时间</div>
                      <div className="context">
                        {moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                    </div>
                    <div className="alarm-log-level">
                      <div className="log-title">告警级别</div>
                      <div className="context">
                        <img src={imgMap.get(index + 1)} alt={''} style={{ marginRight: 5 }} />
                        {item.level}
                      </div>
                    </div>
                    <div
                      className={classNames(
                        'alarm-log-status',
                        item.status.value ? 'status-active' : '',
                      )}
                    >
                      <BellFilled className="icon" />
                      {item.status.text}
                    </div>
                    <div className="alarm-log-actions">
                      <Space>
                        <div className="alarm-log-action">
                          <Button
                            type={'link'}
                            onClick={() => {
                              AlarmLogModel.solveVisible = true;
                            }}
                          >
                            <div className="btn">
                              <ToolFilled className="icon" />
                              <div>告警处理</div>
                            </div>
                          </Button>
                        </div>
                        <div className="alarm-log-action">
                          <Button type={'link'}>
                            <div className="btn">
                              <FileFilled className="icon" />
                              <div>告警日志</div>
                            </div>
                          </Button>
                        </div>
                        <div className="alarm-log-action">
                          <Button type={'link'}>
                            <div className="btn">
                              <FileTextFilled className="icon" />
                              <div>处理记录</div>
                            </div>
                          </Button>
                        </div>
                      </Space>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty />
        )}
        {dataSource.data.length > 0 && (
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
              pageSizeOptions={[10, 20, 50, 100]}
              pageSize={dataSource?.pageSize}
              showTotal={(num) => {
                const minSize = dataSource?.pageIndex * dataSource?.pageSize + 1;
                const MaxSize = (dataSource?.pageIndex + 1) * dataSource?.pageSize;
                return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
              }}
            />
          </div>
        )}
      </Card>
      {AlarmLogModel.solveVisible && <SolveComponent />}
    </div>
  );
};

export default TabComponent;
