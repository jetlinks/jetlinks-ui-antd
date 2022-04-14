import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import classNames from 'classnames';
import LivePlayer from './index';
import { Button, Dropdown, Empty, Menu, message, Popconfirm, Popover, Radio, Tooltip } from 'antd';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input } from '@formily/antd';
import { useFullscreen } from 'ahooks';
import './index.less';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Service from './service';
import MediaTool from '@/components/Player/mediaTool';
import { createForm } from '@formily/core';

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

const DEFAULT_SAVE_CODE = 'screen-save';

export default forwardRef((props: ScreenProps, ref) => {
  const [screen, setScreen] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerActive, setPlayerActive] = useState(0);
  const [historyList, setHistoryList] = useState<any>([]);
  const [visible, setVisible] = useState(false);

  const fullscreenRef = useRef(null);
  const [isFullscreen, { setFull }] = useFullscreen(fullscreenRef);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
    },
  });

  const historyForm = createForm();

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
    const historyValue = await historyForm.submit<{ alias: string }>();
    const param = {
      name: historyValue.alias,
      content: JSON.stringify({
        screen: screen,
        players: players,
      }),
    };
    const resp = await service.history.save(DEFAULT_SAVE_CODE, param);
    if (resp.status === 200) {
      setVisible(false);
      getHistory();
      message.success('保存成功!');
    } else {
      message.error('保存失败');
    }
  }, [players, screen, historyForm]);

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
            {MediaDom(players)}
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
