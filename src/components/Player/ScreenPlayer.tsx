import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import classNames from 'classnames';
import LivePlayer from './index';
import { Button, Dropdown, Empty, Menu, Popconfirm, Popover, Radio, Tooltip } from 'antd';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input } from '@formily/antd';
import { useFullscreen } from 'ahooks';
import './index.less';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Service from './service';
import MediaTool from '@/components/Player/mediaTool';
import { createForm } from '@formily/core';
import { onlyMessage } from '@/utils/util';

type Player = {
  id?: string;
  url?: string;
  channelId?: string;
  key: string;
  show: boolean;
};

interface ScreenProps {
  url?: string;
  id?: string;
  channelId: string;
  className?: string;
  historyHandle?: (deviceId: string, channelId: string) => string;
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

const DEFAULT_SAVE_CODE = 'screen-save';

const useCallbackState = <T extends object>(olValue: T): [T, Function] => {
  const cbRef = useRef<Function>();

  const [players, setData] = useState<T>(olValue);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(players);
    }
  }, [players]);

  return [
    players,
    function (value: T, callback?: Function) {
      cbRef.current = callback;
      setData(value);
    },
  ];
};

export default forwardRef((props: ScreenProps, ref) => {
  const [screen, setScreen] = useState(1);
  const [players, setPlayers] = useCallbackState<Player[]>([]);
  const [playerActive, setPlayerActive] = useState(0);
  const [historyList, setHistoryList] = useState<any>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fullscreenRef = useRef(null);
  const [isFullscreen, { setFull }] = useFullscreen(fullscreenRef);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
    },
  });

  const historyForm = createForm();

  const reloadPlayer = useCallback(
    (id: string, channelId: string, url: string, index: number) => {
      const olPlayers = [...players];
      olPlayers[index] = {
        id: '',
        channelId: '',
        url: '',
        key: olPlayers[index].key,
        show: true,
      };
      const newPlayer = {
        id,
        url,
        channelId,
        key: olPlayers[index].key,
        show: true,
      };
      setPlayers([...olPlayers]);
      setTimeout(() => {
        olPlayers[index] = newPlayer;
        setPlayers(olPlayers);
      }, 1000);
    },
    [players],
  );

  const replaceVideo = useCallback(
    (id: string, channelId: string, url: string) => {
      const olPlayers = [...players];
      const newPlayer = {
        id,
        url,
        channelId,
        key: olPlayers[playerActive].key,
        show: true,
      };

      if (olPlayers[playerActive].url === url) {
        // 刷新视频
        reloadPlayer(id, channelId, url, playerActive);
      } else {
        olPlayers[playerActive] = newPlayer;
        setPlayers(olPlayers);
      }
      if (playerActive === screen - 1) {
        // 当前位置为分屏最后一位
        setPlayerActive(0);
      } else {
        setPlayerActive(playerActive + 1);
      }
    },
    [players, playerActive, screen, props.showScreen],
  );

  const handleHistory = useCallback(
    (item: any) => {
      if (props.historyHandle) {
        const log = JSON.parse(item.content || '{}');
        setScreen(log.screen);
        const oldPlayers = [...players];

        setPlayers(
          oldPlayers.map((oldPlayer, index) => {
            oldPlayer.show = false;
            if (index < log.screen) {
              const { deviceId, channelId } = log.players[index];
              return {
                ...oldPlayer,
                id: deviceId,
                channelId: deviceId,
                url: deviceId ? props.historyHandle!(deviceId, channelId) : '',
                show: true,
              };
            }
            return oldPlayer;
          }),
        );
      }
    },
    [players, props.historyHandle],
  );

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
    const historyValue = await historyForm.submit<{ alias: string }>();
    const param = {
      name: historyValue.alias,
      content: JSON.stringify({
        screen: screen,
        players: players.map((item) => ({ deviceId: item.id, channelId: item.channelId })),
      }),
    };
    setLoading(true);
    const resp = await service.history.save(DEFAULT_SAVE_CODE, param);
    setLoading(false);
    if (resp.status === 200) {
      setVisible(false);
      getHistory();
      onlyMessage('保存成功!');
    } else {
      onlyMessage('保存失败', 'error');
      // message.error('保存失败');
    }
  }, [players, screen, historyForm]);

  const mediaInit = () => {
    const newArr = [];
    for (let i = 0; i < 9; i++) {
      newArr.push({
        id: '',
        channelId: '',
        url: '',
        key: 'time_' + new Date().getTime() + i,
        show: i === 0,
      });
    }
    setPlayers(newArr);
  };

  const screenChange = (index: number) => {
    setPlayers(
      players.map((item, i) => {
        return {
          id: '',
          channelId: '',
          url: '',
          updateTime: 0,
          key: item.key,
          show: i < index,
        };
      }),
    );
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
    mediaInit();
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
            <Menu.Item key={item.id}>
              <span
                onClick={() => {
                  handleHistory(item);
                }}
                style={{ padding: '0 4px' }}
              >
                {item.name}
              </span>
              <Popconfirm
                title={'确认删除'}
                onConfirm={(e) => {
                  e?.stopPropagation();
                  deleteHistory(item.key);
                }}
              >
                <DeleteOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </Popconfirm>
            </Menu.Item>
          );
        })
      ) : (
        <Empty />
      )}
    </Menu>
  );

  return (
    <div className={classNames('live-player-warp', props.className)}>
      <div className={'live-player-content'}>
        {props.showScreen !== false && (
          <div className={'player-screen-tool'}>
            <>
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
                    <Form style={{ width: '217px' }} form={historyForm}>
                      <SchemaField
                        schema={{
                          type: 'object',
                          properties: {
                            alias: {
                              'x-decorator': 'FormItem',
                              'x-component': 'Input.TextArea',
                              'x-validator': [
                                {
                                  max: 64,
                                  message: '最多可输入64个字符',
                                },
                                {
                                  required: true,
                                  message: '请输入名称',
                                },
                              ],
                            },
                          },
                        }}
                      />
                      <Button
                        type={'primary'}
                        onClick={saveHistory}
                        loading={loading}
                        style={{ width: '100%', marginTop: 16 }}
                      >
                        保存
                      </Button>
                    </Form>
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
            {players.map((item, index) => {
              return (
                <div
                  key={item.key}
                  className={classNames('player-screen-item', {
                    active: props.showScreen !== false && playerActive === index && !isFullscreen,
                    'full-screen': isFullscreen,
                  })}
                  style={{ display: item.show ? 'block' : 'none' }}
                  onClick={() => {
                    setPlayerActive(index);
                  }}
                >
                  <div
                    className={'media-btn-refresh'}
                    style={{ display: item.url ? 'block' : 'none' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.url) {
                        reloadPlayer(item.id!, item.channelId!, item.url!, index);
                      }
                    }}
                  >
                    刷新
                  </div>
                  <LivePlayer url={item.url} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <MediaTool
        onMouseDown={(type) => {
          const { id, channelId } = players[playerActive];
          if (id && channelId && props.onMouseDown) {
            props.onMouseDown(id, channelId, type);
          }
        }}
        onMouseUp={(type) => {
          const { id, channelId } = players[playerActive];
          if (props.onMouseUp && id && channelId) {
            props.onMouseUp(id, channelId, type);
          }
        }}
      />
    </div>
  );
});
