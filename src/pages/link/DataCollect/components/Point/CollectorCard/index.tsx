import { useState } from 'react';
import { Ellipsis } from '@/components';
import './index.less';
import { Badge, Popconfirm, Spin } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  MinusOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import OpcSave from '../Save/opc-ua';
import ModbusSave from '../Save/modbus';
import service from '@/pages/link/DataCollect/service';
import { onlyMessage } from '@/utils/util';
import moment from 'moment';
import WritePoint from '@/pages/link/DataCollect/components/Point/CollectorCard/WritePoint';

export interface PointCardProps {
  item: Partial<PointItem>;
  reload: () => void;
  wsValue: any;
}

const opcImage = require('/public/images/DataCollect/device-opcua.png');
const modbusImage = require('/public/images/DataCollect/device-modbus.png');

export default (props: PointCardProps) => {
  const { item, wsValue } = props;
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [writeVisible, setWriteVisible] = useState<boolean>(false);

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

  const saveComponent = () => {
    if (item.provider === 'OPC_UA') {
      return (
        <OpcSave
          close={() => {
            setEditVisible(false);
          }}
          reload={() => {
            setEditVisible(false);
          }}
          data={item}
        />
      );
    }
    return (
      <ModbusSave
        close={() => {
          setEditVisible(false);
        }}
        reload={() => {
          setEditVisible(false);
        }}
        data={item}
      />
    );
  };
  return (
    <Spin spinning={spinning}>
      <div className={'card-item'}>
        <div className={'card-item-left'}>
          <div className={'card-item-status'}>
            <div className={'card-item-status-content'}>
              <Badge
                status={item.state?.value === 'enabled' ? 'success' : 'error'}
                text={item.state?.text}
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
                  onConfirm={async () => {
                    if (item.id) {
                      const resp = await service.removePoint(item.id);
                      if (resp.status === 200) {
                        onlyMessage('操作成功！');
                        props.reload();
                      }
                    }
                  }}
                >
                  <DeleteOutlined style={{ marginRight: 10 }} />
                </Popconfirm>
                <FormOutlined
                  onClick={() => {
                    setEditVisible(true);
                  }}
                />
              </div>
            </div>
            <div className={'card-item-content'}>
              {wsValue ? (
                <div className={'card-item-content-item'}>
                  <div className={'card-item-content-item-header'}>
                    <div className={'card-item-content-item-header-title'}>
                      <Ellipsis title={`${wsValue?.parseData}(${wsValue?.dataType})`} />
                    </div>
                    <div className={'card-item-content-item-header-action'}>
                      <EditOutlined
                        style={{ marginRight: 5 }}
                        onClick={() => {
                          setWriteVisible(true);
                        }}
                      />
                      <RedoOutlined
                        onClick={() => {
                          read();
                        }}
                      />
                    </div>
                  </div>
                  <div className={'card-item-content-item-text'}>
                    <Ellipsis title={wsValue?.hex || ''} />
                  </div>
                  <div className={'card-item-content-item-text'}>
                    <Ellipsis
                      title={
                        wsValue?.timestamp
                          ? moment(wsValue.timestamp).format('YYYY-MM-DD HH:mm:ss')
                          : ''
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className={'card-item-content-item'}>
                  <div className={'card-item-content-item-empty'}>
                    <MinusOutlined className={'action'} />
                    <EditOutlined
                      className={'action'}
                      style={{ margin: '0 15px' }}
                      onClick={() => {
                        setWriteVisible(true);
                      }}
                    />
                    <RedoOutlined
                      className={'action'}
                      onClick={() => {
                        read();
                      }}
                    />
                  </div>
                </div>
              )}
              <div className={'content-item-border-right'}></div>
              <div className={'card-item-content-item'}>
                <div className={'card-item-content-item-header'}>
                  <div className={'card-item-content-item-header-item'}>
                    <div>
                      <Ellipsis title={item.configuration?.parameter?.quantity} />
                    </div>
                    <div style={{ width: 85, opacity: 0.75 }}>(读取寄存器)</div>
                  </div>
                  <div className={'card-item-content-item-header-item'}>
                    <div>
                      <Ellipsis title={item.configuration?.parameter?.address} />
                    </div>
                    <div style={{ width: 40, opacity: 0.75 }}>(地址)</div>
                  </div>
                  <div className={'card-item-content-item-header-item'}>
                    <div>
                      <Ellipsis title={item.configuration?.codec?.configuration?.scaleFactor} />
                    </div>
                    <div style={{ width: 72, opacity: 0.75 }}>(缩放因子)</div>
                  </div>
                </div>
                <div className={'card-item-content-item-tags'}>
                  <div className={'card-item-content-item-tag'}>
                    {(item?.accessModes || []).map((i) => i?.text).join(',')}
                  </div>
                  <div className={'card-item-content-item-tag'}>
                    采集频率{item?.configuration?.interval}s
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {editVisible && saveComponent()}
        {writeVisible && (
          <WritePoint
            data={item}
            onCancel={() => {
              setWriteVisible(false);
            }}
          />
        )}
      </div>
    </Spin>
  );
};
