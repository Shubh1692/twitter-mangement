import React, { Component } from 'react';
import { API_DOMAIN } from '../../constant';
import { Accordion, Card, Navbar, Form, Badge, Button } from 'react-bootstrap';

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


    async onSubmit(e, id) {
        e.preventDefault();
        const { cookies } = this.props;
        const form = e.currentTarget;
        const replyTweet = form.elements.replyTweet.value;
        const body = JSON.stringify({
            replyTweet, id
        });
        const getTweetsRequest = await fetch(`${API_DOMAIN}/user/replayToTweet`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get('token')}`
            },
            body
        });
        await getTweetsRequest.json();
        alert('Reply successfully');
    }
    render() {
        const { user = {}, tweets = [] } = this.state;
        return (
            <div className="d-flex h-100 flex-column">
                <Navbar bg="light" expand="lg" className="ml-2 mr-2">
                    <Navbar.Brand href="#home">{user.name}</Navbar.Brand>
                </Navbar>
                <Accordion defaultActiveKey="0" className="p-2 w-100">
                    {tweets.map(({ id_str, text, retweet_count }) => (
                        <Card key={id_str}>
                            <Accordion.Toggle as={Card.Header} eventKey={id_str} className="d-flex justify-content-between">
                                <div>
                                    <b>Tweet</b>: {text}
                                </div>
                                <div>
                                    <Badge variant="secondary">{`Retweets ${retweet_count}`}</Badge>
                                </div>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={id_str}>
                                <Card.Body>
                                    <Form onSubmit={(event) => this.onSubmit(event, id_str)}>
                                        <Form.Group controlId='replyTweet'>
                                            <Form.Label>Replay To Tweet</Form.Label>
                                            <Form.Control as="textarea" rows="3" />
                                        </Form.Group>
                                        <Button variant="primary" type="submit">
                                            Submit
                                        </Button>
                                    </Form>

                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    ))}
                </Accordion>
            </div>
        );
    }
}

export default Dashboard;
