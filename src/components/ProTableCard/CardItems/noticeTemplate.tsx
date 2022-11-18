import React from 'react';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { CheckOutlined } from '@ant-design/icons';

export interface NoticeCardProps extends TemplateItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
  className?: string;
  onUnBind?: (e: any) => void;
  showBindBtn?: boolean;
  cardType?: 'bind' | 'unbind';
  showTool?: boolean;
  onClick?: () => void;
}

export const imgMap = {
  dingTalk: {
    dingTalkMessage: require('/public/images/notice/dingtalk.png'),
    dingTalkRobotWebHook: require('/public/images/notice/dingTalk-rebot.png'),
  },
  weixin: {
    corpMessage: require('/public/images/notice/weixin-corp.png'),
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
    embedded: '邮件',
  },
  webhook: {
    http: 'webhook',
  },
};

export const ExtraNoticeTemplateCard = (props: NoticeCardProps) => {
  return (
    <TableCard
      showTool={props.showTool}
      showMask={false}
      showStatus={false}
      actions={props.actions}
      onClick={props.onClick}
      className={props.className}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={imgMap[props.type][props.provider]} alt={props.type} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <Ellipsis title={props.name} titleClassName={'card-item-header-name'} />
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>通知方式</label>
              <Ellipsis title={typeList[props.type][props.provider] || '暂无'} />
            </div>
            <div>
              <label>说明</label>
              <Ellipsis title={props.description} />
            </div>
          </div>
        </div>
      </div>
      <div className={'checked-icon'}>
        <div>
          <CheckOutlined />
        </div>
      </div>
    </TableCard>
  );
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
            <Ellipsis title={props.name} titleClassName={'card-item-header-name'} />
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>通知方式</label>
              <Ellipsis title={typeList[props.type][props.provider] || '暂无'} />
              {/*<div className={'ellipsis'}>{typeList[props.type][props.provider] || '暂无'}</div>*/}
            </div>
            <div>
              <label>说明</label>
              <Ellipsis tooltip={{ placement: 'topLeft' }} title={props.description} />
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
