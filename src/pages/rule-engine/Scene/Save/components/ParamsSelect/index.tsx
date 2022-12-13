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
  labelValue?: string;
}

export default (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState<string>(props?.tabKey || props.itemList[0]?.key);
  const [value, setValue] = useState<any>(props.value);

  useEffect(() => {
    setTabKey(props.tabKey);
  }, [props.tabKey]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (props.labelValue) {
      setValue(props.labelValue);
    }
  }, [props.labelValue]);

  useEffect(() => {
    if (props.open !== undefined) {
      setOpen(props.open);
    }
  }, [props.open]);

  return (
    <Dropdown
      trigger={['click']}
      open={open}
      onOpenChange={(val) => {
        if (props.openChange) {
          props.openChange(val);
        }
      }}
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
                    setValue(undefined);
                    props.onChange(undefined, item.key);
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
          readOnly
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            props.onChange(value, tabKey);
          }}
        />
      )}
    </Dropdown>
  );
};
