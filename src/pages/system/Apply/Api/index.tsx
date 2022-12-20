import { PageContainer } from '@ant-design/pro-layout';
import BasePage from './base';

export default () => {
  return (
    <PageContainer>
      <BasePage type={'empowerment'} showHome={true} showDebugger={true} />
    </PageContainer>
  );
};
