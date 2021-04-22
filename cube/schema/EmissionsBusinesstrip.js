cube(`EmissionsBusinesstrip`, {
  sql: `SELECT * FROM public.emissions_businesstrip`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [id, timestamp]
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
