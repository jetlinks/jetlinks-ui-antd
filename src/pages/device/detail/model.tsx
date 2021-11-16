import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtButton, AtTextarea, AtMessage } from "taro-ui";
import Taro from '@tarojs/taro';
import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Service from '../service'

interface Props {
    close: () => void;
    data: any;
}
const Model: React.FC<Props> = (props) => {
    const [handle, setHandle] = useState<boolean>(false);
    const [modelValue, setModelValue] = useState<string>('');

    const handleAlarm = (id: string, data: any) => {
        Service.handleAlarm(id, data).then((res) => {
            if (res.data.status === 200) {
                Taro.atMessage({
                    'message': '处理成功',
                    'type': "success",
                })
                setTimeout(() => {
                    setHandle(false)
                    props.close()
                }, 1000)

                // async function message() {
                //     Taro.atMessage({
                //         'message': '处理成功',
                //         'type': "success",
                //     })
                // }
                // message().then(() => {
                //     setHandle(false)
                //     props.close()
                // })
            }
        })
    }

    useEffect(() => {
        console.log(props.data)
    }, [])

    return (
        <View>
            <AtMessage />
            {
                props.data.state === 'solve' ? <AtModal
                    isOpened
                    title='告警数据'
                    confirmText='确认'
                    onClose={() => {
                        props.close()
                    }}
                    onConfirm={() => {
                        props.close()
                    }}
                    content={
                        `${JSON.stringify(props.data.alarmData, null, 2)}
                        处理结果：${props.data.description}
                        `
                    }
                /> : <AtModal
                    isOpened={!handle}
                    title='告警数据'
                    confirmText='处理数据'
                    cancelText='取消'
                    onClose={() => {
                        props.close()
                    }}
                    onCancel={() => {
                        props.close()
                    }}
                    onConfirm={() => {
                        setHandle(true)
                        // props.close()
                    }}
                    content={JSON.stringify(props.data.alarmData, null, 2)}
                />
            }

            {
                //处理弹窗
                <AtModal isOpened={handle}>
                    <AtModalHeader>告警处理结果</AtModalHeader>
                    <AtModalContent>
                        <View>
                            <AtTextarea
                                value={modelValue}
                                onChange={(value) => {
                                    setModelValue(value)
                                    console.log(value)
                                }}
                            />
                        </View>
                    </AtModalContent>
                    <AtModalAction>
                        <AtButton
                            customStyle={{ width: '100%' }}
                            onClick={() => {
                                handleAlarm(props.data.id, modelValue)
                            }}
                        >确定</AtButton>
                        <AtButton
                            customStyle={{ width: '100%' }}
                            onClick={() => {
                                setHandle(false)
                                props.close()
                            }}
                        >取消</AtButton>
                    </AtModalAction>
                </AtModal>
            }
        </View>
    )
}
export default Model;