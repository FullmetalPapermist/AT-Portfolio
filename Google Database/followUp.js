const generateFollowUp = (campus) => {
  const ss = SpreadsheetApp.getActive();
  const sourceSheet = fetchDatabaseSheet(campus);

  fullView(campus);
  applyFollowUpFilter(sourceSheet);

  const output = extractFilteredData(sourceSheet);

  const newSheet = createFollowUpSheet(ss, campus);

  if (output.length) {
    newSheet
      .getRange(2, 1, output.length, output[0].length)
      .setValues(output);
  }
  addAssignedLeaderDropdown(ss, newSheet, campus, output.length);
  applyConditionalFormatting(newSheet, output.length);
  newSheet.autoResizeColumns(1, FOLLOW_UP.HEADERS.length);

  fullView(campus);
};

// -----------------------------
// Campus-aware sheet creation
// -----------------------------
const createFollowUpSheet = (ss, campus) => {
  const followUpBaseName = SHEETS[campus]?.FOLLOW_UP;

  if (!followUpBaseName) {
    throw new Error(`Follow-up not supported for campus: ${campus}`);
  }

  const timestamp = Utilities.formatDate(
    new Date(),
    ss.getSpreadsheetTimeZone(),
    'yyyy-MM-dd HH:mm:ss'
  );

  const sheetName = `${followUpBaseName} ${timestamp}`;
  const sheet = ss.insertSheet(sheetName);

  sheet
    .getRange(1, 1, 1, FOLLOW_UP.HEADERS.length)
    .setValues([FOLLOW_UP.HEADERS]);

  return sheet;
};

// -----------------------------
// Follow-up filter (campus-aware source sheet already passed)
// -----------------------------
const applyFollowUpFilter = (sheet) => {
  const range = sheet.getRange(
    1,
    1,
    sheet.getLastRow(),
    sheet.getLastColumn()
  );

  const filter = range.getFilter() || range.createFilter();

  const criteria = SpreadsheetApp
    .newFilterCriteria()
    .whenTextContains(FOLLOW_UP.FILTER_VALUE)
    .build();

  filter.setColumnFilterCriteria(DB_COLUMNS.CONSEC_MISSED, criteria);
};

// -----------------------------
// Data extraction remains the same
// -----------------------------
const extractFilteredData = (sheet) => {
  const colsToCopy = [
    DB_COLUMNS.FIRST_NAME,
    DB_COLUMNS.LAST_NAME,
    DB_COLUMNS.PHONE,
    DB_COLUMNS.SCHOOL,
    DB_COLUMNS.CHURCH,
    DB_COLUMNS.FAITH,
    DB_COLUMNS.LEADERS_CHATTED
  ];

  const data = sheet.getDataRange().getValues();
  const output = [];

  for (let r = 1; r < data.length; r++) {
    // Stop when First + Last name are empty
    if (!data[r][DB_COLUMNS.FIRST_NAME - 1] &&
        !data[r][DB_COLUMNS.LAST_NAME - 1]) {
      break;
    }

    if (sheet.isRowHiddenByFilter(r + 1)) continue;

    output.push(
      colsToCopy.map(c => data[r][c - 1])
    );
  }

  return output;
};

// -----------------------------
// Data validation
// -----------------------------
const addAssignedLeaderDropdown = (ss, sheet, campus, numRows) => {
  if (!numRows) return;

  const leadersSheetName = SHEETS[campus]?.LEADERS;
  if (!leadersSheetName) {
    throw new Error(`No leaders sheet configured for campus: ${campus}`);
  }

  const leadersSheet = ss.getSheetByName(leadersSheetName);
  if (!leadersSheet) {
    throw new Error(`Leaders sheet not found: ${leadersSheetName}`);
  }

  const leaderRange = leadersSheet.getRange('A2:A');
  const rule = SpreadsheetApp
    .newDataValidation()
    .requireValueInRange(leaderRange, true)
    .setAllowInvalid(false)
    .build();

  sheet
    .getRange(2, 8, numRows, 1) // column H = Assigned Leader
    .setDataValidation(rule);
};


// -----------------------------
// Conditional formatting remains the same
// -----------------------------
const applyConditionalFormatting = (sheet, numRows) => {
  if (!numRows) return;

  const range = sheet.getRange(2, 1, numRows, FOLLOW_UP.HEADERS.length);

  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$J2<>""')
      .setBackground(COLORS.SUCCESS)
      .setRanges([range])
      .build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($I2<>"",$J2="")')
      .setBackground(COLORS.WARNING)
      .setRanges([range])
      .build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($I2="",$J2="")')
      .setBackground(COLORS.ERROR)
      .setRanges([range])
      .build()
  ];

  sheet.setConditionalFormatRules(rules);
};
