import React from "react";
import Grid from "@material-ui/core/Grid";

// Renderer
import { ChartRenderer } from "./viz/ChartRenderer";

// Componet
import Box from "./Box";

const DashboardView = () => {
  const cards = [
    {
      title: "researchers",
      query: {
        measures: ["EmissionsUser.count"],
        timeDimensions: [
          {
            dimension: "EmissionsUser.lastLogin",
          },
        ],
        order: {},
      },
    },
    {
      title: "researchers",
      query: {
        measures: ["EmissionsUser.count"],
        timeDimensions: [
          {
            dimension: "EmissionsUser.lastLogin",
          },
        ],
        order: {},
      },
    },
    {
      title: "researchers",
      query: {
        measures: ["EmissionsUser.count"],
        timeDimensions: [
          {
            dimension: "EmissionsUser.lastLogin",
          },
        ],
        order: {},
      },
    },
    {
      title: "researchers",
      query: {
        measures: ["EmissionsUser.count"],
        timeDimensions: [
          {
            dimension: "EmissionsUser.lastLogin",
          },
        ],
        order: {},
      },
    },
    {
      title: "researchers",
      query: {
        measures: ["EmissionsUser.count"],
        timeDimensions: [
          {
            dimension: "EmissionsUser.lastLogin",
          },
        ],
        order: {},
      },
    },
    {
      title: "researchers",
      query: {
        measures: ["EmissionsUser.count"],
        timeDimensions: [
          {
            dimension: "EmissionsUser.lastLogin",
          },
        ],
        order: {},
      },
    },
  ];

  const doughnutQuery = {
    measures: ["EmissionsBusinesstrip.co2e"],
    timeDimensions: [],
    order: {
      "EmissionsBusinesstrip.co2e": "desc",
    },
    dimensions: ["EmissionsBusinesstrip.transportationMode"],
  };

  const commonOptions = {
    maintainAspectRatio: true,
    layout: {
      padding: 30
    },
    borderWidth: 10,
    hoverBorderWidth:5,
    radius: '90%',
    plugins: {
      title: {
        display: true,
        text: "CO2e Emissions of business trips",
        font: {
          family: 'Montserrat, sans-serif',
            size: 15
        }
      },
      legend: {
          labels: {
              // This more specific font property overrides the global property
              font: {
                family: 'Montserrat, sans-serif',
                  size: 13
              }
          }
      }
  }
  };

  const barChartQuery = {
    measures: ["EmissionsElectricity.co2e", "EmissionsHeating.co2e", "EmissionsBusinesstrip.co2e"],
    timeDimensions: [
      {
        dimension: "EmissionsElectricity.timestamp",
        granularity: "month",
      },
    ],
    order: {
      "EmissionsElectricity.timestamp": "asc",
    },
    dimensions: [],
    filters: [],
  };
  const lineChartQuery = {
    measures: ["EmissionsBusinesstrip.co2e"],
    timeDimensions: [
      {
        dimension: "EmissionsBusinesstrip.timestamp",
        granularity: "day",
      },
    ],
    order: {
      "EmissionsBusinesstrip.timestamp": "asc",
    },
  };
  const areaChartQuery = {
    measures: ["EmissionsBusinesstrip.co2e"],
    timeDimensions: [
      {
        dimension: "EmissionsBusinesstrip.timestamp",
        granularity: "day",
      },
    ],
    order: {
      "EmissionsBusinesstrip.timestamp": "asc",
    },
  };
  const pieChartQuery = {
    measures: ["EmissionsBusinesstrip.co2e"],
    timeDimensions: [
      {
        dimension: "EmissionsBusinesstrip.timestamp",
      },
    ],
    order: {},
  };

  const tableQuery = {
    measures: ["EmissionsBusinesstrip.co2e"],
    timeDimensions: [
      {
        dimension: "EmissionsBusinesstrip.timestamp",
      },
    ],
    order: {},
  };

  return (
    <Grid container spacing={1}>
      {cards.map((card, index) => {
        const { title, query } = card;

        return (
          <Grid key={index} item lg={3} sm={6} xl={3} xs={12}>
            <Box>
              <ChartRenderer query={query} vizType="number" options={{ valueSuffix: title }} />
            </Box>
          </Grid>
        );
      })}

      <Grid item lg={8} md={12} xl={9} xs={12}>
        <Box title="tableChart">
          <ChartRenderer query={tableQuery} vizType="table" />
        </Box>
      </Grid>
      <Grid item lg={8} md={12} xl={9} xs={12}>
        <Box title="barChart">
          <ChartRenderer query={barChartQuery} vizType="bar" />
        </Box>
      </Grid>

      <Grid item lg={8} md={12} xl={9} xs={12}>
        <Box title="LineChart">
          <ChartRenderer query={lineChartQuery} vizType="line" />
        </Box>
      </Grid>

      <Grid item lg={8} md={12} xl={9} xs={12}>
        <Box title="Pie Chart">
          <ChartRenderer query={pieChartQuery} vizType="pie" />
        </Box>
      </Grid>

      <Grid item lg={8} md={12} xl={9} xs={12}>
        <Box title="Area Chart">
          <ChartRenderer query={areaChartQuery} vizType="area" />
        </Box>
      </Grid>

      <Grid item lg={8} md={12} xl={9} xs={12}>
        <Box title="Doughnut Chart">
          <ChartRenderer
            query={doughnutQuery}
            vizType="doughnut"
            options={{
              label: "CO2 Emissions of Business trips",
              commonOptions: commonOptions,
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardView;
