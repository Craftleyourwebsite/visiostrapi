import { seedCategories } from './seed-categories';

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

      await seedCategories(strapi);

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
        'api::selected-project-list.selected-project-list.find',
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

      // --- DATABASE CLEANUP ---
      strapi.log.info('🧹 CHECKING FOR TEST PROJECTS TO CLEAN UP...');
      const deletedProjects = await strapi.db.query('api::project.project').deleteMany({
        where: {
          title: {
            $contains: 'TEST TITLE'
          }
        }
      });
      if (deletedProjects.count > 0) {
        strapi.log.info(`✅ Cleaned up ${deletedProjects.count} test projects.`);
      } else {
        strapi.log.info('ℹ️ No test projects found to clean up.');
      }
      // ------------------------

      // --- TEAM MEMBER ORDER FIX ---
      // DISABLED: This was resetting manual order changes on every restart
      // strapi.log.info('🔢 FIXING TEAM MEMBER ORDER...');
      // await reorderTeamMembers(strapi);
      // await reorderPreviousTeamMembers(strapi);
      // If you need to reset all orders once, uncomment and restart, then re-comment
      // ------------------------

      strapi.log.info('🚀 ANTIGRAVITY BOOTSTRAP FINISHED - Public API should be accessible');

    } catch (e) {
      strapi.log.error('❌ Bootstrap error:', e);
    }
  },
};

/**
 * Reorder all team members to ensure consistent 0, 1, 2, 3... ordering
 * Sorts by ID (which reflects creation order) to assign sequential orders
 */
async function reorderTeamMembers(strapi: any) {
  try {
    // Sort by ID to maintain consistent creation order
    const allMembers = await strapi.db.query('api::team-member.team-member').findMany({
      select: ['id', 'order', 'name'],
      orderBy: { id: 'asc' },
    });

    let updated = 0;
    for (let i = 0; i < allMembers.length; i++) {
      const member = allMembers[i];
      if (member.order !== i) {
        await strapi.db.query('api::team-member.team-member').update({
          where: { id: member.id },
          data: { order: i },
        });
        updated++;
        strapi.log.info(`  📝 Team Member "${member.name}" (ID:${member.id}) order: ${member.order} → ${i}`);
      }
    }

    if (updated > 0) {
      strapi.log.info(`✅ Fixed order for ${updated} team members (total: ${allMembers.length})`);
    } else {
      strapi.log.info(`ℹ️ Team members order already correct (total: ${allMembers.length})`);
    }
  } catch (error) {
    strapi.log.error('❌ Error reordering team members:', error);
  }
}

/**
 * Reorder all previous team members to ensure consistent 0, 1, 2, 3... ordering
 * Sorts by ID (which reflects creation order) to assign sequential orders
 */
async function reorderPreviousTeamMembers(strapi: any) {
  try {
    // Sort by ID to maintain consistent creation order
    const allMembers = await strapi.db.query('api::previous-team-member.previous-team-member').findMany({
      select: ['id', 'order', 'name'],
      orderBy: { id: 'asc' },
    });

    let updated = 0;
    for (let i = 0; i < allMembers.length; i++) {
      const member = allMembers[i];
      if (member.order !== i) {
        await strapi.db.query('api::previous-team-member.previous-team-member').update({
          where: { id: member.id },
          data: { order: i },
        });
        updated++;
        strapi.log.info(`  📝 Previous Team Member "${member.name}" (ID:${member.id}) order: ${member.order} → ${i}`);
      }
    }

    if (updated > 0) {
      strapi.log.info(`✅ Fixed order for ${updated} previous team members (total: ${allMembers.length})`);
    } else {
      strapi.log.info(`ℹ️ Previous team members order already correct (total: ${allMembers.length})`);
    }
  } catch (error) {
    strapi.log.error('❌ Error reordering previous team members:', error);
  }
}
