import React, { useState } from "react";
import { Button } from "antd";

interface Props { }
const AccountCenter: React.FC<Props> = (props) => {
    const [count, setCount] = useState<number>(0);
    return (
        <div>
            个人中心
            {count}
            <Button onClick={() => {
                const a = count + 1;
                setCount(a,);
            }}>点击</Button>

        </div>
    );
}
export default AccountCenter;
