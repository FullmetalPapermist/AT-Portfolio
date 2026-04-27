const transferCampusToCombined = (campus) => {
  const ss = SpreadsheetApp.getActive();
  const sourceSheetName = SHEETS[campus]?.DATABASE || SHEETS[campus]?.GRAD_SIGN_UP;

  if (!sourceSheetName) {
    throw new Error(`No source sheet configured for campus: ${campus}`);
  }

  const sourceSheet = ss.getSheetByName(sourceSheetName);
  if (!sourceSheet) {
    throw new Error(`Source sheet not found: ${sourceSheetName}`);
  }

  const targetSheet = ss.getSheetByName(SHEETS[CAMPUSES.COMBINED].DATABASE);
  if (!targetSheet) {
    throw new Error('Combined database sheet not found');
  }

  const lastRow = sourceSheet.getLastRow();
  if (lastRow <= COMBINED_TRANSFER.HEADER_ROWS) return; // nothing to copy

  // Extract only the configured columns
  const data = sourceSheet
    .getDataRange()
    .getValues()
    .slice(COMBINED_TRANSFER.HEADER_ROWS)
    .map(row => COMBINED_TRANSFER.COLUMNS.map(col => row[col - 1]))
    .filter(row => row.some(cell => cell !== ''));

  if (!data.length) return;

  // Find first empty row in combined DB
  let writeRow = targetSheet.getLastRow() + 1;

  targetSheet
    .getRange(writeRow, 1, data.length, data[0].length)
    .setValues(data);

  targetSheet.autoResizeColumns(1, COMBINED_TRANSFER.COLUMNS.length);
};

const transferMainCampusesToCombined = () => {
  [CAMPUSES.NORTH, CAMPUSES.SOUTH, CAMPUSES.WEST].forEach(transferCampusToCombined);
};

const transferCombinedGradSignUpToCombined = () => {
  transferCampusToCombined(CAMPUSES.COMBINED);
};
