let arrayOfLogLineObjects = [];
let userFirstLineSelected = false;
let firstSelectedButtonObject = null;
let overallStartTime = null;
let overallEndTime = null;
let arrayOfLogInforToGraph = [];
let totalTime = null;

let RECT_HEIGHT = 25;
let SCALE = 1000;
let OFFSETX = 100;
let OFFSETY = 100;
let TOTALTIMEGREATERTHEN = 50;

document.querySelector("#start-button").addEventListener("click", function () {
    let ArrayWithIndividualLinesOfLogs = document.getElementById("log-textarea").value.split(/\n/);
    ArrayWithIndividualLinesOfLogs.forEach((individualLogLine, index) => {
        arrayOfLogLineObjects.push({
            "lineId": index,
            "stringLogLine": individualLogLine,
            "logLineName": individualLogLine.substring(individualLogLine.indexOf("["), (individualLogLine.indexOf("]") + 1)),
            "logLineDate": individualLogLine.match(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/)[0],
            "logLineTimeString": individualLogLine.match(/[0-9][0-9]:[0-9][0-9]:[0-9][0-9].[0-9][0-9][0-9]/)[0],
            "matchingLogLineId": null,
            "logLineTime": convertTime(individualLogLine.match(/[0-9][0-9]:[0-9][0-9]:[0-9][0-9].[0-9][0-9][0-9]/)[0]),
            "logLineTimeTotal": null,
        });
    });
    document.getElementById("log-textarea").remove();
    document.getElementById("start-button").disabled = true;
    overallStartTime = arrayOfLogLineObjects[0].logLineTime;
    overallEndTime = arrayOfLogLineObjects[0].logLineTime;
    arrayOfLogLineObjects.forEach((logLineObject) => {
        if (logLineObject.logLineTime < overallStartTime) {
            overallStartTime = logLineObject.logLineTime;
        }
        if (logLineObject.logLineTime > overallEndTime) {
            overallEndTime = logLineObject.logLineTime;
        }
        var logLineObjectButton = document.createElement("BUTTON");
        logLineObjectButton.innerHTML = logLineObject.stringLogLine;
        logLineObjectButton.id = logLineObject.lineId;
        logLineObjectButton.className = "log-line-object-button";
        logLineObjectButton.draggable = true;
        document.getElementById('main').appendChild(logLineObjectButton);
    });
    document.querySelectorAll(".log-line-object-button").forEach((logLineObjectButton) => {
        logLineObjectButton.addEventListener("click", function () {
            let intId = parseInt(this.id, 10);
            if (!userFirstLineSelected) {
                this.style.background = "gray";
                firstSelectedButtonObject = arrayOfLogLineObjects[intId].lineId;
                userFirstLineSelected = true;
            } else if (intId === firstSelectedButtonObject) {
                this.style.background = "white";
                userFirstLineSelected = false;
            } else if (intId !== firstSelectedButtonObject) {
                arrayOfLogLineObjects[intId].matchingLogLineId = firstSelectedButtonObject;
                arrayOfLogLineObjects[firstSelectedButtonObject].matchingLogLineId = intId;
                document.getElementById(firstSelectedButtonObject).remove();
                this.remove();
                userFirstLineSelected = false;
            }
        });
    });
    totalTime = overallEndTime - overallStartTime;
    let alreadyAddedIds = [];
    document.getElementById("done-button").addEventListener("click", function () {
        document.querySelectorAll(".log-line-object-button").forEach((logLineButton) => {
            logLineButton.remove();
        });
        arrayOfLogLineObjects.forEach((logLineObject) => {
            if (logLineObject.matchingLogLineId && !alreadyAddedIds.includes(logLineObject.matchingLogLineId)) {
                alreadyAddedIds.push(logLineObject.lineId);
                arrayOfLogInforToGraph.push({
                    "name": logLineObject.logLineName,
                    "startTime": logLineObject.logLineTime,
                    "lineLogTotalTime": subtractTime(arrayOfLogLineObjects[logLineObject.matchingLogLineId].logLineTimeString, logLineObject.logLineTimeString)
                });
            }
        });

        refreshGraph(arrayOfLogInforToGraph);
        var refresh = document.createElement("BUTTON");
        refresh.innerHTML = "REFRESH";
        refresh.id = "refresh-button";
        document.getElementById("button-div").appendChild(refresh);
        document.getElementById("refresh-button").addEventListener('click', function () {
            refreshGraph(arrayOfLogInforToGraph);
        });

        var moveUp = document.createElement("BUTTON");
        moveUp.innerHTML = "MOVE UP";
        moveUp.id = "move-up-button";
        document.getElementById("button-div").appendChild(moveUp);
        document.getElementById("move-up-button").addEventListener('click', function () {
            OFFSETY = OFFSETY - 10;
            refreshGraph(arrayOfLogInforToGraph);
        });

        var moveDown = document.createElement("BUTTON");
        moveDown.innerHTML = "MOVE DOWN";
        moveDown.id = "move-down-button";
        document.getElementById("button-div").appendChild(moveDown);
        document.getElementById("move-down-button").addEventListener('click', function () {
            OFFSETY = OFFSETY + 10;
            refreshGraph(arrayOfLogInforToGraph);
        });

        var moveLeft = document.createElement("BUTTON");
        moveLeft.innerHTML = "MOVE LEFT";
        moveLeft.id = "move-left-button";
        document.getElementById("button-div").appendChild(moveLeft);
        document.getElementById("move-left-button").addEventListener('click', function () {
            OFFSETX = OFFSETX - 10;
            refreshGraph(arrayOfLogInforToGraph);
        });

        var moveRight = document.createElement("BUTTON");
        moveRight.innerHTML = "MOVE RIGHT";
        moveRight.id = "move-right-button";
        document.getElementById("button-div").appendChild(moveRight);
        document.getElementById("move-right-button").addEventListener('click', function () {
            OFFSETX = OFFSETX + 10;
            refreshGraph(arrayOfLogInforToGraph);
        });
    });
});


