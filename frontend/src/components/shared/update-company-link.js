import React, { Component } from 'react';
import { NotificationService } from '../../services/notification/notification.service';

export default class UpdateCompanyLink extends Component {

    constructor(props) {
        super(props);
        this.myCompanyRef = React.createRef();
        this.state = {
            showDisclaimer: false
        };
    }

    componentDidUpdate() {
        // Accessibility: focus on first link when opening
        if(this.state.showDisclaimer && this.myCompanyRef.current) {
            this.myCompanyRef.current.focus()
        }
    }

    openAntiSpam = (e) => {
        e.preventDefault();
        if(!this.state.showDisclaimer) this.setState({ showDisclaimer : true })
    }

    showNoApplication = (e) => {
        e.preventDefault();
        NotificationService.createError(
            "Vous souhaitez postuler auprès de cette entreprise mais nous ne proposons pas encore cette fonctionnalité. " +
            "Vous devez donc contacter directement l’entreprise en vous aidant des informations présentes sur cette page."
        );
    }


    render() {
        const { showDisclaimer } = this.state;

        return (
            <>
                <button className="reset" onClick={this.openAntiSpam}>
                    C'est mon entreprise et je souhaite en modifier les informations
                </button>

                {showDisclaimer ?
                    <div className="anti-spam">
                        <button className="button small-white" onClick={this.showNoApplication}>Je souhaite postuler dans cette entreprise pour y travailler.</button>

                        <a className="button small-white" href={this.props.recruiterAccessUrl} target="blank" title="Ouverture dans une nouvelle fenêtre" ref={this.myCompanyRef}>
                        ￼   Je travaille déjà dans cette entreprise et je souhaite modifier ses informations.￼
                        </a>
                    </div> : null
                }
            </>
        )
    }

}