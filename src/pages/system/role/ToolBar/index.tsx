import React from "react";
import { Button } from "antd";
import { router } from "umi";


interface Props {

}

const ToolBar: React.FC<Props> = (props) => {
    return (
        <div>
            <Button icon="plus" type="primary" onClick={() => router.push('/device/product/add')}>
                新建
            </Button>
        </div>
    );
}
export default ToolBar;
