cube(`EmissionsHeating`, {
  sql: `SELECT * FROM public.emissions_heating`,

  joins: {
    EmissionsWorkinggroup: {
      relationship: `belongsTo`,
      sql: `${EmissionsHeating}.working_group_id = ${EmissionsWorkinggroup}.id`
    }
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [id, timestamp]
    },
    co2e: {
      type: `sum`,
      sql: `co2e`
    }
  },

  dimensions: {
    fuelType: {
      sql: `fuel_type`,
      type: `string`
    },

    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },

    timestamp: {
      sql: `timestamp`,
      type: `time`
    }
  },

  dataSource: `default`
});
