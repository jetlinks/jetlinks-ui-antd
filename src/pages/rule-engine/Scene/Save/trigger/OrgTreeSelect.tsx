import type { TreeSelectProps } from 'antd';
import { TreeSelect } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { queryOrgTree } from '@/pages/rule-engine/Scene/Save/trigger/service';

interface OrgTreeSelect extends Omit<TreeSelectProps, 'onChange' | 'value'> {
  onChange?: (value: any[]) => void;
  value?: any;
  productId?: string;
  id?: string;
}

export default (props: OrgTreeSelect) => {
  const [myValue, setMyValue] = useState(props.value ? props.value[0].id : undefined);
  const { value, onChange, ...extraProps } = props;
  const [orgTree, setOrgTree] = useState<any>([]);

  const getOrg = useCallback(async () => {
    if (props.productId) {
      queryOrgTree(props.productId).then((resp) => {
        if (resp && resp.status === 200) {
          setOrgTree(resp.result);
        }
      });
    }
  }, [props.productId]);

  useEffect(() => {
    getOrg();
  }, []);

  const onchange = (key: string, label: React.ReactNode[]) => {
    if (props.onChange) {
      props.onChange([{ value: key, name: label[0] }]);
    }
  };

  useEffect(() => {
    if (props.value) {
      setMyValue(props.value[0].value);
    } else {
      setMyValue(undefined);
    }
  }, [props.value]);

  return (
    <TreeSelect<string>
      id={props.id}
      value={myValue}
      treeData={orgTree}
      onChange={onchange}
      {...extraProps}
    />
  );
};
