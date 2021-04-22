cube(`EmissionsWorkinggroup`, {
  sql: `SELECT * FROM public.emissions_workinggroup`,

  joins: {
    EmissionsHeating: {
      relationship: `hasMany`,
      sql: `${EmissionsWorkinggroup}.id = ${EmissionsHeating}.working_group_id`
    },
    EmissionsElectricity: {
      relationship: `hasMany`,
      sql: `${EmissionsWorkinggroup}.id = ${EmissionsElectricity}.working_group_id`
    }
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [name, id]
    }
  },

  dimensions: {
    name: {
      sql: `name`,
      type: `string`
    },

    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    }
  },

  dataSource: `default`
});
