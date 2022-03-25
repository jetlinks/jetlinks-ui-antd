import React, { useEffect, useRef, useState } from 'react';
import { Checkbox } from 'antd';
import './permission.less';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { PermissionInfo } from '../typing';
import { useIntl } from 'umi';

type PermissionDataType = {
  action: string;
  id: string;
  name: string;
  checked?: boolean;
  actions: PermissionDataType[];
};

type PermissionType = {
  value?: {
    permission: string;
    actions: string[];
  }[];
  data: PermissionDataType[];
  title?: React.ReactNode | string;
  onChange?: (data: PermissionInfo[]) => void;
  disabled?: boolean;
};

type ParentNodeChange = { checkedAll: boolean; list: string[]; id: string; state: boolean };

type ParentNodeType = {
  id: string;
  name: string;
  actions: PermissionDataType[];
  onChange?: (value: ParentNodeChange) => void;
  disabled?: boolean;
  checked?: boolean;
  state?: boolean;
};

type CheckItem = Omit<ParentNodeType, 'onChange'>;

const ParentNode = (props: ParentNodeType) => {
  const { actions, checked } = props;

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const submitData = (checkedAll: boolean, list: string[], state: boolean) => {
    if (props.onChange) {
      props.onChange({
        checkedAll,
        list,
        id: props.id,
        state,
      });
    }
  };

  const onChange = (list: any) => {
    const _indeterminate = !!list.length && list.length < props.actions.length;
    setCheckedList(list);
    setIndeterminate(_indeterminate);
    setCheckAll(list.length === props.actions.length);
    submitData(list.length === props.actions.length, list, _indeterminate);
  };

  const onChangeAll = (e: CheckboxChangeEvent) => {
    const _list = e.target.checked ? props.actions.map((item) => item.action) : [];
    setCheckedList(e.target.checked ? _list : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    submitData(e.target.checked, _list, false);
  };

  useEffect(() => {
    onChangeAll({
      target: {
        checked: !!props.checked,
      },
    } as CheckboxChangeEvent);
    /* eslint-disable */
  }, [checked]);

  useEffect(() => {
    // 通过父级传入checked来控制节点状态
    const _list = props.actions.filter((a) => a.checked).map((a) => a.action);
    onChange(_list);
    /* eslint-disable */
  }, [actions]);

  return (
    <div className="permission-items">
      <div className="permission-parent">
        <Checkbox
          id={props.id}
          onChange={onChangeAll}
          indeterminate={indeterminate}
          checked={checkAll}
          disabled={props.disabled}
        >
          {props.name}
        </Checkbox>
      </div>
      <div className="permission-children-checkbox">
        <Checkbox.Group
          onChange={onChange}
          value={checkedList}
          disabled={props.disabled}
          options={props.actions
            .filter((a) => a.action)
            .map((item) => {
              return {
                label: item.name,
                value: item.action,
              };
            })}
        />
      </div>
    </div>
  );
};

export default (props: PermissionType) => {
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [nodes, setNodes] = useState<React.ReactNode>([]);
  const checkListRef = useRef<CheckItem[]>([]);
  const intl = useIntl();

  const onChange = (list: CheckItem[]) => {
    if (props.onChange) {
      const _list = list
        .filter((a) => a.checked || a.actions.filter((b) => b.checked).length)
        .map((item) => ({
          permission: item.id,
          actions: item.actions.filter((b) => b.checked).map((b) => b.action),
        }));
      props.onChange(_list);
    }
  };

  /**
   * 全选或者全部取消
   * @param e
   */
  const onChangeAll = (e: CheckboxChangeEvent) => {
    const _list = props.data.map((item) => {
      return {
        ...item,
        actions: item.actions.map((a) => ({ ...a, checked: e.target.checked })),
        state: false,
        checked: e.target.checked,
      };
    });
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    // setCheckedList(_list)
    checkListRef.current = _list;
    onChange(_list);
    setNodes(createContentNode(_list));
  };

  const parentChange = (value: ParentNodeChange) => {
    let indeterminateCount = 0;
    let _checkAll = 0;
    const list = checkListRef.current.map((item) => {
      const _checked = item.id === value.id ? value.checkedAll : item.checked;
      const _state = item.id === value.id ? value.state : item.state;
      const actions =
        item.id === value.id
          ? item.actions.map((a) => ({ ...a, checked: value.list.includes(a.action) }))
          : item.actions;
      if (_checked) {
        // 父checkbox为全选或者有子节点被选中
        _checkAll += 1;
        indeterminateCount += 1;
      } else if (_state) {
        // 父checkbox下
        indeterminateCount += 1;
      }

      return {
        ...item,
        actions,
        state: _state,
        checked: _checked,
      };
    });
    // 如果全部选中，则取消半选状态
    const isIndeterminate =
      _checkAll === list.length && _checkAll !== 0 ? false : !!indeterminateCount;
    setIndeterminate(isIndeterminate);
    setCheckAll(_checkAll === list.length && _checkAll !== 0);
    // setCheckedList(list)
    checkListRef.current = list;
    onChange(list);
  };

  /**
   * 创建节点
   */
  function createContentNode(data: CheckItem[]): React.ReactNode[] {
    const NodeArr: React.ReactNode[] = [];
    if (data && data.length) {
      data.forEach((item) => {
        if (item.actions) {
          // 父节点
          NodeArr.push(
            <ParentNode
              {...item}
              key={item.id}
              disabled={props.disabled}
              onChange={parentChange}
            />,
          );
        }
      });
    }
    return NodeArr;
  }

  /**
   * 初始化树形节点数据格式
   * @param data
   */
  const initialState = (data: PermissionDataType[]) => {
    const _list = data.map((item) => {
      const propsPermission =
        props.value && props.value.length
          ? props.value.find((p) => p.permission === item.id)
          : undefined;
      const propsActions = propsPermission ? propsPermission.actions : [];
      return {
        ...item,
        actions: item.actions
          .filter((action) => Object.keys(action).length)
          .map((a) => ({ ...a, checked: propsActions.includes(a.action) })),
        state: false, // 是否为半选中状态
        checked: false, // 是否为全选
      };
    });
    // setCheckedList(_list)
    checkListRef.current = _list;
    setNodes(createContentNode(_list));
  };

  useEffect(() => {
    if (props.data) {
      initialState(props.data);
    }
    /* eslint-disable */
  }, [props.data, props.disabled]);

  return (
    <div className="permission-container">
      <div className="permission-header">{props.title}</div>
      <div className="permission-content">
        <div className="permission-items">
          <div className="permission-parent">
            <Checkbox
              onChange={onChangeAll}
              indeterminate={indeterminate}
              checked={checkAll}
              disabled={props.disabled}
            >
              {intl.formatMessage({
                id: 'pages.system.menu.root',
                defaultMessage: '菜单权限',
              })}
            </Checkbox>
          </div>
        </div>
        {nodes}
      </div>
    </div>
  );
};
