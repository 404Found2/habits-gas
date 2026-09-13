var habit_sheet_id = "Replace with your own sheet id";

var habit_tasks_tab = "Habits";
var habit_history_tab = "Log";
var habit_store_tab = "Store";
var habit_streak_tab = "Streak";

var is_spreadsheet_being_updated = false;

function spreadsheetData() {
  // Process Data
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit'
  });

  const ss = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_tasks_tab);

  // RED
  var raw_red_data = ss.getRange("A1:C").getValues();
  raw_red_data.shift();
  var red_data = raw_red_data.filter(subArray => JSON.stringify(subArray) != JSON.stringify(['','','']));
  for(var i = 0; i < red_data.length; i++) {
    red_data[i][2] = ( new Date(red_data[i][2]).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) == formattedDate);
  }
  // BLUE
  var raw_blue_data = ss.getRange("E1:G").getValues();
  raw_blue_data.shift();
  var blue_data = raw_blue_data.filter(subArray => JSON.stringify(subArray) != JSON.stringify(['','','']));
  for(var i = 0; i < blue_data.length; i++) {
    blue_data[i][2] = ( new Date(blue_data[i][2]).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) == formattedDate);
  }
  console.log(blue_data);
  // GREEN
  var raw_green_data = ss.getRange("I1:K").getValues();
   raw_green_data.shift();
  var green_data = raw_green_data.filter(subArray => JSON.stringify(subArray) != JSON.stringify(['','','']));
  for(var i = 0; i <green_data.length; i++) {
    green_data[i][2] = ( new Date(green_data[i][2]).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) == formattedDate);
  }
  console.log(green_data);
  //Total Points
  var pts = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_store_tab).getRange("E1").getValue();

  // Store Data
  var raw_store_data = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_store_tab).getRange("A1:B").getValues();
   raw_store_data.shift();
  var store_data = raw_store_data.filter(subArray =>  (subArray[2] != '' || subArray[2] != 0));
  console.log(store_data);

  return [red_data, blue_data, green_data, pts, store_data];
}

function doGet() {
 // Web Layout
 var htmlOutput = HtmlService.createTemplateFromFile('index');

 var data = spreadsheetData();

  // Grab Habits
  htmlOutput.red = data[0];
  htmlOutput.blue = data[1];
  htmlOutput.green = data[2];
  htmlOutput.storeD = data[4];

  //Grab Current Points
  htmlOutput.points = data[3];
  htmlOutput.streak = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_streak_tab).getRange("B1:C3").getValues();
  
  return htmlOutput.evaluate()
      .setTitle("My Habit Tracker")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function postTask(add, cat, name, tpoints) {
  is_spreadsheet_being_updated = true;
  //Search category and get cell row
  const ss = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_tasks_tab);
  var raw_data;
  var finalCol = "";

  if(cat == "cat1") {
    raw_data = ss.getRange("A1:C").getValues();
    finalCol = "C";
  } else if(cat == "cat2") {
    raw_data = ss.getRange("E1:G").getValues();
    finalCol = "G";
  } else {
    raw_data = ss.getRange("I1:K").getValues();
    finalCol = "K";
  }

  var row = raw_data.findIndex((arr) => (arr[0].trim() == name.trim()));
  Logger.log(row);

  var points_cell = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_store_tab).getRange("E1");
  var points = points_cell.getValue();
  Logger.log(points);

  Logger.log(raw_data);

  var today = new Date();

  // if col 3 of that row is empty or not today, update date
  if(!add && new Date(raw_data[row][2]).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
      }) == today.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
      }) 
  ) {
    // else remove val from that 3rd col. in row
    points -= raw_data[row][1];
    // update sheet points
    if(tpoints == points) {
      SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_tasks_tab).getRange(finalCol + "" + (row + 1)).setValue("");
      points_cell.setValue(points);

      //Update History Tab
      sheet = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_history_tab);
      sheet.insertRowBefore(2);
      sheet.getRange("A2").setValue(today.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'}) + " - Task removed (-" + raw_data[row][1] + " pts): " + name );

      is_spreadsheet_being_updated = false;
      return spreadsheetData();
    }
  } else if(add) {
    // update sheet points
    points += raw_data[row][1];
    if(tpoints == points) {
      SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_tasks_tab).getRange(finalCol + "" + (row + 1)).setValue(today);
      points_cell.setValue(points);
      //Update History Tab
      sheet = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_history_tab);
      sheet.insertRowBefore(2);
      sheet.getRange("A2").setValue(today.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'}) + " - Task added (+" + raw_data[row][1] + " pts): " + name );
      is_spreadsheet_being_updated = false;
      return spreadsheetData();
    }
  }
  
  is_spreadsheet_being_updated = false;
  return "error";
}


