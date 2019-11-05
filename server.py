from flask import Flask, render_template, request, flash, redirect, session
from jinja2 import StrictUndefined


from model import connect_db, Song

app = Flask(__name__)
# app.secret_key = 'sekrit'

app.jinja_env.undefined = StrictUndefined

@app.route("/")
def homepage():

    return render_template("index.html")


@app.route("/anno-form")
def annoform():

    annotation = request.args.get("annotation")
    return render_template("anno_input.html")


@app.route("/add-anno", methods=["POST"])
def addanno():

    annotation = request.form.get("annotation")

    return render_template("user_annotations.html",
                            annotation = annotation)


if __name__ == "__main__":
    connect_db(app)
    db.create_all()
    app.run(host="0.0.0.0", debug=True)