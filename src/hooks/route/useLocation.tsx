import { useLocation } from 'umi';
import { useEffect, useState } from 'react';
import { historyStateModel } from '@/hooks/route/useHistory';

const useLocations = () => {
  const umiLocation = useLocation();
  const [location, setLocation] = useState<any>({});
  useEffect(() => {
    setLocation({
      ...umiLocation,
      state: historyStateModel.state[umiLocation.pathname],
    });

    return () => {
      delete historyStateModel.state[umiLocation.pathname];
    };
  }, [umiLocation]);

  return location;
};

export default useLocations;
