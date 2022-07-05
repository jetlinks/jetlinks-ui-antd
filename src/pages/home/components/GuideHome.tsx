import './index.less';
import { message } from 'antd';
import useHistory from '@/hooks/route/useHistory';
import Title from './Title';

const Image = {
  1: require('/public/images/home/home-1.png'),
  2: require('/public/images/home/home-2.png'),
  3: require('/public/images/home/home-3.png'),
};

interface GuideProps {
  title: string;
  data: GuideItemProps[];
}

interface GuideItemProps {
  key: string;
  name: string;
  english: string;
  url: string;
  param?: Record<string, any>;
  index?: number;
  auth: boolean;
  img?: string;
}

const GuideItem = (props: GuideItemProps) => {
  const history = useHistory();

  const jumpPage = () => {
    if (props.url && props.auth) {
      history.push(`${props.url}`, props.param);
    } else {
      message.warning('暂无权限，请联系管理员');
    }
  };

  return (
    <div
      className={'home-guide-item step-bar pointer'}
      onClick={jumpPage}
      style={{ marginTop: 12, padding: 10, border: '1px solid #eee' }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <img src={props.img} />
        </div>
        <div>
          <div className={'item-english'}>{`STEP${props.index}`}</div>
          <div
            className={'item-title'}
            style={{
              margin: 0,
              fontSize: '18px',
            }}
          >
            {props.name}
          </div>
        </div>
      </div>
      <div className={`item-index`} style={{ width: 37 }}>
        <img src={Image[props.index!]} />
      </div>
    </div>
  );
};

const GuideHome = (props: GuideProps) => {
  return (
    <div className={'home-guide'}>
      <Title title={props.title} />
      <div>
        {props.data.map((item, index) => (
          <GuideItem {...item} index={index + 1} key={item.key} />
        ))}
      </div>
    </div>
  );
};

export default GuideHome;
