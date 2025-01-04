from flask import Flask, jsonify, render_template
import mysql.connector

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        passwd='abdou0000',
        db='pravan',
        port=3300
    )

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/students-by-year', methods=['GET'])
def get_students_by_year():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT ANNEE, COUNT(*) as count
        FROM RESULTATS
        GROUP BY ANNEE
        ORDER BY ANNEE
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/average-by-specialty', methods=['GET'])
def get_average_by_specialty():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT SPECIALITE, AVG(MOYENNE) as moyenne
        FROM RESULTATS
        GROUP BY SPECIALITE
        ORDER BY SPECIALITE
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/gender-distribution', methods=['GET'])
def get_gender_distribution():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT SEXE, COUNT(*) as count
        FROM RESULTATS
        GROUP BY SEXE
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(result)

@app.route('/api/specialty-evolution', methods=['GET'])
def get_specialty_evolution():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT ANNEE, SPECIALITE, COUNT(*) as count
        FROM RESULTATS
        GROUP BY ANNEE, SPECIALITE
        ORDER BY ANNEE, SPECIALITE
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)