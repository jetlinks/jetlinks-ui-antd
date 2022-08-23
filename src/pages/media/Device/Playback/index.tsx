// 回放
import { PageContainer } from '@ant-design/pro-layout';
import LivePlayer from '@/components/Player';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar, Empty, List, Spin, Tooltip } from 'antd';
import { useLocation } from 'umi';
import Service from './service';
import './index.less';
import { recordsItemType } from '@/pages/media/Device/Playback/typings';
import type { Moment } from 'moment';
import * as moment from 'moment';
import classNames from 'classnames';
import {
  CloudDownloadOutlined,
  DownloadOutlined,
  EyeOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import TimeLine from './timeLine';
import { RadioCard } from '@/components';
import { onlyMessage } from '@/utils/util';

const service = new Service('media');

interface IconNodeType {
  type: string;
  item: recordsItemType;
  onCloudView: (startTime: number, endTime: number) => void;
  onDownLoad: () => void;
}

const IconNode = (props: IconNodeType) => {
  const [status, setStatus] = useState(props.item?.isServer ? 2 : 0); // type 为local时有效，0：未下载； 1：下载中：2：已下载

  const getLocalIcon = (s: number) => {
    if (s === 0) {
      return <CloudDownloadOutlined />;
    } else if (s === 2) {
      return <EyeOutlined />;
    } else {
      return <LoadingOutlined />;
    }
  };

  const Icon = props.type === 'local' ? getLocalIcon(status) : <DownloadOutlined />;

  const downLoadCloud = (item: recordsItemType) => {
    setStatus(1);
    service
      .downloadRecord(item.deviceId, item.channelId, {
        local: false,
        downloadSpeed: 4,
        startTime: item.startTime,
        endTime: item.endTime,
      })
      .then((res) => {
        if (res.status === 200) {
          onlyMessage('操作成功。上传云端需要一定时间，请稍后查看云端数据');
        }
        setStatus(res.status === 200 ? 2 : 0);
      });
  };
  return (
    <a
      onClick={() => {
        console.log(props, status);
        if (props.type === 'local') {
          if (status === 2) {
            // 已下载，进行跳转
            props.onCloudView(props.item.startTime, props.item.endTime);
          } else if (status === 0) {
            // 未下载 进行下载
            downLoadCloud(props.item);
          }
        } else {
          props.onDownLoad();
        }
      }}
    >
      {Icon}
    </a>
  );
};

export default () => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('local');
  const [historyList, setHistoryList] = useState<recordsItemType[]>([]);
  const [time, setTime] = useState<Moment | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [cloudTime, setCloudTime] = useState<any>();
  const location = useLocation();
  const player = useRef<any>();
  const [playStatus, setPlayStatus] = useState(0); // 播放状态, 0 停止， 1 播放， 2 暂停, 3 播放完成
  const [playTime, setPlayTime] = useState(0);

  const playNowTime = useRef<number>(0); // 当前播放视频标识
  const playTimeNode = useRef<any>(null);
  const isEnded = useRef(false); // 是否结束播放
  const param = new URLSearchParams(location.search);
  const deviceId = param.get('id');
  const channelId = param.get('channelId');

  const queryLocalRecords = async (date: Moment) => {
    setPlayStatus(0);
    setUrl('');
    if (deviceId && channelId && date) {
      setLoading(true);
      const params = {
        startTime: date.format('YYYY-MM-DD 00:00:00'),
        endTime: date.format('YYYY-MM-DD 23:59:59'),
      };
      const localResp = await service.queryRecordLocal(deviceId, channelId, params);
      if (localResp.status === 200 && localResp.result.length) {
        const serviceResp = await service.recordsInServer(deviceId, channelId, {
          ...params,
          includeFiles: false,
        });
        setLoading(false);
        let newList: recordsItemType[] = serviceResp.result;
        // console.log(newList)

        if (serviceResp.status === 200 && serviceResp.result) {
          // 判断是否已下载云端视频
          newList = localResp.result.map((item: recordsItemType) => {
            return {
              ...item,
              isServer: serviceResp.result.length
                ? serviceResp.result.some(
                    (serverFile: any) =>
                      item.startTime <= serverFile.streamStartTime &&
                      serverFile.streamEndTime <= item.endTime,
                  )
                : false,
            };
          });
          setHistoryList(newList);
        } else {
          setHistoryList(newList);
        }
      } else {
        setLoading(false);
        setHistoryList([]);
      }
    }
  };

  /**
   * 查询云端视频
   * @param date
   */
  const queryServiceRecords = useCallback(
    async (date: Moment) => {
      setPlayStatus(0);
      setUrl('');
      if (deviceId && channelId && date) {
        setLoading(true);
        const params = {
          startTime: date.format('YYYY-MM-DD 00:00:00'),
          endTime: date.format('YYYY-MM-DD 23:59:59'),
          includeFiles: true,
        };

        const resp = await service.recordsInServerFiles(deviceId, channelId, params);
        setLoading(false);
        if (resp.status === 200) {
          setHistoryList(resp.result);
        }
      }
    },
    [deviceId, channelId],
  );

  const cloudView = useCallback(
    (startTime: number, endTime: number) => {
      setType('cloud');
      setCloudTime({
        startTime,
        endTime,
      });
      queryServiceRecords(time!);
    },
    [time],
  );

  const downloadClick = async (item: recordsItemType) => {
    const downloadUrl = service.downLoadFile(item.id);
    const downNode = document.createElement('a');
    downNode.href = downloadUrl;
    downNode.download = `${channelId}-${moment(item.startTime).format('YYYY-MM-DD-HH-mm-ss')}.mp4`;
    downNode.style.display = 'none';
    document.body.appendChild(downNode);
    downNode.click();
    document.body.removeChild(downNode);
  };

  useEffect(() => {
    setTime(moment(new Date()));
    queryLocalRecords(moment(new Date()));
  }, []);

  return (
    <PageContainer>
      <div className={'playback-warp'}>
        <div className={'playback-left'}>
          <LivePlayer
            url={url}
            className={'playback-media'}
            live={type === 'local'}
            ref={player}
            onPlay={() => {
              isEnded.current = false;
              setPlayStatus(1);
            }}
            onPause={() => {
              setPlayStatus(2);
            }}
            onEnded={() => {
              setPlayStatus(0);
              if (playTimeNode.current && !isEnded.current) {
                isEnded.current = true;
                playTimeNode.current.onNextPlay();
              }
            }}
            onError={() => {
              setPlayStatus(0);
            }}
            onTimeUpdate={(e) => {
              setPlayTime(parseInt(e.detail[0]));
            }}
          />
          <TimeLine
            ref={playTimeNode}
            type={type}
            data={historyList}
            dateTime={time}
            onChange={(times) => {
              if (times) {
                playNowTime.current = Number(times.startTime.valueOf());
                setPlayTime(0);
                setUrl(
                  type === 'local'
                    ? service.playbackLocal(
                        times.deviceId,
                        times.channelId,
                        'mp4',
                        moment(times.startTime).format('YYYY-MM-DD HH:mm:ss'),
                        moment(times.endTime).format('YYYY-MM-DD HH:mm:ss'),
                      )
                    : service.playbackStart(times.deviceId),
                );
              } else {
                setUrl('');
              }
            }}
            playStatus={playStatus}
            playTime={playNowTime.current + playTime * 1000}
            localToServer={cloudTime}
          />
        </div>
        <div className={'playback-right'}>
          <Spin spinning={loading}>
            <Tooltip
              // title={<>云端：存储在服务器中 本地：存储在设备本地</>}
              title={
                <>
                  <div>云端：存储在服务器中</div>
                  <div>本地：存储在设备本地</div>
                </>
              }
              placement="topLeft"
            >
              <div>
                类型: <QuestionCircleOutlined />
              </div>
            </Tooltip>
            <RadioCard
              model={'singular'}
              value={type}
              itemStyle={{ minWidth: 0, width: '100%' }}
              onSelect={(key: string) => {
                setType(key);
                if (key === 'cloud') {
                  queryServiceRecords(time!);
                } else {
                  queryLocalRecords(time!);
                }
              }}
              options={[
                {
                  label: '云端',
                  value: 'cloud',
                  imgUrl: require('/public/images/media/cloud.png'),
                },
                {
                  label: '本地',
                  value: 'local',
                  imgUrl: require('/public/images/local.png'),
                },
              ]}
            />
            {/* <Select
            value={type}
            options={[
              { label: '云端', value: 'cloud' },
              { label: '本地', value: 'local' },
            ]}
            style={{ width: '100%' }}
            onSelect={(key: string) => {
              setType(key);
              if (key === 'cloud') {
                queryServiceRecords(time!);
              } else {
                queryLocalRecords(time!);
              }
            }}
          /> */}
            <div className={'playback-calendar'}>
              <Calendar
                value={time}
                onChange={(date) => {
                  setTime(date);
                  if (type === 'cloud') {
                    queryServiceRecords(date);
                  } else {
                    queryLocalRecords(date);
                  }
                }}
                disabledDate={(currentDate) => currentDate > moment(new Date())}
                fullscreen={false}
              />
            </div>
            <div className={classNames('playback-list', { 'no-list': !historyList.length })}>
              {historyList && historyList.length ? (
                <List
                  className={'playback-list-items'}
                  itemLayout="horizontal"
                  dataSource={historyList}
                  renderItem={(item) => {
                    const _startTime = item.startTime || item.mediaStartTime;
                    const startTime = moment(item.startTime || item.mediaStartTime).format(
                      'HH:mm:ss',
                    );
                    const endTime = moment(item.endTime || item.mediaEndTime).format('HH:mm:ss');
                    let title = '下载到云端';

                    if (type === 'local') {
                      if (item.isServer) {
                        title = '查看';
                      }
                    } else {
                      title = '下载录像文件';
                    }
                    return (
                      <List.Item
                        actions={[
                          <Tooltip
                            key="play-btn"
                            title={
                              _startTime === playNowTime.current && playStatus === 1
                                ? '暂停'
                                : '播放'
                            }
                          >
                            <a
                              onClick={() => {
                                if (playStatus === 0 || _startTime !== playNowTime.current) {
                                  if (playTimeNode.current) {
                                    playTimeNode.current.playByStartTime(_startTime);
                                  }
                                } else if (playStatus == 1 && _startTime === playNowTime.current) {
                                  if (player.current.getVueInstance) {
                                    player.current.getVueInstance().pause();
                                  }
                                } else if (playStatus == 2 && _startTime === playNowTime.current) {
                                  if (player.current.getVueInstance) {
                                    player.current.getVueInstance().play();
                                  }
                                }
                              }}
                            >
                              {_startTime === playNowTime.current && playStatus === 1 ? (
                                <PauseCircleOutlined />
                              ) : (
                                <PlayCircleOutlined />
                              )}
                            </a>
                          </Tooltip>,

                          <Tooltip key={'download'} title={title}>
                            <IconNode
                              type={type}
                              item={item}
                              onCloudView={cloudView}
                              onDownLoad={() => {
                                downloadClick(item);
                              }}
                            />
                          </Tooltip>,
                        ]}
                      >
                        <div style={{ textAlign: 'center', paddingLeft: 10 }}>
                          {`${startTime}`} ~ {`${endTime}`}
                        </div>
                      </List.Item>
                    );
                  }}
                >
                  <div></div>
                </List>
              ) : (
                <Empty />
              )}
            </div>
          </Spin>
        </div>
      </div>
    </PageContainer>
  );
};
