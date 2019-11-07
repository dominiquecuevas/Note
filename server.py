from flask import Flask, render_template, request, flash, redirect, session
import requests
from jinja2 import StrictUndefined
from model import connect_db, db, Song, User, Annotation, seed_data


app = Flask(__name__)
app.secret_key = 'sekrit'

app.jinja_env.undefined = StrictUndefined

@app.route("/test-query")
def test_query():
    """test queries"""

    q = db.session.query(Annotation).filter(Annotation.user_id==1).all()

    return render_template("test-query.html",
                            q=q)

# @app.route("/search")
# def search_api():


#     return

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