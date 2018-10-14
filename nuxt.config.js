const pkg = require('./package');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'universal',
  env: {
    HTTP_ENDPOINT: process.env.HTTP_ENDPOINT || '/graphql',
    WS_ENDPOINT: process.env.WS_ENDPOINT || '/graphql'
  },
  /*
   ** Headers of the page
   */
  head: {
    title: '长顺扶贫信息在线平台',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.png'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.cat.net/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#FFFFFF'
  },

  /*
   ** Global CSS
   */
  css: [
    'vuetify/src/stylus/main.styl',
    '~/assets/app.stylus',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/common',
    '@/plugins/graphql-upload-client',
    {
      src: '@/plugins/vue-quill-editor.js',
      ssr: false
    }
  ],

  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/apollo'
  ],
  apollo: {
    includeNodeModules: true,
    // required
    clientConfigs: {
      default: {
        // required
        httpEndpoint: process.env.HTTP_ENDPOINT,
        // You can use `wss` for secure connection (recommended in production)
        // Use `null` to disable subscriptions
        wsEndpoint: process.env.WS_ENDPOINT, // optional
        // LocalStorage token
        // Enable Automatic Query persisting with Apollo Engine
        persisting: true // Optional
        // // Use websockets for everything (no HTTP)
        // // You need to pass a `wsEndpoint` for this to work
        // websocketsOnly: false // Optional
      }
    }
  },
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ];
      }
    },
    publicPath: 'http://cdn.128bit.top/cshun/'
  },
};
