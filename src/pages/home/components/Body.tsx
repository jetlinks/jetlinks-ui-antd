import Title from '@/pages/home/components/Title';
import './index.less';
import classNames from 'classnames';

interface BodyProps {
  title: string;
  english: string;
  className?: string;
  url?: string;
}
const defaultUrl = require('/public/images/home/content.png');
export default (props: BodyProps) => {
  return (
    <div className={classNames('home-body', props.className)}>
      <div className={'home-body-img'}>
        <img src={props.url || defaultUrl} />
      </div>
      <Title title={props.title} english={props.english} />
    </div>
  );
};
