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
        if (addNoFollow) {
            if (document.getElementById('no-follow')) return;

            // Add no-follow
            let metaNoFollow = document.createElement('meta');
            metaNoFollow.id = 'no-follow';
            metaNoFollow.name = 'robots';
            metaNoFollow.content = 'noindex,follow';

            document.head.appendChild(metaNoFollow);
        } else {
            // Remove it
            let noFollowElement = document.getElementById('no-follow');
            if (noFollowElement) noFollowElement.remove();
        }
    }
}