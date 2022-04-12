// 回放
import { PageContainer } from '@ant-design/pro-layout';
import LivePlayer from '@/components/Player';
import { useCallback, useEffect, useState } from 'react';
import { Select, Calendar, Empty, List } from 'antd';
import { useLocation } from 'umi';
import Service from './service';
import './index.less';
import { recordsItemType } from '@/pages/media/Device/Playback/typings';
import * as moment from 'moment';
import classNames from 'classnames';

const service = new Service('media');

export default () => {
  const [url] = useState('');
  const [type, setType] = useState('local');
  const [historyList, setHistoryList] = useState<recordsItemType[]>([]);
  const [time, setTime] = useState<any>('');
  const location = useLocation();

  const param = new URLSearchParams(location.search);
  const deviceId = param.get('id');
  const channelId = param.get('channelId');

  const queryLocalRecords = useCallback(
    async (date: any) => {
      if (deviceId && channelId && date) {
        const params = {
          startTime: date.format('YYYY-MM-DD 00:00:00'),
          endTime: date.format('YYYY-MM-DD 23:59:59'),
        };
        let list: recordsItemType[] = [];
        const localResp = await service.queryRecordLocal(deviceId, channelId, params);

        if (localResp.status === 200) {
          list = [localResp.result];
        }

        const serviceResp = await service.recordsInServer(deviceId, channelId, {
          ...params,
          includeFiles: false,
        });

        if (serviceResp.status === 200) {
          list = [...list, ...serviceResp.result];
        }

        setHistoryList(list);
      }
    },
    [time],
  );

  useEffect(() => {
    setTime(moment(new Date()));
    queryLocalRecords(moment(new Date()));
  }, []);

  return (
    <PageContainer>
      <div className={'playback-warp'}>
        <div className={'playback-left'}>
          <LivePlayer url={url} className={'playback-media'} />
        </div>
        <div className={'playback-right'}>
          <Select
            value={type}
            options={[
              { label: '云端', value: 'cloud' },
              { label: '本地', value: 'local' },
            ]}
            style={{ width: '100%' }}
            onSelect={(key: string) => {
              setType(key);
            }}
          />
          <div className={'playback-calendar'}>
            <Calendar
              value={time}
              onChange={(date) => {
                setTime(date);
                queryLocalRecords(date);
              }}
              disabledDate={(currentDate) => currentDate > moment(new Date())}
              fullscreen={false}
            />
          </div>
          <div className={classNames('playback-list', { 'no-list': !!historyList.length })}>
            {historyList && historyList.length ? (
              <List
                itemLayout="horizontal"
                dataSource={historyList}
                renderItem={(item) => {
                  const startTime = moment(item.startTime);
                  const startH = startTime.hours();
                  const startM = startTime.minutes();
                  const srattD = startTime.date();

                  const endTime = moment(item.endTime);
                  const endH = endTime.hours();
                  const endM = endTime.minutes();
                  const endD = endTime.date();
                  return (
                    <List.Item
                      actions={[
                        <a key="list-loadmore-edit">edit</a>,
                        <a key="list-loadmore-more">more</a>,
                      ]}
                    >
                      {`${startH}-${startM}-${srattD}`} ~ {`${endH}-${endM}-${endD}`}
                    </List.Item>
                  );
                }}
              >
                <div></div>
              </List>
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
