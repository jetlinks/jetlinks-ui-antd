import useDomFullHeight from '@/hooks/document/useDomFullHeight';
import { Card } from 'antd';
import MapTable from './mapTable';

const EdgeMap = () => {
  const { minHeight } = useDomFullHeight('.metadataMap');
  return (
    <Card className="metadataMap" style={{ minHeight }}>
      <MapTable metaData={[]} />
    </Card>
  );
};

export default EdgeMap;
