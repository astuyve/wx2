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
  query = ''' SELECT altitude,direction,speed FROM winds WHERE airport_code="MSP" '''
  winds = query_db(query)
  result = {}
  for data in winds:
    result[data['altitude']]= {"direction":data['direction'], "speed":data['speed']}
  query_airports = ''' SELECT DISTINCT(airport_code) FROM winds '''
  airports = query_db(query_airports)
  return render_template('index.html', winds=result, airports=airports)

@app.route('/airport_code_json', methods=['GET'])
def airport_code_json():
  airport_code = request.args.get('airport_code', None)
  query = ''' SELECT altitude,direction,speed FROM winds WHERE airport_code="{}" '''.format(airport_code)
  winds = query_db(query)
  result = {}
  for data in winds:
    result[data['altitude']]= {"direction":data['direction'], "speed":data['speed']}
  return jsonify(winds=result)

if __name__ == '__main__':
  app.run()
