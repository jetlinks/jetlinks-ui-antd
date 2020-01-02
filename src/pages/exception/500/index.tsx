import { Result, Button } from "antd";
import { Link } from "umi";
import React from "react";

export default () => (
    <Result
        status='500'
        title='500'
        style={{
            background: 'none'
        }}
        subTitle='抱歉，服务器出错了。'
        extra={
            <Link to='/'>
                <Button>返回首页</Button>
            </Link>
        }
    >
    </Result>
)