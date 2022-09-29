import PermissionButton from "@/components/PermissionButton";
import TitleComponent from "@/components/TitleComponent";
import { useDomFullHeight } from "@/hooks";
import { onlyMessage } from "@/utils/util";
import { Card, Descriptions, Input } from "antd";
import { useEffect, useState } from "react";
import Service from '../service';


const Init = () => {
    const { minHeight } = useDomFullHeight(`.license`);
    const service = new Service('license');
    const [info, setInfo] = useState<any>([])
    const [value, setValue] = useState<any>()

    const getInfo = async () => {
        const res = await service.getModule()
        if (res.status === 200) {
            setInfo(res.result)
        }
    }

    const save = async (data: any) => {
        const res: any = await service.licenseInit(data)
        if (res.status === 200) {
            onlyMessage('配置成功')
            const resp = await service.initPage()
            if (resp.status === 200 && !resp.result.length) {
                window.location.href = '/#/init-home';
              }else{
                window.location.href='/'
              }
        }
    }

    useEffect(() => {
        document.title = '';
        getInfo()
    }, [])

    return (
            <Card className="license" style={{ minHeight }}>
                <TitleComponent data={'基础信息'} />
                <div >
                    <Descriptions bordered column={4}>
                        {info.map((item: any) => (
                            <>
                                <Descriptions.Item label="IP" span={2}>{item.ip}</Descriptions.Item>
                                <Descriptions.Item label="mac" span={2}>{item.mac}</Descriptions.Item>
                            </>)
                        )}
                    </Descriptions>

                </div>
                <div style={{ display: 'flex', marginTop: 10, alignItems: 'center' }}>
                    <TitleComponent data={'License'} style={{ marginTop: 10 }} />
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
                    isPermission={true}
                >
                    保存
                </PermissionButton>
            </Card>
    )
}
export default Init;