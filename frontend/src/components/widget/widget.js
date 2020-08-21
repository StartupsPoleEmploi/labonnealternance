import React, {useEffect, createRef} from 'react';
import {useHistory} from 'react-router-dom';

import './widget.scss';

const iframe = createRef();

export default ({url}) => {
    const history = useHistory();
    useEffect(() => {
        // create a listener for post message
        const onPostMessage = (e) => {
            switch(e.data.type) {
                case 'goToPage':
                    history.push(e.data.page);
                    break;
                default:
                    console.error('unknown post message type');
            }
        };

        // listen for widget messages
        window.addEventListener('message', onPostMessage);

        // add a css class to the parent in order to prevent scrolls
        iframe.current.parentElement.classList.add('prevent-scrolls');
        return () => {
            // cleanup
            iframe.current.parentElement.classList.remove('prevent-scrolls');
            window.removeEventListener('message', onPostMessage);
        };
    });
    return <iframe
        ref={iframe}
        className="widget"
        src={url}
    />;
}
