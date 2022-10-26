import { Button, Form, message, Modal, Radio, Select, Upload } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import { service } from '@/pages/iot-card/CardManagement/index';
import Token from '@/utils/token';
import SystemConst from '@/utils/const';
import { downloadFile } from '@/utils/util';
import { CheckOutlined } from '@ant-design/icons';

type ImportModalType = {
  onCancel: () => void;
};

const ImportModal = (props: ImportModalType) => {
  const [fileType, setFileType] = useState('xlsx');
  const [configId, setConfigId] = useState('');
  const [total, setTotal] = useState(0);

  const { data: platformList, run: platformRun } = useRequest(service.queryPlatformNoPage, {
    manual: false,
    formatResult(result) {
      return result.data;
    },
  });

  const submitData = useCallback(
    (result: any) => {
      service._import(configId, { fileUrl: result }).then((resp) => {
        if (resp.status === 200) {
          setTotal(resp.result.total);
          message.success('导入成功');
        } else {
          message.error(resp.message || '导入失败');
        }
      });
    },
    [configId],
  );

  const fileChange = (info: any) => {
    if (info.file.status === 'done') {
      const resp = info.file.result || { result: '' };
      submitData(resp.result);
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
    <Modal title={'导入'} visible={true} onOk={props.onCancel} onCancel={props.onCancel}>
      <Form layout={'vertical'}>
        <Form.Item label={'平台对接'}>
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
              >
                <Button>上传文件</Button>
              </Upload>
            </Form.Item>
            <Form.Item label={'下载模板'}>
              <Button icon={'file'} onClick={() => downFileFn('xlsx')}>
                .xlsx
              </Button>
              <Button icon={'file'} onClick={() => downFileFn('csv')}>
                .csv
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
      {total && (
        <div>
          <CheckOutlined style={{ color: '#2F54EB', marginRight: 8 }} />
          已完成 总数量 <span style={{ color: '#2F54EB' }}>{total}</span>
        </div>
      )}
    </Modal>
  );
};

export default ImportModal;
