import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Dropdown, Empty, Tree } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import { onlyMessage } from '@/utils/util';
import { useOption } from '@/pages/rule-engine/Scene/Save/components/Buttons/index';

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
  icon?: ReactNode;
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
  // const [, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const typeClassName = TypeStyle[props.type];

  const { paramOptions, valueOptions } = useOption(props.options, props.fieldNames?.value);

  const convertLabelValue = useCallback(
    (key?: string) => {
      if (key && paramOptions.length) {
        const labelOptions = valueOptions.get(key);
        if (labelOptions) {
          const nameKey = props.showLabelKey || 'title';
          setLabel(labelOptions[nameKey]);
        } else {
          setLabel(key);
        }
      } else {
        setLabel(key!);
      }
    },
    [paramOptions, valueOptions, props.fieldNames, props.showLabelKey],
  );

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
        />
      </div>
    );
  }, [props.options, myValue]);

  const _options = !props.isTree
    ? {
        menu: menuOptions,
        dropdownRender: (menu: any) => {
          if (!menuOptions.items.length) {
            return (
              <div
                className={styles['dropdown-content']}
                style={{ background: '#fff', padding: '0 16px' }}
              >
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            );
          }
          return menu;
        },
      }
    : { dropdownRender: () => DropdownRender };

  useEffect(() => {
    setMyValue(props.value);
    if (!props.value) {
      setLabel('');
    } else {
      // setLoading(true);
      // findLabel(props.value, props.options);
    }
    convertLabelValue(props.value);
  }, [props.value]);

  useEffect(() => {
    convertLabelValue(props.value);
  }, [props.options]);

  return (
    <Dropdown {..._options} trigger={['click']} open={open} onOpenChange={setOpen}>
      <div
        className={classNames(styles['dropdown-button'], props.className, typeClassName)}
        onClick={() => {
          if (props.options.length === 0 && props.type !== 'termType') {
            onlyMessage('请先配置设备触发规则', 'warning');
          }
          if (props.options.length === 0 && props.type === 'termType') {
            onlyMessage('请先配置属性值', 'warning');
          }
        }}
      >
        {props.icon}
        {label ? label : props.placeholder}
      </div>
    </Dropdown>
  );
};

export default DropdownButton;
