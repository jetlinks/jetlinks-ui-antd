import React from 'react';
import { Badge, Col, Row } from 'antd';
import classNames from 'classnames';
import './index.less';

interface TopCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface FooterItem {
  status?: 'error' | 'success' | 'warning';
  title: string;
  value: string | number;
}

interface CardItemProps {
  span: number;
  title: string;
  value: any;
  footer: false | FooterItem[];
  showValue?: boolean;
  children: React.ReactNode;
}

const CardItem = (props: CardItemProps) => {
  return (
    <Col span={props.span}>
      <div className={'dash-board-top-item'}>
        <div
          className={classNames('top-item-content', { 'show-value': props.showValue !== false })}
        >
          <div className={'content-left'}>
            <div className={'content-left-title'}>{props.title}</div>
            {props.showValue !== false && <div className={'content-left-value'}>{props.value}</div>}
          </div>
          <div className={'content-right'}>{props.children}</div>
        </div>
        {props.footer !== false && props.footer.length ? (
          <div className={'top-item-footer'}>
            {props.footer.map((item) => {
              return (
                <>
                  <div>
                    {item.status ? (
                      <Badge status={item.status} text={item.title} />
                    ) : (
                      <span>{item.title}</span>
                    )}
                  </div>
                  <div className={'footer-item-value'}>{item.value}</div>
                </>
              );
            })}
          </div>
        ) : null}
      </div>
    </Col>
  );
};

const TopCard = (props: TopCardProps) => {
  return (
    <div className={classNames('dash-board-top', props.className)} style={props.style}>
      <Row gutter={24}>{props.children}</Row>
    </div>
  );
};

TopCard.Item = CardItem;

export default TopCard;
