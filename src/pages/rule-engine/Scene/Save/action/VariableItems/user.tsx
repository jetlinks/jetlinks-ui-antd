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
import { useLocation } from 'umi';

type ChangeType = {
  source?: string;
  value?: string;
  relation?: any;
};

interface UserProps {
  notifyType: string;
  configId: string;
  value?: ChangeType;
  type?: string;
  onChange?: (value: ChangeType) => void;
  id?: string;
}

export default (props: UserProps) => {
  const [source, setSource] = useState(props.value?.source);
  const [value, setValue] = useState<string | undefined>();
  const [relationList, setRelationList] = useState([]);
  const [treeData, setTreeData] = useState([
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
    if (source === 'fixed' && ['dingTalk', 'weixin'].includes(props.notifyType)) {
      // 钉钉，微信用户
      getRelationUsers(props.notifyType, props.configId);
    } else {
      getPlatformUser();
    }
  }, [source, props.notifyType]);

  const options = [
    { label: '平台用户', value: 'relation' },
    { label: props.notifyType === 'dingTalk' ? '钉钉用户' : '微信用户', value: 'fixed' },
  ];

  const otherOptions = [
    { label: '平台用户', value: 'relation' },
    {
      label: props.notifyType && props.notifyType === 'email' ? '固定邮箱' : '固定号码',
      value: 'fixed',
    },
  ];

  /**
   * 收信人-平台用户格式
   * {
   *   source: 'relation',
   *   relation: {
   *     related: {
   *       objectType: 'user',
   *       relation: 'userId'
   *     }
   *   }
   * }
   * 收信人-平台-关系用户格式
   * {
   *   source: 'relation',
   *   relation: {
   *     objectType: 'device',
   *     objectSource: {
   *       source: 'upper',
   *       upperKey: 'deviceId'
   *     },
   *     related: {
   *       objectType: 'user',
   *       relation: 'userId'
   *     }
   *   }
   * }
   * 收信人-钉钉/微信用户
   * {
   *   source: 'relation',
   *   value: 'userId'
   * }
   * @param _source
   * @param _value
   * @param type
   */
  const onchange = (_source: string = 'fixed', _value?: string, isRelation?: boolean) => {
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
        onchange(props.value?.source, '');
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
          onchange(source, key, node.isRelation);
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
        onChange={(key) => {
          setValue(key);
          onchange(source, key);
        }}
        fieldNames={{ label: 'name', value: 'id' }}
        placeholder={'请选择收信人'}
        filterOption={(input: string, option: any) => {
          return option.name ? option.name.toLowerCase().includes(input.toLowerCase()) : false;
        }}
      ></Select>
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
          onchange(source, key, node.isRelation);
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
          onchange(source, e.target.value);
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
          onchange(source, key, node.isRelation);
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
          onchange(source, e.target.value);
        }}
      />
    );

  return (
    <ItemGroup compact>
      <Select
        id={props.id}
        value={source}
        options={
          props.notifyType && ['dingTalk', 'weixin'].includes(props.notifyType)
            ? options
            : otherOptions
        }
        style={{ width: 120 }}
        onChange={(key) => {
          setSource(key);
          onchange(key, undefined);
        }}
      />
      {props.notifyType && ['dingTalk', 'weixin'].includes(props.notifyType) ? userSelect : null}
      {props.notifyType && ['email'].includes(props.notifyType) ? emailSelect : null}
      {props.notifyType && ['sms', 'voice'].includes(props.notifyType) ? voiceSelect : null}
    </ItemGroup>
  );
};
