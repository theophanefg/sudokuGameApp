angular.module('starter.controllers', [])

.controller('PlayCtrl', function($http, $scope, $ionicHistory, $ionicPopup, Grid, $state,  $compile, $interval, Stats) {
  var adjacenceColor = '#d6f5d6';
  var digitColor = 'lightgreen';
  var selectedColor = '#5bd75b';
  var defaultColor = 'white';
  var errorColor = 'lightcoral';
  var savingRoutine;

  var timerMin = Grid.getTimerMin();
  var timerSec = Grid.getTimerSec();

  $scope.gridString = Grid.getGrid();
  $scope.errorSource = Grid.getErrorSource();
  $scope.playTitle = Grid.getDifficulty() + " " + timerMin + ":" + timerSec;
  initializeGrid($compile);
  initializeNumbers();
  updateGameMode();
  updateEntryMode();
  updateGrid();
  updateGridColorByCase(Grid.getCaseBuffer()[0], Grid.getCaseBuffer()[1]);
  //testJS();

  

  $scope.$on('$ionicView.enter', function(e) {
    savingRoutine = $interval(function(){
      if($ionicHistory.currentView().stateName != 'tab.play') {
        $interval.cancel(savingRoutine);
        return;
      }
      Grid.incrementTime();
      Grid.saveGame();
      updateTitle();
    }, 1000);
    if(Grid.getGameMode() == 1) {
     Grid.loadTimers1v1();
    }
  });

  $scope.updateGrid = function() {
    updateGrid();
  };

  $scope.getCaseValue = function(rowIndex, colIndex){
    Grid.getCaseValue(rowIndex, colIndex);
  };

  $scope.changeGameMode = function() {
    Grid.switchPlayMode();
    updateGameMode();
  };

  $scope.changeEntryMode = function() {
    Grid.switchEntryMode();
    updateEntryMode();
  };

  $scope.forfeitMatch = function() {
    var confirmPopup = $ionicPopup.confirm({
     // templateUrl: 'templates/tab-score.html',
      title: 'Forfeit match',
      subTitle: 'Are you sure you want to forfeit this match?',
      buttons: [
        {
          text: 'No'
        },
        {text: 'Yes',
          onTap: function(e) {
            $state.go("tab.play-menu-difficulty");
            forfeitMatch();
          }
        }        
      ]
    });
/*
    var popupBox = document.getElementsByClassName('popup')[0];
    popupBox.className += ' score-tab';
    var popupBoxBody = document.getElementsByClassName('popup-body')[0];
    popupBoxBody.className += ' score-tab-body';*/
  };

  $scope.casePressed = function (rowIndex, colIndex) {
    Grid.casePressed(rowIndex,colIndex);
    updateGrid();
    updateGridColorByCase(rowIndex, colIndex);
    if(Grid.checkIfGridIsComplete() == true) {
      finishGame();
    }
  };

  $scope.numberPressed = function (number) {
    Grid.numberPressed(number);
    updateGrid();
    updateGridColorByNumber(number);
    if(Grid.getPlayMode() == 1)
      updateNumbersColor(number);
    if(Grid.checkIfGridIsComplete() == true) {
      finishGame();

    }
  };

  $scope.erasePressed = function ()  {
    Grid.erasePressed();
    updateGrid();
  };

  function updateGameMode() {
    var idPlayMode = Grid.getPlayMode();
    var stringPlayMode = "case first";
    if (idPlayMode == 1) {
      updateNumbersColor(Grid.getNumberBuffer());
      stringPlayMode = "number first";
    }
    else
      updateNumbersColor('0');
    $scope.gameMode = "id= " + idPlayMode + ", " + stringPlayMode;
  }

  $scope.testJS = function() {
   //var socket = io('http://localhost:3000');
    console.log("---testJS---");
    /*$http.get("http://api.local.humanequation.co/answer/15").success(function (data) {
      //do something with data
      var dataReceived = data;
      console.log("data received: " + data);
    }).error(function () {
      alert('an unexpected error ocurred');
    });*/
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://rest-api-sudoku-app.local.humanequation.co/api/newgame/easy/1234", false);
    xhr.send();
    console.log("status" + xhr.status);
    console.log("text" + xhr.statusText);
    var jsonStuff = xhr.responseText;
    console.log("json stuff: " + jsonStuff);
  };



  function updateEntryMode() {
    var idEntryMode = Grid.getEntryMode();
    var stringEntryMode = "numbers";
    if (idEntryMode == 1)
      stringEntryMode = "notes";
    $scope.entryMode = "id= " + idEntryMode + ", " + stringEntryMode;
  }

  function initializeGrid($compile) {
    //createGrid();
    //Grid.startNewGame();
    var grid = document.getElementById("grid");
    for(var i = 0; i<9; i++) {
      var line = document.createElement("line");
      line.className += " line";
      for(var j = 0; j<9; j++) {
        var cell = document.createElement("cell");
        cell.className += " cell";
        line.appendChild(cell);


        var value = Grid.getInitialCaseValue(i,j);
        var id = i.toString() + j.toString();
        var element;
        var spans = '';
        for(var k = 0; k<9; k++) {
          //spans += "<span id = '" + i + j + k +"' class = 'span' >2</span>";
          spans += "<div class = 'notePos"+ k + "'><span id = '" + i + j + k +"' class = 'span' ></span></div>";
        }
        if(value > 0 && value <10 && value.length < 3 ) {
          element = spans+"<input class = 'button-case-stuck' type ='button' value = '' id = '" + id + "' ng-click='casePressed(" + i + "," + j + ")'/>";
        }
        else {
          element = spans+"<input class = 'button-case' type ='button' value = '' id = '" + id + "' ng-click='casePressed(" + i + "," + j + ")'/>";
        }
        var el = angular.element(cell);
        var generatedItem = el.html(element);
        $compile(generatedItem.contents())($scope);
      }
      grid.appendChild(line);
    }
  }

  function initializeNumbers() {
    var numbers = document.getElementById("numbers");
    for(var k = 1; k<10; k++) {
      var number = document.createElement("number");
      numbers.appendChild(number);
      var value = k;
      var id = k.toString();
      var element = "<input class = 'button-case' type ='button' value = " + value + " id = '" + id + "' ng-click='numberPressed(" + k + ")'/>";
      var el = angular.element(number);
      var generatedItem = el.html(element);
      $compile(generatedItem.contents())($scope);
    }
  }

  function updateGrid() {
    for(var i = 0; i<9; i++) {
      for(var j = 0; j<9; j++) {
        var caseData = Grid.getCaseValue(i,j);
        var id = i.toString() + j.toString();
        var cell = document.getElementById(id);
        //console.log("length:" +caseData.length);
        if(caseData.length<2 && caseData<10 && caseData>=0){
          cell.value = caseData;
          cleanDigits(i, j);
        }
        else {
          updateDigits(id, caseData);
        }
      }
    }
  }

  function updateDigits(caseId, data) {
    //console.log("--updateDigits");
    //console.log("data:" + data);
    for (var i = 0; i<9; i++) {
      var spanId = caseId + i;
      var span = document.getElementById(spanId);
      if (data[i] == 1) {
        span.textContent = i+1;
      }
      else {
        span.textContent = '';
      }
    }
  }

  function cleanDigits(rowIndex, colIndex) {
    //console.log("--cleanDigits");
    for (var i = 0; i<9; i++) {
      var spanId = rowIndex.toString() + colIndex.toString() + i;
      var span = document.getElementById(spanId);
      span.textContent = '';
    }
  }

  function forfeitMatch() {
    console.log("---forfeitMatch yo");
    $interval.cancel(savingRoutine);
    Grid.forfeitMatch();    
  }

  // sequence when the grid is completed
  function finishGame() {
    $interval.cancel(savingRoutine);
    Stats.loadHighScores();
    Stats.loadRecentScores();
    Stats.addScore(Grid.getTimerMin(), Grid.getTimerSec());
    Stats.saveHighScores();
    Grid.clearGame();
    //display highscores
    if (Grid.getGameMode() == 0) {
      var endGamePopup = $ionicPopup.show({
        templateUrl: 'templates/tab-score.html',
        title: 'Congratulation, you completed a grid!',
        buttons: [
          {text: 'Ok',
            onTap: function(e) {
              $state.go("tab.play-menu-difficulty");
            }
          }
        ]
      });

      var popupBox = document.getElementsByClassName('popup')[0];
      popupBox.className += ' score-tab';
      var popupBoxBody = document.getElementsByClassName('popup-body')[0];
      popupBoxBody.className += ' score-tab-body';
    }
    else if (Grid.getGameMode() == 1) {
      console.log ("saveScoreOnline ?");
      var winningStatus = Grid.saveScoreOnline();
      var paragraph = '';
      if (winningStatus == 1) {
        paragraph = 'You won!';
      } else if (winningStatus == 2) {
        paragraph = 'You lost!';
      } else if (winningStatus == 3) {
        paragraph = 'Game is not over yet, check the stats tab for results!';
      } else if (winningStatus == 4) {
        paragraph = "It's a tie!";
      }
      var onlineEndGamePopup = $ionicPopup.show({
        templateUrl: 'templates/tab-score.html',
        title: 'Congratulation, you completed an online grid!',
        subTitle: paragraph,
        buttons: [
          {text: 'Ok',
            onTap: function(e) {
              $state.go("tab.play-menu-difficulty");
            }
          }
        ]
      });

      var popupBox = document.getElementsByClassName('popup')[0];
      popupBox.className += ' score-tab';
      var popupBoxBody = document.getElementsByClassName('popup-body')[0];
      popupBoxBody.className += ' score-tab-body';
    }

    $interval.cancel(savingRoutine);

  }


  function updateGridColorByCase(rowIndex, colIndex) {
    var casePressed = document.getElementById(rowIndex.toString() + colIndex.toString());
    //updateGridColorByNumber(casePressed.value);
    var baseRowIndex = rowIndex - rowIndex %3;
    var endRowIndex = baseRowIndex +2;
    var baseColIndex = colIndex - colIndex %3;
    var endColIndex = baseColIndex +2;
    var errorSource = Grid.getErrorSource();
    for(var i = 0; i<9; i++) {
      for(var j = 0; j<9; j++) {
        var numberSelected = Grid.getNumberBuffer();
        var cell = document.getElementById(i.toString() + j.toString());
        var digitId = i.toString() + j.toString();
        if(Grid.getPlayMode() == 1 && Grid.getEntryMode() == 1) {
          digitId += (numberSelected -1).toString();
        }
        else {
          digitId += (casePressed.value-1).toString()
        }
        var digit = document.getElementById(digitId);

        // Tick black border to highlight the selected case
        if(cell.id == casePressed.id) {
          cell.style.borderColor = "black";
          cell.style.boxShadow = "inset 0px 0px 0px 1px black";
        }
        else {
          cell.style.borderColor = "grey";
          cell.style.boxShadow = "inset 0px 0px 0px 0px black";
        }

        // The cases from the beginning have a specific color
        if(cell.classList.contains('button-case-stuck')) {
          cell.style.backgroundColor = "#cccccc";
        }
        else if(i == rowIndex) {
          cell.style.backgroundColor = adjacenceColor;
        }
        else if(j == colIndex) {
          cell.style.backgroundColor = adjacenceColor;
        }
        else if(i >= baseRowIndex && i <= endRowIndex && j >= baseColIndex && j<= endColIndex) {
          cell.style.backgroundColor = adjacenceColor;
        }
        else {
          cell.style.backgroundColor = defaultColor;
        }
        // the number selected stays green all across the grid if we are in number first mode.
        if(Grid.getPlayMode() == 1 && Grid.getEntryMode() == 1) {
          if (digit != null && digit.textContent == numberSelected && Grid.getEnableNumberHighlighting()) {
            cell.style.backgroundColor = digitColor;
          }
          if (cell.value == numberSelected && Grid.getEnableNumberHighlighting()){
            cell.style.backgroundColor = selectedColor;
          }
        }
        if(casePressed.value > 0 && cell.value == casePressed.value && Grid.getEnableNumberHighlighting()) {
            cell.style.backgroundColor = selectedColor;
        }
        if (casePressed.value > 0 && digit.textContent == casePressed.value ) {
            cell.style.backgroundColor = digitColor;
        }

        if(i == errorSource[0] && j == errorSource[1]) {
          cell.style.backgroundColor = errorColor;
          console.log("jai trouve lerreur");
        }

      }
    }
  }

  function updateGridColorByNumber(number) {
    for(var i = 0; i<9; i++) {
      for(var j = 0; j<9; j++) {
        var cellId = i.toString() + j.toString();
        var digitId = cellId + (number-1).toString();
        var errorSource = Grid.getErrorSource();
        var cell = document.getElementById(cellId);
        var digit = document.getElementById(digitId);
        if(cell.value == number && number > 0 && Grid.getEnableNumberHighlighting()) {
          cell.style.backgroundColor = selectedColor;
        }
        else if (digit.textContent == number && Grid.getEnableNumberHighlighting()) {
          cell.style.backgroundColor = digitColor;
        }
        else if(cell.classList.contains('button-case-stuck')){
          cell.style.backgroundColor = "#cccccc";
        }
        else {
          cell.style.backgroundColor = defaultColor;
        }
        if(i == errorSource[0] && j == errorSource[1]) {
          cell.style.backgroundColor = errorColor;
          console.log("jai trouve lerreur");
        }
      }
    }
  }

  function updateNumbersColor(numberPressed) {
    for(var i = 0; i<9; i++) {
      var numberEl = document.getElementById((i+1).toString());
      if(numberEl.value == numberPressed) {
        numberEl.style.backgroundColor = "lightgrey";
      }
      else {
        numberEl.style.background = defaultColor;
      }
    }
  }



  function updateTitle() {
   // console.log("---updateTitle---");
    $scope.playTitle = Grid.getDifficulty() + " " + Grid.getTimerMin() + ":" + Grid.getTimerSec();
  }

/*
  function saveGrid() {
    window.localStorage.setItem("grid", JSON.stringify(Grid.getGrid()));
  }

  function saveInitGrid() {
    window.localStorage.setItem("initGrid", JSON.stringify(Grid.getInitialGrid()));
  }

  function loadGrid() {
    return JSON.parse(window.localStorage.getItem("grid"));
  }

  function loadInitialGrid() {
    return JSON.parse(window.localStorage.getItem("initGrid"));
  }
*/

})


