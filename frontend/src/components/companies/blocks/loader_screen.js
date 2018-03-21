import React, { Component } from 'react';

export class LoaderScreen extends Component {

    render() {
        return (
            <div id="loader-screen">
                <div className="loader-content">
                    <img className="lba-logo" src="/static/img/logo/logo-bleu-lba.svg" alt="La Bonne Alternance" />
                    <div className="loader-logo"><img src="/static/img/loader.svg" alt="" /></div>
                    <div className="loader-text">
                        <p className="intro">7 entreprises sur 10 recrutent sans déposer d'offre !</p>
                        <p>Tentez votre chance !</p>
                    </div>
                </div>
            </div>
        );
    }
}