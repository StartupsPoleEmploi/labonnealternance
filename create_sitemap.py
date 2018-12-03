import json, re, os, time
from datetime import datetime
from urllib import request, parse

from labonnealternance.api.labonneboite import lbb_client
from labonnealternance.api.labonneboite.lbb_client import LBB_ROME_URL

# We don't want to use settings.LBB_URL to ensure to call the LBB prod server
LBB_URL = 'https://labonneboite.pole-emploi.fr'

JOBS_SLUG_REGEX = r"^[a-z,-]*$"
CITY_SLUG_REGEX = r"^[a-z-]*[0-9]{5}$"


class InvalidJobsSlug(Exception):
    pass

class InvalidCitySlug(Exception):
    pass

# Cities
CITIES = [
    "paris-75000",
    "marseille-13000",
    "lyon-69000",
    "toulouse-31000",
    "nice-06000",
    "nantes-44000",
    "strasbourg-67000",
    "montpellier-34000",
    "bordeaux-33000",
    "lille-59000",
    "rennes-35000",
    "reims-51100",
    "le-havre-76600",
    "saint-etienne-42000",
    "toulon-83000",
    "grenoble-38000",
    "dijon-21000",
    "nimes-30000",
    "angers-49000",
    "villeurbanne-69100",
    "le-mans-72000",
    "saint-denis-97400",
    "clermont-ferrand-63000",
    "brest-29200",
    "limoges-87000",
    "tours-37000",
    "amiens-80000",
    "annecy-74000",
    "perpignan-66000",
    "metz-57000",
    "besancon-25000",
    "boulogne-billancourt-92100",
    "orleans-45000",
    "mulhouse-68100",
    "rouen-76000",
    "saint-denis-93200",
    "caen-14000",
    "argenteuil-95100",
    "montreuil-93100",
    "nancy-54000",
    "roubaix-59100",
    "tourcoing-59200",
    "nanterre-92000",
    "avignon-84000",
    "vitry-sur-seine-94400",
    "creteil-94000",
    "poitiers-86000",
    "asnieres-sur-seine-92600",
    "courbevoie-92400",
    "versailles-78000",
    "colombes-92700",
    "fort-de-france-97200",
    "aulnay-sous-bois-93600",
    "cherbourg-en-cotentin-50100",
    "rueil-malmaison-92500",
    "pau-64000",
    "aubervilliers-93300",
    "champigny-sur-marne-94500",
    "beziers-34500",
    "la-rochelle-17000",
    "saint-maur-des-fosses-94100",
    "calais-62100",
    "saint-nazaire-44600",
    "merignac-33700",
    "drancy-93700",
    "colmar-68000",
    "ajaccio-20000",
    "bourges-18000",
    "levallois-perret-92300",
    "la-seyne-sur-mer-83500",
    "quimper-29000",
    "neuilly-sur-seine-92200",
    "valence-26000",
    "cergy-95000",
    "venissieux-69200",
    "pessac-33600",
    "troyes-10000",
    "ivry-sur-seine-94200",
    "chambery-73000",
    "lorient-56100",
    "montauban-82000",
    "sarcelles-95200",
    "niort-79000",
    "villejuif-94800",
    "hyeres-83400",
    "saint-quentin-02100",
    "beauvais-60000",
    "epinay-sur-seine-93800",
    "cayenne-97300",
    "maisons-alfort-94700",
    "cholet-49300",
    "meaux-77100",
    "chelles-77500",
    "pantin-93500",
]

