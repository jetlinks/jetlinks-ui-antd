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
  onChange: (valeu: any, sources?: any) => void;
  inputProps?: InputProps;
  itemList: ItemProps[];
  style?: object;
  tabKey: string;
  type?: string;
  className?: string | string[];
  children?: ReactNode;
  open?: boolean;
  openChange?: (open: boolean) => void;
}

export default (props: Props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState<string>(props?.tabKey || props.itemList[0]?.key);
  const wrapperRef = useRef<any>(null);
  const nodeRef = useRef<any>(null);
  const [value, setValue] = useState<any>(props.value);

  useEffect(() => {
    setTabKey(props.tabKey);
  }, [props.tabKey]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (props.open !== undefined) {
      setVisible(props.open);
    }
  }, [props.open]);

  const handleClick = (e: any) => {
    if (visible && e.target) {
      if (!(wrapperRef.current && wrapperRef.current.contains(e.target))) {
        setVisible(false);
        props.openChange?.(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  });

  useEffect(() => {
    props.onChange(value, tabKey);
  }, [value, tabKey]);

  return (
    <div className={'select-wrapper'} ref={wrapperRef} style={props.style}>
      {props.children ? (
        props.children
      ) : (
        <Input
          suffix={<DownOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
          {...props.inputProps}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onFocus={() => {
            setVisible(true);
            props.openChange?.(true);
          }}
        />
      )}
      {visible && (
        <div
          className={'select-container'}
          ref={nodeRef}
          style={props.type !== 'date' ? { minHeight: 100 } : undefined}
        >
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
