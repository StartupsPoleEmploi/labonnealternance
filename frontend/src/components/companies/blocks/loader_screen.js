import React, { Component } from 'react';

export class LoaderScreen extends Component {

    renderIntroduction() {
        if (!this.props.show) return null;
        return (
            <div>
                Nous recherchons&nbsp;
                <strong>toutes les entreprises qui recrutent régulièrement&nbsp;
                { this.props.jobName ? 'dans le secteur ' + this.props.jobName:'' },&nbsp;
                { this.props.cityName ? 'à ' + this.props.cityName:'' }
                </strong>
            </div>
        );
    }
    render() {
        return (
            <div id="loader-screen">
                <div className="loader-content">
                    <div className="loader-logo"><img src="/static/img/loader.svg" alt="" /></div>
                    <div className="loader-text">
                        <img src="/static/img/logo/logo-bleu-lba.svg" alt="La Bonne Alternance" />
                        recherche parmi 110 000 entreprises qui recrutent régulièrement en alternance.
                    </div>
                </div>
            </div>
        );
    }
}