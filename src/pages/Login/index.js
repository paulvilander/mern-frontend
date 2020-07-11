import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { Button, Form, FormGroup, Input, Container, Alert,Col, Row } from 'reactstrap';
import { UserContext } from '../../user-context';

export default function Login({ history }) {
    const { setIsLoggedIn } = useContext(UserContext); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("false");

    const handleSubmit = async evt => {
        evt.preventDefault();
        console.log('Result of the submit',email,password)

        const response = await api.post('/login',{ email, password })
        const user_id = response.data.user_id || false;
        const user = response.data.user || false;
        try {
            if(user && user_id){
                localStorage.setItem('user', user)
                localStorage.setItem('user_id', user_id)
                setIsLoggedIn(true) 

                history.push('/')
            }else{
                const { message } = response.data
                setError(true)
                setErrorMessage(message)
                setTimeout(()=>{
                    setError(false)
                    setErrorMessage("")
                }, 2000) 
            }  
        } catch (error) {
            setError(true)
            setErrorMessage("Error, the server returned an error")
        }

    }
    return (
        <Container>
            <Row>
            <Col sm='12' md={{ size: 4, offset: 4 }}>
            <h2>Login:</h2>
            </Col>
            <Col sm='12' md={{ size: 4, offset: 4 }}>
            <p>Please <strong>Login </strong> into your account </p>
            </Col>
            </Row>
            <Form onSubmit={handleSubmit}>
                <FormGroup row>
                    <Col sm="12" md={{ size: 4, offset: 4 }}>
                    <Input type="email" name="email" id="Email" placeholder="Your email" onChange={ evt => setEmail(evt.target.value)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col sm="12" md={{ size: 4, offset: 4 }}>
                    <Input type="password" name="password" id="examplePassword" placeholder="Your password" onChange={ evt => setPassword(evt.target.value)}/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col sm="12" md={{ size: 4, offset: 4 }}>
                         <Button  color="danger"  block >Submit</Button>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col sm="12" md={{ size: 4, offset: 4 }}>
                         <Button  color="primary"  block onClick={()=> history.push("/register")}>New Account</Button>
                    </Col>
                </FormGroup>
               
            </Form>
            {error ? (
                <Alert className="event-validation" color="danger">{errorMessage}</Alert>
            ): ""}
        </Container>
    );
}
