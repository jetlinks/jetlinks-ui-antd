import React from 'react';
import { Icon } from 'antd';
import { IconProps } from 'antd/es/icon';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2610877_zfpdk9n2me.js',
});

function AliFont(props: IconProps) {
  return (
    <IconFont {...props} />
  );
}

export default AliFont;
