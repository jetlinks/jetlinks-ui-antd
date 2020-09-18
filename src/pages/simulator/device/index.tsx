import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import Save from "./save";
import Service from "./service";

interface Props {

}

const Simulator: React.FC<Props> = props => {

    const service = new Service('network/simulator');

    const [saveVisible, setSaveVisible] = useState<boolean>(false);

    useEffect(() => {
        service.query({}).subscribe(data => {
            console.log(data, 'ddd');
        })
    });


    return (
        <PageHeaderWrapper title="模拟测试">
            <Button onClick={() => setSaveVisible(true)}> 新建模拟器</Button>
            {saveVisible && <Save close={() => setSaveVisible(false)} />}
        </PageHeaderWrapper>
    )
}
export default Simulator;