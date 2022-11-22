import { useState } from 'react';
import type { TermsType } from '@/pages/rule-engine/Scene/typings';
import { DropdownButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import { get, set } from 'lodash';
import './index.less';

interface ParamsItemProps {
  data: TermsType;
  pName: (number | string)[];
  name: number;
  isLast: boolean;
}

export default observer((props: ParamsItemProps) => {
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [paramOptions] = useState([]);
  const [termTypeOptions] = useState([]);
  const [valueOptions] = useState([]);

  const deleteItem = () => {
    const data = get(FormModel.branches, [...props.pName, 'terms']);
    const indexOf = data?.findIndex((item: TermsType) => item.key === props.data.key);
    if (indexOf !== undefined && indexOf !== -1) {
      data!.splice(indexOf, 1);
    }
    set(FormModel.branches!, [...props.pName, 'terms'], data);
  };

  const addItem = () => {
    const key = 'params_' + new Date().getTime();
    const data = get(FormModel.branches, [...props.pName, 'terms']);
    data?.push({
      type: 'and',
      column: undefined,
      value: undefined,
      termType: undefined,
      key,
    });
  };

  return (
    <div className="terms-params-item">
      <div
        className="params-item_button"
        onMouseOver={() => setDeleteVisible(true)}
        onMouseOut={() => setDeleteVisible(false)}
      >
        <DropdownButton
          options={paramOptions}
          type="param"
          placeholder="请选择参数"
        ></DropdownButton>
        <DropdownButton
          options={termTypeOptions}
          type="termType"
          placeholder="操作符"
        ></DropdownButton>
        <DropdownButton options={valueOptions} type="value" placeholder="参数值"></DropdownButton>
        <div className={classNames('button-delete', { show: deleteVisible })} onClick={deleteItem}>
          <CloseOutlined />
        </div>
      </div>
      {!props.isLast ? (
        <div className="term-type-warp">
          <DropdownButton
            options={[
              { title: '并且', key: 'and' },
              { title: '或者', key: 'or' },
            ]}
            isTree={false}
            type="type"
            value="and"
          ></DropdownButton>
        </div>
      ) : (
        <div className="term-add" onClick={addItem}>
          <PlusOutlined style={{ fontSize: 12, paddingRight: 4 }} />
          <span>条件</span>
        </div>
      )}
    </div>
  );
});
