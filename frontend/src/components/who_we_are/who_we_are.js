import React, { Component } from 'react';
import { Footer } from '../shared/footer/footer';
import { Header } from '../companies/blocks/header/header';
import { SEOService } from '../../services/seo.service';

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
                    Une équipe motivée :)
                </main>

                <Footer />
            </div>
        );
    }
}