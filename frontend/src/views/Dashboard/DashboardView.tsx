import React from "react";
import Grid from "@material-ui/core/Grid";
import CardRenderer from "./viz/CardRenderer";

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
    },{
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
  

  const chars = []

  return (
    <Grid container spacing={1}>
      {cards.map((card, index) => {
        return (
          <Grid key={index} item xs={12} lg={2}>
            <CardRenderer {...card}/>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DashboardView;
