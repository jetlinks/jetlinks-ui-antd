import React from 'react';
import './title.less';

interface TitleProps {
  title: string | React.ReactNode;
  toolbarRender?: React.ReactNode;
}

export default (props: TitleProps) => {
  return (
    <div className={'descriptions-title'}>
      <span>{props.title}</span>
      {props.toolbarRender}
    </div>
  );
};
