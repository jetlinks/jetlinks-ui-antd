import { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import classNames from 'classnames';
import { LeftOutlined } from '@ant-design/icons';
import './index.less';

const AMapComponent = () => {
  const mapRef = useRef({});

  useEffect(() => {
    AMapLoader.load({
      key: '4a8929c85e2a1a8a1eae4ebc7d519ba4',
      version: '2.0',
      plugins: ['AMap.ToolBar', 'AMap.Driving'],
      AMapUI: {
        version: '1.1',
        plugins: [],
      },
      Loca: {
        version: '2.0.0',
      },
    })
      .then((AMap) => {
        const map = new AMap.Map('map-container', {
          viewMode: '3D',
          zoom: 5,
          zooms: [2, 22],
          center: [105.602725, 37.076636],
        });
        const positionArr = [
          [113.357224, 34.977186],
          [114.555528, 37.727903],
          [112.106257, 36.962733],
          [109.830097, 31.859027],
          [116.449181, 39.98614],
        ];
        for (const item of positionArr) {
          const marker = new AMap.Marker({
            position: [item[0], item[1]],
          });
          map.add(marker);
        }
        mapRef.current = map;
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="home">
      <div id="map-container" className="map" style={{ height: '600px' }} />
      <div className="draw">
        <div
          className={classNames('draw-warp', {
            show: show,
          })}
        >
          <div
            className={classNames('draw-button')}
            onClick={() => {
              setShow(!show);
            }}
          >
            <LeftOutlined className={classNames('draw-button-icon', { active: show })} />
          </div>
          <div className="draw-content">....内容信息</div>
        </div>
      </div>
    </div>
  );
};
export default AMapComponent;
