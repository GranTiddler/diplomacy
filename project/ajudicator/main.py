from flask import Flask
import os
import mysql.connector

class Unit:
    def __init__(self, type, territory, order, country):
        self.state = "pending"
        self.type = type
        self.territory = territory
        self.order = order # order type, target, targets target
        self.country = country
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
        # interact with db
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
        if unit.order != "M":
            territory = unit.territory
        else:
            territory = unit.order[1]
        # return min and max force
        # if the unit passed in is supporting a move, don't count the unit being supported into

        for i in self.adjacencyList[territory]:
            if not ((unit.order[0] == "S" and (i == unit.order[2] or self.units[i].country == unit.country)) or i == unit.territory) and (self.units[i].order == ["M", territory] or (self.units[i].order[0] == "C" and self.units[i].order[2] == territory and self.getValidConvoy(self.units[self.units[i].order[1]]))): 
                
                force = self.getForce(self.units[i])
                
                if self.units[i].order == (self.units[i].order[0] == "C" and self.units[i].order[2] == territory):
                    force = self.getForce(self.units[i].order[1])

                min.append(force[0])
                max.append(force[1])            

        return [max(min), max(max)]

    def getForce(self, unit):
        # return the force a unit has
        force = [0,0]
        
        if unit.order != "M":
            territory = unit.territory
        else:
            territory = unit.order[1]

        order = ["S", unit.territory, territory]

        if unit in self.adjacencyList[territory] or self.getValidConvoy(unit):

            for i in self.adjacencyList[territory]:
                if self.units[i].order == order and not self.units[i].failed():
                    force[1] += 1
                    if self.units[i].succeeded():
                        force[0] += 1

        # get if there is a valid path (adjacent or convoy)
        # loop through units adjacent to the target 
            # if unit is supporting and not the same 
        return force
    
    def getValidConvoy(self, unit):
        return self.convoySearch(unit.territory, ["C", unit.territory, unit.order[1]], [])
    
    def convoySearch(self, unit, order, visited): # DFS
        # add to visited list
        visited.append(unit)
        # loop through adjacent as newUnit
        for i in self.adjacencyList[unit]:
            # if adjacent isn't in visited and unit has the correct order
            if (not i in visited) and self.units[i].order == order:
                # call convoySearch with newUnit, order, and visited
                if self.convoySearch(i, order, visited) or i == order[2]:
                    # if convoySerach returns true return true  
                    return True
        # return false
        return False

def schedule(boardNum):
    # get schedule times from sql
    # schedule with boardnumber as argument
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