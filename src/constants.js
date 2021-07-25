export const AUTHORIZATION_KEY = "culturly_token";

export const SURVEY_DAY_OPTIONS = [
  {
    label: "Monday",
    value: "1",
  },
  {
    label: "Tuesday",
    value: "2",
  },
  {
    label: "Wednesday",
    value: "3",
  },
  {
    label: "Thursday",
    value: "4",
  },
  {
    label: "Friday",
    value: "5",
  },
];


export const SURVEY_WEEKLY_INTERVAL = "weekly";

export const DFFAULT_TEAM_NAMES = [
  "Sales",
  "Marketing",
  "Product",
  "Engineering",
  "IT",
  "Operations",
];

export const SURVEY_TYPE_DISPLAY_MAPPING = {
  happiness: "Happiness check",
  pulse: "Culture check",
};

export const CATEGORY_GRAPH_COLOR = {
  'belonging': '#2f4b7c',
  'engagement': '#f95d6a',
  'growth': '#ffa600',
  'feedback': '#003f5c',
  'personal-growth': '#6033FF',
  'recognition': '#fd625d',
  'relationships': '#ffde62',
  'satisfaction': '#7d68eb',
}

export const LINE_CHART_OPTIONS = {
  interaction: {
    mode: "index",
    intersect: false,
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "none",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${parseFloat(
            context.parsed.y.toFixed(2)
          )}%`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 12,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "#eaecf0",
        drawBorder: false,
      },
      ticks: {
        precision: 0,
        stepSize: 10,
        maxTicksLimit: 10,
        callback: function (value, index, values) {
          return `${value}%`;
        },
      },
    },
  },
};


export const MULTIPLE_LINE_CHART_OPTIONS = {
  interaction: {
    mode: "index",
    intersect: false,
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${parseFloat(
            context.parsed.y.toFixed(2)
          )}%`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 12,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "#eaecf0",
        drawBorder: false,
      },
      ticks: {
        precision: 0,
        stepSize: 10,
        maxTicksLimit: 10,
        callback: function (value, index, values) {
          return `${value}%`;
        },
      },
    },
  },
};

export const LINE_COUNT_CHART_OPTIONS = {
  interaction: {
    mode: "index",
    intersect: false,
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "none",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${parseFloat(
            context.parsed.y.toFixed(2)
          )}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 12,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "#eaecf0",
        drawBorder: false,
      },
      ticks: {
        precision: 0,
        stepSize: 5,
        maxTicksLimit: 10,
        callback: function (value, index, values) {
          return `${value}`;
        },
      },
    },
  },
}