import React, { useEffect, useState } from "react";
import { Calendar, Card, Col, Icon, List, message, Modal, Row, Select, Spin, Tooltip } from "antd";
import Progress from './Progress'
import Service from '../../service'
import moment, { Moment } from "moment";
import _ from "lodash";

interface Props {
    data: any;
    close: Function,
    ok: Function
}

const Playback = (props: Props) => {
    const service = new Service('media/channel');
    const player = document.getElementById('player')
    const token = localStorage.getItem('x-access-token');
    const [spinning, setSpinning] = useState<boolean>(true);
    const [type, setType] = useState<'local' | 'server'>('local');
    const [url, setUrl] = useState('');
    const [bloading, setBloading] = useState(true);
    const [localVideoList, setLocalVideoList] = useState([]);
    const [dateTime, setDateTime] = useState<Moment>(moment());
    const [playing, setPlaying] = useState<boolean>(false);
    const [filesList, setFilesList] = useState<any>({});
    const [server, setServer] = useState<any>({})
    const [localToServer, setLocalToServer] = useState<any>(undefined)
    const [playList, setPlayList] = useState<string[]>([]);
    const [playData, setPlayData] = useState<string | number>('')
    const [flag, setFlag] = useState<any>({})

    const getLocalTime = (dateTime: Moment) => {
        setSpinning(true)
        const start = moment(dateTime).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        const end = moment(dateTime).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        service.getLocalVideoList(props.data.deviceId, props.data.channelId, {
            startTime: start,
            endTime: end
        }).subscribe(resp => {
            setSpinning(false)
            if (resp.status === 200) {
                setLocalVideoList(resp.result)
                service.getAlreadyServerVideoList(props.data.deviceId, props.data.channelId, {
                    startTime: start,
                    endTime: end,
                    includeFiles: false
                }).subscribe(response => {
                    if (response.status === 200) {
                        const list = {}
                        const i = {}
                        resp.result.forEach((item: any) => {
                            list[item.startTime] = response.result.find((i: any) => item.startTime <= i.streamStartTime && item.endTime >= i.streamEndTime)
                            i[item.startTime] = false
                        })
                        setFilesList({ ...list })
                        setFlag(i)
                    }
                })
            }
        })
    }
    const getServerTime = (dateTime: Moment) => {
        setSpinning(true)
        service.getServerVideoList(props.data.deviceId, props.data.channelId, {
            startTime: moment(dateTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(dateTime).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            includeFiles: true
        }).subscribe(resp => {
            setSpinning(false)
            if (resp.status === 200) {
                setLocalVideoList(resp.result)
                const i = {}
                resp.result.forEach((item: any) => {
                    i[item.startTime] = false
                })
                setFlag(i)
            }
        })
    }

    useEffect(() => {
        getLocalTime(dateTime)
    }, []);

    const listStyle = (item: any) => {
        if ((type === 'local' && playList.includes(item.startTime)) || (type === 'server' && playList.includes(item.id))) {
            return 'yellow'
        }
        return 'white'
    }

    const timeupdate = () => {
        setPlaying(true)
    }
    const endPlay = () => {
        setPlaying(false)
    }

    useEffect(() => {
        if(player){
            if (player && url !== '') {
                player.addEventListener('ended', endPlay)
                player.addEventListener('timeupdate', timeupdate)
                player.addEventListener('pause', () => {
                    flag[playData] = true
                    setFlag({...flag})
                    setPlaying(false)
                })
                player.addEventListener('play', () => {
                    flag[playData] = false
                    setFlag({...flag})
                    setPlaying(true)
                })
            }
            return () => {
                player && player.removeEventListener('ended', endPlay)
                player && player.removeEventListener('timeupdate', timeupdate)
            }
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
                        <live-player live={type === 'local'} id="player" muted fluent loading={bloading} autoplay={true} protocol={'mp4'} video-url={url}></live-player>
                        {/* <easy-player muted fluent loading={bloading} autoplay live protocol={protocol} video-url={url}></easy-player> */}
                    </div>
                    <Progress
                        type={type}
                        dateTime={dateTime}
                        data={localVideoList}
                        playing={playing}
                        server={server}
                        localToServer={localToServer}
                        getPlayList={(list: any) => {
                            setPlayList(_.map(list, 'id'))
                        }}
                        play={(data: any) => {
                            setBloading(false)
                            setPlaying(false)
                            if (data) {
                                if (type === 'local') {
                                    setPlayData(data.start)
                                    setUrl(`/jetlinks/media/device/${props.data.deviceId}/${props.data.channelId}/playback.mp4?:X_Access_Token=${token}&startTime=${moment(data.start).format('YYYY-MM-DD HH:mm:ss')}&endTime=${moment(data.end).format('YYYY-MM-DD HH:mm:ss')}&speed=1`)
                                } else {
                                    setPlayData(data.id)
                                    setUrl(`/jetlinks/media/record/${data.id}.mp4?:X_Access_Token=${token}`)
                                }
                            }
                        }} />
                </div>
                <div style={{ width: 250 }}>
                    <Spin spinning={spinning}>
                        <Select value={type} style={{ width: '100%', marginBottom: '30px' }} onChange={(value: 'local' | 'server') => {
                            setType(value)
                            setUrl('')
                            setPlaying(false)
                            setBloading(true)
                            if (value === 'server') {
                                getServerTime(dateTime)
                            } else {
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
                                    if (date) {
                                        setUrl('')
                                        setPlaying(false)
                                        setBloading(true)
                                        setDateTime(date)
                                        if (type === 'server') {
                                            setLocalToServer(undefined)
                                            getServerTime(date)
                                        } else {
                                            getLocalTime(date)
                                        }
                                    }
                                }}
                            />
                        </div>
                        <Card style={{ marginTop: '10px', maxHeight: 200, overflowY: 'auto', overflowX: 'hidden' }}>
                            <List
                                size="small"
                                bordered={false}
                                split={false}
                                dataSource={localVideoList}
                                renderItem={(item: any) => <List.Item>
                                    <List.Item.Meta title={<span style={{ background: listStyle(item) }}>
                                        {
                                            type === 'server' ?
                                                `${moment(item.mediaStartTime).format('HH:mm:ss')} ～ ${moment(item.mediaEndTime).format('HH:mm:ss')}` :
                                                `${moment(item.startTime).format('HH:mm:ss')} ～ ${moment(item.endTime).format('HH:mm:ss')}`

                                        }
                                    </span>} />
                                    <div>
                                        {
                                            ((type === 'local' && flag[item.startTime]) || (type === 'server' && flag[item.id])) ? <a style={{ marginRight: '8px' }} onClick={() => {
                                                if(player){
                                                    if(type === 'local'){
                                                        flag[item.startTime] = false
                                                    } else {
                                                        flag[item.id] = false
                                                    }
                                                    setFlag({...flag})
                                                    player.getVueInstance().play()
                                                }
                                            }}><Tooltip title="播放"><Icon type="play-circle" /></Tooltip></a> : (((type === 'local' && playData === item.startTime) || (type === 'server' && playData === item.id)) ? <a style={{ marginRight: '8px' }} onClick={() => {
                                                if(player){
                                                    if(type === 'local'){
                                                        flag[item.startTime] = true
                                                    } else {
                                                        flag[item.id] = true
                                                    }
                                                    setFlag({...flag})
                                                    player.getVueInstance().pause()
                                                }
                                            }}><Tooltip title="暂停"><Icon type="pause-circle" /></Tooltip></a> : <a style={{ marginRight: '8px' }} onClick={() => {
                                                setServer(item)
                                                setLocalToServer(undefined)
                                            }}><Tooltip title="播放"><Icon type="play-circle" /></Tooltip></a>)
                                        }
                                        
                                        <a onClick={() => {
                                            if (type === 'local') { // 查看
                                                if (filesList[item.startTime]) {
                                                    setLocalToServer(item)
                                                    setUrl('')
                                                    setPlaying(false)
                                                    setBloading(true)
                                                    getServerTime(dateTime)
                                                    setType('server')
                                                } else {
                                                    service.startVideo(props.data.deviceId, props.data.channelId, {
                                                        local: false,
                                                        startTime: item.startTime,
                                                        endTime: item.endTime,
                                                        downloadSpeed: 4
                                                    }).subscribe(resp => {
                                                        if (resp.status === 200) {
                                                            message.success('操作成功')
                                                            filesList[item.startTime] = {}
                                                            setFilesList({ ...filesList })
                                                        }
                                                    })
                                                }
                                            } else {
                                                const formElement = document.createElement('form');
                                                formElement.style.display = 'display:none;';
                                                formElement.method = 'get';
                                                formElement.action = `/jetlinks/media/record/${item.id}.mp4?:X_Access_Token=${token}&download=true`;
                                                const params = {
                                                    download: true,
                                                    ':X_Access_Token': token
                                                }
                                                Object.keys(params).forEach((key: string) => {
                                                    const inputElement = document.createElement('input');
                                                    inputElement.type = 'hidden';
                                                    inputElement.name = key;
                                                    inputElement.value = params[key];
                                                    formElement.appendChild(inputElement);
                                                });
                                                document.body.appendChild(formElement);
                                                formElement.submit();
                                                document.body.removeChild(formElement);
                                            }
                                        }}>{type === 'server' ? <Tooltip title="下载录像文件"><Icon type="download" /></Tooltip>
                                            : (!!filesList[item.startTime] ? <Tooltip title="查看"><Icon type="eye" /></Tooltip> : <Tooltip title="下载到云端"><Icon type="cloud-download" /></Tooltip>)}</a></div>
                                </List.Item>}
                            />
                        </Card>
                    </Spin>
                </div>
            </div>
        </Modal>
    )
}
export default Playback