function postReward(name) {
  is_spreadsheet_being_updated = true;
  //Total Points
  var pts = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_store_tab).getRange("E1").getValue();

  // Store Data
  var raw_store_data = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_store_tab).getRange("A1:B").getValues();
   raw_store_data.shift();
  var store_data = raw_store_data.filter(subArray =>  (subArray[1] != '' || subArray[1] != 0));

  var indx = store_data.findIndex((arr) => (arr[0].trim() == name.trim()));
  var cost = store_data[indx][1];

  var cur_total = pts - cost;
  if(cur_total < 0) {
    return "error";
  }

  SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_store_tab).getRange("E1").setValue( cur_total );

  //Update History Tab
  sheet = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_history_tab);
  sheet.insertRowBefore(2);
  sheet.getRange("A2").setValue("Reward Bought for " + cost + " pts: " + name );

  is_spreadsheet_being_updated = false;
  return (cur_total);
}

function updateStreaks() {

  var red_completed = [true, 0];
  var blue_completed = [true, 0];
  var green_completed = [true, 0];


  var get_cur_usr_data = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_streak_tab).getRange("A1:C3").getValues();
  Logger.log(get_cur_usr_data);

  const ss = SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_tasks_tab);
  
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit'
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayFormatted = yesterday.toLocaleDateString('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit'
  });

  // RED
  var raw_red_data = ss.getRange("A1:C").getValues();
  raw_red_data.shift();
  var red_data = raw_red_data.filter(subArray => JSON.stringify(subArray) != JSON.stringify(['','','']));

  for(var i = 0; i < red_data.length; i++) {
    if( new Date(red_data[i][2]).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != formattedDate) {
      red_completed[0] = false;
    }
  }

  if(red_completed[0] == true) {
    if(get_cur_usr_data[0][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) == yesterdayFormatted) {
      get_cur_usr_data[0][1] += 1;
      get_cur_usr_data[0][2] = date;
    } else if(get_cur_usr_data[0][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != formattedDate) {
      get_cur_usr_data[0][1] = 1;
      get_cur_usr_data[0][2] = date;
    }
  } else {
    if(get_cur_usr_data[0][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != formattedDate 
      && get_cur_usr_data[0][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != yesterdayFormatted) {
        get_cur_usr_data[0][1] = 0;
    } 

  }

  // BLUE
  var raw_blue_data = ss.getRange("E1:G").getValues();
  raw_blue_data.shift();
  var blue_data = raw_blue_data.filter(subArray => JSON.stringify(subArray) != JSON.stringify(['','','']));
  for(var i = 0; i < blue_data.length; i++) {
    if(new Date(blue_data[i][2]).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != formattedDate) {
      blue_completed[0] = false;
    }
  } 

  if(blue_completed[0] == true) {
    if(get_cur_usr_data[1][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) == yesterdayFormatted) {
      get_cur_usr_data[1][1] += 1;
      get_cur_usr_data[1][2] = date;
    } else if(get_cur_usr_data[1][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != formattedDate) {
      get_cur_usr_data[1][1] = 1;
      get_cur_usr_data[1][2] = date;
    }
  } else {
    if(get_cur_usr_data[1][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != formattedDate 
      && get_cur_usr_data[1][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != yesterdayFormatted) {
        get_cur_usr_data[1][1] = 0;
    } 

  }
  

  // GREEN
  var raw_green_data = ss.getRange("I1:K").getValues();
   raw_green_data.shift();
  var green_data = raw_green_data.filter(subArray => JSON.stringify(subArray) != JSON.stringify(['','','']));
  for(var i = 0; i <green_data.length; i++) {
    if(new Date(green_data[i][2]).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != formattedDate) {
      green_completed[0] = false;
    }
  } 

  if(green_completed[0] == true) {
    if(get_cur_usr_data[2][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) == yesterdayFormatted) {
      get_cur_usr_data[2][1] = get_cur_usr_data[2][1] + 1;
      get_cur_usr_data[2][2] = date;
    } else if(get_cur_usr_data[2][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != formattedDate) {
      get_cur_usr_data[2][1] = 1;
      get_cur_usr_data[2][2] = date;
    }
  } else {
    if(get_cur_usr_data[2][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != formattedDate 
      && get_cur_usr_data[2][2].toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit'}) != yesterdayFormatted) {
        get_cur_usr_data[2][1] = 0;
    } 

  }

  red_completed[1] = get_cur_usr_data[0][1];
  blue_completed[1] = get_cur_usr_data[1][1];
  green_completed[1] = get_cur_usr_data[2][1];

  Logger.log(get_cur_usr_data);

  SpreadsheetApp.openById(habit_sheet_id).getSheetByName(habit_streak_tab).getRange("A1:C3").setValues(get_cur_usr_data);
  return [red_completed, blue_completed, green_completed];
}




