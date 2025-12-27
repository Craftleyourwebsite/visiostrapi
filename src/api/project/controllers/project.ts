/**
 * project controller
 * 
 * Handles API requests for the Project collection.
 * Extended from default Strapi controller to allow custom actions if needed.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::project.project');
