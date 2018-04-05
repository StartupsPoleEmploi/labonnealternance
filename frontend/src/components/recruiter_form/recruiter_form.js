import React, { Component } from 'react';
import { Footer } from '../shared/footer/footer';
import { Header } from '../companies/blocks/header/header';

import { NotificationService } from '../../services/notification/notification.service';
import { Notification } from '../shared/notification/notification';
import { isEmail, isSiret, getParameterByName } from '../../services/helpers';
import { SEOService } from '../../services/seo.service';
import { RecruiterFormService } from '../../services/recruiter_form.service';


export default class RecruiterForm extends Component {

    constructor(props) {
        super(props);

        this.notificationService = new NotificationService();
        this.SEOService = new SEOService();
        this.recruiterService = new RecruiterFormService();

        this.state = {
            action: "promote",
            siret: getParameterByName('siret') || "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            comment: "",
        };
    }

    componentWillMount() {
        this.SEOService.setTitle("Accès recruteurs");
        this.SEOService.setCanonical(window.location.origin.concat(window.location.pathname));
    }


    setAction = (event) => { this.setState({ action: event.target.value }); }
    setSiret = (event) => { this.setState({ siret: event.target.value }); }
    setFirstName = (event) => { this.setState({ firstName: event.target.value }); }
    setLastName = (event) => { this.setState({ lastName: event.target.value }); }
    setEmail = (event) => { this.setState({ email: event.target.value }); }
    setPhone = (event) => { this.setState({ phone: event.target.value }); }
    setComment = (event) => { this.setState({ comment: event.target.value }); }

    validateForm = (event) => {
        let messages = [];
        if(!this.state.action || this.state.action === '') messages.push('Aucun souhait d\'action indiqué. Veuillez remplir ce champ.');

        if(!this.state.siret || this.state.siret === '') messages.push('Aucun siret. Veuillez remplir ce champ.');
        else if (!isSiret(this.state.siret)) messages.push('Le siret n\'est pas au format. Il doit se composer de 14 chiffres.');

        if(!this.state.firstName || this.state.firstName === '') messages.push('Aucun prénom. Veuillez remplir ce champ.');
        if(!this.state.lastName || this.state.lastName === '') messages.push('Aucun nom. Veuillez remplir ce champ.');

        if(!this.state.email || this.state.email === '') messages.push('Aucun email. Veuillez remplir ce champ.');
        else if(!isEmail(this.state.email)) messages.push('L\'adresse e-mail n\'est pas au bon format, veuillez vérifiez sa valeur.');

        return messages;
    }
    sendForm = (event) => {
        event.preventDefault();
        let messages = this.validateForm();
        this.notificationService.deleteNotification();

        if (messages.length !== 0) {
            this.notificationService.createError(messages);
            return;
        }

        let promise = this.recruiterService.sendForm({
            action: this.state.action,
            siret: this.state.siret,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phone: this.state.phone,
            comment: this.state.comment,
        });
        promise
            .then(() => {
                this.notificationService.createSuccess("Merci pour votre message, nous reviendrons vers vous dès que possible.");
                // Reset form
                this.setState({ action: "promote", siret: getParameterByName('siret') || "", firstName: "", lastName: "", email: "", phone: "", comment: "" });
            })
            .catch(() => this.notificationService.createError("Erreur lors de l'envoi. Vous êtes libre d'essayer ultérieurement ou nous contacter directement à l'adresse suivante : labonnealternance@pole-emploi.fr"))
    }

    render() {
        return (
            <div id="recruiter-form" className="max-size-1000">
                <Header showOffset={false} />

                <main className="content">
                    <h2>Demande de modification des informations de mon entreprise</h2>
                    <p className="text-center">Le remplissage des champs accompagnés d'une étoile '*' est obligatoire</p>

                    <Notification />

                    <form className="" method="post" onSubmit={this.sendForm}>
                        <div>
                            <label htmlFor="action">Je souhaite *</label>
                            <select id="action" onChange={this.setAction} value={this.state.action} required>
                                <option value="promote">Promouvoir mon entreprise sur le site</option>
                                <option value="remove">Retirer mon entreprise du site</option>
                                <option value="update">Modifier les coordonnées de mon entreprise sur le site</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="siret">Siret *</label>
                            <input aria-required="true" id="siret" onChange={this.setSiret} type="text" value={this.state.siret} maxLength="14" />
                            <p className="form-help-text">14 chiffres, sans espace. Exemple: 36252187900034</p>
                        </div>
                        <div>
                            <label htmlFor="firstName">Prénom *</label>
                            <input aria-required="true" id="firstName" onChange={this.setFirstName} type="text" value={this.state.firstName} maxLength="250" />
                        </div>
                        <div>
                            <label htmlFor="lastName">Nom *</label>
                            <input aria-required="true" id="lastName" onChange={this.setLastName} type="text" value={this.state.lastName} maxLength="250" />
                        </div>
                        <div>
                            <label htmlFor="email">Email *</label>
                            <input aria-required="true" id="email" onChange={this.setEmail} type="email" value={this.state.email} maxLength="250" />
                            <p className="form-help-text">Exemple : example@domaine.com</p>

                        </div>

                        <div>
                            <label htmlFor="phone">Téléphone</label>
                            <input id="phone" name="phone" type="tel" onChange={this.setPhone} value={this.state.phone} maxLength="15"/>
                            <p className="form-help-text">Exemples: 01 77 86 39 49, +33 1 77 86 39 49</p>
                        </div>

                        <div>
                            <label htmlFor="comment">Commentaire</label>
                            <textarea id="comment" name="comment" maxLength="15000"></textarea>

                            <p className="form-help-text">15 000 caractères maximum</p>
                        </div>

                        <div className="text-center"><input className="button" type="submit" value="Envoyer votre demande" /></div>
                    </form>

                </main>

                <Footer />
            </div>
        );
    }
}