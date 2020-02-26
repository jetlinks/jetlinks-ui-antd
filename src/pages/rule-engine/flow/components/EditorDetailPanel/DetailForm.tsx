import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Form from 'antd/es/form';
import { withPropsAPI } from 'gg-editor';
import { NodeItem } from './data';
import BasicNode from './BasicNode';

interface Props extends FormComponentProps {
  propsAPI?: any;
}
interface State {
  model: Partial<NodeItem>;
}
const DetailForm: React.FC<Props> = props => {
  const {
    propsAPI: { getSelected, executeCommand, update },
  } = props;

  const initState: State = {
    model: {},
  };
  const [model, setModel] = useState(initState.model);
  const item = getSelected()[0];
  useEffect(() => {
    if (item) {
      setModel(item.model);
    }
  }, []);

  // 修改Node节点数据
  const updateModel = (data: any) => {
    executeCommand(() => {
      update(item, data);
    });
  };

  return (
    <Card type="inner" size="small" bordered={false}>
      {model.executor && (
        <BasicNode
          type={model.executor}
          model={model}
          saveModel={(data: any) => {
            updateModel(data);
          }}
        />
      )}
    </Card>
  );
};
export default Form.create<Props>()(withPropsAPI(DetailForm as any));
