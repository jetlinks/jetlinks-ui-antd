import type { OperationTimer } from '@/pages/rule-engine/Scene/typings';
import { Modal, Form } from 'antd';
import TimingTrigger, {
  timeUnitEnum,
} from '@/pages/rule-engine/Scene/Save/components/TimingTrigger';
import { numberToString } from '@/pages/rule-engine/Scene/Save/components/TimingTrigger/whenOption';

interface Props {
  close: () => void;
  data?: Partial<OperationTimer>;
  save: (data: OperationTimer, options: any) => void;
}

export default (props: Props) => {
  const [form] = Form.useForm();

  const handleOptions = (value: OperationTimer) => {
    const _options: any = {
      time: undefined,
      when: undefined,
      extraTime: undefined,
    };

    const _timer = value;
    _options.when =
      _timer.when!.length === 0
        ? '每天'
        : `每${_timer
            .when!.map((item) => {
              if (_timer!.trigger === 'week') {
                return numberToString[item];
              } else {
                return item + '号';
              }
            })
            .join(',')}`;
    if (_timer.once) {
      _options.time = _timer.once;
    } else if (_timer.period) {
      _options.time = _timer.period.from + '-' + _timer.period.to;
      _options.extraTime = `每${_timer.period.every}${timeUnitEnum[_timer.period.unit]}执行1次`;
    }
    return _options;
  };

  return (
    <Modal
      title={'定时触发'}
      maskClosable={false}
      visible
      onCancel={() => {
        props.close();
      }}
      onOk={async () => {
        const values = await form.validateFields();
        console.log(values);

        if (values) {
          const _options = handleOptions(values);
          props.save(values, _options);
          props.close();
        }
      }}
      width={700}
    >
      <Form form={form} layout={'vertical'}>
        <TimingTrigger name={[]} form={form} />
      </Form>
    </Modal>
  );
};
