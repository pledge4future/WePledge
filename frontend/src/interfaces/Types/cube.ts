import {
  ResultSet as RS,
  PivotConfig,
  Column as C,
  Filter as F,
} from "@cubejs-client/core";

export enum TimeDimensionGranularities {
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export interface ResultSet extends Omit<RS, "tableColumns" | "seriesNames"> {
  seriesNames(pivotConfig?: PivotConfig): Column[];
  tableColumns(pivotConfig?: PivotConfig): Column[];
  totalRow(pivotConfig?: PivotConfig): { [key: string]: number };
  pivot(pivotConfig?: PivotConfig): Pivot[];
  axisValuesString(axisValues: string[], delimiter: string): string;
  categories(pivotConfig?: PivotConfig): any[];
}

interface Pivot {
  xValues: string[];
  yValuesArray: [string[], string][];
}

export type Column = C & {
  shortTitle?: string;
  type?: string;
};

export interface Dimension {
  index?: number;
  key: string;
  title: string;
  name: string;
  type?: string;
  shortTitle?: string;
  suggestFilterValues?: boolean;
  cumulativeTotal?: boolean;
  cumulative?: boolean;
  aggType?: string;
}

export type Filter = Omit<F, "dimension"> & { dimension?: Dimension };

export interface Methods {
  add: (member: any) => void;
  remove: (member: any) => void;
  update: (member: any, updateWith: any) => void;
}
