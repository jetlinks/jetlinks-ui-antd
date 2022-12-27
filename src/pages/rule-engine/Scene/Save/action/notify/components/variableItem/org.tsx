import { TreeSelect } from 'antd';
import { useEffect, useState } from 'react';
import {
  queryDingTalkDepartments,
  queryWechatDepartments,
} from '@/pages/rule-engine/Scene/Save/action/service';
import { NotifyModel } from '../../index';

type ChangeType = {
  source?: string;
  value?: string[];
};

interface OrgProps {
  value?: ChangeType;
  onChange?: (value: ChangeType) => void;
}

export default (props: OrgProps) => {
  const [keys, setKeys] = useState<any[]>(props.value?.value || []);
  const [departmentTree, setDepartmentTree] = useState([]);

  const getDepartment = async (id: string) => {
    if (NotifyModel.notify?.notifyType === 'dingTalk') {
      const resp = await queryDingTalkDepartments(id);
      if (resp.status === 200) {
        setDepartmentTree(resp.result);
      }
    } else {
      const resp = await queryWechatDepartments(id);
      if (resp.status === 200) {
        setDepartmentTree(resp.result);
      }
    }
  };

  useEffect(() => {
    if (NotifyModel.notify?.notifierId) {
      getDepartment(NotifyModel.notify.notifierId);
    }
  }, []);

  useEffect(() => {
    setKeys(props.value?.value || []);
  }, [props.value]);

  return (
    <TreeSelect
      value={keys}
      listHeight={200}
      treeData={departmentTree}
      fieldNames={{
        label: 'name',
        value: 'id',
      }}
      onChange={(key, label) => {
        if (props.onChange) {
          NotifyModel.notify.options = {
            ...NotifyModel.notify.options,
            orgName: label.join(','),
          };
          props.onChange({
            source: 'fixed',
            value: key,
          });
        }
      }}
      placeholder={'请选择组织'}
    />
  );
};
