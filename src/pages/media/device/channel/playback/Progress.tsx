import moment, { Moment } from 'moment'
import React, { useEffect, useState } from 'react'
import styles from './index.less'
interface Props {
    play: (data: any) => void;
    data: any[];
    dateTime: Moment;
    type: 'server' | 'local',
    playing: boolean;
}

const Progress = (props: Props) => {
    const [startT, setStartT] = useState<number>(new Date(moment(props.dateTime).startOf('day').format('YYYY-MM-DD HH:mm:ss')).getTime())
    const [list, setList] = useState<any[]>([])
    const [time, setTime] = useState<number>(startT)
    const setTimeAndPosition = (ob: number) => {
        const oBtn = document.getElementById('btn')
        const oTime = document.getElementById('time')
        if(oBtn && oTime){
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
        if(props.data && Array.isArray(props.data) && props.data.length > 0){
            if (props.type === 'local') {
                setList([...props.data])
                props.play({
                    start: props.data[0].startTime,
                    end: props.data[0].endTime
                })
                setTime(startT)
            } else if (props.type === 'server') {
                setList([...props.data])
                props.play(props.data[0])
            }
        } else {
            setList([])
            props.play(undefined)
        }
    }, [props.data])

    const getElementLeft = () => {
        const element = document.getElementById('wrapper')
        if(element){
            let actualLeft = element.offsetLeft;
            let current = element.offsetParent;
            while (current !== null){       
                if(current){
                    actualLeft += current?.offsetLeft;
                    current = current?.offsetParent;
                }
            }
            return actualLeft;
        }
        return 0
    }

    const listStyle = (startTime: number, endTime: number) => {
        return { 
            position: 'absolute', 
            top: 0, 
            left: `${(startTime - startT) / 3600000 / 24 * 800}px`, 
            backgroundColor: 'green', height: '15px', 
            width: `${(endTime - startTime) / 24 / 3600000 * 800 }px` 
        }
    }

    useEffect(() => {
        let timerId: any = null
        if(props.playing) {
            timerId = setInterval(() => {
                setTime((time) => time + 1000)
            }, 1000);
        }
        return () => timerId && clearInterval(timerId);
      }, [props.playing]);

      useEffect(() => {
        setTimeAndPosition((time - startT) / 3600000 / 24 * 800)
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
                <div style={{ width: '800px', backgroundColor: 'lightgray', height: '15px' }}>
                    {
                        list.map((item, index) => {
                            if(props.type === 'local') {
                                return <div key={`${index}key`} onClick={(event) => {
                                    const dt = event.clientX  - getElementLeft()
                                    const start = dt / 800 * 24 * 3600000 + startT
                                    setTime(start)
                                    props.play({start, end: item.endTime})
                                    setTimeAndPosition(dt)
                                }}
                                style={listStyle(item.startTime, item.endTime)}>
                            </div>}
                            return <div key={`${index}key`} 
                            onClick={(event) => {
                                const dt = event.clientX  - getElementLeft()
                                const start = dt / 800 * 24 * 3600000 + startT
                                setTime(start)
                                setTimeAndPosition(dt)
                                props.play(item)
                            }} 
                            style={listStyle(item.mediaStartTime, item.mediaEndTime)}></div>
                    })}
                </div>
                <div id="btn" className={styles.box}></div>
                <div id="time" className={styles.time}>{moment(time).format('HH:mm:ss')}</div>
            </div>
        </div>
    )
}
export default Progress
