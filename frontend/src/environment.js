export const environment = {
    // La Bonne Boite
    SUGGEST_JOBS_URL: '/api/labonneboite/suggest_jobs?term=',
    SUGGEST_CITY_URL: '/api/labonneboite/suggest_cities?term=',
    GET_COMPANIES_URL: '/api/labonneboite/get_companies?',
    GET_COMPANY_DETAILS_LBB_URL: '/api/labonneboite/company_details?siret=',
    GET_JOB_SLUG_INFORMATIONS: '/api/labonneboite/job_slug?',
    GET_CITY_SLUG_INFORMATIONS: '/api/labonneboite/city_slug?',

    // Entreprises
    GET_COMPANY_DETAILS_ENTREPRISES_API_URL: '/api/entreprises/get_details?siret=',

    // Favorites
    SEND_FAVORITES_URL: '/favorites/send_by_email',

    // Recruiter access
    CONTACT_FORM_URL: '/recruiter_contact',

    // Match
    GET_SOFTSKILLS_URL: '/api/match/get_soft_skills?rome=',

    // Api-adresse : get address from longitude/latitude
    API_ADRESSE_URL: 'https://api-adresse.data.gouv.fr/reverse/?lon={longitude}&lat={latitude}&type=street',

    // Google Analytics ID
    GA_ID: ''
};