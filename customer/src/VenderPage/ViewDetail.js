import React from 'react';
import './component.css'
import {ContainerOutlined} from '@ant-design/icons';
import { Modal} from 'antd';
import 'antd/dist/antd.css';
import FinishedOrderDetail from './FinishedOrderDetail.js';
// It is the light green finish button for preparing order lists.

class DetailButton extends React.Component{
    constructor(props) {
        super(props);
    }

    state = {
        modal1Visible: false,
    };

    setModal1Visible(modal1Visible) {
        this.setState({ modal1Visible });
    }

    render(){
        return (
            <>
            <button onClick={() => this.setModal1Visible(true)}>
            <ContainerOutlined /> View Order Detail
            </button>
            <Modal className='detail-popup'
            centered
            closable={false}
            visible={this.state.modal1Visible}
            onOk={() => this.setModal1Visible(false)}
            cancelButtonProps={{ style: { display: 'none' } }}
            okText={'Close'}
            width={600}
            footer={[
                <button className='close-detail-btn'  onClick={() => this.setModal1Visible(false)}>
                    Close
                </button>
            ]}
            >
                <FinishedOrderDetail>{this.props.children[1]}</FinishedOrderDetail>
               
          </Modal>
          </>
        )
            
    }
}

export default DetailButton;