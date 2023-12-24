from flask import request, redirect, render_template
from flask import current_app as app
from application.jobs import tasks
from application.data.database import db
from application.data.models import User

#APP

@app.route("/")
def home():
    return render_template("index.html"), 200

@app.route("/manager")
def manager():
    return render_template("manager.html"), 200


@app.route("/admin")
def admin():
    return render_template("admin.html"), 200