export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      strapi.log.info('🚀 ANTIGRAVITY BOOTSTRAP STARTED');

      // Fetch Public role with its existing permissions
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
        populate: ['permissions']
      });

      if (!publicRole) {
        strapi.log.error('❌ Public role not found!');
        return;
      }

      strapi.log.info(`ℹ️ Public Role ID: ${publicRole.id}`);

      // Essential permissions for the frontend to work
      const actions = [
        'api::project.project.find',
        'api::project.project.findOne',
        'api::global-setting.global-setting.find',
        'api::news.news-post.find',
        'api::news.news-post.findOne',
        'api::category.category.find',
        'api::category.category.findOne',
        'api::team-member.team-member.find',
        'api::team-member.team-member.findOne',
      ];

      for (const action of actions) {
        // Check if permission already exists in the loaded role
        const hasPermission = publicRole.permissions.some(p => p.action === action);

        if (!hasPermission) {
          strapi.log.info(`⚠️ Permission missing: ${action}. Adding it...`);

          // Create the permission directly in the DB
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: {
              action: action,
              role: publicRole.id
            }
          });
          strapi.log.info(`✅ Permission added: ${action}`);
        } else {
          strapi.log.info(`✅ Permission already active: ${action}`);
        }
      }

      strapi.log.info('🚀 ANTIGRAVITY BOOTSTRAP FINISHED - Public API should be accessible');

    } catch (e) {
      strapi.log.error('❌ Bootstrap error:', e);
    }
  },
};
