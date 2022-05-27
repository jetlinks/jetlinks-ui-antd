import { useState } from 'react';

const useDistance = () => {
  const [distance, setDistance] = useState(0);

  const onDistance = (data: number[][]) => {
    if (window.AMap && data && data.length >= 2) {
      const pointArr = data.map((point) => new window.AMap.LngLat(point[0], point[1]));
      const distanceOfLine = AMap.GeometryUtil.distanceOfLine(pointArr);
      setDistance(Math.round(distanceOfLine));
    }
  };

  return {
    distance,
    onDistance,
  };
};

export default useDistance;
