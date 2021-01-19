import React, { useEffect, useState } from "react";
import { Modal, Radio } from "antd";
import Service from '../service'
import { UpOutlined, LeftOutlined, AudioOutlined, RightOutlined, DownOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import styles from './play.less'


interface Props {
    data: any;
    close: Function,
    ok: Function
}

const Play = (props: Props) => {
    const service = new Service('media/channel');
    const [playing, setPlaying] = useState<boolean>(false);
    const playerBtnGroup = [{ name: 'FLV', value: "flv" }, { name: 'RTSP', value: "rtsp" }, { name: 'RTMP', value: "rtmp" }, { name: 'MP4', value: "mp4" }, { name: 'HLS', value: "hls" }, { name: 'RTC', value: "rtc" }];
    const [urlItem, setUrlItem] = useState({});
    const [url, setUrl] = useState('');
    const [bloading, setBloading] = useState(true);
    const [protocol, setProtocol] = useState('');
    const [node, setNode] = useState(null);
    useEffect(() => {
        // setPlaying(true);
        service.getPlay(props.data.deviceId, props.data.channelId).subscribe(res => {
            setUrl(res['flv'])
            setProtocol('flv')
            setBloading(false);
            setUrlItem(res);
        });
        // setUrl('http://192.168.3.113:8180/live/200009368.flv?deviceId=34020000001320000123&key=')
        // setProtocol('flv')
    }, []);

    const nodeHandle = (node) => {
        console.log(node)
    }

    const play = (value: string) => {
        setUrl(urlItem[value])
        setProtocol(value)
    }

    const _stop = () => {
        service.getStop(props.data.deviceId, props.data.channelId).subscribe(() => {
            // console.log(res)
        })
    }

    const controlStart = (direct: string) => {
        if (playing) {
            service.getControlStart(props.data.deviceId, props.data.channelId, direct, 10).subscribe(() => {
                // console.log('start')
                // console.log(res)
            })
        }
    }
    const controlStop = () => {
        if (playing) {
            service.getControlStop(props.data.deviceId, props.data.channelId).subscribe(() => {
                // console.log('stop')
                // console.log(res)
            })
        }  
    }

    return (
        <Modal
            visible
            width='50VW'
            title="视频播放"
            onCancel={() => {props.close(); _stop()}}
            onOk={() => {
                props.ok();
                _stop();
            }}
        >
            <div className={styles.player_box}>
                <div className={styles.player_left}>
                    <div className={styles.video_box}>
                        <live-player muted fluent loading={bloading} autoplay live protocol={protocol} video-url={url}></live-player>
                    </div>
                    <div className={styles.bottom}>
                        <Radio.Group defaultValue="flv" buttonStyle="solid" onChange={(e) => {
                            _stop();
                            play(e.target.value)
                        }}>
                            {playerBtnGroup.length > 0 && playerBtnGroup.map((item, index) => (
                                <Radio.Button key={index} value={item.value} disabled={urlItem[item.value] === undefined}>{item.name}</Radio.Button>
                            ))}
                        </Radio.Group>
                    </div>
                </div>
                <div className={styles.player_right}>
                    <div className={styles.ptz_block}>
                        <div className={styles.ptz_up} title="上" onMouseDown={() => { controlStart('UP'); }} onMouseUp={() => { controlStop(); }}>
                            <UpOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_left} title="左" onMouseDown={() => { controlStart('LEFT'); }} onMouseUp={() => { controlStop(); }}>
                            <LeftOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_center} title="云控制台">
                            <AudioOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_right} title="右" onMouseDown={() => { controlStart('RIGHT'); }} onMouseUp={() => { controlStop(); }}>
                            <RightOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_down} title="下" onMouseDown={() => { controlStart('DOWN'); }} onMouseUp={() => { controlStop(); }}>
                            <DownOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_zoomin} title="放大" onMouseDown={() => { controlStart('ZOOM_IN'); }} onMouseUp={() => { controlStop(); }}>
                            <PlusOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_zoomout} title="缩小" onMouseDown={() => { controlStart('ZOOM_OUT'); }} onMouseUp={() => { controlStop(); }}>
                            <MinusOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
};
export default Play;