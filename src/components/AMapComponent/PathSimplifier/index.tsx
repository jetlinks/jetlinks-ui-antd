import { useCallback, useEffect, useRef } from 'react';

interface PathSimplifierProps {
  __map__?: any;
  options?: Omit<PathSimplifierOptions, 'map'>;
  pathNavigatorOptions?: PathNavigatorOptions;
  speed?: number;
  pathName?: string;
  pathData?: PathDataType;
  onCreated?: (nav: PathNavigator) => void;
}

const PathSimplifier = (props: PathSimplifierProps) => {
  const { pathData, pathName, __map__, onCreated, speed, pathNavigatorOptions, options } = props;

  const pathSimplifierRef = useRef<PathSimplifier | null>(null);
  const pathNavRef = useRef<PathNavigator | undefined>(undefined);

  const createPathNav = (path: number[][], navOptions?: PathNavigatorOptions) => {
    pathSimplifierRef.current?.setData([
      {
        name: pathName,
        path,
      },
    ]);
    pathNavRef.current = pathSimplifierRef.current?.createPathNavigator(0, {
      loop: false,
      speed: 10000,
      ...navOptions,
    });
    if (onCreated) {
      onCreated(pathNavRef.current!);
    }
  };

  const pathSimplifier = useCallback(
    (PathObj: PathSimplifier) => {
      // @ts-ignore
      pathSimplifierRef.current = new PathObj({
        zIndex: 100,
        getPath: (_pathData: any) => {
          return _pathData.path;
        },
        getHoverTitle: (_pathData: any) => {
          return _pathData.name;
        },
        map: __map__,
        ...options,
      });
      if (pathData) {
        createPathNav(pathData, pathNavigatorOptions);
      }
    },
    [props],
  );

  const loadUI = () => {
    if ((window as any).AMapUI) {
      (window as any).AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], (path: PathSimplifier) => {
        if (!path.supportCanvas) {
          console.warn('当前环境不支持 Canvas！');
          return;
        }
        pathSimplifier(path);
      });
    }
  };

  useEffect(() => {
    if (pathNavRef.current && speed !== undefined) {
      pathNavRef.current?.setSpeed(speed);
    }
  }, [pathNavRef.current, speed]);

  useEffect(() => {
    if (__map__) {
      loadUI();
    }
  }, [__map__]);

  return null;
};

export default PathSimplifier;
