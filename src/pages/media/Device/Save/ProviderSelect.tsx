import classNames from 'classnames';
import { Badge, Button, Empty } from 'antd';
import { StatusColorEnum } from '@/components/BadgeStatus';
import styles from '@/pages/link/AccessConfig/index.less';
import { TableCard } from '@/components';
import './providerSelect.less';
import usePermissions from '@/hooks/permission';
import { useIntl } from 'umi';
import { providerType, service } from '@/pages/media/Device';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { useRequest } from '@@/plugin-request/request';

interface ProviderProps {
  value?: string;
  options?: any[];
  type: string;
  onChange?: (id: string) => void;
  onSelect?: (id: string, rowData: any) => void;
}

const defaultImage = require('/public/images/device-access.png');

export default (props: ProviderProps) => {
  const { permission } = usePermissions('link/AccessConfig');
  const [options, setOptions] = useState<any[]>([]);
  const addItemKey = useRef('');
  const intl = useIntl();

  const itemClick = useCallback(
    (item: any) => {
      if (props.onChange) {
        props.onChange(item.id);
      }

      if (props.onSelect) {
        props.onSelect(item.id, item);
      }
    },
    [props],
  );

  const { run: getProviderList } = useRequest(service.queryProvider, {
    manual: true,
    formatResult: (res) => res.result,
    onSuccess: (resp) => {
      if (resp.data && resp.data.length) {
        setOptions(resp.data);
        if (addItemKey.current) {
          const _item = resp.data.find((item: any) => item.id === addItemKey.current);
          itemClick(_item);
          addItemKey.current = '';
        }
      }
    },
  });

  const jumpPage = useCallback(() => {
    const url = getMenuPathByCode(MENUS_CODE['link/AccessConfig/Detail']);
    const tab: any = window.open(`${origin}/#${url}?save=true&type=${props.type}`);
    tab!.onTabSaveSuccess = (value: any) => {
      addItemKey.current = value.id;
      getProviderList({
        sorts: [{ column: 'createTime', value: 'desc' }],
        terms: [{ column: 'provider', value: props.type }],
        paging: false,
      });
    };
  }, [props.type]);

  useEffect(() => {
    setOptions(props.options || []);
  }, [props.options]);

  const emptyDescription = permission.add ? (
    <>
      暂无数据，请先
      <Button type={'link'} onClick={jumpPage} style={{ padding: 0 }}>
        添加{providerType[props.type]} 接入网关
      </Button>
    </>
  ) : (
    intl.formatMessage({
      id: 'pages.data.option.noPermission',
      defaultMessage: '没有权限',
    })
  );

  return (
    <div className={'provider-list'}>
      {options && options.length ? (
        options.map((item) => (
          <div
            onClick={() => {
              itemClick(item);
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
      ) : (
        <Empty description={<span>{emptyDescription}</span>} />
      )}
    </div>
  );
};
