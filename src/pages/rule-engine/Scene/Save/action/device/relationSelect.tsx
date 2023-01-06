import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getRelations } from '@/pages/rule-engine/Scene/Save/action/service';

interface RelationProps {
  value?: any;
  onChange?: (value?: any, options?: any) => void;
  id?: string;
}

export default (props: RelationProps) => {
  const [options, setOptions] = useState([]);

  const getRelation = async () => {
    const resp = await getRelations();
    if (resp.status === 200) {
      setOptions(
        resp.result.map((item: any) => ({
          label: item.name,
          value: item.relation,
        })),
      );
    }
  };

  useEffect(() => {
    getRelation();
  }, []);

  return (
    <Select
      id={props.id}
      options={options}
      style={{ width: '100%' }}
      value={props.value ? props.value[0]?.value?.relation : undefined}
      onSelect={(key: string, option: any) => {
        if (props.onChange) {
          props.onChange(
            [
              {
                value: {
                  objectType: 'user',
                  relation: key,
                },
              },
            ],
            option,
          );
        }
      }}
      placeholder={'请选择关系'}
    />
  );
};
