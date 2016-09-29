function onSubmit(e) {
  onFormSubmit(e);
}
  
function onFormSubmit(e) {
  
  var dateTimeSubmitted = e.values[0];
  var productName = e.values[1];
  var productVersion = e.values[2];
  var productGaDate = e.values[3];
  var productBetaDate = e.values[4];
  var usernameSubmitted = e.values[5];
  
  
  // 1. get a handle on the template sheet
  var readinessFolder = DriveApp.getFolderById("0B-wBW0Im3w_zbVFtakxidk9wM28"); // Readiness folder Id

  // old template file below
  // var templateFile = DriveApp.getFileById("1kMdaWCYhucaUKWkwSHc65fF4QqsnM8JIaTaFyaXBU5I");
  var templateFile = DriveApp.getFileById("12tk2Mm1RCnKq-U0bKgpmt0aZ9Yk4trwAnSSiRF-fnyU");
  
  // 2. make a copy of it and store in the Readiness folder
  var newReadinessSheetName = productName + " " + productVersion + " - Readiness Status and Info";
  var newReadinessSheetHandle = DriveApp.getFileById(templateFile.getId()).makeCopy(newReadinessSheetName, readinessFolder);
  newReadinessSheetHandle.setOwner(usernameSubmitted);

  // 3. update the dates
  var newReadinessSheet = SpreadsheetApp.open(newReadinessSheetHandle);
  
  // 4. Open INTERNAL: PnT Lookups file
  var lookupFile = DriveApp.getFileById("1HuvyzrEv9HChzstVeAwHtAFlHvT3EW5o2O8BH0O4XyI");
  var lookupSheet = SpreadsheetApp.open(lookupFile);  
  
  // 5. Add Common Editors for the Readiness sheet
  var commonUsers = "lspangle@redhat.com, mrandall@redhat.com, mikmorri@redhat.com";                    
//  addBuContactsAsEditors(newReadinessSheet, commonUsers);

  if (productGaDate != '') {
    newReadinessSheet.getRange('C3').setValue(productGaDate);
  }
  
  if (productBetaDate != '') {
    newReadinessSheet.getRange('C4').setValue(productBetaDate);
  }
    
  // 6. update the PP link
  var productPageLink = getProductPageLink(productName, lookupSheet);
  if (productPageLink != '') {
    newReadinessSheet.getRange('C2').setValue(productPageLink);
  }
  
  // 7. update the BU contact names and editors
  var buContact = getBuContacts(productName, 'Sales', lookupSheet);
  if (buContact != '') {
    newReadinessSheet.getRange('E10').setValue(buContact.name);
    newReadinessSheet.getRange('E11').setValue(buContact.name);
    newReadinessSheet.getRange('E12').setValue(buContact.name);
    newReadinessSheet.getRange('E13').setValue(buContact.name);
    newReadinessSheet.getRange('E14').setValue(buContact.name);
    newReadinessSheet.getRange('E15').setValue(buContact.name);
    newReadinessSheet.getRange('E16').setValue(buContact.name);
    newReadinessSheet.getRange('E17').setValue(buContact.name);
    addBuContactsAsEditors(newReadinessSheet, buContact.email);
  }
  
  var buContact = getBuContacts(productName, 'SA', lookupSheet);
  if (buContact != '') {    
    newReadinessSheet.getRange('E27').setValue(buContact.name);
    newReadinessSheet.getRange('E28').setValue(buContact.name);
    newReadinessSheet.getRange('E29').setValue(buContact.name);
    newReadinessSheet.getRange('E30').setValue(buContact.name);
    newReadinessSheet.getRange('E31').setValue(buContact.name);
    newReadinessSheet.getRange('E32').setValue(buContact.name);
    newReadinessSheet.getRange('E33').setValue(buContact.name);
    newReadinessSheet.getRange('E34').setValue(buContact.name);
    newReadinessSheet.getRange('E35').setValue(buContact.name);
    addBuContactsAsEditors(newReadinessSheet, buContact.email);
  }

  buContact = getBuContacts(productName, 'Consulting', lookupSheet);
  if (buContact != '') {    
    newReadinessSheet.getRange('E42').setValue(buContact.name);
    addBuContactsAsEditors(newReadinessSheet, buContact.email);
  }

  // 8. set a note for changelog
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
function getProductPageLink(productName,lookupSheet) {
  
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
function getBuContacts(productName, role, lookupSheet) {
  
  var buContact = {};
  var productRow;
  var lookupSheet_role = lookupSheet.getSheetByName(role);
  lookupSheet_role.activate();  
  var column = lookupSheet_role.getRange("A:A");
  var values = column.getValues();
  var row = 0;
  
  while ( values[row] && values[row][0] !== productName ) {
    row++;
  }
  
  if (values[row][0] === productName) {
    productRow = row+1;
    buContact.name = lookupSheet.getRange("C"+productRow).getValue();
    buContact.email = lookupSheet.getRange("D"+productRow).getValue();
    return buContact;
  }

  return '';
}

/***********************************************************
 *
 * Converts a given timestamp string to a date object
 *
***********************************************************/
function timestampStringToDate(dateTimeString) {
  return stringToDate(dateTimeString.split(' ')[0]);
}  

/***********************************************************
 *
 * Adds editors to the file handle
 *
***********************************************************/
function addBuContactsAsEditors(fileHandle, emails) {
  
  var emailStrs = emails.split(',');
  Logger.log("The following emails are going to be added as Editors");
  Logger.log(emailStrs);
  for (i = 0; i < emailStrs.length; i++){
     fileHandle.addEditor(emailStrs[i]);
  }
  
  return;
}
