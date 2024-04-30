'use strict';

/**
 * message service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = module.exports = createCoreService('api::message.message', ({ strapi }) => ({
  async createMessage(data) {
    try {
      await strapi.entityService.create('api::message.message', { data });
      
    } catch (error) {
      strapi.log.error('Error creating message:', error);
      throw error;
    }
  },
}));
