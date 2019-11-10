from flask import Flask, render_template, request, flash, redirect, session
import requests
from jinja2 import StrictUndefined
from model import connect_db, db, Song, User, Annotation, seed_data

# Scraper no scraping
from bs4 import BeautifulSoup
import requests
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

    if not session.get('current_user'):
        return redirect("/user-reg")

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

    song_title = data['response']['hits'][0]['result']['title']
    artist = data['response']['hits'][0]['result']['primary_artist']['name']
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
    lyrics_html = lyrics_str.replace('\n','<br>')

    return render_template("results.html", 
                            song_title=song_title,
                            artist=artist,
                            lyrics_html=lyrics_html)

@app.route("/user-reg")
def user():

    return render_template("/user.html")

@app.route("/user", methods=['POST'])
def user_session():

    name = request.form["name"]
    email = request.form["email"]

    new_user = User(email=email, name=name)
    db.session.add(new_user)
    db.session.commit()

    # made session the user_id since the User object by itself cannot be sessioned
    session['current_user'] = new_user.user_id
    print(session['current_user'])

    return redirect("/")


@app.route("/save", methods=['POST'])
def save():
    """Testing get user input and save to database"""

    annotation = request.form["annotation"]
    fragment = request.form["fragment"]

    # hard code values right now
    user_id = 1
    song_id = 2

    new_annotation = Annotation(annotation=annotation, 
                                song_fragment=fragment,
                                song_id=song_id)

    q = User.query.get(session['current_user'])
    q.annotations.append(new_annotation)
    db.session.add(new_annotation)
    db.session.commit()

    annotations = User.query.get(session['current_user']).annotations

    return render_template("user_annotations.html",
                            annotations=annotations)


@app.route("/user-annos")
def user_annos():

    return render_template("user_annotations.html")


@app.route("/test-query")
def test_query():
    """test queries"""

    q = db.session.query(Annotation).filter(Annotation.user_id==1).all()

    return render_template("test-query.html",
                            q=q)

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