import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtButton } from "taro-ui";
import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";

interface Props {
    close: () => void;
    state: string;
}
const Model: React.FC<Props> = (props) => {
    const [handle, setHandle] = useState<boolean>(false);
    const [handleModel, setHandleModel] = useState<boolean>(false);

    const HandleAlarm = () => {
        return (
            <AtModal isOpened>
                <AtModalHeader>告警处理结果</AtModalHeader>
                <AtModalContent>
                    <View>11111111111</View>
                </AtModalContent>
                <AtModalAction>  
                    <AtButton
                        onClick={()=>{
                            console.log(111)
                        }}
                    >确定</AtButton>
                 </AtModalAction>
            </AtModal>
        )
    }
    return (
        <View>
            {
                props.state === 'solve' ? <AtModal
                    isOpened
                    title='告警数据'
                    confirmText='确认'
                    onClose={() => {
                        props.close()
                    }}
                    onConfirm={() => {
                        props.close()
                    }}
                    content='欢迎加入京东凹凸实验室\n\r欢迎加入京东凹凸实验室'
                /> : <AtModal
                    isOpened
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
                        console.log(handle)
                        setHandle(true)
                        console.log(handle)
                        // props.close()
                        if (handle) {
                            console.log(handle)
                            props.close()
                        }

                    }}
                    content='欢迎加入京东凹凸实验室\n\r欢迎加入京东凹凸实验室'
                />
            }
            {
                handle && <HandleAlarm />
            }
        </View>
    )
}
export default Model;