import { PageContainer } from '@ant-design/pro-layout';
import { Card, Input, Radio } from 'antd';
import { useIntl, useLocation } from 'umi';
import { useEffect, useState } from 'react';
import { TriggerWay, TimingTrigger } from './components';
import Actions from './action';
import { PermissionButton } from '@/components';
import ProForm from '@ant-design/pro-form';

export default () => {
  const intl = useIntl();
  const location = useLocation();
  const [form] = ProForm.useForm();

  const [actionType, setActionType] = useState(1);
  const { getOtherPermission } = PermissionButton.usePermission('rule-engine/Scene');

  const getDetail = async () => {
    // TODO 回显数据
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      getDetail();
    }
  }, [location]);

  const saveData = async () => {
    const formData = await form.validateFields();
    console.log(formData);
  };

  return (
    <PageContainer>
      <Card>
        <ProForm form={form} layout={'vertical'}>
          <ProForm.Item
            name="name"
            label={intl.formatMessage({
              id: 'pages.table.name',
              defaultMessage: '名称',
            })}
            required={true}
            rules={[
              { required: true, message: '请输入名称' },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ]}
          >
            <Input placeholder={'请输入名称'} />
          </ProForm.Item>
          <ProForm.Item label={'触发方式'} required>
            <TriggerWay />
            <TimingTrigger />
          </ProForm.Item>
          <ProForm.Item
            label={
              <>
                <span>执行动作</span>
                <Radio.Group
                  value={actionType}
                  optionType="button"
                  buttonStyle="solid"
                  size={'small'}
                  style={{ marginLeft: 12 }}
                  onChange={(e) => {
                    setActionType(e.target.value);
                  }}
                  options={[
                    { label: '串行', value: 1 },
                    { label: '并行', value: 2 },
                  ]}
                />
              </>
            }
            tooltip={
              <div style={{ width: 200 }}>
                <div>并行：满足任意条件时会触发执行动作</div>
                <div>穿行：满足所有执行条件才会触发执行动作</div>
              </div>
            }
            required
          >
            <Actions />
          </ProForm.Item>
          <ProForm.Item name={'describe'} label={'说明'}>
            <Input.TextArea rows={4} maxLength={200} showCount placeholder={'请输入说明'} />
          </ProForm.Item>
        </ProForm>
        <PermissionButton isPermission={getOtherPermission(['add', 'update'])} onClick={saveData}>
          保存
        </PermissionButton>
      </Card>
    </PageContainer>
  );
};
