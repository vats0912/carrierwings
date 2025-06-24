import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials:{
    url:'postgresql://neondb_owner:npg_JE0HbsxI2Bqo@ep-sweet-glade-a8e6egjh-pooler.eastus2.azure.neon.tech/AI%20mock%20interview%20db?sslmode=require'
  }
});
