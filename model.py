from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Song(db.Model):
    """Songs with lyrics"""

    __tablename__ = "songs"

    song_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    song_title = db.Column(db.String(120), nullable=False)
    song_artist = db.Column(db.String(120), nullable=False)
    lyrics = db.Column(db.String(10000), nullable=False)

    def __repr__(self):

        return f"<Song id={self.song_id} title='{self.song_title}' artist='{self.song_artist}'>"


class User(db.Model):
    """User table"""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):

         return f"<User id={self.user_id} email={self.email}>"


class Video(db.Model):
    """Youtube videos"""

    __tablename__ = "videos"

    video_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    url = db.Column(db.String, nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.song_id'), unique=True)

    song = db.relationship("Song",
                            backref="videos")

    def __repr__(self):

        return f"<Video id={self.video_id} url='{self.url}'>"

class Annotation(db.Model):
    """User-made annotations."""

    __tablename__ = "annotations"

    anno_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    annotation = db.Column(db.String(10000), nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.song_id'), nullable=False)
    song_fragment = db.Column(db.String(10000), nullable=False)

    user = db.relationship("User",
                            backref="annotations")

    song = db.relationship("Song",
                            backref="annotations")

    def __repr__(self):

        return f"<Annotation id={self.anno_id} fragment='{self.song_fragment}' annotation='{self.annotation}'>"


def connect_db(app):
    """Configure and connect to psql after createdb database."""

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///database'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True
    db.app = app
    db.init_app(app)

if __name__ == "__main__":

    from server import app

    connect_db(app)
    db.create_all()

    q = db.session.query

    # test creating rows with static data
    panini = Song(song_title='Panini', song_artist='Lil Nas X', lyrics='Hey, Panini..')
    sd = Song(song_title='Slow Dancing in the Dark', song_artist='Joji', lyrics='I don\'t want a friend..')
    db.session.add(panini)
    db.session.add(sd)
    # test query on song
    q_song = Song.query.filter(Song.song_artist.like('%Lil%')).all()

    nikki = User(email='nikki@gmail.com', name='Nikki')
    dominique = User(email='dominique@gmail.com', name='Dominique')
    db.session.add(nikki)
    db.session.add(dominique)
    # test query on user
    q_user = User.query.get(1)
    # test object
    o_user = nikki.email

    panini_vid = Video(url='https://www.youtube.com/watch?v=bXcSLI58-h8', song_id=1)
    db.session.add(panini_vid)
    # in terminal, test relationship btwn video and song
    # panini_vid.song.lyrics
    # test query

    panini_anno = Annotation(song_fragment='Hey, Panini don\'t you be a meanie',
                            annotation='Panini is a character from Chowder cartoon',
                            song_id=1, user_id=2)
    sd_anno = Annotation(song_fragment='When I\'m around slow dancing in the dark',
                            annotation='Something, something annotation',
                            song_id=2, user_id=1)
    db.session.add(panini_anno)
    db.session.add(sd_anno)
    # test relationship - Annotations has relationship with Song that has relationship with Video
    q_anno_video = q(Annotation.annotation, Video.url).outerjoin(Song).outerjoin(Video).all()
    panini_anno.song.videos
    db.session.commit()


    print("Connected to database")