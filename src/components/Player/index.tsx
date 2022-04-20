import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { isFunction } from 'lodash';

export type PlayerProps = {
  url?: string;
  live?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  poster?: string;
  timeout?: number;
  className?: string;
  updateTime?: number;
  key?: string | number;
  loading?: boolean;
  onDestroy?: () => void;
  onMessage?: (msg: any) => void;
  onError?: (err: any) => void;
  onTimeUpdate?: (time: any) => void;
  onPause?: () => void;
  onPlay?: () => void;
  protocol?: 'mp4' | 'flv' | 'hls';
  onFullscreen?: () => void;
  onSnapOutside?: (base64: any) => void;
  onSnapInside?: (base64: any) => void;
  onCustomButtons?: (name: any) => void;
  onClick?: () => void;
};

const EventsEnum = {
  fullscreen: 'onFullscreen',
  message: 'onMessage',
  error: 'onError',
  timeupdate: 'onTimeUpdate',
  pause: 'onPause',
  play: 'onPlay',
  snapOutside: 'onSnapOutside',
  snapInside: 'onSnapInside',
  customButtons: 'onCustomButtons',
};
const LivePlayer = forwardRef((props: PlayerProps, ref) => {
  const player = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      // 销毁播放器
      if ('onDestroy' in props && isFunction(props.onDestroy)) {
        props.onDestroy();
      }
    };
  }, []);

  /**
   * 事件初始化
   */
  const EventInit = () => {
    for (const key in EventsEnum) {
      player.current?.addEventListener(key, () => {
        if (EventsEnum[key] in props) {
          props[EventsEnum[key]]();
        }
      });
    }
  };

  useImperativeHandle(ref, () => ({
    ...player.current,
  }));

  return (
    // @ts-ignore: Unreachable code error
    <live-player
      ref={(r: any) => {
        // @ts-ignore
        player.current = r;
        EventInit();
      }}
      fluent
      protocol={props.protocol || 'mp4'}
      class={props.className}
      loading={props.loading}
      live={'live' in props ? props.live !== false : true}
      autoplay={'autoplay' in props ? props.autoplay !== false : true}
      muted={'muted' in props ? props.muted !== false : true}
      hide-big-play-button={true}
      poster={props.poster || ''}
      timeout={props.timeout || 20}
      video-url={props.url || ''}
    />
  );
});

export default LivePlayer;
