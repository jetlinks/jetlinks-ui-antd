import { observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import ParamsItem from './paramsItem';
import { useState, useEffect } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { DropdownButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import classNames from 'classnames';
import type { TermsType } from '@/pages/rule-engine/Scene/typings';
import { get } from 'lodash';
import './index.less';
interface TermsProps {
  data: TermsType;
  pName: (number | string)[];
  name: number;
  isLast: boolean;
  paramsOptions: any[];
  onValueChange: (data: TermsType) => void;
  onLabelChange: (label: any) => void;
  onDelete: () => void;
}

export default observer((props: TermsProps) => {
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [terms, setTerms] = useState<TermsType[]>([]);

  useEffect(() => {
    if (props.data.terms) {
      setTerms(props.data.terms);
    } else {
      setTerms([]);
    }
  }, [props.data.terms]);

  const addTerms = () => {
    const data = get(FormModel.current.branches, [...props.pName]);
    FormModel.current.options!.terms[props.name].terms.push('');
    const key = `terms_${new Date().getTime()}`;
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
  };

  return (
    <div className="terms-params">
      <div className="terms-params-warp">
        <div
          className="terms-params-content"
          onMouseOver={() => setDeleteVisible(true)}
          onMouseOut={() => setDeleteVisible(false)}
        >
          {terms.map((item, index) => (
            <ParamsItem
              pName={[...props.pName, props.name]}
              name={index}
              data={item}
              key={item.key}
              isLast={index === props.data.terms!.length - 1}
              options={props.paramsOptions}
              onDelete={() => {
                terms.splice(index, 1);
                setTerms([...terms]);
                props.onValueChange({
                  terms: terms,
                });
              }}
              onAdd={() => {
                const key = `params_${new Date().getTime()}`;
                terms.push({
                  type: 'and',
                  column: undefined,
                  value: undefined,
                  termType: undefined,
                  key,
                });
                console.log('onAdd', terms);

                setTerms([...terms]);
                props.onValueChange({
                  terms: terms,
                });
              }}
              onValueChange={(data) => {
                terms[index] = {
                  ...terms[index],
                  ...data,
                };
                setTerms([...terms]);
                props.onValueChange({
                  terms: terms,
                });
              }}
              onLableChange={(options) => {
                console.log(options, FormModel.current.options!.terms);
                FormModel.current.options!.terms[props.name].terms[index] = options;
                FormModel.current.options!.terms[props.name].termType =
                  props.data.type === 'and' ? '并且' : '或者';
              }}
            />
          ))}
          <div
            className={classNames('terms-params-delete', { show: deleteVisible })}
            onClick={props.onDelete}
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
            />
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
