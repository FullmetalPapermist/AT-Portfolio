const installOwnerTriggers = () => {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'ownerDispatcher') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('ownerDispatcher')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
};

const ownerDispatcher = (e) => {
  if (!e) return;

  const range = e.range;
  const sheet = range.getSheet();

  if (sheet.getName() !== MENU.SHEET) return;
  if (range.getColumn() !== MENU.COLS.ACTION) return;

  const campus = ROW_TO_CAMPUS[range.getRow()];
  if (!campus) return;

  const actionLabel = range.getValue();
  if (!actionLabel) return;

  // Clear immediately to allow re-click
  range.clearContent();

  const campusCfg = MENU.CAMPUSES[campus];
  const baseAction = campusCfg.actions[actionLabel];

  if (!baseAction) {
    runWithStatus_(
      () => { throw new Error(`Invalid action: ${actionLabel}`); },
      campus,
      range.getRow()
    );
    return;
  }

  const ACTION_HANDLERS = {
    ATTENDANCE: attendance,
    FOLLOW_UP: generateFollowUp,
    FULL_VIEW: fullView
  };

  const fn = ACTION_HANDLERS[baseAction];
  if (!fn) {
    runWithStatus_(
      () => { throw new Error(`No handler for action: ${baseAction}`); },
      campus,
      range.getRow()
    );
    return;
  }

  runWithStatus_(() => fn(campus), campus, range.getRow());
};
