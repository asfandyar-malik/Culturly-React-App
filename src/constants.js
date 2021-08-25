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
  all: "#7d68eb",
  belonging: "#27cdec",
  engagement: "#fc4c8a",
  "well-being": "#25ddcc",
  feedback: "#57e2b4",
  "personal-growth": "#82e599",
  recognition: "#ace680",
  relationships: "#d5e46c",
  satisfaction: "#ffde62",
};

export const CATEGORY_GRAPH_LABEL = {
  all: "All Graphs",
  belonging: "Belonging",
  engagement: "Engagement",
  "well-being": "Well Being",
  feedback: "Feedback",
  "personal-growth": "Personal Growth",
  recognition: "Recognition",
  relationships: "Relationships",
  satisfaction: "Satisfaction",
};

export const BAR_GRAPH_BACKGROUND_COLORS = {
  all: "rgba(125, 104, 235, 0.2)",
  belonging: "rgba(39, 205, 236, 0.2)",
  engagement: "rgba(252, 76, 138, 0.2)",
  "well-being": "rgba(37, 221, 204, 0.2)",
  feedback: "rgba(87, 226, 180, 0.2)",
  "personal-growth": "rgba(130, 229, 153, 0.2)",
  recognition: "rgba(213, 228, 108, 0.2)",
  relationships: "rgba(255, 222, 98, 0.2)",
  satisfaction: "rgba(255, 222, 98, 0.2)",
};

export const BAR_GRAPH_BORDER_COLORS = {
  all: "#7d68eb",
  belonging: "#27cdec",
  engagement: "#fc4c8a",
  "well-being": "#25ddcc",
  feedback: "#57e2b4",
  "personal-growth": "#82e599",
  recognition: "#ace680",
  relationships: "#d5e46c",
  satisfaction: "#ffde62",
};

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
      labels: {
        usePointStyle: true,
        boxWidth: 8,
      },
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
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        boxWidth: 8,
      },
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

export const BAR_CHART_OPTION = {
  ...MULTIPLE_LINE_CHART_OPTIONS,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        boxWidth: 8,
      },
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
      offset: true,
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 12,
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
      labels: {
        usePointStyle: true,
        boxWidth: 8,
      },
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
};
