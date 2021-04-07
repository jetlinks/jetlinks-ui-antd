import React, {useEffect, useState} from 'react';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {Card, Input, message, Modal, Result, Steps} from 'antd';
import styles from './style.less';
import apis from "@/services";
import ChoiceDevice from '@/pages/device/group/save/bind/ChoiceDevice'
import {GroupData} from "@/pages/device/group/data";

interface Props extends FormComponentProps {
  close: Function;
  data: Partial<GroupData>;
}

interface State {
  currentStep: number;
  deviceId: any[];
  groupData: any
}

const groupSave: React.FC<Props> = props => {

  const {
    form: {getFieldDecorator},
    form,
  } = props;

  const initState: State = {
    currentStep: 0,
    deviceId: [],
    groupData: props.data
  };

  const [currentStep, setCurrentStep] = useState<number>(initState.currentStep);
  const [deviceId, setDeviceId] = useState(initState.deviceId);
  const [groupData, setGroupData] = useState(initState.groupData);

  let taskByIdPush: any;

  useEffect(() => {
    props.data.devices?.map((item: any) => {
      deviceId.push(item.id);
    });

    return () => {
      taskByIdPush && taskByIdPush.unsubscribe();
    };
  }, []);

  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      if (props.data.id) {
        apis.deviceGroup.saveOrUpdate(fileValue)
          .then((response: any) => {
            if (response.status === 200) {
              message.success("保存成功");
              setCurrentStep(Number(currentStep + 1));
            }
          }).catch(() => {
        })
      } else {
        apis.deviceGroup.save(fileValue)
          .then((response: any) => {
            if (response.status === 200) {
              message.success("保存成功");
              setCurrentStep(Number(currentStep + 1));
              setGroupData(response.result);
            }
          }).catch(() => {
        })
      }
    });
  };

  const groupBindDevice = () => {

    apis.deviceGroup._bind(groupData.id, deviceId)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('绑定成功');
          setCurrentStep(Number(currentStep + 1));
        }
      }).catch(() => {
    });
  };

  return (

    <Modal
      title={`${props.data?.id ? '编辑' : '新建'}设备分组`}
      visible
      okText={currentStep === 2 ? '完成' : '下一步'}
      cancelText={currentStep === 0 ? '取消' : '上一步'}
      onOk={() => {
        if (currentStep === 2) {
          props.close();
        } else if (currentStep === 1) {
          groupBindDevice();
        } else {
          submitData();
        }
      }}
      width='50%'
      onCancel={(event) => {
        if (event.target.tagName === 'BUTTON') {
          if (currentStep === 0) {
            props.close();
          } else {
            setCurrentStep(Number(currentStep - 1));
          }
        } else {
          props.close();
        }
      }}
    >

      <Steps current={currentStep} size="small" className={styles.steps} style={{paddingBottom: 24}}>
        <Steps.Step title="基本信息"/>
        <Steps.Step title="绑定设备"/>
        <Steps.Step title="完成"/>
      </Steps>
      <div>
        {currentStep === 0 && (
          <Form labelCol={{span: 5}} wrapperCol={{span: 15}} key="groupForm">
            <Form.Item key="id" label="分组标识">
              {getFieldDecorator('id', {
                rules: [
                  {required: true, message: '请输入分组标识'},
                  {max: 64, message: '分组标识不超过64个字符'},
                  {pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, "g"), message: '分组标识只能由数字、字母、下划线、中划线组成'}
                ],
                initialValue: props.data?.id,
              })(<Input placeholder="输入分组ID" disabled={!!props.data.id}/>)}
            </Form.Item>
            <Form.Item key="name" label="分组名称">
              {getFieldDecorator('name', {
                rules: [
                  {required: true, message: '请输入分组名称'},
                  {max: 200, message: '分组名称不超过200个字符'}
                ],
                initialValue: props.data?.name,
              })(<Input placeholder="输入分组名称"/>)}
            </Form.Item>
            <Form.Item key='description' label="描述">
              {getFieldDecorator('description', {
                initialValue: props.data?.description,
              })(<Input.TextArea rows={4}/>)}
            </Form.Item>
          </Form>
        )}

        {/* {currentStep === 1 && (
          <div>
            <Card style={{maxHeight: 500, overflowY: 'auto', overflowX: 'hidden'}}>
              <ChoiceDevice deviceList={deviceId} save={(item: any[]) => {
                setDeviceId(item);
              }}/>
            </Card>
          </div>
        )} */}

        {currentStep === 2 && (
          <Result
            status="success"
            title="操作成功"
            className={styles.result}
          >
          </Result>
        )}
      </div>
    </Modal>
  );
};

export default Form.create<Props>()(groupSave);
