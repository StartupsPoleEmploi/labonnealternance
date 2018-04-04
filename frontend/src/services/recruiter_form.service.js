import { getCookie } from "./helpers";
import { constants } from "../constants";

export class RecruiterFormService {

    sendForm(formValues) {
        return new Promise((resolve, reject) => {
            fetch(constants.CONTACT_FORM_URL, {
                method: "POST",
                headers: {
                    'Accept':'application/json',
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
                if(response.status === 200) { resolve(); return; }
                reject()
            });
        });
    }

}