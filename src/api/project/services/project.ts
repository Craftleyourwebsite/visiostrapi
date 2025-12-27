/**
 * project service
 * 
 * Service layer for the Project collection.
 * Handles business logic for project-related operations.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::project.project');
