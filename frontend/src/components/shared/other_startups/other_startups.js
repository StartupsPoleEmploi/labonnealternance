import React, { Component } from 'react';

import './other_startups.css';

export class OtherStartups extends Component {
    render() {
        return (
            <div id="other-startups" className="clearfix">
                <h2>D'autres services digitaux proposés par Pôle Emploi</h2>

                <div>
                    <a href="https://labonneboite.pole-emploi.fr" target="_blank" rel="noopener noreferrer" className="la-bonne-boite">
                        <img src="/static/s.png" className="lazyload" data-src="/static/img/startups/la_bonne_boite.jpg" alt="La Bonne Boite"/>
                        <span>Trouvez les entreprises qui embauchent sans déposer d’offres d’emploi !</span>
                    </a>
                    <a href="https://labonneformation.pole-emploi.fr" target="_blank" rel="noopener noreferrer" className="la-bonne-formation">
                        <img src="/static/s.png" className="lazyload" data-src="/static/img/startups/la_bonne_formation.jpg" alt="La Bonne Formation"/>
                        <span>Trouvez une formation en fonction de votre profil ET du marché du travail.</span>
                    </a>
                    <a href="https://maintenant.pole-emploi.fr/" target="_blank" rel="noopener noreferrer" className="maintenant">
                        <img src="/static/s.png" className="lazyload" data-src="/static/img/startups/maintenant.png" alt="Maintenant"/>
                        <span>Maintenant ! Trouver le bon job en moins de 5mn <strong>Pas de CV.</strong></span>
                    </a>
                    <a href="https://memo.pole-emploi.fr/" target="_blank" rel="noopener noreferrer" className="memo">
                        <img src="/static/s.png" className="lazyload" data-src="/static/img/startups/memo.png" alt="Memo"/>
                        <span>Mes candidatures en un clin d'oeil</span>
                    </a>
                    <a href="https://avril.pole-emploi.fr/" target="_blank" rel="noopener noreferrer" className="avril">
                        <img src="/static/s.png" className="lazyload" data-src="/static/img/startups/avril.svg" alt="Avril"/>
                        <span>La VAE facile. Transformez votre expérience en diplôme reconnu.</span>
                    </a>
                    <a href="https://clara.pole-emploi.fr/" target="_blank" rel="noopener noreferrer" className="clara">
                        <img src="/static/s.png" className="lazyload" data-src="/static/img/startups/clara.svg" alt="Clara"/>
                        <span>Vos aides en un clic. Découvrez les aides et mesures qui vont accélérer votre reprise d'emploi.</span>
                    </a>
                </div>
            </div>
        )
    }
}
