cube(`EmissionsUser`, {
  sql: `SELECT * FROM public.emissions_user`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [firstName, id, username, lastName, dateJoined]
    }
  },
  
  dimensions: {
    firstName: {
      sql: `first_name`,
      type: `string`
    },
    
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    isSuperuser: {
      sql: `is_superuser`,
      type: `string`
    },
    
    isRepresentative: {
      sql: `is_representative`,
      type: `string`
    },
    
    password: {
      sql: `password`,
      type: `string`
    },
    
    email: {
      sql: `email`,
      type: `string`
    },
    
    username: {
      sql: `username`,
      type: `string`
    },
    
    isStaff: {
      sql: `is_staff`,
      type: `string`
    },
    
    isActive: {
      sql: `is_active`,
      type: `string`
    },
    
    lastName: {
      sql: `last_name`,
      type: `string`
    },
    
    lastLogin: {
      sql: `last_login`,
      type: `time`
    },
    
    dateJoined: {
      sql: `date_joined`,
      type: `time`
    }
  },
  
  dataSource: `default`
});
