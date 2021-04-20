import React, {useState, useContext, useEffect} from "react";
import {List, Card, Tooltip, Icon} from "antd";
import {router} from "umi";
import encodeQueryParam from "@/utils/encodeParam";
import IconFont from "@/components/IconFont";
import styles from '../index.less';
import Edit from "./edit";
import {TenantContext} from "../../../detail";
import Service from "../../../service";

interface Props {
  user: any
}

const Device = (props: Props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const data = useContext(TenantContext);
  const service = new Service('tenant');

  const [online, setOnline] = useState(0);
  const [offline, setOffline] = useState(0);
  const getData = () => {
    service.assets.deviceCount(encodeQueryParam({
      terms: {
        id$assets: JSON.stringify({
          tenantId: data?.id,
          assetType: 'device',
          memberId: props.user,
        }),
        state: 'offline'
      }
    })).subscribe(resp => {
      setOffline(resp)
    });
    service.assets.deviceCount(encodeQueryParam({
      terms: {
        id$assets: JSON.stringify({
          tenantId: data?.id,
          assetType: 'device',
          memberId: props.user,
        }),
        state: 'online'
      }
    })).subscribe(resp => {
      setOnline(resp)
    })
  };
  useEffect(() => {
    getData();
  }, [props.user]);

  return (
    <List.Item style={{paddingRight: '10px'}}>
      <Card
        hoverable
        className={styles.card}
        actions={[
          <Tooltip title="查看">
            <Icon type="eye" onClick={() => router.push({
              pathname: `/device/instance`,
              search:'iop='+JSON.stringify({
                terms: {
                  id$assets: {
                    tenantId: data?.id,
                    assetType: 'device',
                    memberId: props.user,
                  }
                }
              }) 
            })}/>
          </Tooltip>,
          <Tooltip title="编辑">
            <Icon type="edit" onClick={() => setVisible(true)}/>
          </Tooltip>]}
      >
        <Card.Meta
          avatar={<IconFont type="icon-device" style={{fontSize: 45}}/>}
          title={<a>设备</a>}
        />
        <div className={styles.cardInfo}>
          <div>
            <p>在线</p>
            <p>{online}</p>
          </div>
          <div>
            <p>离线</p>
            <p>{offline}</p>
          </div>
        </div>
      </Card>
      {visible && (
        <Edit
          user={props.user}
          data={data}
          close={() => {
            setVisible(false);
            getData();
          }}/>
      )}
    </List.Item>
  )
};
export default Device;
