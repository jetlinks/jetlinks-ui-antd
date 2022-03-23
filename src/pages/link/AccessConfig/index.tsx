import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProList from '@jetlinks/pro-list';
import type { ProColumns } from '@jetlinks/pro-table';
import { Badge, Button, Card, message, Popconfirm } from 'antd';
import { useState } from 'react';
import { useHistory } from 'umi';
import styles from './index.less';
import Service from './service';

export const service = new Service('gateway/device');

const AccessConfig = () => {
  const history = useHistory();
  const [param, setParam] = useState({});
  // const actionRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    // {
    //   title: '状态',
    //   dataIndex: 'state',
    //   align: 'center',
    //   valueType: 'select',
    //   valueEnum: {
    //     // 1: {
    //     //   text: intl.formatMessage({
    //     //     id: 'pages.searchTable.titleStatus.normal',
    //     //     defaultMessage: '正常',
    //     //   }),
    //     //   status: 1,
    //     // },
    //     // 0: {
    //     //   text: intl.formatMessage({
    //     //     id: 'pages.searchTable.titleStatus.disable',
    //     //     defaultMessage: '禁用',
    //     //   }),
    //     //   status: 0,
    //     // },
    //   },
    //   render: (text, record) => (
    //     <Badge status={record.status === 1 ? 'success' : 'error'} text={text} />
    //   ),
    // },
  ];

  return (
    <PageContainer>
      <Card>
        <SearchComponent
          field={columns}
          pattern={'simple'}
          onSearch={(data: any) => {
            setParam(data);
            // actionRef.current?.reset?.();
          }}
          onReset={() => {
            setParam({});
            // actionRef.current?.reset?.();
          }}
        />
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            onClick={() => {
              history.push(`${getMenuPathByCode(MENUS_CODE['link/AccessConfig/Detail'])}`);
            }}
          >
            新增
          </Button>
        </div>
        <ProList<any>
          pagination={{
            defaultPageSize: 8,
            showSizeChanger: false,
          }}
          showActions="always"
          rowKey="id"
          // actionRef={actionRef}
          request={async (data) =>
            service.queryList({ ...param, ...data, sorts: [{ name: 'createTime', order: 'desc' }] })
          }
          grid={{ gutter: 16, column: 2 }}
          showExtra="always"
          metas={{
            title: {
              dataIndex: 'name',
              render: (text, row) => (
                <div style={{ fontSize: 16, width: '70%' }}>
                  <div>
                    {text}
                    <Badge
                      color={row.state.value === 'disabled' ? 'red' : 'green'}
                      text={row.state.text}
                      style={{ marginLeft: '20px' }}
                    />
                  </div>
                  <div className={styles.desc}>{row.describe}</div>
                </div>
              ),
            },
            avatar: {
              render: (text, reocrd) => <div className={styles.images}>{reocrd.name}</div>,
            },
            subTitle: {
              render: () => <div></div>,
            },
            content: {
              render: (text, row) => (
                <div className={styles.content}>
                  <div className={styles.server}>
                    <div className={styles.title}>{row?.channelInfo?.name}</div>
                    <p>
                      {row.channelInfo?.addresses.map((item: any) => (
                        <div key={item.address}>
                          <Badge color={'green'} text={item.address} />
                        </div>
                      ))}
                    </p>
                  </div>
                  <div className={styles.procotol}>
                    <div className={styles.title}>{row?.protocolDetail?.name}</div>
                    <p style={{ color: 'rgba(0, 0, 0, .55)' }}>{row.description}</p>
                  </div>
                </div>
              ),
            },
            actions: {
              render: (text, row) => [
                <a
                  key="edit"
                  onClick={() => {
                    history.push(
                      `${getMenuPathByCode(MENUS_CODE['link/AccessConfig/Detail'])}?id=${row.id}`,
                    );
                  }}
                >
                  <EditOutlined />
                  编辑
                </a>,
                <a key="warning">
                  <Popconfirm
                    title={`确认${row.state.value !== 'disabled' ? '禁用' : '启用'}`}
                    onConfirm={() => {
                      if (row.state.value !== 'disabled') {
                        service.shutDown(row.id).then((resp) => {
                          if (resp.status === 200) {
                            message.success('操作成功！');
                          }
                        });
                      } else {
                        service.startUp(row.id).then((resp) => {
                          if (resp.status === 200) {
                            message.success('操作成功！');
                          }
                        });
                      }
                    }}
                  >
                    {row.state.value !== 'disabled' ? (
                      <span>
                        <StopOutlined />
                        禁用
                      </span>
                    ) : (
                      <span>
                        <CheckCircleOutlined />
                        启用
                      </span>
                    )}
                  </Popconfirm>
                </a>,
                <a key="remove">
                  <Popconfirm
                    title={'确认删除?'}
                    onConfirm={() => {
                      service.remove(row.id).then((resp: any) => {
                        if (resp.status === 200) {
                          message.success('操作成功！');
                        }
                      });
                    }}
                  >
                    <DeleteOutlined />
                    删除
                  </Popconfirm>
                </a>,
              ],
            },
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default AccessConfig;
