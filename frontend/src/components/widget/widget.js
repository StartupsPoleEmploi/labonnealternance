import React, {useEffect, createRef} from 'react';

import './widget.scss';

const iframe = createRef();

export default ({url}) => {
    useEffect(() => {
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