.controller('GameModeCtrl', function($scope, Grid, Stats) {
  Grid.initializeSettings();

  $scope.clearLocalOnlineGames = function() {
    window.localStorage.removeItem("grid1v1easy");
    window.localStorage.removeItem("initGrid1v1easy");
    window.localStorage.removeItem("solGrid1v1easy");
    window.localStorage.removeItem("matchId1v1easy");

    window.localStorage.removeItem("grid1v1medium");
    window.localStorage.removeItem("initGrid1v1medium");
    window.localStorage.removeItem("solGrid1v1medium");
    window.localStorage.removeItem("matchId1v1medium");

    window.localStorage.removeItem("grid1v1hard");
    window.localStorage.removeItem("initGrid1v1hard");
    window.localStorage.removeItem("solGrid1v1hard");
    window.localStorage.removeItem("matchId1v1hard");

    window.localStorage.removeItem("grid1v1extreme");
    window.localStorage.removeItem("initGrid1v1extreme");
    window.localStorage.removeItem("solGrid1v1extreme");
    window.localStorage.removeItem("matchId1v1extreme");
  };

  $scope.playSolo = function() {
    Grid.setGameMode(0);
    Stats.setGameMode(0);
  };

  $scope.play1v1 = function () {
    Grid.setGameMode(1);
    Stats.setGameMode(1);
  };
})

