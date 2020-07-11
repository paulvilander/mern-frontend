import React,{ useEffect,useState, useMemo} from 'react';

import api from '../../services/api';
import moment from 'moment';
import socketio  from 'socket.io-client';

import { Button,  ButtonGroup, Col,Row, Alert, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import './dashboard.css'

//Dashboard  will show all events
export default function Dashboard({history}){
    const[events, setEvents] = useState([])
    const user = localStorage.getItem('user')
    const user_id = localStorage.getItem('user_id')
    const [rSelected, setRSelected] = useState(null)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [messageHandler, setMessageHandler] = useState('')
    const [eventsRequest, setEventsRequest] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [eventRequestMessage, setEventRequestMessage] = useState('')
    const [eventRequestSuccess, setEventRequestSuccess] = useState(false)

    const toggle = () => setDropdownOpen(!dropdownOpen);

    // eslint-disable-next-line
    useEffect(() =>{ getEvents() },[])

   const socket = useMemo(
        () =>
            socketio('http://localhost:8000',{ query: { user:user_id } }),
            [user_id]
            );

   useEffect(()=>{
        socket.on('registration_request', data => setEventsRequest([...eventsRequest, data ]));
   },[eventsRequest, socket])



    const filterHandler = (query) => {
        setRSelected(query)
        getEvents(query)
    }

    const myEventsHandler = async() => {
        try {
            setRSelected('myevents')
            const response = await api.get('/user/events', {headers : { user: user } })
            setEvents(response.data.events)
            
        } catch (error) {
            history.push('/login');
        }
    }

    const getEvents = async (filter) => {
        try {
            const url = filter ? `/dashboard/${filter}` : '/dashboard'
            const response = await api.get(url, {headers : { user: user } })
    
            setEvents(response.data.events)
            
        } catch (error) {
            history.push('/login');
        }

    }

    const deleteEventHandler = async (eventId) => {
        
        try {
             await api.delete(`/event/${eventId}`,{headers : { user: user } });
             setSuccess(true)
             setMessageHandler('The event was deleted successfully')
                setTimeout(() => {
                    setSuccess(false)
                    filterHandler(null)
                    setMessageHandler('')
                }, 3000)
        } catch (error) {
            setError(true)
            setMessageHandler('Error when deleting event!')
                setTimeout(() => {
                    setError(false)
                    setMessageHandler('')
                }, 2000)
        }
    }

    const registrationRequestHandler = async (event) => {
        try {
            await api.post(`/registration/${event.id}`,{},{headers:{ user }})
            setSuccess(true)
             setMessageHandler(`The request for the event ${event.title} was successfully!`)
                setTimeout(() => {
                    setSuccess(false)
                    filterHandler(null)
                    setMessageHandler('')
                }, 3000) 

        } catch (error) {
            setError(true)
            setMessageHandler(`The request for the event ${event.title} wasn't successfully!`)
                setTimeout(() => {
                    setError(false)
                    setMessageHandler('')
                }, 2000)
        }
    }

    const acceptEventHandler =  async (eventId) => {
        try {
            await api.post(`/registration/${eventId}/approvals`,{},{headers:{ user }})
            setEventRequestSuccess(true)
            setEventRequestMessage('Event approved successfully!')
            removeNotificationFromDashboard(eventId)
            setTimeout(() => {
                setEventRequestSuccess(false)
                setEventRequestMessage('')
            }, 2000)
            
        } catch (err) {
           console.log(err) 
        }
    }
    
    const rejectEventHandler = async (eventId) => {
        try {
            await api.post(`/registration/${eventId}/rejections`, {}, { headers: { user } })
            setEventRequestSuccess(true)
            setEventRequestMessage('Event rejected successfully!')
            removeNotificationFromDashboard(eventId)
            setTimeout(() => {
                setEventRequestSuccess(false)
                setEventRequestMessage('')
            }, 2000)

        } catch (err) {
            console.log(err)
        }
    }

    const removeNotificationFromDashboard = (eventId) => {
        const newEvents = eventsRequest.filter((event) => event._id !== eventId)
        setEventsRequest(newEvents)
    }
    

    return(
        <>
        <ul className="notifications">
            {eventsRequest.map(request => {
                return(
                <li key={request._id}>
                    <div>
                        <strong>{request.user.email}</strong> Is requesting to register to your Event 
                        <strong>  {request.event.title} </strong>
                    </div>
                        <ButtonGroup>
                            <Button color="success" size= "sm" onClick={ () => acceptEventHandler(request._id) }>Accept</Button>
                            <Button color="danger" size= "sm" onClick={ () => rejectEventHandler(request._id) }>Deny</Button>
                         </ButtonGroup>
                </li>
                )
            }
            )}
        </ul>
        {eventRequestSuccess ? <Alert color="success"> {eventRequestMessage}</Alert> : ""}
        <Row>
            <Col md={{ size: 6, offset: 3 }}>
                <div>
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle color="info" block caret>
                        Filter
                    </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={() => filterHandler(null)} active={rSelected === null}>All Sports</DropdownItem>
                    <DropdownItem divider/>
                    <DropdownItem onClick = {myEventsHandler} active={rSelected === 'myevents'}>My Events</DropdownItem>
                    <DropdownItem divider/>
                    <DropdownItem onClick={() => filterHandler('running')} active={rSelected === 'running'}>Running</DropdownItem>
                    <DropdownItem onClick={() => filterHandler('cycling')} active={rSelected === 'cycling'}>Cycling</DropdownItem>
                    <DropdownItem onClick={() => filterHandler('swimming')} active={rSelected === 'swimming'}>Swimming</DropdownItem>
                    <DropdownItem onClick={() => filterHandler('climbing')} active={rSelected === 'climbing'}>Climbing</DropdownItem>
                </DropdownMenu>
                </Dropdown>
                </div>
            </Col>
        </Row>
        <ul className="events-list">
            {events.map(event => (
                <li key={event._id}>
                    <header style={{ backgroundImage: `url(${event.thumbnail_url})` }}>
                    
                    </header>
                    <strong>{event.title}</strong>
                    <span>Event Date: {moment(event.date).format('L')}</span>
                    <span>Event Price: {parseFloat(event.price).toFixed(2)}</span>
                    <span>Event Description: {event.description}</span>
                   
                    <br/>
                    <ButtonGroup row = 'true'>
                        <Col xs='12' md='4'>
                        {event.user === user_id ? <Button color="danger" size="sm" onClick={()=> deleteEventHandler(event._id) } >Delete</Button> : ""}
                        </Col>
                    </ButtonGroup>
                    <br/>
                    <ButtonGroup>
                        <Button color="info" onClick={() => registrationRequestHandler(event)}>Registration Request</Button>
                    </ButtonGroup>
                    
                </li>
            ))}
            
        </ul>
        {error ? (
                <Alert className="event-validation" color="danger">{ messageHandler }</Alert>
            ): ""}
            {success ? (
                <Alert className="event-validation" color="success">{ messageHandler }</Alert>
            ): ""}
    </>
    )
}