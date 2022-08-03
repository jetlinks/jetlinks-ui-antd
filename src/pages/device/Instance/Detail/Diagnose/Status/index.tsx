import TitleComponent from '@/components/TitleComponent';
import { Badge, Button, message, Popconfirm, Space } from 'antd';
import styles from './index.less';
import { observer } from '@formily/reactive-react';
import type { ListProps } from './model';
import {
  DiagnoseStatusModel,
  StatusMap,
  networkInitList,
  childInitList,
  cloudInitList,
  mediaInitList,
  TextColorMap,
  gatewayList,
  urlMap,
} from './model';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { InstanceModel, service } from '@/pages/device/Instance';
import _ from 'lodash';
import { onlyMessage } from '@/utils/util';
import { getMenuPathByCode, getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import PermissionButton from '@/components/PermissionButton';
import ManualInspection from './ManualInspection';
import useHistory from '@/hooks/route/useHistory';
import DiagnosticAdvice from './DiagnosticAdvice';
import BindParentDevice from '@/components/BindParentDevice';
import { useRequest } from 'ahooks';
interface Props {
  providerType: 'network' | 'child-device' | 'media' | 'cloud' | 'channel' | undefined;
}

const Status = observer((props: Props) => {
  const { providerType } = props;
  const time = 500;
  const device = { ...InstanceModel.detail };
  const history = useHistory();

  const productPermission = PermissionButton.usePermission('device/Product').permission;
  const networkPermission = PermissionButton.usePermission('link/Type').permission;
  const devicePermission = PermissionButton.usePermission('device/Instance').permission;
  const accessPermission = PermissionButton.usePermission('link/AccessConfig').permission;

  const [artificialVisible, setArtificialVisible] = useState<boolean>(false);
  const [artificiaData, setArtificiaData] = useState<any>({});
  const [diagnoseVisible, setDiagnoseVisible] = useState<boolean>(false);
  const [diagnoseData, setDiagnoseData] = useState<any>({});

  // 绑定父设备
  const [bindParentVisible, setBindParentVisible] = useState<boolean>(false);

  // 跳转到产品设备接入配置
  const jumpAccessConfig = () => {
    const purl = getMenuPathByCode(MENUS_CODE['device/Product/Detail']);
    if (purl) {
      history.push(
        `${getMenuPathByParams(MENUS_CODE['device/Product/Detail'], device.productId)}`,
        {
          tab: 'access',
        },
      );
    } else {
      message.error('规则可能有加密处理，请联系管理员');
    }
  };

  //跳转到实例信息页面
  const jumpDeviceConfig = () => {
    InstanceModel.active = 'detail';
  };

  //人工检查
  const manualInspection = (params: any) => {
    setArtificialVisible(true);
    setArtificiaData({ ...params });
  };

  const isExit = (arr1: any[], arr2: any[]) => {
    return arr1.find((item) => arr2.includes(item));
  };

  const modifyArrayList = (oldList: ListProps[], item: ListProps, index?: number) => {
    let newList: ListProps[] = [];
    if (index !== 0 && !index) {
      for (let i = 0; i < oldList.length; i++) {
        const dt = oldList[i];
        if (item.key === dt.key) {
          newList.push(item);
        } else {
          newList.push(dt);
        }
      }
    } else {
      oldList.splice(index, 0, item);
      newList = [...oldList];
    }
    return newList;
  };

  const { run: gatewayRun, cancel: gatewayCancel } = useRequest(service.queryGatewayState, {
    manual: true,
  });
  const { run: startNetworkRun, cancel: startNetworkCancel } = useRequest(service.startNetwork, {
    manual: true,
  });
  const { run: getGatewayDetailRun, cancel: getGatewayDetailCancel } = useRequest(
    service.getGatewayDetail,
    { manual: true },
  );
  const { run: startGatewayRun, cancel: startGatewayCancel } = useRequest(service.startGateway, {
    manual: true,
  });
  const { run: detailRun, cancel: detailCancel } = useRequest(service.detail, { manual: true });
  const { run: deployDeviceRun, cancel: deployDeviceCancel } = useRequest(service.deployDevice, {
    manual: true,
  });
  const { run: queryProductStateRun, cancel: queryProductStateCancel } = useRequest(
    service.queryProductState,
    { manual: true },
  );
  const { run: deployProductRun, cancel: deployProductCancel } = useRequest(service.deployProduct, {
    manual: true,
  });
  const { run: queryProductConfigRun, cancel: queryProductConfigCancel } = useRequest(
    service.queryProductConfig,
    { manual: true },
  );
  const { run: queryDeviceConfigRun, cancel: queryDeviceConfigCancel } = useRequest(
    service.queryDeviceConfig,
    { manual: true },
  );
  const { run: queryProcotolDetailRun, cancel: queryProcotolDetailCancel } = useRequest(
    service.queryProcotolDetail,
    { manual: true },
  );

  // 网络信息
  const diagnoseNetwork = () =>
    new Promise(async (resolve) => {
      if (!DiagnoseStatusModel.flag) {
        resolve({});
      }
      if (device.state?.value === 'online') {
        setTimeout(() => {
          DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
            key: 'network',
            name: '网络组件',
            desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
            status: 'success',
            text: '正常',
            info: null,
          });
          resolve({});
        }, time);
      } else {
        if (device?.accessId) {
          const response = await gatewayRun(device.accessId);
          if (response.status === 200) {
            DiagnoseStatusModel.gateway = response.result;
            const address = response.result?.channelInfo?.addresses || [];
            const _label = address.some((i: any) => i.health === -1);
            const __label = address.every((i: any) => i.health === 1);
            const health = _label ? -1 : __label ? 1 : 0;
            let item: ListProps | undefined = undefined;
            if (health === 1) {
              item = {
                key: 'network',
                name: '网络组件',
                desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                status: 'success',
                text: '正常',
                info: null,
              };
            } else {
              item = {
                key: 'network',
                name: '网络组件',
                desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                status: 'error',
                text: '异常',
                info:
                  health === -1 ? (
                    <div>
                      <div className={styles.infoItem}>
                        <Badge
                          status="default"
                          text={
                            networkPermission.action ? (
                              <span>
                                网络组件已禁用，请先
                                <Popconfirm
                                  title="确认启用"
                                  onConfirm={async () => {
                                    const res = await startNetworkRun(
                                      DiagnoseStatusModel.gateway?.channelId,
                                    );
                                    if (res.status === 200) {
                                      onlyMessage('操作成功！');
                                      DiagnoseStatusModel.list = modifyArrayList(
                                        DiagnoseStatusModel.list,
                                        {
                                          key: 'network',
                                          name: '网络组件',
                                          desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                                          status: 'success',
                                          text: '正常',
                                          info: null,
                                        },
                                      );
                                    }
                                  }}
                                >
                                  <a>启用</a>
                                </Popconfirm>
                              </span>
                            ) : (
                              '暂无权限，请联系管理员'
                            )
                          }
                        />
                      </div>
                    </div>
                  ) : (
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
            }
            setTimeout(() => {
              if (item) {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
              }
              resolve({});
            }, time);
          } else {
            resolve({});
          }
        }
      }
    });
  // 设备接入网关
  const diagnoseGateway = () =>
    new Promise(async (resolve) => {
      if (!DiagnoseStatusModel.flag) {
        resolve({});
      }
      const desc =
        providerType && ['child-device', 'cloud'].includes(providerType)
          ? '诊断设备接入网关状态是否正常，网关配置是否正确'
          : '诊断设备接入网关状态是否正常，禁用状态将导致连接失败';
      if (device.state?.value === 'online') {
        setTimeout(() => {
          DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
            key: 'gateway',
            name: '设备接入网关',
            desc: desc,
            status: 'success',
            text: '正常',
            info: null,
          });
          resolve({});
        }, time);
      } else {
        let item: ListProps | undefined = undefined;
        if (Object.keys(DiagnoseStatusModel.gateway).length === 0) {
          if (device.accessId) {
            const response = await gatewayRun(device.accessId);
            if (response.status === 200) {
              DiagnoseStatusModel.gateway = response.result;
              if (response.result?.state?.value === 'enabled') {
                if (providerType === 'cloud' || device?.accessProvider === 'gb28181-2016') {
                  item = {
                    key: 'gateway',
                    name: '设备接入网关',
                    desc: desc,
                    status: 'warning',
                    text: '可能存在异常',
                    info: (
                      <div>
                        <div className={styles.infoItem}>
                          <Badge
                            status="default"
                            text={
                              <span>
                                请
                                <a
                                  onClick={async () => {
                                    const config = await getGatewayDetailRun(
                                      response.result?.id || '',
                                    );
                                    if (config.status === 200) {
                                      manualInspection({
                                        type: providerType,
                                        key: `gateway`,
                                        name: `设备接入网关`,
                                        desc: desc,
                                        data: { name: `${device?.accessProvider}配置` },
                                        configuration: { ...config.result },
                                      });
                                    }
                                  }}
                                >
                                  人工检查
                                </a>
                                网关配置是否已填写正确，若您确定该项无需诊断可
                                <Popconfirm
                                  title="确认忽略？"
                                  onConfirm={() => {
                                    DiagnoseStatusModel.list = modifyArrayList(
                                      DiagnoseStatusModel.list,
                                      {
                                        key: 'gateway',
                                        name: '设备接入网关',
                                        desc: desc,
                                        status: 'success',
                                        text: '正常',
                                        info: null,
                                      },
                                    );
                                  }}
                                >
                                  <a>忽略</a>
                                </Popconfirm>
                              </span>
                            }
                          />
                        </div>
                      </div>
                    ),
                  };
                } else {
                  item = {
                    key: 'gateway',
                    name: '设备接入网关',
                    desc: desc,
                    status: 'success',
                    text: '正常',
                    info: null,
                  };
                }
              } else {
                item = {
                  key: 'gateway',
                  name: '设备接入网关',
                  desc: desc,
                  status: 'error',
                  text: '异常',
                  info: (
                    <div>
                      <div className={styles.infoItem}>
                        <Badge
                          status="default"
                          text={
                            accessPermission.action ? (
                              <span>
                                设备接入网关已禁用，请先
                                <Popconfirm
                                  title="确认启用"
                                  onConfirm={async () => {
                                    const resp = await startGatewayRun(device.accessId || '');
                                    if (resp.status === 200) {
                                      onlyMessage('操作成功！');
                                      DiagnoseStatusModel.list = modifyArrayList(
                                        DiagnoseStatusModel.list,
                                        {
                                          key: 'gateway',
                                          name: '设备接入网关',
                                          desc: desc,
                                          status: 'success',
                                          text: '正常',
                                          info: null,
                                        },
                                      );
                                    }
                                  }}
                                >
                                  <a>启用</a>
                                </Popconfirm>
                              </span>
                            ) : (
                              '暂无权限，请联系管理员处理'
                            )
                          }
                        />
                      </div>
                    </div>
                  ),
                };
              }
              setTimeout(() => {
                if (item) {
                  DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
                }
                resolve({});
              }, time);
            } else {
              resolve({});
            }
          }
        } else {
          if (DiagnoseStatusModel.gateway?.state?.value === 'enabled') {
            if (providerType === 'cloud' || device?.accessProvider === 'gb28181-2016') {
              item = {
                key: 'gateway',
                name: '设备接入网关',
                desc: desc,
                status: 'warning',
                text: '可能存在异常',
                info: (
                  <div>
                    <div className={styles.infoItem}>
                      <Badge
                        status="default"
                        text={
                          <span>
                            请
                            <a
                              onClick={async () => {
                                const config = await getGatewayDetailRun(
                                  DiagnoseStatusModel.gateway?.id || '',
                                );
                                if (config.status === 200) {
                                  manualInspection({
                                    type: providerType,
                                    key: `gateway`,
                                    name: `设备接入网关`,
                                    desc: desc,
                                    data: { name: `${device?.accessProvider}配置` },
                                    configuration: { ...config.result },
                                  });
                                }
                              }}
                            >
                              人工检查
                            </a>
                            网关配置是否已填写正确，若您确定该项无需诊断可
                            <Popconfirm
                              title="确认忽略？"
                              onConfirm={() => {
                                DiagnoseStatusModel.list = modifyArrayList(
                                  DiagnoseStatusModel.list,
                                  {
                                    key: 'gateway',
                                    name: '设备接入网关',
                                    desc: desc,
                                    status: 'success',
                                    text: '正常',
                                    info: null,
                                  },
                                );
                              }}
                            >
                              <a>忽略</a>
                            </Popconfirm>
                          </span>
                        }
                      />
                    </div>
                  </div>
                ),
              };
            } else {
              item = {
                key: 'gateway',
                name: '设备接入网关',
                desc: desc,
                status: 'success',
                text: '正常',
                info: null,
              };
            }
          } else {
            item = {
              key: 'gateway',
              name: '设备接入网关',
              desc: desc,
              status: 'error',
              text: '异常',
              info: (
                <div>
                  <div className={styles.infoItem}>
                    <Badge
                      status="default"
                      text={
                        accessPermission.action ? (
                          <span>
                            设备接入网关已禁用，请先
                            <Popconfirm
                              title="确认启用"
                              onConfirm={async () => {
                                const resp = await startGatewayRun(device.accessId || '');
                                if (resp.status === 200) {
                                  onlyMessage('操作成功！');
                                  DiagnoseStatusModel.list = modifyArrayList(
                                    DiagnoseStatusModel.list,
                                    {
                                      key: 'gateway',
                                      name: '设备接入网关',
                                      desc: desc,
                                      status: 'success',
                                      text: '正常',
                                      info: null,
                                    },
                                  );
                                }
                              }}
                            >
                              <a>启用</a>
                            </Popconfirm>
                          </span>
                        ) : (
                          '暂无权限，请联系管理员处理'
                        )
                      }
                    />
                  </div>
                </div>
              ),
            };
          }
          setTimeout(() => {
            if (item) {
              DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
            }
            resolve({});
          }, time);
        }
      }
    });

  // 网关父设备
  const diagnoseParentDevice = () =>
    new Promise(async (resolve) => {
      if (!DiagnoseStatusModel.flag) {
        resolve({});
      }
      if (device.state?.value === 'online') {
        setTimeout(() => {
          DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
            key: 'parent-device',
            name: '网关父设备',
            desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
            status: 'success',
            text: '正常',
            info: null,
          });
          resolve({});
        }, time);
      } else {
        if (!device?.parentId) {
          setTimeout(() => {
            DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
              key: 'parent-device',
              name: '网关父设备',
              desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
              status: 'error',
              text: '异常',
              info: (
                <div>
                  <div className={styles.infoItem}>
                    <Badge
                      status="default"
                      text={
                        <span>
                          未绑定父设备，请先
                          <a
                            onClick={() => {
                              setBindParentVisible(true);
                            }}
                          >
                            绑定
                          </a>
                          父设备后重试
                        </span>
                      }
                    />
                  </div>
                </div>
              ),
            });
            resolve({});
          }, time);
        } else {
          let item: ListProps | undefined = undefined;
          const response = await detailRun(device?.parentId);
          DiagnoseStatusModel.parent = response.result;
          if (response.status === 200) {
            if (response?.result?.state?.value === 'notActive') {
              item = {
                key: 'parent-device',
                name: '网关父设备',
                desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                status: 'error',
                text: '异常',
                info: (
                  <div>
                    <div className={styles.infoItem}>
                      <Badge
                        status="default"
                        text={
                          productPermission.action ? (
                            <span>
                              网关父设备已禁用，请先
                              <Popconfirm
                                title="确认启用"
                                onConfirm={async () => {
                                  const resp = await deployDeviceRun(response?.result?.id || '');
                                  if (resp.status === 200) {
                                    onlyMessage('操作成功！');
                                    DiagnoseStatusModel.list = modifyArrayList(
                                      DiagnoseStatusModel.list,
                                      {
                                        key: 'parent-device',
                                        name: '网关父设备',
                                        desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                                        status: 'success',
                                        text: '正常',
                                        info: null,
                                      },
                                    );
                                  }
                                }}
                              >
                                <a>启用</a>
                              </Popconfirm>
                            </span>
                          ) : (
                            '暂无权限，请联系管理员处理'
                          )
                        }
                      />
                    </div>
                  </div>
                ),
              };
            } else if (response?.state?.value === 'online') {
              item = {
                key: 'parent-device',
                name: '网关父设备',
                desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                status: 'success',
                text: '正常',
                info: null,
              };
            } else {
              item = {
                key: 'parent-device',
                name: '网关父设备',
                desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                status: 'error',
                text: '异常',
                info: (
                  <div>
                    <div className={styles.infoItem}>
                      <Badge
                        status="default"
                        text={<span>网关父设备已离线，请先排查网关设备故障</span>}
                      />
                    </div>
                  </div>
                ),
              };
            }
            setTimeout(() => {
              if (item) {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
              }
              resolve({});
            }, time);
          }
        }
      }
      setTimeout(() => {
        resolve({});
      }, time);
    });

  // 产品状态
  const diagnoseProduct = () =>
    new Promise(async (resolve) => {
      if (!DiagnoseStatusModel.flag) {
        resolve({});
      }
      if (device.state?.value === 'online') {
        setTimeout(() => {
          DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
            key: 'product',
            name: '产品状态',
            desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
            status: 'success',
            text: '正常',
            info: null,
          });
          resolve({});
        }, time);
      } else {
        if (device?.productId) {
          const response = await queryProductStateRun(device.productId);
          if (response.status === 200) {
            DiagnoseStatusModel.product = response.result;
            let item: ListProps | undefined = undefined;
            const state = response.result?.state;
            item = {
              key: 'product',
              name: '产品状态',
              desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
              status: state === 1 ? 'success' : 'error',
              text: state === 1 ? '正常' : '异常',
              info:
                state === 1 ? null : (
                  <div>
                    <div className={styles.infoItem}>
                      <Badge
                        status="default"
                        text={
                          productPermission.action ? (
                            <span>
                              产品已禁用，请
                              <Popconfirm
                                title="确认启用"
                                onConfirm={async () => {
                                  const resp = await deployProductRun(device.productId || '');
                                  if (resp.status === 200) {
                                    onlyMessage('操作成功！');
                                    DiagnoseStatusModel.list = modifyArrayList(
                                      DiagnoseStatusModel.list,
                                      {
                                        key: 'product',
                                        name: '产品状态',
                                        desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
                                        status: 'success',
                                        text: '正常',
                                        info: null,
                                      },
                                    );
                                  }
                                }}
                              >
                                <a>启用</a>
                              </Popconfirm>
                              产品
                            </span>
                          ) : (
                            '暂无权限，请联系管理员处理'
                          )
                        }
                      />
                    </div>
                  </div>
                ),
            };
            setTimeout(() => {
              if (item) {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
              }
              resolve({});
            }, time);
          } else {
            resolve({});
          }
        }
      }
    });

  // 设备状态
  const diagnoseDevice = () =>
    new Promise((resolve) => {
      if (!DiagnoseStatusModel.flag) {
        resolve({});
      }
      if (device.state?.value === 'online') {
        setTimeout(() => {
          DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
            key: 'device',
            name: '设备状态',
            desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
            status: 'success',
            text: '正常',
            info: null,
          });
          resolve({});
        }, time);
      } else {
        let item: ListProps | undefined = undefined;
        if (InstanceModel.detail?.state?.value === 'notActive') {
          item = {
            key: 'device',
            name: '设备状态',
            desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
            status: 'error',
            text: '异常',
            info: (
              <div>
                <div className={styles.infoItem}>
                  <Badge
                    status="default"
                    text={
                      devicePermission.action ? (
                        <span>
                          设备已禁用，请
                          <Popconfirm
                            title="确认启用"
                            onConfirm={async () => {
                              const resp = await deployDeviceRun(device?.id || '');
                              if (resp.status === 200) {
                                InstanceModel.detail.state = { value: 'offline', text: '离线' };
                                onlyMessage('操作成功！');
                                DiagnoseStatusModel.list = modifyArrayList(
                                  DiagnoseStatusModel.list,
                                  {
                                    key: 'device',
                                    name: '设备状态',
                                    desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
                                    status: 'success',
                                    text: '正常',
                                    info: null,
                                  },
                                );
                              }
                            }}
                          >
                            <a>启用</a>
                          </Popconfirm>
                          设备
                        </span>
                      ) : (
                        '暂无权限，请联系管理员处理'
                      )
                    }
                  />
                </div>
              </div>
            ),
          };
        } else {
          item = {
            key: 'device',
            name: '设备状态',
            desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
            status: 'success',
            text: '正常',
            info: null,
          };
        }
        setTimeout(() => {
          if (item) {
            DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
          }
          resolve({});
        }, time);
      }
    });

  // 产品认证配置
  const diagnoseProductAuthConfig = () =>
    new Promise(async (resolve) => {
      if (!DiagnoseStatusModel.flag) {
        resolve({});
      }
      if (device?.productId) {
        const response = await queryProductConfigRun(device.productId);
        if (response.status === 200 && response.result.length > 0) {
          DiagnoseStatusModel.configuration.product = response.result;
          const list = [...DiagnoseStatusModel.list];
          const configuration = DiagnoseStatusModel.product?.configuration || {};
          response.result.map((item: any, i: number) => {
            if (!_.map(list, 'key').includes(`product-auth${i}`)) {
              DiagnoseStatusModel.list = modifyArrayList(
                DiagnoseStatusModel.list,
                {
                  key: `product-auth${i}`,
                  name: `产品-${item?.name}`,
                  desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'loading',
                  text: '正在诊断中...',
                  info: null,
                },
                list.length,
              );
            }
            const properties = _.map(item?.properties, 'property');
            if (device.state?.value === 'online') {
              setTimeout(() => {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                  key: `product-auth${i}`,
                  name: `产品-${item?.name}`,
                  desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'success',
                  text: '正常',
                  info: null,
                });
                resolve({});
              }, time);
            } else if (
              !isExit(
                properties,
                Object.keys(configuration).filter((k: string) => !!configuration[k]),
              )
            ) {
              setTimeout(() => {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                  key: `product-auth${i}`,
                  name: `产品-${item?.name}`,
                  desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'error',
                  text: '异常',
                  info: (
                    <div>
                      <div className={styles.infoItem}>
                        <Badge
                          status="default"
                          text={
                            <span>
                              请根据设备接入配置需要
                              <a
                                onClick={() => {
                                  jumpAccessConfig();
                                }}
                              >
                                填写
                              </a>
                              ，若您确定该项无需诊断可
                              <Popconfirm
                                title="确认忽略？"
                                onConfirm={() => {
                                  DiagnoseStatusModel.list = modifyArrayList(
                                    DiagnoseStatusModel.list,
                                    {
                                      key: `product-auth${i}`,
                                      name: `产品-${item?.name}`,
                                      desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                      status: 'success',
                                      text: '正常',
                                      info: null,
                                    },
                                  );
                                }}
                              >
                                <a>忽略</a>
                              </Popconfirm>
                            </span>
                          }
                        />
                      </div>
                    </div>
                  ),
                });
                resolve({});
              }, time);
            } else {
              setTimeout(() => {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                  key: `product-auth${i}`,
                  name: `产品-${item?.name}`,
                  desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'warning',
                  text: '可能存在异常',
                  info: (
                    <div>
                      <div className={styles.infoItem}>
                        <Badge
                          status="default"
                          text={
                            <span>
                              请
                              <a
                                onClick={() => {
                                  manualInspection({
                                    type: 'product',
                                    key: `product-auth${i}`,
                                    name: `产品-${item?.name}`,
                                    desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                    data: { ...item },
                                    configuration,
                                    productId: device.productId,
                                  });
                                }}
                              >
                                人工检查
                              </a>
                              产品{item.name}
                              配置是否已填写正确,若您确定该项无需诊断可
                              <Popconfirm
                                title="确认忽略？"
                                onConfirm={() => {
                                  DiagnoseStatusModel.list = modifyArrayList(
                                    DiagnoseStatusModel.list,
                                    {
                                      key: `product-auth${i}`,
                                      name: `产品-${item?.name}`,
                                      desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                      status: 'success',
                                      text: '正常',
                                      info: null,
                                    },
                                  );
                                }}
                              >
                                <a>忽略</a>
                              </Popconfirm>
                            </span>
                          }
                        />
                      </div>
                    </div>
                  ),
                });
                resolve({});
              }, time);
            }
          });
        } else {
          resolve({});
        }
      }
    });

  // 设备认证配置
  const diagnoseDeviceAuthConfig = () =>
    new Promise(async (resolve) => {
      if (!DiagnoseStatusModel.flag) {
        resolve({});
      }
      if (device?.id) {
        const response = await queryDeviceConfigRun(device.id);
        if (response.status === 200 && response.result.length > 0) {
          DiagnoseStatusModel.configuration.device = response.result;
          const list = [...DiagnoseStatusModel.list];
          const configuration = device?.configuration || {};
          response.result.map((item: any, i: number) => {
            if (!_.map(list, 'key').includes(`device-auth${i}`)) {
              DiagnoseStatusModel.list = modifyArrayList(
                DiagnoseStatusModel.list,
                {
                  key: `device-auth${i}`,
                  name: `设备-${item?.name}`,
                  desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'loading',
                  text: '正在诊断中...',
                  info: null,
                },
                list.length,
              );
            }
            const properties = _.map(item?.properties, 'property');
            if (device.state?.value === 'online') {
              setTimeout(() => {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                  key: `device-auth${i}`,
                  name: `设备-${item?.name}`,
                  desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'success',
                  text: '正常',
                  info: null,
                });
                resolve({});
              }, time);
            } else if (
              !isExit(
                properties,
                Object.keys(configuration).filter((k: string) => !!configuration[k]),
              )
            ) {
              setTimeout(() => {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                  key: `device-auth${i}`,
                  name: `设备-${item?.name}`,
                  desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'error',
                  text: '异常',
                  info: (
                    <div>
                      <div className={styles.infoItem}>
                        <Badge
                          status="default"
                          text={
                            <span>
                              请根据设备接入配置需要
                              <a
                                onClick={() => {
                                  jumpDeviceConfig();
                                }}
                              >
                                填写
                              </a>
                              ，若您确定该项无需诊断可
                              <Popconfirm
                                title="确认忽略？"
                                onConfirm={() => {
                                  DiagnoseStatusModel.list = modifyArrayList(
                                    DiagnoseStatusModel.list,
                                    {
                                      key: `device-auth${i}`,
                                      name: `设备-${item?.name}`,
                                      desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                      status: 'success',
                                      text: '正常',
                                      info: null,
                                    },
                                  );
                                }}
                              >
                                <a>忽略</a>
                              </Popconfirm>
                            </span>
                          }
                        />
                      </div>
                    </div>
                  ),
                });
                resolve({});
              }, time);
            } else {
              setTimeout(() => {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                  key: `device-auth${i}`,
                  name: `设备-${item?.name}`,
                  desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                  status: 'warning',
                  text: '可能存在异常',
                  info: (
                    <div>
                      <div className={styles.infoItem}>
                        <Badge
                          status="default"
                          text={
                            <span>
                              请
                              <a
                                onClick={() => {
                                  manualInspection({
                                    type: 'device',
                                    key: `device-auth${i}`,
                                    name: `设备-${item?.name}`,
                                    desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                    data: { ...item },
                                    configuration,
                                    productId: device.productId,
                                  });
                                }}
                              >
                                人工检查
                              </a>
                              设备{item.name}
                              配置是否已填写正确,若您确定该项无需诊断可
                              <Popconfirm
                                title="确认忽略？"
                                onConfirm={() => {
                                  DiagnoseStatusModel.list = modifyArrayList(
                                    DiagnoseStatusModel.list,
                                    {
                                      key: `device-auth${i}`,
                                      name: `设备-${item?.name}`,
                                      desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                      status: 'success',
                                      text: '正常',
                                      info: null,
                                    },
                                  );
                                }}
                              >
                                <a>忽略</a>
                              </Popconfirm>
                            </span>
                          }
                        />
                      </div>
                    </div>
                  ),
                });
                resolve({});
              }, time);
            }
          });
        } else {
          resolve({});
        }
      }
    });

  // // opc
  // const diagnoseOpcua = () =>
  //   new Promise(async (resolve) => {
  //     if (device.accessProvider === 'opc-ua') {
  //       let item: ListProps | undefined = undefined;
  //       const response = await service.noPagingOpcua({
  //         paging: false,
  //         terms: [
  //           {
  //             column: 'id$bind-opc',
  //             value: device.id,
  //           },
  //         ],
  //       });
  //       if (response.status === 200) {
  //         if (response.result.length > 0) {
  //           item = {
  //             key: `opc-ua-config`,
  //             name: `OPC UA通道配置`,
  //             desc: '诊断设备是否已绑定通道，未绑定通道将导致设备连接失败',
  //             status: 'success',
  //             text: '正常',
  //             info: null,
  //           };
  //         } else {
  //           item = {
  //             key: `opc-ua-config`,
  //             name: `OPC UA通道配置`,
  //             desc: '诊断设备是否已绑定通道，未绑定通道将导致设备连接失败',
  //             status: 'error',
  //             text: '异常',
  //             info: (
  //               <div>
  //                 <div className={styles.infoItem}>
  //                   <Badge
  //                     status="default"
  //                     text={
  //                       <span>
  //                         设备未绑定通道，请先<a>配置</a>
  //                       </span>
  //                     }
  //                   />
  //                 </div>
  //               </div>
  //             ),
  //           };
  //         }
  //         setTimeout(() => {
  //           if (item) {
  //             DiagnoseStatusModel.list = modifyArrayList(
  //               DiagnoseStatusModel.list,
  //               item,
  //               DiagnoseStatusModel.list.length,
  //             );
  //           }
  //           resolve({});
  //         }, time);
  //       }
  //     } else {
  //       resolve({});
  //     }
  //   });

  // opc ua 连接状态
  // const diagnoseOpcuaState = () =>
  //   new Promise(async (resolve) => {
  //     if (device.accessProvider === 'opc-ua') {
  //       // let item: ListProps | undefined = undefined;
  //       // const response = await service.queryModbusabyId({
  //       //   paging: false,
  //       //   terms: [
  //       //     {
  //       //       column: 'id$bind-modbus',
  //       //       value: device.id,
  //       //     },
  //       //   ],
  //       // })
  //       // if (response.status === 200) {
  //       //   if (response.result.length > 0) {
  //       //     item = {
  //       //       key: `opc-ua-state`,
  //       //       name: `OPC UA通道连接状态`,
  //       //       desc: '诊断通道连接状态是否已连接，未连接状态将导致设备连接失败',
  //       //       status: 'success',
  //       //       text: '正常',
  //       //       info: null,
  //       //     }
  //       //   } else {
  //       //     item = {
  //       //       key: `opc-ua-state`,
  //       //       name: `OPC UA通道连接状态`,
  //       //       desc: '诊断通道连接状态是否已连接，未连接状态将导致设备连接失败',
  //       //       status: 'error',
  //       //       text: '异常',
  //       //       info: (
  //       //         <div>
  //       //           <div className={styles.infoItem}>
  //       //             <Badge
  //       //               status="default"
  //       //               text={<span>通道未连接成功，请联系管理员处理</span>}
  //       //             />
  //       //           </div>
  //       //         </div>
  //       //       ),
  //       //     }
  //       //   }
  //       //   setTimeout(() => {
  //       //     if (item) {
  //       //       DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item, DiagnoseStatusModel.list.length);
  //       //     }
  //       //     resolve({});
  //       //   }, time);
  //       // }
  //     } else {
  //       resolve({});
  //     }
  //   });
  // //modbus
  // const diagnoseModbus = () =>
  //   new Promise(async (resolve) => {
  //     if (device.accessProvider === 'modbus-tcp') {
  //       let item: ListProps | undefined = undefined;
  //       const response = await service.queryModbusabyId({
  //         paging: false,
  //         terms: [
  //           {
  //             column: 'id$bind-modbus',
  //             value: device.id,
  //           },
  //         ],
  //       });
  //       if (response.status === 200) {
  //         if (response.result.length > 0) {
  //           item = {
  //             key: `modbus-config`,
  //             name: `Modbus通道配置`,
  //             desc: '诊断设备是否已绑定通道，未绑定通道将导致设备连接失败',
  //             status: 'success',
  //             text: '正常',
  //             info: null,
  //           };
  //         } else {
  //           item = {
  //             key: `modbus-config`,
  //             name: `Modbus通道配置`,
  //             desc: '诊断设备是否已绑定通道，未绑定通道将导致设备连接失败',
  //             status: 'error',
  //             text: '异常',
  //             info: (
  //               <div>
  //                 <div className={styles.infoItem}>
  //                   <Badge
  //                     status="default"
  //                     text={
  //                       <span>
  //                         设备未绑定通道，请先<a>配置</a>
  //                       </span>
  //                     }
  //                   />
  //                 </div>
  //               </div>
  //             ),
  //           };
  //         }
  //         setTimeout(() => {
  //           if (item) {
  //             DiagnoseStatusModel.list = modifyArrayList(
  //               DiagnoseStatusModel.list,
  //               item,
  //               DiagnoseStatusModel.list.length,
  //             );
  //           }
  //           resolve({});
  //         }, time);
  //       }
  //     } else {
  //       resolve({});
  //     }
  //   });

  // const diagnoseModbusState = () =>
  //   new Promise((resolve) => {
  //     if (device.accessProvider === 'modbus-tcp') {
  //     } else {
  //       resolve({});
  //     }
  //   });

  // // 数据点绑定
  // const diagnoseDataPointBind = () =>
  //   new Promise((resolve) => {
  //     if (device.accessProvider === 'modbus-tcp' || device.accessProvider === 'opc-ua') {
  //     } else {
  //       resolve({});
  //     }
  //   });

  // onenet
  const diagnoseOnenet = () =>
    new Promise(async (resolve) => {
      if (!DiagnoseStatusModel.flag) {
        resolve({});
      }
      if (device.accessProvider === 'OneNet') {
        const response = await queryDeviceConfigRun(device?.id || '');
        DiagnoseStatusModel.configuration.device = response.result;
        const configuration = device?.configuration || {};
        let item: ListProps | undefined = undefined;
        if (
          device.configuration?.onenet_imei ||
          device.configuration?.onenet_imsi ||
          (DiagnoseStatusModel.product?.configuration &&
            DiagnoseStatusModel.product?.configuration['api-key'])
        ) {
          item = {
            key: `onenet`,
            name: `设备-OneNet配置`,
            desc: '诊断设备OneNet是否已配置，未配置将导致连接失败',
            status: 'warning',
            text: '可能存在异常',
            info: (
              <div>
                <div className={styles.infoItem}>
                  请
                  <a
                    onClick={() => {
                      manualInspection({
                        type: 'device',
                        key: `onenet`,
                        name: `设备-OneNet配置`,
                        desc: '诊断设备OneNet是否已配置，未配置将导致连接失败',
                        data: { ...response.result[0] },
                        configuration: configuration,
                      });
                    }}
                  >
                    人工检查
                  </a>
                  设备-OneNet配置是否已填写正确,若您确定该项无需诊断可
                  <Popconfirm
                    title="确认忽略？"
                    onConfirm={() => {
                      DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                        key: `onenet`,
                        name: `设备-OneNet配置`,
                        desc: '诊断设备OneNet是否已配置，未配置将导致连接失败',
                        status: 'success',
                        text: '正常',
                        info: null,
                      });
                    }}
                  >
                    <a>忽略</a>
                  </Popconfirm>
                </div>
              </div>
            ),
          };
        } else {
          item = {
            key: `onenet`,
            name: `设备-OneNet配置`,
            desc: '诊断设备OneNet是否已配置，未配置将导致连接失败',
            status: 'error',
            text: '异常',
            info: (
              <div>
                <div className={styles.infoItem}>
                  请根据设备接入配置需要
                  <a
                    onClick={() => {
                      jumpDeviceConfig();
                    }}
                  >
                    填写
                  </a>
                  ，若您确定该项无需诊断可
                  <Popconfirm
                    title="确认忽略？"
                    onConfirm={() => {
                      DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                        key: `onenet`,
                        name: `设备-OneNet配置`,
                        desc: '诊断设备OneNet是否已配置，未配置将导致连接失败',
                        status: 'success',
                        text: '正常',
                        info: null,
                      });
                    }}
                  >
                    <a>忽略</a>
                  </Popconfirm>
                </div>
              </div>
            ),
          };
        }
        setTimeout(() => {
          if (item) {
            DiagnoseStatusModel.list = modifyArrayList(
              DiagnoseStatusModel.list,
              item,
              DiagnoseStatusModel.list.length,
            );
          }
          resolve({});
        }, time);
      } else {
        resolve({});
      }
    });

  // ctwing
  const diagnoseCTWing = () =>
    new Promise(async (resolve) => {
      if (!DiagnoseStatusModel.flag) {
        resolve({});
      }
      if (device.accessProvider === 'Ctwing') {
        const response = await queryDeviceConfigRun(device?.id || '');
        DiagnoseStatusModel.configuration.device = response.result;
        const configuration = device?.configuration || {};
        let item: ListProps | undefined = undefined;
        const config = DiagnoseStatusModel.product?.configuration;
        if (
          device.configuration?.ctwing_imei ||
          device.configuration?.ctwing_imsi ||
          (config && (config.ctwing_product_id || config.master_key))
        ) {
          item = {
            key: `ctwing`,
            name: `设备-CTWing配置`,
            desc: '诊断设备CTWing是否已配置，未配置将导致连接失败',
            status: 'warning',
            text: '可能存在异常',
            info: (
              <div>
                <div className={styles.infoItem}>
                  请
                  <a
                    onClick={() => {
                      manualInspection({
                        type: 'device',
                        key: `ctwing`,
                        name: `设备-CTWing配置`,
                        desc: '诊断设备CTWing是否已配置，未配置将导致连接失败',
                        data: { ...response.result[0] },
                        configuration: configuration,
                      });
                    }}
                  >
                    人工检查
                  </a>
                  设备-CTWing配置是否已填写正确,若您确定该项无需诊断可
                  <Popconfirm
                    title="确认忽略？"
                    onConfirm={() => {
                      DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                        key: `ctwing`,
                        name: `设备-CTWing配置`,
                        desc: '诊断设备CTWing是否已配置，未配置将导致连接失败',
                        status: 'success',
                        text: '正常',
                        info: null,
                      });
                    }}
                  >
                    <a>忽略</a>
                  </Popconfirm>
                </div>
              </div>
            ),
          };
        } else {
          item = {
            key: `ctwing`,
            name: `设备-CTWing配置`,
            desc: '诊断设备CTWing是否已配置，未配置将导致连接失败',
            status: 'error',
            text: '异常',
            info: (
              <div>
                <div className={styles.infoItem}>
                  请根据设备接入配置需要
                  <a
                    onClick={() => {
                      jumpDeviceConfig();
                    }}
                  >
                    填写
                  </a>
                  ，若您确定该项无需诊断可
                  <Popconfirm
                    title="确认忽略？"
                    onConfirm={() => {
                      DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                        key: `ctwing`,
                        name: `设备-CTWing配置`,
                        desc: '诊断设备CTWing是否已配置，未配置将导致连接失败',
                        status: 'success',
                        text: '正常',
                        info: null,
                      });
                    }}
                  >
                    <a>忽略</a>
                  </Popconfirm>
                </div>
              </div>
            ),
          };
        }
        setTimeout(() => {
          if (item) {
            DiagnoseStatusModel.list = modifyArrayList(
              DiagnoseStatusModel.list,
              item,
              DiagnoseStatusModel.list.length,
            );
          }
          resolve({});
        }, time);
      } else {
        resolve({});
      }
    });

  // 设备离线且全部诊断项都是正确的情况后
  const diagnoseNetworkOtherConfig = async () => {
    if (device.state?.value != 'online') {
      const item: ReactNode[] = [];
      let info: any = {
        id: device.id,
      };
      item.push(<Badge status="default" text="请检查设备运行状态是否正常" />);
      if (providerType === 'network') {
        item.push(
          <Badge
            status="default"
            text={
              (DiagnoseStatusModel.gateway?.channelInfo?.addresses || []).length > 1 ? (
                <>
                  请检查设备网络是否畅通，并确保设备已连接到以下地址之一:
                  <div className="serverItem">
                    {(DiagnoseStatusModel.gateway?.channelInfo?.addresses || []).map((i: any) => (
                      <span style={{ marginLeft: 15 }} key={i.address}>
                        <Badge color={i.health === -1 ? 'red' : 'green'} />
                        {i.address}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  请检查设备网络是否畅通，并确保设备已连接到:
                  {(DiagnoseStatusModel.gateway?.channelInfo?.addresses || []).map((i: any) => (
                    <span style={{ marginLeft: 15 }} key={i.address}>
                      <Badge color={i.health === -1 ? 'red' : 'green'} />
                      {i.address}
                    </span>
                  ))}
                </>
              )
            }
          />,
        );
        if (
          device?.protocol &&
          device?.accessProvider &&
          gatewayList.includes(device?.accessProvider)
        ) {
          const response = await queryProcotolDetailRun(device.protocol, 'MQTT');
          if (response.status === 200) {
            if ((response.result?.routes || []).length > 0) {
              item.push(
                <Badge
                  status="default"
                  text={
                    // accessPermission.view ? (
                    <span>
                      请根据
                      <a
                        onClick={() => {
                          jumpAccessConfig();
                        }}
                      >
                        设备接入配置
                      </a>
                      中${urlMap.get(device?.accessProvider) || ''}信息，任意上报一条数据
                    </span>
                    // ) : (
                    //   `请联系管理员提供${
                    //     urlMap.get(device?.accessProvider) || ''
                    //   }信息，并根据URL信息任意上报一条数据）`
                    // )
                  }
                />,
              );
            } else {
              item.push(
                <Badge
                  status="default"
                  text={
                    <span>
                      请联系管理员提供${urlMap.get(device?.accessProvider) || ''}
                      信息，并根据URL信息任意上报一条数据
                    </span>
                  }
                />,
              );
            }
          }
        }
        info = {
          ...info,
          address: DiagnoseStatusModel.gateway?.channelInfo?.addresses || [],
          config: DiagnoseStatusModel.configuration.device || [],
        };
      } else if (providerType === 'child-device') {
        if (device?.accessProvider === 'gb28181-2016') {
          const address = DiagnoseStatusModel.gateway?.channelInfo?.addresses[0];
          if (address) {
            item.push(
              <Badge
                status="default"
                text={
                  <span>
                    请检查设备网络是否畅通，并确保设备已连接到：SIP{' '}
                    <span style={{ marginLeft: 15 }}>
                      <Badge color={address.health === -1 ? 'red' : 'green'} />
                      {address.address}
                    </span>
                  </span>
                }
              />,
            );
            info = {
              ...info,
              address: [address] || [],
            };
          }
        }
      } else if (providerType === 'media') {
        if (device?.accessProvider === 'gb28181-2016') {
          const address = DiagnoseStatusModel.gateway?.channelInfo?.addresses[0];
          if (address) {
            item.push(
              <Badge
                status="default"
                text={
                  <span>
                    请检查设备网络是否畅通，并确保设备已连接到：SIP{' '}
                    <span style={{ marginLeft: 15 }}>
                      <Badge color={address.health === -1 ? 'red' : 'green'} />
                      {address.address}
                    </span>
                  </span>
                }
              />,
            );
            info = {
              ...info,
              address: [address] || [],
            };
          }
        }
      } else if (providerType === 'cloud') {
        item.push(
          <Badge
            status="default"
            text="需要三方云平台主动发送一条消息通知到本平台，触发设备状态为在线"
          />,
        );
        item.push(<Badge status="default" text="请检查三方平台配置项是否填写正确" />);
      } else if (providerType === 'channel') {
      }
      info = {
        ...info,
        configValue: device?.configuration || {},
      };
      setDiagnoseData({
        list: [...item],
        info,
      });
      setDiagnoseVisible(true);
    } else {
      DiagnoseStatusModel.state = 'success';
    }
  };

  useEffect(() => {
    if (DiagnoseStatusModel.status === 'finish') {
      DiagnoseStatusModel.count = 0;
      const list = _.uniq(_.map(DiagnoseStatusModel.list, 'status'));
      if (device.state?.value !== 'online') {
        DiagnoseStatusModel.state = 'error';
        if (list[0] === 'success' && list.length === 1) {
          diagnoseNetworkOtherConfig();
        }
      } else {
        DiagnoseStatusModel.state = 'success';
      }
    } else if (DiagnoseStatusModel.status === 'loading') {
      const arr = _.map(DiagnoseStatusModel.list, 'status').filter((i) => i !== 'loading');
      DiagnoseStatusModel.count = arr.length;
    }
  }, [DiagnoseStatusModel.status, DiagnoseStatusModel.list]);

  const percentChange = () => {
    if (DiagnoseStatusModel.percent < 100) {
      DiagnoseStatusModel.percent += 20;
    }
  };

  const handleSearch = async () => {
    DiagnoseStatusModel.gateway = {};
    DiagnoseStatusModel.product = {};
    DiagnoseStatusModel.configuration = {
      product: [],
      device: [],
    };
    DiagnoseStatusModel.status = 'loading';
    DiagnoseStatusModel.percent = 0;
    let arr: any[] = [];
    if (providerType === 'network') {
      DiagnoseStatusModel.list = [...networkInitList];
      arr = [
        diagnoseNetwork,
        diagnoseGateway,
        diagnoseProduct,
        diagnoseDevice,
        diagnoseProductAuthConfig,
        diagnoseDeviceAuthConfig,
      ];
    } else if (providerType === 'child-device') {
      DiagnoseStatusModel.list = [...childInitList];
      arr = [
        diagnoseGateway,
        diagnoseParentDevice,
        diagnoseProduct,
        diagnoseDevice,
        diagnoseProductAuthConfig,
        diagnoseDeviceAuthConfig,
      ];
    } else if (providerType === 'media') {
      DiagnoseStatusModel.list = [...mediaInitList];
      arr = [diagnoseGateway, diagnoseProduct, diagnoseDevice];
    } else if (providerType === 'cloud') {
      DiagnoseStatusModel.list = [...cloudInitList];
      arr = [diagnoseGateway, diagnoseProduct, diagnoseDevice, diagnoseCTWing, diagnoseOnenet];
    } else if (providerType === 'channel') {
      message.error('未开发');
      return;
      // DiagnoseStatusModel.list = [...channelInitList];
      // await diagnoseGateway();
      // DiagnoseStatusModel.percent = 20;
      // await diagnoseProduct();
      // await diagnoseDevice();
      // DiagnoseStatusModel.percent = 40;
      // await diagnoseModbus();
      // await diagnoseOpcua();
      // await diagnoseModbusState();
      // await diagnoseOpcuaState();
      // await diagnoseDataPointBind();
      // DiagnoseStatusModel.percent = 80;
    }
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        await arr[i]();
        percentChange();
      }
      DiagnoseStatusModel.percent = 100;
      DiagnoseStatusModel.status = 'finish';
    }
  };

  useEffect(() => {
    DiagnoseStatusModel.flag = true;
    if (DiagnoseStatusModel.state === 'loading' && providerType) {
      handleSearch();
    }

    return () => {
      gatewayCancel();
      startNetworkCancel();
      getGatewayDetailCancel();
      startGatewayCancel();
      detailCancel();
      deployDeviceCancel();
      queryProductStateCancel();
      deployProductCancel();
      queryProductConfigCancel();
      queryDeviceConfigCancel();
      queryProcotolDetailCancel();
    };
  }, [DiagnoseStatusModel.state, providerType]);

  return (
    <div className={styles.statusBox}>
      <div className={styles.statusHeader}>
        <TitleComponent data={'连接详情'} />
        <Space>
          {DiagnoseStatusModel.status === 'finish' && device.state?.value !== 'online' && (
            <Button
              type="primary"
              onClick={async () => {
                if (
                  Object.keys(DiagnoseStatusModel.gateway).length > 0 &&
                  DiagnoseStatusModel.gateway?.state?.value !== 'enabled'
                ) {
                  const resp = await startGatewayRun(device.accessId || '');
                  if (resp.status === 200) {
                    DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                      key: 'gateway',
                      name: '设备接入网关',
                      desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
                      status: 'success',
                      text: '正常',
                      info: null,
                    });
                  }
                }
                if (DiagnoseStatusModel.product?.state !== 1) {
                  const resp = await deployProductRun(device.productId || '');
                  if (resp.status === 200) {
                    DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                      key: 'product',
                      name: '产品状态',
                      desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
                      status: 'success',
                      text: '正常',
                      info: null,
                    });
                  }
                }
                if (device?.state?.value === 'notActive') {
                  const resp = await deployDeviceRun(device?.id || '');
                  if (resp.status === 200) {
                    InstanceModel.detail.state = { value: 'offline', text: '离线' };
                    DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                      key: 'device',
                      name: '设备状态',
                      desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
                      status: 'success',
                      text: '正常',
                      info: null,
                    });
                  }
                }
                if (providerType === 'network' || providerType === 'child-device') {
                  const address = DiagnoseStatusModel.gateway?.channelInfo?.addresses || [];
                  const _label = address.some((i: any) => i.health === -1);
                  const __label = address.every((i: any) => i.health === 1);
                  const health = _label ? -1 : __label ? 1 : 0;
                  if (health === -1 && DiagnoseStatusModel.gateway?.channelId) {
                    const res = await startNetworkRun(DiagnoseStatusModel.gateway?.channelId);
                    if (res.status === 200) {
                      DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                        key: 'network',
                        name: '网络组件',
                        desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                        status: 'success',
                        text: '正常',
                        info: null,
                      });
                    }
                  }
                }
                if (providerType === 'child-device' && device?.parentId) {
                  if (DiagnoseStatusModel.parent?.state?.value === 'notActive') {
                    const resp = await deployDeviceRun(device?.parentId || '');
                    if (resp.status === 200) {
                      DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
                        key: 'parent-device',
                        name: '网关父设备',
                        desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                        status: 'success',
                        text: '正常',
                        info: null,
                      });
                    }
                  }
                }
                onlyMessage('操作成功！');
              }}
            >
              一键修复
            </Button>
          )}
          <Button
            onClick={() => {
              DiagnoseStatusModel.state = 'loading';
            }}
          >
            重新诊断
          </Button>
        </Space>
      </div>
      <div className={styles.statusContent}>
        {DiagnoseStatusModel.list.map((item: ListProps) => (
          <div key={item.key} className={styles.statusItem}>
            <div className={styles.statusLeft}>
              <div className={styles.statusImg}>
                <img
                  style={{ height: 32 }}
                  className={item.status === 'loading' ? styles.loading : {}}
                  src={StatusMap.get(item.status)}
                />
              </div>
              <div className={styles.statusContext}>
                <div className={styles.statusTitle}>{item.name}</div>
                <div className={styles.statusDesc}>{item.desc}</div>
                <div className={styles.info}>{item?.info}</div>
              </div>
            </div>
            <div className={styles.statusRight} style={{ color: TextColorMap.get(item.status) }}>
              {item?.text}
            </div>
          </div>
        ))}
      </div>
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
          save={(params: any) => {
            DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, {
              key: params.key,
              name: params.name,
              desc: params.desc,
              status: 'success',
              text: '正常',
              info: null,
            });
            setArtificialVisible(false);
          }}
        />
      )}
      {bindParentVisible && (
        <BindParentDevice
          data={device}
          onCancel={() => {
            setBindParentVisible(false);
          }}
          onOk={async (parentId: string) => {
            let item: ListProps | undefined = undefined;
            const response = await detailRun(parentId);
            if (response.status === 200) {
              if (response?.result?.state?.value === 'notActive') {
                item = {
                  key: 'parent-device',
                  name: '网关父设备',
                  desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                  status: 'error',
                  text: '异常',
                  info: (
                    <div>
                      <div className={styles.infoItem}>
                        <Badge
                          status="default"
                          text={
                            productPermission.action ? (
                              <span>
                                网关父设备已禁用，请先
                                <Popconfirm
                                  title="确认启用"
                                  onConfirm={async () => {
                                    const resp = await deployDeviceRun(response?.result?.id || '');
                                    if (resp.status === 200) {
                                      onlyMessage('操作成功！');
                                      DiagnoseStatusModel.list = modifyArrayList(
                                        DiagnoseStatusModel.list,
                                        {
                                          key: 'parent-device',
                                          name: '网关父设备',
                                          desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                                          status: 'success',
                                          text: '正常',
                                          info: null,
                                        },
                                      );
                                    }
                                  }}
                                >
                                  <a>启用</a>
                                </Popconfirm>
                              </span>
                            ) : (
                              '暂无权限，请联系管理员处理'
                            )
                          }
                        />
                      </div>
                    </div>
                  ),
                };
              } else if (response?.state?.value === 'online') {
                item = {
                  key: 'parent-device',
                  name: '网关父设备',
                  desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                  status: 'success',
                  text: '正常',
                  info: null,
                };
              } else {
                item = {
                  key: 'parent-device',
                  name: '网关父设备',
                  desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                  status: 'error',
                  text: '异常',
                  info: (
                    <div>
                      <div className={styles.infoItem}>
                        <Badge
                          status="default"
                          text={<span>网关父设备已离线，请先排查网关设备故障</span>}
                        />
                      </div>
                    </div>
                  ),
                };
              }
              if (item) {
                DiagnoseStatusModel.list = modifyArrayList(DiagnoseStatusModel.list, item);
              }
              InstanceModel.detail.parentId = parentId;
              setBindParentVisible(false);
            }
          }}
        />
      )}
    </div>
  );
});

export default Status;
