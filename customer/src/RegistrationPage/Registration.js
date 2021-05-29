import React, { useState, useEffect } from 'react';
import './Registration.css'
import { Layout, message } from 'antd';
import { CopyrightOutlined } from '@ant-design/icons';
import axios from "../API/axios.js";
import MyFooter from '../components/Footer.js';
import{Jumbotron, Button, Modal, Form} from 'react-bootstrap';

const { Header, Footer, Content } = Layout;

export default function RegistrationPage(props) {
    console.log(props);
    const [loginEmail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
            setLat(position.coords.latitude)
            setLng(position.coords.longitude)
        });
        axios.get('/vendor?lat=' + lat + '&lng=' + lng).then(response => {
            console.log(response)
            setVendors(response.data.vendors)
        })
    }, [lat, lng])

    const toLogin = () => {
        props.history.push("../");
    }

    const onSignUp2 = () =>{
        axios.post('/customer/register', {givenName: firstName, familyName: lastName, loginEmail: loginEmail, password: password}).then(response => {
            console.log("111");
            if (response.data.success) {
                console.log(response);
                alert("Welcome! Thanks for joining us! You are all set");
                console.log('success')
                // push the customer information
                props.history.push('/customer', {
                    customer: response.data.customer,
                    vendors: vendors,
                    position: [lat, lng]
                }); 
                // props.history.push('../');
            }
            else {
                alert("This email has been registered! Please change another one")
            }
        }).catch(error => {
            console.log(error.response.data.message)
            alert(error.response.data.message)
        })
    }
    const onSignUp = () => {

        // required password format
        var reg = /^(?=.*[a-zA-Z])(?=.*\d)[\s\S]{8,}$/
        if (password != passwordConfirm) {
            message.error("Password Inconsistent!");
        }
        else {
            if(reg.test(password)){
                console.log("222");
                axios.post('/customer/register', {givenName: firstName, familyName: lastName, loginEmail: loginEmail, password: password}).then(response => {
                    console.log("111");
                    if (response.data.success) {
                        console.log("success");
                        console.log(response);
                        message.success("Welcome! Thanks for joining us! You are all set");
                        // console.log('success')
                        // // push the customer information
                        // props.history.push('/customer', {
                        //     customer: response.data.customer,
                        //     vendors: vendors,
                        //     position: [lat, lng]
                        // }); 
                        props.history.push('../');
                    }
                    else {
                        message.error("This email has been registered! Please change another one")
                    }
                }).catch(error => {
                    console.log(error.response.data.message)
                    alert(error.response.data.message)
                })
            }
            else{
                message.error("Password should have at least one alphabet character, one numerical digit with length no less than 8 characters")
            }
        }
    }
    return (
        <Layout id="signupContainer">
            {/* <div className="header--nofunction">

            </div> */}

            <div className="container--signup">

            <div className="subcontainer--signup">
       
                <h1>CREATE AN ACCOUNT</h1>
                <br />
                <div className="signupContainer">
                    <form >

                        <div className="cluster--signup">

                        <div>
                            <label for="firstName" className="label">First Name</label><br></br>
                            <input id="firstName" type="firstName" placeholder="First Name" className="nameinput" onChange={e => setFirstName(e.target.value)} />

                        </div>

                        <div>
                            <label for="lastName" className="label">Last Name</label><br></br>
                            <input id="lastName" type="lastName" placeholder="Last Name" className="nameinput" onChange={e => setLastName(e.target.value)} />

                        </div>



                        </div>


                        
                        

                        
                        
                        <label for="loginEmail" className="label">Email</label>
                        <input id="loginEmail" type="loginEmail" className="nameinput" placeholder="Email Address" onChange={e => setEmail(e.target.value)} />
                        
                        <label for="password" className="label">Password</label>
                        <input id="password" type="password" className="nameinput" placeholder="Set a password for your account." onChange={e => setPassword(e.target.value)} />
                       
                        <label for="confiemPassword" className="label">Confirm Password</label>
                        <input id="confirmPassword" type="password" className="nameinput" placeholder="Input your password again" onChange={e => setPasswordConfirm(e.target.value)} />
                     

                        <div className="container--signupbtn">
                            <input type="submit" value="SIGN UP NOW >>" className="btnSignup" onClick={onSignUp} />
                            
                        </div>

                        <div className="container--cancelbtn">
                            <input type="button" value="<< CANCEL" className="btnCancel" onClick={toLogin} />
                            
                        </div>

                        

                        
                        

                    </form>
                
                    

                </div>

            </div>





            </div>

            

            {/* <MyFooter></MyFooter> */}


        </Layout>
    )
}
