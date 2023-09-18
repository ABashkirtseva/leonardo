export const createSchedule = `
  mutation($accountId: Int!, $agentId: Int!, $startTime: Date!, $endTime: Date!) {
    createSchedule(
      input: {
        accountId: $accountId,
        agentId: $agentId,
        startTime: $startTime,
        endTime: $endTime
      }
    ) {
      id
      accountId
      agentId
      startTime
      endTime
    }
  }
`;

export const updateSchedule = `
  mutation($id: ID!, $accountId: Int!, $agentId: Int!, $startTime: Date!, $endTime: Date!) {
    updateSchedule(
      input: {
        id: $id,
        accountId: $accountId,
        agentId: $agentId,
        startTime: $startTime,
        endTime: $endTime
      }
    ) {
      id
      accountId
      agentId
      startTime
      endTime
    }
  }
`;

export const getSchedule = `
  query($id: ID!) {
    schedule(id: $id) {
      id
      accountId
      agentId
      startTime
      endTime
    }
  }
`;

export const getSchedules = `
  query {
    schedules {
      id
      accountId
      agentId
      startTime
      endTime
    }
  }
`;

export const deleteSchedule = `
  mutation($id: ID!) {
    deleteSchedule(id: $id) {
      id
      accountId
      agentId
      startTime
      endTime
    }
  }
`;

export const createTask = `
  mutation($accountId: Int!, $scheduleId: String!, $startTime: Date!, $duration: Int!, $type: String!) {
    createTask(
      input: {
        accountId: $accountId,
        scheduleId: $scheduleId,
        startTime: $startTime,
        duration: $duration,
        type: $type
      }
    ) {
      id
      accountId
      scheduleId
      startTime
      duration
      type
    }
  }
`;

export const updateTask = `
  mutation($id: ID!, $accountId: Int!, $scheduleId: String!, $startTime: Date!, $duration: Int!, $type: String!) {
    updateTask(
      input: {
        id: $id,
        accountId: $accountId,
        scheduleId: $scheduleId,
        startTime: $startTime,
        duration: $duration,
        type: $type
      }
    ) {
      id
      accountId
      scheduleId
      startTime
      duration
      type
    }
  }
`;

export const getTask = `
  query($id: ID!) {
    task(id: $id) {
      id
      accountId
      scheduleId
      startTime
      duration
      type
    }
  }
`;

export const getTasks = `
  query {
    tasks {
      id
      accountId
      scheduleId
      startTime
      duration
      type
    }
  }
`;

export const deleteTask = `
  mutation($id: ID!) {
    deleteTask(id: $id) {
      id
      accountId
      scheduleId
      startTime
      duration
      type
    }
  }
`;
