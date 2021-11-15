import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtButton ,AtTextarea} from "taro-ui";
import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";

interface Props {
    close: () => void;
    data:any;
}
const Model: React.FC<Props> = (props) => {
    const [handle, setHandle] = useState<boolean>(false);


    const HandleAlarm = () => {
        return (
            <AtModal isOpened>
                <AtModalHeader>告警处理结果</AtModalHeader>
                <AtModalContent>
                    <View>
                        <AtTextarea
                            value={''}
                            onChange={()=>{}}
                        />
                    </View>
                </AtModalContent>
                <AtModalAction>  
                    <AtButton
                    customStyle={{width:'100%'}}
                        onClick={()=>{
                            setHandle(false)
                            props.close()
                        }}
                    >确定</AtButton>
                    <AtButton
                    customStyle={{width:'100%'}}
                        onClick={()=>{
                            setHandle(false)
                            props.close()
                        }}
                    >取消</AtButton>
                 </AtModalAction>
            </AtModal>
        )
    }

    useEffect(()=>{
        console.log(props.data.state)
    },[])

    return (
        <View>
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
                    content={JSON.stringify(props.data.alarmData,null, 2)}
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
                        setHandle(true)
                        // props.close()
                    }}
                    content={JSON.stringify(props.data.alarmData,null, 2)}
                />
            }
            {
                handle && <HandleAlarm />
            }
        </View>
    )
}
export default Model;