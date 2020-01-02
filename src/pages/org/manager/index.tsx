import React, { Component } from "react";
import { Card, notification, Button } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";

interface ManagerProps {

}

interface ManagerState {

}

class Manager extends Component<ManagerProps, ManagerState>{

    openNotification = () => {
        console.log("ssss");
        notification.open({
            message: 'Notification Title',
            description:
                'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    };
    render() {
        return (
            <PageHeaderWrapper title="综合设置">
                <Card bordered={false}>
                    综合设置
                    <Button onClick={this.openNotification}>触发错误</Button>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default Manager;
