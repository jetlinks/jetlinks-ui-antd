import { randomString } from '@/utils/util';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import styles from './index.less';

interface Props {
  close: () => void;
  data: any[];
}

const DiagnosticAdvice = (props: Props) => {
  const { data } = props;

  return (
    <Modal
      title="诊断建议"
      onCancel={() => {
        props.close();
      }}
      onOk={() => {
        props.close();
      }}
      width={700}
      visible
    >
      <div className={styles.advice}>
        <div className={styles.alert}>
          <InfoCircleOutlined style={{ marginRight: 10 }} />
          所有诊断均无异常但设备任未上线，请检查以下内容
        </div>
        <div>
          {(data || []).map((item: any) => (
            <div className={styles.infoItem} key={randomString()} style={{ margin: '10px 0' }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default DiagnosticAdvice;
