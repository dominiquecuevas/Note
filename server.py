from flask import Flask, render_template, request, flash, redirect, session
import requests
from jinja2 import StrictUndefined
from model import connect_db, db, Song, User, Annotation, seed_data
import requests
# Scraper no scraping
from bs4 import BeautifulSoup
# to access api key
import os


app = Flask(__name__)
app.secret_key = 'sekrit'

app.jinja_env.undefined = StrictUndefined

GENIUS_TOKEN = os.environ.get('TOKEN')
# GENIUS_URL = "http://104.17.212.67/"
GENIUS_URL = "https://api.genius.com/"


@app.route("/")
def homepage():
    return render_template("index.html")

@app.route("/results")
def api_scrape():

    search = request.args.get('api')

    payload = {'access_token' : GENIUS_TOKEN,
                'q': search}
    url = GENIUS_URL + "search"
    # print(url)
    response = requests.get(url, params=payload)

    # print(response.content)
    data = response.json()

    title = data['response']['hits'][0]['result']['full_title']
    lyrics_url = data['response']['hits'][0]['result']['url']

    # web scraping
    page = requests.get(lyrics_url)
    # make Beautiful Soup elements from DOM
    soup = BeautifulSoup(page.text, 'html.parser')
    # from the webpage, get back the html element with the 'lyrics' class
    lyrics = soup.find(class_='lyrics')
    # lyrics as string with \n
    lyrics_str = lyrics.get_text()
    # replaced python's \n to html <br>, still in quotes
    # lyrics_html = lyrics_str.replace('\n','<br>')

    return render_template("results.html", title=title, lyrics=lyrics_str)


@app.route("/test-query")
def test_query():
    """test queries"""

    q = db.session.query(Annotation).filter(Annotation.user_id==1).all()

    return render_template("test-query.html",
                            q=q)

@app.route("/test-input", methods=['POST'])
def test_input():
    """Testing get user input and save to database"""

    annotation = request.form["annotation"]
    fragment = request.form["fragment"]

    # hard code values right now
    user_id = 1
    song_id = 2

    new_annotation = Annotation(annotation=annotation, song_fragment=fragment, 
                            user_id=user_id,
                            song_id=song_id)

    db.session.add(new_annotation)
    db.session.commit()

    # flash message did not work
    flash(f"Annotation {annotation} added.")

    return redirect("/test-query")

# @app.route("/anno-form")
# def annoform():

#     annotation = request.args.get("annotation")
#     return render_template("anno_input.html")


# @app.route("/add-anno", methods=["POST"])
# def addanno():

#     annotation = request.form.get("annotation")

#     return render_template("user_annotations.html",
#                             annotation = annotation)


if __name__ == "__main__":
    connect_db(app)
    
    app.run(host="0.0.0.0", debug=True)