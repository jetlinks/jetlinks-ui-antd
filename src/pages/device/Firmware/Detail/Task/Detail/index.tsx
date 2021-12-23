import { Badge, Col, Modal, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { service, state } from '@/pages/device/Firmware';
import encodeQuery from '@/utils/encodeQuery';

interface Props {
  visible: boolean;
  close: () => void;
}

type TaskState = 'waiting' | 'processing' | 'success' | 'failed';
const map = {
  waiting: {
    status: 'warning',
    text: '等待升级',
  },
  processing: {
    status: 'processing',
    text: '升级中',
  },
  success: {
    status: 'success',
    text: '完成',
  },
  failed: {
    status: 'error',
    text: '失败',
  },
};
const Detail = (props: Props) => {
  const [count, setCount] = useState<{
    waiting: number;
    processing: number;
    success: number;
    failed: number;
  }>({
    waiting: 0,
    processing: 0,
    success: 0,
    failed: 0,
  });

  const getStateCount = (status: TaskState) =>
    service
      .historyCount(
        encodeQuery({
          terms: {
            taskId: state.taskItem?.id,
            state: status,
          },
        }),
      )
      .then((resp) => {
        count[`${status}`] = resp.result;
        setCount({ ...count });
      });

  useEffect(() => {
    (['waiting', 'processing', 'success', 'failed'] as TaskState[]).forEach((s) => {
      if (state.taskItem?.id) {
        getStateCount(s);
      }
    });
  }, [state.taskItem]);

  return (
    <Modal width="30vw" visible={props.visible} onCancel={() => props.close()} title="任务详情">
      <Row gutter={16}>
        {Object.keys(count)
          .reduce((previousValue: any[], currentValue) => {
            previousValue.push({
              key: currentValue,
              value: count[currentValue],
              ...map[currentValue],
            });
            return previousValue;
          }, [])
          .map((item) => (
            <Col span={6} key={item.key}>
              <Statistic
                title={
                  <Badge
                    status={item.status}
                    text={
                      <a
                        onClick={() => {
                          state.taskDetail = false;
                          state.tab = 'history';
                          state.historyParams = {
                            taskId: state.taskItem?.id,
                            state: item.key,
                          };
                        }}
                      >
                        {item.text}
                      </a>
                    }
                  />
                }
                value={item.value}
              />
            </Col>
          ))}
      </Row>
    </Modal>
  );
};
export default Detail;
