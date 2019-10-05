import React, { Component, Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route, Redirect, Switch
} from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { withCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import { API_DOMAIN } from './constant';

class App extends Component {
  constructor() {
    super()
    this.state = {
      authenticateLoading: true
    }
  }
  async componentDidMount() {
    const { cookies } = this.props;
    const authenticateRequest = await fetch(`${API_DOMAIN}/user/authenticate`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cookies.get('token')}`
      }
    });
    if (authenticateRequest.status === 401) {
      cookies.remove('token');
    }
    this.setState({
      authenticateLoading: false
    })
  }

  render() {
    const { cookies } = this.props;
    const { authenticateLoading } = this.state;
    const token = cookies.get('token');
    if (authenticateLoading) {
      return <Fragment>
        <Spinner animation="grow" variant="primary" />
        <Spinner animation="grow" variant="secondary" />
        <Spinner animation="grow" variant="success" />
      </Fragment>
    }
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
              cookies
            }
          } />)}></Route>
          <Route render={() => (<Redirect to='/dashboard' />)} />
        </Switch> :
          <Switch>
            <Route exact path='/login' render={() => (<Login {
              ...{
                cookies
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
