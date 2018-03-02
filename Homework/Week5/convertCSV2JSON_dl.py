#!/usr/bin/env python
# Name:	Milou Nederstigt
# Student number: 11022914

"""
This script outputs a JSON file with the content of a csv.
Resulting in: 
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
		key1 = 'Rain'
		key2 = 'Month'
		key3 = '' 
		x = []
		y = []
		z = []

		dl = []

		for row in reader:
			x.append(row[key1])
			y.append(row[key2])	
		
		dl.append({key1: x, key2: y, key3: z})
					
	with open(outputfile, 'w') as output:
   		json.dump(dl, output)
