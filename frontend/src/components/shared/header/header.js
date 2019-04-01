import React, { Component } from 'react';
import { Link } from '@reach/router';

class Header extends Component {
    render() {
        return (
            <header>
                <Link className="logo-lba" to="/">
                    <img src="/static/img/logo/logo-blanc-lba.svg" alt="Retour à l'accueil" title="Retour à l'accueil" />
                </Link>
            </header>
        );
    }
}

export default Header;