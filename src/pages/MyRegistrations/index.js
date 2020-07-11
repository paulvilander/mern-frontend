import React, { useState, useEffect } from 'react';
import moment from 'moment';
import api from '../../services/api';
import { Button,  ButtonGroup, Row, Col } from 'reactstrap';
import './style.css';


export default function MyRegistrations(){
    const[myEvents, setMyEvents] = useState([]);
    const user = localStorage.getItem('user')

    // eslint-disable-next-line
    useEffect(()=>{ getMyEvents() },[])

    const getMyEvents = async () =>{
        try {
            const response = await api.get('/registration',{ headers:{user} } )
            console.log(response.data)
            setMyEvents(response.data)
        } catch (error) {
            
        }
    }

    const isApproved = ( approved ) => approved === true ? "Approved" : "Rejected"

    const acceptEventHandler = async (eventId) => {
        try {
            await api.post(`/registration/${eventId}/approvals`, {}, { headers: { user } })
            getMyEvents()

        } catch (err) {
            console.log(err)
        }
    }

    const rejectEventHandler = async (eventId) => {
        try {
            await api.post(`/registration/${eventId}/rejections`, {}, { headers: { user } })
            getMyEvents()

        } catch (err) {
            console.log(err)
        }
    }
 
    return (
        <ul className = "events">
            {myEvents.map(event =>(
                <li key = {event._id}>
                    <div><strong>{event.eventTitle}</strong></div>
                    <Row className = "events-details" row = "true">
                        <Col lg="3" md="6" xs="12">Event Date: {moment(event.eventDate).format('l')}</Col>
                        <Col lg="3" md="6" xs="12">Event Price: {parseFloat(event.eventPrice).toFixed(2)} €</Col>
                        <Col lg="4" md="6" xs="12">User email: {event.userEmail}</Col>
                        <Col lg="2" md="6" xs="12">Status:
                            <span className = {event.approved !== undefined ? isApproved(event.approved) : "Pending" }>{event.approved !== undefined ? isApproved(event.approved) : "Pending" }</span>
                        </Col>

                    </Row>
                    <br/>
                    <ButtonGroup>
                        <Button disabled={event.approved === true || event.approved === false ? true : false}  color="success" size= "sm" onClick={ () => acceptEventHandler(event._id) }>Accept</Button>
                        <Button disabled={event.approved === true || event.approved === false ? true : false} color="danger" size= "sm" onClick={ () => rejectEventHandler(event._id) }>Deny</Button>
                    </ButtonGroup>
                </li>
            ))}

        </ul>
    )
}