# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request, session
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    JWTManager,
)
import pymysql

from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

app = Flask(__name__)
api = Api(app)
CORS(app)
app.config.from_mapping(SECRET_KEY="dev")
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)

db = pymysql.connect(
    user="root",
    passwd="",
    host="127.0.0.1",
    port=3306,
    db="elice_racer_portfolio",
    charset="utf8",
)
cursor = db.cursor()


@app.route("/register", methods=["GET", "POST"])
def register():
    # Post
    if request.method == "POST":
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        password_confirm = data.get("password_confirm")
        name = data.get("name")

        error = None

        # email error
        if not email:
            error = "Email이 유효하지 않습니다."

        # password error
        elif not password:
            error = "Password가 유효하지 않습니다."
        # different password
        elif password != password_confirm:
            error = "Password가 일치하지 않습니다."

        # name error
        elif not name:
            error = "Name이 유효하지 않습니다."

        # existing error
        sql = "SELECT id FROM User WHERE email = %s"
        cursor.execute(sql, (email,))
        result = cursor.fetchone()
        if result is not None:
            error = "{} 계정은 이미 등록된 계정입니다.".format(email)

        # no error occurs, execute
        if error is None:
            sql = "INSERT INTO `User` (`name`, `email`, `password`) VALUES (%s, %s, %s)"
            cursor.execute(sql, (name, email, generate_password_hash(password)))
            db.commit()
            # find user_id
            sql = "SELECT id FROM User WHERE email = %s"
            cursor.execute(sql, (email,))
            user_id = cursor.fetchone()
            # update UserInfo
            sql = "INSERT INTO `UserInfo` (`image_path`, `user_id`) VALUES (%s, %s)"
            cursor.execute(
                sql,
                (
                    "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg",
                    user_id,
                ),
            )
            db.commit()
            return jsonify({"status": "success", "message": "등록되었습니다."})

    return jsonify({"status": "fail", "message": error})


@app.route("/login", methods=["GET", "POST"])
def login():
    # POST
    if request.method == "POST":
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        error = None

        # find from db
        sql = "SELECT id, email, password, name FROM User WHERE email = %s"
        cursor.execute(sql, (email,))
        user = cursor.fetchone()
        # user not found
        if user is None:
            error = "등록되지 않은 계정입니다."
        # password not match
        if not (user == None or check_password_hash(user[2], password)):
            error = "Password가 틀렸습니다."

        # No errors
        if error is None:
            # # make session clear
            # session.clear()
            # # change session to logged in user
            # session["user_id"] = user[0] --> if session no necessary delete this

            # make jwt token
            access_token = create_access_token(identity=user[0])
            return jsonify(
                status="success",
                access_token=access_token,
                user_name=user[3],
                result={"message": "로그인"},
            )

    return jsonify(status="fail", result={"message": error})


@app.route("/main", methods=["GET", "POST"])
@jwt_required()
def main():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()

    if request.method == "POST":
        data = request.get_json()
        name = data.get("name")
        info = data.get("info")
        # path = data.get("path")

        sql = "UPDATE `User` SET `name` = %s WHERE id = %s"
        cursor.execute(sql, (name, current_user))
        db.commit()

        sql = "UPDATE `UserInfo` SET `info` = %s WHERE user_id = %s"
        cursor.execute(sql, (info, current_user))
        db.commit()

        return jsonify(logged_in_as=current_user), 200

    sql = "SELECT email, name, image_path, info FROM User JOIN UserInfo ON User.id = UserInfo.user_id WHERE User.id = %s"
    cursor.execute(sql, current_user)
    user = cursor.fetchone()
    return (
        jsonify(
            logged_in_as=current_user,
            email=user[0],
            name=user[1],
            image_path=user[2],
            info=user[3],
        ),
        200,
    )


# if not neccessary delete this
# @app.route("/logout", methods=["GET"])
# def logout():
#     db.close()
#     return jsonify(status="success", result={"message": "로그아웃 되었습니다."})


parser = reqparse.RequestParser()
parser.add_argument("college")
parser.add_argument("major")
parser.add_argument("degree")


class Education(Resource):
    @jwt_required()
    def get(self, user_id=None):
        current_id = get_jwt_identity()

        if not user_id:
            sql = "SELECT college, major, degree FROM `Education` WHERE user_id = %s"
            cursor.execute(sql, current_id)
            result = cursor.fetchall()
            return jsonify(status="success", result=result)

    @jwt_required()
    def post(self):
        current_id = get_jwt_identity()

        args = parser.parse_args()
        if args["college"] != "" and args["major"] != "":
            sql = "INSERT INTO `Education` (`college`, `major`, `degree`, `user_id`) VALUES (%s, %s, %s, %s)"
            cursor.execute(
                sql, (args["college"], args["major"], args["degree"], current_id)
            )
            db.commit()

        return jsonify(status="success")

    @jwt_required()
    def put(self):
        args = parser.parse_args()
        sql = "UPDATE `board` SET name = %s WHERE `id` = %s"
        cursor.execute(sql, (args["name"], args["id"]))
        db.commit()

        return jsonify(
            status="success", result={"id": args["id"], "name": args["name"]}
        )

    @jwt_required()
    def delete(self):
        args = parser.parse_args()
        sql = "DELETE FROM `board` WHERE `id` = %s"
        cursor.execute(sql, (args["id"],))
        db.commit()

        return jsonify(status="success", result={"id": args["id"]})


api.add_resource(Education, "/education", "/education/<user_id>")

if __name__ == "__main__":
    app.run("0.0.0.0", port=5000, debug=True)
