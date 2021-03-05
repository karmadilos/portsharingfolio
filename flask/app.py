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
from pymysql.cursors import DictCursor

from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

from db import db

app = Flask(__name__)
api = Api(app)
CORS(app)
app.config.from_mapping(SECRET_KEY="dev")
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)


@app.route("/register", methods=["POST"])
def register():
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
    with db.cursor(DictCursor) as cursor:
        sql = "SELECT id FROM users WHERE email = %s"
        cursor.execute(sql, (email,))
        result = cursor.fetchone()
    if result is not None:
        error = "{} 계정은 이미 등록된 계정입니다.".format(email)

    # no error occurs, execute
    if error is None:
        with db.cursor(DictCursor) as cursor:
            sql = (
                "INSERT INTO `users` (`name`, `email`, `password`) VALUES (%s, %s, %s)"
            )
            cursor.execute(sql, (name, email, generate_password_hash(password)))
            db.commit()

        with db.cursor(DictCursor) as cursor:
            # find user_id
            sql = "SELECT id FROM users WHERE email = %s"
            cursor.execute(sql, (email,))
            user_id = cursor.fetchone()
            # update UserInfo
            sql = "INSERT INTO `userinfo` (`image_path`, `user_id`) VALUES (%s, %s)"
            cursor.execute(
                sql,
                (
                    "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg",
                    user_id["id"],
                ),
            )
            db.commit()
        return jsonify({"status": "success", "message": "등록되었습니다."})
    return jsonify({"status": "fail", "message": error})


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    error = None

    # find from db
    with db.cursor(DictCursor) as cursor:
        sql = "SELECT id, email, password, name FROM users WHERE email = %s"
        cursor.execute(sql, (email,))
        user = cursor.fetchone()

    # user not found
    if user is None:
        error = "등록되지 않은 계정입니다."
    # password not match
    if not (user == None or check_password_hash(user["password"], password)):
        error = "Password가 틀렸습니다."

    # No errors
    if error is None:
        # make jwt token
        access_token = create_access_token(identity=user["id"])
        return jsonify(
            status="success",
            access_token=access_token,
            user_name=user["name"],
            result={"message": "로그인"},
        )

    return jsonify(status="fail", result={"message": error})


@app.route("/main", methods=["GET", "PATCH"])
@jwt_required()
def main():
    # Access the identity of the current user with get_jwt_identity
    current_id = get_jwt_identity()

    if request.method == "PATCH":
        data = request.get_json()
        name = data.get("name")
        info = data.get("info")
        # path = data.get("path")

        with db.cursor(DictCursor) as cursor:
            sql = "UPDATE `users` SET `name` = %s WHERE id = %s"
            cursor.execute(sql, (name, current_id))
            db.commit()

        with db.cursor(DictCursor) as cursor:
            sql = "UPDATE `userinfo` SET `info` = %s WHERE user_id = %s"
            cursor.execute(sql, (info, current_id))
            db.commit()

        return jsonify(logged_in_as=current_id), 200

    with db.cursor(DictCursor) as cursor:
        sql = "SELECT email, name, image_path, info FROM users JOIN userinfo ON users.id = userinfo.user_id WHERE users.id = %s"
        cursor.execute(sql, (current_id,))
        user = cursor.fetchone()
    return (
        jsonify(
            logged_in_as=current_id,
            email=user["email"],
            name=user["name"],
            image_path=user["image_path"],
            info=user["info"],
        ),
        200,
    )


@app.route("/network", methods=["GET"])
@jwt_required()
def network():
    # Access the identity of the current user with get_jwt_identity
    current_id = get_jwt_identity()

    with db.cursor(DictCursor) as cursor:
        sql = "SELECT email, name, image_path, info, users.id FROM users JOIN userinfo ON users.id = userinfo.user_id"
        cursor.execute(sql,)
        user = cursor.fetchall()
    return jsonify(status="success", user=user)


