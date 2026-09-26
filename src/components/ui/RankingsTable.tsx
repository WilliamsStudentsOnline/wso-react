import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import Select from "./Select";
import { Line } from "./Skeleton";

export type RankingsMetricOption = {
  label: string;
  value: string;
};

export type RankingsTableProps = {
  title: string;
  deficitMessage?: ReactNode;
  metric: string;
  metricOptions: RankingsMetricOption[];
  onMetricChange: (metric: string) => void;
  ascending: boolean;
  onToggleAscending: () => void;
  sortLinkTo: string;
  nameHeader?: string;
  extraHeaders?: ReactNode;
  skeletonColumns?: number;
  loading: boolean;
  rows: ReactNode;
  skeletonRowCount?: number;
};

const RankingsTable = ({
  title,
  deficitMessage,
  metric,
  metricOptions,
  onMetricChange,
  ascending,
  onToggleAscending,
  sortLinkTo,
  nameHeader = "Name",
  extraHeaders,
  skeletonColumns = 2,
  loading,
  rows,
  skeletonRowCount = 5,
}: RankingsTableProps) => {
  const skeleton = (key: number) => (
    <tr key={key}>
      {[...Array(skeletonColumns)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <td key={i}>
          <Line width="50%" />
        </td>
      ))}
    </tr>
  );

  return (
    <article className="main">
      <section className="margin-vertical-small">
        <h3>{title}</h3>
        <div className="added-sort" style={{ float: "right" }}>
          <strong>Sort By:</strong>
          <Select
            onChange={(event) => onMetricChange(event.target.value)}
            options={metricOptions.map((o) => o.label)}
            value={metric}
            valueList={metricOptions.map((o) => o.value)}
            style={{
              display: "inline",
              margin: "5px 0px 5px 20px",
              padding: "4px",
            }}
          />
        </div>
        {deficitMessage}
        <br />
        <table>
          <thead>
            <tr>
              <th> {nameHeader} </th>
              <th>
                <Link
                  to={sortLinkTo}
                  onClick={onToggleAscending}
                  style={{ color: "var(--text-on-brand)", fontWeight: "bold" }}
                >
                  Average Ratings {ascending ? "▲" : "▼"}
                </Link>
              </th>
              {extraHeaders}
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(skeletonRowCount)].map((_, i) => skeleton(i))
              : rows}
          </tbody>
        </table>
      </section>
    </article>
  );
};

export default RankingsTable;
