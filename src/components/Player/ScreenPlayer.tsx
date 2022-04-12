import { useCallback, useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import classNames from 'classnames';
import LivePlayer from './index';
import { Radio, Dropdown, Menu, Popover, Input, Button, Empty, Tooltip } from 'antd';
import { useFullscreen } from 'ahooks';
import './index.less';
import {
  CaretDownOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import Service from './service';

type Player = {
  id?: string;
  url?: string;
  channelId?: string;
  key: string;
};

interface ScreenProps {
  url?: string;
  id?: string;
  channelId: string;
  className?: string;
  /**
   *
   * @param id 当前选中播发视频ID
   * @param type 当前操作动作
   */
  onMouseDown?: (deviceId: string, channelId: string, type: string) => void;
  /**
   *
   * @param id 当前选中播发视频ID
   * @param type 当前操作动作
   */
  onMouseUp?: (deviceId: string, channelId: string, type: string) => void;
  showScreen?: boolean;
}

const service = new Service();

const DEFAULT_SAVE_CODE = 'screen_save';

export default forwardRef((props: ScreenProps, ref) => {
  const [screen, setScreen] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerActive, setPlayerActive] = useState(0);
  const [historyList, setHistoryList] = useState<any>([]);
  const [historyTitle, setHistoryTitle] = useState('');
  const [visible, setVisible] = useState(false);

  const fullscreenRef = useRef(null);
  const [isFullscreen, { setFull }] = useFullscreen(fullscreenRef);

  const replaceVideo = useCallback(
    (id: string, channelId: string, url: string) => {
      players[playerActive] = { id, url, channelId, key: 'time_' + new Date().getTime() };
      setPlayers(players);
      if (playerActive === screen - 1) {
        // 当前位置为分屏最后一位
        setPlayerActive(0);
      } else {
        setPlayerActive(playerActive + 1);
      }
    },
    [players, playerActive, screen, props.showScreen],
  );

  const handleHistory = (item: any) => {
    const log = JSON.parse(item.content || '{}');
    setScreen(log.screen);
    setPlayers(log.players);
  };

  const getHistory = async () => {
    const resp = await service.history.query(DEFAULT_SAVE_CODE);
    if (resp.status === 200) {
      setHistoryList(resp.result);
    }
  };

  const deleteHistory = async (id: string) => {
    const resp = await service.history.remove(DEFAULT_SAVE_CODE, id);
    if (resp.status === 200) {
      getHistory();
      setVisible(false);
    }
  };

  const saveHistory = useCallback(async () => {
    const param = {
      name: historyTitle,
      content: JSON.stringify({
        screen: screen,
        players: players,
      }),
    };
    const resp = await service.history.save(DEFAULT_SAVE_CODE, param);
    if (resp.status === 200) {
      setVisible(false);
      getHistory();
    }
  }, [players, historyTitle, screen]);

  const screenChange = (index: number) => {
    const arr = new Array(index)
      .fill(1)
      .map(() => ({ id: '', channelId: '', url: '', key: 'time_' + new Date().getTime() }));
    setPlayers(arr);
    setPlayerActive(0);
    setScreen(index);
  };

  useEffect(() => {
    // 查看当前 播放视频位置，如果当前视频位置有视频在播放，则替换
    if (props.url && props.id) {
      replaceVideo(props.id, props.channelId, props.url);
    }
  }, [props.url]);

  useEffect(() => {
    if (props.showScreen !== false) {
      getHistory();
    }
    screenChange(1);
  }, []);

  useImperativeHandle(ref, () => ({
    replaceVideo: replaceVideo,
  }));

  const screenClass = `screen-${screen}`;

  const DropdownMenu = (
    <Menu>
      {historyList.length ? (
        historyList.map((item: any) => {
          return (
            <Menu.Item
              key={item.id}
              onClick={() => {
                handleHistory(item);
              }}
            >
              {item.name}
              <DeleteOutlined
                onClick={() => {
                  deleteHistory(item.id);
                }}
              />
            </Menu.Item>
          );
        })
      ) : (
        <Empty />
      )}
    </Menu>
  );

  const MediaDom = (data: Player[]) => {
    return data.map((item, index) => {
      return (
        <div
          key={'player-content' + index}
          className={classNames({
            active: props.showScreen !== false && playerActive === index && !isFullscreen,
            'full-screen': isFullscreen,
          })}
          onClick={() => {
            setPlayerActive(index);
          }}
        >
          <LivePlayer key={item.key} url={item.url} />
        </div>
      );
    });
  };

  return (
    <div className={classNames('live-player-warp', props.className)}>
      <div className={'live-player-content'}>
        {props.showScreen !== false && (
          <div className={'player-screen-tool'}>
            <>
              <div></div>
              <div>
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
                      screenChange(e.target.value);
                    } else {
                      // 全屏操作
                      setFull();
                    }
                  }}
                  optionType={'button'}
                  buttonStyle={'solid'}
                />
                {/*<Tooltip*/}
                {/*  title={''}*/}
                {/*>*/}
                {/*  <QuestionCircleOutlined />*/}
                {/*</Tooltip>*/}
              </div>
              <div className={'screen-tool-save'}>
                <Popover
                  content={
                    <div style={{ width: 300 }}>
                      <Input.TextArea
                        rows={3}
                        onChange={(e) => {
                          setHistoryTitle(e.target.value);
                        }}
                      />
                      <Button
                        type={'primary'}
                        onClick={saveHistory}
                        style={{ width: '100%', marginTop: 16 }}
                      >
                        保存
                      </Button>
                    </div>
                  }
                  title="分屏名称"
                  trigger="click"
                  visible={visible}
                  onVisibleChange={(v) => {
                    setVisible(v);
                  }}
                >
                  <Dropdown.Button
                    type={'primary'}
                    overlay={DropdownMenu}
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    保存
                  </Dropdown.Button>
                </Popover>
                <Tooltip title={'可保存分屏配置记录'}>
                  <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </div>
            </>
          </div>
        )}
        <div className={'player-body'}>
          <div className={classNames('player-screen', screenClass)} ref={fullscreenRef}>
            {MediaDom(players)}
          </div>
        </div>
      </div>
      <div className={'live-player-tools'}>
        <div className={'direction'}>
          <div
            className={'direction-item up'}
            onMouseDown={() => {
              const { id, channelId } = players[playerActive];
              if (id && channelId && props.onMouseDown) {
                props.onMouseDown(id, channelId, 'UP');
              }
            }}
            onMouseUp={() => {
              const { id, channelId } = players[playerActive];
              if (props.onMouseUp && id && channelId) {
                props.onMouseUp(id, channelId, 'UP');
              }
            }}
          >
            <CaretUpOutlined className={'direction-icon'} />
          </div>
          <div
            className={'direction-item right'}
            onMouseDown={() => {
              const { id, channelId } = players[playerActive];
              if (props.onMouseDown && id && channelId) {
                props.onMouseDown(id, channelId, 'RIGHT');
              }
            }}
            onMouseUp={() => {
              const { id, channelId } = players[playerActive];
              if (props.onMouseUp && id && channelId) {
                props.onMouseUp(id, channelId, 'RIGHT');
              }
            }}
          >
            <CaretRightOutlined className={'direction-icon'} />
          </div>
          <div
            className={'direction-item left'}
            onMouseDown={() => {
              const { id, channelId } = players[playerActive];
              if (props.onMouseDown && id && channelId) {
                props.onMouseDown(id, channelId, 'LEFT');
              }
            }}
            onMouseUp={() => {
              const { id, channelId } = players[playerActive];
              if (props.onMouseUp && id && channelId) {
                props.onMouseUp(id, channelId, 'LEFT');
              }
            }}
          >
            <CaretLeftOutlined className={'direction-icon'} />
          </div>
          <div
            className={'direction-item down'}
            onMouseDown={() => {
              const { id, channelId } = players[playerActive];
              if (props.onMouseDown && id && channelId) {
                props.onMouseDown(id, channelId, 'DOWN');
              }
            }}
            onMouseUp={() => {
              const { id, channelId } = players[playerActive];
              if (props.onMouseUp && id && channelId) {
                props.onMouseUp(id, channelId, 'DOWN');
              }
            }}
          >
            <CaretDownOutlined className={'direction-icon'} />
          </div>
          <div
            className={'direction-audio'}
            // onMouseDown={() => {
            //   const { id, channelId } = players[playerActive];
            //   if (props.onMouseDown && id && channelId) {
            //     props.onMouseDown(id, channelId, 'AUDIO');
            //   }
            // }}
            // onMouseUp={() => {
            //   const { id, channelId } = players[playerActive];
            //   if (props.onMouseUp && id && channelId) {
            //     props.onMouseUp(id, channelId, 'AUDIO');
            //   }
            // }}
          >
            {/*<AudioOutlined />*/}
          </div>
        </div>
        <div className={'zoom'}>
          <div
            className={'zoom-item zoom-in'}
            onMouseDown={() => {
              const { id, channelId } = players[playerActive];
              if (props.onMouseDown && id && channelId) {
                props.onMouseDown(id, channelId, 'ZOOM_IN');
              }
            }}
            onMouseUp={() => {
              const { id, channelId } = players[playerActive];
              if (props.onMouseUp && id && channelId) {
                props.onMouseUp(id, channelId, 'ZOOM_IN');
              }
            }}
          >
            <PlusOutlined />
          </div>
          <div
            className={'zoom-item zoom-out'}
            onMouseDown={() => {
              const { id, channelId } = players[playerActive];
              if (props.onMouseDown && id && channelId) {
                props.onMouseDown(id, channelId, 'ZOOM_OUT');
              }
            }}
            onMouseUp={() => {
              const { id, channelId } = players[playerActive];
              if (props.onMouseUp && id && channelId) {
                props.onMouseUp(id, channelId, 'ZOOM_OUT');
              }
            }}
          >
            <MinusOutlined />
          </div>
        </div>
      </div>
    </div>
  );
});
