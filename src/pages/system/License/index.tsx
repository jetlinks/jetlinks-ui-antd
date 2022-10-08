import PermissionButton from "@/components/PermissionButton";
import TitleComponent from "@/components/TitleComponent";
import { useDomFullHeight } from "@/hooks";
import usePermissions from "@/hooks/permission";
import { onlyMessage } from "@/utils/util";
import { PageContainer } from "@ant-design/pro-layout";
import { Card, Descriptions, Input } from "antd";
import { useEffect, useState } from "react";
import Service from './service';


const License = () => {
    const { minHeight } = useDomFullHeight(`.license`);
    const service = new Service('license');
    const [info, setInfo] = useState<any>()
    const [license, setLicens] = useState<any>()
    const [value, setValue] = useState<any>()
    const { permission: userPermission } = usePermissions('system/License');

    const getInfo = async () => {
        const res = await service.getModule()
        if (res.status === 200) {
            setInfo(res.result)
        }
    }

    const getLicense = async () => {
        const res = await service.getLicense()
        if (res.status === 200) {
            setLicens(res.result)
            setValue(res.result?.license)
        }
    }

    const save = async (data: any) => {
        const res: any = await service.save(data)
        if (res.status === 200) {
            onlyMessage('配置成功')
            getLicense()
        }
    }

    useEffect(() => {
        getInfo()
        getLicense()
    }, [])

    return (
        <PageContainer>
            <Card className="license" style={{ minHeight }}>
                <TitleComponent data={'基础信息'} />
                <div >
                    <Descriptions bordered column={4}>
                        <Descriptions.Item label="Host" span={4}>{info?.host}</Descriptions.Item>
                        {info?.modules.map((item: any) => (
                            <>
                                <Descriptions.Item label="IP" span={2}>{item.ip}</Descriptions.Item>
                                <Descriptions.Item label="Mac" span={2}>{item.mac}</Descriptions.Item>
                            </>)
                        )}
                    </Descriptions>

                </div>
                <div style={{ display: 'flex', marginTop: 10, alignItems: 'center' }}>
                    <TitleComponent data={'License'} style={{ marginTop: 10 }} />
                    <div style={{ width: 200 }}>到期时间:{license?.expire}</div>
                </div>

                <Input.TextArea
                    placeholder="请输入License"
                    rows={10}
                    // style={{ width: 900 }}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                />
                <PermissionButton
                    type="primary"
                    key="save"
                    style={{ marginTop: 20 }}
                    onClick={() => {
                        // save();
                        if (value) {
                            save(value)
                        } else {
                            onlyMessage('请配置License', 'warning')
                        }
                    }}
                    isPermission={userPermission.update}
                >
                    保存
                </PermissionButton>
            </Card>
        </PageContainer>
    )
}
export default License;