import {PageHeaderWrapper} from "@ant-design/pro-layout"
import {Avatar, Button, Card, Icon, List, message, Popconfirm, Switch, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import SearchForm from "@/components/SearchForm";
import styles from './index.less';
import Service from "./service";
import encodeQueryParam from "@/utils/encodeParam";
import Save from "./save";
import AutoHide from "@/pages/analysis/components/Hide/autoHide";
import {downloadObject} from "@/utils/utils";

interface Props {

}

interface State {
  searchParam: any;
}

const initState: State = {
  searchParam: {pageSize: 8, terms: location?.query?.terms, sorts: {field: 'id', order: 'desc'}},
};
const MediaGateway: React.FC<Props> = () => {
  const service = new Service('media/gb28181');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>({});
  const [saveVisible, setSaveVisible] = useState<boolean>(false);
  const [mediaGateway, setMediaGateway] = useState<any>({});
  const [productList, setProductList] = useState<any[]>([]);
  const [mediaServerList, setMediaServerList] = useState<any[]>([]);
  const [searchParam, setSearchParam] = useState(initState.searchParam);

  useEffect(() => {
    handleSearch(encodeQueryParam(searchParam));
    service.queryProduct({}).subscribe((data) => {
      const temp = data.map((item: any) => ({value: item.id, label: item.name, ...item}));
      setProductList(temp);
    });

    service.mediaServer({}).subscribe((data) => {
      const temp = data.map((item: any) => ({value: item.id, label: item.name, ...item}));
      setMediaServerList(temp);
    })
  }, []);

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    setLoading(true);
    service.query(encodeQueryParam(params)).subscribe(
      (result) => {
        setResult(result);
      },
      () => {
      },
      () => setLoading(false))
  };

  const onChange = (page: number, pageSize: number) => {
    handleSearch({
      pageIndex: page - 1,
      pageSize,
      terms: searchParam.terms,
      sorts: searchParam.sorts,
    });
  };

  const onShowSizeChange = (current: number, size: number) => {
    handleSearch({
      pageIndex: current - 1,
      pageSize: size,
      terms: searchParam.terms,
      sorts: searchParam.sorts,
    });
  };

  const getProductName = (productId: string) => {
    const protocol: Partial<any> = productList.find(i => i.id === productId) || {};
    return protocol.name;
  };
  const getMediaServerName = (mediaServerId: string) => {
    const protocol: Partial<any> = mediaServerList.find(i => i.id === mediaServerId) || {};
    return protocol.name;
  };

  const _enabledOr_disabled = (status: string, id: string) => {
    status === "disabled" ? (
      service._enabled(id).subscribe(() => {
          message.success("启动成功");
          handleSearch(encodeQueryParam(searchParam));
        },
        () => {
          message.error("启动失败");
        },
        () => setLoading(false))
    ) : (
      service._disabled(id).subscribe(() => {
          message.success("停止成功");
          handleSearch(encodeQueryParam(searchParam));
        },
        () => {
          message.error("停止失败");
        },
        () => setLoading(false))
    );
  };

  return (
    <PageHeaderWrapper title="信令服务">
      <div className={styles.filterCardList}>
        <Card bordered={false} style={{marginBottom: 16}}>
          <div className={styles.tableList}>
            <div>
              <SearchForm
                search={(params: any) => {
                  setSearchParam(params);
                  handleSearch({terms: {...params}, pageSize: 10});
                }}
                formItems={[
                  {
                    label: '名称',
                    key: 'name$LIKE',
                    type: 'string',
                  },
                  {
                    label: '关联产品',
                    key: 'productId$IN',
                    type: 'list',
                    props: {
                      data: productList,
                      mode: 'multiple'
                    }
                  },
                  {
                    label: '流媒体服务',
                    key: 'mediaServerId$IN',
                    type: 'list',
                    props: {
                      data: mediaServerList,
                      mode: 'multiple'
                    }
                  }
                ]}
              />
            </div>
            <div>
              <Button icon="plus" type="primary" onClick={() => {
                setMediaGateway({});
                setSaveVisible(true);
              }}>
                新建
              </Button>
            </div>
          </div>
        </Card>
        {result?.data && (
          <List<any>
            rowKey="id"
            grid={{gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1}}
            loading={loading}
            dataSource={(result || {}).data}
            pagination={{
              current: result?.pageIndex + 1,
              total: result?.total,
              pageSize: result?.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              hideOnSinglePage: true,
              pageSizeOptions: ['8', '16', '40', '80'],
              style: {marginTop: -20},
              showTotal: (total: number) =>
                `共 ${total} 条记录 第  ${result.pageIndex + 1}/${Math.ceil(
                  result.total / result.pageSize,
                )}页`,
              onChange,
              onShowSizeChange,
            }}
            renderItem={item => {
              if (item && item.id) {
                return (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      bodyStyle={{paddingBottom: 20}}
                      actions={[
                        <Tooltip key="edit" title="编辑">
                          <Icon
                            type="edit"
                            onClick={() => {
                              setMediaGateway(item);
                              setSaveVisible(true);
                            }}
                          />
                        </Tooltip>,
                        <Tooltip key="delete" title="删除">
                          <Popconfirm
                            placement="topRight"
                            title="确定删除此国标网关吗？"
                            onConfirm={() => {
                              service.remove(item.id).subscribe(() => {
                                  message.success("删除成功");
                                  handleSearch(encodeQueryParam(searchParam));
                                },
                                () => {
                                  message.error("删除失败");
                                },
                                () => setLoading(false))
                            }}
                          >
                            <Icon type="close"/>
                          </Popconfirm>
                        </Tooltip>,
                        <Tooltip key="download" title="下载">
                          <Icon
                            type="download"
                            onClick={() => {
                              downloadObject(item, `国标视频网关-${item.name}`);
                            }}
                          />
                        </Tooltip>,
                      ]}
                    >
                      <Card.Meta
                        avatar={<Avatar size="small" src={item.avatar}/>}
                        title={<AutoHide title={item.name} style={{width: '95%', fontWeight: 600}}/>}
                        style={{fontWeight: 600}}
                      />
                      <div className={styles.cardItemContent}>
                        <div className={styles.cardInfo}>
                          <div style={{width: '33.33%', textAlign: 'center'}}>
                            <p>关联产品</p>
                            <AutoHide title={getProductName(item.productId)} style={{width: '95%', fontWeight: 600}}/>
                          </div>
                          <div style={{width: '33.33%', textAlign: 'center'}}>
                            <p>流媒体服务</p>
                            <AutoHide title={getMediaServerName(item.mediaServerId)}
                                      style={{width: '95%', fontWeight: 600}}/>
                          </div>
                          <div style={{width: '33.33%', textAlign: 'center'}}>
                            <p>启动状态</p>
                            <p style={{color: 'red'}}>
                              <Popconfirm
                                title={`确认${item.status?.value === 'disabled' ? '启动' : '停止'}`}
                                onConfirm={() => {
                                  setLoading(true);
                                  _enabledOr_disabled(item.status.value, item.id);
                                }}
                              >
                              <span>
                                <Switch
                                  size="small"
                                  checked={
                                    item.status?.value === 'disabled'
                                      ? false
                                      : item.status?.value === 'enabled'
                                  }
                                />
                              </span>
                              </Popconfirm>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                );
              }
            }}
          />
        )}
      </div>
      {
        saveVisible && (
          <Save
            data={mediaGateway}
            close={() => setSaveVisible(false)}
            save={(item: any) => {
              service.saveOrUpdate(item).subscribe(() => {
                  message.success('保存成功');
                },
                () => {
                  message.error('保存失败');
                },
                () => {
                  handleSearch();
                  setSaveVisible(false);
                });
            }}
          />
        )
      }
    </PageHeaderWrapper>
  )
};
export default MediaGateway;
