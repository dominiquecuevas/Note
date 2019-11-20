from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Song(db.Model):
    """Songs with lyrics"""

    __tablename__ = "songs"

    song_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    song_title = db.Column(db.Text, nullable=False)
    song_artist = db.Column(db.Text, nullable=False)
    lyrics = db.Column(db.Text, nullable=False)
    video_url = db.Column(db.Text)

    def __repr__(self):

        return f"<Song id={self.song_id} title='{self.song_title}' artist='{self.song_artist}'>"


class User(db.Model):
    """User table"""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):

         return f"<User id={self.user_id} email={self.email}>"

class Annotation(db.Model):
    """User-made annotations."""

    __tablename__ = "annotations"

    anno_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)
    annotation = db.Column(db.Text, nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.song_id'), nullable=True)
    song_fragment = db.Column(db.Text, nullable=False)

    user = db.relationship("User",
                            backref="annotations")

    song = db.relationship("Song",
                            backref="annotations")

    def __repr__(self):

        return f"<Annotation id={self.anno_id} fragment='{self.song_fragment}' annotation='{self.annotation}' title='{self.song.song_title}'>"


def connect_db(app):
    """Configure and connect to psql after createdb database."""

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///lyrics'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = False
    db.app = app
    db.init_app(app)


def seed_data():
    q = db.session.query

    # test creating rows with static data
    panini = Song(song_title='Panini', song_artist='Lil Nas X', lyrics='Hey, Panini..', video_url='https://www.youtube.com/watch?v=bXcSLI58-h8')
    sd = Song(song_title='Slow Dancing in the Dark', song_artist='Joji', lyrics="I don't want a friend..", video_url='https://www.youtube.com/watch?v=K3Qzzggn--s')
    db.session.add(panini)
    db.session.add(sd)
    db.session.commit()
    # test query on song
    q_song = Song.query.filter(Song.song_artist.like('%Lil%')).all()
    print(f'This song works: {q_song}')


    nikki = User(email='nikki@gmail.com', name='Nikki')
    dominique = User(email='dominique@gmail.com', name='Dominique')
    db.session.add(nikki)
    db.session.add(dominique)
    db.session.commit()
    # test query
    q_user = q(User).filter(User.email.like('%@gmail.com%')).all()
    print(f'These users work: {q_user}')


    panini_anno = Annotation(song_fragment="Hey, Panini don't you be a meanie",
                            annotation="Panini is a character from Chowder cartoon",
                            song=panini)
    
    nikki.annotations.append(panini_anno)
    db.session.add(panini_anno)
    db.session.commit()
    print(f"This append annotation to User {nikki.name} works: {nikki.annotations}")


    sd_anno = Annotation(song_fragment="When I'm around slow dancing in the dark",
                            annotation="Something, something annotation",
                            song=sd)
    dominique.annotations.append(sd_anno)
    db.session.commit()
    print(f"This append to User {dominique.email} works: {dominique.annotations}")


    s_annos = panini.annotations
    print(f"This annotations to song {panini} works: {s_annos}")


if __name__ == "__main__":

    from server import app

    connect_db(app)
    db.create_all()

    print("Connected to database")