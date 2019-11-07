import requests
from bs4 import BeautifulSoup

# User searches for song title and artist name using Genius.com API => /search?q=
    # response[hits][0][url] for first result lyrics url
# takes text 

# Some alternate lyric pages
# page = requests.get('https://genius.com/Lil-nas-x-panini-lyrics')
# page = requests.get('https://genius.com/Monica-angel-of-mine-lyrics')
page = requests.get('https://genius.com/Queen-bohemian-rhapsody-lyrics')
# page = requests.get('https://genius.com/Queen-killer-queen-lyrics')

# make Beautiful Soup elements from DOM
soup = BeautifulSoup(page.text, 'html.parser')

# from the webpage, get back the html element with the 'lyrics' class
lyrics = soup.find(class_='lyrics')

# lyrics as string with \n
lyrics_str = lyrics.get_text()
# replaced python's \n to html <br>, still in quotes
lyrics_html = lyrics_str.replace('\n','<br>')

# replace the \n with </br> for html

##########################################

# # list of 'a' tags
# a_tag_list = lyrics.find_all('a')

# # loop over list to remove tags
# for a_tag in a_tag_list:
#     # unwrap strips the a tag and leaves its contents
#     a_tag.unwrap()

# i_tag_list = lyrics.find_all('i')

# for i_tag in i_tag_list:
#     i_tag.unwrap()

# Not sure how to remove the div and <!--sse--><!--/sse-->

# print(lyrics)
# print(lyrics.prettify())