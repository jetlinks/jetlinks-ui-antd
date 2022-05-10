// 收信人
import { useEffect, useState } from 'react';
import { ItemGroup } from '@/pages/rule-engine/Scene/Save/components';
import { Input, Select } from 'antd';
import {
  queryDingTalkUsers,
  queryPlatformUsers,
  queryRelationUsers,
  queryWechatUsers,
} from '@/pages/rule-engine/Scene/Save/action/service';

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
}

export default (props: UserProps) => {
  const [source, setSource] = useState(props.value?.source);
  const [value, setValue] = useState<string | undefined>('');
  const [userList, setUserList] = useState({ platform: [], relation: [] });
  const [relationList, setRelationList] = useState([]);

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
    const _userList: any = {
      platform: [],
      relation: [],
    };
    const resp1 = await queryPlatformUsers();
    if (resp1.status === 200) {
      _userList.platform = resp1.result.map((item: any) => ({ label: item.name, value: item.id }));
    }

    const resp2 = await queryRelationUsers();
    if (resp2.status === 200) {
      _userList.relation = resp2.result.map((item: any) => ({
        label: item.name,
        value: item.relation,
      }));
    }

    setUserList(_userList);
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
    console.log(obj);
    if (props.onChange) {
      props.onChange(obj);
    }
  };

  const filterOption = (input: string, option: any) => {
    return option.children ? option.children.toLowerCase().includes(input.toLowerCase()) : false;
  };

  const userSelect =
    source === 'relation' ? (
      <Select
        showSearch
        value={value}
        onChange={(key, node) => {
          setValue(key);
          onchange(source, key, node.isRelation);
        }}
        placeholder={'请选择收信人'}
        listHeight={200}
        filterOption={filterOption}
      >
        {userList.platform.length ? (
          <Select.OptGroup label={'平台用户'}>
            {userList.platform.map((item: any) => (
              <Select.Option value={item.value} isRelation={false}>
                {item.label}
              </Select.Option>
            ))}
          </Select.OptGroup>
        ) : null}
        {userList.relation.length ? (
          <Select.OptGroup label={'关系用户'}>
            {userList.relation.map((item: any) => (
              <Select.Option value={item.value} isRelation={true}>
                {item.label}
              </Select.Option>
            ))}
          </Select.OptGroup>
        ) : null}
      </Select>
    ) : (
      <Select
        showSearch
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
      <Select
        showSearch
        value={value}
        onChange={(key, node) => {
          setValue(key);
          onchange(source, key, node.isRelation);
        }}
        placeholder={'请选择收信人'}
        listHeight={200}
        filterOption={filterOption}
      >
        {userList.platform.length ? (
          <Select.OptGroup label={'平台用户'}>
            {userList.platform.map((item: any) => (
              <Select.Option value={item.value} isRelation={false}>
                {item.label}
              </Select.Option>
            ))}
          </Select.OptGroup>
        ) : null}
        {userList.relation.length ? (
          <Select.OptGroup label={'关系用户'}>
            {userList.relation.map((item: any) => (
              <Select.Option value={item.value} isRelation={true}>
                {item.label}
              </Select.Option>
            ))}
          </Select.OptGroup>
        ) : null}
      </Select>
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
      <Select
        showSearch
        value={value}
        onChange={(key, node) => {
          setValue(key);
          onchange(source, key, node.isRelation);
        }}
        placeholder={'请选择收信人'}
        listHeight={200}
        filterOption={filterOption}
      >
        {userList.platform.length ? (
          <Select.OptGroup label={'平台用户'}>
            {userList.platform.map((item: any) => (
              <Select.Option value={item.value} isRelation={false}>
                {item.label}
              </Select.Option>
            ))}
          </Select.OptGroup>
        ) : null}
        {userList.relation.length ? (
          <Select.OptGroup label={'关系用户'}>
            {userList.relation.map((item: any) => (
              <Select.Option value={item.value} isRelation={true}>
                {item.label}
              </Select.Option>
            ))}
          </Select.OptGroup>
        ) : null}
      </Select>
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
