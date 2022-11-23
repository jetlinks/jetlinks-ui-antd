import { observer, Observer } from '@formily/react';
import { useState } from 'react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionBranchesProps } from '@/pages/rule-engine/Scene/typings';
import Term from './term';
import Actions from '@/pages/rule-engine/Scene/Save/action';
import classNames from 'classnames';

interface BranchesItemProps {
  name: number;
  data: ActionBranchesProps;
  isFrist: boolean;
}

export default observer((props: BranchesItemProps) => {
  const [deleteVisible, setDeleteVisible] = useState(false);

  const deleteTerms = (index: number) => {
    FormModel.branches?.splice(index, 1);
  };

  const addWhen = (index: number) => {
    const lastBranch = FormModel.branches![index].when;
    lastBranch.push({
      terms: [
        {
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
      FormModel.branches?.push({
        when: [],
        key: `branch_${new Date().getTime()}`,
        shakeLimit: {
          enabled: true,
          time: 1,
          threshold: 1,
          alarmFirst: false,
        },
        then: [],
      });
    }
  };

  return (
    <div className="actions-terms-warp">
      <div className="actions-terms-title">{props.isFrist ? '当' : '否则'}</div>
      <div
        className={classNames('actions-terms-options', { border: !props.isFrist })}
        onMouseOver={() => setDeleteVisible(true)}
        onMouseOut={() => setDeleteVisible(false)}
      >
        {!props.isFrist && props.data.when?.length ? (
          <div
            className={classNames('terms-params-delete denger', { show: deleteVisible })}
            onClick={() => deleteTerms(props.name)}
          >
            <DeleteOutlined />
          </div>
        ) : null}
        <div className="actions-terms-list">
          <Observer>
            {() =>
              props.data.when?.length ? (
                props.data.when.map((data, dIndex) => {
                  return (
                    <Term
                      pName={[props.name, 'when']}
                      name={dIndex}
                      data={data}
                      key={data.key}
                      isLast={dIndex === props.data.when!.length - 1}
                    />
                  );
                })
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
          <Actions openShakeLimit={true} name={['branches', props.name]} />
        </div>
      </div>
    </div>
  );
});
