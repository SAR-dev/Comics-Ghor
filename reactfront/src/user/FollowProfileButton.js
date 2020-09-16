import React, { Component } from 'react';
import { follow, unfollow } from './apiUser';

class FollowProfileButton extends Component {
    
    followClick = () => {
        this.props.onButtonClick(follow)
    }

    unfollowClick = () => {
        this.props.onButtonClick(unfollow)
    }
    render() {
        return (
            <div className="my-4">
                {
                    !this.props.following ? (
                        <button onClick={this.followClick} className="absolute bottom-0 right-0 bg-white text-gray-700 rounded-full border-2 border-gray-600 px-4 py-1 text-sm font-semibold -mb-12 mr-4">Follow</button>
                    ) : (
                        <button onClick={this.unfollowClick} className="absolute bottom-0 right-0 bg-gray-800 text-cream rounded-full border-2 border-gray-700 px-4 py-1 text-sm font-semibold -mb-12 mr-4">Following</button>
                    )
                }
            </div>
        )
    }
}

export default FollowProfileButton;