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
import { observer } from '@formily/react';
import { NotifyModel } from '../../index';
import { FormModel } from '@/pages/rule-engine/Scene/Save';

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

const labelMap = new Map();

export default observer((props: UserProps) => {
  const [source, setSource] = useState<string | undefined>(props.value?.source || '');
  const [value, setValue] = useState<string | string[] | undefined>(undefined);
  const [relationList, setRelationList] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<any[]>([
    { name: '平台用户', id: 'p1', selectable: false, children: [] },
  ]);

  useEffect(() => {
    if (NotifyModel?.notify?.notifyType === 'email' && Array.isArray(props.value)) {
      setSource('relation');
      const arr = (props?.value || []).map((item: any) => {
        if (item?.source === 'relation') {
          const relation = item?.relation;
          if (relation) {
            if (relation.objectId) {
              // 平台用户
              return relation.objectId;
            } else {
              // 关系用户
              return relation.related.relation;
            }
          }
        } else {
          return item?.value;
        }
      });
      setValue(arr);
    } else {
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
    }
  }, [props.value]);

  const getPlatformUser = async () => {
    const newTree = [{ name: '平台用户', id: 'p1', selectable: false, children: [] }];
    const platformResp = await queryPlatformUsers();

    if (platformResp.status === 200) {
      newTree[0].children = platformResp.result;
    }
    if (FormModel.current?.trigger?.type && source === 'relation') {
      if (FormModel.current?.trigger?.type === 'device') {
        const relationResp = await queryRelationUsers();
        if (relationResp.status === 200) {
          newTree.push({
            name: '关系用户',
            id: 'p2',
            selectable: false,
            children: relationResp.result,
          });
        }
      } else {
        if (newTree.length > 1) {
          newTree.splice(1, 1);
        }
      }
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

  const getObj = (_source: string = 'fixed', _value?: string | string[], isRelation?: boolean) => {
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
    return obj;
  };

  const onchange = (
    _source: string = 'fixed',
    _value?: string | string[],
    isRelation?: boolean,
    _name?: string,
  ) => {
    let _values: any = undefined;
    const _names: string[] = [_name || ''];
    if (Array.isArray(_value)) {
      if (NotifyModel?.notify?.notifyType === 'email') {
        if (isRelation) {
          const arr = _value.map((item) => {
            const _item = labelMap.get(item);
            _names.push(_item?.name || '');
            return getObj('relation', item, _item?.relation);
          });
          _values = arr;
        } else {
          _values = getObj(_source, _value, false);
        }
      }
    } else {
      _values = getObj(_source, _value, isRelation);
    }
    if (props.onChange) {
      NotifyModel.notify.options = {
        ...NotifyModel.notify.options,
        sendTo: _names.filter((item) => !!item).join(','),
      };
      props.onChange(_values);
    }
  };

  const filterOption = (input: string, option: any) => {
    return option.name ? option.name.toLowerCase().includes(input.toLowerCase()) : false;
  };

  const createTreeNode = (data: any): React.ReactNode => {
    return data.map((item: any) => {
      if (item.children) {
        return (
          <TreeSelect.TreeNode key={item.id} value={item.id} title={item.name} selectable={false}>
            {createTreeNode(item.children)}
          </TreeSelect.TreeNode>
        );
      } else {
        labelMap.set(item.id, item);
        return (
          <TreeSelect.TreeNode
            {...item}
            name={item.name}
            value={item.id}
            key={item.id}
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
          onchange(source, key, node?.relation, node.name);
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
          onchange(source, key, false, option?.label || option?.name);
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
        multiple={true}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={'请选择收信人'}
        onChange={(val) => {
          setValue(val);
          onchange(source, val);
        }}
        filterTreeNode={filterOption}
      >
        {createTreeNode(treeData)}
      </TreeSelect>
    ) : (
      // <Input
      //   value={value}
      //   placeholder={'请输入固定邮箱'}
      //   onChange={(e) => {
      //     onchange(source, e.target.value, false, e.target.value);
      //   }}
      // />
      <Select
        value={value}
        mode={'tags'}
        placeholder={'请输入收件人邮箱,多个收件人用换行分隔'}
        onChange={(val) => {
          onchange(source, val, false, Array.isArray(val) ? val.join(',') : val);
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
          onchange(source, key, node?.relation, node.name);
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
