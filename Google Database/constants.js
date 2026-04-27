const CAMPUSES = {
  NORTH: 'north',
  SOUTH: 'south',
  WEST: 'west',
  COMBINED: 'combined'
};

const SHEETS = {
  [CAMPUSES.NORTH]: {
    DATABASE: 'North Database 26.1',
    FOLLOW_UP: 'North Follow-Up',
    LEADERS: 'North Leaders',
  },

  [CAMPUSES.SOUTH]: {
    DATABASE: 'South Database 26.1',
    FOLLOW_UP: 'South Follow-Up',
    LEADERS: 'South Leaders',
  },

  [CAMPUSES.WEST]: {
    DATABASE: 'West Database 26.1',
    FOLLOW_UP: 'West Follow-Up',
    LEADERS: 'West Leaders'
  },

  [CAMPUSES.COMBINED]: {
    DATABASE: 'Combined Database 26.1',
    GRAD_SIGN_UP: 'Combined Grad Sign Up'
  }
};


const MENU = {
  SHEET: 'Menu',

  COLS: {
    CAMPUS: 1,   // A
    ACTION: 2,   // B
    STATUS: 3,   // C
    ERROR: 4     // D
  },

  CAMPUSES: {
    north: {
      row: 2,
      actions: {
        'Attendance': 'ATTENDANCE',
        'Generate Follow-Up': 'FOLLOW_UP',
        'Unhide All': 'FULL_VIEW'
      }
    },

    south: {
      row: 3,
      actions: {
        'Attendance': 'ATTENDANCE',
        'Generate Follow-Up': 'FOLLOW_UP',
        'Unhide All': 'FULL_VIEW'
      }
    },

    west: {
      row: 4,
      actions: {
        'Attendance': 'ATTENDANCE',
        'Generate Follow-Up': 'FOLLOW_UP',
        'Unhide All': 'FULL_VIEW'
      }
    },

    combined: {
      row: 5,
      actions: {
        'Attendance': 'ATTENDANCE',
        'Unhide All': 'FULL_VIEW'
      }
    }
  }
};

const DB_COLUMNS = {
  TIMESTAMP: 1,
  FIRST_NAME: 2,
  LAST_NAME: 3,
  PHONE: 4,
  EMAIL: 5,
  SCHOOL: 6,
  CHURCH: 7,
  PROMO: 8,
  FAITH: 9,
  PHOTO: 10,
  WEEK_1: 11,
  WEEK_2: 12,
  WEEK_3: 13,
  WEEK_4: 14,
  WEEK_5: 15,
  WEEK_6: 16,
  WEEK_7: 17,
  WEEK_8: 18,
  WEEK_9: 19,
  WEEK_10: 20,
  CONSEC_MISSED: 21,
  ATTEND_RATE: 22,
  LEADERS_CHATTED: 23
};


const FOLLOW_UP = {
  FILTER_VALUE: '2',
  HEADERS: [
    'First Name',
    'Last Name',
    'Phone number',
    'School',
    'Church',
    'Faith',
    'Chatted to',
    'Assigned Leader',
    'Message Sent',
    'Response'
  ]
};

const VIEWS = {
  ATTENDANCE: {
    HIDE_COLUMNS: [
      DB_COLUMNS.TIMESTAMP,
      DB_COLUMNS.EMAIL,
      DB_COLUMNS.SCHOOL,
      DB_COLUMNS.PROMO,
      DB_COLUMNS.FAITH,
      DB_COLUMNS.CONSEC_MISSED,
      DB_COLUMNS.ATTEND_RATE,
      DB_COLUMNS.LEADERS_CHATTED
    ]
  }
};

const COLORS = {
  SUCCESS: '#c6efce',
  WARNING: '#fff2cc',
  ERROR:   '#f4cccc'
};

const STATUS = {
  VALUES: {
    LOADING: '⏳ Loading...',
    DONE: '✅ Done!',
    ERROR: '❌ Error!'
  }
};

const COMBINED_TRANSFER = {
  // Columns to copy INTO the combined database, in order
  COLUMNS: [
    DB_COLUMNS.TIMESTAMP,
    DB_COLUMNS.FIRST_NAME,
    DB_COLUMNS.LAST_NAME,
    DB_COLUMNS.PHONE,
    DB_COLUMNS.EMAIL,
    DB_COLUMNS.SCHOOL,
    DB_COLUMNS.CHURCH,
    DB_COLUMNS.PROMO,
    DB_COLUMNS.FAITH,
    DB_COLUMNS.PHOTO
  ],

  HEADER_ROWS: 2
};

