import React from "react";
import { Button } from "antd";
import { router } from "umi";

interface Props {

}
const ToolBar: React.FC<Props> = (props) => {

    return (
        <div>
            <Button icon="plus" type="primary" onClick={() => router.push('/device/instance/add')}>
                新建
            </Button>
            <Button>
                同步状态
            </Button>
        </div>
    );
}
export default ToolBar;
