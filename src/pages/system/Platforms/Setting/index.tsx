import { PageContainer } from '@ant-design/pro-layout';
import ApiPage from '../Api/base';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default () => {
  return (
    <PageContainer>
      <div style={{ padding: '24px 24px 0 24px', background: '#fff' }}>
        <ExclamationCircleOutlined style={{ marginRight: 12, fontSize: 16 }} />
        配置系统支持API赋权的范围
      </div>
      <ApiPage type={'all'} showDebugger={true} isOpenGranted={false} showHome={false} />
    </PageContainer>
  );
};
