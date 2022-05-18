import { useEffect, useState } from 'react';

interface Props {
  value?: string;
  onChange?: (type: any) => void;
}

const Standard = (props: Props) => {
  const imgMap = new Map<any, any>();
  imgMap.set('common', require('/public/images/certificate.png'));

  const [type, setType] = useState(props.value || '');

  useEffect(() => {
    setType(props.value || '');
  }, [props.value]);

  return (
    <div>
      {['common'].map((i) => (
        <div
          onClick={() => {
            setType(i);
            if (props.onChange) {
              props.onChange(i);
            }
          }}
          style={{ width: 150, border: type === i ? '1px solid #2F54EB' : '' }}
          key={i}
        >
          <img style={{ width: '100%' }} src={imgMap.get(i)} />
        </div>
      ))}
    </div>
  );
};

export default Standard;
