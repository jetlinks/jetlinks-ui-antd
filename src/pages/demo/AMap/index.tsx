import { AMap, PathSimplifier } from '@/components';
import { useState } from 'react';

export default () => {
  const [speed, setSpeed] = useState(10000);
  return (
    <AMap
      useAMapUI={true}
      style={{
        height: 500,
        width: '100%',
      }}
    >
      <PathSimplifier
        pathData={[
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
        ]}
        pathName={'线路1'}
        speed={speed}
        onCreated={(nav) => {
          nav.start();
          setTimeout(() => {
            setSpeed(speed * 8);
          }, 5000);
        }}
      />
    </AMap>
  );
};
