import classNames from 'classnames';
import React from 'react';

interface TitleProps {
  title: string;
  english?: string;
  className?: string;
  extra?: React.ReactNode | string;
}

export default (props: TitleProps) => {
  return (
    <div className={classNames('home-title', props.className)}>
      <span>{props.title}</span>
      <div>{props.extra}</div>
      {props.english && <div className={'home-title-english'}>{props.english}</div>}
    </div>
  );
};
