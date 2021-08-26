import React from 'react';
import './Loading.css';

class Loading extends React.Component {
    render() {
        return <div className="loading" style={{display: (this.props.loading) ? 'block' : 'none'}}>
            <div className="dlg-mask_transparent"></div>
            <div className=" weui-toast">
                <i className=" weui-loading weui-icon_toast"></i>
                <p className=" weui-toast__content">
                    {this.props.msg}
                </p>
            </div>
        </div>
    }
}
export default Loading;
