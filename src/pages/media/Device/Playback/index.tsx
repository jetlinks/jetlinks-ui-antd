// 回放
import { PageContainer } from '@ant-design/pro-layout';
import LivePlayer from '@/components/Player';
import { useCallback, useEffect, useState } from 'react';
import { Select, Calendar, Empty, List, Tooltip } from 'antd';
import { useLocation } from 'umi';
import Service from './service';
import './index.less';
import { recordsItemType } from '@/pages/media/Device/Playback/typings';
import * as moment from 'moment';
import type { Moment } from 'moment';
import classNames from 'classnames';
import {
  CloudDownloadOutlined,
  DownloadOutlined,
  EyeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import TimeLine from './timeLine';

const service = new Service('media');

export default () => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('local');
  const [historyList, setHistoryList] = useState<recordsItemType[]>([]);
  const [time, setTime] = useState<Moment | undefined>(undefined);
  const [playTime, setPlayTime] = useState(0);
  // const [loading, setLoading] = useState(false)
  const [cloudTime, setCloudTime] = useState<any>();
  const [playing, setPlaying] = useState(false);
  const location = useLocation();

  const param = new URLSearchParams(location.search);
  const deviceId = param.get('id');
  const channelId = param.get('channelId');

  const queryLocalRecords = async (date: Moment) => {
    setPlaying(false);
    setUrl('');
    if (deviceId && channelId && date) {
      const params = {
        startTime: date.format('YYYY-MM-DD 00:00:00'),
        endTime: date.format('YYYY-MM-DD 23:59:59'),
      };
      const list: recordsItemType[] = [];
      const localResp = await service.queryRecordLocal(deviceId, channelId, params);

      if (localResp.status === 200 && localResp.result.length) {
        const serviceResp = await service.recordsInServer(deviceId, channelId, {
          ...params,
          includeFiles: false,
        });
        if (serviceResp.status === 200 && serviceResp.result) {
          const newList = list.map((item) => {
            return {
              ...item,
              isServer: serviceResp.result.some(
                (serverFile: any) => serverFile.streamStartTime === item.startTime,
              ),
            };
          });
          setHistoryList(newList);
        } else {
          setHistoryList(list);
        }
      } else {
        setHistoryList([]);
      }
    }
  };

  const queryServiceRecords = async (date: Moment) => {
    setPlaying(false);
    setUrl('');
    if (deviceId && channelId && date) {
      const params = {
        startTime: date.format('YYYY-MM-DD 00:00:00'),
        endTime: date.format('YYYY-MM-DD 23:59:59'),
        includeFiles: true,
      };

      const resp = await service.recordsInServerFiles(deviceId, channelId, params);

      if (resp.status === 200) {
        setHistoryList(resp.result);
      }
    }
  };

  const downLoadCloud = useCallback(
    (item: recordsItemType) => {
      setHistoryList(
        historyList.map((historyItem) => {
          if (historyItem.startTime === item.startTime) {
            return {
              ...item,
              isServer: true,
            };
          }
          return item;
        }),
      );
    },
    [historyList],
  );

  const cloudView = useCallback((startTime: number, endTime: number) => {
    setType('cloud');
    setCloudTime({
      startTime,
      endTime,
    });
    queryServiceRecords(time!);
  }, []);

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

  const DownloadIcon = useCallback(
    (item: recordsItemType) => {
      let title = '下载到云端';
      let IconNode = (
        <a
          onClick={() => {
            downLoadCloud(item);
          }}
        >
          <CloudDownloadOutlined />
        </a>
      );
      if (type === 'local') {
        if (item.isServer) {
          title = '查看';
          IconNode = (
            <a
              onClick={() => {
                cloudView(item.startTime, item.endTime);
              }}
            >
              <EyeOutlined />
            </a>
          );
        }
      } else {
        title = '下载录像文件';
        IconNode = (
          <a
            onClick={() => {
              downloadClick(item);
            }}
            download
          >
            <DownloadOutlined />
          </a>
        );
      }

      return {
        title,
        IconNode,
      };
    },
    [type],
  );

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
            onPlay={() => {
              setPlaying(true);
            }}
            onPause={() => {
              setPlaying(false);
            }}
            onDestroy={() => {
              setPlaying(false);
            }}
            onError={() => {
              setPlaying(false);
            }}
          />
          <TimeLine
            type={type}
            data={historyList}
            dateTime={time}
            onChange={(times) => {
              if (times) {
                setPlayTime(Number(times.endTime.valueOf()));
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
            playing={playing}
            localToServer={cloudTime}
          />
        </div>
        <div className={'playback-right'}>
          <Select
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
          />
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
                  const startTime = moment(item.startTime || item.mediaStartTime).format(
                    'HH:mm:ss',
                  );
                  const endTime = moment(item.endTime || item.mediaEndTime).format('HH:mm:ss');
                  const downloadObj = DownloadIcon(item);
                  const timeId = item.endTime || item.mediaEndTime;

                  console.log(timeId, playTime);
                  return (
                    <List.Item
                      actions={[
                        <Tooltip
                          key="play-btn"
                          title={item.startTime === playTime ? '暂停' : '播放'}
                        >
                          <a
                            onClick={() => {
                              if (!playTime) {
                                setPlayTime(item.startTime);
                                if (item.filePath) {
                                  service.playbackStart(item.id);
                                } else if (deviceId && channelId) {
                                  setUrl(
                                    service.playbackLocal(
                                      deviceId,
                                      channelId,
                                      'mp4',
                                      moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
                                      moment(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
                                    ),
                                  );
                                }
                              } else {
                                setPlayTime(0);
                              }
                            }}
                          >
                            {timeId === playTime ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                          </a>
                        </Tooltip>,
                        <Tooltip key={'download'} title={downloadObj.title}>
                          {downloadObj.IconNode}
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
        </div>
      </div>
    </PageContainer>
  );
};
