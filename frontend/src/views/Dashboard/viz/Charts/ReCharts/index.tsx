import React from "react";
import {
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    LineChart,
    Line
} from "recharts";
import { ResultSet } from "../../../../../interfaces/Types/cube";

interface Props {
    resultSet: ResultSet;
}

const colors = ['#FF6492', '#141446', '#7A77FF'];

const CartesianChart: React.FC<{
    resultSet: ResultSet;
    ChartComponent: React.FC<{ data: any[]; }>;
}> = ({ resultSet, children, ChartComponent }) => (
    <ResponsiveContainer width="100%" height={350}>
        <ChartComponent data={resultSet.chartPivot()}>
            <XAxis dataKey="x" />
            <YAxis />
            <CartesianGrid />
            {children}
            <Legend />
            <Tooltip />
        </ChartComponent>
    </ResponsiveContainer>
);

export const AreaRender: React.FC<Props> = ({ resultSet }) => (
    <CartesianChart resultSet={resultSet} ChartComponent={(props) => <AreaChart {...props} />}>
        {resultSet.seriesNames().map((series, i) => (
            <Area
                key={series.key}
                stackId="a"
                dataKey={series.key}
                name={series.title}
                stroke={colors[i]}
                fill={colors[i]}
            />
        ))}
    </CartesianChart>
);


export const BarRender: React.FC<Props> = ({ resultSet }) => (
    <CartesianChart resultSet={resultSet} ChartComponent={(props) => <BarChart {...props} />} >
        {resultSet.seriesNames().map((series, i) => (
            <Bar
                key={series.key}
                stackId="a"
                dataKey={series.key}
                name={series.title}
                fill={colors[i]}
            />
        ))}
    </CartesianChart>
);

export const LineRender: React.FC<Props> = ({ resultSet }) => (
    <CartesianChart resultSet={resultSet} ChartComponent={(props) => <LineChart {...props} />} >
        {resultSet.seriesNames().map((series, i) => (
            <Line
                key={series.key}
                // stackId="a"
                dataKey={series.key}
                name={series.title}
                stroke={colors[i]}
            />
        ))}
    </CartesianChart >
);

export const PieRender: React.FC<Props> = ({ resultSet }) => (
    <ResponsiveContainer width="100%" height={350}>
        <PieChart>
            <Pie
                isAnimationActive={false}
                data={resultSet.chartPivot()}
                nameKey="x"
                dataKey={resultSet.seriesNames()[0].key}
                fill="#8884d8"
            >
                {
                    resultSet.chartPivot().map((e, index) =>
                        <Cell key={index} fill={colors[index % colors.length]} />
                    )
                }
            </Pie>
            <Legend />
            <Tooltip />
        </PieChart>
    </ResponsiveContainer>
);