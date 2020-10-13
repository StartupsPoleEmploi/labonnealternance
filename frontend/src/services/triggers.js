import { constants } from '../constants';

/**
 * Call the triggers/ API route
 * Retrieve the triggers to be executed
 * @see labonnealternance/api/triggers/views.py
 * TODO: pass more generic GET params when more triggers are needed
 */
export async function getTriggers(city, romes) {
    try {
        const romeArg = `&romes=${romes.join('&romes=')}`;
        const response = await fetch(constants.GET_TRIGGERS + `location=${city}${romeArg}`);
        if (response.status === 200) return response.json();
        else console.error('Could not get triggers from API', response);
    } catch(e) {
        console.error('Error fetching triggers', e);
    }
    return null;
}

/**
 * Get the triggers and "execute" them
 */
export async function execTriggers(city, romes) {
    const triggers = await getTriggers(city, romes);
    if(triggers) triggers.forEach(trigger => {
        switch(trigger.type) {
            case 'hotjar':
                console.log('TRIGGER HOTJAR', trigger.name);
                if(window.hj) {
                    return window.hj('trigger', trigger.name);
                }
                console.error('Hotjar trigger error: hj is undefined. Is hotjar loaded?');
            break;
            default:
                console.error('Unknown trigger type', trigger.type, trigger);
        }
        // Always resolve, triggers are not imprtant
        return Promise.resolve();
    });
}
