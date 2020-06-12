import React, { Component } from 'react';

import { Footer } from '../shared/footer/footer';
import { OtherStartups } from '../shared/other_startups/other_startups';

import Header from '../companies/blocks/header/header';
import { SEOService } from '../../services/seo.service';
import { RGPDBar } from '../shared/rgpd_bar/rgpd_bar';

require('./who_we_are.css');

export default class FAQ extends Component {

    componentDidMount() {
        SEOService.setTitle('Qui sommes-nous ?');
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

                <RGPDBar />
                <Footer />
            </div>
        );
    }
}