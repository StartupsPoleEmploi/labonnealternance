import { getCookie } from "./helpers";
import { environment } from "../environment";

export class RecruiterFormService {

    sendForm(formValues) {
        return new Promise((resolve, reject) => {
            fetch(environment.CONTACT_FORM_URL, {
                method: "POST",
                body: JSON.stringify({
                    email: formValues.email,
                    form : JSON.stringify({ formValues }),
                    'X-CSRFToken': getCookie('csrftoken')
                })
            }).then(response => console.log(response))
        });
    }

}