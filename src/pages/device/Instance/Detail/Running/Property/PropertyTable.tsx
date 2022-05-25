import moment from 'moment';
import { useEffect, useState } from 'react';
import FileComponent from './FileComponent';

interface Props {
  type: 'time' | 'value';
  data: any;
  value: any;
}
const PropertyTable = (props: Props) => {
  const { type, data, value } = props;
  const [dataValue, setDataValue] = useState<any>(null);

  useEffect(() => {
    if (!dataValue?.timestamp) {
      setDataValue(value);
    } else if (dataValue?.timestamp && dataValue?.timestamp < value?.timestamp) {
      setDataValue(value);
    }
  }, [value]);

  return (
    <div>
      {type === 'time' ? (
        <span>{moment(dataValue?.timestamp).format('YYYY-MM-DD HH:mm:ss')}</span>
      ) : (
        <FileComponent type="table" value={dataValue} data={data} />
      )}
    </div>
  );
};

export default PropertyTable;
