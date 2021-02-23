import pymysql
from flask import Flask, jsonify, request, session
from flask_restful import reqparse, abort, Api, Resource

from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

app = Flask(__name__)
api = Api(app)

db = pymysql.connect(
        user = 'root',
        passwd = 'devpass',
        host = '127.0.0.1',
        port = 3306,
        db = 'elice_racer_portfolio',
        charset = 'utf8'
    )
cursor = db.cursor()


@app.route('/register', methods=['GET', 'POST'])
def register():
    #Post
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        db = get_db()
        error = None

        #email error
        if not email:
            error = 'Email이 유효하지 않습니다.'
        #password error
        elif not password:
            error = 'Password가 유효하지 않습니다.'
        #existing error
        elif db.execute(
            'SELECT id FROM user WHERE email = ?', (email,)
        ).fetchone() is not None:
            error = '{} 계정은 이미 등록된 계정입니다.'.format(email)

        # 에러가 발생하지 않았다면 회원가입 실행
        if error is None:
            db.execute(
                'INSERT INTO user (email, password) VALUES (?, ?)',
                (email, generate_password_hash(password))
            )
            db.commit()
            return redirect(url_for('auth.login'))
        # error message
        flash(error)

    return render_template('auth/register.html')

@app.route('/login', methods=('GET', 'POST'))
def login():
    # POST
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        db = get_db()
        error = None
        user = db.execute(
            'SELECT * FROM user WHERE email = ?', (email,)
        ).fetchone()

        # user not found
        if user is None:
            error = '등록되지 않은 계정입니다.'
        elif not check_password_hash(user['password'], password):
            error = 'Password가 틀렸습니다.'

        # 정상적인 정보를 요청받았다면?
        if error is None:
            # make session clear
            session.clear()
            # change session to logged in user
            session['user_id'] = user['id']
            return redirect(url_for('index'))
        # error message
        flash(error)

    return render_template('auth/login.html')