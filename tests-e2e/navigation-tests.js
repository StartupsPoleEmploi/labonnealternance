module.exports = {
    'Navigation test': function (client) {
        client
            .url('http://labonnealternance.beta.pole-emploi.fr')
            .waitForElementPresent('body', 1000)
            .execute(client.resizeWindow(1200, 3000))
            .assert.containsText('h1.introduction', 'Trouvez ici les entreprises')
            .click('.rgpd-banner ul li button:first-child')
            .pause(200)

            // Qui sommes-nous ?
            .click('footer#global-footer a[href="/qui-sommes-nous"]')
            .pause(1000)
            .assert.containsText('main h1', 'Qui sommes-nous ?')

            // FAQ
            .click('footer#global-footer  a[href="/faq"]')
            .pause(1000)
            .assert.containsText('main h1', 'Questions fréquemment posées (FAQ)')

            // CGU
            .click('footer#global-footer a[href="/conditions-generales-utilisation"]')
            .pause(1000)
            .assert.containsText('main h1', 'Conditions d\'utilisation')

            .end();
    }
};