import encodeQueryParam from "@/utils/encodeParam";
import { ApartmentOutlined, DownOutlined, VideoCameraOutlined, VideoCameraTwoTone } from "@ant-design/icons/lib/icons";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Card, Tabs, Tree } from "antd";
import React, { useEffect, useState } from "react";
import styles from './index.less';
import Service from "./service";
import { DataNode } from './data';

interface Props {

}

const Reveal: React.FC<Props> = props => {
  const service = new Service('media/gateway');

  const [treeData, setTreeData] = useState<DataNode>();
  const [players, setPlayers] = useState([{
    url: "", //http://mirror.aarnet.edu.au/pub/TED-talks/911Mothers_2010W-480p.mp4
    bLoading: false,
    timer: 0,
    bCloseShow: false,
    closeTimer: 0,
    serial: "",
    code: "",
    protocol: "",
    poster: "",
    deviceId: '',
    channelId: ''
  }]);
  const [playing, setPlaying] = useState(true);
  const [setting, setSetting] = useState(0);
  const [deviceId, setDeviceId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [playUp, setPlayUp] = useState<boolean>(true);
  const [playDown, setPlayDown] = useState<boolean>(true);
  const [playLeft, setPlayLeft] = useState<boolean>(true);
  const [playCenter, setPlayCenter] = useState<boolean>(false);
  const [playRight, setPlayRight] = useState<boolean>(true);
  const [playIn, setPlayIn] = useState<boolean>(true);
  const [playOut, setPlayOut] = useState<boolean>(true);
  const [playerActive, setPlayerActive] = useState(0);
  const playerBtnGroup = [{ num: 1, name: '单屏' }, { num: 4, name: '四分屏' }, { num: 9, name: '九分屏' }];

  useEffect(() => {
    setPlaying(true);
    //获取信令服务
    let datalist: DataNode[] = [];
    service.getProduct(encodeQueryParam({ terms: location?.query?.terms })).subscribe(
      (result) => {
        if (result.length > 0) {
          result.map((i: any) => {
            service.groupDevice(encodeQueryParam({
              terms: {
                productId: i.productId,
              }
            })).subscribe((data) => {
              if (data.length > 0) {
                data.map((item: any) => {
                  datalist.push({
                    title: item.name,
                    key: item.id,
                    isLeaf: false,
                    icon: <ApartmentOutlined />,
                    channelId: '',
                    deviceId: '',
                    children: []
                  })
                })
              }
              setTreeData(datalist)
            })
          })
        }
      },
      () => {
      });
    document.addEventListener('fullscreenchange', function () {
      if (document.fullscreenElement) {
        setSetting(10);
      } else {
        setSetting(0);
      }
    }, false);
  }, []);
  const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): any[] => {
    return list.map((node: any) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      } else if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  };
  const setPlayerLength = (playerLength: number) => {
    let data: any = [];
    for (let i = 0; i < playerLength; i++) {
      data.push({
        url: "",
        bLoading: false,
        timer: 0,
        bCloseShow: false,
        closeTimer: 0,
        serial: "",
        code: "",
        protocol: "",
        poster: "",
        deviceId: '',
        channelId: ''
      })
    }
    setSetting(0);
    setPlayers(data);
  };
  const loadChannel = (node: any) => {
    const { eventKey, isLeaf } = node.props
    return new Promise<void>(resolve => {
      if (isLeaf) {
        resolve();
        return;
      }
      let children1: DataNode[] = []
      service.getChannel(encodeQueryParam({
        terms: {
          deviceId: eventKey
        }
      })).subscribe((res) => {
        if (res.length > 0) {
          res.map((it: any) => {
            children1.push({
              title: it.name,
              key: it.id,
              isLeaf: true,
              icon: it.status.value === 'online' ? <VideoCameraTwoTone twoToneColor="#52c41a" /> : <VideoCameraOutlined />,
              channelId: it.channelId,
              deviceId: it.deviceId,
              children: []
            })
          });
          setTreeData(origin => updateTreeData(origin, eventKey, children1));
          resolve();
        }
      })
    })
  };
  const playVideo = (e) => {
    const { deviceId, channelId, isLeaf } = e.node.props;
    setDeviceId(deviceId);
    setChannelId(channelId);
    if (isLeaf) {
      service.getPlay(deviceId, channelId).subscribe(res => {
        let data = players || [];
        data.forEach((item, index) => {
          if (index === setting) {
            item.url = getPlayer(res).url;
            item.protocol = getPlayer(res).protocol;
            item.deviceId = deviceId;
            item.channelId = channelId
          }
        });
        let i = 0;
        if (players.length - 1 > setting) {
          i = setting + 1;
        } else if (players.length - 1 === setting) {
          i = 0
        }
        setSetting(i);
        setPlayers([...data])
      })
    }
  };

  const getPlayer = (res: any) => {
    if (res.mp4) {
      return { url: res.mp4, protocol: 'mp4' }
    } else if (res.flv) {
      return { url: res.flv, protocol: 'flv' }
    } else if (res.hls) {
      return { url: res.hls, protocol: 'hls' }
    } else if (res.rtmp) {
      return { url: res.rtmp, protocol: 'rtmp' }
    } else if (res.rtsp) {
      return { url: res.rtsp, protocol: 'rtsp' }
    } else if (res.rtc) {
      return { url: res.rtc, protocol: 'rtc' }
    } else {
      return { url: '', protocol: '' }
    }
  };

  const controlStart = (deviceId: string, channelId: string, direct: string) => {
    if (playing && deviceId !== '' && channelId !== '' && deviceId !== undefined && channelId !== undefined) {
      service.getControlStart(deviceId, channelId, direct, 90).subscribe(() => {
      })
    }
  };
  const controlStop = (deviceId: string, channelId: string) => {
    if (playing && deviceId !== '' && channelId !== '' && deviceId !== undefined && channelId !== undefined) {
      service.getControlStop(deviceId, channelId).subscribe(() => {
      })
    }
  };

  const fullScreen = () => {
    let dom = document.getElementById('video_show');
    if (dom?.requestFullscreen) {
      dom.requestFullscreen();
    }
  };

  //刷新
  const refresh = (deviceId: string, channelId: string) => {
    //关闭流
    service.getStop(deviceId, channelId).subscribe(() => {
      //开启流
      service.getPlay(deviceId, channelId).subscribe(res => {
        let data = players || [];
        data.forEach((item, index) => {
          if (index === setting) {
            item.url = getPlayer(res).url;
            item.protocol = getPlayer(res).protocol;
            item.deviceId = deviceId;
            item.channelId = channelId
          }
        });
        setPlayers([...data])
      })
    });
  };

  return (
    <PageHeaderWrapper title="分屏展示">
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <div className={styles.box}>
          <div className={styles.device_tree}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="设备树" key="1">
                <div className={styles.device_tree_tab}>
                  <Tree
                    showIcon
                    defaultExpandAll
                    switcherIcon={<DownOutlined />}
                    treeData={treeData}
                    loadData={loadChannel}
                    onSelect={(key, e) => { playVideo(e) }}
                  />
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
          <div className={styles.player}>
            <div className={styles.top}>
              <div className={styles.btn_box}>
                {playerBtnGroup.length > 0 && playerBtnGroup.map((item, index) => (
                  <div key={index} className={styles.btn} onClick={() => { setPlayerActive(index); setPlayerLength(item.num); }} style={index === playerActive ? { backgroundColor: '#404d59', color: '#fff' } : {}}>{item.name}</div>
                ))}
                <div className={styles.btn} onClick={() => { fullScreen() }}>全屏</div>
              </div>
            </div>
            <div className={styles.player_box}>
              <div className={styles.player_left} id="video_show">
                {
                  players.length > 0 && players.map((item: any, index: number) => (
                    <div onClick={() => { if (!document.fullscreenElement) { setSetting(index); setDeviceId(item.deviceId); setChannelId(item.channelId); } }} className={styles.video} key={index} style={players.length === 1 ? { border: setting === index ? "1px solid red" : null, width: 'calc(100% - 10px)' } : players.length === 9 ? { border: setting === index ? "1px solid red" : null, width: "calc((100% -  30px) / 3)" } : { width: "calc((100% -  20px) / 2)", border: setting === index ? "1px solid red" : null }}>
                      <live-player loading={item.bLoading} muted stretch protocol={item.protocol} element-loading-text="加载中..." element-loading-background="#000" autoplay live video-url={item.url}></live-player>
                      {item.deviceId !== '' && item.channelId !== '' && <div className={styles.video_lose} onClick={() => { refresh(item.deviceId, item.channelId) }}>刷新</div>}
                    </div>
                  ))
                }
              </div>
              <div className={styles.player_right}>
                <div className={styles.ptz_block}>
                  <div className={styles.ptz_up} title="上" onMouseDown={() => { controlStart(deviceId, channelId, 'UP'); setPlayUp(false); }} onMouseUp={() => { controlStop(deviceId, channelId); setPlayUp(true); }}>
                    {playing && playUp ? <img src="/img/up.svg" width="30px" /> : <img src="/img/up_1.svg" width="30px" />}
                  </div>
                  <div className={styles.ptz_left} title="左" onMouseDown={() => { controlStart(deviceId, channelId, 'LEFT'); setPlayLeft(false); }} onMouseUp={() => { controlStop(deviceId, channelId); setPlayLeft(true); }}>
                    {playing && playLeft ? <img src="/img/left.svg" width="30px" /> : <img src="/img/left_1.svg" width="30px" />}
                  </div>
                  <div className={styles.ptz_center} title="云控制台">
                    {playing && playCenter ? <img src="/img/audio.svg" width="30px" /> : <img src="/img/audio_1.svg" width="30px" />}
                  </div>
                  <div className={styles.ptz_right} title="右" onMouseDown={() => { controlStart(deviceId, channelId, 'RIGHT'); setPlayRight(false); }} onMouseUp={() => { controlStop(deviceId, channelId); setPlayRight(true); }}>
                    {playing && playRight ? <img src="/img/right.svg" width="30px" /> : <img src="/img/right_1.svg" width="30px" />}
                  </div>
                  <div className={styles.ptz_down} title="下" onMouseDown={() => { controlStart(deviceId, channelId, 'DOWN'); setPlayDown(false); }} onMouseUp={() => { controlStop(deviceId, channelId); setPlayDown(true); }}>
                    {playing && playDown ? <img src="/img/down.svg" width="30px" /> : <img src="/img/down_1.svg" width="30px" />}
                  </div>
                  <div className={styles.ptz_zoomin} title="放大" onMouseDown={() => { controlStart(deviceId, channelId, 'ZOOM_IN'); setPlayIn(false); }} onMouseUp={() => { controlStop(deviceId, channelId); setPlayIn(true); }}>
                    {playing && playIn ? <img src="/img/add.svg" width="30px" /> : <img src="/img/add_1.svg" width="30px" />}
                  </div>
                  <div className={styles.ptz_zoomout} title="缩小" onMouseDown={() => { controlStart(deviceId, channelId, 'ZOOM_OUT'); setPlayOut(false); }} onMouseUp={() => { controlStop(deviceId, channelId); setPlayOut(true); }}>
                    {playing && playOut ? <img src="/img/sub.svg" width="30px" /> : <img src="/img/sub_1.svg" width="30px" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </PageHeaderWrapper>
  )
};
export default Reveal;
