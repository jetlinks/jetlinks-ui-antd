import React, { useEffect, useState } from "react";
import { Calendar, Card, Col, Modal, Radio, Row, Select } from "antd";
import Progress from './Progress'
import Service from '../../service'
import moment, { Moment } from "moment";

interface Props {
    data: any;
    close: Function,
    ok: Function
}

const Playback = (props: Props) => {
    const service = new Service('media/channel');
    // const [protocol, setProtocol] = useState('mp4');
    const [type, setType] = useState<'local' | 'server'>('local');
    const [url, setUrl] = useState('');
    const [bloading, setBloading] = useState(true);
    const [localVideoList, setLocalVideoList] = useState([])
    const [dateTime, setDateTime] = useState<Moment>(moment())
    const [playing, setPlaying] = useState<boolean>(false)
    const [filesList, setFilesList] = useState<any[]>([])
    const [radioValue, setRadioValue] = useState<string>("")
    // const [time, setTime] = useState<number>(new Date(moment(dateTime).startOf('day').format('YYYY-MM-DD HH:mm:ss')).getTime())
    const getLocalTime = (dateTime: Moment) => {
        service.getLocalVideoList(props.data.deviceId, props.data.channelId, {
            startTime: moment(dateTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(dateTime).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        }).subscribe(resp => {
            setLocalVideoList(resp)
        })
    }
    const getServerTime = (dateTime: Moment) => {
        service.getServerVideoList(props.data.deviceId, props.data.channelId, {
            startTime: moment(dateTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(dateTime).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            includeFiles: true
        }).subscribe(resp => {
            setLocalVideoList(resp)
            const list: any[] = []
            resp.map(item => {
                list.splice(0, 0, ...item.files)
            })
            setFilesList(list.reverse())
        })
    }

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    }

    const onRadioChange = (e: any) => {
        setRadioValue(e.target.value)
        setUrl(e.target.value)

    }

    useEffect(() => {
        getLocalTime(dateTime)
    }, []);

    const timeupdate = () => {
        setPlaying(true)
    }
    const endPlay = () => {
        setPlaying(false)
        if(type === 'server'){
            let index: number = filesList.findIndex(item => {
                return item.mp4 === url
            })
            index = index >= 0 && index + 1 < filesList.length ? index + 1 : 0
            setRadioValue(filesList[index]?.mp4)
            setUrl(filesList[index]?.mp4)
            // setTime(filesList[index]?.time)
        }
    }

    useEffect(() => {
        const player = document.getElementById('player')
        if(player && url !== ''){
            player.addEventListener('ended', endPlay)
            player.addEventListener('timeupdate', timeupdate)
        }
        return () => {
            player && player.removeEventListener('ended', endPlay)
            player && player.removeEventListener('timeupdate', timeupdate)
        }
    }, [url])

    return (
        <Modal
            visible
            width={1200}
            title="视频回放"
            onCancel={() => { props.close(); }}
            onOk={() => {
                props.ok();
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ width: 800, borderRadius: 4 }}>
                    <div style={{ width: '100%', height: '450px' }}>
                        <live-player live={true} id="player" muted fluent loading={bloading} autoplay={true} protocol={'mp4'} video-url={url}></live-player>
                        {/* <easy-player muted fluent loading={bloading} autoplay live protocol={protocol} video-url={url}></easy-player> */}
                    </div>
                    <Progress
                        type={type}
                        dateTime={dateTime}
                        data={localVideoList} 
                        playing={playing}
                        // time={time}
                        play={(data: any) => {
                            setBloading(false)
                            setPlaying(false)
                            if(data){
                                if(type === 'local'){
                                    // setTime(data.start)
                                    setUrl(`/jetlinks/media/device/${props.data.deviceId}/${props.data.channelId}/playback.mp4?:X_Access_Token=${localStorage.getItem('x-access-token')}&startTime=${moment(data.start).format('YYYY-MM-DD HH:mm:ss')}&endTime=${moment(data.end).format('YYYY-MM-DD HH:mm:ss')}&speed=1`)
                                } else {
                                    // setTime(data.start)
                                    const list = data.files.filter(item => {
                                        return data.start >= item.time
                                    })
                                    if(list && list.length > 0) {
                                        setRadioValue(list[list.length - 1]?.mp4)
                                        setUrl(list[list.length - 1]?.mp4)
                                    }
                                }
                            }
                    }} />
                </div>
                <div style={{ width: 250 }}>
                    <Select defaultValue={type} style={{ width: '100%', marginBottom: '30px' }} onChange={(value: 'local' | 'server') => {
                        setType(value)
                        setUrl('')
                        setPlaying(false)
                        setBloading(true)
                        if(value === 'server') {
                            getServerTime(dateTime)
                        }else {
                            getLocalTime(dateTime)
                        }
                    }}>
                        <Select.Option value="server">云端</Select.Option>
                        <Select.Option value="local">本地</Select.Option>
                    </Select>
                    <div style={{ width: 250, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                        <Calendar
                            fullscreen={false}
                            headerRender={({ value, type, onChange, onTypeChange }) => {
                                const start = 0;
                                const end = 12;
                                const monthOptions = [];

                                const current = value.clone();
                                const localeData = value.localeData();
                                const months = [];
                                for (let i = 0; i < 12; i++) {
                                    current.month(i);
                                    months.push(localeData.monthsShort(current));
                                }

                                for (let index = start; index < end; index++) {
                                    monthOptions.push(
                                        <Select.Option className="month-item" key={`${index}`}>
                                            {months[index]}
                                        </Select.Option>,
                                    );
                                }
                                const month = value.month();

                                const year = value.year();
                                const options = [];
                                for (let i = year - 10; i < year + 10; i += 1) {
                                    options.push(
                                        <Select.Option key={i} value={i} className="year-item">
                                            {i}
                                        </Select.Option>,
                                    );
                                }
                                return (
                                    <div style={{ padding: 10 }}>
                                        <Row type="flex" justify="space-between">
                                            <Col>
                                                <Select
                                                    size="small"
                                                    dropdownMatchSelectWidth={false}
                                                    className="my-year-select"
                                                    onChange={newYear => {
                                                        const now = value.clone().year(newYear);
                                                        onChange(now);
                                                    }}
                                                    value={String(year)}
                                                >
                                                    {options}
                                                </Select>
                                            </Col>
                                            <Col>
                                                <Select
                                                    size="small"
                                                    dropdownMatchSelectWidth={false}
                                                    value={String(month)}
                                                    onChange={selectedMonth => {
                                                        const newValue = value.clone();
                                                        newValue.month(parseInt(selectedMonth, 10));
                                                        onChange(newValue);
                                                    }}
                                                >
                                                    {monthOptions}
                                                </Select>
                                            </Col>
                                        </Row>
                                    </div>
                                );
                            }}
                            onChange={(date: Moment | undefined) => {
                                if(date){
                                    setUrl('')
                                    setPlaying(false)
                                    setBloading(true)
                                    setDateTime(date)
                                    if(type === 'server') {
                                        getServerTime(date)
                                    }else {
                                        getLocalTime(date)
                                    }
                                }
                            }}
                        />
                    </div>
                    {
                        type === 'server' && filesList.length > 0 && <Card style={{marginTop: '10px', maxHeight: 200, overflowY: 'auto', overflowX: 'hidden'}}>
                        <Radio.Group onChange={onRadioChange} value={radioValue}>
                            {
                                filesList.map(item => {
                                    return <Radio key={item.time} style={radioStyle} value={item.mp4}>{moment(item.time).format('HH:mm:ss')}</Radio>
                                })
                            }
                        </Radio.Group>
                    </Card>
                    }
                </div>
            </div>
        </Modal>
    )
}
export default Playback