.controller('DifficultyCtrl', function($scope, $ionicPopup, $state, Grid, Stats) {
  Grid.initializeSettings();
  var gameMode = Grid.getGameMode();

  $scope.play = function(difficulty) {
    //if there is a grid saved, display a choice to resume or start new, else just go to new grid
    console.log("---play---");
    Stats.setDifficulty(difficulty);
    Grid.setDifficulty(difficulty);
    console.log(" machin " + window.localStorage.getItem('grid1v1'+difficulty));
    if(gameMode == 0 && window.localStorage.getItem("gridSolo"+difficulty) != undefined) {
      var choicePopup = $ionicPopup.show({
        title: 'You have a game in progress.',
        scope: $scope,
        buttons: [
          {text: 'Resume', onTap: function(e) {resumeGame()}},
          {text: 'Start new game', onTap: function(e) {startNewGame()}}
        ]
      });
    }
    else if (gameMode == 1 && window.localStorage.getItem("grid1v1"+difficulty) != undefined) {
      resumeGame();
      console.log("---$scope.play: resumeGame triggered---");
    }
    else {
      startNewGame();
      console.log("---$scope.play: startNewGame triggered---");
    }

  };

  function resumeGame() {
    console.log("---resumeGame---");
    Grid.loadGame();
    $state.go("tab.play");
  }

  function startNewGame() {
    console.log("---startNewGame---");
    console.log("game mode: "+gameMode);
    if(gameMode == 0) {
      Grid.startNewSoloGame();
    }
    else {
      Grid.startNew1v1Game();
    }
    $state.go("tab.play");
  }


})

