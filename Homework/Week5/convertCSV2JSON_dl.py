#!/usr/bin/env python
# Name:	Milou Nederstigt
# Student number: 11022914

"""
This script outputs a JSON file with the content of a csv.
Converts a CSV file with three variables to a JSON file containing a dictioniary with three lists (one per variable).
"""

import csv
import json
import sys

if len (sys.argv) != 2 :
    print("Usage: convertCSV2JSON.py inputfile.csv")
    sys.exit (1)

else:
	inputfile = sys.argv[1]
	if not inputfile.endswith('.csv'):
		print("Usage: convertCSV2JSON.py inputfile.csv")
		sys.exit (1)

	outputfile = inputfile.replace(".csv",".json")

	with open(inputfile) as csvfile:
		reader = csv.DictReader(csvfile)
		x = []
		y = []
		z = []
		dl = []


		for row in reader:
			x.append(row[list(row.keys())[0]])
			y.append(row[list(row.keys())[1]])
			y.append(row[list(row.keys())[2]])

		dl.append({list(row.keys())[0]: x, list(row.keys())[1]: y, list(row.keys())[2]: z})
					
	with open(outputfile, 'w') as output:
   		json.dump(dl, output)
