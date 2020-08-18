export class Company {
    constructor(siret, job, label, longitude, latitude, city, distance, nafSection, nafText, headcount, offers, flag_alternance) {
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
        this.flag_alternance = flag_alternance;

        // Should be display in Front (meaning not filtered)
        this.visible = true;
    }


    copy() {
        // FIXME: headcount, offers and flag_alternance are also part of the constructor args
        let copy = new Company(this.siret, this.job, this.label, this.longitude, this.latitude, this.city, this.distance, this.nafSection, this.nafText);

        copy.officeName =  this.officeName;
        copy.headcount = this.headcount;
        copy.softSkills = this.softSkills;
        copy.address = this.address;
        copy.email = this.email;
        copy.phone = this.phone;
        copy.headcount = this.headcount;
        copy.offers = this.offers;
        copy.flag_alternance = this.flag_alternance;

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

    setExtraInfos(address, email, phone, officeName, website) {
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.officeName = officeName || ''; // French equivalent : Enseigne
        this.website = website;
    }

    setSoftSkills(softSkills) {
        this.softSkills = softSkills;
    }
}
