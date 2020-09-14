import { EditOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React from "react";
import styles from '../index.less';

interface Props {
    edit: boolean
}
const OptionGroup: React.FC<Props> = props => {
    const { edit } = props;

    return (
        <div className={styles.optionGroup}>
            {edit ?
                <div style={{ float: 'right' }}>
                    <Tooltip title="新增" style={{ float: 'right' }}>
                        <Button
                            type="danger"
                            shape="circle"
                            size="large"
                            onClick={() => {

                            }}
                        >
                            <PlusOutlined />
                        </Button>
                    </Tooltip>
                    <div style={{ float: 'right', marginLeft: 10 }}>
                        <Tooltip title="保存">
                            <Button
                                type="primary"
                                shape="circle"
                                size="large"
                                onClick={() => {

                                }}
                            >

                                <SaveOutlined />
                            </Button>
                        </Tooltip>
                    </div>
                </div> :
                <div style={{ textAlign: 'center' }}>
                    <Tooltip title="编辑">
                        <Button
                            type="danger"
                            shape="circle"
                            size="large"
                            onClick={() => {

                            }}
                        >
                            <EditOutlined />
                        </Button>
                    </Tooltip>
                </div>
            }
        </div>
    )
}
export default OptionGroup;