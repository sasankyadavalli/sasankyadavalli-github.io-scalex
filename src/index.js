import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login/login';
import "./Login/login.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// import {Route, Router, BrowserRouter} from 'react-router';
// import routes from './routes';
// import {Provider} from 'react-redux';
// import { createStore } from 'redux'; 
// import TodoReducers from './reducers';

import Order from './Order/order';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// let store = createStore(TodoReducers); 

const app = document.getElementById("root");

const App = () => (
  <div>
    <Main />
  </div>
);

const Main = () => (
    <Switch>
      <Route exact path='/' component={Login}/>
      <Route path='/orders' component={OrdersRoute}/>
    </Switch>
);

const OrdersRoute = () => (	
	<Switch>
    	<Route exact path='/orders' component={Order}/>
  	</Switch>
);

ReactDOM.render( 
	<Router>
	<App />
	</Router>, app
);