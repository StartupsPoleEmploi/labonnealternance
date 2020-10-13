import csv

def loadMatcha(file):
    """
    This function is called at startup
    It returns a dict of lists, one list per city, each containing the ROME codes associated with the city
    """
    result = {}
    with open(file, newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in reader:
            [city, rome] = row
            city_low = city.lower()
            city_romes = result.get(city_low, [])
            city_romes.append(rome)
            result[city_low] = city_romes
    return result

MATCHA = loadMatcha('labonnealternance/api/triggers/matcha.csv')

def get_triggers_matcha(GET):
    """
    Called on the triggers/ API route
    It checks wether there is a trigger in the CSV file provided by matcha
    @param GET django.http.QueryDict object containing the request GET params
    @see https://docs.djangoproject.com/en/3.1/ref/request-response/#django.http.QueryDict
    """
    location = GET.get('location')
    romes = GET.getlist('romes')
    city = [obj for obj in MATCHA if obj in location.lower()]
    if(len(city) > 0):
        city_romes = MATCHA.get(city[0])
        found_romes = [rome for rome in city_romes if rome in romes]
        return {
            'type': 'hotjar',
            'name': 'matcha',
        }
    return None
