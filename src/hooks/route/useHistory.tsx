import {useHistory} from 'umi';
import {useEffect, useState} from 'react';
import type {LocationDescriptor, LocationState, Path} from 'history';
import {model} from '@formily/reactive';

export const historyStateModel = model<{ state: any }>({state: {}});

const useHistories = () => {
  const umiHistory = useHistory();

  const [history, setHistory] = useState<any>();

  const push = (location: Path | LocationDescriptor<LocationState>, state?: LocationState) => {
    if (state) {
      historyStateModel.state = state;
    }
    umiHistory.push(location, state);
  };

  useEffect(() => {
    setHistory({
      ...umiHistory,
      push,
    });
  }, []);

  return history;
};

export default useHistories;
