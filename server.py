from flask import Flask, render_template, request, flash, redirect, session, jsonify
import requests
from jinja2 import StrictUndefined
from model import connect_db, db, Song, User, Annotation, seed_data
import webscrape
import genius_hits

from bs4 import BeautifulSoup
import requests
# to access api key
import os


app = Flask(__name__)
app.secret_key = 'yliwmhd'

app.jinja_env.undefined = StrictUndefined

GENIUS_TOKEN = os.environ.get('TOKEN')
GENIUS_URL = "https://api.genius.com/"


@app.route("/")
def homepage():

    if not session.get('current_user'):
        return redirect('/user-reg')

    return render_template("reacthits.html")

@app.route("/search")
def search_hits():
    '''Returns search results for a query'''
    search = request.args.get('q')
    search_dict = genius_hits.search(search)

    return jsonify(search_dict)
    

@app.route("/song-data")
def song_data():
    '''Get the song data for a selected song'''
    song_artist = request.args.get('song_artist')
    song_title = request.args.get('song_title')

    q_song = db.session.query(Song).filter(Song.song_artist==song_artist, Song.song_title==song_title).first()

    if q_song:
        song_annos = []
        for annotation in q_song.annotations:
            song_annos.append({'anno_id': annotation.anno_id, 
                                'song_fragment': annotation.song_fragment,
                                'annotation': annotation.annotation, 
                                'user.name': annotation.user.name
                                })

        results = {
                    'song_title': q_song.song_title,
                    'song_artist': q_song.song_artist,
                    'lyrics': q_song.lyrics,
                    'video_url': q_song.video_url,
                    'song_annos': song_annos
        }
        return jsonify(results)

    # perform scrape if song not in database
    search_dict = webscrape.get_lyrics(f'{song_artist} {song_title}')

    # query for annotations of searched songs already in database
    q_annotations = db.session.query(Annotation.anno_id, Annotation.song_fragment, 
                                    Annotation.annotation).filter(Song.song_title==search_dict['song_title'],
                                    Song.song_artist==search_dict['song_artist']).join(Song).all()

    # add a key-value pair for the search list
    song_annos = []
    if q_annotations:
        for annotation in q_annotations:
            anno_id = Annotation.query.get(annotation[0])
            song_annos.append({'anno_id': annotation[0], 
            'song_fragment': annotation[1],
            'annotation': annotation[2], 
            'user.name': anno_id.user.name
            })

    search_dict['song_annos'] = song_annos

    return jsonify(search_dict)


@app.route("/annotated-songs")
def annotated_songs():
    '''Get list of annotated songs'''
    allsongs = []
    songs = db.session.query(Song).join(Annotation).all()
    if songs:
        for song in songs:
            allsongs.append({
                                'song_title': song.song_title,
                                'song_artist': song.song_artist
                                })
    return jsonify(allsongs)


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

    session['current_user'] = new_user.user_id
    print(session['current_user'])

    return redirect("/")


@app.route("/save", methods=['POST'])
def save():
    '''Save a new annotation to database'''
    if not session.get('current_user'):
        flash('Please sign-in')
        return redirect('/user-reg')

    annotation = request.form["annotation"]
    fragment = request.form["fragment"]
    song_title = request.form["song_title"]
    song_artist = request.form["song_artist"]
    lyrics = request.form["lyrics"]
    video_url = request.form["video_url"]

    new_annotation = Annotation(annotation=annotation, 
                                song_fragment=fragment)

    q_song = Song.query.filter(Song.song_title==song_title,
                                Song.song_artist==song_artist).first()
    if q_song:
        new_song = q_song
    else:
        new_song = Song(song_title=song_title,
                        song_artist=song_artist,
                        lyrics=lyrics,
                        video_url=video_url)

    q = User.query.get(session['current_user'])
    q.annotations.append(new_annotation)
    new_song.annotations.append(new_annotation)

    db.session.add(new_song)
    db.session.add(new_annotation)
    db.session.commit()

@app.route("/account")
def account():
    '''Get account information and annotations'''
    user = User.query.get(session['current_user'])
    annotations = user.annotations
    anno_list = []
    for annotation in annotations:
        anno_list.append({
                        'anno_id': annotation.anno_id,
                        'song_artist': annotation.song.song_artist,
                        'song_title': annotation.song.song_title,
                        'song_fragment':annotation.song_fragment,
                        'annotation':annotation.annotation
                        })
    return jsonify({'user_name': user.name,
                    'user_email': user.email,
                    'anno_list': anno_list})

@app.route("/delete-annotation/<anno_id>", methods=['DELETE'])
def user_annos_delete(anno_id):
    annotation = Annotation.query.get(anno_id)
    print(anno_id, annotation)
    db.session.delete(annotation)
    db.session.commit()

if __name__ == "__main__":
    connect_db(app)
    db.create_all()
    
    app.run(host="0.0.0.0", debug=True)