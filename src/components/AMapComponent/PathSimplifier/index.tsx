import React, { useCallback, useEffect, useRef, useState } from 'react';
import PathNavigator from './PathNavigator';

interface PathSimplifierProps {
  __map__?: any;
  options?: Omit<PathSimplifierOptions, 'map'>;
  pathData?: PathDataItemType[];
  children?: React.ReactNode;
  onCreated?: (nav: PathSimplifier) => void;
}

const PathSimplifier = (props: PathSimplifierProps) => {
  const { __map__, onCreated, options } = props;

  const pathSimplifierRef = useRef<PathSimplifier | null>(null);
  const [loading, setLoading] = useState(false);

  const pathSimplifier = useCallback(
    (PathObj: PathSimplifier) => {
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

      if (onCreated) {
        onCreated(pathSimplifierRef.current!);
      }

      if (props.pathData) {
        console.log(props.pathData.map((item) => ({ name: item.name || '路线', path: item.path })));
        pathSimplifierRef.current?.setData(
          props.pathData.map((item) => ({ name: item.name || '路线', path: item.path })),
        );
        setLoading(true);
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

  const renderChildren = () => {
    return React.Children.map(props.children, (child, index) => {
      if (child) {
        if (typeof child === 'string') {
          return child;
        } else {
          return React.cloneElement(child as any, {
            __pathSimplifier__: pathSimplifierRef.current,
            navKey: index,
          });
        }
      }
      return child;
    });
  };

  const clear = () => {
    if (pathSimplifierRef.current) {
      setLoading(false);
      pathSimplifierRef.current!.clearPathNavigators();
      pathSimplifierRef.current?.setData([]);
      props.__map__.remove(pathSimplifierRef.current);
    }
  };

  useEffect(() => {
    if (pathSimplifierRef.current) {
      if (props.pathData && props.pathData.length) {
        setLoading(false);
        setTimeout(() => {
          pathSimplifierRef.current?.setData(
            props.pathData!.map((item) => ({ name: item.name || '路线', path: item.path })),
          );
          setLoading(true);
        }, 10);
      } else {
        setLoading(false);
        pathSimplifierRef.current.setData([]);
      }
    }
  }, [props.pathData]);

  useEffect(() => {
    if (__map__) {
      loadUI();
    }
  }, [__map__]);

  useEffect(() => {
    return () => {
      if (props.__map__) {
        clear();
      }
    };
  }, []);

  return <>{loading && renderChildren()}</>;
};

PathSimplifier.PathNavigator = PathNavigator;

export default PathSimplifier;
