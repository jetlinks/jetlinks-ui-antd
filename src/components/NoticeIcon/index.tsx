import { useEffect, useState } from 'react';
import { Button, message, notification } from 'antd';
import { groupBy } from 'lodash';
import moment from 'moment';
import Service from '@/services/notice';
import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import encodeQuery from '@/utils/encodeQuery';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import useHistory from '@/hooks/route/useHistory';
import { throttleTime } from 'rxjs/operators';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';

export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const getNoticeData = (notices: API.NoticeIconItem[]): Record<string, API.NoticeIconItem[]> => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return {};
  }

  const newNotices = notices.map((notice) => {
    const newNotice = { ...notice };

    if (newNotice.notifyTime) {
      newNotice.notifyTime = moment(notice.notifyTime as string).fromNow();
    }

    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }

    // newNotice.avatar = 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg';
    newNotice.title = notice.topicName;
    newNotice.description = notice.message;
    return newNotice;
  });
  return groupBy(
    newNotices.map((item) => ({ ...item, state: item.state.value })),
    'state',
  );
};

// const getUnreadData = (noticeData: Record<string, API.NoticeIconItem[]>) => {
//   const unreadMsg: Record<string, number> = {};
//   Object.keys(noticeData).forEach((key) => {
//     const value = noticeData[key];

//     if (!unreadMsg[key]) {
//       unreadMsg[key] = 0;
//     }

//     if (Array.isArray(value)) {
//       // unreadMsg[key] = value.filter((item) => !item.read).length;
//     }
//   });
//   return unreadMsg;
// };

export const service = new Service('notifications');

const NoticeIconView = () => {
  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState || {};
  const [notices, setNotices] = useState<API.NoticeIconItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  // const { data } = useRequest(getNotices);

  const history = useHistory();
  const [subscribeTopic] = useSendWebsocketMessage();

  const getUnread = () => {
    setLoading(true);
    service
      .fetchNotices(
        encodeQuery({
          terms: { state: 'unread' },
          sorts: { notifyTime: 'desc' },
        }),
      )
      .then((resp) => {
        if (resp.status === 200) {
          setNotices(resp.result?.data || []);
          setUnreadCount(resp.result?.total || 0);
        }
        setLoading(false);
      });
  };

  const subscribeNotice = () => {
    const id = `notification`;
    const topic = `/notifications`;
    subscribeTopic!(id, topic, {})
      ?.pipe(throttleTime(2000))
      .subscribe((resp: any) => {
        getUnread();
        notification.warning({
          message: resp?.payload?.topicName,
          description: resp?.payload?.message,
          key: resp.payload.id,
          btn: (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                service.changeNoticeReadState(resp.payload.id).then((response) => {
                  if (response.status === 200) {
                    notification.close(resp.payload.id);
                    getUnread();
                  }
                });
              }}
            >
              标记已读
            </Button>
          ),
        });
      });
  };

  useEffect(() => {
    getUnread();
    subscribeNotice();
  }, []);

  const noticeData = getNoticeData(notices);
  // const unreadMsg = getUnreadData(noticeData || {});

  const changeReadState = async (item: any) => {
    const resp = await service.changeNoticeReadState(item.id);
    if (resp.status === 200) {
      const url = getMenuPathByCode(MENUS_CODE['account/NotificationRecord']);
      history.push(url, { ...item });
      setVisible(false);
    }
  };

  const clearReadState = async (title: string) => {
    const clearIds = (getNoticeData(notices).unread || []).map((item) => item.id) || [];
    const resp = await service.clearNotices(clearIds);
    if (resp.status === 200) {
      message.success(`${'清空了'} ${title}`);
      getUnread();
    }
  };

  return (
    <NoticeIcon
      className={styles.action}
      count={unreadCount}
      onItemClick={(item) => {
        changeReadState(item!);
      }}
      onClear={(title: string) => clearReadState(title)}
      loading={loading}
      clearText="当前标记为已读"
      viewMoreText="查看更多"
      onViewMore={() => {
        const url = getMenuPathByCode(MENUS_CODE['account/NotificationRecord']);
        history.push(url);
        setVisible(false);
      }}
      popupVisible={visible}
      onPopupVisibleChange={(see: boolean) => {
        setVisible(see);
      }}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="read"
        count={0}
        list={noticeData.unread}
        title="未读消息"
        emptyText="您已读完所有消息"
        showViewMore
      />
      {/* <NoticeIcon.Tab
        tabKey="handle"
        title="待办消息"
        emptyText="暂无消息"
        count={0}
        list={noticeData.handle}
        showViewMore
      /> */}
    </NoticeIcon>
  );
};

export default NoticeIconView;
