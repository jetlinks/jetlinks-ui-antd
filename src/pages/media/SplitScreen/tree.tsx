import { Input, Tree } from 'antd';
import { getMediaTree } from './service';
import { useRequest } from 'umi';
import { useEffect } from 'react';

type LeftTreeTYpe = {
  onSelect?: (deviceId: string) => void;
};

const LeftTree = (props: LeftTreeTYpe) => {
  const { data, run: queryTree } = useRequest(getMediaTree, {
    manual: true,
  });

  useEffect(() => {
    queryTree({ paging: false });
  }, []);

  return (
    <div className="left-content">
      <Input.Search />
      <Tree
        height={500}
        fieldNames={{
          title: 'name',
          key: 'id',
        }}
        onSelect={(key) => {
          if (props.onSelect) {
            props.onSelect(key[0] as string);
          }
        }}
        treeData={data}
      />
    </div>
  );
};

export default LeftTree;
