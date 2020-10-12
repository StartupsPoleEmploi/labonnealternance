import csv

def loadMatcha(file):
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

def get_triggers_matcha(location, romes):
    city = [obj for obj in MATCHA if obj in location.lower()]
    if(len(city) > 0):
        city_romes = MATCHA.get(city[0])
        found_romes = [rome for rome in city_romes if rome in romes]
        return {
            'type': 'hotjar',
            'name': 'matcha',
        }
    return None
