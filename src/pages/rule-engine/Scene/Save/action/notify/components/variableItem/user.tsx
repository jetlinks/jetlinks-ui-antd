// 收信人
import { useEffect, useState } from 'react';
import { ItemGroup } from '@/pages/rule-engine/Scene/Save/components';
import { Input, Select, TreeSelect } from 'antd';
import {
  queryDingTalkUsers,
  queryPlatformUsers,
  queryRelationUsers,
  queryWechatUsers,
} from '@/pages/rule-engine/Scene/Save/action/service';
import { useLocation } from '@/hooks';
import { observer } from '@formily/react';
import { NotifyModel } from '../../index';

type ChangeType = {
  source?: string;
  value?: string;
  relation?: any;
};

interface UserProps {
  value?: ChangeType;
  onChange?: (value: ChangeType) => void;
  type?: string;
}

export default observer((props: UserProps) => {
  const [source, setSource] = useState<string | undefined>(props.value?.source || '');
  const [value, setValue] = useState<string | undefined>(undefined);
  const [relationList, setRelationList] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<any[]>([
    { name: '平台用户', id: 'p1', selectable: false, children: [] },
  ]);

  const location = useLocation();

  useEffect(() => {
    setSource(props.value?.source);
    if (props.value?.source === 'relation') {
      const relation = props.value?.relation;
      if (relation) {
        if (relation.objectId) {
          // 平台用户
          setValue(relation.objectId);
        } else {
          // 关系用户
          setValue(relation.related?.relation);
        }
      }
    } else {
      setValue(props.value?.value);
    }
  }, [props.value]);

  const getPlatformUser = async () => {
    const newTree = [...treeData];
    const platformResp = await queryPlatformUsers();

    if (platformResp.status === 200) {
      newTree[0].children = platformResp.result;
    }

    setTreeData(newTree);
  };

  const getRelationUsers = async (notifyType: string, configId: string) => {
    if (notifyType === 'dingTalk') {
      const resp = await queryDingTalkUsers(configId);
      if (resp.status === 200) {
        setRelationList(resp.result);
      }
    } else {
      const resp = await queryWechatUsers(configId);
      if (resp.status === 200) {
        setRelationList(resp.result);
      }
    }
  };

  useEffect(() => {
    if (
      source === 'fixed' &&
      ['dingTalk', 'weixin'].includes(NotifyModel.notify?.notifyType || '')
    ) {
      // 钉钉，微信用户
      getRelationUsers(NotifyModel.notify?.notifyType || '', NotifyModel.notify?.notifierId || '');
    } else {
      getPlatformUser();
    }
  }, [source, NotifyModel.notify.notifyType]);

  const options = [
    { label: '平台用户', value: 'relation' },
    {
      label: NotifyModel.notify.notifyType === 'dingTalk' ? '钉钉用户' : '微信用户',
      value: 'fixed',
    },
  ];

  const otherOptions = [
    { label: '平台用户', value: 'relation' },
    {
      label:
        NotifyModel.notify.notifyType && NotifyModel.notify.notifyType === 'email'
          ? '固定邮箱'
          : '固定号码',
      value: 'fixed',
    },
  ];

  const onchange = (
    _source: string = 'fixed',
    _value?: string,
    isRelation?: boolean,
    _name?: string,
  ) => {
    const obj: any = {
      source: _source,
    };
    if (_source === 'relation') {
      if (isRelation) {
        obj.relation = {
          objectType: 'device',
          objectSource: {
            source: 'upper',
            upperKey: 'deviceId',
          },
          related: {
            objectType: 'user',
            relation: _value,
          },
        };
      } else {
        obj.relation = {
          objectType: 'user',
          objectId: _value,
        };
      }
    } else {
      obj.value = _value;
    }

    if (props.onChange) {
      NotifyModel.notify.options = {
        ...NotifyModel.notify.options,
        sendTo: _name,
      };
      props.onChange(obj);
    }
  };

  useEffect(() => {
    if (props.type && source === 'relation') {
      const newTree = [...treeData];
      if (props.type === 'device') {
        queryRelationUsers().then((relationResp) => {
          if (relationResp.status === 200) {
            newTree.push({
              name: '关系用户',
              id: 'p2',
              selectable: false,
              children: relationResp.result,
            });
            setTreeData(newTree);
          }
        });
      } else {
        if (newTree.length > 1) {
          newTree.splice(1, 1);
          setTreeData(newTree);
        }
      }

      if (!location.query?.id) {
        onchange(props.value?.source, '', false, '');
      }
    }
  }, [props.type, source]);

  const filterOption = (input: string, option: any) => {
    return option.name ? option.name.toLowerCase().includes(input.toLowerCase()) : false;
  };

  const createTreeNode = (data: any): React.ReactNode => {
    return data.map((item: any) => {
      if (item.children) {
        return (
          <TreeSelect.TreeNode value={item.id} title={item.name} selectable={false}>
            {createTreeNode(item.children)}
          </TreeSelect.TreeNode>
        );
      } else {
        return (
          <TreeSelect.TreeNode
            name={item.name}
            value={item.id}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.name}</span>
                <span style={{ color: '#cfcfcf' }}>{item.username}</span>
              </div>
            }
          />
        );
      }
    });
  };

  const userSelect =
    source === 'relation' ? (
      <TreeSelect
        showSearch
        allowClear
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={'请选择收信人'}
        onSelect={(key: any, node: any) => {
          setValue(key);
          onchange(source, key, node.isRelation, node.name);
        }}
        filterTreeNode={filterOption}
      >
        {createTreeNode(treeData)}
      </TreeSelect>
    ) : (
      <Select
        showSearch
        allowClear
        value={value}
        options={relationList}
        listHeight={200}
        onChange={(key, option) => {
          setValue(key);
          onchange(source, key, false, option?.label);
        }}
        fieldNames={{ label: 'name', value: 'id' }}
        placeholder={'请选择收信人'}
        filterOption={(input: string, option: any) => {
          return option.name ? option.name.toLowerCase().includes(input.toLowerCase()) : false;
        }}
      />
    );

  const emailSelect =
    source === 'relation' ? (
      <TreeSelect
        showSearch
        allowClear
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={'请选择收信人'}
        onSelect={(key: any, node: any) => {
          setValue(key);
          onchange(source, key, node.isRelation, node.name);
        }}
        filterTreeNode={filterOption}
      >
        {createTreeNode(treeData)}
      </TreeSelect>
    ) : (
      <Input
        value={value}
        placeholder={'请输入固定邮箱'}
        onChange={(e) => {
          onchange(source, e.target.value, false, e.target.value);
        }}
      />
    );

  const voiceSelect =
    source === 'relation' ? (
      <TreeSelect
        showSearch
        allowClear
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={'请选择收信人'}
        onSelect={(key: any, node: any) => {
          setValue(key);
          onchange(source, key, node.isRelation, node.name);
        }}
        filterTreeNode={filterOption}
      >
        {createTreeNode(treeData)}
      </TreeSelect>
    ) : (
      <Input
        value={value}
        placeholder={'请输入固定号码'}
        onChange={(e) => {
          onchange(source, e.target.value, false, e.target.value);
        }}
      />
    );

  return (
    <ItemGroup compact>
      <Select
        value={source}
        options={
          NotifyModel.notify.notifyType &&
          ['dingTalk', 'weixin'].includes(NotifyModel.notify.notifyType)
            ? options
            : otherOptions
        }
        style={{ width: 120 }}
        onChange={(key) => {
          setSource(key);
          onchange(key, undefined, false, '');
        }}
      />
      {NotifyModel.notify.notifyType &&
      ['dingTalk', 'weixin'].includes(NotifyModel.notify.notifyType)
        ? userSelect
        : null}
      {NotifyModel.notify.notifyType && ['email'].includes(NotifyModel.notify.notifyType)
        ? emailSelect
        : null}
      {NotifyModel.notify.notifyType && ['sms', 'voice'].includes(NotifyModel.notify.notifyType)
        ? voiceSelect
        : null}
    </ItemGroup>
  );
});
