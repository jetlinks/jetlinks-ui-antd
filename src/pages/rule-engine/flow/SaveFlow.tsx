import { Component } from "react";
import { withPropsAPI } from "gg-editor";
import React from "react";

class SaveFlow extends Component {

    componentDidMount() {
        const { propsAPI } = this.props;
    }

    save = (e) => {
        const { propsAPI } = this.props;
    }

    render() {
        const { propsAPI } = this.props;
        window.editor = window.editor || {};
        window.editor.getData = () => {
            return propsAPI.save();
        };
        return (
            <div >
                {/* <Button onClick={this.save}>保存数据</Button> */}
            </div>
        );
    }
}

export default withPropsAPI(SaveFlow);
