import pymysql

db = pymysql.connect(
    user="root",
    password="",
    host="127.0.0.1",
    port=3306,
    database="elice_racer_portfolio",
    charset="utf8",
)
