angular.module('starter.services', [])


/**
 * This factory contains all the mandatory function to manage the gameplay part of the app, 
 * which takes part in the playTab.
 */
.factory('Grid', function(){
  /**
   * This is the grid displayed in the play tab of the app, the one the user can modify
   * It's a 2 dimensional array(9*9), containing numbers(strings) from 1 to 9, or spaces, which represent empty cells.
   * it can also contain a 9 number long string which indicates that it contains notes.
   *
   * @type: array
   */
  var grid;


  /**
   * This is the grid as it was in the beginning, its used to color the initial numbers and to stop
   * the user from modifiying these numbers
   * It's a 2 dimensional array(9*9), containing numbers from 1 to 9, or spaces, which represent empty cells.
   *
   * @type: array
   */
  var initGrid;


  /**
   * This is the solution to the current grid. It is used to verify is the user completed the grid
   * It's a 2 dimensional array(9*9), containing numbers from 1 to 9.
   *
   * @type: array
   */
  var solGrid;


  /**
   * This array contains 10 stringed easy grids. Each row is the base grid (first 81 numbers), and then
   * the solution (the following 81 numbers)
   *
   * @type: array
   */
  var easyGrids = [
    '070102090302860007004009560405000026020030080910000704061200300700083201050401070576142893392865417184379562435718926627934185918526734861257349749683251253491678',
    '032009040005001207000740085008056901600000004901270500360095000807300600020800410732589146485631297196742385278456931653918724941273568364195872817324659529867413',
    '700003804900002003002800000100050000470306085000040006000001300800200009301900008715693824984512763632874591168759432479326185523148976296481357847235619351967248',
    '620080401003600000000000308060702100040000070007903050706000000000008600904070082625387491893614725471529368368752149549861273217943856786235914152498637934176582',
    '060004000100006074097100060009300480700010002043009600070001930680200005000800020368574219125936874497182563219365487756418392843729651572641938681293745934857126',
    '000026000168700050090003600001050906000901000904030800009300010020009587000240000347526198168794253592813674871452936236981745954637821689375412423169587715248369',
    '000703050370800106050940000200000070530080092090000008000068030601007025040209000864713259379825146152946387218594673537681492496372518925168734681437925743259861',
    '509800030000050001000700840060028090150030072040610050093005000700060000020004509519846237874253961236791845367528194158439672942617358493185726785962413621374589',
    '000000829500200070240001000006009010102346907080100500000500048090002006835000000713465829569238471248971635376859214152346987984127563627593148491782356835614792',
    '000000307906830050000400008058006001203000905700300680600007000090042803807000000184265397976831254325479168458926731263718945719354682632587419591642873847193526'
  ];


  /**
   * This array contains 10 stringed medium grids. Each row is the base grid (first 81 numbers), and then
   * the solution (the following 81 numbers)
   *
   * @type: array
   */
  var mediumGrids = [
    '000609002007000105000507030006031250003050700028740900060405000704000300800103000135689472687324195249517638976831254413952786528746913361475829754298361892163547',
    '800014030070000905002006040410090200008060500005020013040600300301000050060380009856914732174832965932756148413598276728163594695427813249675381381249657567381429',
    '046000180000600040300004090050008009987000451400500020060100003030005000094000560546932187829671345371854296652418739987326451413597628265149873738265914194783562',
    '600070380082000000074900010007030000530701069000090700050007890000000650046050001695174382182563947374982516967435128538721469421896735253617894719248653846359271',
    '008200070426008009010090008000800290000146000087002000600020050200600941040009700938265174426718539715394628164873295592146387387952416679421853253687941841539762',
    '040620010305010002000508000030000201500701008109000070000302000900080304050067020748623915365914782291578436637859241524731698189246573416392857972185364853467129',
    '010000300070890500005700692000020036000506000360040000896001400002074080007000060219465378673892514485713692954128736721536849368947251896351427132674985547289163',
    '081000003000090180050401600000023001206000508800640000008206050093050000500000370781562493462397185359481627945823761236179548817645239178236954693754812524918376',
    '800005010305400700010030200080006020960000051020300090009040060006003908070600004842765319395412786617938245781596423963274851524381697139847562456123978278659134',
    '000007000010542078080900602030008000006495100000200080104009050260754010000600000342867591619542378587913642435178269826495137791236485174329856268754913953681724'
  ];


  /**
   * This array contains 10 stringed hard grids. Each row is the base grid (first 81 numbers), and then
   * the solution (the following 81 numbers)
   *
   * @type: array
   */
  var hardGrids = [
    '000012040050006108000980600001029000500468007000170400007051000305800090020690000876544449954736128213984675741329586532468917689175432497251863365847291128693754',
    '000002060200000847496005000004030070001907400050020300000200913189000004040100000873412569215396847496875132924531678631987425758624391567248913189763254342159786',
    '000103040080406050000005009009006870701000905038009100200300000050907010070204000695123748387496251142785369529631874761842935438579126214358697853967412976214583',
    '020074800040600207507000004203140000000000000000059701300000608904008050005420070126974835849635217537812964293147586751286493468359721372591648914768352685423179',
    '080029000000670800006053704000500007850060023100002000604280500008015000000340080781429365435671892296853714962538147857164923143792658614287539328915476579346281',
    '010000400004390065000200800000409008690805014500703000009002000720046500005000020213658479874391265956274831132469758697825314548713692369582147721946583485137926',
    '035042600021000740000090000300008004050203060200400007000060000096000310002830590735142689921685743648397125367918254854273961219456837183569472596724318472831596',
    '000069700002840060690500800010003609000000000708100050001002037020034100003610000184369725352847961697521843215483679946275318738196254861952437529734186473618592',
    '070516008005038000608002007060000100200040003004000060800100604000820900500364070472516398915738426638492517763285149259641783184973265827159634346827951591364872',
    '210000300003860500000003014040500700760000045001007020830600000007084900004000038218459367473861592956723814342516789769238145581947623835692471127384956694175238'
  ];


  /**
   * This array contains 10 stringed extreme grids. Each row is the base grid (first 81 numbers), and then
   * the solution (the following 81 numbers)
   *
   * @type: array
   */
  var extremeGrids = [
    '060700000700100068001540070006030090900601005070050300090014700510007004000005020265789431749123568381546972156438297923671845874952316698214753512397684437865129',
    '040090000100753094007002003080000056005000900410000070500100600370586009000070030843691725162753894957842163289317456735468912416925378524139687371586249698274531',
    '100400006000050087570000300000160730700302005013075000001000098680090000400008001132487956964253187578916324845169732796342815213875469351724698687591243429638571',
    '000800007004030500200506080005901003016000840700403100070308005001070200600002000569814327184237596237596481425981763316725849798463152972348615851679234643152978',
    '000920450000000000403005002047061200180040036006590710700400308000000000012039000678923451251684973493175862547361289189247536326598714765412398934856127812739645',
    '000009030000630981000000700094010308200304009701050260006000000143087000050400000518279436472635981369841725694712358285364179731958264826193547143587692957426813',
    '006072000300060000520040086090700008107000309200006070950080067000050002000290800846172593379568214521349786493715628167824359285936471952483167738651942614297835',
    '006013700000500032300409580008000005000948000700000200089602003270004000003190800856213794941587632327469581638721945512948376794356218189672453275834169463195827',
    '000109030130700006708003201900004010000000000080900007203800109600007082090502000542169738139728456768453291925674813376281945481935627253846179614397582897512364',
    '509004870800170000007006000080400900020709010005001060000500700000047001072600309519324876846175293237986145681452937324769518795831462168593724953247681472618359'
  ];


  /**
   * This array is the position of the cell that caused an error, if an error is detected. 
   * For instance, if there is a 5 at the position [3,3], and you try to put another five
   * in the same row, let's say at the position [3,5], this variable will take the value
   * [3,3], and it will be used to change the color of the corresponding cell in the displayed grid.
   *
   * @type: array
   */
  var errorSource = [-1,-1];


  /**
   * This int is a reprensation of the current game mode.
   * Its possible values are:
   *  0 for the solo mode, in which you play alone,
   *  1 for the 1v1 mode, in which you compete against an adversary, online,
   *  2 for the coop mode, in which you work with someone else to complete a grid, also online ( and which is yet to be implemented)
   *
   * @type: int
   */
  var gameMode;


  /**
   * This int is a reprensation of the current play mode.
   * Its possible values are:
   *  0 for cell first: you first select a cell, then press the number(s) you want to put in that cell
   *  1 for number first: you first select a number, then press the case(s) you want to put that number in
   * Default is cell first.
   *
   * @type: int
   */
  var playMode = 0;


  /**
   * This int is a reprensation of the current entry mode.
   * its possible values are:
   *  0 for numbers: When a number will be added to a cell, the current number and notes present in the cell
   *                 will be overwritten by the new number value
   *  1 for notes: When a number will be added to a cell, it will be in the form of a note. You can put one note
   *               for each possible value (1-9). You cant put a note in a case in which there is already a number,
   *               unless you first erase that number. Re-adding the same note to a case will toggle the said note.
   * Default entry mode is numbers.
   *
   * @type: int
   */
  var entryMode = 0;


  /**
   * This string holds the value of the currently selected number.
   * It's value is between 1 and 9 for a regular number, and is of 0 
   * if the erase option is selected
   *
   * @type: string
   */
  var numberBuffer = '1';


  /**
   * This array holds the value of the currently selected case. Its indexes
   * are from 0 to 8, to cover all the cases of the grid
   *
   * @type: array
   */
  var caseBuffer = [0,0];


  /**
   * This string holds the value of the current difficulty of the grid. It is mainly used
   * for grid generation.
   *
   * @type: string
   */
  var difficulty = 'easy';


  /**
   * This string contains the minute part of the timer of the current game.
   *
   * @type: string
   */
  var timerMin;


  /**
   * This string contains the seconds part of the timer of the current game.
   *
   * @type: string
   */
  var timerSec;


  /**
   * This boolean value indicates if the error detection feature is enabled.
   *
   * @type: bool
   */
  var enableErrorDetection = true;


  /**
   * This boolean value indicates if the notes are automaticly erased as
   * numbers are added to the grid.
   *
   * @type: bool
   */
  var enableNoteAutoErasing = true;


  /**
   * This boolean value indicates if the cases with the same value as the currently
   * selected number will be highligthed.
   *
   * @type: bool
   */
  var enableNumberHighlighting = true;


  /**
   * This string is the adress of the api querried in the online mode related functions.
   *
   * @type: string
   */
  var apiAddress = "http://rest-api-sudoku-app.local.humanequation.co/api";


  /**
   * This int holds the value of the current 1v1 online match.
   *
   * @type: int
   */
  var matchId; // used for online 1v1 game mode


  /**
   * This int holds the value of the player's ID, which is used for online matches.
   *
   * @type: int
   */
  var playerId = 4444;

  return {
    
    //*************************************************************
    //************************ ACCESSORS **************************
    //*************************************************************

    getGrid: function(){
      return grid;
    },

    getErrorSource:function(){
      return errorSource;
    },

    getCaseValue: function(rowIndex, colIndex){
      return grid[rowIndex][colIndex];
    },

    getInitialCaseValue: function(rowIndex, colIndex){
      return initGrid[rowIndex][colIndex];
    },

    getPlayMode: function() {
      return playMode;
    },

    getNumberBuffer: function() {
      return numberBuffer;
    },

    getCaseBuffer: function() {
      return caseBuffer;
    },

    getEntryMode: function() {
      return entryMode;
    },

    getDifficulty: function () {
      return difficulty;
    },

    setDifficulty: function(newDiff) {
      difficulty = newDiff;
      console.log("--- setDifficulty---");
      console.log("diff : " + difficulty);
    },

    getGameMode: function() {
      return gameMode;
    },

    setGameMode: function(newGameMode) {
      gameMode = newGameMode;
    },


    //*************************************************************
    //**************** GAMEPLAY RELATED FUNCTIONS *****************
    //*************************************************************


    /**
     * Switch the value of the play mode from 0 to 1 or from 1 to 0
     */
    switchPlayMode: function() {
      // if play mode is cell first
      if(playMode == 0) {
        playMode = 1;
      }
      // if play mode is number first
      else {
        playMode = 0;
      }

    },


    /**
     * Switch the value of the entry mode from 0 to 1 of from 1 to 0
     */
    switchEntryMode: function() {
      // if entry mode is numbers
      if(entryMode == 0) {
        entryMode = 1;
      }
      // if entry mode is digits
      else {
        entryMode = 0;
      }
    },


    /**
     * Handles the event of the pressing of a case via the user interface.
     * 
     * @param {int} rowIndex
     * @param {int} colIndex
     */
    casePressed: function(rowIndex, colIndex) {
      // if entry mode is numbers
      if(entryMode == 0) {
        // if play mode is cell first, we select the case
        if(playMode == 0) {
          caseBuffer[0] = rowIndex;
          caseBuffer[1] = colIndex;
          errorSource[0] = -1;
          errorSource[1] = -1;
        }
        // if play mode is digit first, we put the selected digit in the case pressed
        else if (initGrid[rowIndex][colIndex] < 1 || initGrid[rowIndex][colIndex] > 9){
          if(numberBuffer == '0' )
            this.eraseNumber(rowIndex, colIndex);
          else if (numberBuffer != '0' )
            this.changeNumber(numberBuffer, rowIndex, colIndex);
        }
      }
      // if entry mode is notes
      else {
        // if play mode is cell first, we select the case
        if(playMode == 0) {
          caseBuffer[0] = rowIndex;
          caseBuffer[1] = colIndex;
          errorSource[0] = -1;
          errorSource[1] = -1;
        }
        // if play mode is digit first, we put the selected digit in the case pressed
        else {
          if(numberBuffer == '0' && (initGrid[rowIndex][colIndex] < 1 || initGrid[rowIndex][colIndex] > 9))
            this.eraseNumber(rowIndex, colIndex);
          // check if the case countains a note or nothing
          else if (numberBuffer != '0' && (grid[rowIndex][colIndex] > 9 || grid[rowIndex][colIndex] < 1 || grid[rowIndex][colIndex].length > 2))
            this.toggleDigit(numberBuffer, rowIndex, colIndex);
        }
      }


    },


    /**
     * Handles the event of the pressing of a number via the user interface.
     * 
     * @param {int} number
     */
    numberPressed: function(number) {
      //console.log("--numberPressed--");
      // if entry mode is numbers
      if(entryMode == 0) {
        // if play mode is cell first, we put the number pressed in the cell selected previously
        if(playMode == 0) {
          //we make sure we have selected a case first
          if(caseBuffer[0] != -1 && (initGrid[caseBuffer[0]][caseBuffer[1]] < 1 || initGrid[caseBuffer[0]][caseBuffer[1]] > 10))
            this.changeNumber(number,caseBuffer[0],caseBuffer[1]);
        }
        // if play mode is digit first, we select the number
        else {
          numberBuffer = number;
          errorSource[0] = -1;
          errorSource[1] = -1;
        }
      }
      // if entry mode is notes
      else {
        console.log("numberPressed--digitmode");
        // if play mode is cell first, , we put the number pressed in the cell selected previously
        if(playMode == 0) {
          //we make sure we have selected a case first and it contains digits or nothing
          var value = grid[caseBuffer[0]][caseBuffer[1]];
          if(caseBuffer[0] != -1 && (value > 10 || value < 1 || value.length > 2))
            this.toggleDigit(number,caseBuffer[0],caseBuffer[1]);
        }
        // if play mode is digit first, we select the number
        else {
          numberBuffer = number;
          errorSource[0] = -1;
          errorSource[1] = -1;
        }
      }

    },


    /**
     * Handles the event of the pressing of the erase buttons via the user interface.
     */
    erasePressed: function() {
      console.log("--erasePressed--");
      // if play mode is cell first, we erase the the stuff in the selected case
      if(playMode == 0) {
        //we make sure we have selected a case first
        if(caseBuffer[0] != -1 &&(initGrid[caseBuffer[0]][caseBuffer[1]] < 1 || initGrid[caseBuffer[0]][caseBuffer[1]] > 10))
          this.eraseNumber(caseBuffer[0],caseBuffer[1]);
      }
      // if play mode is digit first, we select the 0
      else {
        numberBuffer = '0';
      }
    },


    /**
     * Put the value of the currently selected cell to ' '
     * 
     * @param {int} rowIndex
     * @param {int} colIndex
     */
    eraseNumber: function(rowIndex, colIndex){
      console.log("--eraseNumber");
      grid[rowIndex][colIndex] = ' ';
    },


    /**
     * We change the value of the cell at the passed coordinates for the passed value,
     * unless it is against the rules of the sudoku game!
     * 
     * @param {int} newValue
     * @param {int} rowIndex
     * @param {int} colIndex
     */
    changeNumber: function(newValue,  rowIndex, colIndex){
        // verifier si le nombre est a un endroit correct

      var isValid = true;
      if(enableErrorDetection) {
        isValid = this.checkValidity(newValue, rowIndex, colIndex);
      }
      if(isValid == true) {
        grid[rowIndex][colIndex] = newValue.toString();
        if (enableNoteAutoErasing) {
          this.eraseDigits(newValue, rowIndex, colIndex);
        }

        errorSource[0]= -1;
        errorSource[1]= -1;
      }
        // si cest correct selon la verification, changer le nombre, sinon renvoyer lancienne valeur
    },


    /**
     * Used to replace a caracter at a specific index for the passed character, in a string.
     * 
     * @param {string} string
     * @param {int} index
     * @param {char} character
     * @return {string}
     */
    replaceAt: function(string, index, character) {
      return string.substr(0, index) + character + string.substr(index+character.length);
    },


    /**
     * Used to toggle a digit for the note mode, at the cell a the passed coordinates
     * 
     * @param {int} digitValue
     * @param {int} rowIndex
     * @param {int} colIndex
     * @return {string}
     */
    toggleDigit: function(digitValue,  rowIndex, colIndex){
      // if the case is not yet in the digit format, we put the string '000000000'
      // inside of it, which means all notes are at 0
      if (grid[rowIndex][colIndex].length < 3) {
        grid[rowIndex][colIndex] = '000000000';
      }
      // if the value at the passed coordinates is 0, we change it for 1
      if(grid[rowIndex][colIndex][digitValue-1] == '0') {
        grid[rowIndex][colIndex]= this.replaceAt(grid[rowIndex][colIndex], digitValue -1 , '1');
      }
      // if the value at the passed coordinates is 1, we change it for 0
      else if (grid[rowIndex][colIndex][digitValue-1] == '1') {
        grid[rowIndex][colIndex]= this.replaceAt(grid[rowIndex][colIndex], digitValue -1 , '0');
      }
      errorSource[0]= -1;
      errorSource[1]= -1;
    },


    /**
     * check if the passed number at the cell corresponding to the passed coordinates respects the rules
     * of sudoku
     * 
     * @param {int} newValue
     * @param {int} rowIndex
     * @param {int} colIndex
     * @return {bool} isValid
     */
    checkValidity: function(newValue,  rowIndex, colIndex){
      var isValid = true;
      var rowCheckedIsValid = this.checkRow(newValue, rowIndex, colIndex);
      if (rowCheckedIsValid[0] == true){
        var colCheckedIsValid = this.checkColumn(newValue, rowIndex, colIndex);
        if(colCheckedIsValid[0] == true){
          var squareCheckedIsValid = this.checkSquare(newValue, rowIndex, colIndex);
          if(squareCheckedIsValid[0] == false && squareCheckedIsValid[1]) {
            isValid = false;
            errorSource[0] = squareCheckedIsValid[1];
            errorSource[1] = squareCheckedIsValid[2];
          }
        }
        else{
          isValid = false;
          errorSource[0] = colCheckedIsValid[1];
          errorSource[1] = colCheckedIsValid[2];
        }
      }
      else {
        isValid = false;
        errorSource[0] = rowCheckedIsValid[1];
        errorSource[1] = rowCheckedIsValid[2];
      }
      return isValid;
    },


    /**
     * check if there is the same value somewhere else in the row of the cell 
     * corresponding to the passed coordinates.
     * 
     * @param {int} newValue
     * @param {int} rowIndex
     * @param {int} colIndex
     * @return {bool} isValid
     */
    checkRow: function(newValue, rowIndex, colIndex) {
      var isValid = [true,0,0]; // isValid[1] is row index, isValid[2] is column index
      for (var i = 0; i < 9; i++) {
        if(grid[rowIndex][i].length < 2 && grid[rowIndex][i] == newValue && i!= colIndex) {
          isValid[0] = false;
          isValid[1] = rowIndex;
          isValid[2] = i;
          //console.log("erreur row");
        }
      }
      return isValid;
    },


    /**
     * check if there is the same value somewhere else in the column of the cell 
     * corresponding to the passed coordinates.
     * 
     * @param {int} newValue
     * @param {int} rowIndex
     * @param {int} colIndex
     * @return {bool} isValid
     */
    checkColumn: function(newValue, rowIndex, colIndex) {
      var isValid = [true,0,0]; // isValid[1] is row index, isValid[2] is column index
      for (var i = 0; i < 9; i++) {
        if(grid[i][colIndex] == newValue && i != rowIndex){
          isValid[0] = false;
          isValid[1] = i;
          isValid[2] = colIndex;
          //console.log("erreur col");
        }
      }
      return isValid;
    },


    /**
     * check if there is the same value somewhere else in the square of the cell 
     * corresponding to the passed coordinates.
     * 
     * @param {int} newValue
     * @param {int} rowIndex
     * @param {int} colIndex
     * @return {bool} isValid
     */
    checkSquare: function(newValue,  rowIndex, colIndex) {
      var isValid = [true,0,0]; // isValid[1] is row index, isValid[2] is column index
      var baseRowIndex = rowIndex - rowIndex%3;
      var baseColIndex = colIndex - colIndex%3;
      for (var i = baseRowIndex; i < baseRowIndex+3; i++) {
        for (var j = baseColIndex; j < baseColIndex+3; j++) {
          if(grid[i][j] == newValue && i != rowIndex && j != colIndex) {
            isValid[0] = false;
            isValid[1] = i;
            isValid[2] = j;
            //console.log("erreur square");
          }
        }
      }
      return isValid;
    },


    /**
     * This method is called whenever a new number is passed to the grid (not a note, a number!).
     * It does erase the notes of the same value as the passed 'newValue' if it is in the same row,
     * column or square as the cell corresponding to the passed coordinates. 
     * 
     * @param {int} newValue
     * @param {int} rowIndex
     * @param {int} colIndex
     * @return {bool} isValid
     */
    eraseDigits: function(newValue, rowIndex, colIndex) {
      //check row
      for (var i = 0; i<9; i++) {
        if(this.checkDigit(newValue, rowIndex, i) == 1 && i != colIndex) {
          grid[rowIndex][i] = this.replaceAt(grid[rowIndex][i], (newValue -1), '0');
        }

      }
      //check col
      for (var j = 0; j<9; j++) {
        if(this.checkDigit(newValue, j, colIndex) == 1 && j != rowIndex) {
          grid[j][colIndex] = this.replaceAt(grid[j][colIndex], (newValue -1), '0');
        }
      }
      //check square
      var baseRowIndex = rowIndex - rowIndex%3;
      var baseColIndex = colIndex - colIndex%3;
      for (var k = baseRowIndex; k < baseRowIndex+3; k++) {
        for (var l = baseColIndex; l < baseColIndex+3; l++) {
          if(this.checkDigit(newValue, k, l) == 1  && k != rowIndex && l != colIndex) {
            grid[k][l] = this.replaceAt(grid[k][l], (newValue -1), '0');
          }
        }
      }
    },


    /**
     * return true if digit checked is there, 0 if it isnt
     * 
     * @param {int} value
     * @param {int} rowIndex
     * @param {int} colIndex
     * @return {int} 1 or 0
     */
    checkDigit: function(value, rowIndex, colIndex) {
      if(grid[rowIndex][colIndex].charAt(value-1) == 1) {
        return 1;
      }
      else {
        return 0;
      }
    },


    /**
     * We check if every cell of the grid has the good value, comparing with the solGrid
     * 
     * @return {bool} isComplete
     */
    checkIfGridIsComplete: function() {
      var isComplete = true;
      for (var i = 0; i<9 ; i++) {
        for (var j = 0; j<9 ; j++) {
          if(grid[i][j]!= solGrid[i][j]) {
            isComplete = false;
          }
        }
      }
      return isComplete;
    },

    //*************************************************************
    //**************** GAME START RELATED FUNCTIONS****************
    //*************************************************************


    /**
     * This function generates a new grid and initializes the modifiable grid (grid), 
     * the initial grid (initGrid) and the solution grid (solGrid).
     * it also initializes the timers.
     */
    startNewSoloGame: function() {
     // console.log('----startnewsologame---');
      var newGrid = this.generateGrid();
      grid = JSON.parse(JSON.stringify(newGrid[0]));
      initGrid = JSON.parse(JSON.stringify(newGrid[0]));
      solGrid = JSON.parse(JSON.stringify(newGrid[1]));
      timerMin = '00';
      timerSec = '00';
    },


    /**
     * This function qureries the server to create a new online game.
     * The server sends back the grid for the new game as an array containing
     * both the completed and the clean grids, both as 2 dimensions array, and the id.
     * [[cleanGrid,completedGrid], matchId]
     *
     * It then initializes the modifiable grid (grid), 
     * the initial grid (initGrid) and the solution grid (solGrid).
     * it also initialize the timers.
     */
    startNew1v1Game: function() {
      //console.log('----startnew1v1game---');
      var xhr = new XMLHttpRequest();
      xhr.open("GET", apiAddress+"/newgame/" + difficulty + "/" + playerId, false);
      xhr.send();
      console.log("status" + xhr.status);
      console.log("text" + xhr.statusText);
      matchId = JSON.parse(xhr.responseText)[1];
      console.log('matchId: '+matchId);
      var completedGrid = JSON.parse(xhr.responseText)[0][1];
      var cleanGrid = JSON.parse(xhr.responseText)[0][0];
      // initializations
      grid = JSON.parse(JSON.stringify(cleanGrid));
      initGrid = JSON.parse(JSON.stringify(cleanGrid));
      solGrid = JSON.parse(JSON.stringify(completedGrid));
      timerMin = '00';
      timerSec = '00';
    },


    /**
     * This function gets a stringedgrid, then parses it as 2 arrays, completedGrid and cleanGrid.
     * It then shuffle the rows, columns and digits of both grids and returns an array containing the
     * shuffledGrids.
     * @return {array} 
     */
    generateGrid: function () {
      //console.log('---generateGrid---');
      var gridNumber = Math.floor(Math.random() * 10); // 0 to 9
      console.log("grid number:" + gridNumber);
      //var gridString = '076142893392865417184379562435718926627934185918526734861257349749683251253491678576142893392865417184379562435718926627934185918526734861257349749683251253491678';
      var gridString = this.getGridString(gridNumber);
      var completedGrid = this.getCompletedGrid(gridString);
      var cleanGrid = this.getCleanGrid(gridString);
      return this.shuffleGrids(completedGrid, cleanGrid);
    },


    /**
     * This function sends a query to the server to advice of the forfeit of the player
     */
    forfeitMatch: function () {
      this.clearGame();
      if(gameMode == 1) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiAddress+"/forfeitmatch/" + matchId + "/" + playerId, false);
        xhr.send();
        //matchId = JSON.parse(xhr.responseText)[1];
      }
    },

    //**************** GRID SHUFFLING FUNCTIONS********************


    /**
     * This function does a random number of shuffeling which are all also determined randomly.
     * It then swap a random number of pair of digits determined randomly also. 
     * @return {array} 
     */
    shuffleGrids: function (completedGrid, cleanGrid) {
      var shuffledGrids = [];
      shuffledGrids.push(cleanGrid);
      shuffledGrids.push(completedGrid);

      // random number of random shuffle operation
      var nShuffles = Math.floor(Math.random() * 31) +10; // 10 a 40
      for ( var i=0; i<nShuffles; i++) {
        var actionNumber = Math.floor(Math.random() * 4); // 0 a 3
        var row1, row2, col1, col2;
        switch(actionNumber) {
          // swaps 2 row of squares
          case 0:
            row1 = Math.floor(Math.random() * 3) ;
            row2 = Math.floor(Math.random() * 3) ;
            while(row1 == row2) {
              row2 = Math.floor(Math.random() * 3) ;
            }
            shuffledGrids[0] = this.shuffleSquareRows(shuffledGrids[0], row1, row2);
            shuffledGrids[1] = this.shuffleSquareRows(shuffledGrids[1], row1, row2);
            break;
          // swaps 2 columns of squares
          case 1:
            col1 = Math.floor(Math.random() * 3) ;
            col2 = Math.floor(Math.random() * 3) ;
            while(col1 == col2) {
              col2 = Math.floor(Math.random() * 3) ;
            }
            shuffledGrids[0] = this.shuffleSquareCols(shuffledGrids[0], col1, col2);
            shuffledGrids[1] = this.shuffleSquareCols(shuffledGrids[1], col1, col2);
            break;
          // swaps 2 rows
          case 2:
            var rowSqu = Math.floor(Math.random() * 3);
            row1 = rowSqu*3 + Math.floor(Math.random() * 3) ;
            row2 = rowSqu*3 + Math.floor(Math.random() * 3) ;
            while(row1 == row2) {
              row2 = rowSqu*3 + Math.floor(Math.random() * 3) ;
            }
            shuffledGrids[0] = this.shuffleRows(shuffledGrids[0], row1, row2);
            shuffledGrids[1] = this.shuffleRows(shuffledGrids[1], row1, row2);
            break;
          // swaps 2 columns
          case 3:
            var colSqu = Math.floor(Math.random() * 3);
            col1 = colSqu*3 + Math.floor(Math.random() * 3) ;
            col2 = colSqu*3 + Math.floor(Math.random() * 3) ;
            while(col1 == col2) {
              col2 = colSqu*3 + Math.floor(Math.random() * 3) ;
            }
            shuffledGrids[0] = this.shuffleCols(shuffledGrids[0], col1, col2);
            shuffledGrids[1] = this.shuffleCols(shuffledGrids[1], col1, col2);
            break;
          default:
            break;
        }
      }

      // random number of digit swap operations
      var nDigitShuffle = Math.floor(Math.random() * 6)+2; // 2 a 7
      for (i=0; i<nDigitShuffle; i++) {
        var digit1 = Math.floor(Math.random() * 9)+1;
        var digit2 = Math.floor(Math.random() * 9)+1;
        while (digit1 == digit2) {
          digit2 = Math.floor(Math.random() * 9)+1;
        }
        shuffledGrids[0] = this.swapDigits(shuffledGrids[0], digit1, digit2);
        shuffledGrids[1] = this.swapDigits(shuffledGrids[1], digit1, digit2);
      }
      return shuffledGrids;
    },


    /**
     * This function swap all the cells from 2 rows of square
     * @return {array} 
     */
    shuffleSquareRows: function (grid , row1, row2) { //row value between 0 and 2
      //console.log('---shuffleSquareRow---');

      var shuffledGrid = [];
      for(var i = 0; i< 9; i++) {
        var row = [];
        var j = 0;
        if((i-i%3)/3 == row1) {
          //console.log('cond 1');
          for(j = 0; j< 9; j++) {
            row.push(grid[(row2-row1)*3+i][j]);
          }
        }
        else if((i-i%3)/3 == row2) {
          //console.log('cond 2');
          for(j = 0; j< 9; j++) {
            row.push(grid[(row1-row2)*3+i][j]);
          }
        }
        else {
          //console.log('cond 3');
          for(j = 0; j< 9; j++) {
            row.push(grid[i][j]);
          }
        }
        shuffledGrid.push(row);
      }
      return shuffledGrid;
    },


    /**
     * This function swap all the cells from 2 rows
     * @return {array} 
     */
    shuffleRows: function (grid, row1, row2) {
      //console.log('---ShuffleRows---');
      var shuffledGrid = [];
      for(var i = 0; i< 9; i++) {
        var row = [];
        var j = 0;
        if(i == row1) {
          //console.log('cond 1');
          for(j = 0; j< 9; j++) {
            row.push(grid[row2][j]);
          }
        }
        else if(i == row2) {
          //console.log('cond 2');
          for(j = 0; j< 9; j++) {
            row.push(grid[row1][j]);
          }
        }
        else {
          //console.log('cond 3');
          for(j = 0; j< 9; j++) {
            row.push(grid[i][j]);
          }
        }

        shuffledGrid.push(row);
      }
      return shuffledGrid;
    },


    /**
     * This function swap all the cells from 2 columns of square
     * @return {array} 
     */
    shuffleSquareCols: function (grid, col1, col2) { //col value between 0 and 2
      //console.log('---shuffleSquareCols---');
      var shuffledGrid = [];

      for(var i = 0; i< 9; i++) {
        var row = [];
        for(var j = 0; j< 9; j++) {
          if((j-j%3)/3 == col1) {
            //console.log('cond 1');
            row.push(grid[i][(col2-col1)*3+j]);
          }
          else if ((j-j%3)/3 == col2) {
            //console.log('cond 2');
            row.push(grid[i][(col1-col2)*3+j]);
          }
          else {
            //console.log('cond 3');
            row.push(grid[i][j]);
          }

        }
        shuffledGrid.push(row);
      }
      return shuffledGrid;
    },


    /**
     * This function swap all the cells from 2 colunmns
     * @return {array} 
     */
    shuffleCols: function (grid, col1, col2) {
      //console.log('---shuffleCols---');
      var shuffledGrid = [];

      for(var i = 0; i< 9; i++) {
        var row = [];
        for(var j = 0; j< 9; j++) {
          if(j == col1) {
            //console.log('cond 1');
            row.push(grid[i][col2]);
          }
          else if (j == col2) {
            //console.log('cond 2');
            row.push(grid[i][col1]);
          }
          else {
            //console.log('cond 3');
            row.push(grid[i][j]);
          }

        }
        shuffledGrid.push(row);
      }
      return shuffledGrid;
    },


    /**
     * This function two digits on the grid
     * @return {array} 
     */
    swapDigits: function (grid, digit1, digit2) {
      //console.log('---swapDigits---');
      var shuffledGrid = [];
      for(var i = 0; i< 9; i++) {
        var row = [];
        for(var j = 0; j< 9; j++) {
          var val = grid[i][j];
          if(val == digit1) {
            row.push(digit2.toString());
          }
          else if(val == digit2) {
            row.push(digit1.toString())
          }
          else {
            row.push(val);
          }
        }
        shuffledGrid.push(row);
      }
      return shuffledGrid;
    },


    /**
     * This function gets the stringed grid positioned at the gridNumber passed in the array corresponding
     * to the difficulty of the match.
     * @return {array} 
     */
    getGridString: function(gridNumber) {
      //console.log ('---getGridString---');
      var gridString = '';
      if (difficulty == 'easy') {
        gridString = easyGrids[gridNumber];
      }
      else if (difficulty == 'medium') {
        gridString = mediumGrids[gridNumber];
      }
      else if (difficulty == 'hard') {
        gridString = hardGrids[gridNumber];
      }
      else if (difficulty == 'extreme') {
        gridString = extremeGrids[gridNumber];
      }
      return gridString;

    },


    /**
     * This function gets the 81 caracters from the 81th position of the stringedGrid passed 
     * and then parses it as an array
     * @return {array} 
     */
    getCompletedGrid: function(gridString) {
      var comGridString = gridString.substr(81,81);
      return this.parseStringToGrid(comGridString);
    },


    /**
     * This function gets the 81 first caracters of the stringedGrid passed 
     * and then parses it as an array
     * @return {array} 
     */
    getCleanGrid: function(gridString) {
      var cleanGridString = gridString.substr(0,81);
      return this.parseStringToGrid(cleanGridString);
    },


    /**
     * This function parses the string passed to a 2 dimensional array
     * @return {array} 
     */
    parseStringToGrid: function(string) {
      var grid = [];
      for (var i = 0; i<9; i++) {
        var row = [];
        for (var j = 0; j<9; j++) {
          var val = string[i * 9 + j ];
          if(val == 0) {
            row.push(' ');
          }
          else {
            row.push(val);
          }
        }
        grid.push(row);
      }
      return grid;
    },



    //*************************************************************
    //**************** GAME SAVING RELATED FUNCTIONS***************
    //*************************************************************


    /**
     * This function saves the informations of the current match depending
     * upon if the game mode is single player or multiplayer
     */
    saveGame: function () {
      // console.log("---saveGame---");
      // if single player
      if(gameMode == 0) {
        this.saveGridSolo();
        this.saveInitGridSolo();
        this.saveSolGridSolo();
        this.saveTime();
      }
      // if playing 1v1
      else if (gameMode == 1) {
        this.saveGrid1v1();
        this.saveInitGrid1v1();
        this.saveSolGrid1v1();
        this.saveMatchId1v1();
      }
    },

    /**
     * This function saves locally the current state of the grid depending upon the difficulty
     */
    saveGridSolo: function() {
      window.localStorage.setItem("gridSolo"+difficulty, JSON.stringify(grid));
    },


    /**
     * This function saves locally the initial state of the grid depending upon the difficulty
     */
    saveInitGridSolo: function() {
      window.localStorage.setItem("initGridSolo"+difficulty, JSON.stringify(initGrid));
    },


    /**
     * This function saves locally the completed state of the grid depending upon the difficulty
     */
    saveSolGridSolo: function() {
      window.localStorage.setItem("solGridSolo"+difficulty, JSON.stringify(solGrid));
    },


    /**
     * This function saves locally the current state of the 1v1 grid depending upon the difficulty
     */
    saveGrid1v1: function() {
      window.localStorage.setItem("grid1v1"+difficulty, JSON.stringify(grid));
    },


    /**
     * This function saves locally the initial state of the 1v1 grid depending upon the difficulty
     */
    saveInitGrid1v1: function() {
      window.localStorage.setItem("initGrid1v1"+difficulty, JSON.stringify(initGrid));
    },

    saveSolGrid1v1: function() {
      window.localStorage.setItem("solGrid1v1"+difficulty, JSON.stringify(solGrid));
    },


    /**
     * This function saves locally the completed state of the 1v1 grid depending upon the difficulty
     */
    saveMatchId1v1: function() {
      window.localStorage.setItem("matchId1v1"+difficulty, JSON.stringify(matchId));
    },


    /**
     * This function queries the server to save online the score of the player
     * @return {int} winning status
     */
    saveScoreOnline: function () {
      var xhr = new XMLHttpRequest();
      var time = (parseInt(timerMin) * 60 + parseInt(timerSec)).toString();
      xhr.open("GET", apiAddress+"/savescore/" + matchId + "/" + playerId + "/" + time, false);
      xhr.send();
      return JSON.parse(xhr.responseText);
    },


    /**
     * This function saves the current time locally
     */
    saveTime: function() {
      window.localStorage.setItem("timerMin"+difficulty, JSON.stringify(timerMin));
      window.localStorage.setItem("timerSec"+difficulty, JSON.stringify(timerSec));
    },


    /**
     * This function loads the grids and timers from the locally saved data
     */
    loadGame: function () {
      console.log("---loadGame---");
      if(gameMode == 0) {
        this.loadGridSolo();
        this.loadInitGridSolo();
        this.loadSolGridSolo();
        this.loadTimerMin();
        this.loadTimerSec();
      }
      else if (gameMode == 1) {
        this.loadGrid1v1();
        this.loadInitGrid1v1();
        this.loadSolGrid1v1();
        this.loadMatchId1v1();
        this.loadTimers1v1();
      }

    },


    /**
     * This function loads the modifiable grid from the locally saved data
     */
    loadGridSolo: function () {
      grid = JSON.parse(window.localStorage.getItem("gridSolo"+difficulty));
    },


    /**
     * This function loads the initial grid from the locally saved data
     */
    loadInitGridSolo: function () {
      initGrid = JSON.parse(window.localStorage.getItem("initGridSolo"+difficulty));
    },


    /**
     * This function loads the completed grid from the locally saved data
     */
    loadSolGridSolo: function () {
      solGrid =  JSON.parse(window.localStorage.getItem("solGridSolo"+difficulty));
    },


    /**
     * This function loads the 1v1 modifiable grid from the locally saved data
     */
    loadGrid1v1: function () {
      grid = JSON.parse(window.localStorage.getItem("grid1v1"+difficulty));
    },


    /**
     * This function loads the 1v1 initial grid from the locally saved data
     */
    loadInitGrid1v1: function () {
      initGrid= JSON.parse(window.localStorage.getItem("initGrid1v1"+difficulty));
    },


    /**
     * This function loads the 1v1 completed grid from the locally saved data
     */
    loadSolGrid1v1: function () {
      solGrid = JSON.parse(window.localStorage.getItem("solGrid1v1"+difficulty));
    },


    /**
     * This function loads the 1v1 match index from the locally saved data
     */
    loadMatchId1v1: function() {
      matchId = JSON.parse(window.localStorage.getItem("matchId1v1"+difficulty));
    },


    /**
     * This function queries the server to get the player's current timer for the current match
     */
    loadTimers1v1: function() {
      console.log('----loadTimerSec1v1---');
      var xhr = new XMLHttpRequest();
      xhr.open("GET", apiAddress+"/gettimer/" + matchId + "/" + playerId, false);
      xhr.send();
      console.log("json stuff: " + JSON.parse(xhr.responseText));
      var totalSecTime = JSON.parse(xhr.responseText);
      timerSec = totalSecTime%60;
      timerMin = (totalSecTime - timerSec) /60 ;
    },


    /**
     * This function loads the current minutes timer from the locally saved data
     */
    loadTimerMin: function () {
      timerMin = JSON.parse(window.localStorage.getItem("timerMin"+difficulty));
    },


    /**
     * This function loads the current seconds timer from the locally saved data
     */
    loadTimerSec: function () {
      timerSec = JSON.parse(window.localStorage.getItem("timerSec"+difficulty));
    },


    /**
     * This function clears the data saved locally depending upon the game mode
     */
    clearGame: function() {
      // game mode is solo
      if(gameMode == 0) {
        window.localStorage.removeItem("gridSolo"+difficulty);
        window.localStorage.removeItem("initGridSolo"+difficulty);
        window.localStorage.removeItem("solGridSolo"+difficulty);
        window.localStorage.removeItem("timerMin"+difficulty);
        window.localStorage.removeItem("timerSec"+difficulty);
      }
      // game mode is 1v1
      else if (gameMode == 1) {
        window.localStorage.removeItem("grid1v1"+difficulty);
        window.localStorage.removeItem("initGrid1v1"+difficulty);
        window.localStorage.removeItem("solGrid1v1"+difficulty);
        window.localStorage.removeItem("matchId1v1"+difficulty);
      }

    },

    //*************************************************************
    //**************** GAME SETTINGS RELATED FUNCTIONS*************
    //*************************************************************


    /**
     * This function loads the customable settings from the locally saved data
     */
    initializeSettings: function() {
      if (window.localStorage.getItem("enableErrorDetection") != undefined) {
        enableErrorDetection = JSON.parse(window.localStorage.getItem("enableErrorDetection"));
      }
      if (window.localStorage.getItem("enableNoteAutoErasing") != undefined) {
        enableNoteAutoErasing = JSON.parse(window.localStorage.getItem("enableNoteAutoErasing"));
      }
      if (window.localStorage.getItem("enableNumberHighlighting") != undefined) {
        enableNumberHighlighting = JSON.parse(window.localStorage.getItem("enableNumberHighlighting"));
      }
    },


    /**
     * This function returns if the error detection is enabled
     * @return {bool} enableErrorDetection
     */
    getEnableErrorDetection: function() {
      return enableErrorDetection;
    },


    /**
     * This function returns if the automatic erasing of notes is enabled
     * @return {bool} enableNoteAutoErasing
     */
    getEnableNoteAutoErasing: function() {
      return enableNoteAutoErasing;
    },


    /**
     * This function returns if the number highlighting is enabled
     * @return {bool} enableNumberHighlighting
     */
    getEnableNumberHighlighting: function() {
      return enableNumberHighlighting;
    },


    /**
     * This function toggles and saves locally the error detection setting
     */
    toggleEnableErrorDetection: function() {
      enableErrorDetection = !enableErrorDetection;
      window.localStorage.setItem("enableErrorDetection", JSON.stringify(enableErrorDetection));
      //console.log('errorDetection: '+enableErrorDetection);
    },


    /**
     * This function toggles and saves locally the automatic erasing of notes setting
     */
    toggleEnableNoteAutoErasing: function() {
      enableNoteAutoErasing = !enableNoteAutoErasing;
      window.localStorage.setItem("enableNoteAutoErasing", JSON.stringify(enableNoteAutoErasing));
      //console.log('noteautoerasing: '+enableNoteAutoErasing);
    },


    /**
     * This function toggles and saves locally the number highlighting setting
     */
    toggleEnableNumberHighlighting: function() {
      enableNumberHighlighting = !enableNumberHighlighting;
      window.localStorage.setItem("enableNumberHighlighting", JSON.stringify(enableNumberHighlighting));
      //console.log('numberhighlight: '+enableNumberHighlighting);
    },


    //*************************************************************
    //**************** TIMER RELATED FUNCTIONS ********************
    //*************************************************************


     /**
     * This function returns the minute part of the currently displayed timer
     * @return {int} timerMin
     */
    getTimerMin: function() {
      return timerMin;
    },


    /**
     * This function returns the second part of the currently displayed timer
     * @return {string} timerSec
     */
    getTimerSec: function() {
      return timerSec;
    },


    /**
     * This function is called every seconds and increments the timer by one second.
     * It then parses both stringed timer (min and sec) accordingly, for an esthetic display.
     * @return {string} timerMin
     */
    incrementTime: function() {
      // we parse the stringed timers into int timers, and we increment the second timer
      var intTimerSec = parseInt(timerSec)+1;
      var intTimerMin = parseInt(timerMin);
      // if the second timer reaches 60, we increment the minutes.
      if(intTimerSec == 60) {
        intTimerSec = 0;
        intTimerMin = intTimerMin +1;
      }
      /*if(intTimerMin == 100) {
        intTimerMin = 99;
        intTimerSec = 59;
      }*/
      // we parse back the int timer into a string timer
      timerSec = intTimerSec.toString();
      timerMin = intTimerMin.toString();
      // we add a '0' for a cleaner looking timer
      if (intTimerSec < 10) {
        timerSec = '0'+timerSec;
      }
      if (intTimerMin < 10) {
        timerMin = '0'+timerMin;
      }
    }


  };
})

