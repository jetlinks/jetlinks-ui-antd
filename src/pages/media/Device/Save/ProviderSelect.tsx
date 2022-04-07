import classNames from 'classnames';
import { Badge } from 'antd';
import { StatusColorEnum } from '@/components/BadgeStatus';
import styles from '@/pages/link/AccessConfig/index.less';
import { TableCard } from '@/components';
import './providerSelect.less';

interface ProviderProps {
  value?: string;
  options?: any[];
  onChange?: (id: string) => void;
  onSelect?: (id: string, rowData: any) => void;
}

const defaultImage = require('/public/images/device-access.png');

export default (props: ProviderProps) => {
  return (
    <div className={'provider-list'}>
      {props.options && props.options.length
        ? props.options.map((item) => (
            <div
              onClick={() => {
                if (props.onChange) {
                  props.onChange(item.id);
                }

                if (props.onSelect) {
                  props.onSelect(item.id, item);
                }
              }}
              style={{ padding: 16 }}
            >
              <TableCard
                className={classNames({ active: item.id === props.value })}
                showMask={false}
                showTool={false}
                status={item.state.value}
                statusText={item.state.text}
                statusNames={{
                  enabled: StatusColorEnum.processing,
                  disabled: StatusColorEnum.error,
                }}
              >
                <div className={styles.context}>
                  <div>
                    <img width={88} height={88} src={defaultImage} alt={''} />
                  </div>
                  <div className={styles.card}>
                    <div className={styles.header}>
                      <div className={styles.title}>{item.name || '--'}</div>
                      <div className={styles.desc}>{item.description || '--'}</div>
                    </div>
                    <div className={styles.container}>
                      <div className={styles.server}>
                        <div className={styles.subTitle}>{item?.channelInfo?.name || '--'}</div>
                        <div style={{ width: '100%' }}>
                          {item.channelInfo?.addresses.map((i: any, index: number) => (
                            <p key={i.address + `_address${index}`}>
                              <Badge color={i.health === -1 ? 'red' : 'green'} text={i.address} />
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className={styles.procotol}>
                        <div className={styles.subTitle}>{item?.protocolDetail?.name || '--'}</div>
                        <p>{item.protocolDetail?.description || '--'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TableCard>
            </div>
          ))
        : null}
    </div>
  );
};
