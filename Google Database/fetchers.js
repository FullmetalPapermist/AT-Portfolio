const fetchDatabaseSheet = (campus) => {
  const sheetName = SHEETS[campus]?.DATABASE;
  if (!sheetName) {
    throw new Error(`No DATABASE sheet configured for campus: ${campus}`);
  }

  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Database sheet not found: ${sheetName}`);
  }

  return sheet;
};

const fetchFollowUpSheet = (campus) => {
  const sheetName = SHEETS[campus]?.FOLLOW_UP;
  if (!sheetName) {
    throw new Error(`No FOLLOW_UP sheet configured for campus: ${campus}`);
  }

  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Follow-up sheet not found: ${sheetName}`);
  }

  return sheet;
};
