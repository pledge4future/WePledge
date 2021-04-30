import ReactDOM from "react-dom";
import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { Bar } from "react-chartjs-2";
import { Row, Col, Statistic, Table } from "antd";

import numeral from "numeral";
import "chartjs-adapter-moment";

//const COLORS_SERIES = ["#4493c6", "#2a3c90", "#f15e44", "#ef3824"];
const COLORS_SERIES = ["#045a8d", "#2b8cbe", "#74a9cf", "#bdc9e1"];

const commonOptions = {
  maintainAspectRatio: true,
  plugins: {
    tooltips: {
      callbacks: {
            title: function(tooltipItems, data) {
              return '';
            },
            label: function(tooltipItem, data) {
              return data.labels[tooltipItem.index];
            }
          }
    },
    legend: {
      labels: {
        // This more specific font property overrides the global property
        font: {
          family: "Montserrat, sans-serif",
          size: 13
        }
      }
    },
    title: {
      display: true,
      text: "Overview CO2e Emissions",
      font: {
        family: "Montserrat, sans-serif",
        size: 15
      }
    }
  }
};

const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTk0NjQxMDYsImV4cCI6MTYxOTU1MDUwNn0.t5arR1icNUwskBoa9ZSEUUvMjKDnjtVJ0nXo_6V76Pw",
  { apiUrl: "http://localhost:4000/cubejs-api/v1" }
);

const renderChart = ({ resultSet, error, pivotConfig }) => {
  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return <Spin />;
  }

  const data = {
    labels: resultSet.categories().map((c) => c.category),
    datasets: resultSet.series().map((s, index) => ({
      label: s.title,
      data: s.series.map((r) => r.value),
      backgroundColor: COLORS_SERIES[index],
      fill: false
    }))
  };
  const options = {
    ...commonOptions,
    responsive: true,
    scales: {
      x: {
        stacked: true,
        type: "time",
        time: {
          unit: "month"
        }
      },
      y: {
        title: {
          text: "CO2e t",
          display: true
        },
        ticks: {
          callback: function (value) {
            return numeral(value / 1000).format("0.");
          }
        },
        stacked: true
      }
    },
  };
  return <Bar data={data} options={options} />;
};

const ChartRenderer = () => {
  return (
    <QueryRenderer
      query={{
        measures: [
          "EmissionsElectricity.co2e",
          "EmissionsHeating.co2e",
          "EmissionsBusinesstrip.co2e"
        ],
        timeDimensions: [
          {
            dimension: "EmissionsElectricity.timestamp",
            granularity: "month"
          }
        ],
        order: {
          "EmissionsElectricity.timestamp": "asc"
        },
        dimensions: [],
        filters: []
      }}
      cubejsApi={cubejsApi}
      resetResultSetOnChange={false}
      render={(props) =>
        renderChart({
          ...props,
          chartType: "bar",
          pivotConfig: {
            x: ["EmissionsElectricity.timestamp.month"],
            y: ["measures"],
            fillMissingDates: true,
            joinDateRange: false
          }
        })
      }
    />
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<ChartRenderer />, rootElement);
