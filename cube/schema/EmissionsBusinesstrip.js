cube(`EmissionsBusinesstrip`, {
  sql: `SELECT * FROM public.emissions_businesstrip`,

  joins: {
    EmissionsWorkinggroup: {
      relationship: `belongsTo`,
      sql: `${EmissionsBusinesstrip}.working_group_id = ${EmissionsWorkinggroup}.id`
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
    transportationMode: {
      sql: `transportation_mode`,
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
