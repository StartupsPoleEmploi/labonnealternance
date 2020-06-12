import { getCookie } from './helpers';
import { constants } from '../constants';

class RecruiterFormServiceFactory {

    sendForm(formValues) {
        return new Promise((resolve, reject) => {
            fetch(constants.CONTACT_FORM_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: formValues.email,
                    form: {
                        action: formValues.action,
                        siret: formValues.siret,
                        firstName: formValues.firstName,
                        lastName: formValues.lastName,
                        phone: formValues.phone,
                        comment: formValues.comment,
                    }
                })
            }).then(response => {
                if (response.status === 200) { resolve(); return; }

                // Send exception to Sentry (for further analysis)
                window.Raven.captureException(new Error('Error when sending recruiter form : ' + response.status + ' ' + response.statusText));

                reject();

            });
        });
    }

}

// Export as singleton
const recruiterFormService = new RecruiterFormServiceFactory();
Object.freeze(recruiterFormService);
export { recruiterFormService as RecruiterFormService };