import React, { useState, useEffect } from 'react';
import './Registration.css'
import './signup.css'
import { Layout} from 'antd';
import axios from "../API/axios.js";
import { Button, Modal, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import '../landing.css';

export default function RegistrationPage(props) {
    console.log(props);
    let history = useHistory();
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [vendors, setVendors] = useState([]);
    const [loginEmail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const handleShow = () => {
        setShow(true)
    };

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


    const onSignUp = () => {

        // required password format
        var reg = /^(?=.*[a-zA-Z])(?=.*\d)[\s\S]{8,}$/
        if (password != passwordConfirm) {
            alert("Password Inconsistent!");
        }
        else {
            if (reg.test(password)) {
                console.log("222");
                axios.post('/customer/register', { givenName: firstName, familyName: lastName, loginEmail: loginEmail, password: password }).then(response => {
                    console.log("111");
                    if (response.data.success) {
                        console.log("success");
                        console.log(response);
                        alert("Welcome! Thanks for joining us! You are all set");
                        props.history.push('/customer', {
                            customer: response.data.customer,
                            vendors: vendors,
                            position: [lat, lng]
                        }); 
                    }                        
                    else {
                        alert("Sign Up Fail: This email has already been registered! Please change another one")
                    }
                }).catch(error => {
                    console.log(error.response.data.message)
                    alert(error.response.data.message)
                })
            }
            else {
                alert("Password should have at least one alphabet character, one numerical digit with length no less than 8 characters")
            }
        }
    }


    return (
        <Modal show={handleShow} onHide ={handleClose}>
            <div className='signup--container'>
                <div className='popup registration-pop'>
                    <h2>CREATE AN ACCOUNT</h2>
                    <br />

                    <div className="flex--column">
                    <Modal.Body >
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <div className='cluster--signup'>
                                    <div className=' reg'>
                                    <Form.Label >First Name</Form.Label>
                                    <Form.Control className="nameinput" type="firstName" placeholder="Enter your first name"
                                        onChange={e => setFirstName(e.target.value)} />
                                    </div>
                                    <div className=' reg'>
                                    <Form.Label >Last Name</Form.Label>
                                    <Form.Control className="nameinput" type="lastName" placeholder="Enter your last name"
                                        onChange={e => setLastName(e.target.value)} />
                                    
                                    </div>
                                </div>
                                <Form.Label className="changelabelcolor">Email</Form.Label>
                                <Form.Control type="loginEmail" placeholder="Enter your email"
                                    onChange={e => setEmail(e.target.value)} />
                                
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label className="changelabelcolor">Password</Form.Label>
                                <Form.Control className='no-margin' type="password" placeholder="Enter your password"
                                    onChange={e => setPassword(e.target.value)} />
                                <Form.Text className="text-mutesreg">
                                Password should have at least one alphabet character, one numerical digit with length no less than 8 characters
                                </Form.Text>
                                <br /> <div className='confirm'></div>
                                <Form.Label className="changelabelcolor"> Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="ENter your password again"
                                    onChange={e => setPasswordConfirm(e.target.value)} />
                            </Form.Group>
                        </Form>

                        
                    </Modal.Body>
                    <Modal.Footer className='footer-container'>
                        <Button className='primary-btn' variant="outline-primary" onClick = {onSignUp}>
                            Sign Up Now
                        </Button>
                        <Button className='secondary-btn' variant="secondary" onClick={history.goBack}>
                            Close
                        </Button>
                    </Modal.Footer>

                    </div>
                    
                </div>
            </div>
        </Modal>
    )
}
