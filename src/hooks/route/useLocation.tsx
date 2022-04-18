import { useLocation } from 'umi';
import { useEffect, useState } from 'react';
import { historyStateModel } from '@/hooks/route/useHistory';

const useLocations = () => {
  const umiLocation = useLocation();
  const [location, setLocation] = useState<any>({});
  useEffect(() => {
    setLocation({
      ...umiLocation,
      state: historyStateModel.state,
    });

    return () => {
      historyStateModel.state = undefined;
    };
  }, [umiLocation]);

  return location;
};

export default useLocations;
