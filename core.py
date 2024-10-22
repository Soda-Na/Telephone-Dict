from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd
import os

app = Flask(__name__)

DATA_FILE = "телефоны.xlsx"

def load_data():
    if not os.path.exists(DATA_FILE):
        return [], pd.DataFrame()

    data = pd.read_excel(DATA_FILE, dtype={'Внутренний номер телефона': 'object'})
    groups = data.groupby("Отдел")
    departaments = []

    for name, group in groups:
        contacts = group.fillna('не указано').values.tolist()
        departaments.append({
            "name": name,
            "contacts": contacts
        })

    # Перемещаем "Администрация" на первое место
    departaments.sort(key=lambda x: 0 if x["name"].lower().strip() == "администрация" else 1)

    department_and_mail = data.iloc[:, 8:10].dropna().iloc[1:]
    department_and_mail.columns = ['Отдел', 'Почта']

    return departaments, department_and_mail

@app.route("/")
def index():
    departaments, emails = load_data()
    return render_template("index.html", departaments=departaments, emails=emails)

@app.route("/upload", methods=["GET", "POST"])
def upload():
    if request.method == "POST":
        file = request.files.get("file")
        if file:
            file.save(DATA_FILE)
            return jsonify({"status": "success"}), 200
        return jsonify({"status": "fail", "message": "No file uploaded"}), 400
    return render_template("upload.html")

@app.route("/download")
def download():
    if os.path.exists(DATA_FILE):
        return send_file(DATA_FILE, as_attachment=True)
    return "Файл не найден", 404

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80)