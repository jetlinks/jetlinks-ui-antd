import React from 'react';
import { Icon } from 'antd';
import { IconProps } from 'antd/es/icon';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2610877_c2drp78uk2.js',
});

function AliFont(props: IconProps) {
  return (
    <IconFont {...props} />
  );
}

export default AliFont;
