import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Badge, Modal } from 'antd';
import styles from './index.less';

interface Props {
  close: () => void;
  data: any;
}

const DiagnosticAdvice = (props: Props) => {
  const { data } = props;
  const nameMap = new Map();
  nameMap.set('mqtt-client-gateway', 'topic');
  nameMap.set('websocket-server', 'URL');
  nameMap.set('http-server-gateway', 'URL');
  nameMap.set('coap-server-gateway', 'URL');
  nameMap.set('udp-device-gateway', '地址');
  nameMap.set('tcp-server-gateway', '地址');

  const jumpUrl = () => {
    const url = getMenuPathByParams(MENUS_CODE['device/Product/Detail'], data.id);
    const tab: any = window.open(`${origin}/#${url}?key=access`);
    tab!.onTabSaveSuccess = (value: any) => {
      if (value) {
        // diagnoseConfig();
        // 没有权限怎么展示
      }
    };
  };

  return (
    <Modal
      title="诊断建议"
      onCancel={() => {
        props.close();
      }}
      width={700}
      visible
    >
      <div className={styles.advice}>
        <div className={styles.alert}>
          <ExclamationCircleFilled style={{ marginRight: 10 }} />
          所有诊断均无异常但设备任未上线，请检查以下内容
        </div>
        {(data?.product || []).map((item: any) => (
          <div className={styles.infoItem} key={item.name}>
            <Badge
              status="default"
              text={
                <span>
                  产品-${item.name}规则可能有加密处理，请认真查看
                  <a
                    onClick={() => {
                      jumpUrl();
                    }}
                  >
                    设备接入配置
                  </a>
                  中【消息协议】说明
                </span>
              }
            />
          </div>
        ))}
        {(data?.device || []).map((item: any) => (
          <div className={styles.infoItem} key={item.name}>
            <Badge
              status="default"
              text={
                <span>
                  设备-${item.name}规则可能有加密处理，请认真查看
                  <a
                    onClick={() => {
                      jumpUrl();
                    }}
                  >
                    设备接入配置
                  </a>
                  中【消息协议】说明
                </span>
              }
            />
          </div>
        ))}
        {!!data.provider && (
          <div>
            {data.routes.length > 0 ? (
              <div className={styles.infoItem}>
                <Badge
                  status="default"
                  text={
                    <span>
                      请根据
                      <a
                        onClick={() => {
                          jumpUrl();
                        }}
                      >
                        设备接入配置
                      </a>
                      中${nameMap.get(data.provider)}
                      信息，任意上报一条数据（无设备接入配置查看权限时：请联系管理员根据设备接入配置中$
                      {URL}信息，任意上报一条数据）。 变量说明：${nameMap.get(data.provider)}
                      变量根据网关详情中provider类型判断。
                    </span>
                  }
                />
              </div>
            ) : (
              <div className={styles.infoItem}>
                <Badge
                  status="default"
                  text={
                    <span>
                      请联系管理员提供${nameMap.get(data.provider)}
                      信息，并根据URL信息任意上报一条数据 变量说明：${nameMap.get(data.provider)}
                      变量根据网关详情中provider类型判断。
                    </span>
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DiagnosticAdvice;
