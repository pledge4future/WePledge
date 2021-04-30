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

  const barChartQuery = {
    measures: ["EmissionsBusinesstrip.co2e"],
    timeDimensions: [
      {
        dimension: "EmissionsBusinesstrip.timestamp",
        granularity: "month",
      },
    ],
    order: {
      "EmissionsBusinesstrip.timestamp": "asc",
    },
    dimensions: [],
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
    </Grid>
  );
};

export default DashboardView;
