import { service } from '@/pages/device/Instance';
import { useParams } from 'umi';
import { DatePicker, Modal, Radio, Space, Table } from 'antd';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import encodeQuery from '@/utils/encodeQuery';
import { useEffect, useState } from 'react';
import moment from 'moment';

interface Props {
  visible: boolean;
  close: () => void;
  data: Partial<PropertyMetadata>;
}

const PropertyLog = (props: Props) => {
  const params = useParams<{ id: string }>();
  const { visible, close, data } = props;
  const [dataSource, setDataSource] = useState<any>({});
  const [start, setStart] = useState<number>(moment().startOf('day').valueOf());
  const [end, setEnd] = useState<number>(new Date().getTime());
  const [radioValue, setRadioValue] = useState<undefined | 'today' | 'week' | 'month'>('today');
  const [dateValue, setDateValue] = useState<any>(undefined);

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: any) => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
    },
    {
      title: '自定义属性',
      dataIndex: 'formatValue',
      key: 'formatValue',
    },
  ];

  const handleSearch = (param: any, startTime?: number, endTime?: number) => {
    service
      .getPropertyData(
        params.id,
        encodeQuery({
          ...param,
          terms: {
            property: data.id,
            timestamp$BTW: startTime && endTime ? [startTime, endTime] : [],
          },
          sorts: { timestamp: 'desc' },
        }),
      )
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.result);
        }
      });
  };

  useEffect(() => {
    if (visible) {
      handleSearch(
        {
          pageSize: 10,
          pageIndex: 0,
        },
        start,
        new Date().getTime(),
      );
    }
  }, [visible]);

  // @ts-ignore
  return (
    <Modal
      maskClosable={false}
      title="详情"
      visible={visible}
      onCancel={() => close()}
      onOk={() => close()}
      width="45vw"
    >
      <div style={{ marginBottom: '20px' }}>
        <Space>
          <Radio.Group
            value={radioValue}
            buttonStyle="solid"
            onChange={(e) => {
              const value = e.target.value;
              setRadioValue(value);
              let st: number = 0;
              const et = new Date().getTime();
              if (value === 'today') {
                st = moment().startOf('day').valueOf();
              } else if (value === 'week') {
                st = moment().subtract(6, 'days').valueOf();
              } else if (value === 'month') {
                st = moment().subtract(29, 'days').valueOf();
              }
              setDateValue(undefined);
              setStart(st);
              setEnd(et);
              handleSearch(
                {
                  pageSize: 10,
                  pageIndex: 0,
                },
                st,
                et,
              );
            }}
            style={{ minWidth: 220 }}
          >
            <Radio.Button value="today">今日</Radio.Button>
            <Radio.Button value="week">近一周</Radio.Button>
            <Radio.Button value="month">近一月</Radio.Button>
          </Radio.Group>
          {
            // @ts-ignore
            <DatePicker.RangePicker
              value={dateValue}
              showTime
              onChange={(dates: any) => {
                if (dates) {
                  setRadioValue(undefined);
                  setDateValue(dates);
                  const st = dates[0]?.valueOf();
                  const et = dates[1]?.valueOf();
                  setStart(st);
                  setEnd(et);
                  handleSearch(
                    {
                      pageSize: 10,
                      pageIndex: 0,
                    },
                    st,
                    et,
                  );
                }
              }}
            />
          }
        </Space>
      </div>

      <Table
        size="small"
        rowKey={'id'}
        onChange={(page) => {
          handleSearch(
            {
              pageSize: page.pageSize,
              pageIndex: Number(page.current) - 1 || 0,
            },
            start,
            end,
          );
        }}
        dataSource={dataSource?.data || []}
        columns={columns}
        pagination={{
          pageSize: dataSource?.pageSize || 10,
          showSizeChanger: true,
          total: dataSource?.total || 0,
        }}
      />
    </Modal>
  );
};
export default PropertyLog;
