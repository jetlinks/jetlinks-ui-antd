import React, { useEffect, useState } from "react";
import { Modal, Radio, Icon } from "antd";
import styles from './play.less';
import Service from '@/pages/edge-gateway/device/detail/video/play/service';
interface Props {
  data: any;
  close: (e: any) => void,
  save: (e: any) => void,
  visible: boolean
}

const Play = (props: Props) => {
  const service = new Service('media/channel-play');
  const [playing, setPlaying] = useState<boolean>(false);
  const playerBtnGroup = [{ name: 'FLV', value: "flv" }, { name: 'RTSP', value: "rtsp" }, { name: 'RTMP', value: "rtmp" }, { name: 'MP4', value: "mp4" }, { name: 'HLS', value: "hls" }, { name: 'RTC', value: "rtc" }];
  const [urlItem, setUrlItem] = useState({});
  const [url, setUrl] = useState('');
  const [bloading, setBloading] = useState(true);
  const [protocol, setProtocol] = useState('');
  const [toolBtn, setToolBtn] = useState([
    { type: 'UP' },
    { type: 'RIGHT' },
    { type: 'DOWN' },
    { type: 'LEFT' },
  ])
  const [toolActive, setToolActive] = useState('')
  useEffect(() => {
    if (props.visible) {
      setPlaying(true);
      service.getPlay('local', { deviceId: props.data.deviceId, channelId: props.data.channelId }).subscribe((res: any) => {
        if (res.length) {
          setUrl(res[0]['flv'])
          setProtocol('flv')
          setBloading(false);
          setUrlItem(res[0]);
        }
      });
    }
  }, [props.visible]);

  const play = (value: string) => {
    setUrl(urlItem[value])
    setProtocol(value)
  }

  const controlStart = (direct: string) => {
    setToolActive(direct || '')
    if (playing) {
      service.getControlStart('local', { deviceId: props.data.deviceId, channelId: props.data.channelId, direct: direct, speed: 90, stopDelaySeconds: 0 }).subscribe(() => {
      })
    }
  }
  const controlStop = () => {
    setToolActive('')
    if (playing) {
      service.getControlStop('local', { deviceId: props.data.deviceId, channelId: props.data.channelId }).subscribe(() => {
      })
    }
  }

  //刷新
  const refresh = () => {
    setBloading(true);
    //关闭流
    service.getStop('local', { deviceId: props.data.deviceId, channelId: props.data.channelId }).subscribe(() => {
      //开启流
      service.getPlay('local', { deviceId: props.data.deviceId, channelId: props.data.channelId }).subscribe((res: any) => {
        setUrl(res[0][protocol]);
        setProtocol(protocol);
        setBloading(false);
        setUrlItem(res[0]);
      });
    })
  }

  const toolMouseDown = (type: string) => {

  }

  return (
    <Modal
      visible={props.visible}
      width='50VW'
      title="视频播放"
      onCancel={props.close}
      onOk={props.save}
    >
      <div className={styles.player_box}>
        <div className={styles.player_box}>
          <div className={styles.player_left}>
            <div className={styles.video_box}>
              <live-player muted fluent loading={bloading} autoplay live protocol={protocol} video-url={url}></live-player>
              <div className={styles.video_lose} onClick={() => { refresh() }}>刷新</div>
            </div>
            <div className={styles.bottom}>
              <Radio.Group defaultValue="flv" buttonStyle="solid" onChange={(e) => {
                play(e.target.value)
              }}>
                {playerBtnGroup.length > 0 && playerBtnGroup.map((item, index) => (
                  <Radio.Button key={index} value={item.value} disabled={urlItem[item.value] === undefined}>{item.name}</Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>
          <div className={styles.player_right}>
            <div className={styles.circle}>
              {
                toolBtn.map(item => {
                  let type = item.type.toLocaleLowerCase()
                  return <div
                    className={`${styles.sx} ${toolActive === item.type ? styles.sx_active : ''}`}
                    onMouseDown={() => { controlStart(item.type) }}
                    onMouseUp={() => { controlStop() }}
                  >
                    <Icon type={`caret-${type}`} />
                  </div>
                })
              }
              <div className={`${styles.min_circle}`}>
                <Icon type="audio" theme="filled" />
              </div>
            </div>
            <div className={styles.zoom}>
              <div className={`${toolActive === 'ZOOM_IN' ? styles.zoom_active : ''}`} onMouseDown={() => { controlStart('ZOOM_IN') }} onMouseUp={() => { controlStop() }}>
                <Icon type="plus" />
              </div>
              <div className={`${toolActive === 'ZOOM_OUT' ? styles.zoom_active : ''}`} onMouseDown={() => { controlStart('ZOOM_OUT') }} onMouseUp={() => { controlStop() }}>
                <Icon type="minus" />
              </div>
            </div>
            {/* <div className={styles.ptz_block}>
              <div className={styles.ptz_up} title="上" onMouseDown={() => { controlStart('UP'); setPlayUp(false); }} onMouseUp={() => { controlStop(); setPlayUp(true); }}>
                {playing && playUp ? <img src="/img/up.svg" width="30px" /> : <img src="/img/up_1.svg" width="30px" />}
              </div>
              <div className={styles.ptz_left} title="左" onMouseDown={() => { controlStart('LEFT'); setPlayLeft(false); }} onMouseUp={() => { controlStop(); setPlayLeft(true); }}>
                {playing && playLeft ? <img src="/img/left.svg" width="30px" /> : <img src="/img/left_1.svg" width="30px" />}
              </div>
              <div className={styles.ptz_center} title="云控制台">
                {playing && playCenter ? <img src="/img/audio.svg" width="30px" /> : <img src="/img/audio_1.svg" width="30px" />}
              </div>
              <div className={styles.ptz_right} title="右" onMouseDown={() => { controlStart('RIGHT'); setPlayRight(false); }} onMouseUp={() => { controlStop(); setPlayRight(true); }}>
                {playing && playRight ? <img src="/img/right.svg" width="30px" /> : <img src="/img/right_1.svg" width="30px" />}
              </div>
              <div className={styles.ptz_down} title="下" onMouseDown={() => { controlStart('DOWN'); setPlayDown(false); }} onMouseUp={() => { controlStop(); setPlayDown(true); }}>
                {playing && playDown ? <img src="/img/down.svg" width="30px" /> : <img src="/img/down_1.svg" width="30px" />}
              </div>
              <div className={styles.ptz_zoomin} title="放大" onMouseDown={() => { controlStart('ZOOM_IN'); setPlayIn(false); }} onMouseUp={() => { controlStop(); setPlayIn(true); }}>
                {playing && playIn ? <img src="/img/add.svg" width="30px" /> : <img src="/img/add_1.svg" width="30px" />}
              </div>
              <div className={styles.ptz_zoomout} title="缩小" onMouseDown={() => { controlStart('ZOOM_OUT'); setPlayOut(false); }} onMouseUp={() => { controlStop(); setPlayOut(true); }}>
                {playing && playOut ? <img src="/img/sub.svg" width="30px" /> : <img src="/img/sub_1.svg" width="30px" />}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Modal>
  )
};
export default Play;