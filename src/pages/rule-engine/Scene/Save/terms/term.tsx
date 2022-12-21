import { observer, Observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import ParamsItem from './paramsItem';
import { useState } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { DropdownButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import classNames from 'classnames';
import type { TermsType } from '@/pages/rule-engine/Scene/typings';
import { get, isArray, set } from 'lodash';
import './index.less';
import { Form, Popconfirm } from 'antd';

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
  isFirst: boolean;
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
        {!props.isFirst && (
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
                FormModel.current.options!.when[props.whenName].terms[props.name].termType =
                  v === 'and' ? '并且' : '或者';
              }}
            />
          </div>
        )}
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
                <Form.Item
                  name={[
                    'branches',
                    ...props.pName,
                    props.whenName,
                    'terms',
                    props.name,
                    'terms',
                    index,
                  ]}
                  rules={[
                    {
                      validator(_, v) {
                        if (v) {
                          if (!Object.keys(v).length) {
                            return Promise.reject(new Error('该数据已发生变更，请重新配置'));
                          }
                          if (!v.column) {
                            return Promise.reject(new Error('请选择参数'));
                          }

                          if (!v.termType) {
                            return Promise.reject(new Error('请选择操作符'));
                          }

                          if (v.value === undefined) {
                            return Promise.reject(new Error('请选择或输入参数值'));
                          } else {
                            if (
                              isArray(v.value.value) &&
                              v.value.value.some((_v: any) => _v === undefined)
                            ) {
                              return Promise.reject(new Error('请选择或输入参数值'));
                            } else if (v.value.value === undefined) {
                              return Promise.reject(new Error('请选择或输入参数值'));
                            }
                          }
                        } else {
                          return Promise.reject(new Error('请选择参数'));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <ParamsItem
                    pName={[...props.pName, props.name]}
                    isDelete={terms.length > 1}
                    name={index}
                    data={item}
                    key={item.key}
                    isLast={index === props.data.terms!.length - 1}
                    isFirst={index === 0}
                    options={props.paramsOptions}
                    label={
                      FormModel.current.options?.when?.[props.whenName]?.terms?.[props.name]
                        ?.terms?.[index]
                    }
                    onDelete={() => {
                      terms.splice(index, 1);
                      FormModel.current.options?.when[props.whenName]?.terms?.splice(index, 1);
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
                      FormModel.current.options!.when[props.whenName].terms[props.name].terms[
                        index
                      ] = options;
                      FormModel.current.options!.when[props.whenName].terms[props.name].termType =
                        props.data.type === 'and' ? '并且' : '或者';
                    }}
                  />
                </Form.Item>
              ));
            }}
          </Observer>
          <Popconfirm title={'确认删除？'} onConfirm={props.onDelete}>
            <div className={classNames('terms-params-delete', { show: deleteVisible })}>
              <CloseOutlined />
            </div>
          </Popconfirm>
        </div>
        {props.isLast && (
          <div className="terms-group-add" onClick={addTerms}>
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
