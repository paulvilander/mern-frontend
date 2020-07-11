import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { UserContext } from '../../user-context';
import { Button, Form, FormGroup, Input, Container ,Alert, Row, Col} from 'reactstrap';

export default function Register({ history }) {
    const { setIsLoggedIn } = useContext(UserContext); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async evt => {
        evt.preventDefault();
        if( email !== "" && password !== "" && firstName !== "" && lastName !== ""){
           const response = await api.post('/user/register',{ email, password, firstName, lastName })
           const user = response.data.user || false;
           const user_id = response.data.user_id || false;

        if(user && user_id){
            localStorage.setItem('user', user)
            localStorage.setItem('user_id', user_id)
            setIsLoggedIn(true)
            history.push('/')
        }else{
            const { message } = response.data
            setError(true)
                setErrorMessage(message)
                setTimeout(() => {
                    setError(false)
                    setErrorMessage("")
                }, 2000) 
            }  
        } else {
            setError(true)
            setErrorMessage("You need to fill the inputs")
            setTimeout(() =>{
                setError(false)
                setErrorMessage("")
            },2000)
        }
        
    }
    return (
        <Container>
            <Row>
            <Col sm='12' md={{ size: 4, offset: 4 }}>
            <h2>Register:</h2>
            </Col>
            <Col sm='12' md={{ size: 8, offset: 2 }}>
            <p>Please <strong>Register </strong> for a new account </p>
            </Col>
            </Row>
            <Form onSubmit={handleSubmit}>
                <FormGroup row>
                <Col sm="12" md={{ size: 8, offset: 2 }}>
                    <Input type="text" name="firstName" id="firstName" placeholder="Your firstName" onChange={ evt => setFirstName(evt.target.value)} />
                </Col>
                </FormGroup>
                <FormGroup row>
                <Col sm="12" md={{ size: 8, offset: 2 }}>
                    <Input type="text" name="lastName" id="lastName" placeholder="Your lastName" onChange={ evt => setLastName(evt.target.value)}/>
                </Col>
                </FormGroup>
                <FormGroup row>
                <Col sm="12" md={{ size: 8, offset: 2 }}>
                    <Input type="email" name="email" id="Email" placeholder="Your email" onChange={ evt => setEmail(evt.target.value)} />
                </Col>
                </FormGroup>
                <FormGroup row>
                <Col sm="12" md={{ size: 8, offset: 2 }}>
                    <Input type="password" name="password" id="Password" placeholder="Your password" onChange={ evt => setPassword(evt.target.value)} />
                </Col>
                </FormGroup>
                <FormGroup row>
                <Col sm="12" md={{ size: 8, offset: 2 }}>
                        <Button  color="danger" block >  Submit  </Button>
                    </Col>
                </FormGroup>
                <FormGroup row>
                <Col sm="12" md={{ size: 8, offset: 2 }}>
                        <Button  color="secondary" block onClick={() => history.push('/login')}>Login instead?</Button>
                    </Col>
                </FormGroup>
            </Form>
            {error ? (
                <Alert className="event-validation" color="danger">{errorMessage}</Alert>
            ): ""}
        </Container>
    );
}