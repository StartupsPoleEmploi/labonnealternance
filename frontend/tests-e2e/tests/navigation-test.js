module.exports = {
    'Navigation test': function (client) {
        client
            .url('localhost:8000')
            .waitForElementPresent('body', 10000)
            .assert.containsText('h1.introduction', 'Trouvez ici les entreprises')
            .click('.rgpd-banner ul li button:first-child')
            .waitForElementVisible('footer#global-footer a[href="/qui-sommes-nous"]')

            // Qui sommes-nous ?
            .moveToElement('footer#global-footer a[href="/qui-sommes-nous"]', 10, 10)
            .click('footer#global-footer a[href="/qui-sommes-nous"]')
            .waitForElementNotPresent('#home', 10000)
            .assert.containsText('main h1', 'Qui sommes-nous ?')

            // FAQ
            .click('footer#global-footer  a[href="/faq"]')
            .pause(10000)
            .assert.containsText('main h1', 'Questions fréquemment posées (FAQ)')

            // CGU
            .click('footer#global-footer a[href="/conditions-generales-utilisation"]')
            .pause(10000)
            .assert.containsText('main h1', 'Conditions d\'utilisation')

            .end();
    }
};