import { message } from 'antd'
import moment, { Moment } from 'moment'
import React, { useEffect, useState } from 'react'
import styles from './index.less'
interface Props {
    play: (data: any) => void;
    data: any[];
    dateTime: Moment;
    type: 'server' | 'local',
    playing: boolean;
    server: any;
    localToServer: any | undefined;
    getPlayList: (data: any) => void;
}

const Progress = (props: Props) => {
    const [startT, setStartT] = useState<number>(new Date(moment(props.dateTime).startOf('day').format('YYYY-MM-DD HH:mm:ss')).getTime())
    const endT = new Date(moment(props.dateTime).endOf('day').format('YYYY-MM-DD HH:mm:ss')).getTime()
    const [list, setList] = useState<any[]>([])
    const [time, setTime] = useState<number>(startT)
    const setTimeAndPosition = (ob: number) => {
        const oBtn = document.getElementById('btn')
        const oTime = document.getElementById('time')
        if (oBtn && oTime) {
            oBtn.style.visibility = 'visible'
            oBtn.style.left = `${ob}px`
            oTime.style.visibility = 'visible'
            oTime.style.left = `${ob - 10}px`
        }
    }

    useEffect(() => {
        setStartT(new Date(moment(props.dateTime).startOf('day').format('YYYY-MM-DD HH:mm:ss')).getTime())
    }, [props.dateTime])

    useEffect(() => {
        if (props.data && Array.isArray(props.data) && props.data.length > 0) {
            setList([...props.data])
            if (props.type === 'local') {
                const params = {
                    start: props.data[0].startTime,
                    end: props.data[0].endTime
                }
                props.play(params)
                setTime(startT)
            } else if (props.type === 'server') {
                if(props.localToServer && Object.keys(props.localToServer).length > 0){
                    const list1 = props.data.filter((item) => {
                        return item.mediaEndTime <= props.localToServer.endTime && item.mediaStartTime >= props.localToServer.startTime
                    })
                    if(list1 && list1.length > 0){
                        props.getPlayList(list1)
                        props.play(list1[0])
                        setTime(list1[0].mediaStartTime)
                    } else {
                        props.play(undefined)
                        setTime(props.localToServer.startTime)
                        message.error('没有可播放的视频资源')
                    }
                } else {
                    setTime(props.data[0].mediaStartTime)
                    props.play(props.data[0])
                }
            }
        } else if(props.localToServer && Object.keys(props.localToServer).length > 0 && props.data.length === 0){
            props.play(undefined)
            message.error('没有可播放的视频资源')
            setTime(startT)
            setList([])
        }else {
            setTime(startT)
            setList([])
            props.play(undefined)
        }
    }, [props.data])

    useEffect(() => {
        if(props.server && Object.keys(props.server).length > 0){
            if(props.type === 'local'){
                setTime(props.server.startTime)
                props.play({ start: props.server.startTime, end: props.server.endTime })
            } else {
                setTime(props.server.mediaStartTime)
                props.play(props.server)
            }
        }
    }, [props.server])

    const getElementLeft = () => {
        const element = document.getElementById('wrapper')
        if (element) {
            let actualLeft = element.offsetLeft;
            let current = element.offsetParent;
            while (current !== null) {
                if (current) {
                    actualLeft += current?.offsetLeft;
                    current = current?.offsetParent;
                }
            }
            return actualLeft;
        }
        return 0
    }

    const listStyle = (startTime: number, endTime: number) => {
        const start = startTime - startT > 0 ? startTime - startT : 0
        return {
            position: 'absolute',
            top: 0,
            left: `${start / 3600000 / 24 * 800}px`,
            backgroundColor: 'green', height: '15px',
            width: `${(endTime - startTime) / 24 / 3600000 * 800}px`
        }
    }

    useEffect(() => {
        let timerId: any = null
        if (props.playing) {
            timerId = setInterval(() => {
                setTime((time) => time + 1000)
            }, 1000);
        }
        return () => timerId && clearInterval(timerId);
    }, [props.playing]);

    useEffect(() => {
        if (time >= startT && time <= endT) {
            setTimeAndPosition((time - startT) / 3600000 / 24 * 800)
        }
    }, [time])

    return (
        <div style={{ width: '100%', padding: '10px 0' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                {
                    (Array.from(Array(25), (v, k) => k)).map((item) => {
                        return <div key={item} className={styles.itemSize}>{item}</div>
                    })
                }
            </div>
            <div id="wrapper" style={{ position: 'relative', width: '100%' }}>
                <div style={{ width: '800px', backgroundColor: 'lightgray', height: '15px', position: 'relative', overflow: 'hidden' }}>
                    {
                        list.map((item, index) => {
                            if (props.type === 'local') {
                                return <div key={`${index}key`} 
                                onClick={(event) => {
                                    const dt = event.clientX - getElementLeft()
                                    const start = dt / 800 * 24 * 3600000 + startT
                                    setTime(start)
                                    props.play({ start, end: item.endTime })
                                }}
                                    style={listStyle(item.startTime, item.endTime)}
                                    >
                                </div>
                            }
                            return <div key={`${index}key`}
                                // onClick={(event) => {
                                //     const dt = event.clientX - getElementLeft()
                                //     const start = dt / 800 * 24 * 3600000 + startT
                                //     setTime(start)
                                //     props.play(item)
                                // }}
                                style={listStyle(item.mediaStartTime, item.mediaEndTime)}></div>
                        })
                    }
                </div>
                <div id="btn" className={styles.box}></div>
                <div id="time" className={styles.time}>{moment(time).format('HH:mm:ss')}</div>
            </div>
        </div>
    )
}
export default Progress
