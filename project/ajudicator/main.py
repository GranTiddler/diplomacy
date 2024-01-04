from flask import Flask
import os
import mysql.connector

class Unit:
    def __init__(self, type, territory, order):
        self.state = "pending"
        self.type = type
        self.territory = territory
        self.order = order # order type, target, targets target
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

        self.adjacencyList = {"Por": "Spa"} 
        self.units = {"Por": Unit("A", "Por", ["M", "Spa"])}


    def updateBoard(self):
        return

    def adjudicate(self):
        complete = False
        while(not complete):
            complete = True
            for i in self.units:
                if i.pending():
                    complete = False
                    if(i.order[0] == "S"):
                        opposingForce = self.getContested(i.territory)
                        if opposingForce[0]:
                            i.order = "H"

                        elif opposingForce[1] == 0:
                            i.state = "succeeded"

                    elif(i.order[0] == "M"):
                        if i.order[1] in self.adjacencyList[i.territory] or self.getValidConvoy(i):
                            force = self.getForce(i)
                            forceIn = [self.getContested(i.order[1])]
                            if self.units[i.order[1]]:
                                forceHold = self.getForce(self.units[i.order[1]])
                                opposingForce = [max(forceIn[0], forceHold[0]), max(forceIn[1], forceHold[1])]

                            if force[0] > opposingForce[1]:
                                i.state = "succeeded"
                            elif force[1] <= opposingForce[0]:
                                i.state = "failed"

                        else:
                            i.state = "failed"
                        # if target is adjacent or has a successful convoy
                            # if not contested set succeeded
                            # else if force is greatest going in and no supports are pending set succeeded
                            # else set failed
                        # else if no pending convoy set failed

                    else:
                        opposingForce = self.getContested(i)
                        holdForce = self.getForce(i)
                        if holdForce[0] > opposingForce[1]:
                            i.state = "succeeded"
                        elif holdForce[1] < opposingForce[0]:
                            i.state = "failed"

                    if(i.pending()):
                        complete = False
        return

    def getContested(self, unit):
        min = [0]
        max = [0]
        territory = unit.territory
        # return min and max force
        # if the unit passed in is supporting a move, don't count the unit being supported into

        for i in self.adjacencyList[territory]:
            if not (unit.order[0] == "S" and i == unit.order[2]) and (self.units[i].order == ["M", territory] or (self.units[i].order[0] == "C" and self.units[i].order[2] == territory and self.getValidConvoy(self.units[self.units[i].order[1]]))): 
                
                force = self.getForce(self.units[i])
                if 
                min.append(force[0])
                max.append(force[1])            

        return [max(min), max(max)]

    def getForce(self, unit):
        # return the force a unit has
        return ["min", "max"]
    
    def getValidConvoy(self, unit):
        return self.convoySearch(unit, ["C", unit.territory, unit.order[1]], [])
    
    def convoySearch(self, unit, order, visited): # DFS
        # add to visited list
        # loop through adjacent as newUnit
            # if adjacent isn't in visited and unit has the correct order
                # call convoySearch with newUnit, order, and visited
                # if convoySerach returns true return true
        # return false
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
    print("GAS")
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)