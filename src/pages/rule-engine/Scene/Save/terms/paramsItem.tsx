import { useState } from 'react';
import type { TermsType } from '@/pages/rule-engine/Scene/typings';
import { Popover } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import './index.less';

interface ParamsItemProps {
  data: TermsType;
  name: number;
  isLast: boolean;
}

export default (props: ParamsItemProps) => {
  const [deleteVisible, setDeleteVisible] = useState(false);

  const deleteItem = () => {};

  return (
    <div className="terms-params-item">
      <div
        className="params-item_button"
        onMouseOver={() => setDeleteVisible(true)}
        onMouseOut={() => setDeleteVisible(false)}
      >
        <Popover trigger={'click'} content={<span>1231</span>}>
          <div className="params-button parameter">请选择参数</div>
        </Popover>
        <Popover trigger={'click'} content={<span>1231</span>}>
          <div className="params-button termType">操作符</div>
        </Popover>
        <Popover trigger={'click'} content={<span>1231</span>}>
          <div className="params-button termsValue">参数值</div>
        </Popover>
        <div className={classNames('button-delete', { show: deleteVisible })}>
          <CloseOutlined />
        </div>
      </div>
      {!props.isLast ? (
        <div className="term-type-warp" onClick={deleteItem}>
          <Popover trigger={'click'} content={<span>1231</span>}>
            <div className="params-button term-type">参数值</div>
          </Popover>
        </div>
      ) : (
        <div className="term-add">
          <PlusOutlined style={{ fontSize: 12, paddingRight: 4 }} />
          <span>条件</span>
        </div>
      )}
    </div>
  );
};
