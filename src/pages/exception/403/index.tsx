import { Result, Button } from "antd";
import { Link } from "umi";
import React from "react";

export default () => (
    <Result
        status='403'
        title='403'
        style={{
            background: 'none'
        }}
        subTitle='抱歉，你无权访问该页面。'
        extra={
            <Link to='/'>
                <Button>返回首页</Button>
            </Link>
        }
    >
    </Result>
)