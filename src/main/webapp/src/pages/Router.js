import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import App from './App';
import DatePage from './DatePage';
import DateView from './DateView';
import history from '../components/history'

const BasicRouter = () => (
    <Router history={history}>
        <Switch>
            <Route exact path="/exrate/" component={App}/>
            <Route path="/exrate/date/:currency/:date" component={DatePage}/>
            <Route path="/exrate/dateview" component={DateView}/>
            <Route path="/exrate/*" component={App}/>

        </Switch>
    </Router>
);


export default BasicRouter;
