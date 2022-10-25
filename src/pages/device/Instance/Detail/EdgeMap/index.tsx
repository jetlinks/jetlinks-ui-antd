import useDomFullHeight from '@/hooks/document/useDomFullHeight';
import { Card, Empty } from 'antd';
import { useEffect, useState } from 'react';
import MapTable from './mapTable';
import Service from './service';

interface Props {
  data: any;
}

export const service = new Service();

const EdgeMap = (props: Props) => {
  const { data } = props;
  const { minHeight } = useDomFullHeight('.metadataMap');
  const [properties, setProperties] = useState<any>([]);
  const [empty, setEmpty] = useState<boolean>(false);
  const [reload, setReload] = useState<string>('');

  // const save = async()=>{
  //     setReload('save')
  // }
  // const remove = async()=>{
  //     setReload('remove')
  // }

  useEffect(() => {
    setReload('');
    const metadata = JSON.parse(data.metadata).properties?.map((item: any) => ({
      metadataId: item.id,
      metadataName: `${item.name}(${item.id})`,
      metadataType: 'property',
    }));
    if (metadata && metadata.length !== 0) {
      service.getMap(data.id).then((res) => {
        if (res.status === 200) {
          // console.log(res.result)
          //合并物模型
          const array = res.result.reduce((x: any, y: any) => {
            const metadataId = metadata.find((item: any) => item.metadataId === y.metadataId);
            if (metadataId) {
              Object.assign(metadataId, y);
            } else {
              x.push(y);
            }
            return x;
          }, metadata);
          //删除物模型
          const items = array.filter((item: any) => item.metadataName);
          setProperties(items);
          const delList = array.filter((a: any) => !a.metadataName).map((b: any) => b.id);
          //删除后解绑
          if (delList && delList.length !== 0) {
            console.log(delList);
            //   service.removeMap(data.id, delList);
          }
        }
      });
    } else {
      setEmpty(true);
    }
    setProperties(metadata);
    console.log(metadata);
  }, [reload]);

  return (
    <Card className="metadataMap" style={{ minHeight }}>
      {empty ? (
        <Empty description={'暂无数据，请配置物模型'} style={{ marginTop: '10%' }} />
      ) : (
        <MapTable metaData={properties} deviceId={data.id} />
      )}
    </Card>
  );
};

export default EdgeMap;
