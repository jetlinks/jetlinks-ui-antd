import React from 'react';
import { TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';

export interface NoticeCardProps extends TemplateItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
}

export const imgMap = {
  dingTalk: {
    dingTalkMessage: require('/public/images/notice/dingtalk.png'),
    dingTalkRobotWebHook: require('/public/images/notice/dingTalk-rebot.png'),
  },
  weixin: {
    corpMessage: require('/public/images/notice/wechat.png'),
    officialMessage: require('/public/images/notice/weixin-official.png'),
  },
  email: {
    embedded: require('/public/images/notice/email.png'),
  },
  voice: {
    aliyun: require('/public/images/notice/voice.png'),
  },
  sms: {
    aliyunSms: require('/public/images/notice/sms.png'),
  },
  webhook: {
    http: require('/public/images/notice/webhook.png'),
  },
};

export const typeList = {
  weixin: {
    corpMessage: '企业消息',
    officialMessage: '服务号消息',
  },
  dingTalk: {
    dingTalkMessage: '钉钉消息',
    dingTalkRobotWebHook: '群机器人消息',
  },
  voice: {
    aliyun: '阿里云语音',
  },
  sms: {
    aliyunSms: '阿里云短信',
  },
  email: {
    embedded: '默认',
  },
  webhook: {
    http: 'webhook',
  },
};

export default (props: NoticeCardProps) => {
  return (
    <TableCard actions={props.actions} showStatus={false} detail={props.detail} showMask={false}>
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={imgMap[props.type][props.provider]} alt={props.type} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <span className={'card-item-header-name ellipsis'}>{props.name}</span>
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>通知方式</label>
              <div className={'ellipsis'}>{typeList[props.type][props.provider] || '暂无'}</div>
            </div>
            <div>
              <label>说明</label>
              <div className={'ellipsis'}>{props.description}</div>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
