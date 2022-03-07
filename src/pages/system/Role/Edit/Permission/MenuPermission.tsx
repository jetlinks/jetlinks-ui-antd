import { CaretDownOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/lib/checkbox/Group';
import _ from 'lodash';
import { useEffect, useState } from 'react';

interface Props {
  value: any;
  initialValues: any;
  check?: boolean;
  change: (data: any) => void;
}

const MenuPermission = (props: Props) => {
  const { value } = props;
  const [checkAll, setCheckAll] = useState<boolean>(
    value.buttons?.length > 0 || value.children?.length > 0
      ? (props.initialValues?.buttons?.length || 0) +
          ((props.initialValues?.children || []).filter((item: any) => item.check)?.length || 0) ===
          (value.buttons?.length || 0) + (value.children?.length || 0)
      : props.initialValues.check,
  );
  const [menuList, setMenuList] = useState<any[]>(props.initialValues?.buttons || []);
  const [visible, setVisible] = useState<boolean>(true);
  const [children, setChildren] = useState<any>({});
  const [initialChildrenValues, setInitialChildrenValues] = useState<any[]>(
    props.initialValues?.children || [],
  );
  const [indeterminate, setIndeterminate] = useState<boolean>(
    props.initialValues?.indeterminate || false,
  );

  useEffect(() => {
    if (props.initialValues && Object.keys(props.initialValues).length > 0) {
      setMenuList(props.initialValues?.buttons || []);
      setIndeterminate(props.initialValues?.indeterminate);
      setCheckAll(props?.initialValues?.check);
      setInitialChildrenValues(props.initialValues?.children || []);
    } else {
      setMenuList([]);
      setInitialChildrenValues([]);
      setIndeterminate(false);
      setCheckAll(false);
    }
  }, [props.initialValues]);

  const getInitValues = (list: any[]) => {
    if (Array.isArray(list) && list.length > 0) {
      return list.map((item) => {
        let child: any[] = [];
        if (item.children && item.children.length > 0) {
          child = getInitValues(item.children);
        }
        return {
          id: item.id,
          check: true,
          indeterminate: false,
          buttons: item.buttons && item.buttons.length > 0 ? _.map(item.buttons, 'id') : [],
          children: child,
        };
      });
    }
    return [];
  };

  useEffect(() => {
    const list = initialChildrenValues.map((item) => {
      if (item.id === children.id) return children;
      return item;
    });
    const flag = list.find((i) => i.id === children.id);
    if (!flag) {
      list.push(children);
    }
    const lenB = menuList?.length || 0;
    const ilen: number = (list || []).filter((i: any) => i.indeterminate || i.check)?.length || 0;
    const clen: number = (list || []).filter((i: any) => i.check)?.length || 0;
    const check = clen + lenB === (value?.children?.length || 0) + (value?.buttons?.length || 0);
    setIndeterminate((ilen > 0 || lenB > 0) && !check);
    setCheckAll(check);
    props.change({
      id: value.id,
      indeterminate: (ilen > 0 || lenB > 0) && !check,
      check: check,
      children: [...list],
      buttons: [...menuList],
    });
  }, [children]);

  return (
    <div key={value?.id} style={{ margin: '10px 0' }}>
      <div
        style={{
          display: 'flex',
          padding: '10px 0',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
          transition: 'background .3s',
        }}
      >
        <div
          style={{
            marginRight: '10px',
            width: '15px',
            transform: !visible ? 'rotate(-90deg)' : 'none',
          }}
        >
          {value?.children && value?.children?.length > 0 && (
            <CaretDownOutlined
              onClick={() => {
                setVisible(!visible);
              }}
            />
          )}
        </div>
        <div>
          <Checkbox
            indeterminate={indeterminate}
            checked={checkAll}
            style={{ width: '200px' }}
            onChange={(e) => {
              setCheckAll(e.target.checked);
              setIndeterminate(false);
              const data = e.target.checked ? (value?.buttons || []).map((i: any) => i.id) : [];
              setMenuList([...data]);
              const initialData = e.target.checked ? [...getInitValues(value?.children || [])] : [];
              props.change({
                id: value.id,
                check: e.target.checked,
                indeterminate: false,
                children: [...initialData],
                buttons: [...data],
              });
            }}
          >
            {value?.name}
          </Checkbox>
        </div>
        <div>
          <Checkbox.Group
            name={value?.id}
            value={menuList}
            onChange={(data: CheckboxValueType[]) => {
              const len = (value.buttons?.length || 0) + (value.children?.length || 0);
              const lenB = data?.length || 0;
              const lenC = initialChildrenValues?.length || 0;
              setIndeterminate(lenB + lenC < len);
              setCheckAll(lenB + lenC === len);
              setMenuList([...data]);
              props.change({
                id: value.id,
                check: lenB + lenC === len,
                indeterminate: !(lenB + lenC === len),
                children: [...initialChildrenValues],
                buttons: [...data],
              });
            }}
            options={(value?.buttons || []).map((i: any) => ({
              label: i.name,
              value: i.id,
              key: i.id,
            }))}
          />
        </div>
      </div>
      {visible && value?.children && (
        <div style={{ paddingLeft: '20px' }}>
          {(value?.children || []).map((item: { id: string }) => (
            <div key={item.id}>
              <MenuPermission
                initialValues={
                  (initialChildrenValues || []).find((i: any) => i.id === item.id) || {}
                }
                value={item}
                change={(data: any) => {
                  if (Object.keys(data).length > 0) {
                    setChildren(data);
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MenuPermission;
