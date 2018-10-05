import csv, os

MAX_CELL_INDEX = 3*20+1 # Maximum 20 groups of 3 values (rome,slug,label)
HEADER_KEYWORD = "MOT SEARCH"

class CustomSearchJob(object):

    def __init__(self):
        self.custom_search_jobs = dict()

        # Populate the list from the csv file
        current_path = os.path.dirname(os.path.abspath(__file__))
        file_path = '{}/custom_search_jobs_results.csv'.format(current_path)

        with open(file_path, 'r') as csvfile:
            # Note: we use US separator ',' instead of the european one ';'
            csv_content = csv.reader(csvfile, delimiter=',', quotechar='|')
            for line in csv_content:
                # Ignore CSV headers
                if line[0] == HEADER_KEYWORD:
                    continue
                self.compute_line(line)


    def compute_line(self, line):
        results = list()
        for i in range(1, len(line) - 4, 3):
            if line[i] == '':
                break # no more values

            results.append({
                'id': line[i],
                'label': line[i+1],
                'occupation': line[i+2],
            })

        word = line[0].lower()
        self.custom_search_jobs[word] = results


    def get_entry(self, text):
        return self.custom_search_jobs.get(text.lower(), '')
