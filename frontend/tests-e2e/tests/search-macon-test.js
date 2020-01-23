module.exports = {
    'Search "maçon" in "Nantes"': function (client) {
        client
            .url('localhost:8000')
            .waitForElementPresent('body', 10000)
            .assert.containsText('h1.introduction', 'Trouvez ici les entreprises')
            .click('.rgpd-banner ul li button:first-child')
            .waitForElementVisible('section.main-landing a[href="/recherche"]')

            // Let's go !
            .click('section.main-landing a[href="/recherche"]')
            .waitForElementVisible('#search-form')

            // Job term step
            .assert.containsText('.job-form-step h2 label', 'Dans quel métier/formation/domaine cherchez-vous ?')
            .setValue(".form-step-container #job-input", 'maçon')
            .pause(5000)
            .click('.form-step-container .submit-container button')
            .waitForElementVisible('.job-form-step li button:first-child')

            // Jobs select step
            .assert.containsText('.job-form-step h2 label', 'Sélectionnez les métiers qui vous intéressent')
            .click('.job-form-step li button[data-rome="F1703"]')
            .click('.job-form-step li button[data-rome="F1611"]')
            .click('.form-step-container .submit-container button')
            .waitForElementVisible('#location-input')

            // City select step
            .setValue("#location-form-step #location-input", 'Nantes')
            .waitForElementVisible('#location-form-step ul.suggestions')
            .click('#location-form-step ul.suggestions button[data-zipcode="44000"]')
            .click('.form-step-container .submit-container button')
            .waitForElementVisible('#results')

            // Check text
            .assert.containsText('#list-results h1', 'entreprises qui recrutent le plus en Alternance dans le métier/domaine "maçon"')
            .end();
    }
};