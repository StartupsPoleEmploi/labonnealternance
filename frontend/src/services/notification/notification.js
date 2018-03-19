export const NOTIFICATION_TYPE = {
    INFO: 0,
    WARNING: 1,
    ERROR: 2,
    SUCCESS: 3
};

export class Notification {
    constructor(type, messages) {
        this.type = type;
        this.display = false;

        // Handle when string given to get an array
        if (typeof(messages) === 'string') messages = [ messages ];
        this.messages = messages;
    }
}