module.exports = {
    'Search "maçon" in "Nantes"': function (client) {
        client
            .url('http://labonnealternance.beta.pole-emploi.fr')
            .waitForElementPresent('body', 1000)
            .execute(client.resizeWindow(1200, 3000))
            .assert.containsText('h1.introduction', 'Trouvez ici les entreprises')
            .click('.rgpd-banner ul li button:first-child')
            .pause(200)

            // Let's go !
            .click('section.main-landing a[href="/recherche"]')
            .pause(1000)

            // Job term step
            .assert.containsText('.job-form-step h2 label', 'Dans quel métier/formation/domaine cherchez-vous ?')
            .setValue(".form-step-container #job-input", 'maçon')
            .pause(1000)
            .click('.form-step-container .submit-container button')
            .pause(1000)

            // Jobs select step
            .assert.containsText('.job-form-step h2 label', 'Choisissez les métiers qui vous intéressent')
            .click('.job-form-step li:nth-child(1)')
            .click('.job-form-step li:nth-child(2)')
            .click('.form-step-container .submit-container button')
            .pause(1000)

            // City select step
            .setValue("#location-form-step #location-input", 'Nantes')
            .pause(2000)
            .click('#location-form-step ul.suggestions li:nth-child(1) button')
            .click('.form-step-container .submit-container button')
            .pause(10000)

            // Check text
            .assert.containsText('#list-results h1', 'entreprises qui recrutent le plus en Alternance dans le métier/domaine "maçon"')
            .end();
    }
};