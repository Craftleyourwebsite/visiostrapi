export const CATEGORIES_SEED = [
    { group: 'Core Architecture', name: 'Commercial & Mixed-Use' },
    { group: 'Core Architecture', name: 'Office Buildings & Corporate HQ' },
    { group: 'Core Architecture', name: 'Retail & Flagship Stores' },
    { group: 'Core Architecture', name: 'Hospitality & Tourism Resorts' },
    { group: 'Core Architecture', name: 'Residential Villas' },
    { group: 'Core Architecture', name: 'Residential Apartments' },
    { group: 'Core Architecture', name: 'Penthouses' },
    { group: 'Core Architecture', name: 'Gated Communities' },
    { group: 'Core Architecture', name: 'Townhouses' },
    { group: 'Core Architecture', name: 'Public Buildings & Civic Architecture' },
    { group: 'Core Architecture', name: 'Cultural & Museum Projects' },
    { group: 'Core Architecture', name: 'Education & Training Facilities' },
    { group: 'Core Architecture', name: 'Healthcare Facilities' },
    { group: 'Core Architecture', name: 'Sports & Leisure Facilities' },
    { group: 'Infrastructure & Transport', name: 'Airport & Aviation Facilities' },
    { group: 'Infrastructure & Transport', name: 'Urban Terminals & Mobility Hubs' },
    { group: 'Infrastructure & Transport', name: 'Transport-Oriented Development' },
    { group: 'Infrastructure & Transport', name: 'Stations & Interchanges' },
    { group: 'Infrastructure & Transport', name: 'Port / Waterfront Developments' },
    { group: 'Industrial & Logistics', name: 'Industrial Facilities & Warehousing' },
    { group: 'Industrial & Logistics', name: 'Logistics Parks & Distribution Hubs' },
    { group: 'Industrial & Logistics', name: 'Waste & Environmental Infrastructure' },
    { group: 'Industrial & Logistics', name: 'Utilities & Technical Buildings' },
    { group: 'Urban Planning & Territorial Development', name: 'City Regeneration & Urban Renewal' },
    { group: 'Urban Planning & Territorial Development', name: 'Master Planning & New Towns' },
    { group: 'Urban Planning & Territorial Development', name: 'Smart City / Mixed-Use Districts' },
    { group: 'Urban Planning & Territorial Development', name: 'Brownfield Regeneration & Post-Industrial Sites' },
    { group: 'Urban Planning & Territorial Development', name: 'Public Realm & Placemaking' },
    { group: 'Urban Planning & Territorial Development', name: 'Affordable / Mass Housing Planning' },
    { group: 'Heritage & Adaptive Reuse', name: 'Heritage Conservation' },
    { group: 'Heritage & Adaptive Reuse', name: 'Adaptive Reuse & Conversions' },
    { group: 'Heritage & Adaptive Reuse', name: 'Façade Upgrades & Building Refurbishments' },
    { group: 'Heritage & Adaptive Reuse', name: 'UNESCO Context / Heritage Impact Projects' },
    { group: 'Interior Architecture', name: 'Corporate Interiors' },
    { group: 'Interior Architecture', name: 'Retail Interiors' },
    { group: 'Interior Architecture', name: 'Residential Interiors' },
    { group: 'Interior Architecture', name: 'Hospitality Interiors' },
    { group: 'Interior Architecture', name: 'Workspace Fit-Out & Refurbishment' },
    { group: 'Landscape & Environment', name: 'Landscape Architecture' },
    { group: 'Landscape & Environment', name: 'Parks, Green Corridors & Waterfront Landscapes' },
    { group: 'Landscape & Environment', name: 'Sustainable / Climate-Resilient Design' },
    { group: 'Specialist / Strategic Work', name: 'Feasibility Studies & Development Strategy' },
    { group: 'Specialist / Strategic Work', name: 'Concept Visioning & Investment Pitch Packages' },
    { group: 'Specialist / Strategic Work', name: 'Design Competitions & Prototypes' },
];

export async function seedCategories(strapi) {
    strapi.log.info('🌱 Seeding categories...');
    for (const cat of CATEGORIES_SEED) {
        const existing = await strapi.db.query('api::category.category').findOne({
            where: { name: cat.name },
        });

        if (!existing) {
            await strapi.db.query('api::category.category').create({
                data: {
                    name: cat.name,
                    group: cat.group,
                    publishedAt: new Date(), // Important for Strapi to show it as published
                },
            });
            strapi.log.info(`✅ Created category: ${cat.name} (${cat.group})`);
        } else {
            // Update group if it changed
            if (existing.group !== cat.group) {
                await strapi.db.query('api::category.category').update({
                    where: { id: existing.id },
                    data: { group: cat.group }
                });
                strapi.log.info(`🔄 Updated group for: ${cat.name}`);
            }
        }
    }
    strapi.log.info('🌱 Category seeding finished.');

    // CLEANUP: Remove old categories that are not in the new list
    strapi.log.info('🧹 Cleaning up legacy categories...');
    const allExisting = await strapi.db.query('api::category.category').findMany();
    const seedNames = CATEGORIES_SEED.map(c => c.name.trim().toLowerCase());

    for (const existing of allExisting) {
        if (!seedNames.includes(existing.name.trim().toLowerCase())) {
            await strapi.db.query('api::category.category').delete({ where: { id: existing.id } });
            strapi.log.info(`🗑️ Deleted legacy category: ${existing.name}`);
        }
    }
}
