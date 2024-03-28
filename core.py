try:
    from flask import Flask, render_template, request, jsonify, send_file   
    import pandas as pd
except ImportError:
    print("Необходимые библиотеки отсутствуют. Устанавливаю...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Flask", "pandas"])
    from flask import Flask, render_template, request, jsonify
    import pandas as pd


app = Flask(__name__)


@app.route("/")
def index():
    data = pd.read_excel("телефоны.xlsx", dtype={'Внутренний номер телефона': 'object'})
    groups = data.groupby("Отдел")
    departaments = []
    for name, group in groups:
        if name.lower().strip() == "администрация":
            departaments.insert(0, 
                {
                    "name": name, 
                    "contacts": group.fillna('не указано').values.tolist()
                }
            )
            continue
        departaments.append(
            {
                "name": name,
                "contacts": group.fillna('не указано').values.tolist()
            } 
        )
    department_and_mail = data.iloc[:, 8:10]
    department_and_mail = department_and_mail.dropna()[1:]
    department_and_mail.columns = ['Отдел', 'Почта']

    return render_template("index.html", departaments=departaments, emails=department_and_mail)

@app.route("/search")
def search():
    contacts = pd.read_excel("телефоны.xlsx", dtype={'Внутренний номер телефона': 'object'})
    query = request.args.get("query", "").lower()

    if query:
        contacts = contacts[
            (contacts["Сотрудник"].astype(str).str).lower().str.contains(query) | 
            (contacts["Текущая должность организации"].astype(str).str).lower().str.contains(query) | 
            (contacts["Отдел"].astype(str).str).lower().str.contains(query) |
            (contacts["Номер телефона"].astype(str).str).lower().str.contains(query) |
            (contacts["Внутренний номер телефона"].astype(str).str).lower().str.contains(query)
        ]

    groups = contacts.groupby("Отдел")
    departaments = []
    for name, group in groups:
        if name == "Администрация":
            departaments.insert(0, 
                {
                    "name": name, 
                    "contacts": group.fillna('не указано').values.tolist()
                }
            )
            continue
        departaments.append(
            {
                "name": name,
                "contacts": group.fillna('не указано').values.tolist()
            }
        )

    return jsonify(departaments)

@app.route("/upload")
def upload():
    return render_template("upload.html")

@app.route("/upload/download")
def download():
    return send_file("телефоны.xlsx", as_attachment=True)

@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files["file"]
    file.save("телефоны.xlsx")
    return index()


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port='80')