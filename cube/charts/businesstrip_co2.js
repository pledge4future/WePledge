import ReactDOM from "react-dom";
import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { Line, Bar, Pie, Doughnut, Chart } from "react-chartjs-2";
import { Row, Col, Statistic, Table } from "antd";

//import ChartDataLabels from 'chartjs-plugin-datalabels';

//const COLORS_SERIES = ["#4493c6", "#f15e44", "#2a3c90", "#ef3824"];
const COLORS_SERIES = ["#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"];


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
    label: 'CO2 Emissions of Business trips',
    labels: resultSet.categories().map((c) => c.category),
    datasets: resultSet.series().map((s) => ({
      label: s.title,
      data: s.series.map((r) => r.value),
      backgroundColor: COLORS_SERIES,
      hoverBackgroundColor: COLORS_SERIES,
      hoverOffset: 8
    }))
  };
  const options = { ...commonOptions };
  return <Doughnut data={data} options={options} />;
};

const ChartRenderer = () => {
  return (
    <QueryRenderer
      query={{
        measures: ["EmissionsBusinesstrip.co2e"],
        timeDimensions: [],
        order: {
          "EmissionsBusinesstrip.co2e": "desc"
        },
        dimensions: ["EmissionsBusinesstrip.transportationMode"]
      }}
      cubejsApi={cubejsApi}
      resetResultSetOnChange={false}
      render={(props) =>
        renderChart({
          ...props,
          chartType: "pie",
          pivotConfig: {
            x: ["EmissionsBusinesstrip.transportationMode"],
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
