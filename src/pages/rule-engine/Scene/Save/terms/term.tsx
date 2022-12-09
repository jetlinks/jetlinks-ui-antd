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
import { Popconfirm } from 'antd';

interface TermsProps {
  data: TermsType;
  pName: (number | string)[];
  whenName: number;
  name: number;
  isLast: boolean;
  paramsOptions: any[];
  onValueChange: (data: TermsType) => void;
  onLabelChange: (label: any) => void;
  onDelete: () => void;
}

export default observer((props: TermsProps) => {
  const [deleteVisible, setDeleteVisible] = useState(false);

  const addTerms = () => {
    const data = get(FormModel.current.branches, [...props.pName]);

    FormModel.current.options?.when[props.whenName]?.terms?.push({
      terms: [],
    });
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
    set(FormModel.current.branches!, [...props.pName], data);
    // setTerms([...terms])
  };

  return (
    <div className="terms-params">
      <div className="terms-params-warp">
        <div
          className="terms-params-content"
          onMouseOver={() => {
            if (props.name !== 0) setDeleteVisible(true);
          }}
          onMouseOut={() => {
            if (props.name !== 0) setDeleteVisible(false);
          }}
        >
          <Observer>
            {() => {
              const _when = get(FormModel.current.branches, [...props.pName, props.name]);
              const terms: TermsType[] = _when?.terms || [];
              return terms.map((item, index) => (
                <ParamsItem
                  pName={[...props.pName, props.name]}
                  isDelete={terms.length > 1}
                  name={index}
                  data={item}
                  key={item.key}
                  isLast={index === props.data.terms!.length - 1}
                  options={props.paramsOptions}
                  label={
                    FormModel.current.options?.when?.[props.whenName]?.terms?.[props.name]?.terms?.[
                      index
                    ]
                  }
                  onDelete={() => {
                    terms.splice(index, 1);
                    // setTerms([...terms]);
                    // props.onValueChange({
                    //   terms: terms,
                    // });
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

                    // setTerms([...terms]);
                    props.onValueChange({
                      ..._when,
                      terms: terms,
                    });
                  }}
                  onValueChange={(data) => {
                    terms[index] = {
                      ...terms[index],
                      ...data,
                    };

                    // setTerms([...terms]);
                    props.onValueChange({
                      ..._when,
                      terms: terms,
                    });
                  }}
                  onLabelChange={(options) => {
                    FormModel.current.options!.when[props.whenName].terms[props.name].terms[index] =
                      options;
                    FormModel.current.options!.when[props.whenName].terms[props.name].termType =
                      props.data.type === 'and' ? '并且' : '或者';
                  }}
                />
              ));
            }}
          </Observer>
          <Popconfirm title={'确认删除？'} onConfirm={props.onDelete}>
            <div className={classNames('terms-params-delete', { show: deleteVisible })}>
              <CloseOutlined />
            </div>
          </Popconfirm>
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
              onChange={(v) => {
                props.data.type = v;
              }}
            />
          </div>
        ) : (
          <div className="terms-add" onClick={addTerms}>
            <div className="terms-content">
              <PlusOutlined style={{ fontSize: 12, paddingRight: 4 }} />
              <span>分组</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