# Job/terms
JOBS = [
    ('vendeuse', 'relation-commerciale-en-vente-de-vehicules,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,animation-de-vente,teleconseil-et-televente,vente-en-alimentation,vente-de-voyages,achat-vente-d-objets-d-art-anciens-ou-d-occasion,vente-en-vegetaux,vente-en-animalerie,transaction-immobiliere,assistanat-commercial,relation-technico-commerciale,vente-en-articles-de-sport-et-loisirs,relation-commerciale-aupres-de-particuliers,administration-des-ventes,management-relation-clientele,strategie-commerciale,relation-commerciale-grands-comptes-et-entreprises,conseil-clientele-en-assurances,accueil-et-services-bancaires'),
    ('vendeur', 'relation-commerciale-en-vente-de-vehicules,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,animation-de-vente,teleconseil-et-televente,vente-en-alimentation,vente-de-voyages,achat-vente-d-objets-d-art-anciens-ou-d-occasion,vente-en-vegetaux,vente-en-animalerie,transaction-immobiliere,assistanat-commercial,relation-technico-commerciale,vente-en-articles-de-sport-et-loisirs,relation-commerciale-aupres-de-particuliers,administration-des-ventes,management-relation-clientele,strategie-commerciale,relation-commerciale-grands-comptes-et-entreprises,conseil-clientele-en-assurances,accueil-et-services-bancaires'),
    ('vente', 'relation-commerciale-en-vente-de-vehicules,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,animation-de-vente,teleconseil-et-televente,vente-en-alimentation,vente-de-voyages,achat-vente-d-objets-d-art-anciens-ou-d-occasion,vente-en-vegetaux,vente-en-animalerie,transaction-immobiliere,assistanat-commercial,relation-technico-commerciale,vente-en-articles-de-sport-et-loisirs,relation-commerciale-aupres-de-particuliers,administration-des-ventes,management-relation-clientele,strategie-commerciale,relation-commerciale-grands-comptes-et-entreprises,conseil-clientele-en-assurances,accueil-et-services-bancaires'),
    ('vendeur', 'relation-commerciale-en-vente-de-vehicules,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,animation-de-vente,teleconseil-et-televente,vente-en-alimentation,vente-de-voyages,achat-vente-d-objets-d-art-anciens-ou-d-occasion,vente-en-vegetaux,vente-en-animalerie,transaction-immobiliere,assistanat-commercial,relation-technico-commerciale,vente-en-articles-de-sport-et-loisirs,relation-commerciale-aupres-de-particuliers,administration-des-ventes,management-relation-clientele,strategie-commerciale,relation-commerciale-grands-comptes-et-entreprises,conseil-clientele-en-assurances,accueil-et-services-bancaires'),
    ('comptabilite', 'comptabilite,controle-de-gestion,audit-et-controle-comptables-et-financiers,analyse-et-ingenierie-financiere'),
    ('comptable', 'comptabilite,controle-de-gestion,audit-et-controle-comptables-et-financiers,analyse-et-ingenierie-financiere'),
    ('secretaire', 'secretariat,secretariat-comptable,secretariat-et-assistanat-medical-ou-medico-social,assistanat-de-direction,assistanat-en-ressources-humaines,assistanat-commercial,gestion-locative-immobiliere,assistanat-technique-et-administratif,gestion-en-banque-et-assurance,comptabilite'),
    ('secretariat', 'secretariat,secretariat-comptable,secretariat-et-assistanat-medical-ou-medico-social,assistanat-de-direction,assistanat-en-ressources-humaines,assistanat-commercial,gestion-locative-immobiliere,assistanat-technique-et-administratif,gestion-en-banque-et-assurance,comptabilite'),
    ('assistanat', 'assistanat-technique-et-administratif,assistanat-commercial,assistanat-de-direction,assistanat-en-ressources-humaines,formation-professionnelle,secretariat-et-assistanat-medical-ou-medico-social'),
    ('assistante', 'assistanat-commercial,comptabilite,communication,coiffure,marketing,prise-de-son-et-sonorisation,coordination-d-edition,mesures-topographiques,photographie,danse'),
    ('assistant', 'assistanat-commercial,comptabilite,communication,marketing,prise-de-son-et-sonorisation,coordination-d-edition,mesures-topographiques,coiffure,photographie,danse'),
    ('assistance administrative', 'secretariat,secretariat-comptable,secretariat-et-assistanat-medical-ou-medico-social,assistanat-de-direction,assistanat-en-ressources-humaines,assistanat-commercial,gestion-locative-immobiliere,assistanat-technique-et-administratif,gestion-en-banque-et-assurance,comptabilite'),
    ('assistante administrative', 'secretariat,secretariat-comptable,secretariat-et-assistanat-medical-ou-medico-social,assistanat-de-direction,assistanat-en-ressources-humaines,assistanat-commercial,gestion-locative-immobiliere,assistanat-technique-et-administratif,gestion-en-banque-et-assurance,comptabilite'),
    ('assistant administratif', 'secretariat,secretariat-comptable,secretariat-et-assistanat-medical-ou-medico-social,assistanat-de-direction,assistanat-en-ressources-humaines,assistanat-commercial,gestion-locative-immobiliere,assistanat-technique-et-administratif,gestion-en-banque-et-assurance,comptabilite'),
    ('assistant commercial', 'assistanat-commercial,conseil-en-services-funeraires,transaction-immobiliere,relation-commerciale-en-vente-de-vehicules,comptabilite,communication,coiffure,marketing,prise-de-son-et-sonorisation,coordination-d-edition'),
    ('assistante commerciale', 'relation-commerciale-en-vente-de-vehicules,assistanat-commercial,conseil-en-services-funeraires,transaction-immobiliere,strategie-commerciale,relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-aupres-de-particuliers,relation-technico-commerciale,comptabilite,marketing'),
    ('cuisinier', 'personnel-de-cuisine,personnel-polyvalent-en-restauration,fabrication-de-crepes-ou-pizzas,plonge-en-restauration,management-du-personnel-de-cuisine'),
    ('cuisiniere', 'personnel-de-cuisine,personnel-polyvalent-en-restauration,fabrication-de-crepes-ou-pizzas,plonge-en-restauration,management-du-personnel-de-cuisine'),
    ('cuisine', 'personnel-de-cuisine,personnel-polyvalent-en-restauration,fabrication-de-crepes-ou-pizzas,plonge-en-restauration,management-du-personnel-de-cuisine'),
    ('agent administratif', 'gestion-en-banque-et-assurance,operations-administratives,transaction-immobiliere,gardiennage-de-locaux,conduite-d-enquetes,plonge-en-restauration,hydrotherapie,accueil-et-renseignements,services-domestiques,affretement-transport'),
    ('agente administrative', 'operations-administratives,gestion-en-banque-et-assurance,direction-administrative-et-financiere,secretariat,information-sociale,assistanat-en-ressources-humaines,management-des-ressources-humaines,administration-des-ventes,comptabilite,coordination-pedagogique'),
    ('chauffeur', 'conduite-de-transport-de-particuliers,conduite-de-transport-en-commun-sur-route,presentation-de-spectacles-ou-d-emissions,conduite-d-operations-funeraires,conduite-d-engins-agricoles-et-forestiers,conduite-de-transport-de-marchandises-sur-longue-distance,conduite-et-livraison-par-tournees-sur-courte-distance,conduite-d-installation-de-production-des-metaux,pilotage-d-installation-energetique-et-petrochimique'),
    ('chauffeuse', 'conduite-de-transport-de-particuliers,conduite-d-engins-agricoles-et-forestiers,conduite-de-transport-en-commun-sur-route,presentation-de-spectacles-ou-d-emissions,conduite-d-operations-funeraires,conduite-d-installation-de-production-des-metaux,conduite-de-transport-de-marchandises-sur-longue-distance,conduite-et-livraison-par-tournees-sur-courte-distance,pilotage-d-installation-energetique-et-petrochimique'),
    ('aide soignant', 'soins-d-hygiene-de-confort-du-patient,aide-aux-soins-animaux,demenagement,boucherie,aide-d-elevage-agricole-et-aquacole,aide-agricole-de-production-legumiere-ou-vegetale,aide-agricole-de-production-fruitiere-ou-viticole,patisserie-confiserie-chocolaterie-et-glacerie,gestion-en-banque-et-assurance,boulangerie-viennoiserie'),
    ('aide soignante', 'soins-d-hygiene-de-confort-du-patient,aide-aux-soins-animaux,demenagement,boucherie,aide-d-elevage-agricole-et-aquacole,aide-agricole-de-production-legumiere-ou-vegetale,aide-agricole-de-production-fruitiere-ou-viticole,patisserie-confiserie-chocolaterie-et-glacerie,gestion-en-banque-et-assurance,boulangerie-viennoiserie'),
    ('commercial', 'relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-aupres-de-particuliers,assistanat-commercial,animation-de-site-multimedia,conseil-clientele-en-assurances,accueil-et-services-bancaires,relation-commerciale-en-vente-de-vehicules,relation-technico-commerciale,transaction-immobiliere,strategie-commerciale,administration-des-ventes,management-relation-clientele,marketing,achats,management-en-force-de-vente,teleconseil-et-televente,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,vente-en-articles-de-sport-et-loisirs,vente-en-alimentation,animation-de-vente'),
    ('commerciale', 'relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-aupres-de-particuliers,assistanat-commercial,animation-de-site-multimedia,conseil-clientele-en-assurances,accueil-et-services-bancaires,relation-commerciale-en-vente-de-vehicules,relation-technico-commerciale,transaction-immobiliere,strategie-commerciale,administration-des-ventes,management-relation-clientele,marketing,achats,management-en-force-de-vente,teleconseil-et-televente,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,vente-en-articles-de-sport-et-loisirs,vente-en-alimentation,animation-de-vente'),
    ('commerciale', 'relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-aupres-de-particuliers,assistanat-commercial,animation-de-site-multimedia,conseil-clientele-en-assurances,accueil-et-services-bancaires,relation-commerciale-en-vente-de-vehicules,relation-technico-commerciale,transaction-immobiliere,strategie-commerciale,administration-des-ventes,management-relation-clientele,marketing,achats,management-en-force-de-vente,teleconseil-et-televente,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,vente-en-articles-de-sport-et-loisirs,vente-en-alimentation,animation-de-vente'),
    ('commerce', 'relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-aupres-de-particuliers,assistanat-commercial,animation-de-site-multimedia,conseil-clientele-en-assurances,accueil-et-services-bancaires,relation-commerciale-en-vente-de-vehicules,relation-technico-commerciale,transaction-immobiliere,strategie-commerciale,administration-des-ventes,management-relation-clientele,marketing,achats,management-en-force-de-vente,teleconseil-et-televente,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,vente-en-articles-de-sport-et-loisirs,vente-en-alimentation,animation-de-vente'),
    ('infirmier', 'soins-infirmiers-specialises-en-anesthesie,soins-infirmiers-generalistes,soins-infirmiers-specialises-en-prevention,soins-infirmiers-specialises-en-puericulture,coordination-de-services-medicaux-ou-paramedicaux,soins-infirmiers-specialises-en-bloc-operatoire,direction-d-etablissement-et-d-enseignement'),
    ('infirmiere', 'soins-infirmiers-generalistes,soins-infirmiers-specialises-en-prevention,coordination-de-services-medicaux-ou-paramedicaux,soins-infirmiers-specialises-en-anesthesie,soins-infirmiers-specialises-en-puericulture,soins-infirmiers-specialises-en-bloc-operatoire'),
    ('formateur', 'formation-professionnelle,enseignement-artistique,coiffure,bobinage-electrique,coordination-pedagogique,soins-esthetiques-et-corporels,cablage-electrique-et-electromecanique,formation-en-conduite-de-vehicules,encadrement-technique-en-insertion-professionnelle,realisation-d-objets-artistiques-et-fonctionnels-en-verre'),
    ('formatrice', 'formation-professionnelle,enseignement-artistique,coiffure,soins-esthetiques-et-corporels,formation-en-conduite-de-vehicules,encadrement-technique-en-insertion-professionnelle,realisation-d-objets-artistiques-et-fonctionnels-en-verre'),
    ('formation', 'formation-professionnelle,information-meteorologique,conseil-en-formation,information-geographique,encadrement-d-equipe-en-industrie-de-transformation,expertise-et-support-en-systemes-d-information,information-sociale,conduite-d-equipement-de-deformation-des-metaux,conseil-en-information-medicale,direction-des-systemes-d-information'),
    ('cariste', 'conduite-d-engins-de-deplacement-des-charges,magasinage-et-preparation-de-commandes'),
    ('informatique', 'maintenance-informatique-et-bureautique,etudes-et-developpement-informatique,administration-de-systemes-d-information,intervention-technique-en-etudes-et-conception-en-automatisme,expertise-et-support-en-systemes-d-information,installation-et-maintenance-d-automatismes,conseil-et-maitrise-d-ouvrage-en-systemes-d-information,direction-des-systemes-d-information,production-et-exploitation-de-systemes-d-information'),
    ('informaticien', 'maintenance-informatique-et-bureautique,etudes-et-developpement-informatique,administration-de-systemes-d-information,intervention-technique-en-etudes-et-conception-en-automatisme,expertise-et-support-en-systemes-d-information,installation-et-maintenance-d-automatismes,conseil-et-maitrise-d-ouvrage-en-systemes-d-information,direction-des-systemes-d-information,production-et-exploitation-de-systemes-d-information'),
    ('informaticienne', 'maintenance-informatique-et-bureautique,etudes-et-developpement-informatique,administration-de-systemes-d-information,intervention-technique-en-etudes-et-conception-en-automatisme,expertise-et-support-en-systemes-d-information,installation-et-maintenance-d-automatismes,conseil-et-maitrise-d-ouvrage-en-systemes-d-information,direction-des-systemes-d-information,production-et-exploitation-de-systemes-d-information'),
    ('developpeur', 'developpement-local,etudes-et-developpement-informatique,production-en-laboratoire-cinematographique,production-en-laboratoire-photographique,management-et-ingenierie-etudes-recherche-et-developpement-industriel,intervention-technique-en-etudes-et-developpement-electronique,conception-developpement-produits-d-assurances,management-de-projet-immobilier'),
    ('developpeuse', 'developpement-local,etudes-et-developpement-informatique,production-en-laboratoire-cinematographique,production-en-laboratoire-photographique,management-et-ingenierie-etudes-recherche-et-developpement-industriel,intervention-technique-en-etudes-et-developpement-electronique,conception-developpement-produits-d-assurances,management-de-projet-immobilier'),
    ('patisserie', 'personnel-de-cuisine,patisserie-confiserie-chocolaterie-et-glacerie,management-gestion-de-rayon-produits-alimentaires,vente-en-alimentation,conduite-d-equipement-de-production-alimentaire,mise-en-rayon-libre-service'),
    ('patissier', 'personnel-de-cuisine,patisserie-confiserie-chocolaterie-et-glacerie,boulangerie-viennoiserie'),
    ('patissiere', 'personnel-de-cuisine,patisserie-confiserie-chocolaterie-et-glacerie,boulangerie-viennoiserie'),
    ('peintre', 'realisation-et-restauration-de-facades,reparation-de-carrosserie,peinture-industrielle,creation-en-arts-plastiques,peinture-en-batiment,decoration-d-objets-d-art-et-artisanaux'),
    ('peinture', 'peinture-en-batiment,peinture-industrielle,enseignement-artistique,expertise-technique-couleur-en-industrie'),
    ('coiffure', 'coiffure,coiffure-et-maquillage-spectacle'),
    ('coiffeur', 'coiffure,coiffure-et-maquillage-spectacle'),
    ('coiffeuse', 'coiffure,coiffure-et-maquillage-spectacle'),
    ('management-unite-commerciale', 'management-et-ingenierie-de-production,management-en-force-de-vente,management-de-structure-de-sante-sociale-ou-penitentiaire,management-et-ingenierie-d-affaires,strategie-commerciale,relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-aupres-de-particuliers,relation-technico-commerciale,relation-commerciale-en-vente-de-vehicules,pilotage-d-unite-elementaire-de-production-mecanique-ou-de-travail-des-metaux'),
    ('maconnerie', 'maconnerie,construction-en-beton'),
    ('maconne', 'maconnerie,construction-en-beton,realisation-et-restauration-de-facades,construction-de-routes-et-voies,preparation-du-gros-oeuvre-et-des-travaux-publics'),
    ('macon', 'maconnerie,construction-en-beton,realisation-et-restauration-de-facades,construction-de-routes-et-voies,preparation-du-gros-oeuvre-et-des-travaux-publics'),
    ('mecanique', 'conception-et-dessin-produits-mecaniques,montage-assemblage-mecanique,exploitation-et-manoeuvre-des-remontees-mecaniques,mecanique-de-marine,mecanique-automobile-et-entretien-de-vehicules,cablage-electrique-et-electromecanique,intervention-technique-qualite-en-mecanique-et-travail-des-metaux,conduite-d-installation-automatisee-ou-robotisee-de-fabrication-mecanique,maintenance-mecanique-industrielle,pilotage-d-unite-elementaire-de-production-mecanique-ou-de-travail-des-metaux'),
    ('mecanicienne', 'maintenance-d-aeronefs,mecanique-de-marine,maintenance-electrique,ajustement-et-montage-de-fabrication,mecanique-automobile-et-entretien-de-vehicules,maintenance-mecanique-industrielle,reparation-de-cycles-motocycles-et-motoculteurs-de-loisirs,conduite-d-equipement-d-usinage,installation-et-maintenance-d-automatismes,personnel-de-la-defense'),
    ('boulanger', 'boulangerie-viennoiserie,management-gestion-de-rayon-produits-alimentaires,vente-en-alimentation,mise-en-rayon-libre-service,conduite-d-equipement-de-production-alimentaire'),
    ('boulangerie', 'boulangerie-viennoiserie,vente-en-alimentation,management-gestion-de-rayon-produits-alimentaires,mise-en-rayon-libre-service,conduite-d-equipement-de-production-alimentaire'),
    ('boulangere', 'boulangerie-viennoiserie'),
    ('restaurant', 'management-d-hotel-restaurant,personnel-de-cuisine,service-en-restauration,plonge-en-restauration,assistance-de-direction-d-hotel-restaurant,management-d-etablissement-de-restauration-collective,personnel-polyvalent-en-restauration'),
    ('restauration', 'plonge-en-restauration,service-en-restauration,management-d-etablissement-de-restauration-collective,personnel-polyvalent-en-restauration,realisation-et-restauration-de-facades,pose-et-restauration-de-couvertures,management-du-service-en-restauration,personnel-de-caisse,reliure-et-restauration-de-livres-et-archives,personnel-de-cuisine'),
    ('installateur sanitaire', 'installation-d-equipements-sanitaires-et-thermiques,montage-d-agencements,conduite-de-vehicules-sanitaires,maintenance-informatique-et-bureautique,installation-et-maintenance-telecoms-et-courants-faibles,maintenance-des-batiments-et-des-locaux,maconnerie,sante-animale,pose-de-revetements-rigides,assistance-medico-technique'),
    ('installatrice sanitaire', 'installation-d-equipements-sanitaires-et-thermiques,montage-d-agencements,conduite-de-vehicules-sanitaires,maintenance-informatique-et-bureautique,installation-et-maintenance-telecoms-et-courants-faibles,maintenance-des-batiments-et-des-locaux,maconnerie,sante-animale,pose-de-revetements-rigides,assistance-medico-technique'),
    ('installateur thermique', 'installation-d-equipements-sanitaires-et-thermiques,montage-d-agencements,conduite-de-traitement-thermique,maintenance-informatique-et-bureautique,installation-et-maintenance-telecoms-et-courants-faibles,maintenance-des-batiments-et-des-locaux,maconnerie,peinture-industrielle,pose-de-revetements-rigides,assistance-medico-technique'),
    ('installatrice thermique', 'installation-d-equipements-sanitaires-et-thermiques,montage-d-agencements,conduite-de-traitement-thermique,maintenance-informatique-et-bureautique,maconnerie,installation-et-maintenance-telecoms-et-courants-faibles,maintenance-des-batiments-et-des-locaux,peinture-industrielle,pose-de-revetements-rigides,assistance-medico-technique'),
    ('couvreur', 'pose-et-restauration-de-couvertures,maconnerie,relation-commerciale-aupres-de-particuliers,travaux-d-etancheite-et-d-isolation'),
    ('couvreuse', 'pose-et-restauration-de-couvertures,maconnerie,travaux-d-etancheite-et-d-isolation,relation-commerciale-aupres-de-particuliers'),
    ('reparation', 'preparation-des-vols,reparation-de-carrosserie,preparation-en-pharmacie,magasinage-et-preparation-de-commandes,reparation-de-biens-electrodomestiques,preparation-de-matieres-et-produits-industriels-broyage-melange,preparation-et-finition-d-articles-en-cuir-et-materiaux-souples,preparation-de-fils-montage-de-metiers-textiles,fabrication-et-reparation-d-instruments-de-musique,preparation-et-correction-en-edition-et-presse'),
    ('reparation de carrosserie', 'reparation-de-carrosserie,magasinage-et-preparation-de-commandes,conception-et-dessin-produits-mecaniques,reparation-de-biens-electrodomestiques,preparation-en-pharmacie,fabrication-et-reparation-d-instruments-de-musique,preparation-du-gros-oeuvre-et-des-travaux-publics,intervention-technique-en-methodes-et-industrialisation,conduite-d-engins-de-deplacement-des-charges,reparation-de-cycles-motocycles-et-motoculteurs-de-loisirs'),
    ('manager', 'design-industriel,animation-de-site-multimedia,optimisation-de-produits-touristiques,tresorerie-et-financement,elaboration-de-plan-media,promotion-d-artistes-et-de-spectacles,assistanat-de-direction,soins-esthetiques-et-corporels,ingenierie-et-etudes-du-btp,gestion-de-l-information-et-de-la-documentation'),
    ('preparateur en pharmacie', 'preparation-en-pharmacie,pharmacie,personnel-polyvalent-en-restauration,mecanique-automobile-et-entretien-de-vehicules,fabrication-de-crepes-ou-pizzas,preparation-des-vols,intervention-technique-en-methodes-et-industrialisation,installation-et-maintenance-en-nautisme,magasinage-et-preparation-de-commandes,realisation-de-structures-metalliques'),
    ('preparatrice en pharmacie', 'preparation-en-pharmacie,pharmacie,personnel-polyvalent-en-restauration,mecanique-automobile-et-entretien-de-vehicules,fabrication-de-crepes-ou-pizzas,preparation-des-vols,intervention-technique-en-methodes-et-industrialisation,installation-et-maintenance-en-nautisme,magasinage-et-preparation-de-commandes,realisation-de-structures-metalliques'),
    ('pharmacien', 'pharmacie,biologie-medicale,management-et-ingenierie-de-production,management-et-ingenierie-qualite-industrielle,conseil-en-sante-publique,recherche-en-sciences-de-l-univers-de-la-matiere-et-du-vivant'),
    ('pharmacienne', 'pharmacie,biologie-medicale,management-et-ingenierie-de-production,conseil-en-sante-publique,management-et-ingenierie-qualite-industrielle,recherche-en-sciences-de-l-univers-de-la-matiere-et-du-vivant'),
    ('charpentier', 'realisation-de-structures-metalliques,realisation-installation-d-ossatures-bois,pose-et-restauration-de-couvertures,montage-de-structures-et-de-charpentes-bois'),
    ('charpentiere', 'realisation-installation-d-ossatures-bois,montage-de-structures-et-de-charpentes-bois,realisation-de-structures-metalliques,pose-et-restauration-de-couvertures'),
    ('negociation et relation client', 'management-relation-clientele,relation-clients-banque-finance,gestion-de-clientele-bancaire,conduite-d-enquetes,conseil-et-maitrise-d-ouvrage-en-systemes-d-information,relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-aupres-de-particuliers,management-et-inspection-en-proprete-de-locaux,conseil-clientele-en-assurances,assistance-et-support-technique-client'),
    ('petite enfance', 'medecine-de-prevention,assistance-aupres-d-enfants,education-de-jeunes-enfants,soins-infirmiers-specialises-en-puericulture,danse,enseignement-des-ecoles,art-dramatique,direction-de-petite-ou-moyenne-entreprise,realisation-de-vetements-sur-mesure-ou-en-petite-serie,conception-et-dessin-produits-mecaniques'),
    ('employe commerciale', 'assistanat-commercial,personnel-d-etage,operations-administratives,distribution-de-documents,services-domestiques,gardiennage-de-locaux,poissonnerie,faconnage-et-routage,reprographie,personnel-du-hall'),
    ('employee commerciale', 'assistanat-commercial,strategie-commerciale,personnel-d-etage,operations-administratives,distribution-de-documents,relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-aupres-de-particuliers,services-domestiques,gardiennage-de-locaux,relation-commerciale-en-vente-de-vehicules'),
    ('hotesse de caisse', 'personnel-de-caisse,encadrement-du-personnel-de-caisses,service-en-restauration,accueil-et-renseignements,accueil-touristique,personnel-d-attractions-ou-de-structures-de-loisirs,navigation-commerciale-aerienne,personnel-polyvalent-en-restauration,management-en-exploitation-bancaire,assemblage-d-ouvrages-en-bois'),
    ('hote de caisse', 'personnel-de-caisse,management-d-hotel-restaurant,reception-en-hotellerie,encadrement-du-personnel-de-caisses,management-du-personnel-d-etage,management-du-service-en-restauration,assistance-de-direction-d-hotel-restaurant,conciergerie-en-hotellerie,service-en-restauration,accueil-et-renseignements'),
    ('assistant de caisse', 'decor-et-accessoires-spectacle,etudes-et-developpement-informatique,developpement-local,assistance-aupres-d-adultes,developpement-et-promotion-publicitaire,assistance-medico-technique,encadrement-du-personnel-de-caisses,management-et-ingenierie-etudes-recherche-et-developpement-industriel,intervention-technique-en-etudes-recherche-et-developpement,realisation-cinematographique-et-audiovisuelle'),
    ('assistante de caisse', 'encadrement-du-personnel-de-caisses,decor-et-accessoires-spectacle,etudes-et-developpement-informatique,developpement-local,developpement-et-promotion-publicitaire,assistance-aupres-d-adultes,assistance-medico-technique,management-et-ingenierie-etudes-recherche-et-developpement-industriel,intervention-technique-en-etudes-recherche-et-developpement,realisation-cinematographique-et-audiovisuelle'),
    ('equipier de vente', 'personnel-de-la-defense,magasinage-et-preparation-de-commandes,nettoyage-des-espaces-urbains,personnel-polyvalent-en-restauration,management-en-force-de-vente,vente-en-alimentation,vente-de-vegetaux,personnel-du-hall,vente-en-animalerie,teleconseil-et-televente'),
    ('equipiere de vente', 'personnel-de-la-defense,magasinage-et-preparation-de-commandes,nettoyage-des-espaces-urbains,management-en-force-de-vente,vente-en-alimentation,personnel-polyvalent-en-restauration,vente-de-vegetaux,vente-en-animalerie,teleconseil-et-televente,animation-de-vente'),
    ('conseiller de vente', 'vente-de-voyages,relation-commerciale-en-vente-de-vehicules,teleconseil-et-televente,transaction-immobiliere,developpement-local,developpement-des-ressources-humaines,management-et-ingenierie-methodes-et-industrialisation,defense-et-conseil-juridique,decor-et-accessoires-spectacle,developpement-personnel-et-bien-etre-de-la-personne'),
    ('conseillere de vente', 'vente-de-voyages,relation-commerciale-en-vente-de-vehicules,teleconseil-et-televente,transaction-immobiliere,management-en-force-de-vente,vente-en-alimentation,vente-en-animalerie,animation-de-vente,vente-de-vegetaux,developpement-local'),
    ('assistante de gestion', 'comptabilite,gestion-locative-immobiliere,controle-de-gestion,assistanat-en-ressources-humaines,assistanat-technique-et-administratif,management-et-gestion-de-produit,gestion-de-l-information-et-de-la-documentation,gestion-en-banque-et-assurance,management-et-gestion-d-enquetes,decor-et-accessoires-spectacle'),
    ('assistant de gestion', 'comptabilite,gestion-locative-immobiliere,controle-de-gestion,assistanat-en-ressources-humaines,assistanat-technique-et-administratif,management-et-gestion-de-produit,gestion-de-l-information-et-de-la-documentation,gestion-en-banque-et-assurance,management-et-gestion-d-enquetes,decor-et-accessoires-spectacle'),
    ('commis de cuisine', 'personnel-de-cuisine,dessin-btp,aide-et-mediation-judiciaire,vente-en-gros-de-produits-frais,plonge-en-restauration,vente-en-decoration-et-equipement-du-foyer,service-en-restauration,bucheronnage-et-elagage,sommellerie,personnel-d-etage'),
    ('aide cuisinier', 'personnel-de-cuisine,management-du-personnel-de-cuisine,preparation-de-matieres-et-produits-industriels-broyage-melange,aide-d-elevage-agricole-et-aquacole,aide-aux-soins-animaux,demenagement,boucherie,gestion-en-banque-et-assurance,boulangerie-viennoiserie,magasinage-et-preparation-de-commandes'),
    ('assistant comptable', 'comptabilite,assistanat-commercial,communication,marketing,prise-de-son-et-sonorisation,coordination-d-edition,mesures-topographiques,sante-animale,pharmacie,regie-generale'),
    ('assistante comptable', 'comptabilite,audit-et-controle-comptables-et-financiers,secretariat-comptable,management-de-groupe-ou-de-service-comptable,assistanat-commercial,communication,marketing,prise-de-son-et-sonorisation,coordination-d-edition,mesures-topographiques'),
    ('aide comptable', 'comptabilite,audit-et-controle-comptables-et-financiers,secretariat-comptable,management-de-groupe-ou-de-service-comptable,aide-aux-soins-animaux,demenagement,boucherie,aide-d-elevage-agricole-et-aquacole,direction-administrative-et-financiere,aide-agricole-de-production-legumiere-ou-vegetale'),
    ('assistant RH', 'assistanat-commercial,comptabilite,communication,marketing,prise-de-son-et-sonorisation,coordination-d-edition,mesures-topographiques,coiffure,photographie,danse'),
    ('assistante RH', 'assistanat-commercial,comptabilite,communication,marketing,prise-de-son-et-sonorisation,coordination-d-edition,mesures-topographiques,coiffure,photographie,danse'),
    ('assistant ressources humaines', 'assistanat-en-ressources-humaines,developpement-des-ressources-humaines,management-des-ressources-humaines,formation-professionnelle,conseil-et-maitrise-d-ouvrage-en-systemes-d-information,assistanat-commercial,comptabilite,communication,marketing,prise-de-son-et-sonorisation'),
    ('assistante ressources humaines', 'assistanat-en-ressources-humaines,developpement-des-ressources-humaines,management-des-ressources-humaines,formation-professionnelle,conseil-et-maitrise-d-ouvrage-en-systemes-d-information,assistanat-commercial,comptabilite,communication,marketing,prise-de-son-et-sonorisation'),
    ('secretaire medicale', 'secretariat-et-assistanat-medical-ou-medico-social,secretariat,biologie-medicale,assistanat-technique-et-administratif,conseil-en-information-medicale,imagerie-medicale,journalisme-et-information-media,assistanat-de-direction,secretariat-comptable,assistanat-commercial'),
    ('estheticien', 'soins-esthetiques-et-corporels'),
    ('estheticienne', 'soins-esthetiques-et-corporels'),
    ('agent de service', 'magasinage-et-preparation-de-commandes,services-domestiques,personnel-polyvalent-des-services-hospitaliers,securite-et-surveillance-privees,conseil-en-services-funeraires,distribution-de-documents,exploitation-des-pistes-aeroportuaires,gardiennage-de-locaux,developpement-local,management-de-groupe-ou-de-service-comptable'),
    ('agente de service', 'magasinage-et-preparation-de-commandes,services-domestiques,personnel-polyvalent-des-services-hospitaliers,securite-et-surveillance-privees,conseil-en-services-funeraires,distribution-de-documents,exploitation-des-pistes-aeroportuaires,management-de-groupe-ou-de-service-comptable,gardiennage-de-locaux,developpement-local'),
    ('employe', 'personnel-d-etage,operations-administratives,distribution-de-documents,poissonnerie,faconnage-et-routage,reprographie,personnel-du-hall,accueil-et-renseignements,services-domestiques,gardiennage-de-locaux'),
    ('employee', 'personnel-d-etage,operations-administratives,distribution-de-documents,poissonnerie,faconnage-et-routage,reprographie,personnel-du-hall,accueil-et-renseignements,services-domestiques,gardiennage-de-locaux'),
    ('charge de clientele', 'relation-clients-banque-finance,gestion-de-clientele-bancaire,management-relation-clientele,conseil-clientele-en-assurances,gestion-locative-immobiliere,gerance-immobiliere,manutention-manuelle-de-charges,management-et-inspection-en-proprete-de-locaux,accueil-et-services-bancaires,conduite-d-engins-de-deplacement-des-charges'),
    ('chargee de clientele', 'relation-clients-banque-finance,gestion-de-clientele-bancaire,management-relation-clientele,conseil-clientele-en-assurances,gestion-locative-immobiliere,gerance-immobiliere,management-et-inspection-en-proprete-de-locaux,accueil-et-services-bancaires,developpement-et-promotion-publicitaire,etudes-et-developpement-informatique'),
    ('attache commercial', 'assistanat-commercial,transaction-immobiliere,relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-en-vente-de-vehicules,relation-technico-commerciale,relation-commerciale-aupres-de-particuliers,relation-clients-banque-finance,communication,assistanat-de-direction,etudes-et-prospectives-socio-economiques'),
    ('attachee commercial', 'assistanat-commercial,transaction-immobiliere,relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-en-vente-de-vehicules,relation-technico-commerciale,relation-commerciale-aupres-de-particuliers,relation-clients-banque-finance,strategie-commerciale,communication,assistanat-de-direction'),
    ('electronique', 'installation-et-maintenance-electronique,montage-et-cablage-electronique,conception-et-dessin-de-produits-electriques-et-electroniques,conduite-d-installation-automatisee-de-production-electrique-electronique-et-microelectronique,montage-de-produits-electriques-et-electroniques,intervention-technique-en-controle-essai-qualite-en-electricite-et-electronique,encadrement-de-production-de-materiel-electrique-et-electronique,intervention-technique-en-etudes-et-developpement-electronique,management-et-ingenierie-de-production,redaction-technique'),
    ('electronicien', 'personnel-de-la-defense,management-et-ingenierie-de-production,installation-et-maintenance-electronique,montage-et-cablage-electronique,installation-et-maintenance-telecoms-et-courants-faibles,management-et-ingenierie-etudes-recherche-et-developpement-industriel,intervention-technique-en-etudes-et-developpement-electronique,recherche-en-sciences-de-l-univers-de-la-matiere-et-du-vivant,pilotage-et-navigation-technique-aerienne,management-et-ingenierie-de-maintenance-industrielle'),
    ('electronicienne', 'personnel-de-la-defense,management-et-ingenierie-de-production,installation-et-maintenance-electronique,montage-et-cablage-electronique,installation-et-maintenance-telecoms-et-courants-faibles,management-et-ingenierie-etudes-recherche-et-developpement-industriel,intervention-technique-en-etudes-et-developpement-electronique,recherche-en-sciences-de-l-univers-de-la-matiere-et-du-vivant,pilotage-et-navigation-technique-aerienne,management-et-ingenierie-de-maintenance-industrielle'),
    ('technicien', 'imagerie-medicale,coiffure,information-meteorologique,electricite-batiment,decor-et-accessoires-spectacle,reprographie,mesures-topographiques,orientation-scolaire-et-professionnelle,etudes-geologiques,maintenance-electrique'),
    ('technicienne', 'imagerie-medicale,coiffure,information-meteorologique,electricite-batiment,decor-et-accessoires-spectacle,reprographie,mesures-topographiques,orientation-scolaire-et-professionnelle,marchandisage,prise-de-son-et-sonorisation'),
    ('ressources humaines', 'developpement-des-ressources-humaines,management-des-ressources-humaines,animation-de-site-multimedia'),
    ('communication','animation-de-site-multimedia,communication,conception-de-contenus-multimedias,journalisme-et-information-media'),
    ('marketing','etudes-et-prospectives-socio-economiques,marketing,management-et-gestion-de-produit'),
    ('assitant manager','assistanat-de-direction,assistanat-commercial,comptabilite,assistance-de-direction-d-hotel-restaurant'),
    ('bts muc','encadrement-du-personnel-de-caisses,assistanat-commercial,relation-commerciale-aupres-de-particuliers,management-de-departement-en-grande-ditribution,relation-commerciale-grands-comptes-et-entreprises,accueil-et-services-bancaires,relation-commerciale-en-vente-de-vehicules,relation-technico-commerciale,transaction-immobiliere,strategie-commerciale,administration-des-ventes,management-relation-clientele,marketing,management-en-force-de-vente,management-gestion-de-rayon-produits-alimentaires,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,vente-en-articles-de-sport-et-loisirs,vente-en-alimentation,animation-de-vente'),
    ('bts management des unites commerciales','encadrement-du-personnel-de-caisses,assistanat-commercial,relation-commerciale-aupres-de-particuliers,management-de-departement-en-grande-ditribution,relation-commerciale-grands-comptes-et-entreprises,accueil-et-services-bancaires,relation-commerciale-en-vente-de-vehicules,relation-technico-commerciale,transaction-immobiliere,strategie-commerciale,administration-des-ventes,management-relation-clientele,marketing,management-en-force-de-vente,management-gestion-de-rayon-produits-alimentaires,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,vente-en-articles-de-sport-et-loisirs,vente-en-alimentation,animation-de-vente'),
    ('bts nrc','teleconseil-et-televente,relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-aupres-de-particuliers,assistanat-commercial,conseil-clientele-en-assurances,accueil-et-services-bancaires,relation-commerciale-en-vente-de-vehicules,relation-technico-commerciale,conseil-clientele-en-assurances,transaction-immobiliere,strategie-commerciale,administration-des-ventes,management-relation-clientele,marketing,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,vente-en-articles-de-sport-et-loisirs,animation-de-vente,relation-technico-commerciale'),
    ('bts negociation relation client','teleconseil-et-televente,relation-commerciale-grands-comptes-et-entreprises,relation-commerciale-aupres-de-particuliers,assistanat-commercial,conseil-clientele-en-assurances,accueil-et-services-bancaires,relation-commerciale-en-vente-de-vehicules,relation-technico-commerciale,conseil-clientele-en-assurances,transaction-immobiliere,strategie-commerciale,administration-des-ventes,management-relation-clientele,marketing,vente-en-habillement-et-accessoires-de-la-personne,vente-en-decoration-et-equipement-du-foyer,vente-en-articles-de-sport-et-loisirs,animation-de-vente,relation-technico-commerciale'),
    ('cqp employe de commerce','mise-en-rayon-libre-service,personnel-de-caisse'),
    ('rh','assistanat-en-ressources-humaines,developpement-des-ressources-humaines,management-des-ressources-humaines'),
]



