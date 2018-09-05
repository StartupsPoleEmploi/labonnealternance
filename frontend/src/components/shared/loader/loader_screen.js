import React, { PureComponent } from 'react';

export class LoaderScreen extends PureComponent {

    render() {
        return (
            <div id="loader-screen">
                <div className="loader-content">
                    <img className="lba-logo" src="/static/img/logo/logo-noir-lba.svg" alt="La Bonne Alternance" />
                    <div className="loader-logo"><img src="/static/img/loader.svg" alt="" /></div>
                    <div className="loader-text">
                        <p className="intro">N'attendez pas qu'une offre soit publiée !</p>
                        <p>Choisissez votre entreprise en Alternance !</p>
                    </div>
                </div>
            </div>
        );
    }
}
