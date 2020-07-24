import React, {useEffect, createRef} from 'react';
import { SEOService } from '../../services/seo.service';

import './widget.scss';

const iframe = createRef();

export default ({url, title}) => {
    useEffect(() => {
        // update page title
        SEOService.setTitle(title);
        // add a css class to the parent in order to prevent scrolls
        iframe.current.parentElement.classList.add('prevent-scrolls');
        return () => iframe.current.parentElement.classList.remove('prevent-scrolls');
    });
    return <iframe
        ref={iframe}
        className="widget"
        src={url}
    />;
}
