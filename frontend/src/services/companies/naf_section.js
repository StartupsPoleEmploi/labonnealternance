export const nafSections = new Map();
nafSections.set('A', 'Agriculture, sylviculture et pêche');
nafSections.set('B', 'Industries extractives');
nafSections.set('C', 'Industrie manufacturière');
nafSections.set('D', 'Production et distribution d\'électricité, de gaz, de vapeur et d\'air conditionné');
nafSections.set('E', 'Production et distribution d\'eau ; assainissement, gestion des déchets et dépollution');
nafSections.set('F', 'Construction');
nafSections.set('G', 'Commerce, réparation d\'automobiles et de motocycles');
nafSections.set('H', 'Transports et entreposage');
nafSections.set('I', 'Hébergement et restauration');
nafSections.set('J', 'Information et communication');
nafSections.set('K', 'Activités financières et d\'assurance');
nafSections.set('L', 'Activités immobilières');
nafSections.set('M', 'Activités spécialisées, scientifiques et techniques');
nafSections.set('N', 'Activités de services administratifs et de soutien');
nafSections.set('O', 'Administration publique');
nafSections.set('P', 'Enseignement');
nafSections.set('Q', 'Santé humaine et action sociale');
nafSections.set('R', 'Arts, spectacles et activités récréatives');
nafSections.set('S', 'Autres activités de services');
nafSections.set('T', 'Activités des ménages en tant qu\'employeurs ; activités indifférenciées des ménages en tant que producteurs de biens et services pour usage propre');
nafSections.set('U', 'Activités extra-territoriales');


const A_NUMBERS = ['01','02','03'];
const B_NUMBERS = ['05','06','07','08','09'];
const C_NUMBERS = ['10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33'];
const D_NUMBERS = ['35'];
const E_NUMBERS = ['36','37','38','39'];
const F_NUMBERS = ['41','42','43'];
const G_NUMBERS = ['45','46','47'];
const H_NUMBERS = ['49','50','51','52','53'];
const I_NUMBERS = ['55','56'];
const J_NUMBERS = ['58','59','60','61','62','63'];
const K_NUMBERS = ['64','65','66'];
const L_NUMBERS = ['68'];
const M_NUMBERS = ['69','70','71','72','73','74','75'];
const N_NUMBERS = ['77','78','79','80','81','82'];
const O_NUMBERS = ['84'];
const P_NUMBERS = ['85'];
const Q_NUMBERS = ['86','87','88'];
const R_NUMBERS = ['90','91','92','93'];
const S_NUMBERS = ['94','95','96'];
const T_NUMBERS = ['97','98'];
const U_NUMBERS = ['99'];

export function getNafSessionLabel(letter) {
    return nafSections.get(letter);
}

export function determineNafSection(naf) {
    // The session can be deterline with the two first letters
    let text = naf.substring(0,2);

    if(A_NUMBERS.includes(text)) return 'A';
    if(B_NUMBERS.includes(text)) return 'B';
    if(C_NUMBERS.includes(text)) return 'C';
    if(D_NUMBERS.includes(text)) return 'D';
    if(E_NUMBERS.includes(text)) return 'E';
    if(F_NUMBERS.includes(text)) return 'F';
    if(G_NUMBERS.includes(text)) return 'G';
    if(H_NUMBERS.includes(text)) return 'H';
    if(I_NUMBERS.includes(text)) return 'I';
    if(J_NUMBERS.includes(text)) return 'J';
    if(K_NUMBERS.includes(text)) return 'K';
    if(L_NUMBERS.includes(text)) return 'L';
    if(M_NUMBERS.includes(text)) return 'M';
    if(N_NUMBERS.includes(text)) return 'N';
    if(O_NUMBERS.includes(text)) return 'O';
    if(P_NUMBERS.includes(text)) return 'P';
    if(Q_NUMBERS.includes(text)) return 'Q';
    if(R_NUMBERS.includes(text)) return 'R';
    if(S_NUMBERS.includes(text)) return 'S';
    if(T_NUMBERS.includes(text)) return 'T';
    if(U_NUMBERS.includes(text)) return 'U';

    console.error(`Cannot determine section for the text : ${text}`);
    return undefined;
}