import requests
from bs4 import BeautifulSoup
import os

GENIUS_TOKEN = os.environ.get('TOKEN')
GENIUS_URL = "https://api.genius.com/"

def search(q):

    payload = {'access_token' : GENIUS_TOKEN,
                'q': q}
    url = GENIUS_URL + "search"
    
    response = requests.get(url, params=payload)

    data = response.json()

    # list of songs
    hit_results = data['response']['hits']

    songs = []
    for hit in hit_results:
        songs.append({
            'song_title': hit['result']['title'],
            'song_artist': hit['result']['primary_artist']['name']
            })

    return {'songs': songs}