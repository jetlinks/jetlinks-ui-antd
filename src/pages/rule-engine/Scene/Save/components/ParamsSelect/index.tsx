import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Input } from 'antd';
import { useState, useEffect, ReactNode } from 'react';
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
  bodyStyle?: object;
  tabKey: string;
  type?: string;
  className?: string | string[];
  children?: ReactNode;
  open?: boolean;
  openChange?: (open: boolean) => void;
}

export default (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState<string>(props?.tabKey || props.itemList[0]?.key);
  // const wrapperRef = useRef<any>(null);
  // const nodeRef = useRef<any>(null);
  const [value, setValue] = useState<any>(props.value);

  useEffect(() => {
    setTabKey(props.tabKey);
  }, [props.tabKey]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (props.open !== undefined) {
      setOpen(props.open);
    }
  }, [props.open]);

  // const handleClick = (e: any) => {
  //   if (open && e.target) {
  //     if (!(wrapperRef.current && wrapperRef.current.contains(e.target))) {
  //       setOpen(false);
  //       props.openChange?.(false);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('click', handleClick);
  //   return () => {
  //     window.removeEventListener('click', handleClick);
  //   };
  // });

  // useEffect(() => {
  //   props.onChange(value, tabKey);
  // }, [value, tabKey]);
  // const _bosyStyle = props.bodyStyle || {};

  return (
    <Dropdown
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      dropdownRender={() => (
        <div className="select-box">
          <div className={'select-box-header-top'}>
            <div className={'select-box-header'}>
              {(props.itemList || []).map((item) => (
                <div
                  key={item.key}
                  className={classNames('select-header-title', item.key === tabKey ? 'active' : '')}
                  onClick={() => {
                    setTabKey(item.key);
                    props.onChange(value, item.key);
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <div className={'select-box-content'}>
            {(props?.itemList || []).find((item) => item.key === tabKey)?.content || ''}
          </div>
        </div>
      )}
    >
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
            setOpen(true);
            props.openChange?.(true);
          }}
        />
      )}
    </Dropdown>
  );
};
