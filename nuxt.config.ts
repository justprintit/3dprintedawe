// vim: set ts=2 sw=2 et:

// @core-development-only-start
/* eslint-disable unicorn/prefer-module */
// @core-development-only-end
import webpack from 'webpack';
import config from './web/client/config.js';
import middleware from './middleware.config';
import { getRoutes } from './web/client/routes';

const {
  integrations: {
    magento: {
      configuration: {
        cookies,
        externalCheckout,
        defaultStore,
        facets,
      },
    },
  },
} = middleware;

export default {
  srcDir: 'web/client',

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  ssr: true,
  dev: config.get('nuxtAppEnvironment') !== 'production',

  server: {
    port: config.get('nuxtAppPort'),
    host: '0' // default: localhost
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  loading: { color: '#fff' },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // to core
    '@nuxtjs/composition-api/module',
    '@nuxt/typescript-build',
    '@nuxtjs/google-fonts',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    ['@vue-storefront/nuxt', {
      useRawSource: {
        dev: ['@vue-storefront/magento', '@vue-storefront/core'],
        prod: ['@vue-storefront/magento', '@vue-storefront/core']
      }
    }
    ],
    ['@vue-storefront/nuxt-theme', {
      routes: false,
    }],
    ['@vue-storefront/magento/nuxt', {
      i18n: {
        useNuxtI18nConfig: true,
      },
      cookies,
      externalCheckout,
      defaultStore,
      facets,
    }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ['nuxt-i18n', {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    }],
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt',
    '@vue-storefront/middleware/nuxt',
    '@nuxtjs/html-validator',
  ],

  i18n: {
    country: 'US',
    locales: [
      {
        code: 'en-US',
        label: 'English',
        file: 'en.js',
        iso: 'en_US',
      },
    ],
    defaultLocale: 'en-US',
    lazy: true,
    seo: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: 'en-US',
      numberFormats: {
        'en-US': {
          currency: {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol',
          },
        },
        'de-DE': {
          currency: {
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'symbol',
          },
        },
        'nl-NL': {
          currency: {
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'symbol',
          },
        },
      },
    },
    detectBrowserLanguage: false,
  },
  pwa: {
    meta: {
      theme_color: '#5ECE7B',
    },
  },
  googleFonts: {
    families: {
      Raleway: {
        wght: [300, 400, 500, 600, 700],
        ital: [400],
      },
      Roboto: {
        wght: [300, 400, 500, 700],
        ital: [300, 400],
      },
    },
    display: 'swap',
  },
  styleResources: {
    scss: [require.resolve('@storefront-ui/shared/styles/_helpers.scss', { paths: [process.cwd()] })],
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }],
      ],
    },
    transpile: [
      'vee-validate/dist/rules',
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || '',
        }),
      }),
    ],
    extend(cfg, ctx) {
      // eslint-disable-next-line no-param-reassign
      cfg.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map';

      if (ctx && ctx.isClient) {
        // eslint-disable-next-line no-param-reassign
        cfg.optimization = {
          ...cfg.optimization,
          mergeDuplicateChunks: true,
          splitChunks: {
            ...cfg.optimization.splitChunks,
            automaticNameDelimiter: '.',
            chunks: 'all',
            enforceSizeThreshold: 40_000,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            maxSize: 128_000,
            minChunks: 1,
            minSize: 0,
            cacheGroups: {
              ...cfg.optimization.splitChunks.cacheGroups,
              vendor: {
                test: /[/\\]node_modules[/\\]/,
                reuseExistingChunk: true,
                name: (module) => `${module
                  .context
                  .match(/[/\\]node_modules[/\\](.*?)([/\\]|$)/)[1]
                  .replace(/[.@_]/gm, '')}`,
              },
            },
          },
        };
      }
    },
  },
  router: {
    extendRoutes(routes) {
      getRoutes(`${__dirname}/web/client`).forEach((route) => routes.unshift(route));
    },
  },
}
