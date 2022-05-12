import { useEffect, useRef, useState } from 'react';
import { getAMapPlugins } from '@/components/AMapComponent/APILoader';

type DataType = {
  label: string;
  value: {
    lat: number;
    lng: number;
  };
  address: string;
};
const usePlaceSearch = (map: any) => {
  const MSearch = useRef<PlaceSearch | null>(null);
  const [data, setData] = useState<DataType[]>([]);

  const initSearch = () => {
    getAMapPlugins('AMap.PlaceSearch', map, () => {
      MSearch.current = new (AMap as any).PlaceSearch({
        pageSize: 10,
        pageIndex: 1,
      });
    });
  };

  const onSearch = (value: string) => {
    if (value && MSearch.current) {
      MSearch.current.search(value, (status: string, result: any) => {
        if (status === 'complete' && result.poiList && result.poiList.count) {
          setData(
            result.poiList.pois.map((item: any) => {
              const lnglat: any = item.location || {};
              return {
                label: item.name,
                address: item.address,
                value: [lnglat.lng, lnglat.lat].toString(),
                lnglat: {
                  lng: lnglat.lng,
                  lat: lnglat.lat,
                },
              };
            }),
          );
        } else {
          setData([]);
        }
      });
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    if (map) {
      initSearch();
    }
  }, [map]);

  return {
    data,
    search: onSearch,
  };
};

export default usePlaceSearch;
