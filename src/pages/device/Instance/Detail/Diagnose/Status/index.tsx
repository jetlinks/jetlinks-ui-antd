import TitleComponent from '@/components/TitleComponent';
import { Badge, Button, Col, message, Popconfirm, Row } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { InstanceModel, service } from '@/pages/device/Instance';
import { getMenuPathByCode, getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { Store } from 'jetlinks-store';
import { observer } from '@formily/reactive-react';
import { DiagnoseStatusModel } from './model';
import { PermissionButton } from '@/components';
import DiagnosticAdvice from './DiagnosticAdvice';
import ManualInspection from './ManualInspection';

interface Props {
  onChange: (type: string) => void;
  flag: boolean;
}

const StatusMap = new Map();
StatusMap.set('error', require('/public/images/diagnose/status/error.png'));
StatusMap.set('success', require('/public/images/diagnose/status/success.png'));
StatusMap.set('warning', require('/public/images/diagnose/status/warning.png'));
StatusMap.set('loading', require('/public/images/diagnose/status/loading.png'));

const statusColor = new Map();
statusColor.set('error', '#E50012');
statusColor.set('success', '#24B276');
statusColor.set('warning', '#FF9000');
statusColor.set('loading', 'rgba(0, 0, 0, .8)');

const Status = observer((props: Props) => {
  const time = 1000;
  const initlist = [
    {
      key: 'config',
      name: '设备接入配置',
      data: 'config',
      desc: '诊断设备接入配置是否正确，配置错误将导致连接失败。',
    },
    {
      key: 'network',
      name: '网络信息',
      data: 'network',
      desc: '诊断网络组件配置是否正确，配置错误将导致连接失败。',
    },
    {
      key: 'product',
      name: '产品状态',
      data: 'product',
      desc: '诊断产品状态是否已发布，未发布的状态将导致连接失败。',
    },
    {
      key: 'device',
      name: '设备状态',
      data: 'device',
      desc: '诊断设备状态是否已启用，未启用的状态将导致连接失败。',
    },
    {
      key: 'device-access',
      name: '设备接入网关状态',
      data: 'deviceAccess',
      desc: '诊断设备接入网关状态是否已启用，未启用的状态将导致连接失败',
    },
  ];
  const gatewayList = [
    'websocket-server',
    'http-server-gateway',
    'udp-device-gateway',
    'coap-server-gateway',
    'mqtt-client-gateway',
    'mqtt-server-gateway',
    'tcp-server-gateway',
  ];
  const productPermission = PermissionButton.usePermission('device/Product').permission;
  const networkPermission = PermissionButton.usePermission('link/Type').permission;
  const devicePermission = PermissionButton.usePermission('device/Instance').permission;

  const [diagnoseVisible, setDiagnoseVisible] = useState<boolean>(false);
  const [artificialVisible, setArtificialVisible] = useState<boolean>(false);
  const [diagnoseData, setDiagnoseData] = useState<any>({});
  const [artificiaData, setArtificiaData] = useState<any>({});

  const getDetail = (id: string) => {
    service.detail(id).then((response) => {
      InstanceModel.detail = response?.result;
    });
  };
  // 设备接入配置
  const diagnoseConfig = () =>
    new Promise((resolve) => {
      let data: any = {};
      if (InstanceModel.detail.state?.value === 'online' || !!InstanceModel.detail?.protocol) {
        data = { status: 'success', text: '正常', info: null };
      } else {
        data = {
          status: 'warning',
          text: '异常',
          info: (
            <div className={styles.infoItem}>
              <Badge
                status="default"
                text={
                  !!getMenuPathByCode(MENUS_CODE['device/Product']) ? (
                    <span>
                      请配置
                      <a
                        onClick={() => {
                          //跳转到产品设备接入配置
                          const url = getMenuPathByParams(
                            MENUS_CODE['device/Product/Detail'],
                            InstanceModel.detail?.productId,
                          );
                          const tab: any = window.open(`${origin}/#${url}?key=access`);
                          tab!.onTabSaveSuccess = (value: any) => {
                            if (value) {
                              diagnoseConfig();
                            }
                          };
                        }}
                      >
                        设备接入数据
                      </a>
                    </span>
                  ) : (
                    '未配置设备接入数据，请联系管理员'
                  )
                }
              />
            </div>
          ),
        };
      }
      setTimeout(() => {
        DiagnoseStatusModel.status.config = data;
        resolve(data);
      }, time);
    });
  //网络信息
  const diagnoseNetwork = () =>
    new Promise((resolve) => {
      let data: any = undefined;
      if (InstanceModel.detail.state?.value === 'online') {
        data = { status: 'success', text: '正常', info: null };
        DiagnoseStatusModel.status.network = data;
        setTimeout(
          () =>
            resolve({
              data: data,
              product: null,
              gatewayDetail: null,
            }),
          time,
        );
      } else {
        service.queryProductState(InstanceModel.detail?.productId || '').then((resp) => {
          if (resp.status === 200) {
            if (resp.result.accessId) {
              service.queryGatewayState(resp.result.accessId).then((response: any) => {
                if (response.status === 200) {
                  const product: any = resp.result;
                  const address = response.result?.channelInfo?.addresses || [];
                  const _label = address.some((i: any) => i.health === -1);
                  const __label = address.every((i: any) => i.health === 1);
                  const health = _label ? -1 : __label ? 1 : 0;
                  const provider = response.result?.provider;
                  if (health === 1) {
                    data = { status: 'success', text: '正常', info: null };
                  } else if (health === 0) {
                    data = {
                      status: 'error',
                      text: '网络异常',
                      info: (
                        <div>
                          <div className={styles.infoItem}>
                            <Badge
                              status="default"
                              text="请检查服务器端口是否开放，如未开放，请开放后尝试重新连接"
                            />
                          </div>
                          <div className={styles.infoItem}>
                            <Badge
                              status="default"
                              text="请检查服务器防火策略，如有开启防火墙，请关闭防火墙或调整防火墙策略后重试"
                            />
                          </div>
                        </div>
                      ),
                    };
                  } else if (gatewayList.includes(provider) && health === -1) {
                    data = {
                      status: 'error',
                      text: '网络异常',
                      info: (
                        <div>
                          <div className={styles.infoItem}>
                            <Badge status="default" text={<span>请联系开发人员排查问题</span>} />
                          </div>
                        </div>
                      ),
                    };
                  } else {
                    data = {
                      status: 'error',
                      text: '网络异常',
                      info: (
                        <div>
                          <div className={styles.infoItem}>
                            <Badge
                              status="default"
                              text={
                                networkPermission.action ? (
                                  <span>
                                    网络组件未启用， 请
                                    <Popconfirm
                                      title="确认启用"
                                      onConfirm={async () => {
                                        const res = await service.startNetwork(
                                          resp.result?.channelId,
                                        );
                                        if (res.status === 200) {
                                          message.success('操作成功！');
                                          DiagnoseStatusModel.status.network = {
                                            status: 'success',
                                            text: '正常',
                                            info: null,
                                          };
                                        }
                                      }}
                                    >
                                      <a>启用</a>
                                    </Popconfirm>
                                    网络组件
                                  </span>
                                ) : (
                                  '网络组件未启用，请联系管理员'
                                )
                              }
                            />
                          </div>
                        </div>
                      ),
                    };
                  }
                  DiagnoseStatusModel.status.network = data;
                  setTimeout(
                    () =>
                      resolve({
                        data: data,
                        product: product,
                        gatewayDetail: response.result,
                      }),
                    time,
                  );
                }
              });
            } else {
              data = {
                status: 'warning',
                text: '异常',
                info: (
                  <div className={styles.infoItem}>
                    <Badge
                      status="default"
                      text={
                        !!getMenuPathByCode(MENUS_CODE['device/Product']) ? (
                          <span>
                            请配置
                            <a
                              onClick={() => {
                                //跳转到产品设备接入配置
                                const url = getMenuPathByParams(
                                  MENUS_CODE['device/Product/Detail'],
                                  InstanceModel.detail?.productId,
                                );
                                const tab: any = window.open(`${origin}/#${url}?key=access`);
                                tab!.onTabSaveSuccess = (value: any) => {
                                  if (value) {
                                    diagnoseConfig();
                                  }
                                };
                              }}
                            >
                              设备接入数据
                            </a>
                          </span>
                        ) : (
                          '未配置设备接入数据，请联系管理员'
                        )
                      }
                    />
                  </div>
                ),
              };
              DiagnoseStatusModel.status.network = data;
              setTimeout(() => resolve(data), time);
            }
          }
        });
      }
    });

  const diagnoseProduct = (proItem: any) =>
    new Promise((resolve) => {
      let data: any = {};
      if (InstanceModel.detail.state?.value === 'online') {
        data = { status: 'success', text: '正常', info: null };
      } else {
        data = {
          status: proItem?.state === 1 ? 'success' : 'error',
          text: proItem?.state === 1 ? '正常' : '异常',
          info:
            proItem?.state === 1 ? null : (
              <div className={styles.infoItem}>
                <Badge
                  status="default"
                  text={
                    productPermission.action ? (
                      <span>
                        产品未发布，请
                        <Popconfirm
                          title="确认发布"
                          onConfirm={async () => {
                            const resp = await service.deployProduct(
                              InstanceModel.detail?.productId || '',
                            );
                            if (resp.status === 200) {
                              message.success('操作成功！');
                              DiagnoseStatusModel.status.product = {
                                status: 'success',
                                text: '正常',
                                info: null,
                              };
                            }
                          }}
                        >
                          <a>发布</a>
                        </Popconfirm>
                        产品
                      </span>
                    ) : (
                      '无产品发布权限时：产品未发布。请联系管理员处理。'
                    )
                  }
                />
              </div>
            ),
        };
      }
      DiagnoseStatusModel.status.product = data;
      setTimeout(
        () =>
          resolve({
            data: data,
            product: proItem,
          }),
        time,
      );
    });

  const diagnoseDevice = () =>
    new Promise((resolve) => {
      let data: any = {};
      if (InstanceModel.detail?.state?.value === 'notActive') {
        data = {
          status: 'error',
          text: '异常',
          info: (
            <div className={styles.infoItem}>
              <Badge
                status="default"
                text={
                  devicePermission.action ? (
                    <span>
                      设备未启用，请
                      <Popconfirm
                        title="确认启用"
                        onConfirm={async () => {
                          const resp = await service.deployDevice(InstanceModel.detail?.id || '');
                          if (resp.status === 200) {
                            message.success('操作成功！');
                            DiagnoseStatusModel.status.device = {
                              status: 'success',
                              text: '正常',
                              info: null,
                            };
                            getDetail(InstanceModel.detail?.id || '');
                          }
                        }}
                      >
                        <a>启用</a>
                      </Popconfirm>
                      设备
                    </span>
                  ) : (
                    '设备未启用。请联系管理员处理。'
                  )
                }
              />
            </div>
          ),
        };
      } else {
        data = { status: 'success', text: '正常', info: null };
      }
      DiagnoseStatusModel.status.device = data;
      setTimeout(() => resolve({ data }), time);
    });

  // 产品认证配置
  const diagnoseProductAuthConfig = (proItem: any) =>
    new Promise((resolve) => {
      if (InstanceModel.detail.state?.value === 'online') {
        setTimeout(() => resolve(null), time);
      } else {
        service.queryProductConfig(proItem.id).then((resp) => {
          if (resp.status === 200) {
            if (resp.result.length > 0) {
              resp.result.map((item: any, index: number) => {
                let data: any = {};
                const list = [...DiagnoseStatusModel.list];
                if (!list.find((i) => i.key === `product-auth${index}`)) {
                  list.splice(list.length - 1, 0, {
                    key: `product-auth${index}`,
                    name: `产品-${item?.name}`,
                    data: `productAuth${index}`,
                    desc: `诊断产品${item?.name}是否正确，错误的配置将导致连接失败`,
                  });
                  DiagnoseStatusModel.list = [...list];
                }
                data = {
                  status: 'error',
                  text: '可能存在异常',
                  info: (
                    <div className={styles.infoItem}>
                      <Badge
                        status="default"
                        text={
                          <span>
                            进行
                            <a
                              onClick={() => {
                                setArtificialVisible(true);
                                setArtificiaData({
                                  type: 'product',
                                  data: item,
                                  key: `productAuth${index}`,
                                  check: proItem.configuration,
                                });
                              }}
                            >
                              人工检查
                            </a>
                            设备接入配置是否已填写正确
                          </span>
                        }
                      />
                    </div>
                  ),
                };
                DiagnoseStatusModel.status[`productAuth${index}`] = data;
              });
              setTimeout(() => resolve(resp.result), time);
            } else {
              setTimeout(() => resolve(null), time);
            }
          }
        });
      }
    });
  // 设备认证配置
  const diagnoseDeviceAuthConfig = () =>
    new Promise((resolve) => {
      if (InstanceModel.detail.state?.value === 'online') {
        setTimeout(() => resolve(null), time);
      } else {
        service.queryDeviceConfig(InstanceModel.detail?.id || '').then((resp) => {
          if (resp.status === 200) {
            if (resp.result.length > 0) {
              resp.result.map((item: any, index: number) => {
                let data: any = {};
                const list = [...DiagnoseStatusModel.list];
                if (!list.find((i) => i.key === `device-auth${index}`)) {
                  list.splice(list.length - 1, 0, {
                    key: `device-auth${index}`,
                    name: `设备-${item?.name}`,
                    data: `deviceAuth${index}`,
                    desc: `诊断设备${item?.name}是否正确，错误的配置将导致连接失败`,
                  });
                  DiagnoseStatusModel.list = [...list];
                }
                data = {
                  status: 'error',
                  text: '可能存在异常',
                  info: (
                    <div className={styles.infoItem}>
                      <Badge
                        status="default"
                        text={
                          <span>
                            进行
                            <a
                              onClick={() => {
                                setArtificialVisible(true);
                                setArtificiaData({
                                  type: 'device',
                                  data: item,
                                  key: `deviceAuth${index}`,
                                  check: InstanceModel.detail?.configuration,
                                });
                              }}
                            >
                              人工检查
                            </a>
                            设备接入配置是否已填写正确
                          </span>
                        }
                      />
                    </div>
                  ),
                };
                DiagnoseStatusModel.status[`deviceAuth${index}`] = data;
              });
              setTimeout(() => resolve(resp.result), time);
            } else {
              resolve({ data: null });
            }
          }
        });
      }
    });

  const diagnoseDeviceAccess = (gateway: any) =>
    new Promise((resolve) => {
      let data: any = null;
      if (InstanceModel.detail.state?.value === 'online') {
        data = { status: 'success', text: '正常', info: null };
      } else {
        data = {
          status: gateway?.state?.value === 'enabled' ? 'success' : 'error',
          text: gateway?.state?.value === 'enabled' ? '正常' : '异常',
          info:
            gateway?.state?.value === 'enabled' ? null : (
              <div className={styles.infoItem}>
                <Badge
                  status="default"
                  text={
                    <span>
                      设备接入网关未启用，请
                      <Popconfirm
                        title="确认启用"
                        onConfirm={async () => {
                          const resp = await service.startGateway(gateway?.id || '');
                          if (resp.status === 200) {
                            message.success('操作成功！');
                            DiagnoseStatusModel.status.deviceAccess = {
                              status: 'success',
                              text: '正常',
                              info: null,
                            };
                          }
                        }}
                      >
                        <a>启用</a>
                      </Popconfirm>
                      设备接入网关
                    </span>
                  }
                />
              </div>
            ),
        };
      }
      DiagnoseStatusModel.status.deviceAccess = data;
      setTimeout(() => resolve(data), time);
    });

  const handleSearch = () => {
    props.onChange('loading');
    DiagnoseStatusModel.list = [...initlist];
    DiagnoseStatusModel.status = {
      config: {
        status: 'loading',
        text: '正在诊断中...',
        info: null,
      },
      network: {
        status: 'loading',
        text: '正在诊断中...',
        info: null,
      },
      product: {
        status: 'loading',
        text: '正在诊断中...',
        info: null,
      },
      device: {
        status: 'loading',
        text: '正在诊断中...',
        info: null,
      },
      deviceAccess: {
        status: 'loading',
        text: '正在诊断中...',
        info: null,
      },
    };

    let product: any = null;
    let gateway: any = null;
    let productauth: any = null;
    let deviceauth: any = null;
    diagnoseConfig()
      .then(() => diagnoseNetwork())
      .then((resp: any) => {
        product = resp?.product;
        gateway = resp?.gatewayDetail;
        diagnoseProduct(product)
          .then(() => diagnoseDevice())
          .then(() => diagnoseProductAuthConfig(product))
          .then((res) => {
            productauth = res;
            diagnoseDeviceAuthConfig().then((dt) => {
              deviceauth = dt;
              diagnoseDeviceAccess(gateway).then(() => {
                if (InstanceModel.detail.state?.value === 'online') {
                  const a = Object.keys(DiagnoseStatusModel.status).find((item: any) => {
                    return item.status !== 'success';
                  });
                  if (!!a) {
                    Store.set('diagnose-status', {
                      list: DiagnoseStatusModel.list,
                      status: DiagnoseStatusModel.status,
                    });
                    props.onChange('success');
                  } else {
                    props.onChange('error');
                  }
                } else {
                  const data = { ...DiagnoseStatusModel.status };
                  const flag = Object.keys(data).find((item: any) => {
                    return item.status !== 'success';
                  });
                  if (!flag) {
                    // 展示诊断建议
                    if (
                      gateway.provider !== 'mqtt-server-gateway' &&
                      gatewayList.includes(gateway.provider)
                    ) {
                      service
                        .queryProcotolDetail(gateway.provider, gateway.transport)
                        .then((resp1) => {
                          setDiagnoseData({
                            product: productauth,
                            device: deviceauth,
                            id: product.id,
                            provider: gateway.provider,
                            routes: resp1.result?.routes || [],
                          });
                          setDiagnoseVisible(true);
                        });
                    } else {
                      setDiagnoseData({
                        product: productauth,
                        device: deviceauth,
                        id: product.id,
                        provider: '',
                        routes: [],
                      });
                      setDiagnoseVisible(true);
                    }
                  }
                }
              });
            });
          });
      });
  };

  useEffect(() => {
    if (devicePermission.view) {
      if (!props.flag) {
        handleSearch();
      } else {
        const dt = Store.get('diagnose-status');
        DiagnoseStatusModel.status = dt?.status;
        DiagnoseStatusModel.list = dt?.list || [];
        props.onChange('success');
      }
    }
  }, [devicePermission]);

  return (
    <Row gutter={24}>
      <Col span={16}>
        <div className={styles.statusBox}>
          <div className={styles.statusHeader}>
            <TitleComponent data={'连接详情'} />
            <Button
              onClick={() => {
                handleSearch();
              }}
            >
              重新诊断
            </Button>
          </div>
          <div className={styles.statusContent}>
            {DiagnoseStatusModel.list.map((item) => (
              <div key={item.key} className={styles.statusItem}>
                <div className={styles.statusLeft}>
                  <div className={styles.statusImg}>
                    <img
                      style={{ height: 32 }}
                      className={
                        DiagnoseStatusModel.status[item.data]?.status === 'loading'
                          ? styles.loading
                          : {}
                      }
                      src={
                        StatusMap.get(DiagnoseStatusModel.status[item.data]?.status) || 'loading'
                      }
                    />
                  </div>
                  <div className={styles.statusContext}>
                    <div className={styles.statusTitle}>{item.name}</div>
                    <div className={styles.statusDesc}>{item.desc}</div>
                    <div className={styles.info}>{DiagnoseStatusModel.status[item.data]?.info}</div>
                  </div>
                </div>
                <div
                  className={styles.statusRight}
                  style={{
                    color:
                      statusColor.get(DiagnoseStatusModel.status[item.data]?.status) || 'loading',
                  }}
                >
                  {DiagnoseStatusModel.status[item.data]?.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Col>
      {diagnoseVisible && (
        <DiagnosticAdvice
          data={diagnoseData}
          close={() => {
            setDiagnoseVisible(false);
          }}
        />
      )}
      {artificialVisible && (
        <ManualInspection
          data={artificiaData}
          close={() => {
            setArtificialVisible(false);
          }}
          ok={(params: any) => {
            setArtificialVisible(false);
            if (params.status === 'success') {
              DiagnoseStatusModel.status[params.data.key] = {
                status: 'success',
                text: '正常',
                info: null,
              };
            } else {
              DiagnoseStatusModel.status[params.data.key] = {
                status: 'error',
                text: '异常',
                info: (
                  <div className={styles.infoItem}>
                    <Badge
                      status="default"
                      text={
                        <span>
                          {params.data.type === 'device' ? '设备' : '产品'}-{params.data.data.name}
                          配置错误，请
                          <a
                            onClick={() => {
                              const url = getMenuPathByParams(
                                MENUS_CODE['device/Product/Detail'],
                                InstanceModel.detail?.productId,
                              );
                              const tab: any = window.open(`${origin}/#${url}?key=access`);
                              tab!.onTabSaveSuccess = (value: any) => {
                                if (value) {
                                  diagnoseConfig();
                                }
                              };
                            }}
                          >
                            重新配置
                          </a>
                          或
                          <a
                            onClick={() => {
                              setArtificialVisible(true);
                              setArtificiaData(params.data);
                            }}
                          >
                            重新比对
                          </a>
                          。
                        </span>
                      }
                    />
                  </div>
                ),
              };
            }
          }}
        />
      )}
    </Row>
  );
});

export default Status;
