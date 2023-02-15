import { Button, Form, message, Modal, Radio, Select, Space, Upload } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import { service } from '@/pages/iot-card/CardManagement/index';
import Token from '@/utils/token';
import SystemConst from '@/utils/const';
import { downloadFile, onlyMessage } from '@/utils/util';
import { CheckOutlined } from '@ant-design/icons';

type ImportModalType = {
  onCancel: () => void;
  onOk: () => void;
};

const ImportModal = (props: ImportModalType) => {
  const [fileType, setFileType] = useState('xlsx');
  const [configId, setConfigId] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { data: platformList, run: platformRun } = useRequest(service.queryPlatformNoPage, {
    manual: true,
    formatResult(result) {
      return result.result;
    },
  });

  const submitData = useCallback(
    (result: any) => {
      service._import(configId, { fileUrl: result }).then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          setTotal(resp.result.total);
          message.success('导入成功');
          props.onOk();
        } else {
          message.error(resp.message || '导入失败');
        }
      });
    },
    [configId],
  );

  const fileChange = (info: any) => {
    setLoading(true);
    if (info.file.status === 'done') {
      const resp = info.file.response || { result: '' };
      submitData(resp.result);
    }
    if (!info.file.status) {
      setLoading(false);
    }
  };

  const downFileFn = (type: string) => {
    const url = `/${SystemConst.API_BASE}/network/card/template.${type}`;
    downloadFile(url);
  };

  useEffect(() => {
    platformRun({
      sorts: [{ name: 'createTime', order: 'desc' }],
      terms: [{ column: 'state', value: 'enabled' }],
    });
  }, []);

  return (
    <Modal
      title={'导入'}
      visible={true}
      onOk={async () => {
        // props.onCancel()
        const res = await form.validateFields();
        if (res) {
          props.onCancel();
          // console.log(res)
        }
      }}
      onCancel={props.onCancel}
    >
      <Form layout={'vertical'} form={form}>
        <Form.Item
          label={'平台对接'}
          name={'platform'}
          required
          rules={[{ required: true, message: '请选择平台对接' }]}
        >
          <Select
            showSearch
            placeholder={'请选择平台对接'}
            fieldNames={{ label: 'name', value: 'id' }}
            options={platformList}
            filterOption={(input, option) => {
              if (option?.name) {
                return option.name.includes(input);
              }
              return false;
            }}
            onChange={(key) => {
              setConfigId(key);
            }}
          />
        </Form.Item>
        {configId && (
          <>
            <Form.Item label={'文件格式'}>
              <Radio.Group
                options={[
                  { label: 'xlsx', value: 'xlsx' },
                  { label: 'csv', value: 'csv' },
                ]}
                onChange={(e) => {
                  setFileType(e.target.value);
                }}
                defaultValue={fileType}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
            <Form.Item label={'文件上传'}>
              <Upload
                accept={`.${fileType || 'xlsx'}`}
                action={`/${SystemConst.API_BASE}/file/static`}
                headers={{
                  'X-Access-Token': Token.get(),
                }}
                showUploadList={false}
                onChange={fileChange}
                beforeUpload={(file) => {
                  const type = fileType === 'csv' ? 'csv' : 'xlsx';

                  const isCsv = file.type === 'text/csv';
                  const isXlsx =
                    file.type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                  if (!isCsv && type !== 'xlsx') {
                    onlyMessage('请上传.csv格式文件', 'warning');
                  }
                  if (!isXlsx && type !== 'csv') {
                    onlyMessage('请上传.xlsx格式文件', 'warning');
                  }
                  return (isCsv && type !== 'xlsx') || (isXlsx && type !== 'csv');
                }}
              >
                <Button loading={loading}>上传文件</Button>
              </Upload>
            </Form.Item>
            <Form.Item label={'下载模板'}>
              <Space>
                <Button icon={'file'} onClick={() => downFileFn('xlsx')}>
                  .xlsx
                </Button>
                <Button icon={'file'} onClick={() => downFileFn('csv')}>
                  .csv
                </Button>
              </Space>
            </Form.Item>
          </>
        )}
      </Form>
      {!!total && (
        <div>
          <CheckOutlined style={{ color: '#2F54EB', marginRight: 8 }} />
          已完成 总数量 <span style={{ color: '#2F54EB' }}>{total}</span>
        </div>
      )}
    </Modal>
  );
};

export default ImportModal;
