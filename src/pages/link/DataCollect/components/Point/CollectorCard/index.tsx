import { useEffect, useState } from 'react';
import { BadgeStatus, Ellipsis, PermissionButton } from '@/components';
import './index.less';
import { Popconfirm, Spin, Tooltip } from 'antd';
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import service from '@/pages/link/DataCollect/service';
import { onlyMessage } from '@/utils/util';
import moment from 'moment';
import classNames from 'classnames';
import { StatusColorEnum } from '@/components/BadgeStatus';

export interface PointCardProps {
  item: Partial<PointItem>;
  reload: () => void;
  wsValue: any;
  update: (item: any, type?: boolean) => void;
  activeStyle?: string;
}

const opcImage = require('/public/images/DataCollect/device-opcua.png');
const modbusImage = require('/public/images/DataCollect/device-modbus.png');

const CollectorCard = (props: PointCardProps) => {
  const { item, wsValue } = props;
  const [spinning, setSpinning] = useState<boolean>(false);
  const { permission } = PermissionButton.usePermission('link/DataCollect/DataGathering');
  const [dataValue, setDataValue] = useState<any>(wsValue);

  useEffect(() => {
    setDataValue(wsValue);
  }, [wsValue]);

  const read = async () => {
    if (item?.collectorId && item?.id) {
      setSpinning(true);
      const resp = await service.readPoint(item?.collectorId, [item.id]);
      if (resp.status === 200) {
        onlyMessage('操作成功');
      }
      setSpinning(false);
    }
  };
  return (
    <Spin spinning={spinning}>
      <div className={classNames('card-item', props.activeStyle)}>
        <div className={'card-item-left'}>
          <div className={'card-item-status'}>
            <div className={'card-item-status-content'}>
              <BadgeStatus
                status={item.status?.value !== undefined ? item.status?.value : ''}
                text={item.status?.text}
                statusNames={{
                  running: StatusColorEnum.success,
                  disabled: StatusColorEnum.processing,
                  partialError: StatusColorEnum.warning,
                  failed: StatusColorEnum.error,
                  stopped: StatusColorEnum.default,
                }}
              />
            </div>
          </div>
          <div className={'card-item-avatar'}>
            <img
              width={88}
              height={88}
              src={item.provider === 'OPC_UA' ? opcImage : modbusImage}
              alt={''}
            />
          </div>
        </div>
        <div className={'card-item-right'}>
          <div className={'card-item-body'}>
            <div className={'card-item-right-header'}>
              <div className={'card-item-right-title'}>
                <Ellipsis title={item.name} />
              </div>
              <div className={'card-item-right-action'}>
                <Popconfirm
                  title={'确认删除'}
                  disabled={!permission.delete}
                  onCancel={(e) => {
                    e?.stopPropagation();
                  }}
                  onConfirm={async (e) => {
                    e?.stopPropagation();
                    if (item.id) {
                      const resp = await service.removePoint(item.id);
                      if (resp.status === 200) {
                        onlyMessage('操作成功！');
                        props.reload();
                      }
                    }
                  }}
                >
                  <Tooltip title={!permission.delete ? '暂无权限，请联系管理员' : ''}>
                    <DeleteOutlined
                      style={{ marginRight: 10 }}
                      onClick={(e) => {
                        e?.stopPropagation();
                      }}
                    />
                  </Tooltip>
                </Popconfirm>
                <Tooltip title={!permission.update ? '暂无权限，请联系管理员' : ''}>
                  <FormOutlined
                    onClick={(e) => {
                      e?.stopPropagation();
                      if (permission.update) {
                        props.update(item);
                      }
                    }}
                  />
                </Tooltip>
              </div>
            </div>
            <div className={'card-item-content'}>
              {dataValue ? (
                <div className={'card-item-content-item-left'}>
                  <div className={'card-item-content-item-header'}>
                    <div className={'card-item-content-item-header-title'}>
                      <Ellipsis title={`${dataValue?.parseData}(${dataValue?.dataType})`} />
                    </div>
                    <div className={'card-item-content-item-header-action'}>
                      {item.accessModes && item.accessModes.map((i) => i.value)?.includes('write') && (
                        <EditOutlined
                          style={{ marginLeft: 15 }}
                          onClick={(e) => {
                            e?.stopPropagation();
                            props.update(item, true);
                          }}
                        />
                      )}
                      {item.accessModes && item.accessModes.map((i) => i.value)?.includes('read') && (
                        <RedoOutlined
                          style={{ marginLeft: 15 }}
                          onClick={(e) => {
                            e?.stopPropagation();
                            read();
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className={'card-item-content-item-text'}>
                    <Ellipsis title={dataValue?.hex || ''} />
                  </div>
                  <div className={'card-item-content-item-text'}>
                    <Ellipsis
                      title={
                        dataValue?.timestamp
                          ? moment(dataValue.timestamp).format('YYYY-MM-DD HH:mm:ss')
                          : ''
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className={'card-item-content-item-left'}>
                  <div className={'card-item-content-item-empty'}>
                    <span className={'action'} style={{ fontWeight: 600, color: '#000' }}>
                      --
                    </span>
                    {item.accessModes && item.accessModes.map((i) => i.value)?.includes('write') && (
                      <EditOutlined
                        className={'action'}
                        style={{ marginLeft: 15 }}
                        onClick={(e) => {
                          e?.stopPropagation();
                          props.update(item, true);
                        }}
                      />
                    )}
                    {item.accessModes && item.accessModes.map((i) => i.value)?.includes('read') && (
                      <RedoOutlined
                        style={{ marginLeft: 15 }}
                        className={'action'}
                        onClick={(e) => {
                          e?.stopPropagation();
                          read();
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
              <div className={'content-item-border-right'}></div>
              <div className={'card-item-content-item-right'}>
                <div className={'card-item-content-item-header'}>
                  {item.configuration?.parameter?.quantity && (
                    <div className={'card-item-content-item-header-item'}>
                      <div>
                        <Ellipsis title={item.configuration?.parameter?.quantity} />
                      </div>
                      <div style={{ width: 85, opacity: 0.75 }} className={'ellipsis'}>
                        (读取寄存器)
                      </div>
                    </div>
                  )}
                  {item.configuration?.parameter?.address && (
                    <div className={'card-item-content-item-header-item'}>
                      <div>
                        <Ellipsis title={item.configuration?.parameter?.address} />
                      </div>
                      <div style={{ width: 50, opacity: 0.75 }} className={'ellipsis'}>
                        (地址)
                      </div>
                    </div>
                  )}
                  {item.configuration?.codec?.configuration?.scaleFactor && (
                    <div className={'card-item-content-item-header-item'}>
                      <div>
                        <Ellipsis title={item.configuration?.codec?.configuration?.scaleFactor} />
                      </div>
                      <div style={{ width: 72, opacity: 0.75 }} className={'ellipsis'}>
                        (缩放因子)
                      </div>
                    </div>
                  )}
                </div>
                <div className={'card-item-content-item-tags'}>
                  <div className={'card-item-content-item-tag'}>
                    {(item?.accessModes || []).map((i) => i?.text).join(',')}
                  </div>
                  <div className={'card-item-content-item-tag'}>
                    采集频率{item?.configuration?.interval}ms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={'checked-icon'}>
          <div>
            <CheckOutlined />
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default CollectorCard;
