import { Drawer, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { productModel, service } from '@/pages/device/Product';
import MonacoEditor from 'react-monaco-editor';
import { observer } from '@formily/react';

interface Props {
  visible: boolean;
  close: () => void;
}

const Cat = observer((props: Props) => {
  const [codecs, setCodecs] = useState<{ id: string; name: string }[]>();
  const metadata = productModel.current?.metadata as string;
  const [value, setValue] = useState(metadata);
  useEffect(() => {
    service.codecs().subscribe({
      next: (data) => {
        setCodecs([{ id: 'jetlinks', name: 'jetlinks' }].concat(data));
      },
    });
  }, []);

  const convertMetadata = (key: string) => {
    if (key === 'alink') {
      setValue('');
      if (metadata) {
        service.convertMetadata('to', 'alink', JSON.parse(metadata)).subscribe({
          next: (data) => {
            setValue(JSON.stringify(data));
          },
        });
      }
    } else {
      setValue(metadata);
    }
  };
  return (
    <Drawer
      maskClosable={false}
      title="查看物模型"
      onClose={() => props.close()}
      visible={props.visible}
    >
      <div style={{ background: 'rgb(236, 237, 238)' }}>
        <p style={{ padding: 10 }}>
          物模型是对设备在云端的功能描述，包括设备的属性、服务和事件。物联网平台通过定义一种物的描述语言来描述物模型，称之为
          TSL（即 Thing Specification Language），采用 JSON 格式，您可以根据 TSL
          组装上报设备的数据。您可以导出完整物模型，用于云端应用开发。
        </p>
      </div>
      <Tabs onChange={convertMetadata}>
        {codecs?.map((item) => (
          <Tabs.TabPane tab={item.name} tabKey={item.id} key={item.id}>
            <MonacoEditor
              height={350}
              theme="vs"
              language="json"
              value={value}
              editorDidMount={(editor) => {
                editor.onDidScrollChange?.(() => {
                  editor.getAction('editor.action.formatDocument').run();
                });
              }}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Drawer>
  );
});

export default Cat;
