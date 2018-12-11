import React, { Component } from 'react';
import Modal from '../../shared/modal';

const LA_POSTE_ROMES = ['M1603','N4105']

export class PromoteLaPoste extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            showModal: false
        }
    }

    componentDidMount() {
        const romes = this.props.jobs.map(job => job.rome);

        // At least, one rome is in LA_POSTE_ROMES
        if(romes.some(rome => LA_POSTE_ROMES.includes(rome))) this.setState({ show: true });
    }

    showLaPosteModal = () => this.setState({ showModal: true });
    closeLaPosteModal = () => this.setState({ showModal: false });


    renderLaPosteModal() {
        return (
            <Modal id="modal-la-poste" title="La Poste recrute" onClose={this.closeLaPosteModal}>
                <div className="title">
                    <h1>La Poste recrute !</h1>
                </div>
                <div className="modal-body">
                    <div>
                        <div className="text-center logo"><img className="logo" src="/static/img/la_poste/la_poste_recrute.png" alt="" /></div>

                        La Poste recrute 100 alternants en 2019 sur toute la France en formation CAP Opérateur de service relation clientèle et livraison. Pour en savoir plus, rendez-vous sur :
                        <div className="text-center button-container">
                            <a className="button" href="https://www.laposterecrute.fr/recherche-offres">https://www.laposterecrute.fr/</a>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
    render() {
        if(!this.state.show) return null;

        return (
            <>
                <div id="promote-la-poste">
                    <button className="reset show-modal" onClick={this.showLaPosteModal}>
                        <img className="logo" src="/static/img/la_poste/logo_la_poste.png" alt="" />
                        <div>
                            La Poste recrute !
                            <span className="text">La Poste recrute 100 alternants en 2019 sur toute la France !</span>
                            <span className="more">En savoir plus</span>
                        </div>
                    </button>
                </div>
                { this.state.showModal ? this.renderLaPosteModal() : null }
            </>
        );
    }
}