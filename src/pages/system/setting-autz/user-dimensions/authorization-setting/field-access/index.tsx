import React, { useEffect, useState } from 'react';
import { Modal, Row, Col, Alert, Checkbox, Affix, Anchor, Card, Divider, message } from 'antd';
import { PermissionItem, PermissionAction } from '@/pages/system/permission/data';

interface TempField {
  name: string;
  describe: string;
  actions: PermissionAction[];
}

interface Props {
  close: Function;
  data: Partial<PermissionItem>;
  save: Function;
}
interface State {
  currentItem: Partial<PermissionItem>;
  tempFieldAccess: TempField[];
}
const FieldAccess: React.FC<Props> = props => {
  const initState: State = {
    currentItem: props.data,
    tempFieldAccess: [],
  };
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [tempFieldAccess, setTempFieldAccess] = useState(initState.tempFieldAccess);
  useEffect(() => {
    setCurrentItem(props.data);
    const tempKey: string[] = [];
    ((props.data.current || {}).dataAccesses || []).forEach(e =>
      e.config.fields.forEach((i: string) => tempKey.push(e.action + '-' + i)),
    );
    const temp = (props.data.optionalFields || []).map(field => {
      const actions = (props.data.actions || []).map(a => {
        let key = a.action + '-' + field.name;
        return { checked: tempKey.find(i => i === key) ? false : true, ...a };
      });
      return { actions, ...field } as TempField;
    });
    setTempFieldAccess(temp);
  }, [props.data]);

  const buildAccess = () => {
    let tempAccess = new Map();
    tempFieldAccess.forEach(item => {
      item.actions.forEach(ac => {
        if (ac.checked) return;
        //获取不到就创建
        let fieldAccess =
          tempAccess.get(ac.action) ||
          tempAccess
            .set(ac.action, {
              action: ac.action,
              type: 'DENY_FILEDS',
              config: {
                fields: [],
              },
            })
            .get(ac.action);
        fieldAccess.config.fields.push(item.name);
      });
    });
    currentItem.dataAccesses = [...tempAccess.values()];
    props.save(currentItem);
    message.success('保存成功');
  };

  const checkItem = (field: string, action: string) => {
    const temp = tempFieldAccess.map(item => {
      if (item.name === field) {
        item.actions.map(ac => {
          if (ac.action === action) {
            ac.checked = !ac.checked;
          }
          return ac;
        });
      }
      return item;
    });
    setTempFieldAccess(temp);
  };

  return (
    <Modal
      title={`设置${currentItem.name}字段权限`}
      visible
      width={800}
      onCancel={() => {
        props.close();
        setCurrentItem({});
      }}
      onOk={() => {
        buildAccess();
      }}
    >
      <Alert
        message='描述: 如果角色对当前对象设置了 "新建" 或 "导入" 权限，带*号的必填字段默认设置为“读写”，不可设置为“只读”或“不可见”，否则会造成新建/导入不成功'
        type="info"
      />

      <Divider type="horizontal" />

      <Card bordered={false} id="field-access-card" style={{ height: 300, overflow: 'auto' }}>
        <Col span={20}>
          {tempFieldAccess.map(data => {
            return (
              <Row style={{ width: '100%', marginTop: 20 }} key={data.name} id={data.name}>
                <Col span={4} style={{ fontWeight: 700 }}>
                  <span style={{ fontSize: '14px', color: '#f5222d' }}>* </span>
                  {data.describe}
                </Col>
                <Col span={20}>
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    value={data.actions.filter(e => e.checked === true).map(e => e.action)}
                  >
                    {data.actions.map(item => (
                      <Col key={item.action} span={5}>
                        <Checkbox
                          value={item.action}
                          onClick={() => {
                            checkItem(data.name, item.action);
                          }}
                        >
                          {item.name}
                        </Checkbox>
                      </Col>
                    ))}
                  </Checkbox.Group>
                </Col>
              </Row>
            );
          })}
        </Col>

        <Col span={3} push={1} style={{ height: 600, overflow: 'auto' }}>
          <Affix>
            <Anchor getContainer={() => document.getElementById('field-access-card') || window}>
              {(props.data.optionalFields || []).map(data => (
                <Anchor.Link href={'#' + data.name} title={data.describe} key={data.name} />
              ))}
            </Anchor>
          </Affix>
        </Col>
      </Card>
    </Modal>
  );
};

export default FieldAccess;
