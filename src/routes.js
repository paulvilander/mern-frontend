import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/Login/';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard/';
import MyRegistartions from './pages/MyRegistrations';
import EventsPage from './pages/EventsPage';
import TopNav from './components/Top-Nav';

export default function Routes() {
    return (
        <BrowserRouter>
            <TopNav/>
            <Switch>
                <Route path="/" exact component = { Dashboard } />
                <Route path="/myregistrations" exact component = { MyRegistartions } />
                <Route path="/login" exact component = { Login } />
                <Route path="/register" exact component = { Register }/>
                <Route path="/events" component = { EventsPage} />
            </Switch>
        </BrowserRouter>
    );
}
