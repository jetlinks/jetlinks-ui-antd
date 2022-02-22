import { useEffect, useState } from 'react';
import { Tag, message } from 'antd';
import { groupBy } from 'lodash';
import moment from 'moment';
import { useRequest } from 'umi';
import { getNotices } from '@/services/ant-design-pro/api';

import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import { useIntl } from '@@/plugin-locale/localeExports';

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

    if (newNotice.datetime) {
      newNotice.datetime = moment(notice.datetime as string).fromNow();
    }

    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }

    if (newNotice.extra && newNotice.status) {
      const color = {
        todo: '',
        processing: 'blue',
        urgent: 'red',
        doing: 'gold',
      }[newNotice.status];
      newNotice.extra = (
        <Tag
          color={color}
          style={{
            marginRight: 0,
          }}
        >
          {newNotice.extra}
        </Tag>
      ) as any;
    }

    return newNotice;
  });
  return groupBy(newNotices, 'type');
};

const getUnreadData = (noticeData: Record<string, API.NoticeIconItem[]>) => {
  const unreadMsg: Record<string, number> = {};
  Object.keys(noticeData).forEach((key) => {
    const value = noticeData[key];

    if (!unreadMsg[key]) {
      unreadMsg[key] = 0;
    }

    if (Array.isArray(value)) {
      unreadMsg[key] = value.filter((item) => !item.read).length;
    }
  });
  return unreadMsg;
};

const NoticeIconView = () => {
  const intl = useIntl();
  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState || {};
  const [notices, setNotices] = useState<API.NoticeIconItem[]>([]);
  const { data } = useRequest(getNotices);

  useEffect(() => {
    setNotices(data || []);
  }, [data]);

  const noticeData = getNoticeData(notices);
  const unreadMsg = getUnreadData(noticeData || {});

  const changeReadState = (id: string) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };
        if (notice.id === id) {
          notice.read = true;
        }
        return notice;
      }),
    );
  };

  const clearReadState = (title: string, key: string) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };
        if (notice.type === key) {
          notice.read = true;
        }
        return notice;
      }),
    );
    message.success(`${'清空了'} ${title}`);
  };

  return (
    <NoticeIcon
      className={styles.action}
      count={10}
      onItemClick={(item) => {
        changeReadState(item.id!);
      }}
      onClear={(title: string, key: string) => clearReadState(title, key)}
      loading={false}
      clearText={intl.formatMessage({
        id: 'component.noticeIcon.clear',
        defaultMessage: '清空',
      })}
      viewMoreText={intl.formatMessage({
        id: 'component.noticeIcon.view-more',
        defaultMessage: '查看更多',
      })}
      onViewMore={() => message.info('Click on view more')}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={unreadMsg.notification}
        list={noticeData.notification}
        title={intl.formatMessage({
          id: 'component.globalHeader.notification',
          defaultMessage: '通知',
        })}
        emptyText={intl.formatMessage({
          id: 'component.globalHeader.notification.empty',
          defaultMessage: '你已查看所有通知',
        })}
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={unreadMsg.message}
        list={noticeData.message}
        title={intl.formatMessage({
          id: 'component.globalHeader.message',
          defaultMessage: '消息',
        })}
        emptyText={intl.formatMessage({
          id: 'component.globalHeader.message.empty',
          defaultMessage: '您已读完所有消息',
        })}
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="event"
        title={intl.formatMessage({
          id: 'component.globalHeader.event',
          defaultMessage: '待办',
        })}
        emptyText={intl.formatMessage({
          id: 'component.globalHeader.event.empty',
          defaultMessage: '你已完成所有待办',
        })}
        count={unreadMsg.event}
        list={noticeData.event}
        showViewMore
      />
    </NoticeIcon>
  );
};

export default NoticeIconView;
