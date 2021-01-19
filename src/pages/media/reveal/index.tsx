import encodeQueryParam from "@/utils/encodeParam";
import { ApartmentOutlined, AudioOutlined, DownOutlined, LeftOutlined, MinusOutlined, PlusOutlined, RightOutlined, UpOutlined, VideoCameraOutlined, VideoCameraTwoTone } from "@ant-design/icons/lib/icons";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Card, Tabs, Tree } from "antd";
import React, { useEffect, useState } from "react";
import styles from './index.less';
import Service from "./service";
import { DataNode } from './data';

interface Props {

}

const Reveal: React.FC<Props> = props => {
  const service = new Service('media/gb28181');

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
  const [playing, setPlaying] = useState(false);
  const [setting, setSetting] = useState(0);
  const [deviceId, setDeviceId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [playerActive, setPlayerActive] = useState(0);
  const playerBtnGroup = [{ num: 1, name: '单屏' }, { num: 4, name: '四分屏' }, { num: 9, name: '九分屏' }];

  useEffect(() => {
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
      })
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
    //关闭流
    // players.map(item => {
    //   stopVideo(item.deviceId, item.channelId);
    // });
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
              icon: it.status.value === 'online' ? <VideoCameraTwoTone /> : <VideoCameraOutlined />,
              channelId: it.channelId,
              deviceId: it.deviceId,
              children: []
            })
          })
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
            // stopVideo(item.deviceId, item.channelId);
            item.url = getPlayer(res).url
            item.protocol = getPlayer(res).protocol
            item.deviceId = deviceId
            item.channelId = channelId
          }
        })
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
    if(res.mp4){
      return {url: res.mp4, protocol:'mp4'}
    }else if(res.hls){
      return {url: res.hls, protocol:'hls'}
    }else if(res.flv){
      return {url: res.flv, protocol:'flv'}
    }else if(res.rtmp){
      return {url: res.rtmp, protocol:'rtmp'}
    }else if(res.rtsp){
      return {url: res.rtsp, protocol:'rtsp'}
    }else if(res.rtc){
      return {url: res.rtc, protocol:'rtc'}
    }else{
      return {url: '', protocol:''}
    }
  }

  const stopVideo = (deviceId: string, channelId: string) => {
    if(deviceId !== '' && channelId !== ''){
      service.getStop(deviceId, channelId).subscribe(() => {})
    }
  }

  const controlStart = (deviceId: string, channelId: string, direct: string) => {
    if (playing) {
      service.getControlStart(deviceId, channelId, direct, 10).subscribe(() => {
      })
    }
  }
  const controlStop = (deviceId: string, channelId: string) => {
    if (playing) {
      service.getControlStop(deviceId, channelId).subscribe(() => {
      })
    }
  }

  const fullScreen = () => {
    let dom = document.getElementById('video_show');
    if (dom?.requestFullscreen) {
      dom.requestFullscreen();
    }
  };

  return (
    <PageHeaderWrapper title="分屏展示">
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <div className={styles.box}>
          <div className={styles.device_tree}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="设备树" key="1">
                <Tree
                  showIcon
                  defaultExpandAll
                  switcherIcon={<DownOutlined />}
                  treeData={treeData}
                  loadData={loadChannel}
                  onSelect={(key, e) => { playVideo(e) }}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
          <div className={styles.player}>
            <div className={styles.top}>
              {playerBtnGroup.length > 0 && playerBtnGroup.map((item, index) => (
                <div key={index} className={styles.btn} onClick={() => { setPlayerActive(index); setPlayerLength(item.num); }} style={index === playerActive ? { backgroundColor: '#404d59', color: '#fff' } : {}}>{item.name}</div>
              ))}
              <div className={styles.btn} onClick={() => { fullScreen() }}>全屏</div>
            </div>
            <div className={styles.player_box}>
              <div className={styles.player_left} id="video_show">
                {
                  players.length > 0 && players.map((item: any, index: number) => (
                    <div onClick={() => { setSetting(index); }} className={styles.video} key={index} style={players.length === 1 ? { border: setting === index ? "1px solid red" : null, width: 'calc(100% - 10px)' } : players.length === 9 ? { border: setting === index ? "1px solid red" : null, width: "calc((100% -  30px) / 3)" } : { width: "calc((100% -  20px) / 2)", border: setting === index ? "1px solid red" : null }}>
                      <live-player loading={item.bLoading} muted stretch protocol={item.protocol} element-loading-text="加载中..." element-loading-background="#000" autoplay live video-url={item.url}></live-player>
                    </div>
                  ))
                }
              </div>
              <div className={styles.player_right}>
                <div className={styles.ptz_block}>
                  <div className={styles.ptz_up} title="上" onMouseDown={() => { controlStart(deviceId,channelId,'UP'); }} onMouseUp={() => { controlStop(deviceId,channelId); }}>
                    <UpOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                  </div>
                  <div className={styles.ptz_left} title="左" onMouseDown={() => { controlStart(deviceId,channelId,'LEFT'); }} onMouseUp={() => { controlStop(deviceId,channelId); }}>
                    <LeftOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                  </div>
                  <div className={styles.ptz_center} title="云控制台">
                    <AudioOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                  </div>
                  <div className={styles.ptz_right} title="右" onMouseDown={() => { controlStart(deviceId,channelId,'RIGHT'); }} onMouseUp={() => { controlStop(deviceId,channelId); }}>
                    <RightOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                  </div>
                  <div className={styles.ptz_down} title="下" onMouseDown={() => { controlStart(deviceId,channelId,'DOWN'); }} onMouseUp={() => { controlStop(deviceId,channelId); }}>
                    <DownOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                  </div>
                  <div className={styles.ptz_zoomin} title="放大" onMouseDown={() => { controlStart(deviceId,channelId,'ZOOM_IN'); }} onMouseUp={() => { controlStop(deviceId,channelId); }}>
                    <PlusOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                  </div>
                  <div className={styles.ptz_zoomout} title="缩小" onMouseDown={() => { controlStart(deviceId,channelId,'ZOOM_OUT'); }} onMouseUp={() => { controlStop(deviceId,channelId); }}>
                    <MinusOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
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