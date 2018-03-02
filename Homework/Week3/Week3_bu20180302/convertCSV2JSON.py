#!/usr/bin/env python
# Name:	Milou Nederstigt
# Student number: 11022914

"""
This script outputs a JSON file with the content of a csv.
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
		data = list(reader)
			
	with open(outputfile, 'w') as output:
   		json.dump(data, output)
