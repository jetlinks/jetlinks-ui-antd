import { AMap } from '@/components';
import usePlaceSearch from '@/components/AMapComponent/hooks/PlaceSearch';
import { Input, Modal, Select } from 'antd';
import { debounce } from 'lodash';
import { Marker } from 'react-amap';
import { useEffect, useState } from 'react';

interface Props {
  value: any;
  close: () => void;
  ok: (data: any) => void;
}

export default (props: Props) => {
  const [markerCenter, setMarkerCenter] = useState<any>({ longitude: 0, latitude: 0 });
  const [map, setMap] = useState(null);

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
  return (
    <Modal
      visible
      title="地理位置"
      width={'55vw'}
      onCancel={() => props.close()}
      onOk={() => {
        props.ok(value);
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            width: 300,
            padding: 10,
            right: 5,
            top: 5,
            zIndex: 999,
            backgroundColor: 'white',
          }}
        >
          <Select
            showSearch
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
          AMapUI
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
            <Marker position={markerCenter} />
          ) : null}
        </AMap>
      </div>
    </Modal>
  );
};
