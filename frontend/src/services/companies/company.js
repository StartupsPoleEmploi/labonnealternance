export const CompanyType = {
    OFFER: 'OFFER',
    DPAE: 'DPAE',
    ALTERNANCE: 'ALTERNANCE',
};

export class Company {
    constructor(siret, job, label, longitude, latitude, city, distance, nafSection, nafText, headcount, offers) {
        // FIXME: validate input data
        this.siret = siret;
        this.job = job; // Job(rome+label) associated to the company
        this.label = label;
        this.longitude = longitude;
        this.latitude = latitude;
        this.city = city;
        this.distance = distance;
        this.nafSection = nafSection;
        this.nafText = nafText;
        this.headcount = headcount;
        this.offers = offers;

        // Should be display in Front (meaning not filtered)
        this.visible = true;
    }


    copy() {
        // FIXME: headcount, offers and alternance are also part of the constructor args
        let copy = new Company(this.siret, this.job, this.label, this.longitude, this.latitude, this.city, this.distance, this.nafSection, this.nafText);
        copy.officeName =  this.officeName;
        copy.headcount = this.headcount;
        copy.softSkills = this.softSkills;
        copy.address = this.address;
        copy.email = this.email;
        copy.phone = this.phone;
        copy.headcount = this.headcount;
        copy.offers = this.offers;
        copy.alternance = this.alternance;

        copy.website = this.website;

        copy.visible = this.visible;

        return copy;
    }

    isVisible(isVisible) {
        this.isVisible = isVisible;
    }

    hasSoftSkills() { return this.softSkills !== undefined; }
    hasExtraInfos() {
        return this.address !== undefined || this.email !== undefined || this.phone !== undefined || this.website !== undefined || this.officeName !== undefined;
    }

    setExtraInfos(address, email, phone, officeName, website, alternance) {
        // FIXME: we need to check input data, e.g. if alternance is defined
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.officeName = officeName || ''; // French equivalent : Enseigne
        this.website = website;
        this.alternance = alternance;
    }

    setSoftSkills(softSkills) {
        this.softSkills = softSkills;
    }
    getType() {
      return this.offers && this.offers.length ? CompanyType.OFFER : this.alternance ? CompanyType.ALTERNANCE : CompanyType.DPAE;
    }
}