.controller('ScoreTabCtrl', function($scope, Stats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  console.log("jentre dans le controller scoreTabCtrl");
  Stats.updateScore($scope);
  $scope.$on('$ionicView.enter', function(e) {
    console.log("je suis dans levent ionicView.enter");
    Stats.updateScore($scope);
  });
  $scope.openScoreTab = function (difficulty) {
    console.log("je suis dans $scope.openScoreTab");
    openScoreTab(difficulty);
    Stats.updateScore($scope);
  };
  openScoreTab(Stats.getDifficulty());

  function openScoreTab(difficulty) {
    console.log("---scoreTabCtrl:openScoreTab---");
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("hs-tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("hs-tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active-tab", "");
      console.log(tablinks[i].className);
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    console.log('id de lelement donc on doit changer laffichage: ' + 'hs-' + difficulty);
    document.getElementById('hs-' + difficulty).style.display = "block";
    document.getElementById("hs-tab-"+difficulty).className += " active-tab";
  }


})

.controller('StatsCtrl', function($scope, Stats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  console.log("statsCtrl");
  $scope.$on('$ionicView.enter', function(e) {  
    openTab('hs');
    openScoreTab('easy');
    Stats.updateScore($scope);
    Stats.updateRecentScores($scope); 
    Stats.updateOnlineResults($scope); 
  });

  $scope.openTab= function(id) {
    openTab(id);
  };

  $scope.openScoreTab = function (difficulty) {
    openScoreTab(difficulty);
  };


  $scope.clearHighScores = function() {
    Stats.clearHighScores();
    Stats.updateScore($scope);
  };

  $scope.clearRecentScores = function() {
    Stats.clearRecentScores();
    Stats.updateRecentScores($scope);
  };

  $scope.clearOnlineResults = function() {
    Stats.clearOnlineResults();
    Stats.updateOnlineResults($scope);
  };

  function openTab(id) { // hs = high scores, mh = match history, rr = recent results
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("stats-tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("stats-tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active-tab", "");
      console.log(tablinks[i].className);
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById('stats-' + id).style.display = "inline-block";
    document.getElementById("stats-tab-"+id).className += " active-tab";
  }

  function openScoreTab(difficulty) {
    console.log("---statsCtrl:openScoreTab---");
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("hs-tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("hs-tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active-tab", "");
      console.log(tablinks[i].className);
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById('stats-hs-' + difficulty).style.display = "block";
    document.getElementById('hs-header-block').style.display = "block";
    document.getElementById("stats-hs-tab-"+difficulty).className += " active-tab";
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, Grid) {
  $scope.settings = {
    enableFriends: Grid.getEnableFriends(),
    enableErrorDetection: Grid.getEnableErrorDetection(),
    enableNoteAutoErasing: Grid.getEnableNoteAutoErasing(),
    enableNumberHighlighting: Grid.getEnableNumberHighlighting()
  };
  $scope.toggleErrorDetection = function() {
    Grid.toggleEnableErrorDetection();
  };

  $scope.toggleNoteAutoErasing = function() {
    Grid.toggleEnableNoteAutoErasing();
  };

  $scope.toggleNumberHighlighting = function() {
    Grid.toggleEnableNumberHighlighting();
  };

});
