/**
 * Team Member Lifecycle
 * Automatically assigns order when creating new team members
 * Ensures order syncs correctly when publishing
 */

export default {
    async beforeCreate(event: any) {
        const { data } = event.params;

        // Only auto-assign order if not explicitly set by user
        if (data.order === undefined || data.order === null) {
            try {
                // Find the maximum order value and add 1
                const existingMembers = await strapi.db.query('api::team-member.team-member').findMany({
                    select: ['order'],
                    orderBy: { order: 'desc' },
                    limit: 1,
                });

                if (existingMembers && existingMembers.length > 0 && existingMembers[0].order !== null) {
                    data.order = existingMembers[0].order + 1;
                } else {
                    data.order = 0;
                }

                console.log(`[Team Member Lifecycle] Auto-assigned order: ${data.order}`);
            } catch (error) {
                console.error('[Team Member Lifecycle] Error calculating order:', error);
                data.order = 0;
            }
        } else {
            console.log(`[Team Member Lifecycle] Using user-specified order: ${data.order}`);
        }
    },

    async beforeUpdate(event: any) {
        const { data, where } = event.params;

        // If order is being updated, ensure it's a valid integer
        if (data.order !== undefined) {
            const orderValue = parseInt(data.order, 10);
            if (!isNaN(orderValue) && orderValue >= 0) {
                data.order = orderValue;
                console.log(`[Team Member Lifecycle] Order updated to: ${data.order}`);
            }
        }
    },
};

