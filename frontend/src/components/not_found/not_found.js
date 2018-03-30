import React, { Component } from 'react';
import { Header } from '../companies/blocks/header/header';
import { Footer } from '../shared/footer/footer';

export default class NotFound extends Component {
    render() {
        return (
            <div id="not-found"  className="max-size-1000">
                <Header showOffset={false} />

                <main><h1>404 Not Found</h1></main>

                <Footer />
            </div>
        );
    }
}