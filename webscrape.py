import requests
from bs4 import BeautifulSoup
import os

GENIUS_TOKEN = os.environ.get('TOKEN')
GENIUS_URL = "https://api.genius.com/"

def get_lyrics(q):
    payload = {'access_token' : GENIUS_TOKEN,
                'q': q}
    url = GENIUS_URL + "search"
    response = requests.get(url, params=payload)
    data = response.json()
    song_title = data['response']['hits'][0]['result']['title']
    artist = data['response']['hits'][0]['result']['primary_artist']['name']
    lyrics_url = data['response']['hits'][0]['result']['url']
    api_song = data['response']['hits'][0]['result']['api_path']

    payload_song = {'access_token : GENIUS_TOKEN'}
    url_song = GENIUS_URL + api_song.lstrip('/') # get rid of second slash
    response_song = requests.get(url_song, params=payload)
    data_song = response_song.json()

    media_list = data_song['response']['song']['media']
    for idx, media in enumerate(media_list):
        if media['provider']=="youtube":
            video_url = media_list[idx]['url'].replace("http://www.youtube.com/watch?v=","")

    page = requests.get(lyrics_url)
    soup = BeautifulSoup(page.text, 'html.parser')
    lyrics = soup.find(class_='lyrics')
    lyrics_str = lyrics.get_text()
    lyrics_html = lyrics_str.replace('\n','<br>')

    return {"song_title": song_title,
            "song_artist": artist,
            "lyrics": lyrics_html,
            "video_url": video_url}