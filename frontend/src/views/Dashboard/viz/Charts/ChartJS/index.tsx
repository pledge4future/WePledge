import React from "react";
import { Line, Bar, Pie, Doughnut, ChartOptions } from "react-chartjs-2";

// Customized CubeJS Types
import { ResultSet } from "../../../../../interfaces/Types/cube";

const COLORS_SERIES = ["#FF6492", "#141446", "#7A77FF"];

interface Props {
  resultSet: ResultSet;
}

export const AreaRender: React.FC<Props> = ({ resultSet }) => {
  const data = {
    labels: resultSet.categories().map((c) => c.category),
    datasets: resultSet.series().map((s, index) => ({
      label: s.title,
      data: s.series.map((r: any) => r.value),
      backgroundColor: COLORS_SERIES[index],
    })),
  };
  const options = {
    scales: { yAxes: [{ stacked: true }] },
  };
  return <Line data={data} options={options} />;
};

export const BarRender: React.FC<Props> = ({ resultSet }) => {
  const data = {
    labels: resultSet.categories().map((c) => c.category),
    datasets: resultSet.series().map((s, index) => ({
      label: s.title,
      data: s.series.map((r: any) => r.value),
      backgroundColor: COLORS_SERIES[index],
      fill: false,
    })),
  };
  const options = {
    scales: { xAxes: [{ stacked: true }] },
  };
  return <Bar data={data} options={options} />;
};

export const LineRender: React.FC<Props> = ({ resultSet }) => {
  const data = {
    labels: resultSet.categories().map((c) => c.category),
    datasets: resultSet.series().map((s, index) => ({
      label: s.title,
      data: s.series.map((r: any) => r.value),
      borderColor: COLORS_SERIES[index],
      fill: false,
    })),
  };
  const options = {};
  return <Line data={data} options={options} />;
};

export const PieRender: React.FC<Props> = ({ resultSet }) => {
  const data = {
    labels: resultSet.categories().map((c) => c.category),
    datasets: resultSet.series().map((s) => ({
      label: s.title,
      data: s.series.map((r: any) => r.value),
      backgroundColor: COLORS_SERIES,
      hoverBackgroundColor: COLORS_SERIES,
    })),
  };
  const options = {};
  return <Pie data={data} options={options} />;
};

export interface DoughnutOptions {
  label?: string;
  commonOptions?: ChartOptions;
}

// TODO: remove fix color

export const DoughnutRender: React.FC<Props> = ({ resultSet, options }) => {
  const data = {
    label: options.label,
    labels: resultSet.categories().map((c) => c.category),
    datasets: resultSet.series().map((s) => ({
      label: s.title,
      data: s.series.map((r) => r.value),
      backgroundColor: ["#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"],
      hoverBackgroundColor: ["#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"],
      hoverOffset: 8,
    })),
  };
  const doughnutOptions = {};
  return (
    <Doughnut data={data} options={!options ? doughnutOptions : { ...options.commonOptions }} />
  );
};
