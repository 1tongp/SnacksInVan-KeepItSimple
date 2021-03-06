// import React, {useState}from 'react';
import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import '../myOrderPage/MyOrder.css';
import { Layout, Button, notification, InputNumber, Card, Rate, Divider, Input, Alert } from 'antd';
import CountUp from './CountUp.js';
import axios from '../API/axios.js';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
const { TextArea } = Input;

const { Content } = Layout;
const { Meta } = Card;


export default class OrderDetail extends Component {

    constructor(props) {
        super(props);
        //console.log(this.props);
        this.state = {
            menu: [],
            order: [],
            editModalVisible: false,
            cancelModalVisible:false,
            modalBody: <></>,
            diff: "",
            ratings: 0,
            comments: ""
        }
    }


    handleEditClose = () => this.setState([{ editModalVisible: false }]);
    handleEditShow = () => this.setState([{ editModalVisible: true }]);

    handleCancelClose = () => this.setState([{ cancelModalVisible: false }]);
    handleCancelShow = () => this.setState([{ cancelModalVisible: true }]);

    onChange = (index, event) => {
        let newArray = [...this.state.order];
        newArray[index] = event;
        this.setState({ order: newArray });
    }

    ratingsChange = (value) => {
        console.log(value)
        this.setState({ ratings: value })
    };

    commentChange = (value) => {
        this.setState({ comments: value })
    }

    
    closeModalEdit = () =>{
        this.setState({ editModalVisible: false });
    }
    closeModalCancel = () =>{
        this.setState({ cancelModalVisible: false });
    }

    // the action function to submit order
    onOrderSubmit = () => {
        var submitOrder = []
        var sumPrice = 0;
        console.log(sumPrice);
        for (var i = 0; i < this.state.order.length; i++) {
            if (Number.isFinite(this.state.order[i])) {
                submitOrder.push({
                    "snackName": this.state.menu[i].snackName,
                    "qty": this.state.order[i],
                    "snackPrice": this.state.menu[i].snackPrice
                })
                //sumPrice += this.state.menu[i].snackPrice * this.state.menu[i]
            }
        }

        for (var j = 0; j < submitOrder.length; j++){
            let update = sumPrice + submitOrder[j].snackPrice * submitOrder[j].qty
            sumPrice = update
        }

        if (submitOrder.length === 0) {
            this.setState({ editModalVisible: false });
            alert("Please do not submit empty order")
        } else {
            axios.post('/order/change/' + this.props.order._id, {
                // customer: this.props.order.customer._id,
                // vendor: this.props.order.vendor._id, // will be changed in the future
                snacksList: submitOrder,
                status: "outstanding",
                totalPrice: sumPrice
            }).then(response => {
                console.log(response);
                if (response.data.success) {
                    // change the message print to a pop up page
                    alert("Order has been updated")
                    this.setState({ editModalVisible: false });
                }
                else {
                    // change the message print to a pop up page
                    alert("Order placing errored!")
                }
            })
        }
    }

    // the action function to update the customer's comment 
    onCommentSubmit = () => {
        axios.post('/order/change/' + this.props.order._id, {
            comments: this.state.comments,
            ratings: this.state.ratings
        }).then(response => {
            console.log(response);
            if (response.data.success) {
                // change the message print to a pop up page
                alert("Order has been commetned")
                this.setState({ editModalVisible: false });
            }
            else {
                // change the message print to a pop up page
                alert("Order commenting errored!")
            }
        })
    }

    //the action function to cancel the order 
    onCancelSubmit = () => {
        axios.post('/order/change/' + this.props.order._id, {
            status: "canceled"
        }).then(response => {
            console.log(response);
            if (response.data.success) {
                // change the message print to a pop up page
                alert("Order has been canceled")
                this.setState({ cancelModalVisible: false });
            }
            else {
                // change the message print to a pop up page
                alert("Order canceling errored!")
            }
        })
    }

    tick() {
        let now = new Date().getTime()
        let upd = Date.parse(this.props.order.updateTime)
        this.setState({ diff: ((now - upd) / 60000) })
    }

