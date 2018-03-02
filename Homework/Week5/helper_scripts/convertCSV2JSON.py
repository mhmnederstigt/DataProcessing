#!/usr/bin/env python
# Name:	Milou Nederstigt
# Student number: 11022914

"""
This script outputs a JSON file with the content of a csv.
Resulting in: arrayofarrays[row][col]
"""
import csv
import json

with open('KNMI_20180227_edited.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	data = []
	for row in reader:
		data.append({'FG': row['FG'], 'FHX': row['FHX'], 'FHN': row['FHN']})

with open('result.json', 'w') as output:
    json.dump(data, output)