import React, { Component } from 'react';
import { API_DOMAIN } from '../../constant';


class Dashboard extends Component {
    constructor(props) {
        super()
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
    const getTweetsResponse =  await getTweetsRequest.json();
    console.log('getTweetsResponse', getTweetsResponse);
}
    render() {
        return (
            <div className="d-flex align-items-center justify-content-center h-100">
               Dashboard
            </div>
        );
    }
}

export default Dashboard;
