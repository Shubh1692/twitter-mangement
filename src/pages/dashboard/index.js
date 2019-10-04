import React, { Component } from 'react';
import { API_DOMAIN } from '../../constant';
import { Accordion, Card, Navbar, Form, Badge } from 'react-bootstrap';

class Dashboard extends Component {
    constructor(props) {
        super()
        this.state = {
            user: {}, tweets: []
        }
    }
    async componentDidMount() {
        await this.getTweets();
    }
    /**
     * @name getTweets
     * @description
     * This method used to get tweets
    */

    async getTweets() {
        const { cookies } = this.props;
        const getTweetsRequest = await fetch(`${API_DOMAIN}/user/getTweets`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get('token')}`
            }
        });
        const { tweets = [], user = {} } = await getTweetsRequest.json();
        await this.setState({
            tweets, user
        });
    }
    render() {
        const { user = {}, tweets = [] } = this.state;
        return (
            <div className="d-flex h-100 flex-column">
                <Navbar bg="light" expand="lg" className="ml-2 mr-2">
                    <Navbar.Brand href="#home">{user.name}</Navbar.Brand>
                </Navbar>
                <Accordion defaultActiveKey="0" className="p-2 w-100">
                    {tweets.map(({ id, text, retweet_count }) => (
                        <Card key={id}>
                            <Accordion.Toggle as={Card.Header} eventKey={id} className="d-flex justify-content-between">
                                <div>
                                    <b>Tweet</b>: {text}
                                </div>
                                <div>
                                    <Badge variant="secondary">{`Retweets ${retweet_count}`}</Badge>
                                </div>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={id}>
                                <Card.Body>Hello! I'm the body</Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    ))}
                </Accordion>
            </div>
        );
    }
}

export default Dashboard;
