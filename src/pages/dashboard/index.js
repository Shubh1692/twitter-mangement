import React, { Component } from 'react';
import { API_DOMAIN } from '../../constant';
import { Accordion, Card, Navbar, Form, ListGroup, Button, Spinner } from 'react-bootstrap';

class Dashboard extends Component {
    constructor(props) {
        super()
        this.state = {
            user: {}, tweets: { "null": [] }, submitLoading: false, loadingData: true
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
            tweets, user, loadingData: false
        });
    }

    /**
     * @name onSubmit
     * @description
     * This method used to reply a tweet
    */
    async onSubmit(e, id) {
        e.preventDefault();
        const { cookies } = this.props;
        const { tweets } = this.state;
        const form = e.currentTarget;
        const replyTweet = form.elements.replyTweet.value;
        const body = JSON.stringify({
            replyTweet, id
        });
        await this.setState({ submitLoading: true });
        const replayToTweetRequest = await fetch(`${API_DOMAIN}/user/replayToTweet`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get('token')}`
            },
            body
        });
        const { replyTweet: replyTweetData } = await replayToTweetRequest.json();
        if (!tweets[id]) {
            tweets[id] = [];
        }
        tweets[id].push(replyTweetData);
        await this.setState({
            tweets,
            submitLoading: false
        });
        form.elements.replyTweet.value = '';
        alert('Reply successfully');
    }

    /**
     * @name onLogout
     * @description
     * This method used to logout
    */
    onLogout() {
        const { cookies } = this.props;
        cookies.remove('token');
    }

    render() {
        const { user = {}, tweets = { "null": [] }, submitLoading, loadingData } = this.state;
        return (
            <div className="d-flex h-100 flex-column">
                <Navbar bg="light" expand="lg" className="ml-2 mr-2">
                    <Navbar.Brand href="#home">{user.name}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Form inline>
                            <Button className="justify-content-end" variant="outline-success" onClick={() => this.onLogout()}>Logout</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
                {loadingData &&<div className="d-flex justify-content-center align-items-center w-100 h-100">
                    <Spinner animation="grow" variant="primary" />
                    <Spinner animation="grow" variant="secondary" />
                    <Spinner animation="grow" variant="success" />
                </div>}
               {tweets["null"] && tweets["null"][0] && tweets["null"][0].id_str && <Accordion defaultActiveKey={tweets["null"][0].id_str} className="p-2 w-100">
                    {tweets["null"].map(({ id_str, text }) => (
                        <Card key={id_str}>
                            <Accordion.Toggle as={Card.Header} eventKey={id_str} className="d-flex justify-content-between">
                                <div>
                                    <b>Tweet</b>: {text}
                                </div>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={id_str}>
                                <Card.Body>
                                    <ListGroup as="ul">
                                        {tweets && tweets[id_str] && tweets[id_str].map(({ text, id_str }) => (
                                            <ListGroup.Item key={id_str} as="li">{text}</ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                    <Form onSubmit={(event) => this.onSubmit(event, id_str)}>
                                        <Form.Group controlId='replyTweet'>
                                            <Form.Label>Replay To Tweet</Form.Label>
                                            <Form.Control as="textarea" rows="3" />
                                        </Form.Group>
                                        {!submitLoading ? <Button variant="primary" type="submit">
                                            Submit
                                        </Button> :
                                            <div>
                                                <Spinner animation="grow" variant="primary" />
                                                <Spinner animation="grow" variant="secondary" />
                                                <Spinner animation="grow" variant="success" />
                                            </div>}
                                    </Form>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    ))}
                </Accordion>}
            </div>
        );
    }
}

export default Dashboard;
