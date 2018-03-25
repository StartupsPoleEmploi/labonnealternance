export class Company {
    constructor(siret, job, label, longitude, latitude, city, distance, nafText, headcount) {
        this.siret = siret;
        this.job = job; // Job(rome+label) associated to the company
        this.label = label;
        this.longitude = longitude;
        this.latitude = latitude;
        this.city = city;
        this.distance = distance;
        this.nafText = nafText;
        this.headcount = headcount;


        // Should be display in Front (meaning not filtered)
        this.visible = true;
    }


    copy() {
        let copy = new Company(this.siret, this.job, this.label, this.longitude, this.latitude, this.city, this.distance, this.nafText);

        copy.officeName =  this.officeName;
        copy.headcount = this.headcount;
        copy.softSkills = this.softSkills;
        copy.address = this.address;
        copy.email = this.email;
        copy.phone = this.phone;
        copy.headcount = this.headcount;
        copy.website = this.website;

        copy.visible = this.visible;

        return copy;
    }

    isVisible(isVisible) {
        this.isVisible = isVisible;
    }

    hasSoftSkills() { return this.softSkills !== undefined; }
    hasExtraInfos() {
        return this.address !== undefined || this.email !== undefined || this.phone !== undefined || this.website !== undefined;
    }

    setExtraInfos(address, email, phone, officeName, website) {
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.officeName = officeName; // French equivalent : Enseigne
        this.website = website;
    }

    setSoftSkills(softSkills) {
        this.softSkills = softSkills;
    }
}