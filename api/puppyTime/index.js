import { Machine } from 'xstate'

Machine({
  // Machine identifier
  id: 'puppy-time',

  // Initial state
  initial: 'outside',

  // Local context for entire machine
  context: {
    user: null,
    activities
  },

  // State definitions
  states: {
    outside: {
      on: {
        LOGIN: 'kennel'
      }
    },
    kennel: {
      on: {
        ADD_ACTIVITY: {
          target: 'activityCreation'
        },
        VIEW_ACTIVITIES: {
          target: 'activities'
        }
      }
    },
    activities: {},
    activityCreation: {
      initial: 'basic',
      states: {
        basic: {},
        advanced: {}
      },
      on: {
        ADD_ADVANCED: 'advanced',
        CREATE_ACTIVITY: 'activities'
      }
    }
  }
})