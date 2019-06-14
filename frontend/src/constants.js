export const constants = {
    // GLOBAL
    MOBILE_MAX_WIDTH: 768, // Use mobile mode at 768px

    // La Bonne Boite
    SUGGEST_JOBS_URL: '/api/labonneboite/suggest_jobs?term=',
    SUGGEST_CITY_URL: '/api/labonneboite/suggest_cities?term=',
    GET_HIDDEN_MARKET_COMPANIES_URL: '/api/labonneboite/get_hidden_market_companies?',
    GET_VISIBLE_MARKET_COMPANIES_URL: '/api/labonneboite/get_visible_market_companies?',
    GET_COMPANY_DETAILS_LBB_URL: '/api/labonneboite/company_details?siret=',
    GET_JOB_SLUG_INFORMATIONS: '/api/labonneboite/job_slug?job-slug=',
    GET_CITY_SLUG_INFORMATIONS: '/api/labonneboite/city_slug?city-slug=',
    GET_CITY_SLUG_FROM_CITY_CODE: '/api/labonneboite/city_slug_from_city_code?city-code=',

    // Entreprises
    GET_COMPANY_DETAILS_ENTREPRISES_API_URL: '/api/entreprises/get_details?siret=',

    // Favorites
    SEND_FAVORITES_URL: '/favorites/send_by_email',

    // Recruiter access
    CONTACT_FORM_URL: 'recruiter/send_form',

    // Match
    GET_SOFTSKILLS_URL: '/api/match/get_soft_skills?rome=',

    // https://adresse.data.gouv.fr/api : get address from GPS coordinates
    API_ADRESSE_URL: 'https://api-adresse.data.gouv.fr/reverse/?lon={longitude}&lat={latitude}&type=street',

    // https://geo.api.gouv.fr/docs/communes : get commune_id closest to given GPS coordinates
    GEO_API_URL: 'https://geo.api.gouv.fr/communes?lon={longitude}&lat={latitude}',
};