import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export class Footer extends Component {

    render() {
        return (
            <footer id="global-footer" className={this.props.cssClass}>
                <ul className="list-unstyled inline-list">
                    {/* Missing : Facebook, Follow On Facebook, Twitter */}
                    <li><Link to="/acces-recruteur">Accès recruteur</Link></li>
                    <li><Link to="/qui-sommes-nous">Qui sommes-nous ?</Link></li>
                    <li className="small"><Link to="/faq">FAQ</Link></li>
                    <li className="small"><Link to="/conditions-generales-utilisation">CGU</Link></li>
                    <li className="small has-img">
                        <a href="https://europa.eu/european-union/index_fr" target="_blank" rel="noopener noreferrer" title="Ouverture dans une nouvelle fenêtre">
                            <img src="/static/img/logo/logo-ue.svg" alt="Visiter le site officiel de l'Union européenne" />
                        </a>
                    </li>
                </ul>
            </footer>
        )
    }

}