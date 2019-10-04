import React, { Component } from 'react';
import { API_DOMAIN } from '../../constant';
import { Button, Form, } from 'react-bootstrap';

class Login extends Component {
    constructor(props) {
        super()
        this.state = {
            loginResponse: null
        }
    }

    /**
     * @name login
     * @description
     * This method used to open twitter login popup window
    */

    async login() {
        await this.setState({
            loginResponse: null
        });
        const loginRequest = await fetch(`${API_DOMAIN}/user/request_token`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        });
        const loginResponse = await loginRequest.json();
        this.setState({
            loginResponse
        });
        window.open(`https://api.twitter.com/oauth/authenticate?oauth_token=${loginResponse.oauth_token}`, '_blank');
    }

    /**
     * @name onSubmit
     * @description
     * This method used to submit pin
    */

    async onSubmit(e) {
        e.preventDefault();
        const { cookies } = this.props;
        const form = e.currentTarget;
        const pin = form.elements.pin.value;
        const { loginResponse } = this.state;
        const body = JSON.stringify({
            oauth_verifier: pin,
            oauth_token: loginResponse.oauth_token
        })
        const authRequest = await fetch(`${API_DOMAIN}/user/access_token`, {
            method: 'POST',
            body,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(authRequest.status === 200) {
            const {token} =  await authRequest.json();
            cookies.set('token', token, { path: '/' });
        } else {
            alert('Error in submit pin');
        }
    }

    render() {
        const { loginResponse } = this.state;
        return (
            <div className='d-flex align-items-center justify-content-center h-100'>
                {!loginResponse && <Button color='primary' size='lg' onClick={() => this.login()}>Sign In with Twitter</Button>}
                {loginResponse && <Form onSubmit={(event) => this.onSubmit(event)}>
                    <Form.Group controlId='pin'>
                        <Form.Label>Pin</Form.Label>
                        <Form.Control autoFocus type='text' placeholder='Enter pin' required />
                    </Form.Group>
                    <div className='d-flex align-item-center justify-content-between'>
                        <Button type='submit'>Submit</Button>
                        <Button color='primary' onClick={() => this.login()}>
                            Re Login
                    </Button>
                    </div>

                </Form>}
            </div>
        );
    }
}

export default Login;
