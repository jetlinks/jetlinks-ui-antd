import { observer, Observer } from '@formily/react';
import { useState, useEffect } from 'react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionBranchesProps, TermsType } from '@/pages/rule-engine/Scene/typings';
import Term from './term';
import Actions from '@/pages/rule-engine/Scene/Save/action';
import classNames from 'classnames';
import { set } from 'lodash';

interface BranchesItemProps {
  name: number;
  data: ActionBranchesProps;
  isFrist: boolean;
  paramsOptions: any[];
  onDelete: () => void;
}

export default observer((props: BranchesItemProps) => {
  const [when, setWhen] = useState<TermsType[]>([]);

  useEffect(() => {
    console.log('branchItem', props.data.when);

    if (props.data.when) {
      setWhen(props.data.when);
    }
  }, [props.data]);

  const addWhen = (index: number) => {
    const lastBranch = FormModel.current.branches![index].when;
    FormModel.current.options?.when.push({
      terms: [{ terms: [] }],
    });

    lastBranch.push({
      terms: [
        {
          type: 'and',
          column: undefined,
          value: undefined,
          key: 'params_1',
        },
      ],
      type: 'and',
      key: 'terms_1',
    });
    // 增加下一个否则, '当' 排除
    if (index > 0) {
      FormModel.current.branches?.push({
        when: [],
        key: `branch_${new Date().getTime()}`,
        shakeLimit: {
          enabled: false,
          time: 0,
          threshold: 0,
          alarmFirst: false,
        },
        then: [],
      });
    }
  };

  return (
    <div className="actions-terms-warp">
      <div className="actions-terms-title">{props.isFrist ? '当' : '否则'}</div>
      <div className={classNames('actions-terms-options', { border: !props.isFrist })}>
        {!props.isFrist && props.data.when.length ? (
          <div className={classNames('terms-params-delete denger show')} onClick={props.onDelete}>
            <DeleteOutlined />
          </div>
        ) : null}
        <div className="actions-terms-list">
          <Observer>
            {() =>
              when.length ? (
                when.map((item, dIndex) => (
                  <Term
                    whenName={props.name}
                    pName={[props.name, 'when']}
                    name={dIndex}
                    data={item}
                    key={item.key}
                    paramsOptions={props.paramsOptions}
                    isLast={dIndex === when!.length - 1}
                    onValueChange={(data) => {
                      console.log('onValueChange2', data);
                      // FormModel.current.branches![props.name].when[dIndex] = {
                      //   ...FormModel.current.branches![props.name].when[dIndex],
                      //   ...data,
                      // };
                      set(FormModel.current.branches!, [props.name, 'when', dIndex], data);
                    }}
                    onLabelChange={(options) => {
                      FormModel.current.options!.terms[props.name] = options;
                    }}
                    onDelete={() => {
                      FormModel.current.branches![props.name].when.splice(dIndex, 1);
                    }}
                  />
                ))
              ) : (
                <span
                  style={{
                    fontSize: 14,
                    color: '#2F54EB',
                    cursor: 'pointer',
                    padding: props.isFrist ? '16px 0' : 0,
                  }}
                  onClick={() => addWhen(props.name)}
                >
                  {' '}
                  <PlusCircleOutlined style={{ padding: 4 }} /> 添加过滤条件
                </span>
              )
            }
          </Observer>
        </div>
        <div className="actions-branchs">
          <Actions openShakeLimit={true} name={props.name} thenOptions={props.data.then} />
        </div>
      </div>
    </div>
  );
});
