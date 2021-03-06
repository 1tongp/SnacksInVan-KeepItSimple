import React, { Component, useEffect, useState, message } from 'react';
import '../myOrderPage/MyOrder.css';
import '../ShoppingCart/styles.css';
import OrderDetail from './OrderDetail.js';
import axios from '../API/axios.js';
import URLs from '../url.js';
import io from 'socket.io-client';
import '../myOrderPage/myorderheader.css';
import { Empty } from 'antd';


function Orders(props) {
    const [orders, setOrders] = useState([])
    const [status, setStatus] = useState('')
    const id = props.id
    //console.log(id);

    useEffect(() => {
        console.log(id);
        console.log(props);
        if (props.status) {
            setStatus(props.status)
        }
        
        async function fetchData() {
            axios.get("/order?" + props.target + "=" + id + status).then(response => {
                if (response.data.success) {
                    setOrders(response.data.customerOrders)
                } else {
                    setOrders([])
                    message.error(response.data.error);
                }
            }).catch(error => {
                setOrders([]);
                console.log(error)
            })
        }
        fetchData()
    }, [])

    //console.log(orders);

    const loopOrders = orders.map((singleOrder) => {
        if (singleOrder.status !== "canceled") {
            return (
                <OrderDetail
                    key={singleOrder._id}
                    order={singleOrder} />
            )
        }

    })

    return (
        <>
            {
                (orders.length > 0) ? loopOrders
                    : <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        description={<span>Currently No Orders</span>} />
            }
        </>
    )




}

export default class OrderListCom extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            orders: [],
        }
    }

    componentDidMount() {
        console.log(this.props);
        const socket = io(`${URLs.socketURL}/socket`, { transports: ['websocket'] });

        socket.on("newOrder", (order) => {
            console.log("insertion detected at frontend");
            this.setState({ orders: [...this.state.orders, order] });
        });

        socket.on("updateOrder", (id) => {
            console.log("update detected at frontend");
            console.log(id);
        });

        socket.on("delectOrder", (id) => {
            console.log("deletion detected at frontend");
            const updatedOrders = this.state.orders.filter((order) => {
                return order._id !== id;
            });
            this.setState({ orders: updatedOrders })
        });
    }

    render() {
        return (
            <div>
                <Orders id={this.props.id} orders={this.props.orders} target={this.props.target} status={this.props.status} />
            </div>
        )
    }


}
