import { useEffect, useMemo, useState } from 'react';
import { Dropdown, Tree } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import { onlyMessage } from '@/utils/util';

type DropdownButtonOptions = {
  title: string;
  key: string;
  children?: DropdownButtonOptions[];
  [key: string]: any;
};

interface DropdownButtonProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value?: string, item?: any) => void;
  options: DropdownButtonOptions[];
  isTree?: boolean;
  type: 'param' | 'termType' | 'value' | 'type';
  fieldNames?: any;
  showLabelKey?: string;
}

const TypeStyle = {
  param: styles.parameter,
  termType: styles.termType,
  value: styles.value,
  type: styles.type,
};

const DropdownButton = (props: DropdownButtonProps) => {
  const [myValue, setMyValue] = useState(props.value);
  const [label, setLabel] = useState('');
  const [, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const typeClassName = TypeStyle[props.type];

  const menuOnSelect = ({ key, item }: { key: string; item: any }) => {
    setOpen(false);

    props.onChange?.(key, item);
    setMyValue(key);
    let titleKey = 'title';
    if (props.showLabelKey) {
      titleKey = props.showLabelKey;
    }
    setLabel(item.props[titleKey]);
  };

  const treeSelect = (selectedKeys: (string | number)[], e: any) => {
    setOpen(false);

    props.onChange?.(selectedKeys[0] as string, e);
    setMyValue(selectedKeys[0] as string);

    let titleKey = 'title';
    if (props.showLabelKey) {
      titleKey = props.showLabelKey;
    }
    setLabel(e.node[titleKey]);
  };

  const menuOptions = {
    selectedKeys: myValue ? [myValue] : [],
    items: props.options?.map((item) => ({ ...item, label: item.title })) || [],
    onClick: menuOnSelect,
  };

  const DropdownRender = useMemo(() => {
    return (
      <div className={styles['dropdown-content']}>
        <Tree
          selectedKeys={myValue ? [myValue] : []}
          onSelect={treeSelect}
          treeData={props.options}
          fieldNames={props.fieldNames}
          height={500}
        />
      </div>
    );
  }, [props.options, myValue]);

  const _options = !props.isTree ? { menu: menuOptions } : { dropdownRender: () => DropdownRender };

  const findLable = (value: string, data: DropdownButtonOptions[]): boolean => {
    let isLabel = false;
    return data.some((item) => {
      if (item.key === value) {
        let titleKey = 'title';
        if (props.showLabelKey) {
          titleKey = props.showLabelKey;
        }
        setLabel(item[titleKey]);
        setLoading(false);
        isLabel = true;
      } else if (item.children) {
        isLabel = findLable(value, item.children);
      }
      return isLabel;
    });
  };

  useEffect(() => {
    setMyValue(props.value);
    if (!props.value) {
      setLabel('');
    } else {
      setLoading(true);
      findLable(props.value, props.options);
    }
  }, [props.value]);

  useEffect(() => {
    if (props.value) {
      findLable(props.value, props.options);
      setLoading(true);
    }
  }, [props.options]);

  return (
    <Dropdown {..._options} trigger={['click']} open={open} onOpenChange={setOpen}>
      <div
        className={classNames(styles['dropdown-button'], props.className, typeClassName)}
        onClick={() => {
          console.log(props.options);
          if (props.options.length === 0 && props.type !== 'termType') {
            onlyMessage('请先配置设备触发规则', 'warning');
          }
          if (props.options.length === 0 && props.type === 'termType') {
            onlyMessage('请先配置属性值', 'warning');
          }
        }}
      >
        {label || props.placeholder}
      </div>
    </Dropdown>
  );
};

export default DropdownButton;
