import React, { Component } from 'react';
import { Link } from 'react-router-dom';

require('./cookie_bar.css');

const COOKIE_BAR = 'COOKIE_BAR'

export class CookieBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false
        }
    }

    componentWillMount() {
        this.setState({
            show: localStorage.getItem(COOKIE_BAR) === null
        });
    }

    closeBanner = (event) => {
        event.preventDefault();

        localStorage.setItem(COOKIE_BAR, 'false');
        this.setState({ show: false });
    }

    render() {
        if(!this.state.show) return null;

        return(
            <div className="cookie-banner">
                <p>Les cookies assurent le bon fonctionnement de nos services. En utilisant ces derniers, vous acceptez l'utilisation des cookies.</p>
                <p><Link to="/conditions-generales-utilisation">En savoir plus</Link> - <button onClick={this.closeBanner}><b>J'ai compris</b></button>
                </p>
            </div>
        );
    }
}