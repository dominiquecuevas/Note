from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Song(db.Model):

    __tablename__ = "songs"

    song_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    song_title = db.Column(db.String(120), nullable=False)
    song_artist = db.Column(db.String(120), nullable=False)
    lyrics = db.Column(db.String(10000), nullable=False)

    def __repr__(self):

        return f"<Song id={self.song_id} title='{self.song_title}' artist={self.song_artist}>"


class User(db.Model):

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):

         return f"<User id={self.user_id} email={self.email}>"


# class Video(db.Model):

#     __tablename__ = "videos"

#     video_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
#     url = db.Column(db.String)
#     song_id = db.Column(db.Integer, db.ForeignKey('songs.song_id'))

#     song = db.relationship("Song",
#                             backref="videos")

# class Anno(db.Model):
#     """User-made annotations."""

#     __tablename__ = "annos"

#     anno_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
#     annotation = db.Column(db.String(10000), nullable=False)
#     song_id = db.Column(db.Integer, db.ForeignKey('songs.song_id'))
#     song_fragment = db.Column(db.String(10000))

#     user = db.relationship("User",
#                             backref="annos")

#     song = db.relationship("Song",
#                             backref="annos")

#     def __repr__(self):

#         return f"<Anno id={self.anno_id} fragment='{self.song_fragment}'>"


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

    panini = Song(song_title='Panini', song_artist='Lil Nas X', lyrics='Hey, Panini')
    nikki = User(email='nikki@gmail.com', name='Nikki')
    db.session.add(panini)
    db.session.add(nikki)
    db.session.commit()

    print("Connected to database")