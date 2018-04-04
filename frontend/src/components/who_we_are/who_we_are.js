import React, { Component } from 'react';

import { Footer } from '../shared/footer/footer';
import { OtherStartups } from '../shared/other_startups/other_startups';

import { Header } from '../companies/blocks/header/header';
import { SEOService } from '../../services/seo.service';

require('./who_we_are.css');

export default class FAQ extends Component {

    constructor(props) {
        super(props);
        this.SEOService = new SEOService();
    }

    componentDidMount() {
        this.SEOService.setTitle("Qui sommes-nous ?");
    }

    render() {
        return (
            <div id="who-we-are" className="max-size-1000">
                <Header showOffset={false} />

                <main>
                    <div>
                        <h1>Qui sommes-nous ?</h1>
                    </div>
                    <OtherStartups />
                </main>

                <Footer />
            </div>
        );
    }
}