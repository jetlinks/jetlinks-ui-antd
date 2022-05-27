import { message } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import './index.less';
import { recordsItemType } from '@/pages/media/Device/Playback/typings';
import { useSize } from 'ahooks';
import classNames from 'classnames';

export type TimeChangeType = {
  endTime: Moment;
  startTime: Moment;
  deviceId: string;
  channelId: string;
};

interface Props {
  onChange: (times: TimeChangeType | undefined) => void;
  data: recordsItemType[];
  dateTime?: Moment;
  type: string;
  playStatus: number;
  playTime: number;
  server?: any;
  localToServer?: {
    endTime: number;
    startTime: number;
  };
  getPlayList?: (data: any) => void;
}

const Progress = forwardRef((props: Props, ref) => {
  const [startT, setStartT] = useState<number>(
    new Date(moment(props.dateTime).startOf('day').format('YYYY-MM-DD HH:mm:ss')).getTime(),
  ); // 获取选中当天开始时间戳
  const endT = new Date(
    moment(props.dateTime).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ).getTime(); // 获取选中当天结束时间戳

  const [list, setList] = useState<any[]>([]);
  const [playTime, setPlayTime] = useState<number>(0);

  const LineContent = useRef<HTMLDivElement>(null);
  const LineContentSize = useSize(LineContent);

  const setTimeAndPosition = (ob: number) => {
    const oBtn = document.getElementById('btn');
    const oTime = document.getElementById('time');

    if (oBtn && oTime && LineContentSize.width) {
      oBtn.style.visibility = 'visible';
      oBtn.style.left = `${ob * LineContentSize.width}px`;
      oTime.style.visibility = 'visible';
      oTime.style.left = `${ob * LineContentSize.width - 15}px`;
    }
  };

  useEffect(() => {
    setStartT(
      new Date(moment(props.dateTime).startOf('day').format('YYYY-MM-DD HH:mm:ss')).getTime(),
    );
  }, [props.dateTime]);

  const onChange = (startTime: number, endTime: number, deviceId: string, channelId: string) => {
    setPlayTime(startTime);
    props.onChange({
      startTime: moment(startTime),
      endTime: moment(endTime),
      deviceId,
      channelId,
    });
  };

  const playByStartTime = useCallback(
    (time) => {
      const playNow = props.data.find((item) => {
        const startTime = item.startTime || item.mediaStartTime;
        return startTime === time;
      });

      if (playNow) {
        const startTime = playNow.startTime || playNow.mediaStartTime;
        const endTime = playNow.endTime || playNow.mediaEndTime;
        const deviceId = props.type === 'local' ? playNow.deviceId : playNow.id;
        onChange(startTime, endTime, deviceId, playNow.channelId);
      }
    },
    [props.type, props.data],
  );

  const onNextPlay = useCallback(() => {
    if (playTime) {
      // 查找下一个视频
      const nowIndex = props.data.findIndex((item) => {
        const startTime = item.startTime || item.mediaStartTime;
        return startTime === playTime;
      });
      // 是否为最后一个
      if (nowIndex !== props.data.length - 1) {
        const nextPlay = props.data[nowIndex + 1];
        const startTime = nextPlay.startTime || nextPlay.mediaStartTime;
        const endTime = nextPlay.endTime || nextPlay.mediaEndTime;
        const deviceId = props.type === 'local' ? nextPlay.deviceId : nextPlay.id;
        onChange(startTime, endTime, deviceId, nextPlay.channelId);
      }
    }
  }, [props.type, playTime, props.data]);

  useEffect(() => {
    const { data, localToServer, type } = props;
    if (data && Array.isArray(data) && data.length > 0) {
      setList([...data]);
      if (type === 'local') {
        // 播放第一个
        onChange(data[0].startTime, data[0].endTime, data[0].deviceId, data[0].channelId);
      } else if (type === 'cloud') {
        // 是否从本地跳转到云端播放
        if (localToServer && Object.keys(localToServer).length > 0) {
          // 获取跳转播放段
          const playItem = data.find((item) => {
            return (
              item.mediaEndTime <= localToServer.endTime &&
              item.mediaStartTime >= localToServer.startTime
            );
          });
          if (playItem) {
            //播放片段
            onChange(
              playItem.mediaStartTime,
              playItem.mediaEndTime,
              playItem.id,
              playItem.channelId,
            );
          } else {
            props.onChange(undefined);
            message.error('没有可播放的视频资源');
          }
        } else {
          onChange(data[0].mediaStartTime, data[0].mediaEndTime, data[0].id, data[0].channelId);
        }
      }
    } else if (localToServer && localToServer.startTime) {
      // 本地跳转云端但是无资源
      props.onChange(undefined);
      message.error('没有可播放的视频资源');
      setList([]);
    } else {
      // 啥都没有
      setList([]);
      props.onChange(undefined);
    }
  }, [props.data]);

  const getLineItemStyle = (
    startTime: number,
    endTime: number,
  ): { left: string; width: string } => {
    const start = startTime - startT > 0 ? startTime - startT : 0;
    const _width = LineContentSize.width!;
    const itemWidth = ((endTime - startTime) / (24 * 3600000)) * _width;
    return {
      left: `${(start / (24 * 3600000)) * _width}px`,
      width: `${itemWidth < 1 ? 1 : itemWidth}px`,
    };
  };

  useEffect(() => {
    if (
      props.playTime &&
      props.playTime >= startT &&
      props.playTime <= endT &&
      props.data &&
      props.data.length
    ) {
      setTimeAndPosition((props.playTime - startT) / 3600000 / 24);
    }
  }, [props.playTime, startT]);

  useImperativeHandle(ref, () => ({
    onNextPlay,
    playByStartTime,
  }));

  return (
    <div className={'time-line-warp'}>
      <div className={'time-line-clock'}>
        {Array.from(Array(25), (v, k) => k).map((item) => {
          return (
            <div key={item} style={{ width: 12 }}>
              {item}
            </div>
          );
        })}
      </div>
      <div className={'time-line-content'} ref={LineContent}>
        <div className={'time-line-progress'}>
          {list.map((item, index) => {
            const { left, width } = getLineItemStyle(
              item.startTime || item.mediaStartTime,
              item.endTime || item.mediaEndTime,
            );

            return (
              <div
                key={`time_${index}`}
                onClick={(event) => {
                  const pos = LineContent.current?.getBoundingClientRect();
                  if (pos && item.endTime) {
                    const dt = event.clientX - pos.x;
                    const start = (dt / pos.width) * 24 * 3600000 + startT;
                    const _start = start < item.startTime ? item.startTime : start;
                    onChange(_start, item.endTime, item.deviceId, item.channelId);
                  }
                }}
                style={{ left, width }}
              ></div>
            );
          })}
        </div>
        <div id="btn" className={classNames('time-line-btn')}></div>
        <div id="time" className={classNames('time-line')}>
          {moment(props.playTime || 0).format('HH:mm:ss')}
        </div>
      </div>
    </div>
  );
});
export default Progress;
