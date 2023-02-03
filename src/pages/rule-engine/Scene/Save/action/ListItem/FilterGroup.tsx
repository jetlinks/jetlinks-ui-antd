import { observer, Observer } from '@formily/react';
import ParamsItem from './FilterCondition';
import { useEffect, useRef, useState } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { DropdownButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import classNames from 'classnames';
import type { TermsType } from '@/pages/rule-engine/Scene/typings';
import { isArray, set } from 'lodash';
import './index.less';
import { Form, Popconfirm } from 'antd';

interface TermsProps {
  data: TermsType;
  name: number;
  action: number;
  branchesName: number;
  branchGroup: number;
  isLast: boolean;
  isFirst: boolean;
  label?: any;
  paramsOptions: any[];
  actionColumns: any[];
  onValueChange: (data: TermsType) => void;
  onLabelChange: (label: any) => void;
  onDelete: () => void;
  onAddGroup: () => void;
  onColumnsChange: (columns: any[]) => void;
  columns: string[][];
}

export default observer((props: TermsProps) => {
  const [deleteVisible, setDeleteVisible] = useState(false);
  const _name = [props.branchesName, 'then', props.branchGroup, 'actions', props.action, 'terms'];
  const [filterList, setFilterList] = useState<TermsType[]>([]);
  const labelRef = useRef<any>({});
  const listRef = useRef<any[]>([]);
  const optionsColumnsRef = useRef<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    labelRef.current = props.label || {};
  }, [props.label]);

  useEffect(() => {
    setFilterList(props.data?.terms || []);
    listRef.current = props.data?.terms || [];
  }, [props.data]);

  useEffect(() => {
    optionsColumnsRef.current = props.columns;
    setColumns(props.columns);
  }, [props.columns]);

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
                const typeLabel = v === 'and' ? '并且' : '或者';
                labelRef.current.termType = typeLabel;
                props.onLabelChange(labelRef.current);
              }}
            />
          </div>
        )}
        <div
          className="terms-params-content"
          onMouseOver={() => {
            setDeleteVisible(true);
          }}
          onMouseOut={() => {
            setDeleteVisible(false);
          }}
        >
          <Observer>
            {() => {
              const terms = filterList || [];
              return terms.map((item, index) => (
                <Form.Item
                  name={['branches', ..._name, props.name, 'terms', index]}
                  rules={[
                    {
                      validator(_, v) {
                        // console.log('-----v',v)
                        if (v !== undefined) {
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
                    branchesName={props.branchesName}
                    branchGroup={props.branchGroup}
                    action={props.action}
                    data={item}
                    key={item.key}
                    columns={columns?.[props.name]?.[index]}
                    options={props.paramsOptions}
                    label={labelRef.current?.terms?.[index]}
                    isLast={index === props.data.terms!.length - 1}
                    isFirst={index === 0}
                    onDelete={() => {
                      terms.splice(index, 1);
                      if (terms.length === 0) {
                        props.onDelete();
                      } else {
                        props.onValueChange({
                          ...props.data,
                          terms: terms,
                        });
                        props.onColumnsChange(optionsColumnsRef.current);
                      }
                      set(optionsColumnsRef.current, [props.name, index], []);
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
                      props.onValueChange({
                        ...props.data,
                        terms: terms,
                      });
                    }}
                    onValueChange={(data) => {
                      // console.log('----data',data)
                      const newList = [...listRef.current];
                      newList[index] = {
                        ...item,
                        ...data,
                      };
                      props.onValueChange({
                        ...props.data,
                        terms: newList,
                      });
                    }}
                    onColumns={(_columns) => {
                      console.log('_columns-----', _columns);
                      set(optionsColumnsRef.current, [props.name, index], _columns);
                      props.onColumnsChange(optionsColumnsRef.current);
                    }}
                    onLabelChange={(options) => {
                      let newLabel: any = {};
                      const typeLabel = props.data.type === 'and' ? '并且' : '或者';
                      if (labelRef.current?.terms) {
                        labelRef.current?.terms.splice(index, 1, options);
                        labelRef.current.termType = typeLabel;
                        newLabel = labelRef.current;
                      } else {
                        newLabel = {
                          terms: [options],
                          termType: typeLabel,
                        };
                      }

                      labelRef.current = newLabel;
                      props.onLabelChange(newLabel);
                    }}
                  />
                </Form.Item>
              ));
            }}
          </Observer>
          <Popconfirm title={'确认删除？'} onConfirm={props.onDelete}>
            <div
              className={classNames('terms-params-delete filter-terms-params-delete', {
                show: deleteVisible,
              })}
            >
              <CloseOutlined />
            </div>
          </Popconfirm>
        </div>
        {props.isLast && (
          <div className="terms-group-add" onClick={props.onAddGroup}>
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
