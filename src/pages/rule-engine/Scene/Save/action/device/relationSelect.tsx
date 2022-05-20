import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { getRelations } from '@/pages/rule-engine/Scene/Save/action/service';

interface RelationProps {
  value?: any;
  onChange?: (value?: any) => void;
}

export default (props: RelationProps) => {
  const [options, setOptions] = useState([]);

  const getRelation = async () => {
    const resp = await getRelations();
    if (resp.status === 200) {
      setOptions(
        resp.result.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      );
    }
  };

  useEffect(() => {
    getRelation();
  }, []);

  return (
    <Select
      options={options}
      style={{ width: '100%' }}
      value={props.value ? props.value[0]?.value?.relation : undefined}
      onSelect={(key: string) => {
        if (props.onChange) {
          props.onChange([
            {
              value: {
                objectType: 'user',
                relation: key,
              },
            },
          ]);
        }
      }}
      placeholder={'请选择关系'}
    />
  );
};
