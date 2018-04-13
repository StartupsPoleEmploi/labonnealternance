export class SEOService {

    constructor() {
        this.TITLE_DEFAULT = 'La Bonne Alternance';
    }

    setSeoValues(seoValues) {
        let values = seoValues || {};

        this.setTitle(values.title);
        this.setCanonical(values.canonical);
    }

    setTitle(title) {
        document.title = title + ' | ' + this.TITLE_DEFAULT;
    }

    setCanonical(canonicalUrl) {
        // Remove canonical
        let canonicalElement = document.querySelector('link[rel=canonical]');
        if (canonicalElement) canonicalElement.remove();

        if (canonicalUrl) {
            let canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = canonicalUrl;

            document.head.appendChild(canonical);
        }
    }

    displayNoFollow(addNoFollow) {
        let followMeta = document.getElementById('robots-meta');
        if(!followMeta) return;

        if (addNoFollow) {
            followMeta.content = 'noindex,follow';
        } else {
            followMeta.content = 'index,follow';
        }
    }
}