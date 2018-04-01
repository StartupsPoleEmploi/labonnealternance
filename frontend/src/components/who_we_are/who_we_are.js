import React, { Component } from 'react';
import { Footer } from '../shared/footer/footer';
import { Header } from '../companies/blocks/header/header';

export default class FAQ extends Component {
    render() {
        return (
            <div id="who-we-are" className="max-size-1000">
                <Header showOffset={false} />

                <main>
                    Une équipe motivée :)
                </main>

                <Footer />
            </div>
        );
    }
}