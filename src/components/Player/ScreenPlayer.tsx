import { useState, useEffect, useCallback, useRef } from 'react';
import classNames from 'classnames';
import LivePlayer from './index';
import { Radio } from 'antd';
import { useFullscreen } from 'ahooks';
import './index.less';

type Player = {
  id?: string;
  url?: string;
};

interface ScreenProps {
  url?: string;
  id?: string;
  /**
   *
   * @param id 当时播发视频ID
   * @param type 鼠标按下状态，true 为按下， false 为松开
   */
  onLeft?: (id: string, type: boolean) => void;
  /**
   *
   * @param id 当时播发视频ID
   * @param type 鼠标按下状态，true 为按下， false 为松开
   */
  onUp?: (id: string, type: boolean) => void;
  /**
   *
   * @param id 当时播发视频ID
   * @param type 鼠标按下状态，true 为按下， false 为松开
   */
  onRight?: (id: string, type: boolean) => void;
  /**
   *
   * @param id 当时播发视频ID
   * @param type 鼠标按下状态，true 为按下， false 为松开
   */
  onDown?: (id: string, type: boolean) => void;
  /**
   *
   * @param id 当时播发视频ID
   * @param type 鼠标按下状态，true 为按下， false 为松开
   */
  onZoomIn?: (id: string, type: boolean) => void;
  /**
   *
   * @param id 当时播发视频ID
   * @param type 鼠标按下状态，true 为按下， false 为松开
   */
  onZoomOut?: (id: string, type: boolean) => void;
}

export default (props: ScreenProps) => {
  const [screen, setScreen] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerActive, setPlayerActive] = useState(0);
  const fullscreenRef = useRef(null);
  const [isFullscreen, { setFull }] = useFullscreen(fullscreenRef);

  const replaceVideo = useCallback(
    (id: string, url: string) => {
      const videoIndex = players.findIndex((video) => video.url === url);
      if (videoIndex === -1) {
        players[playerActive] = { id, url };
        setPlayers(players);

        if (playerActive === screen) {
          // 当前位置为分屏最后一位
          setPlayerActive(0);
        } else {
          setPlayerActive(playerActive + 1);
        }
      }
    },
    [players, playerActive, screen],
  );

  useEffect(() => {
    const arr = new Array(screen).fill(1).map(() => ({ id: '', url: '' }));
    setPlayers(arr);
    setPlayerActive(0);
  }, [screen]);

  useEffect(() => {
    // 查看当前 播放视频位置，如果当前视频位置有视频在播放，则替换
    if (props.url && props.id) {
      replaceVideo(props.id, props.url);
    }
  }, [props.url]);

  const screenClass = `screen-${screen}`;

  return (
    <div className={'live-player-warp'}>
      <div className={'live-player-content'}>
        <div className={'player-screen-tool'}>
          <Radio.Group
            options={[
              { label: '单屏', value: 1 },
              { label: '四分屏', value: 4 },
              { label: '九分屏', value: 9 },
              { label: '全屏', value: 0 },
            ]}
            value={screen}
            onChange={(e) => {
              if (e.target.value) {
                setScreen(e.target.value);
              } else {
                // 全屏操作
                setFull();
              }
            }}
            optionType={'button'}
            buttonStyle={'solid'}
          />
        </div>
        <div className={'player-body'}>
          <div className={classNames('player-screen', screenClass)} ref={fullscreenRef}>
            {players.map((player, index) => {
              return (
                <div
                  key={`player_body_${index}`}
                  className={classNames({
                    active: playerActive === index && !isFullscreen,
                    'full-screen': isFullscreen,
                  })}
                  onClick={() => {
                    setPlayerActive(index);
                  }}
                >
                  <LivePlayer key={player.id || `player_${index}`} url={player.url || ''} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={'live-player-tools'}></div>
    </div>
  );
};
