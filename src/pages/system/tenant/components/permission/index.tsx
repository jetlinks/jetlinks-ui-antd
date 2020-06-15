import React from "react";
import Authorization from "@/components/Authorization";
import { TenantItem } from "../../data";

interface Props {
    data: Partial<TenantItem>
}
const Permission = (props: Props) => (

    <Authorization
        close={() => { }}
        target={props.data}
        type="simple"
        targetType='tenant'
        height="55vh"
        showTarget
    />
)
export default Permission;