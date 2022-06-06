import { PageContainer } from '@ant-design/pro-layout';
import ApiPage from '../Api/base';

export default () => {
  return (
    <PageContainer>
      <div style={{ padding: 24, background: '#fff' }}>配置系统支持API赋权的范围</div>
      <ApiPage showDebugger={true} isOpenGranted={false} />
    </PageContainer>
  );
};
