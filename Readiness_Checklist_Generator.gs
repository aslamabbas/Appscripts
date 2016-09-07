function onSubmit(e) {
  onFormSubmit(e);
}
  
function onFormSubmit(e) {
  
  var dateTimeSubmitted = e.values[0];
  var productName = e.values[1];
  var productVersion = e.values[2];
  var productGaDate = e.values[3];
  var usernameSubmitted = e.values[4];
  
  var gaDateAvailable = false;
  
  
  // 1. get a handle on the template sheet
  var readinessFolder = DriveApp.getFolderById("0B-wBW0Im3w_zbVFtakxidk9wM28"); // Readiness folder Id

  // old template file below
  // var templateFile = DriveApp.getFileById("1kMdaWCYhucaUKWkwSHc65fF4QqsnM8JIaTaFyaXBU5I");
  var templateFile = DriveApp.getFileById("12tk2Mm1RCnKq-U0bKgpmt0aZ9Yk4trwAnSSiRF-fnyU");
  
  // 2. make a copy of it and store in the Readiness folder
  var newReadinessSheetName = productName + " " + productVersion + " - Readiness Status and Info";
  var newReadinessSheetHandle = DriveApp.getFileById(templateFile.getId()).makeCopy(newReadinessSheetName, readinessFolder);

  // 3. update the dates
  newReadinessSheet = SpreadsheetApp.open(newReadinessSheetHandle);

  if (productGaDate != '') {
    newReadinessSheet.getRange('C3').setValue(stringToDate(productGaDate));
    gaDateAvailable = true;
  }
    
  // 4. update the PP link
  var productPageLink = getProductPageLink(productName);
  if (productPageLink != '') {
    newReadinessSheet.getRange('C2').setValue(productPageLink);
  }
  
  // 5. update the BU contact names
  var buContact = getBuContactNames(productName);
  if (buContact != '') {
    newReadinessSheet.getRange('E9').setValue(buContact);
    newReadinessSheet.getRange('E10').setValue(buContact);
    newReadinessSheet.getRange('E11').setValue(buContact);
    newReadinessSheet.getRange('E12').setValue(buContact);
    newReadinessSheet.getRange('E13').setValue(buContact);
    newReadinessSheet.getRange('E14').setValue(buContact);
    newReadinessSheet.getRange('E15').setValue(buContact);
    newReadinessSheet.getRange('E16').setValue(buContact);
    
    newReadinessSheet.getRange('E26').setValue(buContact);
    newReadinessSheet.getRange('E27').setValue(buContact);
    newReadinessSheet.getRange('E28').setValue(buContact);
    newReadinessSheet.getRange('E29').setValue(buContact);
    newReadinessSheet.getRange('E30').setValue(buContact);
    newReadinessSheet.getRange('E31').setValue(buContact);
    newReadinessSheet.getRange('E32').setValue(buContact);
    newReadinessSheet.getRange('E33').setValue(buContact);
    newReadinessSheet.getRange('E34').setValue(buContact);
    
    newReadinessSheet.getRange('E41').setValue(buContact);
  }

  // 6. set a note for changelog
  //usernameSubmitted = usernameSubmitted.split('@')[0];
  //var changelogMessage = (gaDateAvailable) ? usernameSubmitted + ' - generated document and set dates' : usernameSubmitted + ' - generated document without dates';
  
  //newReadinessSheet.getRange('A15').setValue(timestampStringToDate(dateTimeSubmitted));
  //newReadinessSheet.getRange('B15').setValue(changelogMessage);
}

/**************************************************************************
 *
 * Retrieves a product link for the Product Portal page based on a lookup
 *
***************************************************************************/
function getProductPageLink(productName) {
  
  var lookupFile = DriveApp.getFileById("1HuvyzrEv9HChzstVeAwHtAFlHvT3EW5o2O8BH0O4XyI");
  var lookupSheet = SpreadsheetApp.open(lookupFile);

  var column = lookupSheet.getRange("A:A");
  var values = column.getValues();
  var row = 0;
  
  while ( values[row] && values[row][0] !== productName ) {
    row++;
  }
  
  if (values[row][0] === productName) {
    var productRow = row+1;
    var productAcronym = lookupSheet.getRange("B"+productRow).getValue();
    return "https://pp.engineering.redhat.com/pp/product/" + productAcronym;
  }

  return '';
}

/********************************************************************************
 *
 * Retrieves the BU contact details for a particular product based on a lookup
 *
*********************************************************************************/
function getBuContactNames(productName) {
  
  var lookupFile = DriveApp.getFileById("1HuvyzrEv9HChzstVeAwHtAFlHvT3EW5o2O8BH0O4XyI");
  var lookupSheet = SpreadsheetApp.open(lookupFile);

  var column = lookupSheet.getRange("A:A");
  var values = column.getValues();
  var row = 0;
  
  while ( values[row] && values[row][0] !== productName ) {
    row++;
  }
  
  if (values[row][0] === productName) {
    var productRow = row+1;
    return lookupSheet.getRange("C"+productRow).getValue();
  }

  return '';
}

/***********************************************************
 *
 * Converts a given string to a date object.
 * Assumes dd/mm/yyyy format
 *
***********************************************************/
function stringToDate(dateString) {
  var dateArray = dateString.split("/");
  var year = dateArray[2];
  var month = dateArray[1];
  var day = dateArray[0];
  var date = new Date(year, month - 1, day);

  return date;
}


/***********************************************************
 *
 * Converts a given timestamp string to a date object
 *
***********************************************************/
function timestampStringToDate(dateTimeString) {
  return stringToDate(dateTimeString.split(' ')[0]);
}  
