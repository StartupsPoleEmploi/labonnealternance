import React, {useEffect, createRef} from 'react';
import { SEOService } from '../../services/seo.service';
import {useHistory} from 'react-router-dom';

import './widget.scss';

const iframe = createRef();

export default ({url, title}) => {
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

        // update page title
        SEOService.setTitle(title);

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
