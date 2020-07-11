import React, { useState, useMemo, useEffect} from 'react';
import api from '../../services/api';
import { Button, Form, FormGroup, Input, Container, Alert, Col, Row, Label , ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import cameraIcon from '../../assets/camera.png';
import './events.css'
//EventsPage will show all events

export default function EventsPages({history}){
    const [title, setTitle ] = useState('')
    const [description, setDescription ]= useState('')
    const [price, setPrice ] = useState('')
    const [thumbnail, setThumbnails] = useState(null)
    const [sport, setSport ] = useState('Sport')
    const [date, setDate ] = useState('')
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [dropdownOpen, setOpen] = useState(false);
    const user = localStorage.getItem('user');

    // eslint-disable-next-line
    useEffect(()=>{ if(!user) history.push('/login') },[])

    const toggle = () => setOpen(!dropdownOpen);

    const preview = useMemo(()=>{
        return thumbnail ? URL.createObjectURL(thumbnail): null;
    },[thumbnail])

    const submitHandler = async (evt) =>{
        evt.preventDefault()

        const eventData = new FormData();


        eventData.append("thumbnail", thumbnail)
        eventData.append("sport", sport)
        eventData.append("title", title)
        eventData.append("price", price)
        eventData.append("description", description)
        eventData.append("date", date)


        try {
            if (title !== "" &&
                description !== "" &&
                price !== "" &&
                sport !== 'Sport' &&
                date !== "" &&
                thumbnail !== null
            ) {
                await api.post("/event", eventData, { headers: { user } })
                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                    history.push("/")
                }, 2000)
            } else {
                setError(true)
                setTimeout(() => {
                    setError(false)
                }, 2000)

                
            }
        } catch (error) {
            Promise.reject(error);
            console.log(error);
        }
    }

    const sportEventHandler = (sport) => setSport(sport);

    return (
        <Container>
            <Row>
            <Col sm="12" md={{ size: 10, offset: 1 }}>
                <h2>Create your Event</h2>
            </Col>
            </Row>
            <Form onSubmit={ submitHandler} >
            <FormGroup row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Label>Upload Image: </Label>
                <Label  id='thumbnail' className ={ thumbnail ? 'has-thumbnail' : ''} style={{ backgroundImage : `url(${preview})`}}>
                    <Input type="file" onChange={(evt) => setThumbnails(evt.target.files[0])}/>
                <img src={cameraIcon} style={{ maxWidth: "50px"}} alt="upload icon "/>
                </Label>
            </Col>
            </FormGroup>
            <FormGroup row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Label>Title : </Label>
                <Input id="title" type="text" value={ title } placeholder={ 'Event Title'} onChange={(evt)=> setTitle(evt.target.value)}/>
            </Col>
            </FormGroup>
            <FormGroup row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Label>Event Description : </Label>
                <Input id="description" type="text" value={ description } placeholder={' Event Description '} onChange={(evt)=> setDescription(evt.target.value)}/>
            </Col>
            </FormGroup>
            <FormGroup row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Label>Event price : </Label>
                <Input id="price" type="text" value={ price } placeholder={'Event Price €0.00'} onChange={(evt)=> setPrice(evt.target.value)}/>
            </Col>
            </FormGroup>
            <FormGroup row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Label>Event date: </Label>
                <Input id="date" type="date" value={ date }  onChange={(evt) => setDate(evt.target.value)} />
            </Col>
            </FormGroup>
            <FormGroup row>
            <Col sm="6" md={{ size: 3, offset: 3 }}>
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} direction="right">
                    <Button  id="caret" color="info"  value={ sport }  disabled >{sport}</Button>
                    <DropdownToggle caret color="info" />
                    <DropdownMenu >
                      <DropdownItem onClick={()=>sportEventHandler('running')}>running</DropdownItem>
                      <DropdownItem onClick={()=>sportEventHandler('cycling')}>cycling</DropdownItem>
                      <DropdownItem onClick={()=>sportEventHandler('swimming')}>swimming</DropdownItem>
                      <DropdownItem onClick={()=>sportEventHandler('climbing')}>climbing</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
            </Col>
                <Col sm="6" md={{ size:3 }} >
                    <Input id="sport" type="text" value={ sport } placeholder={ 'Sport Name'} onChange={(evt)=> setSport(evt.target.value)}/>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col sm="12" md={{ size: 4 ,offset:4}}>
                    <Button type="submit" color="info" block>Create Event</Button>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col sm="12" md={{ size: 4, offset:4}}>
                <Button  color="danger" block >Cancel</Button>
                </Col>
            </FormGroup>
           
            </Form>
            {error ? (
                <Alert className="event-validation" color="danger">Missing required information</Alert>
            ): ""}
            {success ? (
                <Alert className="event-validation" color="success">The event was create successfully</Alert>
            ): ""}
        </Container>
    )
}