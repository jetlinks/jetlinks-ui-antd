import type { MutableRefObject } from 'react';
import {useEffect, useRef, useState} from 'react';
import ResizeObserver from 'resize-observer-polyfill';

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
  const resizeObserver = useRef<ResizeObserver | undefined>()

  const cleanup = () => {
    if (resizeObserver.current) {
      resizeObserver.current?.disconnect()
      resizeObserver.current = undefined
    }
  }

  useEffect(() => {
    const el = getTargetElement(target);
    cleanup()
    if (el) {
      resizeObserver.current = new ResizeObserver((entries) => {
        const bodyClient = document.body.getBoundingClientRect();
        const domClient = el.getBoundingClientRect();

        if (domClient.y < 50) {
          setState(100);
        } else {
          setState(bodyClient.height - domClient.y - 24 - extraHeight);
        }
      });

      resizeObserver.current.observe(el);
    }

    return () => {
      cleanup()
    };
  }, [target]);

  return {
    minHeight: state,
  };
};

export default useDomFullHeight;
