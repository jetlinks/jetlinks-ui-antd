import React, { useState, useEffect } from 'react';
import { Drawer, Tree, Button, message } from 'antd';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import encodeQueryParam from '@/utils/encodeParam';
import Service from '../service';

interface Props {
  close: Function;
  current: any;
}
const Auth = (props: Props) => {
  const service = new Service('open-api');
  const [treeData, setTreeData] = useState<{ children: any; title: any; key: any }[]>();

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<any[]>();

  useEffect(() => {
    const selected: string[] = [];
    zip(
      service.permission.auth(
        encodeQueryParam({
          terms: {
            dimensionTarget: props.current.id,
          },
        }),
      ),
      service.permission.query({}),
    )
      .pipe(
        map(list =>
          list[1].map(item => ({
            ...item,
            children: (item.children || []).map((i: any) => {
              const flag = (list[0].find(j => j.key === item.key)?.actions || []).includes(i.key);
              if (flag) selected.push(`${item.key}:${i.key}`);
              return {
                ...i,
                key: `${item.key}:${i.key}`,
                enabled: flag,
              };
            }),
          })),
        ),
      )
      .subscribe(data => {
        setTreeData(data);
        setExpandedKeys(data.map(item => item.key));
        setCheckedKeys(selected);
        setPermissions(data);
      });
  }, []);

  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (keys?: any) => {
    setCheckedKeys(keys);
    const list: { id: string; actions: string[] }[] = [];
    keys
      .filter((i: string) => i.indexOf(':') > 0)
      .forEach((j: string) => {
        const id = j.split(':')[0];
        const action = j.split(':')[1];
        const temp = list.findIndex(i => i.id === id);
        if (temp > -1) {
          list[temp].actions.push(action);
        } else {
          list.push({ id, actions: [action] });
        }
      });
    setPermissions(list);
    return list;
  };

  const onSelect = (selectedKeys, info) => {
    setSelectedKeys(selectedKeys);
  };

  const updateAuth = () => {
    const permissions = onCheck(checkedKeys);
    service.permission
      .save({
        targetId: props.current.id,
        targetType: 'open-api',
        permissionList: permissions,
      })
      .subscribe(() => {
        message.success('保存成功');
      });
  };
  return (
    <Drawer
      title="授权"
      width="50VW"
      visible
      onClose={() => props.close()}
      bodyStyle={{
        overflow: 'auto',
        height: '800px',
      }}
    >
      <Tree
        defaultExpandAll
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button
          onClick={() => {
            props.close();
          }}
          style={{ marginRight: 8 }}
        >
          关闭
        </Button>
        <Button
          onClick={() => {
            updateAuth();
          }}
          type="primary"
        >
          保存
        </Button>
      </div>
    </Drawer>
  );
};
export default Auth;
