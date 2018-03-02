#!/usr/bin/env python
# Name:	Milou Nederstigt
# Student number: 11022914

"""
This script outputs a JSON file with the content of a csv.
Resulting in: arrayofarrays[row][col]
"""
import csv
import json

with open('testfilecsv.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	data = []
	for row in reader:
		data.append({'Rain': row['Rain'], 'Month': row['Month']})
	print(data)

with open('result.json', 'w') as output:
    json.dump(data, output)