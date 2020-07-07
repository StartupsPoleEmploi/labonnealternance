import React, { Component } from 'react';

import './lazyload-youtube.css';

export default class LazyLoadYoutube extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showVideo: false
        }
    }

    showVideo = (e) => {
        e.preventDefault();
        this.setState({ showVideo: true });
    }

    render() {
        if (this.state.showVideo) {
            return (
                <div className="youtube-video">
                    <iframe
                        sandbox="allow-scripts allow-same-origin allow-presentation"
                        title={this.props.iframeTitle}
                        src={this.props.youtubeUrl + '?autoplay=1'}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen>
                    </iframe>
                </div>
            )
        }

        return (
            <div className="youtube-video">
                <button className="reset" title={ 'Visualiser : ' + this.props.iframeTitle} onClick={this.showVideo}>
                    <img className="background" src={this.props.backgroundImage} alt={this.props.iframeTitle} />
                    <div className="youtube-icon"><img className="youtube-icon" src="/static/img/youtube/icon.svg" alt="" /></div>
                </button>
            </div>
            )
        }
}
