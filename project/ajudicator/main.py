from flask import Flask
import os
import mysql.connector

class Unit:
    def __init__(self, type, territory, order):
        self.state = "pending"
        self.type = type
        self.territory = territory
        self.order = order
        return
    
    def pending(self):
        return self.state=="pending"
    
    def failed(self):
        return self.state=="failed"
    
    def succeeded(self):
        return self.state=="succeeded"
    

class Board:
    def __init__(self, boardNum):
        self.boardNum = boardNum
        # get board details from the db

        self.adjacencyList = [] 
        self.units = []


    def updateBoard(self):
        return

    def adjudicate(self):
        complete = False
        while(not complete):
            complete = True
            for i in self.units:
                if(i.order[0] == "S"):
                    # if cut or not adjacent set failed 
                    # else if no pending convoy cut set succeeded
                    pass
                elif(i.order[0] == "M"):
                    # if target is adjacent or has a successful convoy
                        # if not contested set succeeded
                        # else if force is greatest going in and no supports are pending set succeeded
                        # else set failed
                    # else set failed
                    pass
                else:
                    # if not contested set succeeded
                    # if there is a successful move into territory set failed
                    pass

                if(i.pending()):
                    complete = False
        return

    def getContested(self, unit, territory, force):
        return

    def getForce(self, unit, target):
        return
    
    def getValidConvoy(self, unit, target):
        return
    
    def attemptAdjudiate(self):
        return

def schedule(boardNum):
    return

def getAdjudicateStatus(boardNum):
    return


app = Flask(__name__)


@app.route('/')
def home():
    return "AAAAAAA"

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)