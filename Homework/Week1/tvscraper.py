#!/usr/bin/env python
# Name:
# Student number:
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv

from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    
    # find all data, organize in arrays per column
    title = []
    for i in dom.find_all("h3", class_="lister-item-header"):
        title.append(i.find("a").string)

    rating = []
    for i in dom.find_all("span", class_="value"):
        rating.append(i.string)
   
    genre = []
    for i in dom.find_all("span", class_="genre"):
        genre.append(i.string.strip())
    
    actors = []
    for actormovie in dom.find_all("div", class_="lister-item-content"):
            actorind = actormovie.find_all("p")
            actorind2 = actorind[2].find_all("a")
            actorlist = []
            for actor in actorind2:
                 actorlist.append(actor.string)
            actorlist2 = actorlist[0] + ', ' + actorlist[1] + ', ' + actorlist[2] + ', ' + actorlist[3] 
            actors.append(actorlist2)

    runtime = [] 
    for i in dom.find_all("span", class_="runtime"):
        runtime.append(re.findall('\d+', i.string)[0])

    for i in runtime:
        i = int(i)    

    # loop over the matrix to fill with the data
    tvseries = [title, rating, genre, actors, runtime]
    print(tvseries)
 
    return tvseries   

def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
 
    for i in range(0, len(tvseries[0])):
       writer.writerow([tvseries[0][i], tvseries[1][i], tvseries[2][i], tvseries[3][i], tvseries[4][i]])
    
def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')
     
    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)

  