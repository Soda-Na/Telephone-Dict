try:
    from flask import Flask, render_template, request, jsonify
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
    data = pd.read_excel("телефоны.xlsx")
    groups = data.groupby("Отдел")
    departaments = []
    for name, group in groups:
        departaments.append(
            {
                "name": name,
                "contacts": group.fillna('не указано').values.tolist()
            } 
        )
    print(departaments)
    return render_template("index.html", departaments=departaments)

@app.route("/search")
def search():
    contacts = pd.read_excel("телефоны.xlsx")
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
        departaments.append(
            {
                "name": name,
                "contacts": group.fillna('не указано').values.tolist()
            }
        )

    return jsonify(departaments)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port='80')