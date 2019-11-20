import requests
from bs4 import BeautifulSoup
import os

GENIUS_TOKEN = os.environ.get('TOKEN')
GENIUS_URL = "https://api.genius.com/"

def search(q):
    # search = request.args.get('q') # 'q' from index.html form input

    payload = {'access_token' : GENIUS_TOKEN,
                'q': q}
    url = GENIUS_URL + "search"
    # print(url)
    response = requests.get(url, params=payload)

    # print(response.content)
    data = response.json()

    # go to search api > songs api > youtube video
    song_title = data['response']['hits'][0]['result']['title']
    artist = data['response']['hits'][0]['result']['primary_artist']['name']
    lyrics_url = data['response']['hits'][0]['result']['url']
    # session['song_title'] = song_title
    # session['song_artist'] = artist

    api_song = data['response']['hits'][0]['result']['api_path']

    payload_song = {'access_token : GENIUS_TOKEN'}
    url_song = GENIUS_URL + api_song.lstrip('/') # get rid of second slash
    response_song = requests.get(url_song, params=payload)
    data_song = response_song.json()

    # video_url = data_song['response']['song']['media'][0]['url']
    # session['video_url'] = video_url

    media_list = data_song['response']['song']['media']
    for idx, media in enumerate(media_list):
        if media['provider']=="youtube":
            # session['video_url'] = media_list[idx]['url']
            video_url = media_list[idx]['url'].replace("http://www.youtube.com/watch?v=","")

    # web scraping
    page = requests.get(lyrics_url)
    # make Beautiful Soup elements from DOM
    soup = BeautifulSoup(page.text, 'html.parser')
    # from the webpage, get back the html element with the 'lyrics' class
    lyrics = soup.find(class_='lyrics')
    # lyrics as string with \n
    lyrics_str = lyrics.get_text()
    # replaced python's \n to html <br>, still in quotes
    lyrics_html = lyrics_str.replace('\n','<br>')

    return {"song_title": song_title,
            "song_artist": artist,
            "lyrics": lyrics_html,
            "video_url": video_url}