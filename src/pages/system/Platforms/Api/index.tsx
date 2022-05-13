import { PageContainer } from '@ant-design/pro-layout';
import Table from './basePage';
import Tree from './leftTree';
import './index.less';
import { useState } from 'react';

export default () => {
  const [jumpId, setJumpId] = useState('');
  const [parentId, setParentId] = useState('');

  return (
    <PageContainer>
      <div className={'platforms-api'}>
        <div className={'platforms-api-tree'}>
          <Tree
            onSelect={(id) => {
              setJumpId('');
              setParentId(id);
            }}
          />
        </div>
        {!jumpId ? <Table parentId={parentId} onJump={setJumpId} /> : <></>}
      </div>
    </PageContainer>
  );
};