function refreshGraph(arrayOfLogInforToGraph, graph) {
    let currentPositionTop = 0;
    var graph = new joint.dia.Graph;
    new joint.dia.Paper({
        el: document.getElementById('main'),
        model: graph,
        width: 1600,
        height: 800,
        gridSize: 10,
        drawGrid: true,
        background: {
            color: 'rgba(0, 255, 0, 0.3)'
        }
    });
    arrayOfLogInforToGraph.forEach((logInfoToGraph) => {
        if (logInfoToGraph.lineLogTotalTime > TOTALTIMEGREATERTHEN) {
            var totalTimeRect = new joint.shapes.standard.Rectangle();
            if (logInfoToGraph.startTime <= 10 || logInfoToGraph.startTime === overallStartTime) {
                totalTimeRect.position(OFFSETX, currentPositionTop + OFFSETY);
            } else {
                totalTimeRect.position(((((logInfoToGraph.startTime - overallStartTime) / totalTime) * SCALE) + OFFSETX), currentPositionTop + OFFSETY);
            }
            if (logInfoToGraph.totalTime <= 10 || logInfoToGraph.lineLogTotalTime === null) {
                totalTimeRect.resize(5, RECT_HEIGHT);
            } else {
                totalTimeRect.resize(((logInfoToGraph.lineLogTotalTime / totalTime) * SCALE), RECT_HEIGHT);
            }
            totalTimeRect.attr({
                body: {
                    fill: 'white'
                },
                label: {
                    text: logInfoToGraph.name,
                    fill: 'black'
                }
            });
            totalTimeRect.addTo(graph);
            currentPositionTop = currentPositionTop + RECT_HEIGHT;
        }
    });
}

function subtractTime(time1, time2) {
    let aHour = parseInt(time1.substring(0, 2), 10)
    let aMin = parseInt(time1.substring(3, 5), 10);
    let aSec = parseInt(time1.substring(6, 8), 10);
    let aMS = parseInt(time1.substring(9), 10);
    let bHour = parseInt(time2.substring(0, 2), 10)
    let bMin = parseInt(time2.substring(3, 5), 10);
    let bSec = parseInt(time2.substring(6, 8), 10);
    let bMS = parseInt(time2.substring(9), 10);
    let a = aHour * 60 * 60 * 1000 + aMin * 60 * 1000 + aSec * 1000 + aMS;
    let b = bHour * 60 * 60 * 1000 + bMin * 60 * 1000 + bSec * 1000 + bMS;
    return Math.abs(b - a);
}

function convertTime(time1) {
    let aHour = parseInt(time1.substring(0, 2), 10)
    let aMin = parseInt(time1.substring(3, 5), 10);
    let aSec = parseInt(time1.substring(6, 8), 10);
    let aMS = parseInt(time1.substring(9), 10);
    let a = aHour * 60 * 60 * 1000 + aMin * 60 * 1000 + aSec * 1000 + aMS;
    return a;
}

function returnSmallerTime(time1, time2) {
    let aHour = parseInt(time1.substring(0, 2), 10)
    let aMin = parseInt(time1.substring(3, 5), 10);
    let aSec = parseInt(time1.substring(6, 8), 10);
    let aMS = parseInt(time1.substring(9), 10);
    let bHour = parseInt(time2.substring(0, 2), 10)
    let bMin = parseInt(time2.substring(3, 5), 10);
    let bSec = parseInt(time2.substring(6, 8), 10);
    let bMS = parseInt(time2.substring(9), 10);
    let a = aHour * 60 * 60 * 1000 + aMin * 60 * 1000 + aSec * 1000 + aMS;
    let b = bHour * 60 * 60 * 1000 + bMin * 60 * 1000 + bSec * 1000 + bMS;
    if (a < b) {
        return time1;
    } else {
        return time2;
    }
}