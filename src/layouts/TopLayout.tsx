import React, { useCallback, useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import { BasicLayoutProps } from './BasicLayout';
import { connect, useHistory } from 'dva';
import { Menu, Button, Badge, Spin } from 'antd'
import { CurrentUser } from '@/models/user';
import { ConnectProps, ConnectState } from '@/models/connect';
import styles from './TopLayout.less';
import { ClickParam } from 'antd/es/menu';
import { HeaderViewProps } from '@ant-design/pro-layout/lib/Header';
import { EdgeModelState } from '@/models/edge';
import StatusBadge from '@/components/StatusBadge';
import { getEdgeState } from '@/services/edge';
import { getWebsocket } from './GlobalWebSocket';
interface TopLayoutProps extends Omit<HeaderViewProps, 'logo'>, BasicLayoutProps {
  currentUser?: CurrentUser;
  edge: EdgeModelState
}

function TopLayout(props: TopLayoutProps) {
  const { currentUser, edge, dispatch } = props;
  // const service = new Service('user/detail');
  const [current, setCurrent] = useState('')
  const [wsTask, setWsTask] = useState<any>(null)
  const history = useHistory()

  const fetchData = () => {
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  }

  const handleClick = (param: ClickParam) => {
    setCurrent(param.key)
    history.push(param.key)
  }

  const getDeviceInfo = () => {
    if (dispatch) {
      dispatch({
        type: 'edge/getID',
      });
    }
  }

  const getUserInfo = () => {
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  const getEdgeState = useCallback((payload: string) => {
    let taskPush = getWebsocket(
      `firmware-push-upgrade-by-${props.edge || 'edge'}`,
      `/edge/operations/${payload}/state`,
      {
        deviceId: payload,
      },
    ).subscribe((res) => {
      console.log(res);
      // taskStatus.processing = (taskStatus.processing + 1);
      // taskStatus.waiting = (taskStatus.waiting - 1);
      // setTaskStatus({...taskStatus});
    });
    setWsTask(taskPush)
  }, [props.edge])


  useEffect(() => {
    getUserInfo()
    getDeviceInfo()
    return () => {
      if (wsTask) {
        wsTask.unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    if (edge.id) {
      getEdgeState(edge.id)
    }
  }, [edge.id])

  // useEffect(() => {
  //   const u = service.get().subscribe(resp => {
  //     localStorage.setItem('user-detail', JSON.stringify(resp));
  //     // localStorage.setItem('tenants-admin', resp.tenants[0]?.adminMember);
  //   });
  //   return () => {
  //     u.unsubscribe();
  //   };
  // }, [currentUser]);

  useEffect(() => {
    if (props.location?.pathname) {
      setCurrent(props.location?.pathname)
    }
  }, [props.location])


  return <div className={styles.topLayout}>
    <div className={styles.left}>
      <img className={styles.log} src={props.iconfontUrl || logo} alt="" />
      <span className={styles.title}>{props.title || 'Jetlinks-Edge'}</span>
      <div className={styles.icons}>
        <img className={styles.device} src={require('@/assets/device.png')} alt="" />
        <div className={styles.horiLine}></div>
        <img className={styles.things} src={require('@/assets/things.png')} alt="" />
      </div>
      <div className={styles.status}>
        {/* <Badge style={{ color: '#fff' }} color='green' text='在线' /> */}
        <StatusBadge value={edge?.online} textColor='#fff' />
      </div>
    </div>
    <div className={styles.center}>

      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        {
          props.menuData && props.menuData.map(
            item =>
              <Menu.Item key={item.path}>
                {item.name}
              </Menu.Item>
          )
        }
      </Menu>
    </div>
    <div className={styles.right}>
      {
        currentUser && currentUser.name ?
          <span> {currentUser.name} </span>
          : <Spin
            size="small"
            style={{
              marginLeft: 8,
              marginRight: 8,
            }}
          />
      }
      <div className={styles.verticalLine}></div>
      <Button type='link' style={{ color: '#fff' }} onClick={fetchData}>退出</Button>
    </div>
  </div>
}

export default connect(({ user, edge }: ConnectState) => {
  return {
    currentUser: user.currentUser,
    edge: edge,
  }
})(TopLayout)
