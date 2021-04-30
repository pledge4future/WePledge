import React from "react";

// Cube
import { ResultSet } from "../../../interfaces/Types/cube";
import { Query } from "@cubejs-client/core";
import { cubejsApi } from "../../../utils/helpers";
import { useCubeQuery } from "@cubejs-client/react";

// Components
import { BarRender, LineRender, PieRender, AreaRender } from "./Charts/ChartJS";
import NumberRender, { NumberOptions } from "./Number";
import TableRender from "./Table";
import CircularProgress from "../../../components/CircularProgress";

export interface ChartValue {
  resultSet: ResultSet;
  options: any;
}

export interface ChartRenderer {
  query: Query;
  vizType: ChartType;
  options?: NumberOptions;
}

interface TypeToChartComponent {
  [key: string]: React.SFC<ChartValue>;
}
const TypeToChartComponent: TypeToChartComponent = {
  line: ({ resultSet }) => <LineRender resultSet={resultSet} />,
  area: ({ resultSet }) => <AreaRender resultSet={resultSet} />,
  bar: ({ resultSet }) => <BarRender resultSet={resultSet} />,
  pie: ({ resultSet }) => <PieRender resultSet={resultSet} />,
  number: ({ resultSet, options }) => <NumberRender resultSet={resultSet} options={options} />,
  table: ({ resultSet }) => <TableRender resultSet={resultSet} />,
};
export type ChartType = keyof TypeToChartComponent;

const TypeToMemoChartComponent = Object.keys(TypeToChartComponent)
  .map((key) => ({ [key]: React.memo(TypeToChartComponent[key]) }))
  .reduce((a, b) => ({ ...a, ...b }));

export function ChartRenderer({ query, vizType, options }: ChartRenderer) {
  const component = TypeToMemoChartComponent[vizType];
  const renderProps = useCubeQuery(query, { cubejsApi });
  return component && renderChart(component)({ ...renderProps, options });
}

type RenderChart = (
  Component: React.FC<ChartValue>
) => ({ resultSet, error, options }: ChartValue & { error: Error | null }) => JSX.Element;

const renderChart: RenderChart = (Component) => ({ resultSet, error, options }) =>
  (resultSet && <Component resultSet={resultSet} options={options} />) ||
  (error && error.toString()) || <CircularProgress />;
