import { useCallback, useEffect, useRef } from 'react';
import { omit } from 'lodash';

interface PathNavigatorProps extends PathNavigatorOptions {
  __pathSimplifier__?: PathSimplifier;
  navKey?: number;
  onCreate?: (nav: PathNavigator) => void;
  /**
   * 是否自动播放
   * @default true
   */
  isAuto?: boolean;
  onStart?: (e: any) => void;
  onPause?: (e: any) => void;
  onMove?: (e: any) => void;
  onStop?: (e: any) => void;
}

const EventMap = {
  start: 'onStart',
  pause: 'onPause',
  move: 'onMove',
  stop: 'onStop',
};

export default (props: PathNavigatorProps) => {
  const { __pathSimplifier__, navKey, isAuto, onCreate, ...extraProps } = props;

  const PathNavigatorRef = useRef<PathNavigator | null>(null);

  const createEvent = () => {
    Object.keys(EventMap).forEach((event) => {
      if (props[EventMap[event]]) {
        PathNavigatorRef.current?.on(event, props[EventMap[event]]);
      }
    });
  };

  const removeEvent = () => {
    Object.keys(EventMap).forEach((event) => {
      if (props[EventMap[event]]) {
        PathNavigatorRef.current?.off(event, props[EventMap[event]]);
      }
    });
  };

  const createPathNavigator = useCallback(
    (path?: PathSimplifier) => {
      if (path) {
        PathNavigatorRef.current = path.createPathNavigator(navKey!, {
          speed: props.speed || 10000,
          ...omit(extraProps, Object.values(EventMap)),
        });

        if (PathNavigatorRef.current) {
          createEvent();
        }

        if (onCreate && PathNavigatorRef.current) {
          onCreate(PathNavigatorRef.current);
        }

        if (props.isAuto !== false) {
          PathNavigatorRef.current?.start();
        }
      }
    },
    [props],
  );

  useEffect(() => {
    if (PathNavigatorRef.current && props.speed !== undefined) {
      PathNavigatorRef.current?.setSpeed(props.speed);
    }
  }, [props.speed]);

  useEffect(() => {
    if (PathNavigatorRef.current && props.range !== undefined) {
      PathNavigatorRef.current?.setRange(props.range[0], props.range[1]);
    }
  }, [props.range]);

  useEffect(() => {
    createPathNavigator(props.__pathSimplifier__);

    return () => {
      if (PathNavigatorRef.current) {
        removeEvent();
      }
    };
  }, []);

  return null;
};