parser = reqparse.RequestParser()
parser.add_argument("id")
parser.add_argument("college")
parser.add_argument("major")
parser.add_argument("degree")


class Education(Resource):
    @jwt_required()
    def get(self, user_id=None):
        current_id = get_jwt_identity()

        if not user_id:
            with db.cursor(DictCursor) as cursor:
                sql = "SELECT id, college, major, degree FROM `educations` WHERE user_id = %s"
                cursor.execute(sql, (current_id,))
                result = cursor.fetchall()
            return jsonify(status="success", result=result)

    @jwt_required()
    def post(self):
        current_id = get_jwt_identity()
        args = parser.parse_args()

        if args["college"] != "" and args["major"] != "":
            with db.cursor(DictCursor) as cursor:
                sql = "INSERT INTO `educations` (`college`, `major`, `degree`, `user_id`) VALUES (%s, %s, %s, %s)"
                cursor.execute(
                    sql, (args["college"], args["major"], args["degree"], current_id),
                )
                db.commit()
            return jsonify(status="success")
        return jsonify(status="fail")

    @jwt_required()
    def patch(self):
        current_id = get_jwt_identity()
        args = parser.parse_args()

        if args["college"] != "" and args["major"] != "":
            with db.cursor(DictCursor) as cursor:
                sql = "UPDATE `educations` SET college = %s, major = %s, degree = %s WHERE `id` = %s AND `user_id` = %s"
                cursor.execute(
                    sql,
                    (
                        args["college"],
                        args["major"],
                        args["degree"],
                        args["id"],
                        current_id,
                    ),
                )
                db.commit()
            return jsonify(status="success")
        return jsonify(status="fail")

    @jwt_required()
    def delete(self):
        args = parser.parse_args()

        with db.cursor(DictCursor) as cursor:
            sql = "DELETE FROM `educations` WHERE `id` = %s"
            cursor.execute(sql, (args["id"],))
            db.commit()
        return jsonify(status="success")


api.add_resource(Education, "/education", "/education/<user_id>")


parser.add_argument("title")
parser.add_argument("description")


class Awards(Resource):
    @jwt_required()
    def get(self, user_id=None):
        current_id = get_jwt_identity()

        if not user_id:
            with db.cursor(DictCursor) as cursor:
                sql = "SELECT id, title, description FROM `awards` WHERE user_id = %s"
                cursor.execute(sql, (current_id,))
                result = cursor.fetchall()
            return jsonify(status="success", result=result)

    @jwt_required()
    def post(self):
        current_id = get_jwt_identity()
        args = parser.parse_args()

        if args["title"] != "":
            with db.cursor(DictCursor) as cursor:
                sql = "INSERT INTO `awards` (`title`, `description`, `user_id`) VALUES (%s, %s, %s)"
                cursor.execute(sql, (args["title"], args["description"], current_id))
                db.commit()
            return jsonify(status="success")
        return jsonify(status="fail")

    @jwt_required()
    def patch(self):
        current_id = get_jwt_identity()
        args = parser.parse_args()

        if args["title"] != "":
            with db.cursor(DictCursor) as cursor:
                sql = "UPDATE `awards` SET title = %s, description = %s WHERE `id` = %s AND `user_id` = %s"
                cursor.execute(
                    sql, (args["title"], args["description"], args["id"], current_id,),
                )
                db.commit()
            return jsonify(status="success")
        return jsonify(status="fail")

    @jwt_required()
    def delete(self):
        args = parser.parse_args()

        with db.cursor(DictCursor) as cursor:
            sql = "DELETE FROM `awards` WHERE `id` = %s"
            cursor.execute(sql, (args["id"],))
            db.commit()
        return jsonify(status="success")


api.add_resource(Awards, "/awards", "/awards/<user_id>")


parser.add_argument("startdate")
parser.add_argument("enddate")


