import { useEffect, useRef } from 'react';
import { isFunction } from 'lodash';

export type PlayerProps = {
  url?: string;
  live?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  poster?: string;
  timeout?: number;
  onDestroy?: () => void;
  onMessage?: (msg: any) => void;
  onError?: (err: any) => void;
  onTimeUpdate?: (time: any) => void;
  onPause?: () => void;
  onPlay?: () => void;
  onFullscreen?: () => void;
  onSnapOutside?: (base64: any) => void;
  onSnapInside?: (base64: any) => void;
  onCustomButtons?: (name: any) => void;
};

export default (props: PlayerProps) => {
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
    player.current?.addEventListener('fullscreen', () => {
      if (props.onFullscreen) {
        props.onFullscreen();
      }
    });

    player.current?.addEventListener('message', (e) => {
      if (props.onMessage) {
        props.onMessage(e);
      }
    });

    player.current?.addEventListener('error', (e) => {
      if (props.onError) {
        props.onError(e);
      }
    });

    player.current?.addEventListener('timeupdate', (e) => {
      if (props.onTimeUpdate) {
        props.onTimeUpdate(e);
      }
    });

    player.current?.addEventListener('pause', () => {
      if (props.onPause) {
        props.onPause();
      }
    });

    player.current?.addEventListener('play', () => {
      if (props.onPlay) {
        props.onPlay();
      }
    });

    player.current?.addEventListener('snapOutside', (e) => {
      if (props.onSnapOutside) {
        props.onSnapOutside(e);
      }
    });

    player.current?.addEventListener('snapInside', (e) => {
      if (props.onSnapInside) {
        props.onSnapInside(e);
      }
    });

    player.current?.addEventListener('customButtons', (e) => {
      if (props.onCustomButtons) {
        props.onCustomButtons(e);
      }
    });
  };

  return (
    // @ts-ignore: Unreachable code error
    <live-player
      ref={(r: any) => {
        // @ts-ignore
        player.current = r;
        EventInit();
      }}
      live={'live' in props ? props.live !== false : true}
      autoplay={'autoplay' in props ? props.autoplay !== false : true}
      muted={'muted' in props ? props.muted !== false : true}
      hide-big-play-button={true}
      poster={props.poster || ''}
      timeout={props.timeout || 20}
      video-url={props.url || ''}
    />
  );
};
