import React, { useEffect } from "react";
import { Divider } from "antd";
import FlashVideo from "@/components/VideoPlayer/FlashVideo";
import Visualization from "../visualization";
const Demo = () => {

    useEffect(() => {
    }, []);

    return (
        <div>

            {/* <FlashVideo url="rtmp://47.115.125.80:7016/flash/11:YWRtaW46YWRtaW4=" width={500} height={300} /> */}
            <Divider />
            <Visualization />
        </div>
    )
}
export default Demo;