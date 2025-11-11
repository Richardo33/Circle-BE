import fs from "fs";
import path from "path";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

function loadSwaggerSpec() {
  const candidates = [
    path.resolve(process.cwd(), "swagger.yaml"),
    path.resolve(__dirname, "../../swagger.yaml"),
    path.resolve(__dirname, "../swagger.yaml"),
    path.resolve(__dirname, "../../../src/swagger.yaml"),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        return YAML.load(p);
      } catch (e) {
        console.warn(`⚠️  Gagal parse swagger.yaml di: ${p}`, e);
      }
    }
  }
  return null;
}

export function setupSwagger(app: Express) {
  const spec = loadSwaggerSpec();
  if (!spec) {
    console.warn("⚠️  swagger.yaml tidak ditemukan. Lewatkan endpoint /docs.");
    return;
  }
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
  console.log("✅ Swagger UI aktif di: /docs");
}
