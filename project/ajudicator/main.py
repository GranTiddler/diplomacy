from flask import Flask
import os

app = Flask(__name__)


@app.route('/')
def home():
    return "AAAAAAA"


def schedule(boardNum):
    return

def adjudicate(boardNum):
    return

def getAdjudicateStatus(boardNum):
    return

def attemptAdjudiate(boardNum):
    return

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)