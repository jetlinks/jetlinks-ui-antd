import { DownOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useState, useEffect, useRef, ReactNode } from 'react';
import './index.less';
import classNames from 'classnames';
import { InputProps } from 'antd/lib/input/Input';

export interface ItemProps {
  key: string;
  label: string;
  content: ReactNode;
}

interface Props {
  placeholder?: string;
  value: any;
  onChange: (dt: any) => void;
  inputProps?: InputProps;
  itemList: ItemProps[];
  style?: object;
  tabKey: string;
}

export default (props: Props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState<string>(props?.tabKey || props.itemList[0]?.key);
  const wrapperRef = useRef<any>(null);
  const nodeRef = useRef<any>(null);
  const [value, setValue] = useState<any>(props.value);
  // const [showValue, setShowValue] = useState<string | undefined>('');

  useEffect(() => {
    setTabKey(props.tabKey);
  }, [props.tabKey]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleClick = (e: any) => {
    if (visible && e.target) {
      if (!(wrapperRef.current && wrapperRef.current.contains(e.target))) {
        setVisible(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  });

  // const contentRender = (item: ItemProps | undefined) => {
  //   switch (item?.type) {
  //     case 'time-picker':
  //       return <MTimePicker {...item.children} value={value} onChange={(time: any, timeString: string) => {
  //         setShowValue(timeString)
  //         console.log(timeString)
  //         setValue(time)
  //       }} />;
  //     case 'tree':
  //       return <Tree {...item.children} height={300} defaultExpandAll />
  //     default:
  //       return null;
  //   }
  // }

  return (
    <div className={'select-wrapper'} ref={wrapperRef} style={props.style}>
      <Input
        suffix={<DownOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
        {...props.inputProps}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onFocus={() => {
          setVisible(true);
        }}
      />
      {visible && (
        <div className={'select-container'} ref={nodeRef}>
          <div className={'select-box'}>
            <div className={'select-box-header-top'}>
              <div className={'select-box-header'}>
                {(props.itemList || []).map((item) => (
                  <div
                    key={item.key}
                    className={classNames(
                      'select-header-title',
                      item.key === tabKey ? 'active' : '',
                    )}
                    onClick={() => {
                      setTabKey(item.key);
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            <div className={'select-box-content'}>
              {
                (props?.itemList || []).find((item) => item.key === tabKey)?.content || ''
                // contentRender((props?.itemList || []).find(item => item.key === tabKey))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
