const config = require('./web/client/config.js');
const cookieNames = require('./web/client/enums/cookieNameEnum');

module.exports = {
  integrations: {
    magento: {
      location: '@vue-storefront/magento-api/server',
      configuration: {
        api: config.get('magentoGraphQl'),
        cookies: {
          ...cookieNames,
        },
        defaultStore: 'default',
        externalCheckout: {
          enable: config.get('enableMagentoExternalCheckout'),
          cmsUrl: config.get('externalCheckoutUrl'),
          syncUrlPath: config.get('externalCheckoutSyncPath'),
          stores: {
            default: config.get('enableMagentoExternalCheckout'),
          },
        },
        facets: {
          available: ['color', 'size', 'price'],
        },
        customApolloHttpLinkOptions: {
          useGETForQueries: false,
        },
      },
    },
  },
};
