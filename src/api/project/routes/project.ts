/**
 * project router
 * 
 * Defines API routes for the Project collection.
 * Routes: GET /api/projects, GET /api/projects/:id, POST, PUT, DELETE
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::project.project');
