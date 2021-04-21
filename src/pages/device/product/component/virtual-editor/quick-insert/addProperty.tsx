import React, { useEffect, useState } from "react";
import {  Modal } from "antd";
import styles from './index.less';

interface Props {
    close: Function;
    ok: Function;
    data: any;
}

const PropertyComponent: React.FC<Props> = (props) => {

    return (
        <Modal
            visible
            width={800}
            title="请选择使用值"
        >
            <div className={styles.box}>
                {props.data.name}
            </div>
        </Modal>
    );
}
export default PropertyComponent;