# Todo: 모듈화 하기

from flask_restful import reqparse, abort, Api, Resource
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    JWTManager,
)

from db import db

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
