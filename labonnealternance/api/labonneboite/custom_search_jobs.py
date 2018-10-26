import csv, os, re

class CustomSearchJob(object):

    def __init__(self):
        self.load = False

    def load_csv(self):
        self.custom_search_jobs = dict()

        # Populate the list from the csv file
        current_path = os.path.dirname(os.path.abspath(__file__))
        file_path = '{}/custom_search_jobs_results.csv'.format(current_path)

        with open(file_path, 'r', encoding='utf-8') as csvfile:
            # Note: we use US separator ',' instead of the european one ';'
            csv_reader = csv.reader(csvfile, delimiter=',', quotechar='"')

            for line in csv_reader:
                word = line[0].lower()
                # New entry ?
                if not self.custom_search_jobs.get(word, None):
                    self.custom_search_jobs[word] = list()

                self.custom_search_jobs[word].append({
                    'id': line[1],
                    'label': line[2],
                    'occupation': line[3],
                })
            self.load = True

    def get_entry(self, text):
        return self.custom_search_jobs.get(text.lower(), '')
