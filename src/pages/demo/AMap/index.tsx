import { AMap, PathSimplifier } from '@/components';
import { usePlaceSearch } from '@/components/AMapComponent/hooks';
import { Marker } from 'react-amap';
import { useEffect, useState } from 'react';
import { Button, Select } from 'antd';
import { debounce } from 'lodash';
import useDistance from '@/components/AMapComponent/hooks/Distance';

export default () => {
  const { distance, onDistance } = useDistance();
  const [speed, setSpeed] = useState(100000);
  const [markerCenter, setMarkerCenter] = useState<any>({ longitude: 0, latitude: 0 });
  const [map, setMap] = useState(null);
  const [show, setShow] = useState(false);

  const { data, search } = usePlaceSearch(map);

  const paths = [
    [116.405289, 39.904987],
    [113.964458, 40.54664],
    [111.47836, 41.135964],
    [108.949297, 41.670904],
    [106.380111, 42.149509],
    [103.774185, 42.56996],
    [101.135432, 42.930601],
    [98.46826, 43.229964],
    [95.777529, 43.466798],
    [93.068486, 43.64009],
    [90.34669, 43.749086],
    [87.61792, 43.793308],
  ];

  const onSearch = (value: string) => {
    search(value);
  };

  useEffect(() => {
    setSpeed((distance / 5) * 3.6);
  }, [distance]);

  const [pathData] = useState([
    {
      name: '线路1',
      path: paths,
    },
  ]);

  return (
    <div style={{ position: 'relative' }}>
      <AMap
        AMapUI
        style={{
          height: 500,
          width: '100%',
        }}
        onInstanceCreated={(_map: any) => {
          setMap(_map);
        }}
        events={{
          click: (e: any) => {
            setMarkerCenter({
              longitude: e.lnglat.lng,
              latitude: e.lnglat.lat,
            });
          },
        }}
      >
        {markerCenter.longitude ? (
          // @ts-ignore
          <Marker position={markerCenter} />
        ) : null}
        {show && (
          <PathSimplifier pathData={pathData}>
            <PathSimplifier.PathNavigator
              isAuto={false}
              speed={speed}
              onCreate={(nav) => {
                onDistance(paths);

                setTimeout(() => {
                  nav.start();
                }, 300);
                // setTimeout(() => {
                //   nav.resume(); // 恢复
                // }, 7000);
              }}
            />
          </PathSimplifier>
        )}
      </AMap>
      <div style={{ position: 'absolute', top: 0 }}>
        <Select
          showSearch
          allowClear
          options={data}
          filterOption={false}
          onSearch={debounce(onSearch, 300)}
          style={{ width: 300 }}
          onSelect={(key: string, node: any) => {
            console.log(key, node);
          }}
        />
        <Button
          onClick={() => {
            setShow(false);
          }}
        >
          清除
        </Button>
        <Button
          onClick={() => {
            setShow(true);
          }}
        >
          显示
        </Button>
      </div>
    </div>
  );
};
