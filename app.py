#!/usr/bin/env python
from flask import (Flask, request, render_template, jsonify, g)
import sqlite3

DATABASE = 'database.db'

app = Flask(__name__)

# Database
def connect_db():
    return sqlite3.connect(DATABASE)

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    if hasattr(g, 'db'):
        g.db.close()

def get_connection():
    db = getattr(g, '_db', None)
    if db is None:
        db = g._db = connect_db()
    return db

def query_db(query, args=(), one=False):
    cur = g.db.execute(query, args)
    rv = [dict((cur.description[idx][0], value)
               for idx, value in enumerate(row)) for row in cur.fetchall()]
    return (rv[0] if rv else None) if one else rv

@app.route('/', methods=['GET'])
def index():
	query = ''' SELECT * FROM winds WHERE altitude="3000" '''
	winds = query_db(query)
	return render_template('index.html', winds=winds)

if __name__ == '__main__':
	app.run()