    // update each second
    componentDidMount() {
        axios.get('/snack').then(response => {
            this.setState({ menu: response.data.snacks })
        })
        this.timerID = setInterval(
            () => this.tick(), 1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    // a function to check when the edit model can be visible
    handleEditOrder = () => {
        console.log(this.state.diff)
        if (this.props.order.status === "outstanding" && this.state.diff <= 10) {
            this.setState({ editModalVisible: true });
        }
        if (this.props.order.status === "fulfilled") {
            notification.open({
                message: 'Order is ready to be collected!',
                description: 'You cannot make any changes to a fulfilled order',
                duration: 3
            });
        } else if (this.props.order.status === "outstanding" && this.state.diff > 10) {
            notification.open({
                message: 'Order is being processed!',
                description: 'You can only updated your order within 10 min after placing order.',
                duration: 3
            });
        } else {
            console.log(this.props.order)
            if (this.props.order.ratings === null ) {
                this.setState({ editModalVisible: true })
            } else {
                notification.open({
                    message: 'Please do not comment again',
                    description: 'Enjoy your food, see you next time!',
                    duration: 3
                });
            }
            
        }
    }

    // a function to check when the cancel model can be visible
    handleCancelOrder = () => {
        console.log(this.state.diff)
        if (this.props.order.status === "outstanding" && this.state.diff <= 10) {
            this.setState({ cancelModalVisible: true });
        }
        if (this.props.order.status === "outstanding" && this.state.diff > 10) {
            notification.open({
                message: 'Order is being processed!',
                description: 'You can only canceled your order within 10 min after placing order.',
                duration: 3
            });
        } else if (this.props.order.status === "fulfilled") {
            notification.open({
                message: 'Order is ready to be collected!',
                description: 'You cannot make any changes to a fulfilled order',
                duration: 3
            });
        } else if (this.props.order.status === "completed") {
            notification.open({
                message: 'Order is completed!',
                description: 'Enjoy your food, see you next time!',
                duration: 3
            });
        }
    }


    // a function to check the routes to show different button
    renderVenCus = () => {
        if (window.location.pathname === '/customer/order') {
            return (
                <>
                <button id="btn--changeorder" key='1' onClick={() => this.handleEditOrder()}>Change Order/Comment</button>
                <button id="btn--cancelorder" key='2' onClick={() => this.handleCancelOrder()}>Cancel Order</button>
                </> 
            )

        } else if (window.location.pathname === '/vendor/order'){
            return (
                <>
                <Button  key='1' onClick={() => this.onMarkOrder()}>Mark</Button>
                </> 
            )
        }
    }

    // two model can be show by the same button: update order and comment order, if the order is outstanding --> update, completed --> comment
    renderEditModelBody = () => {
        if (this.props.order.status === "outstanding") {
            return (
                <> 
                 <div className='change-container'>
                    <div className='change-popup'>
                        <Modal.Header>
                            <h3>UPDATE ORDER</h3>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.menu.map((snack, index) => (
                                // <Card cover={<img alt="example" src={snack.snackPhotoPath} />} style={{ marginBottom: "1vh" }} size={"small"} key={snack._id}>
                                <Card className='pop-menu' style={{ marginBottom: "1vh" }} size={"small"} key={snack._id}>
                                    <Meta style={{ marginBottom: "1vh" }} className='snack-name'
                                        title={snack.snackName + "      $" + snack.snackPrice}
                                    />
                                    <InputNumber key={snack._id} min={0} defaultValue={0} onChange={e => this.onChange(index, e)} />
                                </Card>
                            ))}
                        </Modal.Body>
                        <Modal.Footer>
                            <button className='primary-btn' variant="primary" onClick={() => this.onOrderSubmit()}>
                                Update
                            </button>
                            <button className='secondary-btn' variant="primary" onClick={() => this.closeModalEdit()}>
                                Close
                            </button>
                        </Modal.Footer>
                    </div>
                </div>
                </>

            )

        } else {
            return (
                <>  <div className='change-container'>
                    <div className='change-popup rating'>
                        <Modal.Header>
                            <h2>Rate on Our Services</h2>
                            <p className='o-id'>{"Order id:"} <br />{this.props.order._id}</p>
                        </Modal.Header>
                        <Modal.Body>
                            {/* <Divider>Rate on Our Services</Divider> */}
                            <p>Rating</p>
                            <div className='stars'>
                            <Rate  onChange={(e) => this.ratingsChange(e)} />
                            </div>
                            <br /> <br />
                            {/* <Divider></Divider> */}
                            <p>Comment</p><TextArea rows={4} onChange={(e) => this.commentChange(e.target.value)} />
                            {/* {this.state.ratings ? <span className="ant-rate-text">{desc[this.state.ratings -1]}</span> : ''} */}
                        </Modal.Body>
                        <Modal.Footer>
                            <button className='primary-btn' variant="primary" onClick={() => this.onCommentSubmit()}>
                                Submit
                            </button>
                            <button className='secondary-btn' variant="primary" onClick={() => this.closeModalEdit()}>
                                Close
                            </button>
                        </Modal.Footer>
                    </div>
                </div>
                </>

            )

        }
    }

    // the cancal model body
    renderCancelModelBody = () => {
        return (
            <>  <div className='change-container'>
                <div className='change-popup'>
                    <Modal.Header>
                        <h3>CANCEL ORDER</h3>
                        <br />
                        
                    </Modal.Header>
                    <Modal.Body className='cancel-content'>
                        {/* {"Order id:" + this.props.order._id} */}
                        <p>Order id:</p>
                        {/* <br /> */}
                        <p className='order-id'> {this.props.order._id} </p>
                        
                        <p>Are you sure you want to cancel this order?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='primary-btn' variant="primary" onClick={() => this.onCancelSubmit()}>
                            Cancel Order
                        </button>
                        <button className='secondary-btn' variant="primary" onClick={() => this.closeModalCancel()}>
                            Close
                        </button>
                    </Modal.Footer>
                </div>
            </div>
            </>
        )
    }




    render() {
        return (
            <div>
                <Modal show={this.state.editModalVisible} onHide={() => this.handleEditClose()}>
                    {this.renderEditModelBody()}
                </Modal>
                <Modal show={this.state.cancelModalVisible} onHide={() => this.handleCancelClose()}>
                    {this.renderCancelModelBody()}
                </Modal>
                <div className="content">
                    <div className="flex">
                        <div className='time-date-container'>
                        <p className='date'>{this.props.order.createTime.slice(0, 10)}</p>
                        <p className="orderstatus">
                        {( this.props.order.status ==="outstanding") ?  <CountUp updatedAt={this.props.order.updateTime} />: "Order has been " + this.props.order.status}

                        </p>
                        </div>
                       
                        {/* <Button key='1' onClick={() => this.handleEditOrder()}>Change Order/Comment</Button> */}
                        
                            
                        

                        <th >{(this.props.order.discount) ? <Alert message="Discount applied!" type="warning" showIcon/> : <></>}</th>
                        
                        <th >{(this.props.order.status === "outstanding") ? <Alert id="alert" message="Discount will apply if exceed 15min!" type="info" showIcon /> : <></>}</th>
                    </div>
                    <div className="flex">
                        <div className="flex--child">
                       
                                <tr>
                                    <th>Time:</th>
                                    <td>{this.props.order.createTime.slice(11, 19)}</td>
                                </tr>

                                
                                <tr>
                                    <th>Order Id:</th>
                
                                    <div className="flex--child--orderid">
                                    {this.props.order._id}

                                    </div>


                          
                                    
                                    
                                </tr>

                           
                              
                                

                                
                                
                                <tr>
                                    <th>Van Name:</th>
                                    <td>{this.props.order.vendor.name}</td>
                                </tr>
                                <tr>
                                    <th>Order Status:</th>
                                    <td>{this.props.order.status}</td>
                                </tr>

                     
                        </div>

                        <div className="flex--child centertable">
                            <table className='snack-item'>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>$Price</th>
                                </tr>

                                



                            
                                    {this.props.order.snacksList.map(
                                        (singleSnack) =>
                                            <tr key={singleSnack.snackName}>
                                                <td>{singleSnack.snackName}</td>
                                                <td>{singleSnack.qty}</td>
                                                <td>{singleSnack.qty * singleSnack.snackPrice}</td>
                                            </tr>)}


                                <tr>
                                    <td></td>
                                
                                    
                                    <th className='total'>$Total Price</th>
                                    {/* <th>{this.props.order.totalPrice}</th> */}
                                    {(this.props.order.discount) ? <th>{this.props.order.totalPrice * 1.25} * 0.8 = {this.props.order.totalPrice}</th> : <th>{this.props.order.totalPrice}</th>}

                                </tr>

                            </table>
                        </div>

                        <div className="flex--child flex--column">
                            <div className="flex--column--child">
                                <tr>
                                    <th>Service Rating: (1 is terrible, 5 is great!)</th>
                                    {/* <th>Food</th> */}
                                </tr>
                                <tr>
                                    <th>{this.props.order.ratings}</th>
                                </tr>

                                
                            </div>

                            <div>
                                <tr>
                                    <th>Comment:</th>
                                </tr>
                                <tr>
                                    <td>{this.props.order.comments}</td>
                                </tr>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='right-buttons'>{this.renderVenCus()}</div>
                    <br></br>
                    <center>
                        <hr></hr>
                    </center>
                </div>

            </div>
        )
    }
}
