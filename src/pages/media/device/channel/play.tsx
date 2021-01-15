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
    const [players, setPlayers] = useState({
        url: "",//"http://mirror.aarnet.edu.au/pub/TED-talks/911Mothers_2010W-480p.mp4", http://192.168.3.113:8180/live/200008853.flv?deviceId=34020000001110000032&key=
        timer: 0,
        bCloseShow: false,
        closeTimer: 0,
        serial: "",
        code: "",
        protocol: "",
        bLoading: true,
        poster: "",
    });
    useEffect(() => {
        setPlaying(true);
        service.getPlay(props.data.deviceId, props.data.channelId).subscribe(res => {
            let data = players;
            data.url = res['hls'];
            data.protocol = 'hls';
            data.bLoading = false;
            setPlayers(data)
            setUrlItem(res);
        })
    }, []);

    const play = (value: string) => {
        let data = players;
        data.url = urlItem[value];
        data.protocol = value;
        setPlayers(data)
    }

    const controlStart = (direct: string) => {
        if(playing){
            service.getControlStart(props.data.deviceId, props.data.channelId, direct, 10).subscribe(res => {
                console.log('start')
                console.log(res)
            })
        }
    }
    const controlStop = () => {
        if(playing){
            service.getControlStop(props.data.deviceId, props.data.channelId).subscribe(res => {
                console.log('stop')
                console.log(res)
            })
        }
    }

    return (
        <Modal
            visible
            width='50VW'
            title="视频播放"
            onCancel={() => props.close()}
            onOk={() => {
                props.ok()
            }}
        >
            <div className={styles.player_box}>
                <div className={styles.player_left}>
                    <div className={styles.video_box}>
                        <live-player loading={players.bLoading} live protocol={players.protocol} video-url={players.url}></live-player>
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
                    <div className={styles.ptz_block}>
                        <div className={styles.ptz_up} title="上" onMouseDown={() => {controlStart('UP');}} onMouseUp={() => {controlStop();}}>
                            <UpOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_left} title="左" onMouseDown={() => {controlStart('LEFT');}} onMouseUp={() => {controlStop();}}>
                            <LeftOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_center} title="云控制台">
                            {/* <PlayCircleOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} /> */}
                            <AudioOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_right} title="右" onMouseDown={() => {controlStart('RIGHT');}} onMouseUp={() => {controlStop();}}>
                            <RightOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_down} title="下" onMouseDown={() => {controlStart('DOWN');}} onMouseUp={() => {controlStop();}}>
                            <DownOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_zoomin} title="放大" onMouseDown={() => {controlStart('ZOOM_IN');}} onMouseUp={() => {controlStop();}}>
                            <PlusOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                        <div className={styles.ptz_zoomout} title="缩小" onMouseDown={() => {controlStart('ZOOM_OUT');}} onMouseUp={() => {controlStop();}}>
                            <MinusOutlined style={{ fontSize: '30px', color: playing ? '#00000f5' : 'lightgray' }} />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
};
export default Play;