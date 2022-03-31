import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import LeftTree from './tree';
import './index.less';
import { ScreenPlayer } from '@/components';

const SplitScreen = () => {
  return (
    <PageContainer>
      <Card>
        <div className="split-screen">
          <LeftTree />
          <div className="right-content">
            <ScreenPlayer />
          </div>
          ;
        </div>
      </Card>
    </PageContainer>
  );
};
export default SplitScreen;
