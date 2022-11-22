import { observer, Observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import ParamsItem from './paramsItem';
import { useState } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { DropdownButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import classNames from 'classnames';
import type { TermsType } from '@/pages/rule-engine/Scene/typings';
import { get, set } from 'lodash';
import './index.less';
interface TermsProps {
  data: TermsType;
  pName: (number | string)[];
  name: number;
  isLast: boolean;
}

export default observer((props: TermsProps) => {
  const [deleteVisible, setDeleteVisible] = useState(false);

  const deleteTerms = () => {
    const data = get(FormModel.branches, [...props.pName]);
    const indexOf = data!.findIndex((item: TermsType) => item.key === props.data.key);
    if (indexOf !== undefined && indexOf !== -1) {
      data!.splice(indexOf, 1);
    }
    set(FormModel.branches!, [...props.pName], data);
  };

  const addTerms = () => {
    const data = get(FormModel.branches, [...props.pName]);
    const key = 'terms_' + new Date().getTime();
    const defaultValue = {
      type: 'and',
      terms: [
        {
          column: undefined,
          value: undefined,
          key: 'params_1',
          type: 'and',
        },
      ],
      key,
    };
    data?.push(defaultValue);
    console.log(FormModel.branches);
  };

  return (
    <div className="terms-params">
      <div className="terms-params-warp">
        <div
          className="terms-params-content"
          onMouseOver={() => setDeleteVisible(true)}
          onMouseOut={() => setDeleteVisible(false)}
        >
          <Observer>
            {() =>
              props.data.terms?.map((item, index) => (
                <ParamsItem
                  pName={[...props.pName, props.name]}
                  name={index}
                  data={item}
                  key={item.key}
                  isLast={index === props.data.terms!.length - 1}
                />
              ))
            }
          </Observer>
          <div
            className={classNames('terms-params-delete', { show: deleteVisible })}
            onClick={deleteTerms}
          >
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
              value={props.data.type}
            ></DropdownButton>
          </div>
        ) : (
          <div className="terms-add" onClick={addTerms}>
            <PlusOutlined style={{ fontSize: 12, paddingRight: 4 }} />
            <span>分组</span>
          </div>
        )}
      </div>
    </div>
  );
});
