const ROW_TO_CAMPUS = Object.entries(MENU.CAMPUSES)
  .reduce((acc, [campus, cfg]) => {
    acc[cfg.row] = campus;
    return acc;
  }, {});
