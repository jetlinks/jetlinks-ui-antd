import { PageContainer } from '@ant-design/pro-layout';
import { Tree } from 'antd';
import Table from './basePage';

export default () => {
  return (
    <PageContainer>
      <div>
        <div>
          <Tree />
        </div>
        <Table />
      </div>
    </PageContainer>
  );
};
