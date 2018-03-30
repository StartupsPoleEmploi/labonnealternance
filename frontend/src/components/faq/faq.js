import React, { Component } from 'react';
import { Footer } from '../shared/footer/footer';
import { Header } from '../companies/blocks/header/header';

export default class FAQ extends Component {
    render() {
        return (
            <div id="faq" className="max-size-1000">
                <Header showOffset={false} />

                <main>
                    Welcome to the FAQ :)
                </main>

                <Footer />
            </div>
        );
    }
}