class Projects(Resource):
    @jwt_required()
    def get(self, user_id=None):
        current_id = get_jwt_identity()

        if not user_id:
            with db.cursor(DictCursor) as cursor:
                sql = "SELECT id, title, description, startdate, enddate FROM `projects` WHERE user_id = %s"
                cursor.execute(sql, (current_id,))
                result = cursor.fetchall()
            return jsonify(status="success", result=result)

    @jwt_required()
    def post(self):
        current_id = get_jwt_identity()
        args = parser.parse_args()

        if args["title"] != "":
            with db.cursor(DictCursor) as cursor:
                sql = "INSERT INTO `projects` (`title`, `description`, `startdate`, `enddate`, `user_id`) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(
                    sql,
                    (
                        args["title"],
                        args["description"],
                        args["startdate"].split("T")[0],
                        args["enddate"].split("T")[0],
                        current_id,
                    ),
                )
                db.commit()
            return jsonify(status="success")
        return jsonify(status="fail")

    @jwt_required()
    def patch(self):
        current_id = get_jwt_identity()
        args = parser.parse_args()

        if args["title"] != "":
            with db.cursor(DictCursor) as cursor:
                sql = "UPDATE `projects` SET title = %s, description = %s, startdate = %s, enddate= %s WHERE `id` = %s AND `user_id` = %s"
                cursor.execute(
                    sql,
                    (
                        args["title"],
                        args["description"],
                        args["startdate"].split("T")[0],
                        args["enddate"].split("T")[0],
                        args["id"],
                        current_id,
                    ),
                )
                db.commit()
            return jsonify(status="success")
        return jsonify(status="fail")

    @jwt_required()
    def delete(self):
        args = parser.parse_args()

        with db.cursor(DictCursor) as cursor:
            sql = "DELETE FROM `projects` WHERE `id` = %s"
            cursor.execute(sql, (args["id"],))
            db.commit()
        return jsonify(status="success")


api.add_resource(Projects, "/projects", "/projects/<user_id>")


parser.add_argument("acquisition_date")


class Certificates(Resource):
    @jwt_required()
    def get(self, user_id=None):
        current_id = get_jwt_identity()

        if not user_id:
            with db.cursor(DictCursor) as cursor:
                sql = "SELECT id, title, description, acquisition_date FROM `certificates` WHERE user_id = %s"
                cursor.execute(sql, (current_id,))
                result = cursor.fetchall()
            return jsonify(status="success", result=result)

    @jwt_required()
    def post(self):
        current_id = get_jwt_identity()
        args = parser.parse_args()

        if args["title"] != "":
            with db.cursor(DictCursor) as cursor:
                sql = "INSERT INTO `certificates` (`title`, `description`, `acquisition_date`, `user_id`) VALUES (%s, %s, %s, %s)"
                cursor.execute(
                    sql,
                    (
                        args["title"],
                        args["description"],
                        args["acquisition_date"].split("T")[0],
                        current_id,
                    ),
                )
                db.commit()
            return jsonify(status="success")
        return jsonify(status="fail")

    @jwt_required()
    def patch(self):
        current_id = get_jwt_identity()
        args = parser.parse_args()

        if args["title"] != "":
            with db.cursor(DictCursor) as cursor:
                sql = "UPDATE `certificates` SET title = %s, description = %s, acquisition_date = %s WHERE `id` = %s AND `user_id` = %s"
                cursor.execute(
                    sql,
                    (
                        args["title"],
                        args["description"],
                        args["acquisition_date"].split("T")[0],
                        args["id"],
                        current_id,
                    ),
                )
                db.commit()
            return jsonify(status="success")
        return jsonify(status="fail")

    @jwt_required()
    def delete(self):
        args = parser.parse_args()

        with db.cursor(DictCursor) as cursor:
            sql = "DELETE FROM `certificates` WHERE `id` = %s"
            cursor.execute(sql, (args["id"],))
            db.commit()
        return jsonify(status="success")


api.add_resource(Certificates, "/certificates", "/certificates/<user_id>")


if __name__ == "__main__":
    app.run("0.0.0.0", port=5000, debug=True, threaded=False)
