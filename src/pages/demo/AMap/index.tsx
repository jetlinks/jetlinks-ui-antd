import { AMap, PathSimplifier } from '@/components';
import { usePlaceSearch } from '@/components/AMapComponent/hooks';
import { Marker } from 'react-amap';
import { useState } from 'react';
import { Select } from 'antd';
import { debounce } from 'lodash';

export default () => {
  const [speed] = useState(100000);
  const [markerCenter, setMarkerCenter] = useState<any>({ longitude: 0, latitude: 0 });
  const [map, setMap] = useState(null);

  const { data, search } = usePlaceSearch(map);

  const onSearch = (value: string) => {
    search(value);
  };
  console.log(data);

  const [pathData] = useState([
    {
      name: '线路1',
      path: [
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
      ],
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
        onInstanceCreated={setMap}
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
        <PathSimplifier pathData={pathData}>
          <PathSimplifier.PathNavigator
            speed={speed}
            onCreate={(nav) => {
              setTimeout(() => {
                nav.pause();
              }, 5000);
              setTimeout(() => {
                nav.resume(); // 恢复
              }, 7000);
            }}
          />
        </PathSimplifier>
      </AMap>
      <div style={{ position: 'absolute', top: 0 }}>
        <Select
          showSearch
          options={data}
          filterOption={false}
          onSearch={debounce(onSearch, 300)}
          style={{ width: 300 }}
          onSelect={(key: string, node: any) => {
            console.log(key, node);
          }}
        />
      </div>
    </div>
  );
};
