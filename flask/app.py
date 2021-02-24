# -*- coding: utf-8 -*- 
from flask import Flask, jsonify, request, session
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
import pymysql

from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

app = Flask(__name__)
api = Api(app)
CORS(app)
app.config.from_mapping(SECRET_KEY='dev')

db = pymysql.connect(
        user = 'root',
        passwd = 'qlalfqjsgh486',
        host = '127.0.0.1',
        port = 3306,
        db = 'elice_racer_portfolio',
        charset = 'utf8'
    )
cursor = db.cursor()

def validate_email(email):
    # type check
    if type(email) is not str:
        return False
    
    # inclue only one '@'
    if email.count("@") != 1:
        return False
        
    # domain
    domain = email.split("@")[1]
    
    # check domain has one or more '.'
    if domain.count(".") == 0:
        return False
    
    # check if domain has '.' continuosly
    parts = domain.split(".")
    for part in parts:
        if part == "":
            return False  
    return True

@app.route('/register', methods=['GET', 'POST'])
def register():
    #Post
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        password_confirm = request.form['password_confirm']
        name = request.form['name']
        db = get_db()
        error = None

        #email error
        if not email:
            error = 'Email이 유효하지 않습니다.'
        elif not validate_email(email):
            error = 'Email이 유효하지 않습니다.'

        #password error
        elif not password:
            error = 'Password가 유효하지 않습니다.'
        #different password
        elif password != password_confirm:
            error = 'Password가 다릅니다.'

        #name error
        elif not name:
            error = 'Name이 유효하지 않습니다.'

        #existing error
        elif db.execute(
            'SELECT id FROM user WHERE email = ?', (email,)
        ).fetchone() is not None:
            error = '{} 계정은 이미 등록된 계정입니다.'.format(email)

        # no error occurs, execute
        if error is None:
            db.execute(
                'INSERT INTO user (email, password) VALUES (?, ?)',
                (email, generate_password_hash(password))
            )
            db.commit()
            return jsonify({'status': 'success', 'message': '등록되었습니다.'})
        # error message
        flash(error)

    return jsonify({'status': 'error', 'message': error})

@app.route('/login', methods=['GET', 'POST'])
def login():
    # POST
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        db = get_db()
        error = None

        #find from db
        user = db.execute(
            'SELECT email, password FROM user WHERE email = ?', (email,)
        ).fetchone()

        # user not found
        if user is None:
            error = '등록되지 않은 계정입니다.'
        # password not match
        elif not check_password_hash(user['password'], password):
            error = 'Password가 틀렸습니다.'

        # No errors
        if error is None:
            # make session clear
            session.clear()
            # change session to logged in user
            session['user_id'] = user['id']
            return jsonify(status = "success", result = {"email": email, "session": session['user_id']})
        # error message
        flash(error)

    return jsonify({'status': 'error', 'message': error})

if __name__ == '__main__':
    app.run('0.0.0.0', port=80, debug=True)