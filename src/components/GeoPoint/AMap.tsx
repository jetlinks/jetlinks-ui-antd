import { AMap } from '@/components';
import usePlaceSearch from '@/components/AMapComponent/hooks/PlaceSearch';
import { Input, Modal, Select } from 'antd';
import { debounce } from 'lodash';
import { Marker } from 'react-amap';
import { useEffect, useState } from 'react';
import './style';

interface Props {
  value: any;
  close: () => void;
  ok: (data: any) => void;
}

type MarkerPointType = {
  longitude: number;
  latitude: number;
};

export default (props: Props) => {
  const [markerCenter, setMarkerCenter] = useState<MarkerPointType>({ longitude: 0, latitude: 0 });
  const [map, setMap] = useState<any>(null);

  const { data, search } = usePlaceSearch(map);

  const [value, setValue] = useState<any>(props.value);

  const onSearch = (value1: string) => {
    search(value1);
  };

  useEffect(() => {
    setValue(props?.value || '');
    const list = (props?.value || '').split(',') || [];
    if (!!props.value && list.length === 2) {
      setMarkerCenter({
        longitude: list[0],
        latitude: list[1],
      });
    }
  }, [props.value]);
  console.log(markerCenter);

  return (
    <Modal
      visible
      title="地理位置"
      width={'55vw'}
      zIndex={1050}
      onCancel={() => props.close()}
      onOk={() => {
        props.ok(value);
      }}
    >
      <div className={'map-search-warp'}>
        <div className={'map-search-select'}>
          <Select
            showSearch
            allowClear
            options={data}
            filterOption={false}
            onSearch={debounce(onSearch, 300)}
            style={{ width: '100%', marginBottom: 10 }}
            onSelect={(key: string, node: any) => {
              setValue(key);
              setMarkerCenter({
                longitude: node.lnglat.lng,
                latitude: node.lnglat.lat,
              });
            }}
          />
          <Input value={value} readOnly />
        </div>
        <AMap
          style={{
            height: 500,
            width: '100%',
          }}
          center={markerCenter.longitude ? markerCenter : undefined}
          onInstanceCreated={setMap}
          events={{
            click: (e: any) => {
              setValue(`${e.lnglat.lng},${e.lnglat.lat}`);
              setMarkerCenter({
                longitude: e.lnglat.lng,
                latitude: e.lnglat.lat,
              });
            },
          }}
        >
          {markerCenter.longitude ? (
            // @ts-ignore
            <Marker kye={'marker'} position={markerCenter} />
          ) : null}
        </AMap>
      </div>
    </Modal>
  );
};
