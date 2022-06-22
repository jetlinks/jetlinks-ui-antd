import { useEffect, useState } from 'react';
import type { MutableRefObject } from 'react';

type TargetValue<T> = T | undefined | null;

type TargetType = HTMLElement | HTMLDivElement | Element | Window | Document;

type BasicTarget<T extends TargetType = Element> =
  | TargetValue<T>
  | MutableRefObject<TargetValue<T>>;

const getTargetElement = <T extends TargetType>(target: BasicTarget<T> | string) => {
  if (!target) {
    return null;
  }

  let targetElement: TargetValue<T> | Element;

  if (typeof target === 'string') {
    targetElement = document.querySelector(target);
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
};

const useDomFullHeight = (target: BasicTarget | string, extraHeight: number = 0) => {
  const [state, setState] = useState(100);

  useEffect(() => {
    const el = getTargetElement(target);
    let resizeObserver: ResizeObserver | undefined;
    if (el) {
      resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const bodyClient = document.body.getBoundingClientRect();
          const domClient = entry.target.getBoundingClientRect();
          if (domClient.y < 50) {
            setState(100);
          } else {
            setState(bodyClient.height - domClient.y - 24 - extraHeight);
          }
        });
      });

      resizeObserver.observe(el);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [target]);

  return {
    minHeight: state,
  };
};

export default useDomFullHeight;
