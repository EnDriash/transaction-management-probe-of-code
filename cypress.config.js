const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    apiUrl: 'http://localhost:3000',
  },
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.info(message)

          return null
        },
      })
    },
    supportFile: false,
    baseUrl: 'http://localhost:3001',
  },
  
})
