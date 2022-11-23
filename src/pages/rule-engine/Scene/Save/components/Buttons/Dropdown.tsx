import { useEffect, useMemo, useState } from 'react';
import { Dropdown, Tree } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

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
  onChange?: (value?: string) => void;
  options: DropdownButtonOptions[];
  isTree?: boolean;
  type: 'param' | 'termType' | 'value' | 'type';
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
  const [loading, setLoading] = useState(false);

  const typeClassName = TypeStyle[props.type];

  const menuOnSelect = ({ key, item }: { key: string; item: any }) => {
    props.onChange?.(key);
    setMyValue(key);
    setLabel(item.props.title);
  };

  const treeSelect = (selectedKeys: (string | number)[], e: any) => {
    props.onChange?.(selectedKeys[0] as string);
    setMyValue(selectedKeys[0] as string);
    setLabel(e.node.title);
  };

  const menuOptions = {
    selectedKeys: myValue ? [myValue] : [],
    items: props.options.map((item) => ({ ...item, label: item.title })),
    onClick: menuOnSelect,
  };

  const DropdownRender = useMemo(() => {
    return (
      <Tree
        selectedKeys={myValue ? [myValue] : []}
        onSelect={treeSelect}
        treeData={props.options}
      />
    );
  }, [props.options]);

  const _options = !props.isTree ? { menu: menuOptions } : { dropdownRender: () => DropdownRender };

  const findLable = (value: string, data: DropdownButtonOptions[]): boolean => {
    let isLabel = false;
    return data.some((item) => {
      if (item.key === value) {
        setLabel(item.title);
        isLabel = true;
      } else if (item.children) {
        isLabel = findLable(value, item.children);
      }
      return isLabel;
    });
  };

  useEffect(() => {
    setMyValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (myValue && !loading) {
      findLable(myValue, props.options);
      setLoading(true);
    }
  }, [props.options]);

  return (
    <Dropdown {..._options} trigger={['click']}>
      <div className={classNames(styles['dropdown-button'], props.className, typeClassName)}>
        {label || props.placeholder}
      </div>
    </Dropdown>
  );
};

export default DropdownButton;