SITEMAP_BEGIN = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
SITEMAP_END = '</urlset>\n'
URL_TEMPLATE = '<url><loc>{}</loc><lastmod>{}</lastmod></url>\n'
SEARCH_URL_TEMPLATE = 'https://labonnealternance.pole-emploi.fr/entreprises/{}/{}/{}'


def extract_job_slug():
    """
    Helper to extract all slugs associated to a given term
    """
    for index, job in enumerate(JOBS):
        if index % 5 == 0:
            time.sleep(2)

        term = job[0]
        url = LBB_ROME_URL.format(LBB_URL, parse.quote(term))
        response = request.urlopen(url).read()
        slug_suggestions = json.loads(response.decode('utf-8'))

        occupations = [slug.get('occupation') for slug in slug_suggestions]


def create_sitemap():
    now = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")

    # Generate URLs
    urls = [
        'https://labonnealternance.pole-emploi.fr/',
        'https://labonnealternance.pole-emploi.fr/faq',
        'https://labonnealternance.pole-emploi.fr/conditions-generales-utilisation',
        'https://labonnealternance.pole-emploi.fr/qui-sommes-nous',
        'https://labonnealternance.pole-emploi.fr/recherche',
    ]
    for city in CITIES:
        check_city_slug(city)

        for job in JOBS:
            check_jobs_slug(job[1], job[0])

            encoded_job = parse.quote(job[0])
            urls.append(SEARCH_URL_TEMPLATE.format(job[1], city, encoded_job))

    # Generate sitemap content
    sitemap_content = SITEMAP_BEGIN
    for url in urls:
        sitemap_content = '{}{}'.format(sitemap_content, URL_TEMPLATE.format(url, now))
    sitemap_content = '{}{}'.format(sitemap_content, SITEMAP_END)

    # Write in sitemap.xml file
    sitemap_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), "./frontend/public/static/sitemap.xml")
    with open(sitemap_file, "w") as f:
        f.write(sitemap_content)

    print('Create sitemap.xml with {} urls ({} cities and {} jobs)'.format(len(urls), len(CITIES), len(JOBS)))


def check_city_slug(city_slug):
    if not bool(re.match(CITY_SLUG_REGEX, city_slug)):
        raise InvalidCitySlug('Invalid city slug: {}'.format(city_slug))
    return True

def check_jobs_slug(jobs_slug, job):
    if not bool(re.match(JOBS_SLUG_REGEX, jobs_slug)):
        raise InvalidJobsSlug('Invalid jobs slug: {}'.format(job))
    return True

if __name__ == "__main__":
    create_sitemap()
    # extract_job_slug()