/**
   * This service contains all the function used for displaying the stats (highscores, 
   * recent matches and recent online results).
   */
.factory('Stats', function() {
  /**
   * This int is a reprensation of the current game mode.
   * Its possible values are:
   *  0 for the solo mode, in which you play alone,
   *  1 for the 1v1 mode, in which you compete against an adversary, online,
   *  2 for the coop mode, in which you work with someone else to complete a grid, also online ( and which is yet to be implemented)
   *
   * @type: int
   */
  var gameMode;


  /**
   * This string holds the value of the current difficulty of the grid. It is mainly used
   * for grid generation.
   *
   * @type: string
   */
  var difficulty = 'easy';


  /**
   * This is an array containing the high scores in the easy diff. It is saved locally in the local
   * storage of the same name (highScoresEasy). Each elements have the same format: [secTime, savedDate, time, actualGameMode].
   *
   *
   * @type: array
   */
  var highScoresEasy;


  /**
   * This is an array containing the high scores in the medium diff. It is saved locally in the local
   * storage of the same name (highScoresMedium). Each elements have the same format: [secTime, savedDate, time, actualGameMode].
   *
   *
   * @type: array
   */
  var highScoresMedium;


  /**
   * This is an array containing the high scores in the hard diff. It is saved locally in the local
   * storage of the same name (highScoresHard). Each elements have the same format: [secTime, savedDate, time, actualGameMode].
   *
   * @type: array
   */
  var highScoresHard;


  /**
   * This is an array containing the high scores in the extreme diff. It is saved locally in the local
   * storage of the same name (highScoresExtreme). Each elements have the same format: [secTime, savedDate, time, actualGameMode].
   *
   * @type: array
   */
  var highScoresExtreme;


  /**
   * This is an array containing the recent completed matches, all difficulties together. It is saved locally in the local storage
   * of the same name, 'recentScores'. Each elements have the same format: [secTime, savedDate, time, actualGameMode].
   *
   * @type: array
   */
  var recentScores;


  /**
   * This is an array containing the completed online games, which can end by a defeat, a defeat by self forfeit, a victory,
   * a victiry by adversary forfeit or a tie. This array receives data from the server when the users goes to the stats tab.
   * Whenever a completed match is received from the server, it isnt ever sent again, so its important to save it right away!
   * It is displayed in the recent results tab of the stats tab.
   *
   * @type: array
   */    
  var completeResults;


  /**
   * This is an array containing the imcomplete online games. This array receives data from the server when the users goes to the stats tab.
   * Differently to the completeResults, the incompleteResults are sent everytime they are queried as long as they remain incomplete. 
   * An incomplete result is a game which isnt over yet (one or both of the results are missing).
   * It is displayed in the recent results tab of the stats tab.
   *
   * @type: array
   */
  var incompleteResults;


  /**
   * This int holds the value of the player's ID, which is used for online matches.
   *
   * @type: int
   */
  var playerId = 4444;


  /**
   * This string is the adress of the api querried in the online mode related functions.
   *
   * @type: string
   */
  var apiAddress = "http://rest-api-sudoku-app.local.humanequation.co/api";


  /**
   * This array contains all the month, its used to display the current date in the scores.
   *
   * @type: array 
   */
  var monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dev"
  ];

  return {
    
    //*************************************************************
    //************************ ACCESSORS **************************
    //*************************************************************

    setDifficulty: function(newDiff) {
      difficulty = newDiff;
    },


    getDifficulty: function() {
      return difficulty;
    },


    setGameMode: function (newGameMode) {
      gameMode = newGameMode;
    },


    getRecentScores: function() {
      return recentScores;
    },

    



    /**
     * This function is called when a game is finished by the player. 
     * The score is added to the high scores corresponding to the current difficulty and to
     * the recent scores. The high scores are also sorted by the completion time of the player, in seconds.
     * @param {string} timeMin
     * @param {string} timeSec
      */
    addScore: function(timeMin, timeSec) {
      // we ge tthe current date 
      var savedDate = this.getStringedDate();
      // we get the timer in seconds, it will be used to parsed the highscores 
      // from the fastest to the slowest completion time.
      var secTime = (parseInt(timeMin * 60) + parseInt(timeSec)).toString();
      // we parse the time that will be displayed.
      var time = timeMin + ':' + timeSec;
      // we get a string representing the current game mode.
      var actualGameMode = this.getStringedGameMode();
      if(difficulty == 'easy') {
        highScoresEasy.push([secTime, savedDate, time, actualGameMode]);
        highScoresEasy.sort(function(a,b){return a[0] -b[0]});
        if(highScoresEasy.length >15) {
          highScoresEasy.length -= 1;
        }
      }
      else if(difficulty == 'medium')
      {
        highScoresMedium.push([secTime, savedDate, time, actualGameMode]);
        highScoresMedium.sort(function(a,b){return a[0] -b[0]});
        if(highScoresEasy.length >15) {
          highScoresEasy.length -= 1;
        }
      }
      else if(difficulty == 'hard')
      {
        highScoresHard.push([secTime, savedDate, time, actualGameMode]);
        highScoresHard.sort(function(a,b){return a[0] -b[0]});
        if(highScoresEasy.length >15) {
          highScoresEasy.length -= 1;
        }
      }
      else if(difficulty == 'extreme')
      {
        highScoresExtreme.push([secTime, savedDate, time, actualGameMode]);
        highScoresExtreme.sort(function(a,b){return a[0] -b[0]});
        if(highScoresEasy.length >15) {
          highScoresEasy.length -= 1;
        }
      }
      // we add the recent score at the beginning of the recent scores array.
      recentScores.unshift([savedDate, time, difficulty, actualGameMode]);
      if(recentScores.length >15) {
        recentScores.length -= 1;
      }
      //console.log("recentScores: " + recentScores);
    },


    /**
     * This function saves localy all the highScores and the recentScores.
     */
    saveHighScores: function() {
      window.localStorage.setItem("highScoresEasy", JSON.stringify(highScoresEasy));
      window.localStorage.setItem("highScoresMedium", JSON.stringify(highScoresMedium));
      window.localStorage.setItem("highScoresHard", JSON.stringify(highScoresHard));
      window.localStorage.setItem("highScoresExtreme", JSON.stringify(highScoresExtreme));
      this.saveRecentScores();
    },


    /**
     * This function load from the local data storage the highscores if they are'nt undefined.
     * if however they are, they are initialized into an empty array.
     */
    loadHighScores: function() {
      if(window.localStorage.getItem("highScoresEasy")!=undefined)
        highScoresEasy = JSON.parse(window.localStorage.getItem("highScoresEasy"));
      else
        highScoresEasy = [];
      if(window.localStorage.getItem("highScoresMedium")!=undefined)
        highScoresMedium = JSON.parse(window.localStorage.getItem("highScoresMedium"));
      else
        highScoresMedium = [];
      if(window.localStorage.getItem("highScoresHard")!=undefined)
        highScoresHard = JSON.parse(window.localStorage.getItem("highScoresHard"));
      else
        highScoresHard = [];
      if(window.localStorage.getItem("highScoresExtreme")!=undefined)
        highScoresExtreme = JSON.parse(window.localStorage.getItem("highScoresExtreme"));
      else
        highScoresExtreme = [];
    },


    /**
     * This function loads the locally stored highScores, then assign their value to the 
     * highScores used in the $scope, to update the view.
     * @param {scope} $scope
     */
    updateScore: function ($scope) {
      //console.log('---stats: update scores---');
      this.loadHighScores();
      $scope.easyHighScores = highScoresEasy;
      $scope.mediumHighScores = highScoresMedium;
      $scope.hardHighScores = highScoresHard;
      $scope.extremeHighScores = highScoresExtreme;
    },


    /**
     * This function clears the local data storage allocated to the highScores.
     */
    clearHighScores: function () {
      console.log("---clearHighscores---");
      window.localStorage.removeItem("highScoresEasy");
      window.localStorage.removeItem("highScoresMedium");
      window.localStorage.removeItem("highScoresHard");
      window.localStorage.removeItem("highScoresExtreme");
    },


    /**
     * This function saves the recent scores.
     */
    saveRecentScores: function() {
      window.localStorage.setItem("recentScores", JSON.stringify(recentScores));
    },


    /**
     * This function loads the recent scores
     */
    loadRecentScores: function() {
      if(window.localStorage.getItem("recentScores")!=undefined)
        recentScores = JSON.parse(window.localStorage.getItem("recentScores"));
      else
        recentScores = [];
    },


    /**
     * This function loads the locally stored recent scores, then assign their value to the 
     * recent scores used in the $scope, to update the view.
     * @param {scope} $scope
     */
    updateRecentScores: function ($scope) {
      console.log('---stats: update scores---');
      this.loadRecentScores();
      $scope.recentScores = recentScores;
    },

    
    /**
     * This function clears the local data storage allocated to the recent scores.
     */
    clearRecentScores: function() {
      console.log('---stats: clearRecentScores---');
      window.localStorage.removeItem("recentScores");
    },

    /**
     * This function saves locally the complete online results. Incomplete online results
     * are'nt saved because they are queried each times the user wants to visualise them (there
     * is no need to save them since they would be overwritten anyway).
     */
    saveOnlineResults: function() {
      window.localStorage.setItem("completeResults", JSON.stringify(completeResults));
    },

    /**
     * This function queries the server and receives the online results of a player. It receives the
     * results for completed games only once per game, and the results for incompleted games each time.
     * In incompleted games, only the difficulty and the player's time are saved. In the completed games,
     * the player's time, the adversary's time and the difficulty are saved, alwell as a message explaining 
     * the final state of the game (win, defeat, forfeit, tie). Completed games are then saved locally.
     */
    loadOnlineResults: function() {
      // we load the completed games in the local memory and we clear the incompleted ones,
      // since the api sends back completed grids only once, while it sends back incompleted grids
      // every time results are queried
      if(window.localStorage.getItem("completeResults")!=undefined)
        completeResults = JSON.parse(window.localStorage.getItem("completeResults"));
      else
        completeResults = [];
      incompleteResults = [];

      // we then check online if there is new recent result(s) 
      var xhr = new XMLHttpRequest();
      xhr.open("GET", apiAddress+"/getrecentresults/" + playerId, false);
      xhr.send();
     // console.log("json stuff: " + JSON.parse(xhr.responseText));
      var recentResults = JSON.parse(xhr.responseText);
      var dataArray;
      // pos 0 is game id, 1 is winnerId, 2 is player's time, 3 is adversary time, 4 is diff
      for(var i = 0; i<recentResults.length; i++) {
        var winnerId = recentResults[i][1];

        dataArray = [];
        if(winnerId == null) // if there is no winner yet
        {
          dataArray.push(recentResults[i][4]);
          dataArray.push(recentResults[i][2]);        
          incompleteResults.unshift(dataArray);
        }
        else {
          if (winnerId == 0) {
            dataArray.push('It s a tie');              
          }
          else if (winnerId == playerId) {
            if(recentResults[i][3] == 0) {// check if adversary forfeited
              dataArray.push('You won, your adversary forfeited.');
            }
            else {
              dataArray.push('You won!');
            }              
          }
          else {
            if(recentResults[i][2] == 0) { // check if user forfeited
              dataArray.push('You lost, you forfeited.');
            }
            else {
              dataArray.push('You lost!');
            }              
          }
          dataArray.push(recentResults[i][2]);
          dataArray.push(recentResults[i][3]);
          dataArray.push(recentResults[i][4]);
          completeResults.push(dataArray);
        }          
      }
      this.saveOnlineResults();
    },

    /**
     * This function loads the locally stored comlete online results, then assign their value to the 
     * recent scores used in the $scope, to update the view.
     * @param {scope} $scope
     */
    updateOnlineResults: function ($scope) {
      //console.log('---stats: update scores---');
      this.loadOnlineResults();
      $scope.completeResults = completeResults;
      $scope.incompleteResults = incompleteResults;
    },

    /**
     * This function clears the local data storage allocated to the complete online results.
     */
    clearOnlineResults: function() {
      //console.log('---stats: clearonlineResults---');
      window.localStorage.removeItem("completeResults");
    },

    /**
     * This function returns the current date, a bit parsed.
     */
    getStringedDate: function () {
      var date = new Date();
      var day = date.getDate().toString();
      if(day.length == 1) {
        day = '0'+ day;
      }
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      var stringedDate = day + ' ' + monthNames[monthIndex] + ' ' + year;
      return stringedDate;
    },

     /**
     * This function returns a string representation of the current game mode.
     */
    getStringedGameMode: function() {
      var actualGameMode = '';
      console.log('gameMode: ' + gameMode);
      if(gameMode == 0) {
        actualGameMode = 'Solo';
      }
      else if (gameMode == 1){
        actualGameMode = 'Faceoff';
      }
      return actualGameMode;
      console.log('actualGameMode: ' + actualGameMode);
    }
  };
});
