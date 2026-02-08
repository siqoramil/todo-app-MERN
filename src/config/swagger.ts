import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupSwagger = (app: Express): void => {
  const openapiPath = path.join(__dirname, '..', 'openapi.yaml');

  if (!fs.existsSync(openapiPath)) {
    console.warn('⚠️ OpenAPI spec not found at:', openapiPath);
    return;
  }

  const openapiFile = fs.readFileSync(openapiPath, 'utf8');
  const openapiSpec = YAML.parse(openapiFile) as swaggerUi.JsonObject;

  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Todo API Documentation',
    })
  );

  console.info('📚 Swagger UI available at /api/docs');
};
