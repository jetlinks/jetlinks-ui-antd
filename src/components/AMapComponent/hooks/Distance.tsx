import { useState } from 'react';

const useDistance = () => {
  const [distance, setDistance] = useState(0);

  const onDistance = (data: number[][]) => {
    if ((window as any).AMap && data && data.length >= 2) {
      const pointArr = data.map((point) => new (window as any).AMap.LngLat(point[0], point[1]));
      const distanceOfLine = (window as any).AMap.GeometryUtil.distanceOfLine(pointArr);
      setDistance(Math.round(distanceOfLine));
    }
  };

  return {
    distance,
    onDistance,
  };
};

export default useDistance;
