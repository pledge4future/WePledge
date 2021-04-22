cube(`EmissionsElectricity`, {
  sql: `SELECT * FROM public.emissions_electricity`,

  joins: {
    EmissionsWorkinggroup: {
      relationship: `belongsTo`,
      sql: `${EmissionsElectricity}.working_group_id = ${EmissionsWorkinggroup}.id`
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
    },

    working_group_id: {
      sql: `working_group_id`,
      type: `number`
    },

  },

  dataSource: `default`
});
