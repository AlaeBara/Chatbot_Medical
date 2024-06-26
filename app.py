from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from chat import get_response
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

app.secret_key = 'ABGS6BHDKOD9'



@app.route("/")
def page():
    return render_template("page.html")

@app.route("/sign")
def sign():
    return render_template("sign.html")

@app.route("/chat")
def chat():
    return render_template("chat.html")


@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    #TODO: check if text is valid
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)



if __name__ == "__main__":
    app.run(debug=True)