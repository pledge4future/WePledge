
import React from "react";
import { Line, Bar, Pie } from 'react-chartjs-2';

// Customized CubeJS Types
import { ResultSet } from "../../../../../interfaces/Types/cube";

const COLORS_SERIES = ['#FF6492', '#141446', '#7A77FF'];

interface Props {
    resultSet: ResultSet;
}

export const AreaRender: React.FC<Props> = ({ resultSet }) => {
    const data = {
        labels: resultSet.categories().map(c => c.category),
        datasets: resultSet.series().map((s, index) => (
            {
                label: s.title,
                data: s.series.map((r: any) => r.value),
                backgroundColor: COLORS_SERIES[index]
            }
        )),
    };
    const options = {
        scales: { yAxes: [{ stacked: true }] }
    };
    return <Line data={data} options={options} />;
};

export const BarRender: React.FC<Props> = ({ resultSet }) => {
    const data = {
        labels: resultSet.categories().map(c => c.category),
        datasets: resultSet.series().map((s, index) => (
            {
                label: s.title,
                data: s.series.map((r: any) => r.value),
                backgroundColor: COLORS_SERIES[index],
                fill: false
            }
        )),
    };
    const options = {
        scales: { xAxes: [{ stacked: true }] }
    };
    return <Bar data={data} options={options} />;
};

export const LineRender: React.FC<Props> = ({ resultSet }) => {
    const data = {
        labels: resultSet.categories().map(c => c.category),
        datasets: resultSet.series().map((s, index) => (
            {
                label: s.title,
                data: s.series.map((r: any) => r.value),
                borderColor: COLORS_SERIES[index],
                fill: false
            }
        )),
    };
    const options = {};
    return <Line data={data} options={options} />;
};

export const PieRender: React.FC<Props> = ({ resultSet }) => {
    const data = {
        labels: resultSet.categories().map(c => c.category),
        datasets: resultSet.series().map(s => (
            {
                label: s.title,
                data: s.series.map((r: any) => r.value),
                backgroundColor: COLORS_SERIES,
                hoverBackgroundColor: COLORS_SERIES,
            }
        ))
    };
    const options = {};
    return <Pie data={data} options={options} />;
};
