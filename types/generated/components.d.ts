import type { Schema, Struct } from '@strapi/strapi';

export interface TablesProjectItem extends Struct.ComponentSchema {
  collectionName: 'components_tables_project_items';
  info: {
    description: 'Individual project entry for the summary table';
    displayName: 'Project Item';
    icon: 'list';
  };
  attributes: {
    category: Schema.Attribute.String & Schema.Attribute.Required;
    client: Schema.Attribute.String & Schema.Attribute.Required;
    location: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'tables.project-item': TablesProjectItem;
    }
  }
}