const SIGN_UP_FORM_QUESTIONS = {
  FIRST_NAME: { 
    text: "First Name", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  LAST_NAME: { 
    text: "Last Name", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  PHONE: { 
    text: "Phone Number 📞", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  EMAIL: { 
    text: "Email ✉️", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  SCHOOL: { 
    text: "School graduated from? 🏫", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  CHURCH: { 
    text: "Church ⛪️  (Leave blank if you don't have one!)", 
    required: false, 
    type: "SHORT_TEXT" 
  },
  PROMO: { 
    text: "How did you hear about Connect? 🗣️", 
    required: true, 
    type: "MULTIPLE_CHOICE",
    options: [
      "Word of Mouth",
      "Church/Youth Group",
      "School",
      "Social Media @connect_sydney :)",
      "Friend",
      "A Connect Leader (tell us below!)",
      "Other" 
    ]
  },
  FAITH: {
    text: "Where are you in your faith? (if you have a different religious background, we'd love to hear which one!)",
    required: true,
    type: "MULTIPLE_CHOICE",
    options: [
      "I'm a Christian!",
      "I'm exploring Christianity!",
      "I'm a new Christian!",
      "I'm not interested in Christianity",
      "It's complicated",
      "I'd rather not say",
      "Other"
    ]
  },
  PHOTO: {
    text: "Do you give us consent to post photos of you on our Instagram @connect_sydney! If 'No' please see the front desk so we know who you are and we will do our best! otherwise we cannot guarantee that you won't be in our photos",
    required: true,
    type: "MULTIPLE_CHOICE",
    options: ["Yes", "No"]
  }
};
const LEADER_FORM_QUESTIONS = {
  FIRST_NAME: { 
    text: "First name 🤩", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  SURNAME: { 
    text: "Surname 😶‍🌫️", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  PHONE: { 
    text: "What's your number? 🤭", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  EMAIL: { 
    text: "What's your email? 📭", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  HIGH_SCHOOL: { 
    text: "Which high school did you attend? 🏫", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  UNI_STATUS: { 
    text: "What uni/gap year do you attend? 🎓 (if you're doing a gap year and you know which uni you may attend next year, tick both!)", 
    required: true, 
    type: "CHECKBOX", // Allow selecting multiple
    options: [
      "University of New South Wales",
      "University of Sydney",
      "University of Technology Sydney",
      "Macquarie University",
      "Western Sydney University",
      "Australian Catholic University",
      "The Bridge",
      "Year 13",
      "Other" // The function will handle this automatically
    ]
  },
  DEGREE: { 
    text: "What degree do you study? ☝️🤓", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  CHURCH: { 
    text: "What church do you attend? ⛪", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  SUBURB: { 
    text: "Which suburb do you live in? 🏙️🌳", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  DOB: { 
    text: "What is your date of birth? 🎂", 
    required: true, 
    type: "DATE" 
  },
  TEAM: { 
    text: "Which Connect team are you in? 🤝", 
    required: true, 
    type: "MULTIPLE_CHOICE", // Only select one
    options: [
      "West", 
      "South", 
      "North Promo", 
      "North Database", 
      "North Logistics", 
      "Director"
    ]
  },
  ABSENCES: { 
    text: "Tick any dates you know you will be absent from Connect (if any) 📆\n*note: dates may be subject to change", 
    required: false, 
    type: "CHECKBOX",
    options: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
      "Week 6",
      "Week 7",
      "Week 8",
      "Camp"
    ]
  },
  WWCC_NUMBER: { 
    text: "WWCC (working with children's check) number 🚸", 
    required: true, 
    type: "SHORT_TEXT" 
  },
  WWCC_EXPIRY: { 
    text: "WWCC (working with children's check) expiry date 📆", 
    required: true, 
    type: "DATE" 
  },
  // Note: Adding a File Upload question automatically forces users to sign in to Google
  SMT_CERT: { 
    text: "Attach your Safe Ministry Training certificate here 📃", 
    required: true, 
    type: "FILE_UPLOAD" 
  },
  SMT_DATE: { 
    text: "Date of Safe Ministry Training completion", 
    required: true, 
    type: "DATE" 
  },
  COMMENTS: { 
    text: "Questions, comments, concerns? Fun facts? Shower thoughts? Hot takes? Anything you'd like to share? 👀", 
    required: true, 
    type: "PARAGRAPH" 
  }
};



