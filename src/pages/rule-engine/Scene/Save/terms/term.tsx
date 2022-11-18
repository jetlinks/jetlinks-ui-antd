import { Observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import ParamsItem from './paramsItem';
import { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import './index.less';

export default () => {
  const [deleteVisible, setDeleteVisible] = useState(false);

  return (
    <div
      className="terms-params"
      onMouseOver={() => setDeleteVisible(true)}
      onMouseOut={() => setDeleteVisible(false)}
    >
      <div className="terms-params-content">
        <Observer>
          {() =>
            FormModel.terms?.map((item, index) => (
              <ParamsItem
                name={index}
                data={item}
                key={item.key}
                isLast={index === FormModel.terms!.length - 1}
              />
            ))
          }
        </Observer>
        <div className={classNames('terms-params-delete', { show: deleteVisible })}>
          <CloseOutlined />
        </div>
      </div>
    </div>
  );
};
