def validate_siret(siret):
    return len(siret) == 14 and siret.isdigit()