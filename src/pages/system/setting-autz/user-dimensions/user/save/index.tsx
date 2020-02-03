import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Checkbox, Card, message, Col } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import apis from '@/services';
import { UserItem } from '@/pages/system/users/data';
import { DimensionType, DimensionsItem } from '@/pages/system/dimensions/data';

interface Props extends FormComponentProps {
  close: Function;
}
interface State {
  userList: UserItem[];
  dimensionList: DimensionsItem[];
  typeList: DimensionType[];
}
const Save: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;

  const initState: State = {
    userList: [],
    dimensionList: [],
    typeList: [],
  };

  const [userList, setUserList] = useState(initState.userList);
  const [dimensionList, setDimensionList] = useState(initState.dimensionList);
  const [typeList, setTypeList] = useState(initState.typeList);

  useEffect(() => {
    apis.users
      .listNoPaging()
      .then(e => {
        setUserList(e.result);
      })
      .catch(() => {});
    getDimensions();
  }, []);

  const save = () => {
    form.validateFields((err, fieldValue) => {
      if (err) return;
      const param = _buildSaveParams(fieldValue);
      apis.dimensions
        .addDimensionUser(param)
        .then(e => {
          if (e.status === 200) {
            message.success('保存成功');
          }
        })
        .catch(() => {});
    });
  };

  const _buildSaveParams = (params: { userId: string[]; dimensions: string[] }) => {
    return params.userId
      .map(e => {
        const user: any = userList.find((user: UserItem) => user.id === e);
        return {
          userId: user.id,
          userName: user.name,
        };
      })
      .flatMap(u => {
        return params.dimensions
          .map(did => {
            const dimension: any = dimensionList.find(dimension => dimension.id === did);
            return {
              dimensionId: dimension.id,
              dimensionName: dimension.name,
              dimensionTypeId: dimension.typeId,
            };
          })
          .map(d => {
            return { ...d, ...u };
          });
      });
  };

  const getDimensions = () => {
    apis.dimensions
      .treeList()
      .then(e => {
        setDimensionList(e.result);
      })
      .catch(() => {});
    apis.dimensions
      .typeList()
      .then(e => {
        setTypeList(e.result);
      })
      .catch(() => {});
  };

  const renderUserSelect = () => {
    return (
      <Select placeholder="选择用户" mode="multiple">
        {userList.map(user => (
          <Select.Option key={user.id}>{user.name}</Select.Option>
        ))}
      </Select>
    );
  };

  const renderDimensions = () => {
    return (
      <Checkbox.Group>
        {typeList.map(
          (type: DimensionType) =>
            dimensionList.filter((i: DimensionsItem) => i.typeId === type.id).length > 0 && (
              <Card bordered={false} key={type.id} style={{ width: 600 }}>
                <Col span={3}>
                  <h4>{type.name}</h4>
                </Col>
                {dimensionList
                  .filter((i: DimensionsItem) => i.typeId === type.id)
                  .map((item: DimensionsItem) => {
                    return (
                      <Col span={7} key={item.id}>
                        <Checkbox value={item.id}>{item.name}</Checkbox>
                      </Col>
                    );
                  })}
              </Card>
            ),
        )}
      </Checkbox.Group>
    );
  };
  return (
    <Modal title="添加用户" visible onCancel={() => props.close()} onOk={() => save()} width={640}>
      <Form layout="vertical">
        <Form.Item key="userId" label="描述：新添加的维度会与用户原有维度进行合并">
          {getFieldDecorator('userId', {
            rules: [{ required: true }],
          })(renderUserSelect())}
        </Form.Item>
        <Form.Item key="dimensions" label="用户维度配置">
          {getFieldDecorator('dimensions', {
            rules: [{ required: true }],
          })(renderDimensions())}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Form.create<Props>()(Save);
