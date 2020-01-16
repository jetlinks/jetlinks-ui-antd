import React from "react";
import ReactDOM from "react-dom";
// 使用 Ant Design 体系
import FormRender from "form-render/lib/antd";

// 使用 Fusion Design 体系
// import "@alifd/next/dist/next.min.css";
// import FormRender from "form-render/lib/fusion";

// propsSchema 使用标准的 JSON Schema 来描述表单结构
const propSchema = {
    type: "object",
    properties: {
        dateDemo: {
            title: "时间",
            type: "string"
        }
    }
};

// uiSchema 可以增强展示类型的丰富性，如时间组件
const uiSchema = {
    dateDemo: {
        "ui:widget": "date"
    }
};

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            formData: {}
        };
    }

    // 数据变化回调
    onChange = value => {
        this.setState({
            formData: value
        });
    };

    // 数据格式校验回调
    onValidate = list => {
    };

    render() {
        const { formData } = this.state;
        return (
            <FormRender
                propsSchema={propSchema}
                uiSchema={uiSchema}
                formData={formData}
                onChange={this.onChange}
                onValidate={this.onValidate}
            />
        );
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
