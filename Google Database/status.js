// -----------------------------
// Apply validation + dropdown for all campus status cells
// -----------------------------
const applyStatusValidation = () => {
  const menuSheet = SpreadsheetApp.getActive().getSheetByName(MENU.SHEET);

  Object.values(MENU.ROWS).forEach(row => {
    const statusCell = menuSheet.getRange(row, 3); // column C = STATUS_COL

    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(Object.values(STATUS.VALUES), false)
      .setAllowInvalid(false)
      .build();

    statusCell.setDataValidation(rule);
  });
};

// -----------------------------
// Apply conditional formatting for all campus status cells
// -----------------------------
const applyStatusConditionalFormatting = () => {
  const menuSheet = SpreadsheetApp.getActive().getSheetByName(MENU.SHEET);

  Object.values(MENU.ROWS).forEach(row => {
    const statusCell = menuSheet.getRange(row, 3); // column C = STATUS_COL

    const rules = [
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(STATUS.VALUES.DONE)
        .setBackground(COLORS.SUCCESS)
        .setRanges([statusCell])
        .build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(STATUS.VALUES.LOADING)
        .setBackground(COLORS.WARNING)
        .setRanges([statusCell])
        .build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(STATUS.VALUES.ERROR)
        .setBackground(COLORS.ERROR)
        .setRanges([statusCell])
        .build()
    ];

    statusCell.getSheet().setConditionalFormatRules(rules);
  });

  Logger.log('Conditional formatting applied for all campuses.');
};

// -----------------------------
// Run with status for a single row only
// -----------------------------
const runWithStatus_ = (actionFn, campus, row) => {
  const menuSheet = SpreadsheetApp.getActive().getSheetByName(MENU.SHEET);
  const statusCell = menuSheet.getRange(row, 3); // column C
  const errorCell  = menuSheet.getRange(row, 4); // column D

  statusCell.setValue(STATUS.VALUES.LOADING);
  errorCell.clearContent();

  try {
    actionFn(campus);
    statusCell.setValue(STATUS.VALUES.DONE);
  } catch (err) {
    console.error(err);
    statusCell.setValue(STATUS.VALUES.ERROR);
    errorCell.setValue(err.message);

    // Attempt recovery reset
    try {
      fullView(campus);
    } catch (resetErr) {
      console.error('Reset failed:', resetErr);
      errorCell.setValue(`${err.message}\n\nReset failed: ${resetErr.message}`);
    }
  }
};


