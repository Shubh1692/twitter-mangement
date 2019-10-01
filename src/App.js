import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route, Redirect, Switch
} from 'react-router-dom';
import { withCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

class App extends Component {
  render() {
    const { cookies } = this.props;
    const token = cookies.get('token');
    return (
      <Router>
        {
          /**
              * React router Switch case for authenticated or not authenticated route
           */
        }
        {token ? <Switch>
          <Route exact path='/dashboard' render={() => (<Dashboard {
            ...{
              token,
              cookies: this.props.cookies
            }
          } />)}></Route>
          <Route render={() => (<Redirect to='/dashboard' />)} />
        </Switch> :
          <Switch>
            <Route exact path='/login' render={() => (<Login {
              ...{
                cookies: this.props.cookies
              }
            } />)}></Route>
            <Route render={() => (<Redirect to='/login' />)} />
          </Switch>
        }
      </Router>
    );
  }
}

export default withCookies(App);
