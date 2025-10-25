"use strict"

$(function () {
    console.log("I was uploaded by git")
    //Determines the screen with and height		
    var w = window.innerWidth;
    var h = window.innerHeight;

    //Ensures the game starts in a paused state
    let tickStatePaused = true
    //Sets up employee and customer arrays
    let currentCustomers = [];
    let employees = []; 
    let tickRate =  setInterval(turnTick, 1000);
    let lastSelectedTick;
    let lastSelectedTickBtn;
    
    // Hides all of the .viewBox class which are the primary menu class besides the home box. Might want to move this to be part of the css instead
    $(".viewBox:not(#homeBox)").hide();
    // Adds an event listener to the #homeBtn so that when clicked it will showcase the #homeBox viewBox while hiding all other view boxes
    $("#homeBtn").click(function () {
        $(".viewBox").hide();
        $("#homeBox").show();
    })

    // Adds an event listener to the #patientBtn so that when clicked it will showcase the #patientBox viewBox while hiding all other view boxes
    $("#patientBtn").click(function () {
        $(".viewBox").hide();
        $("#patientBox").show();
    })

    // Adds an event listener to the #employeeBtn so that when clicked it will showcase the #employeeBox viewBox while hiding all other view boxes. It also runs the employeeBoxSetup function which sets up the overall ui for the page.
    $("#employeeBtn").click(function() {
        $(".viewBox").hide();
        $("#employeeBox").show()
        employeeBoxSetup();
    })
    // Adds an event listener to the #upgradeBtn so that when clicked it will showcase the #upgradeBox viewBox while hiding all other view boxes.
    $("#upgradeBtn").click(function () {
        $(".viewBox").hide();
        $("#upgradeBox").show();
    })
    // Adds an event listener to the #upgradeBtn so that when clicked it will showcase the #upgradeBox viewBox while hiding all other view boxes. -- This viewBox and btn may be removed due to lack of use.
    $("#sectorBtn").click(function () {
        $(".viewBox").hide();
        sectorSetup();
        $("#sectorBox").show();
    })
    // Adds an event listener to the #pauseBtn so that when clicked stops currentTick from increasing inside the turnTick function.
    $("#pauseBtn").click(function () {
        pauseGame()
        lastSelectedTick = false;
        lastSelectedTickBtn = false;
    })

    function pauseGame() {
        tickBtnReset()
        let btn = document.getElementById("pauseBtn");
        btn.style.background = "indianred"
        gameState.tickState = false
        gameState.tickRate = false;
    }

    $("#pauseBtn").css({"background": "indianred"})
    // Adds an event listener to the #normalSpdBtn so that when clicked the currentTick, if paused, will resume its count inside the turnTick function.
    $("#normalSpdBtn").click(function () {
        spdSetFunc(1000, "normalSpdBtn")
    })


    $("#slowSpdBtn").click(function () {
        spdSetFunc(2000, "slowSpdBtn");
    })



    $("#dblSpdBtn").click(function () {
        spdSetFunc(500, "dblSpdBtn");

    })


    function spdSetFunc(x, y) {
        lastSelectedTick = x;
        lastSelectedTickBtn = y
        let tickSpeed = x;
        gameState.tickState = true
        let tickOrigin = y;
        console.log(tickSpeed)
        tickBtnReset()
        let btn = document.getElementById(tickOrigin);
        btn.style.background = "lightgreen"
        clearInterval(tickRate)
        tickRate = setInterval(turnTick, tickSpeed);
        lastSelectedTick = tickSpeed;
        lastSelectedTickBtn = btn.id;
    }


    function tickBtnReset() {
        let btnClass = document.getElementsByClassName("tickBtn");
        for(let i = 0 ; i < btnClass.length; i++) {
            btnClass[i].style.background = "white";
        }
    }

    $("#saveBtn").on("click", function() {
        download();
    })

    // Adds an event listener to the #eventButtonExist so that when clicked the #eventBox will change from display:grid to display:none.
    $("#eventButtonExit").click(function () {
        $("#eventBox").slideUp();
        if(lastSelectedTick && lastSelectedTickBtn) {
            spdSetFunc(lastSelectedTick, lastSelectedTickBtn);
        }
    })

    let menuToggle;
    $("#menuBtn").click(function () {
        if(!menuToggle) {
            $("#menuBox").slideDown();
            $("#menuBox").css({"display": "grid", "grid-template-rows": "25% 50% 25%", "justify-content": "initial", "align-items": "center", "text-align": "center"})
            $("#menuBlocker").css({"display": "block"})
            menuToggle = true;
        }
        else {
            $("#menuBox").slideUp();
            menuToggle = false;
        }
    })

    $("#closeMenuBtn").click(function () {
        $("#menuBox").slideUp();
        $("#menuBlocker").css({"display": "none"})
        menuToggle = false;
    })


    document.addEventListener("keydown", (e) => {
        if(e.key === "Escape"){
            if(!menuToggle) {
                $("#menuBox").slideDown();
                $("#menuBox").css({"display": "grid", "grid-template-rows": "25% 50% 25%", "justify-content": "initial", "align-items": "center", "text-align": "center"})
                $("#menuBlocker").css({"display": "block"})
                menuToggle = true;
            }
            else {
                $("#menuBox").slideUp();
                $("#menuBlocker").css({"display": "none"})
                menuToggle = false;
            }
        }
    });

    //Research array which populates the research slots in game
    let researchTree = [
        { id: "surgeryResearch1", groupID: "surgeryResearch", name: "Basic Surgery Skills", groupName: "Surgery Group", desc: "An example for the research tree array", cost: 10, unlocked: false, lvl: 0, active: false, currentResearch: 0, researchItem: "basicSurgery"},
        { id: "surgeryResearch2", groupID: "surgeryResearch", name: "Plastic Surgery", groupName: "Surgery Group", desc: "An example for the research tree array", cost: 10, unlocked: false, lvl: 0, active: false, currentResearch: 0 },
        { id: "surgeryResearch3", groupID: "surgeryResearch", name: "Advanced Plastic Surgery", groupName: "Surgery Group", desc: "An example for the research tree array", cost: 10, unlocked: false, lvl: 0, active: false, currentResearch: 0 },
        { id: "farmResearch1", groupID: "farmResearch", name: "Farm Research 1", groupName: "Farm Research", desc: "An example for the research tree array", cost: 10, unlocked: false, lvl: 0, active: false, currentResearch: 0, researchItem: "farmUpg1" },
        { id: "farmResearch2", groupID: "farmResearch", name: "Farm Research 2", groupName: "Farm Research", desc: "An example for the research tree array", cost: 10, unlocked: false, lvl: 0, active: false, currentResearch: 0 },
        { id: "farmResearch3", groupID: "farmResearch", name: "Farm Research 3", groupName: "Farm Research", desc: "An example for the research tree array", cost: 10, unlocked: false, lvl: 0, active: false, currentResearch: 0 },
        { id: "hypnoResearch1", groupID: "hypnoResearch", name: "Hypnosis Research 1", groupName: "Hypnosis Research", desc: "An example for the research tree array", cost: 10, unlocked: false, lvl: 0, active: false, currentResearch: 0, researchItem: "resistanceRemoval1" },
        { id: "hypnoResearch2", groupID: "hypnoResearch", name: "Hypnosis Research 2", groupName: "Hypnosis Research", desc: "An example for the research tree array", cost: 10, unlocked: false, lvl: 0, active: false, currentResearch: 0, researchItem: "hypnoUpg2"},
        { id: "hypnoResearch3", groupID: "hypnoResearch", name: "Hypnosis Research 3", groupName: "Hypnosis Research", desc: "An example for the research tree array", cost: 10, unlocked: false, lvl: 0, active: false, currentResearch: 0, researchItem: "hypnoUpg3"},
    ]
    //Sets up the research page
    function researchSetup() {
        $("#upgradeBox").empty();
        const page = document.getElementById("upgradeBox")
        const researchAmount = researchTree.length;

        try {
            if (researchAmount) {
                let researchGroup;
                for (let i = 0; i < researchAmount; i++) {

                    if (researchGroup != researchTree[i].groupID) {
                        researchGroup = researchTree[i].groupID
                        let researchGroupBox = document.createElement("div")
                        let researchGroupNameBox = document.createElement("div")

                        researchGroupBox.setAttribute("id", researchTree[i].groupID)
                        researchGroupBox.setAttribute("class", "researchGroupDiv")

                        researchGroupNameBox.innerText = researchTree[i].groupName;
                        researchGroupNameBox.setAttribute("class", "researchPanelName")

                        page.append(researchGroupBox)
                        researchGroupBox.append(researchGroupNameBox)
                    }

                    const researchPrimaryDiv = document.createElement("div")

                    const upgBtnToolTip = document.createElement("div")
                    upgBtnToolTip.setAttribute("class", "toolTipDiv");
                    upgBtnToolTip.setAttribute("id", researchTree[i].id + "ToolTip");
                    upgBtnToolTip.style.display = "none";
                    upgBtnToolTip.innerText = "Total Cost: " + researchTree[i].cost + "\n" + "Description: " + researchTree[i].desc


                    const box = document.createElement("div");
                    const researchBox = document.getElementById(researchGroup)
                    box.setAttribute("id", researchTree[i].id);
                    box.setAttribute("class", "researchPanel")
                    box.innerText = researchTree[i].name;
                    box.addEventListener("mouseover", tooltipShow)
                    box.addEventListener("mouseout", tooltipHide)
                    if(researchTree[i].unlocked === true) {
                        console.log(researchTree[i])
                        box.setAttribute("class", "researchPanelComplete")
                        box.innerText = researchTree[i].name + "\n" + "Finished"
                        let unlocked = $.grep(buildings, function (n) {
                            return n.id === researchTree[i].researchItem;
                        });
                        let unlockedGroup = $.grep(buildingTypes, function (n) {
                            return n.id === unlocked[0].type
                        })
                        unlocked[0].unlocked = true;
                        unlockedGroup[0].unlocked = true;
                        researchTree[i].unlocked = true;
                    }

                    if(researchTree[i].active === true) {
                        box.setAttribute("class", "researchPanelSelected")
                        box.innerText = researchTree[i].name + "\n" + "Current Research: " + researchTree[i].currentResearch + "/" + researchTree[i].cost;

                    }


                    researchBox.append(researchPrimaryDiv)
                    researchPrimaryDiv.append(box)
                    researchPrimaryDiv.append(upgBtnToolTip)
                }
                $(".researchPanel").click(function () {
                    let id = this

                    for (let i = 0; i < researchTree.length; i++) {
                        if (researchTree[i].active == true) {
                            researchTree[i].active = false
                            let panel = document.getElementById(researchTree[i].id)
                            panel.setAttribute("class", "researchPanel")
                            panel.innerText = researchTree[i].name;
                        }
                        if (id.id == researchTree[i].id && researchTree[i].active == false) {
                            researchTree[i].active = true
                            id.setAttribute("class", "researchPanelSelected")
                            id.innerText = researchTree[i].name + "\n" + "Current Research: " + researchTree[i].currentResearch + "/" + researchTree[i].cost;
                        }
                    }
                })
            };
        } catch (error) {
            console.log("Unexpected Error Occured: " + error);
        }
    }


    function capacityCheck() {
        //let buildingBuilt = $.grep(buildingSlots, function (n, i) {
        //  return n.active === true;
        //});
        let buildingBuilt;

        if(buildingBuilt) {
            let capacity = 0;
            for(let i =0; i < buildingBuilt.length; i++) {
                if(buildingBuilt[i].capacity >= 1) {
                    capacity = capacity + 1;
                }
            }
            return capacity;
        }
    }


    let rand;
    function custGenerator() {
        if(!rand && !gameState.charGen) {
            rand = Math.floor(Math.random() * 10)
        }
        if(rand == gameState.currentTick && gameState.charGen != true) {
            let newCust = customerBuilder();
            currentCustomers.push(newCust);
            rand = false
            gameState.charGen = true
        }
    }

    let chance = 0.01, marketing = 0 , reviews = 0;
    function custChances() {
        let totalChance = chance + marketing + reviews
        let rand = Math.random();
        if(rand < totalChance) {
            let newCust = customerBuilder();
            currentCustomers.push(newCust);
        }
    }

    function requestCheck() {
        if(currentCustomers) {
            for(let i = 0; i < currentCustomers.length; i++) {

                if(currentCustomers[i].requestFulfillment != true) {
                    if(currentCustomers[i].tick < currentCustomers[i].patience) {
                        currentCustomers[i].tick += 1;
                    }
                    else {
                        $("#" + currentCustomers[i].custId + "CustDiv").fadeOut();
                        if(currentCustFocus && currentCustFocus.custId === currentCustomers[i].custId) {
                            currentCustFocus = false;
                            $(".sidePanelBtn").hide();
                            $(".sidePanel").slideUp("slow");
                        }
                        currentCustomers = currentCustomers.filter(function(e) {
                            return e.custId !== currentCustomers[i].custId;
                        });
                    }
                }

                else {

                    let selected;
                    for(let k = 0; k < employees.length; k++) {
                        if(currentCustomers[i].assignedDoll == employees[k])
                            selected = employees[k]
                    }

                    if(currentCustomers[i].request.tick > currentCustomers[i].request.tickProgress) {
                        currentCustomers[i].request.tickProgress = currentCustomers[i].request.tickProgress + 1
                    }
                    else {
                        console.log("This customer left satisfied")
                        selected.activeDoll = false;
                        selected.assignedCust = false;
                        currentCustomers[i].fulfilled = true;
                        gameState.cash = gameState.cash + currentCustomers[i].totalToPay;
                        console.log(currentCustomers[i].totalToPay)
                        $("#incomeStat").text("Cash: " + gameState.cash);
                        let panel = document.getElementById("sidePanelPatientBox")
                        $("#sidePanelPatientBox").empty();
                        //$("#sidePanelPatientBox").hide();
                        $("#" + currentCustomers[i].custId + "CustDiv").fadeOut();
                        console.log(currentCustomers[i])
                        let kinks = currentCustomers[i].kinks.split("SLICE");

                        currentCustomers = currentCustomers.filter(function(e) {
                            return e.custId !== currentCustomers[i].custId;
                        });
                        if(currentCustFocus) {
                            for(let i = 0; i < employees.length; i++) {
                                sidePanelSetup(panel, employees[i], currentCustFocus, kinks)
                            }
                        }
                    }
                }
            }
        }
    }
    function calendarFunc(x) {
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let months = [
            {id: "monthJanuary", name: "January", days: 31},
            {id: "monthFebruary", name: "February", days: 28},
            {id: "monthMarch", name: "March", days: 31},
            {id: "monthApril", name: "April", days: 30},
            {id: "monthMay", name: "May", days: 31},
            {id: "monthJune", name: "June", days: 30},
            {id: "monthJuly", name: "July", days: 31},
            {id: "monthAugust", name: "August", days: 31},
            {id: "monthSeptember", name: "September", days: 30},
            {id: "monthOctober", name: "October", days: 31},
            {id: "monthNovember", name: "November", days: 30},
            {id: "monthDecember", name: "December", days: 31},
        ]

        if(!x) {
            let currentDate = {month: months[0], week: days[0], day: 1}
            console.log(currentDate)
            return currentDate;
        }
        if(x) {
            let currentDate = x;
            for(let k = 0; k < days.length; k++) {
                if(days[6] === currentDate.week) {
                    currentDate.week = days[0];
                    break;
                }

                else if(days[k] === currentDate.week) {
                    currentDate.week = days[k + 1];
                    break;
                }
            }
            if(currentDate.day === currentDate.month.days) {
                for(let i = 0; i < months.length; i++) {
                    if(currentDate.month.id === months[11].id && currentDate.day === months[11].days) {
                        currentDate.month = months[0];
                        currentDate.day = 1
                        break;
                    }
                    else if(currentDate.month.id === months[i].id) {
                        currentDate.month = months[i + 1]
                        console.log(currentDate.month)
                        currentDate.day = 1
                        break;
                    }
                }
            }
            else {
                currentDate.day += 1;
            }
            return currentDate;
        }
    }

    function download(download) {
        var element = document.createElement('a');
        let text = "";
        if(currentCustomers && employees) {
            console.log(employees)
            console.log(currentCustomers)
            for(let i = 0; i < currentCustomers.length; i++) {
                let selectedCust = currentCustomers[i]
                if(selectedCust.employee != true) {
                    let orgCustValue;
                    if(selectedCust.assignedDoll) {
                        orgCustValue = selectedCust.assignedDoll;
                        selectedCust.assignedDoll = selectedCust.assignedDoll.custId
                    }
                    console.log(selectedCust)
                    text += "customer-" + JSON.stringify(selectedCust);

                    if(selectedCust.assignedDoll) {
                        selectedCust.assignedDoll = orgCustValue;
                    }
                }
            }

            for(let i = 0; i < employees.length; i++) {
                let selectedEmployee = employees[i];
                let orgEmployeeValue;
                if(selectedEmployee.assignedCust) {
                    orgEmployeeValue = selectedEmployee.assignedCust;
                    selectedEmployee.assignedCust = selectedEmployee.assignedCust.custId
                }
                console.log(selectedEmployee)
                text += "customer-" + JSON.stringify(selectedEmployee);

                if(selectedEmployee.assignedCust) {
                    selectedEmployee.assignedCust = orgEmployeeValue;
                }
            }
            text += "\nCHARACTERS^\n";
        }

        if(buildingSlots) {
            for(let i = 0; i < buildingSlots.length; i++) {
                let selectedBuildingSlot = buildingSlots[i];
                text += "buildingSlot-" + JSON.stringify(selectedBuildingSlot)
            }
            text += "\nBUILDINGSLOTS^\n";
        }

        if(floorSlots) {
            for(let i = 0; i < floorSlots.length; i++) {
                let selectedFloorSlot = floorSlots[i];
                text += "floorSlot-" + JSON.stringify(selectedFloorSlot)
            }
            text += "\nFLOORSLOTS^\n";
        }

        if(researchTree) {
            for(let i = 0; i < researchTree.length; i++) {
                let selectedResearch = researchTree[i];
                text += "researchTree-" + JSON.stringify(selectedResearch)
            }
            text += "\nRESEARCH^\n";
        }

        // Convert the current date to a string
        if(gameState.date) {
            let stringDate = JSON.stringify(gameState.date);
            text += stringDate;
            text += "\nDATE^\n";
        }

        if(gameState.currentTick || gameState.currentTick === 0) {
            let currentTickString = JSON.stringify(gameState.currentTick);
            console.log(currentTickString)
            text += currentTickString;
            text += "\nTICK^\n";
        }

        if(gameState.cash || gameState.cash === 0) {
            let currentIncomeString = JSON.stringify(gameState.cash);
            text += currentIncomeString
            text += "\nINCOME^\n";
        }

        if(eventArray) {
            for(let i = 0; i < eventArray.length; i++) {
                let eventString = JSON.stringify(eventArray[i])
                text += "event-" + eventString
            }
            text += "\nEVENT^\n";
        }

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', "download.txt");
        element.click();
    }

    function load() {
        let loadFile;
        let loadInput = document.getElementById("loadInput")
        loadInput.onchange = function(){showFile()};
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            function showFile() {
                var file = document.querySelector('input[type=file]').files[0];
                var reader = new FileReader()

                var textFile = /text.*/;
                let custArray = [];
                let employeeArray = [];
                if (file.type.match(textFile)) {
                    reader.onload = function (event) {
                        loadFile = event.target.result;
                        let breakFile = loadFile.split("\nCHARACTERS^\n")
                        let charArray = breakFile[0].split("customer-")
                        for(let i = 1; i < charArray.length; i++) {
                            let object = JSON.parse(charArray[i])
                            custArray.push(object)
                        }
                        let customerSelection = [];
                        let employeeSelection = [];
                        for(let i = 0; i < custArray.length; i++) {
                            console.log(custArray[i])
                            if(custArray[i].assignedDoll) {
                                let matchingDoll = $.grep(custArray, function (n, e) {
                                    return n.custId === custArray[i].assignedDoll;
                                });
                                custArray[i].assignedDoll = matchingDoll[0];
                                customerSelection.push(custArray[i])
                            }

                            if(custArray[i].assignedCust) {
                                console.log(custArray[i])
                                let matchingCust = $.grep(custArray, function (n, e) {
                                    return n.custId === custArray[i].assignedCust;
                                });
                                custArray[i].assignedCust = matchingCust[0];
                                employeeSelection.push(custArray[i])
                            }
                            if(custArray[i].employee === true && !custArray[i].assignedCust) {
                                console.log(custArray[i]);
                                employeeSelection.push(custArray[i])
                            }

                        }
                        console.log(employeeSelection)
                        currentCustomers = custArray;
                        employees = employeeSelection;
                        chosenEmployee = employees[0];
                        gameState.employeeFocus = false;
                        customerBoxSetup();
                        breakFile = breakFile[1].split("\nBUILDINGSLOTS^\n")
                        buildingSlotArray = breakFile[0].split("buildingSlot-")
                        for(let i = 1; i < buildingSlotArray.length; i++) {
                            let buildingObj = JSON.parse(buildingSlotArray[i]);
                            if(buildingObj.type != false) {
                                let objId = buildingObj.typeId
                                console.log(buildingObj)
                                let element = document.getElementById("boxInfo" + i)
                                let elementId = element.id
                                let elementType = buildSearch(objId)
                                elementType.occupant = buildingObj.occupant;
                                elementType.stats = buildingObj.stats;
                                buildAssignment(element, elementType, elementId)
                            }
                        }

                        breakFile = breakFile[1].split("\nFLOORSLOTS^\n");
                        let floorSlotArray = breakFile[0].split("floorSlot-");
                        for(let i = 1; i < floorSlotArray.length; i++) {
                            let selectedFloor = JSON.parse(floorSlotArray[i]);
                            console.log(selectedFloor.id)
                            if(selectedFloor.unlocked === true) {
                                $("#floorBtn" + i).remove();
                                let floorBoxes = document.getElementById("floorLevel" + i).getElementsByClassName("buildingSlot");
                                for(let i = 0; i < floorBoxes.length; i++) {
                                    let id = floorBoxes[i].id
                                    $("#" + id).on("click", boxClick);

                                    $("#" + id).on("mouseover", function() {
                                        $("#" + id).css({"background-image": "url('../images/emptyBoxHover.png')"});
                                    })

                                    $("#" + id).on("mouseout", function() {
                                        $("#" + id).css({"background-image": "url('../images/blankBox.png')"});
                                    })
                                }
                            }
                        }


                        let newResearchObjArray = [];
                        breakFile = breakFile[1].split("\nRESEARCH^\n")
                        let researchItemArray = breakFile[0].split("researchTree-")
                        for(let i = 1; i < researchItemArray.length; i++) {
                            let researchItem = JSON.parse(researchItemArray[i]);
                            newResearchObjArray.push(researchItem);
                        }
                        researchTree = newResearchObjArray;
                        researchSetup();

                        breakFile = breakFile[1].split("\nDATE^\n");
                        let newDate = JSON.parse(breakFile[0])
                        currentDate = newDate;
                        $("#dayStat").text(currentDate.week + " " + currentDate.month.name + " "+ currentDate.day);

                        breakFile = breakFile[1].split("\nTICK^\n");
                        gameState.currentTick = JSON.parse(breakFile[0]);
                        turnBar(gameState.currentTick ,gameState.completeTick)

                        breakFile = breakFile[1].split("\nINCOME^\n");
                        gameState.cash = JSON.parse(breakFile[0]);
                        $("#incomeStat").text("Cash: " + gameState.cash);

                        let newEventArray = [];
                        breakFile = breakFile[1].split("\nEVENT^\n");
                        let eventStringArray = breakFile[0].split("event-");
                        console.log(eventStringArray)
                        for(let i = 1; i < eventStringArray.length; i++) {
                            let eventObj = JSON.parse(eventStringArray[i]);
                            console.log(eventObj)
                            newEventArray.push(eventObj)
                        }
                        eventArray = newEventArray;
                        if(!chosenCust) {
                            chosenCust = employees[0]
                        }
                        surgerySetup();
                    }
                } else {
                    console.log("It doesn't seem to be a text file!");
                }
                reader.readAsText(file);
            }
        } else {
            alert("Your browser is too old to support HTML5 File API");
        }
    }


    let gameState = {tickState: false, tickRate: false, completeTick: 10, currentTick: 0, date: false, currentDay: 1, cash: 500, patientCap: false, custFocus: false, employeeFocus: false, conditionFocus: false, charGen: false, buildFocus: false, buildTypeFocus: false, buildItemFocus: false}

    function startUp() {
        researchSetup()
        load();
        buildingSetup();
    }

    function turnTick() {
        if(gameState.date === false) {
            gameState.date = calendarFunc(gameState.date)
        }
        if(gameState.patientCap === false) {
            gameState.patientCap = capacityCheck() + 1;
        }
        if(gameState.tickState) {
            customerBoxSetup();
            custGenerator();
            custChances();
            requestCheck();
            progressBoxSetup();
            if(gameState.custFocus) {
                custDetailSetup(gameState.custFocus);
            }
            if(expeditionArray.sector) {
                sectorExpeditionRun(expeditionArray.sector)
            }
        }
        if(gameState.tickState === true && gameState.currentTick === gameState.completeTick) {
            if(gameState.employeeFocus) {
                console.log(gameState)
                employeeDetailSetup(gameState.employeeFocus)
            }
            let chosenRes;
            gameState.charGen = false;
            // Moves the current day up by 1
            calendarFunc(gameState.date)
            // Runs a building check
            //buildRun();
            if(gameState.conditionFocus) {
                conditioningRun(gameState.conditionFocus)
            }
            // Resets current tick
            gameState.currentTick = 0;
            turnBar(gameState.currentTick, gameState.completeTick)
            // Finds the currently selected research
            for (let i = 0; i < researchTree.length; i++) {
                if (researchTree[i].active == true) {
                    chosenRes = researchTree[i]
                }
            }
            // Checks to see if the chosen research was selected
            if(chosenRes) {
                let finishedResearch = document.getElementById(chosenRes.id)
                // If the current research matches the cost it unlocks it and than removes the research slot from available options
                if (chosenRes.currentResearch == chosenRes.cost) {
                    finishedResearch.innerText = chosenRes.name + "\n" + "Finished"
                    finishedResearch.setAttribute("class", "researchPanelComplete")
                    $("#" + chosenRes.id).off('click');
                    console.log(chosenRes.researchItem)
                    let unlocked = $.grep(buildings, function (n, i) {
                        return n.id === chosenRes.researchItem;
                    });
                    console.log(unlocked)

                    let unlockedGroup = $.grep(buildingTypes, function (n, i) {
                        return n.id === unlocked[0].type
                    })
                    console.log(unlockedGroup)
                    unlocked[0].unlocked = true;
                    unlockedGroup[0].unlocked = true;
                    chosenRes.unlocked = true;
                    chosenRes.active = false;
                    chosenRes = false;
                    return 0;
                }
                // Moves currentResearch up by one tick since it doesnt match cost
                chosenRes.currentResearch += 1;
                finishedResearch.innerText = chosenRes.name + "\n" + "Current Research: " + chosenRes.currentResearch + "/" + chosenRes.cost;
            }
        }
        else if (gameState.tickState === true && gameState.currentTick < gameState.completeTick) {
            console.log("Howdy")
            gameState.currentTick = gameState.currentTick +  1;
            turnBar(gameState.currentTick, gameState.completeTick)
        }
        updateUI();
    }


    function updateUI() {
        $("#incomeStat").text("Cash: " + gameState.cash);
        $("#dayStat").text(gameState.date.week + " " + gameState.date.month.name + " "+ gameState.date.day);
        screenCheck();
    }


    function turnBar(x, y) {
        const turnBar = document.getElementById("turnTickerProgress");
        let tick = x;
        let turnTickerProgress = tick * 10;
        console.log(turnTickerProgress)
        const completeTick = y * 10;

        if (turnTickerProgress <= completeTick) {
            turnBar.style.width = turnTickerProgress + '%';
        }

        else if (turnTickerProgress > completeTick) {
            turnBar.style.width = '0%';
        }
    }

    const custHairType = ["wavy", "curly", "straight", "kinky"]
    const custHairColor = ["brown", "red", "blonde", "black", "gray"];

    const custNamesMasc = ["George", "Sam", "Frank", "Thom", "Rand", "Perrin", "Mat"];
    const custNamesFem = ["Verin", "Egwene", "Chloe", "Min", "Maia", "Melody", "Moraine"];
    const custNamesAndro = ["Sky", "Nova", "Tar", "Luna", "Cal", "Grey", "Nel"];

    const custGender = ["nonbinary", "man", "woman"];
    let genderSpec, name, internalName, pronouns, custBodyType, assignedGender, genitalia;

    let bodyOptionsArray = {
        genderAmab: [
            {groupId: "genderAmab", id: "bodyTypeHourglass", roll:0.02, name: "hourglass", type: "notThin"},
            {groupId: "genderAmab", id: "bodyTypeCurvy", roll:0.10, name: "curvy", type: "notThin"},
            {groupId: "genderAmab", id: "bodyTypeLanky", roll:0.40, name: "lanky", type: "thin"},
            {groupId: "genderAmab", id: "bodyTypeStocky", roll:0.60, name: "stocky", type: "notThin"},
            {groupId: "genderAmab", id: "bodyTypeSlight", roll:0.80, name: "slight", type: "thin"},
            {groupId: "genderAmab", id: "bodyTypeBulky", roll:1, name: "bulky", type: "notThin"},
        ],

        genderAfab: [
            {groupId: "genderAfab", id: "bodyTypeHourglass", roll:0.20, name: "hourglass", type: "notThin"},
            {groupId: "genderAfab", id: "bodyTypeCurvy", roll:0.40, name: "curvy", type: "notThin"},
            {groupId: "genderAfab", id: "bodyTypeLanky", roll:0.60, name: "lanky", type: "thin"},
            {groupId: "genderAfab", id: "bodyTypeStocky", roll:0.70, name: "stocky", type: "notThin"},
            {groupId: "genderAfab", id: "bodyTypeSlight", roll:0.85, name: "slight", type: "thin"},
            {groupId: "genderAfab", id: "bodyTypeBulky", roll:1, name: "bulky", type: "notThin"},
        ],

        custSkin: ["white", "brown", "black", "tan"],

        custHeight: ["tall", "short", "average"],

        eyeColor: [
            {groupId: "eyeColor", id: "eyeColorBrown", name:"brown"},
            {groupId: "eyeColor", id: "eyeColorGreen",  name:"green"},
            {groupId: "eyeColor", id: "eyeColorBlue",  name:"blue"},
            {groupId: "eyeColor", id: "eyeColorGray",  name:"gray"},
            {groupId: "eyeColor", id: "eyeColorBlack",  name:"black"},
        ],

        eyeShape: [
            {groupId: "eyeShape", id: "eyeShapeOval",  name:"oval"},
            {groupId: "eyeShape", id: "eyeShapeRound",  name:"round"},
            {groupId: "eyeShape", id: "eyeShapeHooded",  name:"hooded"},
            {groupId: "eyeShape", id: "eyeShapeAlmond", name:"almond"},
        ],

        noseShape: [
            {groupId: "noseShape", id: "noseShapeCrooked",  name:"crooked"},
            {groupId: "noseShape", id: "noseShapeButton", name:"button"},
            {groupId: "noseShape", id: "noseShapeStraight", name:"straight"},
            {groupId: "noseShape", id: "noseShapeHawk", name:"hawk"},
            {groupId: "noseShape", id: "noseShapeFlat", name:"flat"},
        ],

        earShape: [
            {groupId: "earShape", id: "earShapeRound", name:"round"},
            {groupId: "earShape", id: "earShapePointy", name:"pointy"},
            {groupId: "earShape", id: "earShapeBroad", name:"broad"},
        ],

        lipSize: [
            {groupId: "lipSize", id: "lipSizeThin", name: "thin"},
            {groupId: "lipSize", id: "lipSizeFull", name: "full"},
            {groupId: "lipSize", id: "lipSizePlump", name: "plump"},
        ],

        genitaliaSizeAmab: [
            {groupId: "genitaliaSizeAmab", id: "genitaliaCockTiny" , roll: 0.2, name: "tiny", namePlus: "tiny cock", nameMinus: "cock", desc: " a tiny cock", partType: "genitaliaSize"},
            {groupId: "genitaliaSizeAmab", id: "genitaliaCockSmall" , roll: 0.4, name: "small", namePlus: "small cock", nameMinus: "cock", desc: " a small cock", partType: "genitaliaSize"},
            {groupId: "genitaliaSizeAmab", id: "genitaliaCockAverage" , roll: 0.6, name: "average", namePlus: "average cock", nameMinus: "cock", desc: " a average cock", partType: "genitaliaSize"},
            {groupId: "genitaliaSizeAmab", id: "genitaliaCockLarge" , roll: 0.8, name: "large", namePlus: "large cock", nameMinus: "cock", desc: " a large cock", partType: "genitaliaSize"},
            {groupId: "genitaliaSizeAmab", id: "genitaliaCockHuge" , roll: 0.9, name: "huge", namePlus: "huge cock", nameMinus: "cock", desc: " a huge cock", partType: "genitaliaSize"},
            {groupId: "genitaliaSizeAmab", id: "genitaliaCockMassive", roll: 1, name: "massive", namePlus: "massive cock", nameMinus: "cock", desc: " a massive cock", partType: "genitaliaSize"},
        ],

        genitaliaSizeAfab: [
            {groupId: "genitaliaSizeAfab", id: "genitaliaVagina", name: "pussy", namePlus: "pussy", nameMinus: "pussy", desc: " a pussy", partType: "genitaliaSize"},
        ],

        assShapeThin: [
            {groupId: "assShapeThin", id: "assShapePerky", name: "perky", roll:0.35, partType: "assShape"},
            {groupId: "assShapeThin", id: "assShapeRound", name: "round", roll:0.7, partType: "assShape"},
            {groupId: "assShapeThin", id: "assShapeHeart", name: "heart-shaped", roll:0.95, partType: "assShape"},
            {groupId: "assShapeThin", id: "assShapeFlat", name: "flat", roll:1, partType: "assShape"},
        ],
        assShapeThick: [
            {groupId: "assShapeThick", id: "assShapePerky", name: "perky",  roll:0.35, partType: "assShape"},
            {groupId: "assShapeThick", id: "assShapeRound", name: "round", roll:0.7, partType: "assShape"},
            {groupId: "assShapeThick", id: "assShapeHeart", name: "heart-shaped", roll:0.95, partType: "assShape"},
            {groupId: "assShapeThick", id: "assShapeFlat", name: "flat", roll:1, partType: "assShape"},
        ],

        assSizeThick: [
            {groupId: "assSizeThick", id: "assSizeNonexistent", name: "tiny", roll:0, partType: "assSize", scale: -2},
            {groupId: "assSizeThick", id: "assSizeSmall", name: "small", roll:0.10, partType: "assSize", scale: -1},
            {groupId: "assSizeThick", id: "assSizePlump", name: "plump", roll:0.50, partType: "assSize", scale: 1},
            {groupId: "assSizeThick", id: "assSizeFat", name: "fat", roll:0.70, partType: "assSize", scale: 1},
            {groupId: "assSizeThick", id: "assSizeThick", name: "thick", roll:95, partType: "assSize", scale:1},
            {groupId: "assSizeThick", id: "assSizeBubble", name: "bubble", roll:1, partType: "assSize", scale: 2},
        ],

        assSizeThin: [
            {groupId: "assSizeThin", id: "assSizeNonexistent", name: "tiny", roll:0.35, partType: "assSize", scale: -2},
            {groupId: "assSizeThin", id: "assSizeSmall", name: "small",  roll:0.85, partType: "assSize", scale: -1},
            {groupId: "assSizeThin", id: "assSizePlump", name: "plump", roll:1, partType: "assSize", scale: 1},
            {groupId: "assSizeThin", id: "assSizeFat", name: "large", roll:0, partType: "assSize", scale: 1},
            {groupId: "assSizeThin", id: "assSizeThick", name: "thick",  roll:0, partType: "assSize", scale:1},
            {groupId: "assSizeThin", id: "assSizeBubble", name: "bubble", roll:0, partType: "assSize", scale: 2},
        ],

        thighSizeThick: [
            {groupId: "thighSizeThick", id: "thighSizeVeryThin", name: "very thin", roll:0, partType: "thighSize", scale: -2},
            {groupId: "thighSizeThick", id: "thighSizeThin", name: "thin", roll:0.05, partType: "thighSize", scale: -1},
            {groupId: "thighSizeThick", id: "thighSizePlump", name: "plump", roll:0.60, partType: "thighSize", scale: 1},
            {groupId: "thighSizeThick", id: "thighSizeThick", name: "thick", roll:1, partType: "thighSize", scale: 2},
        ],

        thighSizeThin: [
            {groupId: "thighSizeThin", id: "thighSizeVeryThin", name: "very thin", roll:0.25, partType: "thighSize", scale: -2},
            {groupId: "thighSizeThin", id: "thighSizeThin", name: "thin", roll:0.80, partType: "thighSize", scale: -1},
            {groupId: "thighSizeThin", id: "thighSizePlump", name: "plump", roll:0.95, partType: "thighSize", scale: 1},
            {groupId: "thighSizeThin", id: "thighSizeThick", name: "thick", roll:1, partType: "thighSize", scale: 2},
        ],

        breastSizeThin: [
            {groupId: "breastSizeThin", id: "breastSizeFlat", nameFem: "flat", nameMasc: "flat", nameAndro: "flat",  descName: " a flat chest", roll:0.40, partType: "breastSize", scale: -2},
            {groupId: "breastSizeThin", id: "breastSizeTiny", nameFem: "tiny", nameMasc: "pecks", nameAndro: "pecks", descName: " a pair of tiny breasts", roll:0.60, partType: "breastSize", scale: -1},
            {groupId: "breastSizeThin", id: "breastSizeSmall", nameFem: "small", nameMasc: "moobs", nameAndro: "thoobs", descName: " a pair of small breasts", roll:0.75, partType: "breastSize", scale: -1},
            {groupId: "breastSizeThin", id: "breastSizeAverage", nameFem: "average", nameMasc: "average", nameAndro: "average", descName: " a pair of average breasts", roll:0.85, partType: "breastSize", scale: 0},
            {groupId: "breastSizeThin", id: "breastSizeLarge", nameFem: "large", nameMasc: "large", nameAndro: "large", descName: " a pair of large breasts", roll:0.9, partType: "breastSize", scale:1},
            {groupId: "breastSizeThin", id: "breastSizeFat", nameFem: "fat", nameMasc: "fat", nameAndro: "fat", descName: " a pair of fat breasts", roll:0.95, partType: "breastSize", scale: 1},
            {groupId: "breastSizeThin", id: "breastSizeHuge", nameFem: "huge", nameMasc: "huge", nameAndro: "huge", descName: " a pair of huge breasts", roll:1, partType: "breastSize", scale: 2},
        ],

        breastSizeThick : [
            {groupId: "breastSizeThick", id: "breastSizeFlat", nameFem: "flat", nameMasc: "flat", nameAndro: "flat", descName: " a flat chest", roll:0.05, partType: "breastSize", scale: -2},
            {groupId: "breastSizeThick", id: "breastSizeTiny", nameFem: "tiny", nameMasc: "pecks", nameAndro: "pecks", descName: " a pair of tiny breasts", roll:0.10, partType: "breastSize", scale: -1},
            {groupId: "breastSizeThick", id: "breastSizeSmall", nameFem: "small", nameMasc: "moobs", nameAndro: "thoobs", descName: " a pair of small breasts", roll:0.20, partType: "breastSize", scale: -1},
            {groupId: "breastSizeThick", id: "breastSizeAverage", nameFem: "average",nameMasc: "average", nameAndro: "average", descName: " a pair of average breasts", roll:0.45, partType: "breastSize", scale: 0},
            {groupId: "breastSizeThick", id: "breastSizeLarge", nameFem: "large", nameMasc: "large", nameAndro: "large", descName: " a pair of large breasts", roll:0.65, partType: "breastSize", scale: 1},
            {groupId: "breastSizeThick", id: "breastSizeFat", nameFem: "fat", nameMasc: "fat", nameAndro: "fat", descName: " a pair of fat breasts", roll:0.9, partType: "breastSize", scale: 1},
            {groupId: "breastSizeThick", id: "breastSizeHuge", nameFem: "huge", nameMasc: "huge",nameAndro: "huge", descName: " a pair of huge breasts", roll:1, partType: "breastSize", scale: 2},
        ],

        waistSizeThin : [
            {groupId: "waistSizeThin", id: "waistSizeTiny", name: "tiny", descName: " a tiny waist", roll:0.35, partType: "waistSize", scale: -2},
            {groupId: "waistSizeThin", id: "waistSizeSmall", name: "small", descName: " a small waist", roll:0.75, partType: "waistSize", scale: -1},
            {groupId: "waistSizeThin", id: "waistSizeAverage", name: "average", descName: " a average waist", roll:0.90, partType: "waistSize", scale: 0},
            {groupId: "waistSizeThin", id: "waistSizeThick", name: "thick",  descName: " a thick waist", roll:1, partType: "waistSize", scale: 1},
            {groupId: "waistSizeThin", id: "waistSizeVeryThick", name: "very thick", descName: " a very thick waist", roll:0, partType: "waistSize", scale: 2},
        ],
        waistSizeThick : [
            {groupId: "waistSizeThick", id: "waistSizeTiny", name: "tiny",  descName: " a tiny waist", roll:0, partType: "waistSize", scale: -2},
            {groupId: "waistSizeThick", id: "waistSizeSmall", name: "small",  descName: " a small waist", roll:0.10, partType: "waistSize", scale: -1},
            {groupId: "waistSizeThick", id: "waistSizeAverage", name: "average", descName: " a average waist", roll:0.45, partType: "waistSize", scale: 0},
            {groupId: "waistSizeThick", id: "waistSizeThick", name: "thick", descName: " a thick waist", roll:0.80, partType: "waistSize", scale: 1},
            {groupId: "waistSizeThick", id: "waistSizeVeryThick", name: "very thick", descName: " a very thick waist", roll:1, partType: "waistSize", scale: 2},
        ],
        hipSizeThin : [
            {groupId: "hipSizeThin", id: "hipSizeVerySmall", name: "very small",  descName: " very small hips", roll:0.25, partType: "hipSize", scale: -2},
            {groupId: "hipSizeThin", id: "hipSizeSmall", name: "small", descName: " small hips", roll:0.50, partType: "hipSize", scale: -1},
            {groupId: "hipSizeThin", id: "hipSizeAverage", name: "average", descName: " average hips", roll:0.85, partType: "hipSize", scale: 0},
            {groupId: "hipSizeThin", id: "hipSizePlump", name: "plump",  descName: " plump hips", roll:0.95, partType: "hipSize", scale: 1},
            {groupId: "hipSizeThin", id: "hipSizeThick", name: "thick", descName: " thick hips", roll:1, partType: "hipSize", scale: 2},
        ],

        hipSizeThick : [
            {groupId: "hipSizeThick", id: "hipSizeVerySmall", name: "very small",  descName: " very small hips", roll:0.05, partType: "hipSize", scale: -2},
            {groupId: "hipSizeThick", id: "hipSizeSmall", name: "small",  descName: " small hips", roll:0.15, partType: "hipSize", scale: -1},
            {groupId: "hipSizeThick", id: "hipSizeAverage", name: "average",  descName: " average hips", roll:0.50, partType: "hipSize", scale: 0},
            {groupId: "hipSizeThick", id: "hipSizePlump", name: "plump",  descName: " plump hips", roll:0.80, partType: "hipSize", scale: 1},
            {groupId: "hipSizeThick", id: "hipSizeThick", name: "thick",  descName: " thick hips", roll:1, partType: "hipSize", scale: 2},
        ],

    }

    const pronounArray = [
        {id: "pronounsMasc", identifyPronoun: "his", identifyPronounC: "His", referPronoun: "he", referPronounC: "He"},
        {id: "pronounsFem", identifyPronoun: "her", identifyPronounC: "Her", referPronoun: "she", referPronounC: "She"},
        {id: "pronounsNonbinary", identifyPronoun: "their", identifyPronounC: "Their", referPronoun: "they", referPronounC: "They"}
    ]


    const intelligenceScale = [

    ];

    const willpowerScale = [

    ]

    const traitsArray = [

    ]

    const thiccScale = [
        {id: "thiccScaleExtremelyThin", scale: -8, name: "Extremely Thin", nameL: "extremely thin"},
        {id: "thiccScaleVeryThin", scale: -6, name: "Very Thin", nameL: "very thin"},
        {id: "thiccScaleThin", scale: -4, name: "Thin", nameL: "thin"},
        {id: "thiccScaleSkinny", scale: -2, name: "Skinny", nameL: "skinny"},
        {id: "thiccScaleAverage", scale: 2, name: "Average", nameL: "average"},
        {id: "thiccScalePlump", scale: 4, name: "Plump", nameL: "plump"},
        {id: "thiccScaleThick", scale: 6, name: "Thick", nameL: "thick"},
        {id: "thiccScaleVeryThick", scale: 8, name: "Very Thick", nameL: "very thick"},
        {id: "thiccScaleExtremelyThick", scale: 10, name: "Extremely Thick", nameL: "extremely thick"},
    ]



    const kinkGeneral = [
        {kinkGroup: "petPlay", id: "puppyPlay", name: "Puppy Play"},
        {kinkGroup: "petPlay", id: "kittyPlay", name: "Kitty Play"},
        {kinkGroup: "farmPlay", id: "horsePlay", name: "Horse Play"},
        {kinkGroup: "farmPlay", id: "cowPlay", name: "Cow Play"},
    ]

    const plinkDesc = [

        { lvl: 0, active: false},
        { lvl: 25, active: true, desc: "Level 1", stars: 1 },
        { lvl: 50, active: true, desc: "Level 2", stars: 2 },
        { lvl: 75, active: true, desc: "Level 3", stars: 3 },
        { lvl: 100, active: true, desc: "Level 4", stars: 4 }
    ]

    let genderPresentationCategories = [
        {genderPres: "hyperFem", num: 10, name: "Hyper Feminine", color: "#e06666"},
        {genderPres: "veryFem", num: 35, name: "Very Feminine", color: "#ea9999"},
        {genderPres: "fem", num: 65, name: "Feminine", color: "#f4cccc"},
        {genderPres: "someFem", num: 80, name: "Somewhat Feminine", color: "#ead1dc"},
        {genderPres: "andFem", num: 90, name: "Feminine Leaning Androgynous", color: "#d5a6bd"},
        {genderPres: "and", num: 110, name: "Androgynous", color: "#c27ba0"},
        {genderPres: "andMasc", num: 120, name: "Masuline Leaning Androgynous", color: "#cfe2f3"},
        {genderPres: "someMasc", num: 135, name: "Somewhat Masculine", color: "#9fc5e8"},
        {genderPres: "masc", num: 165, name: "Masculine", color: "#6fa8dc"},
        {genderPres: "veryMasc", num: 185, name: "Very Masculine", color: "#3d85c6"},
        {genderPres: "hyperMasc", num: 200, name: "Hyper Masculine", color: "#0b5394"}
    ]

    let statusArrayResistance= [
        {id:"resistance15", name: "Slight Resistance", bottom: 1},
        {id: "resistance30", name: "Resisting", bottom: 15},
        {id: "resistance50", name: "Aggressive", bottom: 30},
        {id: "resistance75", name: "Hostile", bottom: 50},
        {id: "resistance90", name: "Very Hostile", bottom: 75},
        {id: "resistance100", name: "Extremely Hostile", bottom: 90},
        {id: "resistanceMAX", name: "Murderously Hostile", bottom: 100},

    ]

    let statusArrayDevotion = [
        {id: "devotion15", name: "Disrespectful", bottom: 1},
        {id: "devotion25", name: "No respect", bottom: 15},
        {id: "devotion35", name: "Vaguely Respectful", bottom: 25},
        {id: "devotion45", name: "Respectful", bottom: 35},
        {id: "devotion55", name: "Slightly Obedient", bottom: 45},
        {id: "devotion65", name: "Obedient", bottom: 55},
        {id: "devotion75", name: "Eager to Obey", bottom: 65},
        {id: "devotion85", name: "Devoted", bottom: 75},
        {id: "devotion95", name: "Unwaveringly Devoted", bottom: 85},
        {id: "devotion100", name: "Worshipful", bottom: 95},
        {id: "devotionMAX", name: "Divine Worship", bottom: 101},

    ]


    function customerBuilder() {
        let lipSize = bodyOptionsArray.lipSize[Math.floor(Math.random() * (bodyOptionsArray.lipSize).length)]
        let eyes = bodyOptionsArray.eyeColor[Math.floor(Math.random() * (bodyOptionsArray.eyeColor).length)]
        let eyeShape = bodyOptionsArray.eyeShape[Math.floor(Math.random() * (bodyOptionsArray.eyeShape).length)]
        let noseShape = bodyOptionsArray.noseShape[Math.floor(Math.random() * (bodyOptionsArray.noseShape).length)]
        let earShape = bodyOptionsArray.earShape[Math.floor(Math.random() * (bodyOptionsArray.earShape).length)]
        let hair = custHairType[Math.floor(Math.random() * custHairType.length)]
        let hairColor = custHairColor[Math.floor(Math.random() * custHairColor.length)]
        let skin = bodyOptionsArray.custSkin[Math.floor(Math.random() * (bodyOptionsArray.custSkin).length)]
        let height = bodyOptionsArray.custHeight[Math.floor(Math.random() * (bodyOptionsArray.custHeight).length)]
        let gender = custGender[Math.floor(Math.random() * custGender.length)]
        let presentation;

        // Gender Identity and bodytype defining function
        if(gender == "man") {
            assignedGender = "amab"
            presentation = "masc";
            pronouns = pronounArray[0]
            let chance = Math.random();
            name = custNamesMasc[Math.floor(Math.random() * custNamesMasc.length)]
            internalName = name
            if(chance < 0.8) {
                genderSpec = Math.floor(Math.random() * 35) + 130
            }
            else if(chance < 0.9) {
                genderSpec = Math.floor(Math.random() * 30) + 100
            }
            else {
                genderSpec = Math.floor(Math.random() * 35) + 165
            }

            if(genderSpec) {
                let rand = Math.random();
                for(let i = 0; i < bodyOptionsArray.genderAmab.length; i++) {
                    if(rand < bodyOptionsArray.genderAmab[i].roll) {
                        custBodyType = 	bodyOptionsArray.genderAmab[i];
                        break;
                    }
                }
            }
        }

        else if(gender == "woman") {
            assignedGender = "afab"
            presentation = "fem";
            pronouns = pronounArray[1]
            name = custNamesFem[Math.floor(Math.random() * custNamesFem.length)]
            internalName = name
            let chance = Math.random();
            if(chance < 0.8) {
                genderSpec = Math.floor(Math.random() * 30) + 35
            }
            else if(chance < 0.90) {
                genderSpec = Math.floor(Math.random() * 35) + 15
            }
            else {
                genderSpec = Math.floor(Math.random() * 35) + 65
            }
            if(genderSpec) {
                let rand = Math.random();
                for(let i = 0; i < bodyOptionsArray.genderAfab.length; i++) {
                    if(rand < bodyOptionsArray.genderAfab[i].roll) {
                        custBodyType = 	bodyOptionsArray.genderAfab[i];
                        break;
                    }
                }
            }
        }
        // Nonbinary function
        else {
            genderSpec = Math.floor(Math.random() * 200)
            let roll = Math.floor(Math.random() * 1)
            if (genderSpec > 125) {
                name = custNamesMasc[Math.floor(Math.random() * custNamesMasc.length)]
                presentation = "masc";
            }
            else if (genderSpec < 75) {
                name = custNamesFem[Math.floor(Math.random() * custNamesFem.length)]
                presentation = "fem";
            }
            else {
                name = custNamesAndro[Math.floor(Math.random() * custNamesAndro.length)]
                presentation = "andro";
            }

            let assignedGen = Math.floor(Math.random() * 2)
            let chosenArray;
            if(assignedGen == 1) {
                chosenArray = bodyOptionsArray.genderAmab
                assignedGender = "amab"
            }
            else {
                chosenArray = bodyOptionsArray.genderAfab
                assignedGender = "afab"
            }
            pronouns = pronounArray[2]



            if(genderSpec) {
                let rand = Math.random();
                for(let i = 0; i < chosenArray.length; i++) {
                    if(rand < chosenArray[i].roll) {
                        custBodyType = 	chosenArray[i];
                        break;
                    }
                }
            }
        }

        if(custBodyType) {
            if(custBodyType.type == "notThin") {
                for(let k = 0; k < 6; k++) {
                    if(k == 0) {
                        let rand = Math.random();
                        for(let i = 0; i < bodyOptionsArray.assShapeThick.length; i++) {
                            if(rand < bodyOptionsArray.assShapeThick[i].roll) {
                                var custAssShape = bodyOptionsArray.assShapeThick[i];
                                break;
                            }
                        }
                    }
                    else if(k == 1) {
                        let rand = Math.random();
                        for(let i = 0; i < bodyOptionsArray.assSizeThick.length; i++) {
                            if(rand <= bodyOptionsArray.assSizeThick[i].roll) {
                                custAssSize = bodyOptionsArray.assSizeThick[i];
                                console.log(custAssSize.id + " " + bodyOptionsArray.assSizeThick[i].id)
                                break;
                            }
                        }
                    }
                    else if(k == 2) {
                        let rand = Math.random();
                        for(let i = 0; i < bodyOptionsArray.thighSizeThick.length; i++) {
                            if(rand < bodyOptionsArray.thighSizeThick[i].roll) {
                                custThighSize = bodyOptionsArray.thighSizeThick[i];
                                break;
                            }
                        }
                    }

                    else if(k == 3) {
                        let rand = Math.random();
                        for(let i = 0; i < bodyOptionsArray.waistSizeThick.length; i++) {
                            if(rand < bodyOptionsArray.waistSizeThick[i].roll) {
                                custWaistSize = bodyOptionsArray.waistSizeThick[i];
                                break;
                            }
                        }
                    }

                    else if(k == 4) {
                        let rand = Math.random();
                        for(let i = 0; i < bodyOptionsArray.hipSizeThick.length; i++) {
                            if(rand < bodyOptionsArray.hipSizeThick[i].roll) {
                                custHipSize = bodyOptionsArray.hipSizeThick[i];
                                break;
                            }
                        }
                    }

                    else {
                        if(assignedGender == "afab") {
                            let rand = Math.random();
                            genitalia = bodyOptionsArray.genitaliaSizeAfab[Math.floor(Math.random() * (bodyOptionsArray.genitaliaSizeAfab).length)]
                            for(let i = 0; i < bodyOptionsArray.breastSizeThick.length; i++) {
                                if(rand < bodyOptionsArray.breastSizeThick[i].roll) {
                                    custBreastSize = bodyOptionsArray.breastSizeThick[i];
                                    break;
                                }
                            }
                        }
                        else {
                            let num;
                            let rand = Math.random();
                            if(rand < 0.30) {
                                num = 0;
                            }
                            else if(rand < 0.65) {
                                num = 1;
                            }
                            else if(rand < 1) {
                                num = 2;
                            }
                            custBreastSize = bodyOptionsArray.breastSizeThick[num]
                            rand = Math.random();
                            for(let i = 0; i < bodyOptionsArray.genitaliaSizeAmab.length; i++) {
                                if(rand < bodyOptionsArray.genitaliaSizeAmab[i].roll) {
                                    genitalia = bodyOptionsArray.genitaliaSizeAmab[i];
                                    break;
                                }
                            }
                        }

                    }
                }
            }
            else if(custBodyType.type == "thin") {
                for(let k = 0; k < 6; k++) {
                    if(k == 0) {
                        let rand = Math.random();
                        for(let i = 0; i < bodyOptionsArray.assShapeThin.length; i++) {
                            if(rand < bodyOptionsArray.assShapeThin[i].roll) {
                                var custAssShape = bodyOptionsArray.assShapeThin[i];
                                break;
                            }
                        }
                    }
                    else if(k == 1) {
                        let rand = Math.random();
                        for(let i = 0; i < bodyOptionsArray.assSizeThin.length; i++) {
                            if(rand <= bodyOptionsArray.assSizeThin[i].roll) {
                                var custAssSize = bodyOptionsArray.assSizeThin[i];
                                console.log(custAssSize.id + " " + bodyOptionsArray.assSizeThin[i].id)
                                break;
                            }
                        }
                    }
                    else if(k == 2) {
                        let rand = Math.random();
                        for(let i = 0; i < bodyOptionsArray.thighSizeThin.length; i++) {
                            if(rand < bodyOptionsArray.thighSizeThin[i].roll) {
                                var custThighSize = bodyOptionsArray.thighSizeThin[i];
                                break;
                            }
                        }
                    }

                    else if(k == 3) {
                        let rand = Math.random();
                        for(let i = 0; i < bodyOptionsArray.waistSizeThin.length; i++) {
                            if(rand < bodyOptionsArray.waistSizeThin[i].roll) {
                                var custWaistSize = bodyOptionsArray.waistSizeThin[i];
                                break;
                            }
                        }
                    }

                    else if(k == 4) {
                        let rand = Math.random();
                        for(let i = 0; i < bodyOptionsArray.hipSizeThin.length; i++) {
                            if(rand < bodyOptionsArray.hipSizeThin[i].roll) {
                                var custHipSize = bodyOptionsArray.hipSizeThin[i];
                                break;
                            }
                        }
                    }

                    else {
                        if(assignedGender == "afab") {
                            let rand = Math.random();
                            genitalia = bodyOptionsArray.genitaliaSizeAfab[Math.floor(Math.random() * (bodyOptionsArray.genitaliaSizeAfab).length)]
                            for(let i = 0; i < bodyOptionsArray.breastSizeThin.length; i++) {
                                if(rand < bodyOptionsArray.breastSizeThin[i].roll) {
                                    var custBreastSize = bodyOptionsArray.breastSizeThin[i];
                                    break;
                                }
                            }
                        }
                        else {
                            let num;
                            let rand = Math.random();
                            if(rand < 0.55) {
                                num = 0;
                            }
                            else if(rand < 0.80) {
                                num = 1;
                            }
                            else if(rand < 1) {
                                num = 2;
                            }
                            custBreastSize = bodyOptionsArray.breastSizeThin[num]
                            rand = Math.random();
                            for(let i = 0; i < bodyOptionsArray.genitaliaSizeAmab.length; i++) {
                                if(rand < bodyOptionsArray.genitaliaSizeAmab[i].roll) {
                                    genitalia = bodyOptionsArray.genitaliaSizeAmab[i];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        let resistance = Math.floor(Math.random() * 100)
        if (resistance < 40) {
            resistance += 30;
        }

        let intelligence = Math.floor(Math.random() * 80)
        if (intelligence < 20) {
            intelligence += 15;
        }

        let willpower = Math.floor(Math.random() * 75)
        if (willpower < 20) {
            willpower += 15;
        }
        willpower = willpower / 10;
        console.log(willpower)

        let id = gender + height + skin + resistance + "ID"

        let bodyPreference = thiccScale[Math.floor(Math.random() * thiccScale.length)].id

        let head = { hairType: hair, hairColor: hairColor, eyeColor: eyes, eyeShape: eyeShape, noseShape: noseShape, earShape: earShape, lipSize: lipSize}
        let ass = {assSize: custAssSize, assShape: custAssShape};
        let chest = {breastSize: custBreastSize};
        let thigh = {thighSize: custThighSize};
        let hips = {waistSize: custWaistSize, hipSize: custHipSize};

        let body = {head: head, ass: ass, thigh: thigh, genitalia: genitalia, chest: chest, hips: hips}

        const completeCustomer = { customerName: name, customerNamePlural: name + "'s", customerInternalName: internalName, customerGender: gender, customerGenderSpec: genderSpec, presentation: presentation, pronouns: pronouns, kinks: false, customerBodyType: custBodyType, customerHeight: height, customerBody: body, customerHair: hair, customerHairColor: hairColor, customerSkin: skin, custId: id, employee: false, request: false, assignedDoll: false, assignedCust: false, activeDoll: false, patience: 10, tick: 0, requestFulfillment: false, fulfilled: false, totalToPay: false, spawn: true, thiccScale: false, bodyPreference: bodyPreference, analVirgin: true, oralVirgin: true, occupation: false, resistance: resistance, devotion: 0, intelligence: intelligence, willpower: willpower, arousal: false, def: 1.5};

        kinkSetup(completeCustomer);
        completeCustomer.thiccScale = thiccScaleFunc(completeCustomer)
        requestSetup(completeCustomer);

        console.log(completeCustomer)
        console.log("A customer enters the Spa. They are a " + height + " " + gender + " named " + name + " with a " + custBodyType.name + " build. " + "They have " + eyes.name + " eyes, " + hair + " hair, and " + skin + " skin.")
        return completeCustomer

    }
    let newCust = customerBuilder();
    currentCustomers.push(newCust)
    let custSelected = currentCustomers[0]
    currentCustomers[0].employee = true;
    employees.push(currentCustomers[0])
    let newCustomerArray = [];
    for(let c = 0; c < currentCustomers.length; c++) {
        if(currentCustomers[c].employee != true) {
            newCustomerArray[c] = (currentCustomers[c])
        }
    }
    currentCustomers = newCustomerArray;
    console.log(currentCustomers)
    customerBuilder();

    function kinkSetup(x) {
        let cust = x;
        let kinkAmount = Math.floor(Math.random() * 3) + 1
        let kinkPicked = [];
        let check, kink;
        for (let i = 0; i < kinkAmount; i++) {
            let kinkChosen = kinkGeneral[Math.floor(Math.random() * kinkGeneral.length)]
            if(kinkPicked) {
                check = $.grep(kinkPicked, function (n, i) {
                    return n === kinkChosen.id;
                });
                while(check.length != 0) {
                    if(check.length != 0) {
                        kinkChosen = kinkGeneral[Math.floor(Math.random() * kinkGeneral.length)]
                        check = $.grep(kinkPicked, function (n, i) {
                            return n === kinkChosen.id;
                        });
                    }
                    else {
                        break;
                    }

                }
            }
            if(check.length == 0) {
                let kinkInterest = Math.floor(Math.random() * 30) + 1
                kinkPicked.push(kinkChosen.id)
                if(!kink) {
                    kink = kinkChosen.id + "SLICE" + kinkInterest
                }
                else {
                    kink = kink + "SLICE" + kinkChosen.id + "SLICE" + kinkInterest
                }
            }
            cust.kinks = kink
        }
    }

    let custPreferences = [
        {groupId: "bodyPref", id: "bodyPrefThicc", name: "Puppy Play Preference", desc: "This customer prefers their dolls on the thicker side.", trait: "assSize" },
        {groupId: "bodyPref", id: "bodyPrefThin", name: "Kitty Play Preference", desc: "This customer prefers their a doll who meows and purrs.", trait: "kinks/kittyPlay" },
    ]

    function requestSetup(x) {
        let requestsArray = [
            {requestId: "requestMassageBasic", eventId: "eventMassageBasic", name: "Bear Fight", tick: 2, tickProgress: 0, basePay: 25},
            {requestId: "requestHandjob", eventId: "eventHandjob", name: "Hat Contest", tick: 2, tickProgress: 0, basePay: 50},
            {requestId: "requestBlowjob", eventId: "eventBlowjob", name: "Business Fair", tick: 3, tickProgress: 0, basePay: 75},
            {requestId: "requestSex", eventId: "eventSex", name: "Gex", tick: 4, tickProgress: 0, basePay: 125},
            {requestId: "requestAnalSex", eventId: "eventAnalSex", name: "Hill Raising", tick: 4 ,tickProgress: 0, basePay: 150},
        ]

        let cust = x;
        let request = requestsArray[Math.floor(Math.random() * requestsArray.length)]
        cust.request = request;
    }
    let currentCustFocus, previousCustomers;
    function customerBoxSetup() {
        try {
            if (currentCustomers) {
                let customerAmount = currentCustomers.length;
                $("#customerDivContainer").empty();
                for (let i = 0; i < customerAmount; i++) {
                    if(currentCustomers[i].employee != true ) {
                        let selected = currentCustomers[i]
                        let page = document.getElementById("patientBox")
                        let custDivContainer = document.getElementById("customerDivContainer")
                        let custDiv = document.createElement("div");
                        let custDetail = document.createElement("div")
                        let custDetailImg = document.createElement("img");
                        let custDetailP = document.createElement("p");
                        let custDetailBtn = document.createElement("button");
                        let custRequest = document.createElement("div")
                        let custRequestInfo = document.createElement("p")
                        let custRequestBtn = document.createElement("button")
                        let fulfillmentBox = document.createElement("div")
                        let fulfillmentBar = document.createElement("div");
                        let fulfillmentProgressBar = document.createElement("div");

                        custDiv.setAttribute("class", "customerDiv")
                        custDiv.setAttribute("id", selected.custId + "CustDiv")
                        custDetailBtn.setAttribute("id", selected.custId)
                        custRequestBtn.setAttribute("id", selected.custId + "RequestBtn")
                        //custRequestBtn.setAttribute("class", "btn")
                        //custDetailBtn.setAttribute("class", "btn")
                        custRequestInfo.setAttribute("class", "textGen")
                        custDetailImg.setAttribute("class", "img")

                        fulfillmentBar.setAttribute("id", "fulfillmentBar");
                        fulfillmentProgressBar.setAttribute("id", "fulfillmentProgress");

                        let ticks = selected.request.tick
                        let totalTick = 100 / ticks
                        let fulfillmentProgress = selected.request.tickProgress * totalTick
                        fulfillmentProgressBar.style.width = fulfillmentProgress + '%'
                        custRequestBtn.innerText = "Fulfill Request"
                        custRequestBtn.style.marginTop = "15px";
                        custRequestInfo.innerText = selected.request.name
                        custDetailP.innerText = "Name: " + selected.customerName + "\n" + "Gender: " + selected.customerGender + "\n"
                        custDetailBtn.innerText = "Customer Details"
                        custDetailImg.src = "../images/Image.jpg"
                        custDetailImg.style.border = "solid"

                        page.append(custDivContainer)
                        custDivContainer.append(custDiv)
                        if(selected.spawn === true) {
                            $("#" + selected.custId + "CustDiv").css({"display": "none"});
                            $("#" + selected.custId + "CustDiv").fadeIn();
                            selected.spawn = false;
                        }
                        custDiv.append(custDetail)
                        custDiv.append(custRequest)
                        custDetail.append(custDetailImg);
                        custDetail.append(custDetailP)
                        custDetail.append(custDetailBtn)
                        custRequest.append(fulfillmentBox)
                        fulfillmentBox.append(custRequestInfo)
                        fulfillmentBox.append(fulfillmentBar);
                        fulfillmentBar.append(fulfillmentProgressBar);
                        custDetailBtn.addEventListener("click", custDetails)
                        fulfillmentBox.append(custRequestBtn)
                        if(currentCustomers[i].requestFulfillment != true) {
                            custRequestBtn.addEventListener("click", function(x) {
                                $(".sidePanel").empty();
                                let selected = x.target.id;
                                let selectedId = selected.replace("RequestBtn", "");
                                let chosenCustomer = $.grep(currentCustomers, function (n, i) {
                                    return n.custId === selectedId;
                                });
                                let currentCust = chosenCustomer[0];
                                if(!currentCust) {
                                    console.log("Well gosh darn tootin it looks like I vanished right after you clicked. Darn shame that is. I sure do reckon I owe you a mighty fine apology. Too bad.")
                                    return 0;
                                }
                                let sidePanel = document.getElementById("sidePanelPatientBox");
                                let sidePanelClose = document.createElement("button")
                                sidePanelClose.setAttribute("class", "textGen")
                                sidePanelClose.innerText = "X"
                                sidePanelClose.style.marginRight = "5px"
                                sidePanelClose.style.marginBottom= "1vw"
                                sidePanel.append(sidePanelClose)

                                let kinks = currentCust.kinks.split("SLICE");

                                sidePanelClose.addEventListener("click", function() {
                                    currentCustFocus = false;
                                    $(".sidePanel").slideUp("slow");
                                })
                                for(let i = 0; i < employees.length; i++) {
                                    sidePanelSetup(sidePanel, employees[i], currentCust, kinks)
                                }

                                $("#sidePanelAnchorPatientBox").show();
                                $(".sidePanel").slideToggle("slow");

                            })
                        }
                        else {
                            $("#" + selected.custId + "RequestBtn").replaceWith("<p>Served By: <br>" + selected.assignedDoll.customerName + "<p>");
                        }
                    }
                }
            }
        } catch (error) {
            console.log("An unexpected error occured: ", error)
        }
        screenCheck();
    }

    function sidePanelSetup(x, y, z, n) {
        let sidePanel = x;
        let employee = y;
        console.log(employee.custId)
        let employeeKinks = employee.kinks.split("SLICE");
        let chosenCustomer = z;
        currentCustFocus = chosenCustomer;
        let chosenCustomerKinks = n;
        let outerDiv = document.createElement("div");
        let toolTip = document.createElement("div");
        let toolTipInner = document.createElement("p");
        let toolTipText;
        let btn = document.createElement("div");
        let btnText = document.createElement("p");
        btnText.setAttribute("class", "textGen")
        btnText.style.color = "pink";
        btn.setAttribute("class", "sidePanelBtn")
        btn.setAttribute("id", employee.custId)
        toolTip.setAttribute("id", employee.custId + "ToolTip")
        toolTip.setAttribute("class", "sidePanelToolTip");
        toolTip.style.display = "none";
        Object.assign(btn.style,{textAlign:"center", border:"solid", borderColor:"pink", background: "purple", alignContent:"center", width:"90%", margin:"auto"});

        let bonus = 0;
        if(chosenCustomerKinks) {
            for(let i = 0; i < chosenCustomerKinks.length; i++) {
                for(let k = 0; k < employeeKinks.length; k++) {
                    if(employeeKinks[k] != chosenCustomerKinks[i]) {
                        k = k + 1;
                    }
                    else {
                        let matchingKink = employeeKinks[k];
                        let matchingKinkSkill = employeeKinks[k+1];
                        let currentBonus;

                        if(matchingKinkSkill < 25) {
                            currentBonus = 1;
                        }
                        else if(matchingKinkSkill < 50) {
                            currentBonus = 2;
                        }
                        else if(matchingKinkSkill < 75) {
                            currentBonus = 3;
                        }
                        else if(matchingKinkSkill < 100) {
                            currentBonus = 4
                        }
                        bonus += currentBonus;
                        if(toolTipText) {
                            toolTipText += "\n" + matchingKink + ": " + currentBonus;
                        }
                        else {
                            toolTipText = matchingKink + ": " + currentBonus;
                        }
                        console.log(currentBonus)

                        console.log(matchingKink + " is a match with " + chosenCustomerKinks[i])
                    }
                }
            }
        }

        let currentPos;
        let bodyBonus;
        for(let i = 0; i < thiccScale.length; i++) {
            if(chosenCustomer.bodyPreference === thiccScale[i].id) {
                currentPos = i;
                break;
            }
        }
        console.log(currentPos)
        let lowerPos = currentPos - 1;
        let higherPos = currentPos + 1;
        if(chosenCustomer.bodyPreference === employee.thiccScale.id) {
            bonus += 2
            bodyBonus = "Preferred Body Type: 20% Bonus"
            console.log("I am here")
        }
        else {
            if(thiccScale[lowerPos]) {
                if(employee.thiccScale.id === thiccScale[lowerPos].id) {
                    bonus += 1;
                    bodyBonus = "Preferred Body Type: 10% Bonus"
                    console.log("No I am here!")
                }
            }

            if(thiccScale[higherPos]) {
                if(employee.thiccScale.id === thiccScale[higherPos].id) {
                    bonus += 1;
                    bodyBonus = "Close To Preferred Body Type: 10% Bonus"
                    console.log("No I am actually here!")
                }
            }
        }
        if(toolTipText && bodyBonus) {
            toolTipText +=  "\n" + bodyBonus;
        }
        else if(bodyBonus){
            toolTipText = bodyBonus;
        }

        let bonusPercent = (bonus / 10)
        console.log(bonusPercent)
        let bonusTotal = (chosenCustomer.request.basePay * bonusPercent);
        console.log(bonusTotal)
        let payTotal = bonusTotal + chosenCustomer.request.basePay;
        console.log(payTotal)
        console.log(bonus)
        if(!bonus) {
            btn.style.borderColor = "red";
        }
        else if(bonus && bonus < 3) {
            btn.style.borderColor = "yellow";
        }
        else if(bonus >= 3) {
            btn.style.borderColor = "green"
        }

        if(employee.activeDoll === true) {

            btn.innerText = employee.customerName + " - " + employee.assignedCust.request.name + " - " + employee.assignedCust.customerName;
        }
        else {
            btn.innerText = employee.customerName + " -  Currently Unassigned " + " -  Not Serving - " + payTotal;

            btn.addEventListener("click", function() {
                employee.assignedCust = chosenCustomer;
                chosenCustomer.assignedDoll = employee;
                eventFunction(chosenCustomer.request.eventId, chosenCustomer);
                console.log("Employee: " + chosenCustomer.assignedDoll.customerName  + " Customer: " + employee.assignedCust.customerName);
                chosenCustomer.requestFulfillment = true;
                chosenCustomer.totalToPay = payTotal;
                $("#" + chosenCustomer.custId + "RequestBtn").replaceWith("<p>Served By: <br>" + employee.customerName + "<p>");
                $("#" + chosenCustomer.custId + "RequestBtn").addClass("textGen")

                employee.activeDoll = true;
                $(".sidePanel").slideUp("slow");
            })

            btn.addEventListener("mouseover", tooltipShow)
            btn.addEventListener("mouseout", tooltipHide)
        }
        if(toolTipText) {
            toolTipInner.innerText = toolTipText;
        }
        else {
            toolTipInner.innerText = "No Bonus";
        }
        sidePanel.append(outerDiv);
        outerDiv.append(btn);
        outerDiv.append(toolTip)
        toolTip.append(toolTipInner);
        //btn.append(btnText);
        let selected = employee.custId
        screenCheck();
    }

    customerBoxSetup()
    function custDetails(x) {
        origin = x.target.id
        let selected;
        for (let i = 0; i < currentCustomers.length; i++) {
            if (currentCustomers[i].custId == origin) {
                selected = currentCustomers[i]
                const box = document.getElementById("patientDetailDiv")
                const oldBox = document.getElementById("patientBox")
                oldBox.style.display = "none";
                $("#patientDetailDiv").slideDown( "slow");
                box.style.display = "grid";
                custDetailSetup(selected);
            }
        }
    }

    let viewedCust;
    function custDetailSetup(x) {
        let selected = x
        viewedCust = selected.custId;
        gameState.custFocus = x;
        desc = document.getElementById("patientDescP");
        custName = document.getElementById("patientName");

        custName.innerText = selected.customerName

        if(selected.customerGenderSpec <= 100) {
            desc.innerText = "They are a " + selected.customerHeight + " " + selected.customerGender + " named " + selected.customerName + ". They have " + selected.customerSkin + " skin, " + selected.customerBody.head.eyeShape.name + " " + selected.customerBody.head.eyeColor.name + " eyes, and " + selected.customerHair + " " + selected.customerHairColor + " hair. They have a " + selected.customerBodyType.name + " build, with a " + selected.customerBody.ass.assSize.nameFem + " " + selected.customerBody.ass.assShape.nameFem + " ass, " + selected.customerBody.thigh.thighSize.name + " thighs, and " + selected.customerBody.chest.breastSize.descName + ". According to those who have served them they have " + selected.customerBody.genitalia.desc + " in their pants."
        }
        else {
            if(selected.customerBody.chest.breastSize.nameMasc === "flat") {
                let newVal = selected.customerBody.chest.breastSize.descName.replace("breasts", "chest");
                selected.customerBody.chest.breastSize.descName = newVal;
            }
            else if(selected.customerBody.chest.breastSize.nameMasc === "pecks") {
                let newVal = selected.customerBody.chest.breastSize.descName.replace("tiny breasts", "pecks");
                selected.customerBody.chest.breastSize.descName = newVal;
            }
            else if(selected.customerBody.chest.breastSize.nameMasc === "moobs"); {
                let newVal = selected.customerBody.chest.breastSize.descName.replace("small breasts", "moobs")
                selected.customerBody.chest.breastSize.descName = newVal;
            }

            desc.innerText = "They are a " + selected.customerHeight + " " + selected.customerGender + " named " + selected.customerName + ". They have " + selected.customerSkin + " skin, " + selected.customerBody.head.eyeShape.name + " " + selected.customerBody.head.eyeColor.name + " eyes, and " + selected.customerHair + " " + selected.customerHairColor + " hair. They have a " + selected.customerBodyType.name + " build, with a " + selected.customerBody.ass.assSize.nameMasc + " " + selected.customerBody.ass.assShape.nameMasc + " ass, " + selected.customerBody.thigh.thighSize.name + " thighs, and " + selected.customerBody.chest.breastSize.descName + ". According to those who have served them they have " + selected.customerBody.genitalia.desc + " in their pants."
        }

        const resistanceBar = document.getElementById("resistanceProgress");

        let turnTickerProgress = selected.resistance;
        resistanceBar.style.width = turnTickerProgress + '%';

        let genderSpecPos = document.getElementById("genderSpectrumPosition")
        genderSpecPos.style.left = selected.customerGenderSpec + "px";

        let genderSpecNum = document.getElementById("genderSpectrumNumCust");
        let k = 0;
        while (k < genderPresentationCategories.length) {
            if(selected.customerGenderSpec < genderPresentationCategories[k].num){
                let genSpecNumCurrent = genderPresentationCategories[k]
                genderSpecNum.style.background = genSpecNumCurrent.color;
                genderSpecNum.innerText = genSpecNumCurrent.name;
                k = genderPresentationCategories.length + 1;
            }
            k++;
        }

        $("#patientRequests").empty();

        let divBox = document.getElementById("patientRequests");
        let fulfillmentBox = document.createElement("div")
        let fulfillmentBar = document.createElement("div");
        let fulfillmentProgressBar = document.createElement("div");
        let fulfillmentText = document.createElement("p")
        let fulfillmentBtn = document.createElement("button")

        fulfillmentBar.setAttribute("id", "fulfillmentBar");
        fulfillmentProgressBar.setAttribute("id", "fulfillmentProgress");
        fulfillmentText.setAttribute("class", "textGen")
        fulfillmentBtn.setAttribute("class", "btn")

        fulfillmentText.innerText = selected.request.name
        fulfillmentBtn.innerText = "Choose a doll to serve"

        fulfillmentBtn.style.marginTop = "15px"

        let ticks = selected.request.tick
        let totalTick = 100 / ticks
        let fulfillmentProgress = selected.request.tickProgress * totalTick
        fulfillmentProgressBar.style.width = fulfillmentProgress + '%';

        divBox.append(fulfillmentBox)
        fulfillmentBox.append(fulfillmentText)
        fulfillmentBox.append(fulfillmentBar);
        fulfillmentBar.append(fulfillmentProgressBar);
        fulfillmentBox.append(fulfillmentBtn)
        fulfillmentBox.addEventListener("click", function() {
            selected.requestFulfillment = true
        })

        $("#kinkList").empty();
        let kinkDisplay = document.getElementById("kinkList")
        let kinkName, kinkVal;
        if(selected.kinks != false) {
            let kinkCurrent = selected.kinks.split("SLICE")
            let bool = false;
            for (let i = 0; i < kinkCurrent.length; i++) {
                if(!bool) {
                    let kinkID = kinkCurrent[i];
                    for(let i = 0; i < kinkGeneral.length; i++) {
                        if(kinkGeneral[i].id == kinkID) {
                            kinkName = kinkGeneral[i].name;
                        }
                    }
                    bool = true;
                }
                else if(bool) {
                    kinkVal = kinkCurrent[i]
                    let kinkBox = document.createElement("div");
                    let kinkNameText = document.createElement("p");
                    let kinkValText = document.createElement("p");
                    kinkNameText.setAttribute("class", "textGen")
                    kinkNameText.innerText = kinkName + ": "
                    kinkValText.setAttribute("class", "textGen")
                    kinkValText.innerText = kinkVal
                    kinkBox.setAttribute("class", "dualGridColumnDiv")
                    kinkBox.append(kinkNameText)
                    kinkBox.append(kinkValText)
                    kinkDisplay.append(kinkBox)
                    bool = false
                }
            }
        }

        $("patientOptions").empty();
        let captureBtn = document.createElement("button")
        captureBtn.setAttribute("class", "btn");
        captureBtn.setAttribute("id", "captureBtn")
        captureBtn.innerText = "Capture Patient"

        let patientOptions = document.getElementById("patientOptions");

        $("#patientOptions").empty();

        patientOptions.append(captureBtn)

        $("#captureBtn").on("click", function() {
            selected.employee = true;
            employees.push(selected)
            let newCustomerArray = [];
            for(let c = 0; c < currentCustomers.length; c++) {
                if(currentCustomers[c].employee != true) {
                    newCustomerArray.push(currentCustomers[c])
                }
            }
            currentCustomers = newCustomerArray;
            customerBoxSetup();
            employeeBoxSetup();
            screenCheck();
        });
        screenCheck();
    }

    function employeeBoxSetup() {
        try {
            if(employees) {
                let employeeAmount = employees.length;
                $("#employeeBox").empty();
                for (let i = 0; i < employeeAmount; i++) {
                    if(employees[i].employee != false) {
                        let selectedEmployee = employees[i]
                        let page = document.getElementById("employeeBox")
                        let custDiv = document.createElement("div");
                        custDiv.setAttribute("class", "customerDiv")
                        custDiv.setAttribute("id", selectedEmployee.custId)
                        custDiv.addEventListener("click", employeeDetails)
                        custDiv.innerText = "Name: " + selectedEmployee.customerName + "\n" + "Gender: " + selectedEmployee.customerGender + "\n" + "Height: " + selectedEmployee.customerHeight + "\n" + "Skin Tone: " + selectedEmployee.customerSkin + "\n" + "Eye Color: " + selectedEmployee.customerBody.head.eyeColor.name + "\n" + "Hair Color: " + selectedEmployee.customerHairColor + "\n"
                        page.append(custDiv)
                        screenCheck();
                    }
                }
            }
        } catch (error) {
            console.log("An unexpected error occured: ", error)
        }
    }

    function employeeDetails(x) {
        origin = x.target.id
        let selected;
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].custId == origin) {
                selected = employees[i]
                const box = document.getElementById("employeeDetailDiv")
                const oldBox = document.getElementById("employeeBox")
                oldBox.style.display = "none";
                box.style.display = "grid";
                employeeDetailSetup(selected);
            }
        }
    }

    function statusCheck(x) {
        let char = x;
        let status;
        if(char.resistance > 0) {
            for(let i = 0; i < statusArrayResistance.length; i++) {
                if(char.resistance > statusArrayResistance[i].bottom) {
                    status = statusArrayResistance[i]
                    break;
                }
            }
        }
        else if(char.resistance === 0) {
            status = {id: "broken", name: "Broken", bottom: 0}
        }
        else if(char.devotion > 0) {
            for(let i = 0; statusArrayDevotion.length; i++) {
                if(char.devotion > statusArrayDevotion[i].bottom) {
                    status = statusArrayDevotion[i];
                    break;
                }
            }
        }
        return status;
    }

    function employeeDetailSetup(x){
        let selected = x
        gameState.employeeFocus = x;
        let viewedCust = selected.custId;

        let desc = document.getElementById("employeeDescP");
        let custName = document.getElementById("employeeName");
        let custInternalName = document.getElementById("employeeInternalName")
        let custStatus = document.getElementById("employeeStatus")

        custName.innerText = selected.customerName
        custInternalName.innerText = selected.customerInternalName;
        let status = statusCheck(selected)
        console.log(status)
        custStatus.innerText = status.name;

        if(selected.customerGenderSpec <= 100) {
            desc.innerText = "They are a " + selected.customerHeight + " " + selected.customerGender + " named " + selected.customerName + ". They have " + selected.customerSkin + " skin, " + selected.customerBody.head.eyeShape.name + " " + selected.customerBody.head.eyeColor.name + " eyes, and " + selected.customerHair + " " + selected.customerHairColor + " hair. They have a " + selected.customerBodyType.name + " build, with a " + selected.customerBody.ass.assSize.nameFem + " " + selected.customerBody.ass.assShape.roll + " cab, " + selected.customerBody.thigh.thighSize.name + " carwheels, and " + selected.customerBody.chest.breastSize.roll + ". According to those who have served them they have " + selected.customerBody.genitalia.partType + " in their pants."
        }
        else {


            if(selected.customerBody.chest.breastSize.nameMasc === "flat") {
                let newVal = selected.customerBody.chest.breastSize.descName.replace("breasts", "chest");
                selected.customerBody.chest.breastSize.descName = newVal;
            }
            else if(selected.customerBody.chest.breastSize.nameMasc === "pecks") {
                let newVal = selected.customerBody.chest.breastSize.descName.replace("tiny breasts", "pecks");
                selected.customerBody.chest.breastSize.descName = newVal;
            }
            else if(selected.customerBody.chest.breastSize.nameMasc === "moobs"); {
                let newVal = selected.customerBody.chest.breastSize.descName.replace("small breasts", "moobs")
                selected.customerBody.chest.breastSize.descName = newVal;
            }


            desc.innerText = "They are a " + selected.customerHeight + " " + selected.customerGender + " named " + selected.customerName + ". They have " + selected.customerSkin + " skin, " + selected.customerBody.head.eyeShape.name + " " + selected.customerBody.head.eyeColor.name + " eyes, and " + selected.customerHair + " " + selected.customerHairColor + " hair. They have a " + selected.customerBodyType.name + " build, with a " + selected.customerBody.ass.assSize.nameMasc + " " + selected.customerBody.ass.assShape.roll + " bass, " + selected.customerBody.thigh.thighSize.roll + " chicken, and " + selected.customerBody.chest.breastSize.roll + ". According to those who have served them they have " + selected.customerBody.genitalia.roll + " in their pants."
        }
        const resistanceBar = document.getElementById("resistanceProgressEmployee");

        let turnTickerProgress = selected.resistance;
        resistanceBar.style.width = turnTickerProgress + '%';

        let genderSpecPos = document.getElementById("genderSpectrumPositionEmployee")
        genderSpecPos.style.left = selected.customerGenderSpec + "px";

        let genderSpecNum = document.getElementById("genderSpectrumNum");
        let k = 0;
        while (k < genderPresentationCategories.length) {
            if(selected.customerGenderSpec < genderPresentationCategories[k].num){
                let genSpecNumCurrent = genderPresentationCategories[k]
                genderSpecNum.style.background = genSpecNumCurrent.color;
                genderSpecNum.innerText = genSpecNumCurrent.name;
                k = genderPresentationCategories.length + 1;
            }
            k++;
        }

        const training = document.getElementById("employeeTrainingActivities")

        $("#employeeTrainingActivities").empty();

        let d = $.grep(buildingSlots, function (n, i) {
            return n.active === true;
        });

        if (d) {
            for (let i = 0; i < d.length; i++) {
                if(d[i].trainable == true){
                    btn = document.createElement("button")
                    btn.setAttribute("class", "btn")
                    btn.innerText = d[i].name
                    btn.setAttribute("id", d[i].id + "Btn")
                    training.append(btn)
                    $("#" + d[i].id + "Btn").on("click", function (e) {
                        let clicked = false
                        if (!clicked) {
                            d[i].occupant = selected.custId
                        }
                    })
                }
            }
        }

        $("#employeeSkillDiv").empty();
        let kinkDisplay = document.getElementById("employeeSkillDiv")
        let kinkName, kinkVal;
        if(selected.kinks != false) {
            let kinkCurrent = selected.kinks.split("SLICE")
            let bool = false;
            for (let i = 0; i < kinkCurrent.length; i++) {
                if(!bool) {
                    let kinkID = kinkCurrent[i];
                    for(let i = 0; i < kinkGeneral.length; i++) {
                        if(kinkGeneral[i].id == kinkID) {
                            kinkName = kinkGeneral[i].name;
                        }
                    }
                    bool = true;
                }
                else if(bool) {
                    kinkVal = kinkCurrent[i]
                    let kinkLevel;
                    for(let i = 0; i < plinkDesc.length; i++) {
                        if(kinkVal < plinkDesc[i].lvl) {
                            kinkLevel = plinkDesc[i]
                            console.log(kinkLevel)
                            break;
                        }
                    }
                    let kinkBox = document.createElement("div");
                    let kinkNameText = document.createElement("p");
                    let kinkSkillBox = document.createElement("div");
                    for(let i = 0; i < 4; i++) {
                        let kinkSkillStar = document.createElement("img")
                        if(kinkLevel.stars > i) {
                            kinkSkillStar.src = "../images/starIconFull.png"
                        }
                        else {
                            kinkSkillStar.src = "../images/starIconEmpty.png"
                        }
                        kinkSkillStar.style.width = "35px";
                        kinkSkillStar.style.height = "35px";
                        kinkSkillBox.append(kinkSkillStar)
                    }
                    kinkNameText.setAttribute("class", "textGen")
                    kinkNameText.innerText = kinkName + ": "
                    kinkSkillBox.style.textAlign = "right";
                    kinkSkillBox.style.alignSelf = "center";

                    kinkBox.setAttribute("class", "dualGridColumn")
                    Object.assign(kinkBox.style,{border: "solid", borderRadius: "10px", borderWidth: "2px", padding: "3px", color: "black", background: "purple", justifySelf: "left"});

                    kinkBox.append(kinkNameText)
                    kinkBox.append(kinkSkillBox)
                    kinkDisplay.append(kinkBox)
                    bool = false
                }
            }
        }
        screenCheck();
    }

    // BUILDING CODE

    let buildingTypes = [
        { id: "conditioningSlot", name: "Conditioning", cost: 10, build: 5, unlocked: true, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
        { id: "kinkTrainer", name: "Kink Trainer", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
        { id: "patientCapacity", name: "Patient Capacity", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
        { id: "bodyChanger", name: "Body Changer", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
        { id: "trainingSlot", name: "Training", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
    ]

    let buildings = [
        { id: "cookingTraining", name: "Basic Kitchen", type: "training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

        { id: "cleaningTraining", name: "Mock Room", type: "training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

        { id: "makeupTraining", name: "Makeup Room", type: "training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

        { id: "speechTraining", name: "Speech Training", type: "training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

        { id: "resistanceRemoval1", name: "Relaxation Center", type: "conditioning", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A small room used for helping less enthusiastic wifes relax and accept their new role. With the aid of speakers sending a constant stream of subliminal messages to whoever occupies it." },

        { id: "hypnoUpg2", name: "Hypno Headphones", type: "conditioning", cost: 1000, build: 10, unlocked: false, base: false, stats: "resistance/-10", capacity: 0, trainable: true, desc: "A set of headphones that is strapped to the patients b head to ensure constant subliminal messages."},

        { id: "hypnoUpg3", name: "Hypno Headpiece", type: "conditioning", cost: 2000, build: 10, unlocked: false, base: false, stats: "resistance/-20", capacity: 0, trainable: true, desc: "A set of headphones that is strapped to the patients b head to ensure constant subliminal messages."},

        { id: "puppyUpg1", name: "Puppy Pound", type: "training", cost: 500, build: 5, unlocked: false, base: true, stats: "none", capacity: 0,trainable: true, effect: 1, desc: "A small room dedicated to training patients into good little puppies.", kinks: "petPlay"},

        { id: "farmUpg1", name: "Farm", type: "training", cost: 500, build: 5, unlocked: false, base: true, stats: "none", capacity: 0,trainable: true, effect: 1, desc: "A small room dedicated to training patients into good little puppies.", kinks: "farmPlay"},

        { id: "cellUpg1", name: "Cell", type: "capacity", cost: 250, build: 5, unlocked: true, base: true, stats: "none", capacity: 1,trainable: false, desc: "A small cell used to hold patients during their stay at the Spa." },

        { id: "basicSurgery", name: "Basic Surgery Station", type: "modification", cost: 750, build: 5, unlocked: false, base: true, stats: "none", capacity: 0,trainable: false, desc: "A basic surgery station used to enhance dolls." }
    ]

    let buildingSlots = []
    let floorSlots = []


    // Building Functions
    function buildingSetup() {
        let slots = 12;
        let floors = 3;

        baseBoxSetup(slots, floors)
        baseBoxButtonSetup();
        closeBtn();
    }

    function baseBoxSetup(x, y) {
        let slots = x
        let floors = y

        let focus = document.getElementById("baseBox");

        let slotCount = slots / floors;
        ;
        let floorCount = 0;
        let count = 0;

        let buildingRowBase = {floorUnlocked: false, id: false }
        let currentFloor = document.createElement("div")
        currentFloor.setAttribute("class", "buildingRow")
        currentFloor.setAttribute("id", "buildingRow" + floorCount)
        buildingRowBase.id = currentFloor.id

        floorSlots.push(buildingRowBase)
        focus.append(currentFloor)

        for(let i = 0; i < slots; i++) {
            let buildingBase = { active: false, floor: false, id: false, name: false, desc: false, occupant: false, type: false, capacity: false, progress: false, stat: false }
            let slotDiv = document.createElement("div");
            let slotDivText = document.createElement("div");

            slotDiv.setAttribute("class", "buildingSlot")
            slotDiv.setAttribute("id", "buildingSlot" + i)
            buildingBase.id = slotDiv.id
            buildingSlots.push(buildingBase)

            slotDivText.innerText = i
            slotDivText.style.color = "white";

            slotDiv.append(slotDivText);
            currentFloor.append(slotDiv)

            count = count + 1;
            if(count === slotCount / 2) {
                let centralBox = document.createElement("div");
                let centralBoxText = document.createElement("div");

                centralBox.setAttribute("id", "centralBox" + floorCount);

                centralBox.append(centralBoxText);
                currentFloor.append(centralBox)
            }
            if(count === slotCount) {
                floorCount++;
                console.log(floorCount)
                if(floorCount < floors) {
                    let buildingRowBase = {floorUnlocked: false, id: false }
                    currentFloor = document.createElement("div");
                    currentFloor.setAttribute("class", "buildingRow")
                    currentFloor.setAttribute("id", "buildingRow" + floorCount)

                    buildingRowBase.id = currentFloor.id

                    floorSlots.push(buildingRowBase)
                    focus.append(currentFloor)
                    count = 0;
                }
            }
        }
    }

    function baseBoxButtonSetup() {
        buildBoxTypeBtnSetup();
        for(let i = 0; i < buildingSlots.length; i++) {
            let focus = document.getElementById(buildingSlots[i].id)

            if(buildingSlots[i].active === false) {
                $("#" + buildingSlots[i].id).on("click", function() {
                    gameState.buildFocus = buildingSlots[i]
                    buildShow(buildingSlots[i]);
                    buildBoxHandler(buildingSlots[i])
                })
            }
            else {
                console.log("Something is already built here pop")

            }
        }
    }

    function baseBoxUpdate() {
        for(let i = 0; i < buildingSlots.length; i++) {
            if(buildingSlots[i].active === true) {
                $("#" + buildingSlots[i].id).off();
                $("#" + buildingSlots[i].id).on("click", function() {
                    buildingFilter(buildingSlots[i])
                })
            }
        }
    }

    function closeBtn() {
        let btn = document.getElementById("buildBoxInnerTopCloseBtnImg")
        btn.addEventListener("click", buildHide)
    }

    function buildShow() {
        $("#buildBoxInnerTopCloseBtnImg").show();
        $("#buildBox").slideDown();
        $("#buildBox").css({"display":"grid"})
    }

    function buildHide() {
        $("#buildBoxInnerTopCloseBtnImg").hide();
        $("#buildBox").slideUp();
    }

    function buildBoxTypeBtnSetup() {
        let btn = document.getElementById("buildTypeSelectInner").getElementsByClassName("iconDiv")
        let buildBtn = document.getElementById("buildingBuildBtn")

        buildBtn.addEventListener("click", function() {
            console.log(gameState.buildFocus)
            console.log(gameState.buildItemFocus)
            let selectedSlot = gameState.buildFocus
            let selectedBuild = gameState.buildItemFocus;

            selectedSlot.active = true;
            selectedSlot.capacity = selectedBuild.capacity
            selectedSlot.desc = selectedBuild.desc
            selectedSlot.name = selectedBuild.name;
            selectedSlot.type = selectedBuild.type;
            selectedSlot.state = selectedBuild.stat;


            $("#" + selectedSlot.id).text(selectedSlot.name)
            baseBoxUpdate();

            console.log(buildingSlots)

        })
        for(let i = 0; i < btn.length; i++) {
            btn[i].addEventListener("click", function() {
                    let type = btn[i].id.replace("buildType", "")
                    gameState.buildTypeFocus = type;
                    buildBoxHandler();
            })
        }
    }

    function buildBoxHandler() {
        $("#buildingBuildSelect").empty();
        if(!gameState.buildTypeFocus) {
            gameState.buildTypeFocus = "Conditioning"
        }
        let focus = gameState.buildTypeFocus.toLowerCase();
        let focusGroup = $.grep(buildings, function(n) {
            return n.type === focus
        })

        if(focusGroup) {
            let target = document.getElementById("buildingBuildSelect")
            for(let i = 0; i < focusGroup.length; i++) {
                let btn = document.createElement("div");
                btn.setAttribute("id", "buildBtn" + focusGroup[i].id)
                btn.setAttribute("class", "imgBtn");

                let img = document.createElement("img");
                img.setAttribute("class", "btnBackground")
                img.src = "../images/btnTitle.png"

                let text = document.createElement("div");
                text.innerText = focusGroup[i].name

                target.append(btn)
                btn.append(text);
                btn.append(img);

                btn.addEventListener("click", function() {
                    if(gameState.buildItemFocus != focusGroup[i] && gameState.buildItemFocus != false) {
                        let btn = document.getElementById("buildBtn" + gameState.buildItemFocus.id)
                        if(btn) {
                            let selection = btn.getElementsByClassName("btnBackground")
                            selection[0].src = "../images/btnTitle.png"

                            $("#" + btn.id).on("mouseenter", function() {
                                let hoverFocus = document.getElementById(btn.id).getElementsByClassName("btnBackground")
                                hoverFocus[0].src = "../images/btnTitleBlank.png"
                            })

                            $("#" + btn.id).on("mouseleave", function() {
                                let hoverFocus = document.getElementById(btn.id).getElementsByClassName("btnBackground")
                                hoverFocus[0].src = "../images/btnTitle.png"
                            })
                        }
                    }
                    gameState.buildItemFocus = focusGroup[i]
                    buildSelection();
                })

                $("#" + btn.id).on("mouseenter", function() {
                    let hoverFocus = document.getElementById(btn.id).getElementsByClassName("btnBackground")
                    hoverFocus[0].src = "../images/btnTitleBlank.png"
                })

                $("#" + btn.id).on("mouseleave", function() {
                    let hoverFocus = document.getElementById(btn.id).getElementsByClassName("btnBackground")
                    hoverFocus[0].src = "../images/btnTitle.png"
                })
            }
        }
    }

    function buildSelection() {
        let btn = document.getElementById("buildBtn" + gameState.buildItemFocus.id)
        let btnBackground = btn.getElementsByClassName("btnBackground")
        let desc = document.getElementById("buildingBuildDesc");
        desc.innerText = gameState.buildItemFocus.desc
        btnBackground[0].src = "../images/btnTitleBlank.png"
        $("#" + btn.id).off();
    }

    function buildingFilter(x) {
        let selectedBuilding = x;
        $(".viewBox").hide();
        $(".buildingSceneContainer").hide();
        $("#buildingBox").show();

        if(selectedBuilding.type = "conditioning") {
            (function conditioningBuildingUpdate(){
                $("#statBoxConditioning").css({"display": "grid"})
                $("#statBoxConditioningDesc").text(selectedBuilding.desc)
                if(selectedBuilding.occupant) {
                    $("#statBoxConditioningNameDiv").text(selectedBuilding.occupant.customerName)
                }
                else {
                    $("#statBoxConditioningNameDiv").text("Unoccupied")
                }
                let target = document.getElementById("statBoxConditioningEmployeeSelect")
                $("#" + target.id).empty();

                let row = document.createElement("div");
                row.setAttribute("class", "btnContainerGridRow")

                target.append(row)

                let rowCount = 0;

                for(let i = 0; i < employees.length; i++) {
                    if(rowCount === 3) {
                        row = document.createElement("div");
                        row.setAttribute("class", "btnContainerGridRow");
                        rowCount = 0;

                        target.append(row)
                    }
                    let selectedEmployee = employees[i];

                    let btnBox = document.createElement("div");
                    btnBox.setAttribute("class", "imgBtn");

                    let btnText = document.createElement("div");
                    let btnImg = document.createElement("img")

                    btnImg.src="../images/btnTitle.png"

                    btnText.innerText = selectedEmployee.customerName

                    row.append(btnBox);
                    btnBox.append(btnText);
                    btnBox.append(btnImg)
                }
            })();
        }
    }

    // BUILDING CODE END

    function thiccScaleFunc(x) {
        let custScale = 0;
        let selectedCustomer = x
        $.each(selectedCustomer.customerBody, function(key, valueObject){
            $.each(selectedCustomer.customerBody[key], function(valueObject, val){
                if(val.scale) {
                    console.log(val.scale)
                    custScale += val.scale
                }
            });
        });
        console.log(custScale)
        for(let k = 0; k < thiccScale.length; k++) {
            if(custScale <= thiccScale[k].scale) {
                return thiccScale[k]
            }
        }
    }

    function arrayFinder(x, y, a, b) {
        let array = x;
        let search = y;
        let arrayVal = a;
        let searchVal = b;

        for(let i = 0; i < array.length; i++) {
            if(array[i][arrayVal] === search[searchVal]) {
                let foundItem = array[i];
                return foundItem;
            }
        }
    }

    function arrayStatusCheck(x, y, c) {
        let currentInt = x;
        let currentArray = y;
        let currentVal = c;

        for(let i = 0; i < currentArray.length; i++) {
            console.log(currentArray[i])
            if(currentInt < currentArray[i][c]) {
                console.log(currentArray[i][c])
                return currentArray[i]
            }
        }

    }

    // SECTOR CODE

    let sectorArray = [
        {id:"sector1", name: "Callus", img: "../images/basicSectorImg3.png", imgHover: "../images/basicSectorImgHover3.png", imgName: "../images/btnTitleImgCallus.png", imgNameActive: "../images/btnTitleImgCallusActive.png", wealth: "low", wealthImg: "../images/btnStatusLow.png", resources: "meld", travelTime: 14, risk: "low", riskImg: "../images/btnStatusLow.png",  active: false, unlocked: true, desc: "Callus, once one of old earths glittering regional capitals, now a husk of its former self. Its jutting towers and dank streets are home to thousands of different groups, each with their own slice of the territory, and all prepared to challenge others to expand and defend what they see as rightfully theirs. It makes for a confusing, violent, and disorganized mess. The perfect chaos for someone seeking to profit."},

        {id:"sector2", name: "Orion", img: "../images/basicSectorImg2.png", imgHover: "../images/basicSectorImgHover2.png", imgName: "../images/btnTitleImgOrion.png", imgNameActive: "../images/btnTitleImgOrionActive.png", wealth: "medium", wealthImg: "../images/btnStatusMedium.png", resources: "meld", travelTime: 28, risk: "medium", riskImg: "../images/btnStatusMedium.png", active: false, unlocked: true, desc: "Callus, once one of old earths glittering regional capitals, now a husk of its former self. Its jutting towers and dank streets are home to thousands of different groups, each with their own slice of the territory, and all prepared to challenge others to expand and defend what they see as rightfully theirs. It makes for a confusing, violent, and disorganized mess. The perfect chaos for someone seeking to profit."},

        {id:"sector3", name: "Corinth", img: "../images/basicSectorImg.png", imgHover: "../images/basicSectorImgHover.png", imgName: "../images/btnTitleImgCorinth.png", imgNameActive: "../images/btnTitleImgCorinthActive.png",wealth: "low", wealthImg: "../images/btnStatusHigh.png", resources: "meld", travelTime: 40, risk: "low", riskImg: "../images/btnStatusHigh.png",  active: false, unlocked: true, desc: "The Muridian Reaches, a large, mineral rich, asteroid belt that has been settled over the past 400 years. The reach has no large population centers, but is instead dotted with numerous homesteads occupied by its often poor rumble tumble colonists and ferocious pirates."},

        {id:"sector4", name: "Muridian Reaches", img: "../images/basicSectorImg3.png", imgHover: "../images/basicSectorHidden.png", imgName: "../images/btnTitleImgCallus.png",  imgNameActive: "../images/btnTitleImgCallusActive.png",wealth: "low", wealthImg: "../images/btnStatusLow.png", resources: "meld", travelTime: 28, risk: "low", riskImg: "../images/btnStatusLow.png",  active: false, unlocked: false, desc: "The Muridian Reaches, a large, mineral rich, asteroid belt that has been settled over the past 400 years. The reach has no large population centers, but is instead dotted with numerous homesteads occupied by its often poor rumble tumble colonists and ferocious pirates."},

        {id:"sector5", name: "Muridian Reaches", img: "../images/basicSectorImg3.png", imgHover: "../images/basicSectorHidden.png", imgName: "../images/btnTitleImgCallus.png", imgNameActive: "../images/btnTitleImgCallusActive.png", wealth: "low", wealthImg: "../images/btnStatusLow.png", resources: "meld", travelTime: 56, risk: "low", riskImg: "../images/btnStatusLow.png",  active: false, unlocked: false, desc: "The Muridian Reaches, a large, mineral rich, asteroid belt that has been settled over the past 400 years. The reach has no large population centers, but is instead dotted with numerous homesteads occupied by its often poor rumble tumble colonists and ferocious pirates." },
    ]

    let sectorDangerArray = [
        {name: "low", attackChance: 10, img:"../images/btnStatusLow.png"},
        {name: "medium", attackChance: 20, img:"../images/btnStatusMedium.png"},
        {name: "high", attackChance: 30, img:"../images/btnStatusMedium.png"},
    ]


    function sectorSetup() {
        if(expeditionArray.sector) {

            let currentTitleImg = document.getElementById(expeditionArray.sector.id + "TitleImg")
            console.log(currentTitleImg)
            currentTitleImg.src = expeditionArray.sector.imgNameActive;

        }
        let sectorDiv = document.getElementById("sectorSelect")
        let sectorDivOldElements = document.getElementById("sectorSelect").getElementsByClassName("imgSelectorDiv");
        let sectorStart = document.getElementById("sectorDetailStart");
        $(".imgSelectorDiv").remove();
        $("#sectorDetailStart").off();

        sectorStart.addEventListener("mouseenter", function() {
            sectorStart.src = "../images/btnStartHover.png"
        })

        sectorStart.addEventListener("mouseleave", function() {
            sectorStart.src = "../images/btnStart.png"
        })


        for(let i = 0; i < sectorArray.length; i++) {
            let sectorSelectDiv = document.createElement("div")
            let sectorSelectImg = document.createElement("img")

            sectorSelectDiv.setAttribute("class", "imgSelectorDiv");
            sectorSelectImg.setAttribute("class", "imgSelectorImg");

            sectorSelectImg.src = sectorArray[i].img

            sectorSelectDiv.append(sectorSelectImg);
            sectorDiv.append(sectorSelectDiv)

            if(sectorArray[i].unlocked === true) {
                let sectorSelectTextDiv = document.createElement("div");
                let sectorSelectTextImg = document.createElement("img")

                sectorSelectTextDiv.setAttribute("class", "imgSelectorTextDiv")
                sectorSelectTextImg.setAttribute("class", "imgSelectorTextImg")

                sectorSelectTextImg.setAttribute("id", sectorArray[i].id + "TitleImg")

                sectorSelectTextImg.src = sectorArray[i].imgName;

                if(expeditionArray.sector.id == sectorArray[i].id){
                    sectorSelectTextImg.src = sectorArray[i].imgNameActive;
                }

                sectorSelectTextDiv.append(sectorSelectTextImg);
                sectorSelectDiv.append(sectorSelectTextDiv)


                sectorSelectDiv.addEventListener("mouseleave", function() {
                    sectorSelectImg.src = sectorArray[i].img;
                })

                sectorSelectDiv.addEventListener("mouseenter", function() {
                    sectorSelectImg.src = sectorArray[i].imgHover;
                })


                sectorSelectDiv.addEventListener("click", function() {
                    let activeCheck = false;

                    for(let k = 0; k < sectorArray.length; k++) {
                        if(sectorArray[k].id === sectorArray[i].id && sectorArray[i].active === true) {
                            sectorArray[i].active = false;
                            $("#sectorBox").css({"grid-template-rows": "100% 0%"});
                            sectorSelectTextImg.src = sectorArray[i].imgName;
                            activeCheck = true;
                            $("#sectorDetailStart").hide();
                            $("#sectorDetailGrey").show();
                            break;
                        }

                        if(sectorArray[k].active === true) {
                            console.log(sectorArray[k])
                            let oldSelection = document.getElementById(sectorArray[k].id + "TitleImg")
                            oldSelection.src = sectorArray[k].imgName;
                            sectorArray[k].active = false;
                            $("#sectorDetailStart").show();
                            $("#sectorDetailGrey").css({"display": "none"});
                            $("#sectorDetailDescText").text(sectorArray[i].desc)
                            sectorArray[i].active = true;
                            sectorSelectTextImg.src = sectorArray[i].imgNameActive;

                            $("#sectorDetailRiskImgStatus").attr("src", sectorArray[i].riskImg);
                            $("#sectorDetailWealthImgStatus").attr("src", sectorArray[i].wealthImg)
                            $("#sectorDetailTravelTextStatus").text(sectorArray[i].travelTime + " days")

                            activeCheck = true;
                            break;
                        }
                    }
                    if(!activeCheck) {
                        $("#sectorDetailStart").show();
                        $("#sectorDetailGrey").css({"display": "none"});
                        $("#sectorBox").css({"grid-template-rows": "60% 40%"});
                        $("#sectorDetailDescText").text(sectorArray[i].desc)
                        sectorArray[i].active = true;
                        sectorSelectTextImg.src = sectorArray[i].imgNameActive;
                        $("#sectorDetailRiskImgStatus").attr("src", sectorArray[i].riskImg);
                        $("#sectorDetailWealthImgStatus").attr("src", sectorArray[i].wealthImg)
                        $("#sectorDetailTravelTextStatus").text(sectorArray[i].travelTime + " days")
                    }

                })
                $("#sectorDetailStartBtn").on("click", function() {
                    let activeSector = $.grep(sectorArray, function (n) {
                        return n.active === true
                    })
                    sectorStart.src = "../images/btnStartClicked.png";
                    sectorExpeditionLaunchFunc(activeSector[0])
                    sectorProgressPointSetup(activeSector[0])
                })

            }

            else {
                sectorSelectImg.src = "../images/basicSectorHidden.png";
            }
        }
    }

    let expeditionArray = {sector: false, products: [], travelTime: false, checkpoints: false, active: true}

    let wifeBot = {style: "base", tools: "shockLance", lvl: 0}

    let wifeBotCaptureTools = [
        {id:"shockLance", name: "Example Option", atk: 1, desc: "A highpowered taser once popular amoung old earth security."}
    ]


    function sectorExpeditionLaunchFunc(x) {
        $("#sectorDetailStart").css({"display": "none"});
        $("#sectorDetailClicked").css({"display": "block"});
        $("#sectorDetailTransitionDiv").slideDown("slow");
        setTimeout(function(){
            let currentSector = x;
            expeditionArray.sector = currentSector;
            expeditionArray.travelTime = 0;
            $("#sectorDetailDiv").css({"display": "none"});
            $("#sectorDetailExpeditionLaunchedDiv").css({"display": "grid"});
            $("#sectorDetailTransitionDiv").slideUp("slow");
        }, 1000);
        return expeditionArray;
    }

    function sectorExpeditionRun(x) {
        let currentExpedition = x;
        if(!expeditionArray.sector) {
            expeditionArray.sector = currentExpedition;
        }
        if(expeditionArray.travelTime >= currentExpedition.travelTime) {
            currentExpedition = false;
            if(expeditionArray.products) {
                for(let i = 0; i < expeditionArray.products.length; i++) {
                    expeditionArray.products[i].employee = true
                    employees.push(expeditionArray.products[i])
                }
            }

            expeditionArray.sector = false;
            expeditionArray.travelTime = false
            expeditionArray.checkpoint = false
            expeditionArray.products = []
            $("#sectorDetailTransitionDiv").slideDown("slow");
            setTimeout(function(){
                $("#sectorDetailExpeditionLaunchedDiv").css({"display": "none"});
                $("#sectorDetailDiv").css({"display": "grid"});
                $("#sectorDetailGrey").css({"display": "block"});
                $("#sectorDetailClicked").css({"display": "none"});
                $("#sectorDetailProgressBarInner").css({"width": "0.1%"})
                $("#sectorDetailProgressBarInnerImgShipDiv").css({"width": "0.1%"})
                $(".charPanel").remove();
                $("#sectorDetailTransitionDiv").slideUp("slow");
            }, 1000);
        }
        else {
            expeditionArray.travelTime += 0.1;
            let expeditionProgress = progressCheck(expeditionArray.travelTime,currentExpedition.travelTime )
            $("#sectorDetailProgressBarInner").css({"width": expeditionProgress + "%"})
            $("#sectorDetailProgressBarInnerImgShipDiv").css({"width": (expeditionProgress +  6) + "%"})
            for(let i = 0; i < (expeditionArray.checkpoints).length; i++) {
                if(expeditionArray.checkpoints[i].int <= expeditionArray.travelTime && expeditionArray.checkpoints[i].flag != true) {
                    expeditionArray.checkpoints[i].flag = true;
                    let newCust = customerBuilder();
                    eventFunction("eventCapture" , newCust, "capture")
                    pauseGame()
                }
            }
        }
    }

    function sectorProgressPointSetup(x) {
        let currentExpedition = x;
        let progressInt = 0.2;

        let checkpointArray = []
        while(progressInt != 1) {
            let checkpoint = currentExpedition.travelTime * progressInt;
            let checkpointObj = {int: checkpoint, flag: false}
            checkpointArray.push(checkpointObj);
            progressInt += 0.2;
        }
        expeditionArray.checkpoints = checkpointArray
    }

    function expeditionCaptureUpdate(x) {
        let focus = x;
        if(!focus){
            console.log("Something has gone wrong in expeditionCaptureUpdate: focus is undefined")
            return 1;
        }

        let target = document.getElementById("sectorDetailCapturedDivInner");

        let container = document.createElement("div");
        let innerDiv = document.createElement("div");
        let background = document.createElement("img");
        let focusImgDiv = document.createElement("div");
        let focusImg = document.createElement("img");
        let focusText = document.createElement("div");

        container.setAttribute("class", "charPanel");
        innerDiv.setAttribute("class", "charPanelInner");
        background.setAttribute("class", "background");
        focusImgDiv.setAttribute("class", "charPanelImgDiv");
        focusImg.setAttribute("class", "charPanelImg")
        focusText.setAttribute("class", "charPanelTextDiv")

        background.src = "../images/basicBackground.png";
        focusImg.src = "../images/Image.jpg";

        focusText.innerText = focus.customerName;

        target.append(container);
        container.append(innerDiv);
        container.append(background);
        innerDiv.append(focusImgDiv)
        innerDiv.append(focusText)
        focusImgDiv.append(focusImg);

        $(".charPanel").slideDown();
        $(".charPanel").css({"display": "grid"});

    }

    function progressBoxSetup() {
        let target = document.getElementById("progressBoxInner")
        progressBoxBuildingCheck(target);
        progressBoxExpeditionCheck();
        progressBoxResearchCheck();
        patientBoxCheck();
    }

    function progressBoxBuildingCheck(x) {
        let target = x;
        let currentProgressBoxCategory = document.getElementById("progressBoxCategoryBuildings");
        if(!currentProgressBoxCategory) {
            let category = document.createElement("div");
            let categoryTitle = document.createElement("div");
            category.setAttribute("class", "progressBoxCategory")
            category.setAttribute("id", "progressBoxCategoryBuildings");
            categoryTitle.setAttribute("class", "progressBoxTitle")
            categoryTitle.innerText = "Building Activity"
            target.append(categoryTitle)
            target.append(category)

            categoryTitle.addEventListener("click", function() {
                $("#progressBoxCategoryBuildings").slideToggle();
            });
        }
        let activeBuildings //= $.grep(buildingSlots, function(n) {
        // return n.active
        // })
        if(activeBuildings) {
            for(let i = 0; i < activeBuildings.length; i++) {
                let category = document.getElementById("progressBoxCategoryBuildings")
                let currentSlot = document.getElementById("progressBoxInnerSlot" + activeBuildings[i].id)
                let progressElement
                if(currentSlot) {
                    progressElement = document.getElementById("progressBoxInnerSlot" + activeBuildings[i].id).getElementsByClassName("progressBarContainer");
                }
                if(!currentSlot) {
                    let slot = document.createElement("div");
                    let slotName = document.createElement("div");
                    let slotDesc = document.createElement("div");
                    slot.setAttribute("class", "innerSlot");
                    slot.setAttribute("id", "progressBoxInnerSlot" + activeBuildings[i].id);
                    slotName.innerText = activeBuildings[i].name;
                    category.append(slot)
                    slot.append(slotName)
                    if(activeBuildings[i].occupant) {
                        dynamicProgressBuilder(activeBuildings[i].occupant[activeBuildings[i].statName], 100, activeBuildings[i].statNameC, slot)
                    }
                }
                else if(activeBuildings[i].occupant && progressElement.length > 0) {
                    console.log("I am updating: " + activeBuildings[i])
                    let newInt = activeBuildings[i].occupant[activeBuildings[i].statName]
                    let newTotal = 100;

                    let newProgress = progressCheck(newInt, newTotal);

                    let element = document.getElementById("progressBoxInnerSlot" + activeBuildings[i].id).getElementsByClassName("progressBarProgress")
                    let elementTitle = document.getElementById("progressBoxInnerSlot" + activeBuildings[i].id).getElementsByClassName("progressTextContainerTitle")
                    let elementDesc = document.getElementById("progressBoxInnerSlot" + activeBuildings[i].id).getElementsByClassName("progressTextContainerDesc")
                    element[0].style.width = newProgress + "%";
                    elementTitle[0].innerText = activeBuildings[i].statNameC;
                    //elementTitle[0].innerText = activeBuildings[i].
                }

                else if(activeBuildings[i].occupant && progressElement.length === 0) {
                    let slot = document.getElementById("progressBoxInnerSlot" + activeBuildings[i].id);
                    dynamicProgressBuilder(activeBuildings[i].occupant[activeBuildings[i].statName], 100, activeBuildings[i].statNameC, slot)
                }
                else if(!activeBuildings[i].occupant && progressElement[0]) {
                    progressElement[0].remove();
                }
            }

        }

    }

    function progressBoxExpeditionCheck() {
        let target = document.getElementById("progressBoxInnerSlotExpedition")
        if(expeditionArray.sector) {
            let slot = document.getElementById("progressBoxInnerSlotExpedition")
            let progressContainer = document.getElementById("progressBoxInnerSlotExpedition").getElementsByClassName("progressBarContainer")
            if(progressContainer[0]) {
                let element = document.getElementById("progressBoxInnerSlotExpedition").getElementsByClassName("progressBarProgress")
                let elementTitle = document.getElementById("progressBoxInnerSlotExpedition").getElementsByClassName("progressTextContainerTitle")
                let elementDesc = document.getElementById("progressBoxInnerSlotExpedition").getElementsByClassName("progressTextContainerDesc")

                let progress = progressCheck(expeditionArray.travelTime, expeditionArray.sector.travelTime);
                element[0].style.width = progress + "%";
                elementTitle[0].innerText = expeditionArray.sector.name;
            }
            else if(!progressContainer[0]) {
                dynamicProgressBuilder(expeditionArray.travelTime, expeditionArray.sector.travelTime, expeditionArray.sector.name, slot)
            }
        }
        else if(!expeditionArray.sector) {
            let progressContainer = document.getElementById("progressBoxInnerSlotExpedition").getElementsByClassName("progressBarContainer")
            if(progressContainer[0]) {
                progressContainer[0].remove();
            }
        }

    }

    function progressBoxResearchCheck() {
        let target = document.getElementById("progressBoxInnerSlotResearch")
        let currentResearch = $.grep(researchTree, function(n) {
            return n.active === true;
        })
        console.log(currentResearch)
        if(currentResearch[0]) {
            let selectedResearch = currentResearch[0];
            let slot = document.getElementById("progressBoxInnerSlotResearch")
            let progressContainer = document.getElementById("progressBoxInnerSlotResearch").getElementsByClassName("progressBarContainer")
            if(progressContainer[0]) {
                let element = document.getElementById("progressBoxInnerSlotResearch").getElementsByClassName("progressBarProgress")
                let elementTitle = document.getElementById("progressBoxInnerSlotResearch").getElementsByClassName("progressTextContainerTitle")
                let elementDesc = document.getElementById("progressBoxInnerSlotResearch").getElementsByClassName("progressTextContainerDesc")

                let progress = progressCheck(selectedResearch.currentResearch, selectedResearch.cost);
                element[0].style.width = progress + "%";
                elementTitle[0].innerText = selectedResearch.name;
            }
            else if(!progressContainer[0]) {
                dynamicProgressBuilder(selectedResearch.currentResearch, selectedResearch.cost, selectedResearch.name, slot)
            }
        }
        else if(!currentResearch[0]) {
            let progressContainer = document.getElementById("progressBoxInnerSlotResearch").getElementsByClassName("progressBarContainer")
            if(progressContainer[0]) {
                progressContainer[0].remove();
            }
        }
    }

    $("#progressBoxTitleResearch").on("click", function() {
        $("#progressBoxCategoryResearch").slideToggle();
    })

    $("#progressBoxTitleExpedition").on("click", function() {
        $("#progressBoxCategoryExpedition").slideToggle();
    })

    function categorySetup(x, y, z) {
        let target = x;
        let name = y
        let title = z;
        let category = document.createElement("div");
        let categoryTitle = document.createElement("div");
        category.setAttribute("class", "progressBoxCategory")
        category.setAttribute("id", "progressBoxCategory" + name);
        categoryTitle.setAttribute("class", "progressBoxTitle")
        categoryTitle.innerText = title
        target.append(categoryTitle)
        target.append(category)

        categoryTitle.addEventListener("click", function() {
            $("#progressBoxCategory" + name).slideToggle();
        });
    }

    let patientBoxList = [];
    function patientBoxCheck() {
        let target = document.getElementById("patientSidePanelInner");
        for(let i = 0; i < employees.length; i++) {
            console.log("PatientBoxCheck: " + employees[i])
            let matchingEmployees = $.grep(patientBoxList, function(n) {
                return n === employees[i]
            })
            if(!matchingEmployees[0]) {
                patientBoxList.push(employees[i])
                let slot = document.createElement("div");
                let slotName = document.createElement("div");
                let slotDesc = document.createElement("div");
                slot.setAttribute("class", "innerSlot");
                slot.setAttribute("id", "patientBoxInnerSlot" + employees[i].custId);
                slotName.innerText = employees[i].customerName;
                target.append(slot)
                slot.append(slotName)
            }
        }
    }




    let eventArray = [
        {eventId: "eventMassageBasic", eventText: "@.assignedDoll.customerName quickly got on their knees before slowly unzipping @.customerNamePlural pants revealing @.customerBody.genitalia.desc / @.customerName quickly grabs @.assignedDoll.customerNamePlural @.assignedDoll.customerBody.head.hairType @.assignedDoll.customerBody.head.hairColor hair and shoves @.pronouns.referPronoun @.customerBody.genitalia.namePlus !.customerBody.genitalia.groupId*genitaliaSizeAmab*down#their#throat !.customerBody.genitalia.groupId*genitaliaSizeAfab*in#their#mouth / @.assignedDoll.customerName !.assignedDoll.oralVirgin*true*whimpers#as#their#anal#virginity#is#taken#by# @.customerNamePlural @.customerBody.genitalia.namePlus", activated: false},

        {eventId: "eventHandjob", eventText: "@.assignedDoll.customerName quickly got on their knees before slowly unzipping @.customerNamePlural pants revealing @.customerBody.genitalia.desc / @.customerName quickly grabs @.assignedDoll.customerNamePlural @.assignedDoll.customerBody.head.hairType @.assignedDoll.customerBody.head.hairColor hair and shoves @.pronouns.referPronoun @.customerBody.genitalia.namePlus !.customerBody.genitalia.groupId*genitaliaSizeAmab*down#their#throat !.customerBody.genitalia.groupId*genitaliaSizeAfab*in#their#mouth / @.assignedDoll.customerName !.assignedDoll.oralVirgin*true*whimpers#as#their#anal#virginity#is#taken#by# @.customerNamePlural @.customerBody.genitalia.namePlus", activated: false},

        {eventId: "eventBlowjob", eventText: "@.assignedDoll.customerName quickly got on their knees before slowly unzipping @.customerNamePlural pants revealing @.customerBody.genitalia.desc / @.customerName quickly grabs @.assignedDoll.pronouns.identifyPronoun @.assignedDoll.customerBody.head.hairType @.assignedDoll.customerBody.head.hairColor hair and shoves @.pronouns.identifyPronoun @.customerBody.genitalia.namePlus past @.assignedDoll.customerNamePlural @.customerBody.head.lipSize.name lips !.customerBody.genitalia.groupId*genitaliaSizeAmab*down#their#throat !.customerBody.genitalia.groupId*genitaliaSizeAfab*into#their#mouth / @.assignedDoll.customerName !.assignedDoll.oralVirgin*true*whimpers#as#their#oral#virginity#is#taken#by !.assignedDoll.oralVirgin*false*moans#as#they#feel  @.customerNamePlural @.customerBody.genitalia.nameMinus /", activated: false},

        {eventId: "eventSex", eventText: "@.assignedDoll.customerName quickly got on their knees before slowly unzipping @.customerNamePlural pants revealing @.customerBody.genitalia.desc / @.customerName quickly grabs @.assignedDoll.customerNamePlural @.assignedDoll.customerBody.head.hairType @.assignedDoll.customerBody.head.hairColor hair and shoves @.pronouns.referPronoun @.customerBody.genitalia.namePlus !.customerBody.genitalia.groupId*genitaliaSizeAmab*down#their#throat !.customerBody.genitalia.groupId*genitaliaSizeAfab*in#their#mouth / @.assignedDoll.customerName !.assignedDoll.oralVirgin*true*whimpers#as#their#anal#virginity#is#taken#by# @.customerNamePlural @.customerBody.genitalia.namePlus", activated: false},

        {eventId: "eventAnalSex", eventText: "@.assignedDoll.customerName quickly got on their knees before slowly unzipping @.customerNamePlural pants revealing @.customerBody.genitalia.desc / @.customerName quickly grabs @.assignedDoll.customerNamePlural @.assignedDoll.customerBody.head.hairType @.assignedDoll.customerBody.head.hairColor hair and shoves @.pronouns.referPronoun @.customerBody.genitalia.namePlus !.customerBody.genitalia.groupId*genitaliaSizeAmab*down#their#throat !.customerBody.genitalia.groupId*genitaliaSizeAfab*in#their#mouth / @.assignedDoll.customerName !.assignedDoll.oralVirgin*true*whimpers#as#their#anal#virginity#is#taken#by# @.customerNamePlural @.customerBody.genitalia.name+", activated: false},

        {eventId: "eventCapture", eventText: "I love to say &$@.gender*man/Howdy#meowdy" , activated: false},

        {eventId: "captureSuccessful", eventType: "captureSuccess", eventText: "@.name capture"},

        {eventId: "captureFailure1", eventType: "captureFailure", eventText: "@.name escape"}
    ]

    //"@.name was on @.pronounIdentify knees, looking up at their owner. @.name could barely remember a time without owner to take care of them . @.pronounReferC could almost remember a time without owner. The shocks. The pain. The lights. Owner noticed this and bent down to scratch @.namePlural cute @.hairType @.hairColor hair. Just the touch left @.namePlural body aching and @.pronounIdentify @.genitalia+ leaking all over the floor."

    //"Head swirling, @.name could do little more than groan while @.pronounIdentify body refused to cooperate. A metal arm wrapped around @.pronounIdentify waist taking @.name deeper into the darkness."

    //"I grab @.pronounIdentify @.assSize @.assShape ass and kiss @.pronounIdentify @.lipSize lips."


    let eventParseTestText = [
        {eventText:"Howdy fam how are you on this lovely day? Damn I do in fact love that !$@.hairType*curly#@.hairType/@.hairType$@.hairType*straight#@.hairType/@.hairType$@.hairType*kinky#@.hairType/@.hairType hair"}
    ]

    let eventParseDictArray = [
        {id: "assSize", steps:["customerBody", "ass", "assSize", "name"]},
        {id: "assShape", steps:["customerBody", "ass", "assShape", "name"]},
        {id: "breastSizeMasc", steps:["customerBody", "chest", "breastSize", "nameMasc"]},
        {id: "breastSizeFem", steps:["customerBody", "chest", "breastSize", "nameFem"]},
        {id: "breastSizeAndro", steps:["customerBody", "chest", "breastSize", "nameAndro"]},
        {id: "nameDoll", steps:["assignedDoll", "customerName"]},
        {id: "name", steps:["customerName"]},
        {id: "namePlural", steps:["customerNamePlural"]},
        {id: "earShape", steps:["customerBody", "head", "earShape", "name"]},
        {id: "eyeColor", steps:["customerBody", "head","eyeColor", "name"]},
        {id: "eyeShape", steps:["customerBody", "head", "eyeShape", "name"]},
        {id: "gender", steps:["customerGender"]},
        {id: "genitalia", steps:["customerBody", "genitalia", "name"]},
        {id: "genitalia+", steps:["customerBody", "genitalia", "namePlus"]},
        {id: "hairType", steps:["customerBody", "head", "hairType"]},
        {id: "hairColor", steps:["customerBody", "head", "hairColor"]},
        {id: "hipSize", steps:["customerBody", "hips", "hipSize", "name"]},
        {id: "lipSize", steps:["customerBody", "head", "lipSize", "name"]},
        {id: "noseShape", steps:["customerBody", "head", "noseShape", "name"]},
        {id: "presentation", steps:["presentation"]},
        {id: "pronounIdentify", steps:["pronouns", "identifyPronoun"]},
        {id: "pronounIdentifyC", steps:["pronouns", "identifyPronounC"]},
        {id: "pronounRefer", steps:["pronouns", "referPronoun"]},
        {id: "pronounReferC", steps:["pronouns", "referPronounC"]},
        {id: "thighSize", steps:["customerBody", "thigh", "thighSize", "name"]},
        {id: "waistSize", steps:["customerBody", "hips", "waistSize", "name"]},
    ]

    function eventFunction(x, y, z) {
        let currentEvent = x;
        let cust = y;
        let eventType
        $("#eventButtonBox").show();
        $("#optionsDiv").remove();

        if(z) {
            eventType = z;
        }
        let selectedEvent;
        console.log(cust)

        for(let i = 0; i < eventArray.length; i++) {
            if(eventArray[i].eventId === currentEvent && eventArray[i].activated === false) {
                selectedEvent = eventArray[i]
                if(!eventType) {
                    eventArray[i].activated = true;
                }
                break;
            }
            else if(eventArray[i].eventId === currentEvent && eventArray[i].activated === true) {

                console.log("already fired event")
                break;
            }
        }

        if(!selectedEvent) {
            return 0;
        }

        let id = cust.custId + selectedEvent.eventId;

        let newText = eventParseNew(selectedEvent, cust);
        console.log(newText)
        if(eventType) {
            eventImportantPopup(newText, currentEvent, cust, eventType)
        }
        else {
            eventPopupBubbleSetup(newText, id)
        }
    }

    function eventPopupBubbleSetup(x, y) {
        let eventText = x;
        let eventBubbleButtonId = y;
        let btn = document.createElement("button");
        btn.innerText = "Event";

        btn.setAttribute("class", "eventBubbleButton");
        btn.setAttribute("id", eventBubbleButtonId);
        btn.addEventListener("click", function() {
            btn.remove();
            $("#eventTextBox").text(eventText)
            $("#eventBox").slideDown("slow");
            $("#eventBox").css({"display": "grid"})
        })
        $("#eventBubbleBox").append(btn);
        $("#" + eventBubbleButtonId).slideDown();

    }

    function eventImportantPopup(x, y, z, a) {
        let eventText = x;
        let currentEvent = y;
        let eventFocus = z;
        let eventType = a;

        $("#eventTextBox").text(eventText)

        if(eventType === "capture") {
            $("#eventButtonBox").hide();
            let optionsDiv = document.createElement("div")
            optionsDiv.setAttribute("id", "optionsDiv")
            let options = (wifeBot.tools).split("/")
            for(let i = 0 ; i < options.length; i ++) {
                let currentOption = $.grep(wifeBotCaptureTools, function(n){
                    return n.id === options[i]
                })
                console.log(currentOption)

                let chance = eventFocus.def - currentOption[0].atk;
                console.log(eventFocus.def)
                console.log(currentOption[0].atk)
                console.log(chance)
                if(chance < 0) {
                    chance = 1
                }
                else if(chance > 1) {
                    chance = 0
                }
                else {
                    chance = (1 - chance);
                }
                console.log(chance)

                let optionInnerDiv = document.createElement("div");
                optionInnerDiv.setAttribute("id", "optionInnerDiv" + currentOption[0].id)
                optionInnerDiv.innerText = currentOption[0].name + ": " + chance + "%"
                optionsDiv.append(optionInnerDiv)

                optionInnerDiv.addEventListener("click", function() {
                    optionsDiv.style.visibility="hidden";
                    let rand = Math.random();
                    if(rand <= chance) {
                        console.log("success!")
                        let matchingEvent = $.grep(eventArray, function(n) {
                            return n.eventType === "captureSuccess"
                        })

                        let selectedEvent = matchingEvent[Math.floor(Math.random() * matchingEvent.length)]
                        console.log(selectedEvent)
                        let newText = eventParseNew(selectedEvent, eventFocus);
                        expeditionArray.products.push(eventFocus);
                        expeditionCaptureUpdate(eventFocus)
                        $("#eventTextBox").text(newText)
                        $("#eventButtonBox").show();
                        console.log(expeditionArray)

                    }
                    else {
                        console.log("failure!")
                        let matchingEvent = $.grep(eventArray, function(n) {
                            return n.eventType === "captureFailure"
                        })

                        let selectedEvent = matchingEvent[Math.floor(Math.random() * matchingEvent.length)]
                        console.log(selectedEvent)
                        let newText = eventParseNew(selectedEvent, eventFocus);
                        $("#eventTextBox").text(newText)
                        $("#eventButtonBox").show();
                        console.log(expeditionArray)
                    }
                })
            }
            let eventBox =  document.getElementById("eventChoiceBox")
            eventBox.append(optionsDiv)
        }
        $("#eventBox").slideDown("slow");
        $("#eventBox").css({"display": "grid"})
    }

    function eventParseStraight(x, y) {
        let text = x;
        let focus = y
        let focusText = text.replace("@.", "")
        let dictMatch = $.grep(eventParseDictArray, function(n) {
            return n.id === focusText
        })
        let val = focus;
        for(let k = 0; k < dictMatch[0].steps.length; k++) {
            let step = dictMatch[0].steps[k];
            val = val[step]
        }
        return val
    }

    function eventParseSplit(x, y) {
        let text = x;
        let focus = y
        let focusText = text.replace("&", "")
        let focusTextSplit = focusText.split("$")
        for(let i = 1; i < focusTextSplit.length; i++) {
            let focusTextPieces = focusTextSplit[i].split("*")
            let parsedText = eventParseStraight(focusTextPieces[0], focus)
            let parsedVarText = focusTextPieces[1].split("/")
            if(parsedText === parsedVarText[0]) {
                let matchedText = parsedVarText[1];
                let checkedText = matchedText.split("#")
                for(let k = 0; k < checkedText.length; k++) {
                    if(checkedText[k].charAt(0) == "@") {
                        matchedText = matchedText.replace(checkedText[k], eventParseStraight(checkedText[k], focus))
                    }
                }
                text = matchedText.replace("#", " ")
                return text;
            }
            text = ""
            return text;
        }
    }

    function eventParseNew(x, y) {
        let text = x.eventText;
        let focus = y;

        let textSplit = text.split(" ")

        for(let i = 0; i < textSplit.length; i++) {
            if(textSplit[i].charAt(0) == "@") {
                text = text.replace(textSplit[i], eventParseStraight(textSplit[i], focus))
            }

            if(textSplit[i].charAt(0) == "&") {
                text = text.replace(textSplit[i], eventParseSplit(textSplit[i], focus))
            }
        }
        text = text.replace(" .", ".")
        return text;
    }


    function tooltipShow(x) {
        let element = x.target
        console.log(element)
        var toolTip = document.getElementById(element.id + "ToolTip")
        var btn = document.getElementById(element.id)
        var toolTipPosition = btn.getBoundingClientRect();

        var newTopPos = toolTipPosition.top + 225;
        var newLeftPos = toolTipPosition.left + 125;
        if (w < 2560 && h < 1440) {
            newTopPos = toolTipPosition.top + 125;
            var newLeftPos = toolTipPosition.left + 25;
        }
        toolTip.style.top = newTopPos + "px";
        toolTip.style.left = newLeftPos + "px";

        toolTip.style.display = "grid";
    }
    function tooltipHide(x) {
        let element = x.target
        document.getElementById(element.id + "ToolTip").style.display = "none";
    }

    function occupationClear(x) {
        let selectedCust = x;
        if(selectedCust.occupation) {
            let oldOccupation = $.grep(buildingSlots, function (n) {
                return n.id === selectedCust.occupation
            })
            oldOccupation[0].occupant = false;
        }

    }

    function progressBarBuildFunc(x, y, z) {
        let stat = x;
        let name = y;
        let target = z;

        let progressBar = document.createElement("div");
        let progressBarProgress = document.createElement("div");
        let progressBarDiv = document.createElement("div");
        let progressBarTitle = document.createElement("div");

        progressBar.setAttribute("class", "progressBar");
        progressBarProgress.setAttribute("class", "progressBarProgress");
        progressBarProgress.setAttribute("id", y + "ProgressBarProgress")
        progressBarDiv.setAttribute("class", "progressBarDiv");

        progressBarTitle.innerText = name;
        progressBarProgress.style.width = stat + "%";
        progressBarProgress.style.background = "green";

        progressBarDiv.append(progressBarTitle)
        progressBarDiv.append(progressBar);
        progressBar.append(progressBarProgress);
        target.append(progressBarDiv)
    }


    function dynamicProgressBuilder(x, y, z, a) {
        let progress = x;
        let total = y;
        let name = z;
        let target = a;

        let currentProgress = progressCheck(progress, total)

        let progressBarContainer = document.createElement("div");
        let progressBar = document.createElement("div");
        let progressBarProgress = document.createElement("div");
        let progressTextContainer = document.createElement("div");
        let title = document.createElement("div");
        let desc = document.createElement("div");


        progressBarContainer.setAttribute("class", "progressBarContainer");
        progressBar.setAttribute("class", "progressBar");
        progressBarProgress.setAttribute("class", "progressBarProgress")
        progressTextContainer.setAttribute("class", "progressTextContainer")
        title.setAttribute("class", "progressTextContainerTitle");
        desc.setAttribute("class", "progressTextContainerDesc");

        progressBarProgress.style.width = currentProgress + "%"
        progressBarProgress.style.background = "blue";

        title.innerText = name;

        progressBarContainer.append(progressTextContainer);
        progressTextContainer.append(title);
        progressTextContainer.append(desc);
        progressBarContainer.append(progressBar);
        progressBar.append(progressBarProgress);
        target.append(progressBarContainer);
    }

    function progressCheck(x, y) {
        let currentProgress = x;
        let totalProgress = y;
        console.log(currentProgress);
        console.log(totalProgress);

        let currentPercentage = currentProgress / totalProgress
        console.log(currentPercentage)
        currentPercentage = currentPercentage * 100;
        return currentPercentage
    }

    function screenCheck() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        if(w < 1920 && h < 1080) {
            $(".body").css({ "width": "98vw", "height": "96vh" });
            $(".textGen").css({ "font-size": "13px" });
            $(".anchor").css({'font-size': "13px"})
            $(".dropDownBtn").css({"font-size": "16px"})
            $(".btn:not(#pauseBtn, #normalSpdBtn, #slowSpdBtn, #dblSpeedBtn)").css({ "width": "75px", "font-size": "13px" });
            $(".researchPanel").css({ "width": "100px", "height": "100px", "font-size": "13px" });
            $(".researchPanelComplete").css({ "width": "100px", "height": "100px", "font-size": "13px" });
            $(".researchPanelSelected").css({ "width": "100px", "height": "100px", "font-size": "13px" });
            $(".researchPanelName").css({ "width": "100px", "height": "100px", "font-size": "13px" });
            $(".toolTipDiv").css({ "font-size": "13px" });
            $(".customerDiv").css({ "font-size": "13px" });
            $(".buildingSlot").css({ "font-size": "13px" });
            $(".buildingSlotBlocked").css({ "font-size": "13px" });
            $(".dropDownTabBlock").css({ "font-size": "13px" });
            $(".dropDownTabBlockInner").css({ "font-size": "13px" });
            $(".imgLogo").css({ "width": "60%", "height": "80%" })
            $(".img").css({ "width": "50%", "height": "50%" })
            $(".menuBtnText").css({'font-size': "13px"})
            $(".conditioningContainerTypeInnerText").css({'font-size': "13px"})
            $("#buildDescContainerInnerText").css({"font-size": "13px"})
            $(".titleDiv").css({"font-size": "13px"})
        }
        else if (w < 2560 && h < 1440) {
            $(".body").css({ "width": "98vw", "height": "98vh" });
            $(".textGen").css({ "font-size": "20px" });
            $(".anchor").css({'font-size': "20px"})
            $(".dropDownBtn").css({"font-size": "20px"})
            $(".btn:not(#pauseBtn, #normalSpdBtn, #slowSpdBtn, #dblSpeedBtn)").css({ "width": "125px", "font-size": "20px" });
            $(".researchPanel").css({ "width": "150px", "height": "100px"});
            $(".researchPanelComplete").css({ "width": "150px", "height": "100px"});
            $(".researchPanelSelected").css({ "width": "150px", "height": "100px"});
            $(".researchPanelName").css({ "width": "100px", "height": "100px"});
            $(".toolTipDiv").css({ "font-size": "20px" });
            $(".customerDiv").css({ "font-size": "20px" });
            $(".buildingSlot").css({ "font-size": "20px" });
            $(".buildingSlotBlocked").css({ "font-size": "20px" });
            $(".dropDownTabBlock").css({ "font-size": "20px" });
            $(".dropDownTabBlockInner").css({ "font-size": "20px" });
            $(".menuBtnText").css({'font-size': "20px"})
            $(".conditioningContainerTypeInnerText").css({'font-size': "20px"})
            $("#buildDescContainerInnerText").css({"font-size": "20px"})
            $(".titleDiv").css({"font-size": "20px"})

        }
        else if(w > 2560 && h > 1440) {
            $(".body").css({ "width": "98vw", "height": "98vh" });
            $(".textGen").css({ "font-size": "35px" });
            $(".anchor").css({'font-size': "35px"})
            $(".dropDownBtn").css({"font-size": "35px"})
            $(".btn:not(#pauseBtn, #normalSpdBtn)").css({ "font-size": "35px", "width": "200px" });
            $(".researchPanel").css({ "width": "200px", "height": "200px"});
            $(".researchPanelComplete").css({ "width": "200px", "height": "200px"});
            $(".researchPanelSelected").css({ "width": "200px", "height": "200px"});
            $(".researchPanelName").css({ "width": "200px", "height": "200px"});
            $(".toolTipDiv").css({ "font-size": "35px" });
            $(".customerDiv").css({ "font-size": "35px" });
            $(".buildingSlot").css({ "font-size": "35px" });
            $(".dropDownTabBlock").css({ "font-size": "35px" });
            $(".dropDownTabBlockInner").css({ "font-size": "35px" });
            $(".imgLogo").css({ "width": "70%", "height": "80%" })
            $(".menuBtnText").css({'font-size': "35px"})
            $(".conditioningContainerTypeInnerText").css({'font-size': "35px"})
            $("#buildDescContainerInnerText").css({"font-size": "35px"})
            $(".titleDiv").css({"font-size": "35px"})
        }
    }
    screenCheck();
    startUp();
});




