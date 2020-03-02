import React, { useEffect, useState } from 'react';
import ChartCard from '@/pages/analysis/components/Charts/ChartCard';
import { Col, Icon, Row, Spin, Tooltip } from 'antd';
import { IVisitData } from '@/pages/analysis/data';
import moment from 'moment';
import apis from '@/services';
import FunctionDebug from './function-debug/index';
import encodeQueryParam from '@/utils/encodeParam';

interface Props {
    device: any
}

interface State {
    runInfo: any;
    propertiesData: any[];
    functionsVisible: boolean;
    metadata: any;
    functionsData: any[];
    deviceState: any;
    functionsInfo: any;
}
const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: { marginBottom: 24 },
};

// mock data
const visitData: IVisitData[] = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
    visitData.push({
        x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
        y: fakeY[i],
    });
}

const Functions: React.FC<Props> = (props) => {

    const initState: State = {
        runInfo: {},
        propertiesData: [],
        functionsVisible: false,
        metadata: {},
        functionsData: [],
        deviceState: {},
        functionsInfo: {}
    };

    const [runInfo, setRunInfo] = useState(initState.runInfo);
    const [functionsVisible, setFunctionsVisible] = useState(initState.functionsVisible);
    const [metadata, setMetadata] = useState(initState.metadata);
    const [functionsData, setFunctionsData] = useState(initState.functionsData);
    const [ setDeviceState] = useState(initState.deviceState);
    const [ functonsInfo,setFunctionsInfo] = useState(initState.functionsInfo);

    useEffect(() => {
        loadRunInfo();
    }, []);


    useEffect(() => {
        //组装数据
        if (runInfo && runInfo.metadata) {
          const metadata = JSON.parse(runInfo.metadata);
          const {functions } = metadata;

          //设置event数据
          functions.map((fun: any) => {
              //加载数据
            functions.loading = false;
            apis.deviceInstance.functionsData(// eventData  调用的接口，功能接口出来后修改
              props.device.id,
              fun.id,
              encodeQueryParam({
                pageIndex: 0,
                pageSize: 10,
                terms: { deviceId: props.device.id }
              })
            ).then(response => {
              const tempResult = response?.result;
              if (tempResult) {
                functionsData.push({ functionsId: fun.id, tempResult });
                setFunctionsData([...functionsData]);
              }
              fun.loading = false;
            }).catch(() => {
              fun.loading = false;
            });
          });
          setMetadata(metadata);
      }
    }, [runInfo]);

    const loadRunInfo = () => {
      runInfo.loading = true;
      setRunInfo({ ...runInfo });
      apis.deviceInstance.runInfo(props.device.id)
        .then(response => {
            if (response.result) {
                response.result.loading = false;
            }
            setRunInfo(response.result);
            setDeviceState(response.result);
        }).catch(() => {

        });
    };

    const refreshFunctionsItem = (item: any) => {
      const { functions } = metadata;
      //修改加载状态
      let tempFunctions = functions.map((i: any) => {
        if (i.id === item.id) {
            i.loading = true;
        }
        return i;
      });
      metadata.functions = tempFunctions;
      setMetadata({ ...metadata });
      //为了显示Loading效果
      apis.deviceInstance.functionsData (// eventData  刷新按钮调用的接口，功能接口出来后修改
        props.device.id,
        item.id,
        encodeQueryParam({
            terms: { deviceId: props.device.id }
        })
      ).then(response => {
        const tempResult = response?.result;
        if (tempResult) {
          functionsData.forEach(i => {
            if (i.functionsId === item.id) {
              i.data = tempResult;
            }
          });
          setFunctionsData([...functionsData]);
        }

      }).catch(() => {

      });
    };

    return (
        <div>
            {
                metadata && metadata.functions ? <Row gutter={24}>
                    {
                        (metadata.functions).map((item: any) => {
                            let tempData = functionsData.find(i => i.functionsId === item.id);
                            return (
                                <Col {...topColResponsiveProps} key={item.id}>
                                    <Spin spinning={item.loading}>
                                        <ChartCard
                                            bordered={false}
                                            title={item.name}
                                            action={
                                                <Tooltip
                                                    title='刷新'
                                                >
                                                    <Icon type="sync" onClick={() => { refreshFunctionsItem(item) }} />
                                                </Tooltip>
                                            }

                                            total={`${tempData?.data.total || 0}次`}
                                            contentHeight={46}
                                        >
                                            <span>
                                                <a
                                                    style={{ float: "right" }}
                                                    onClick={() => {
                                                        setFunctionsVisible(true);
                                                        setFunctionsInfo(item);
                                                    }}>
                                                    功能调试
                                                </a>
                                            </span>
                                        </ChartCard>

                                    </Spin>

                                    {
                                      functionsVisible &&
                                        <FunctionDebug
                                            item={functonsInfo}
                                            close={() => { setFunctionsVisible(false) }}
                                            type={functonsInfo.id}
                                            deviceId={props.device.id}
                                        />
                                    }
                                </Col>
                            )
                        }
                        )
                    }

                </Row>
                    :
                    <Col {...topColResponsiveProps}/>
            }
        </div>
    );
};

export default Functions;
