import React, { Component } from 'react';
import { Footer } from '../shared/footer/footer';
import { Header } from '../companies/blocks/header/header';

export default class CGU extends Component {
    render() {
        return (
            <div id="who-we-are" className="max-size-1000">
                <Header showOffset={false} />

                <main>
                    <a href="https://adresse.data.gouv.fr/" target="_blank" title="Ouverture dans une nouvelle fenêtre">https://adresse.data.gouv.fr/</a>
                </main>

                <Footer />
            </div>
        );
    }
}