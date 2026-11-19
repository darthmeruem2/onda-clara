import { defineConfig, loadEnv, Modules } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const redisUrl = process.env.REDIS_URL
const workerMode = process.env.MEDUSA_WORKER_MODE as "shared" | "server" | "worker" | undefined
const mercadoPagoMode = process.env.MERCADO_PAGO_MODE
const melhorEnvioMode = process.env.MELHOR_ENVIO_MODE
const fileOptions = {
  file_url: process.env.S3_FILE_URL,
  access_key_id: process.env.S3_ACCESS_KEY_ID,
  secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
  bucket: process.env.S3_BUCKET,
  endpoint: process.env.S3_ENDPOINT,
  acl: process.env.S3_DISABLE_ACL === "true" ? false : undefined,
  additional_client_config: { forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true" },
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl,
    workerMode,
    ...(process.env.DATABASE_SSL_CA ? {
      databaseDriverOptions: {
        connection: { ssl: { ca: process.env.DATABASE_SSL_CA.replace(/\\n/g, "\n"), rejectUnauthorized: true } },
      },
    } : {}),
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:8000,http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  admin: {
    disable: workerMode === "worker",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  modules: [
    ...(redisUrl ? [
      { resolve: "@medusajs/medusa/event-bus-redis", options: { redisUrl } },
      { resolve: "@medusajs/medusa/workflow-engine-redis", options: { redis: { redisUrl } } },
      {
        resolve: "@medusajs/medusa/caching",
        options: {
          providers: [{
            resolve: "@medusajs/medusa/caching-redis",
            id: "redis",
            is_default: true,
            options: { redisUrl: process.env.CACHE_REDIS_URL || redisUrl },
          }],
        },
      },
      {
        resolve: "@medusajs/medusa/locking",
        options: {
          providers: [{
            resolve: "@medusajs/medusa/locking-redis",
            id: "redis",
            is_default: true,
            options: { redisUrl: process.env.LOCKING_REDIS_URL || redisUrl },
          }],
        },
      },
    ] : []),
    ...(fileOptions.bucket ? [{
      resolve: "@medusajs/medusa/file",
      options: { providers: [{ resolve: "@medusajs/medusa/file-s3", id: "s3", options: fileOptions }] },
    }] : []),
    ...(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM ? [{
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [{
          resolve: "@medusajs/medusa/notification-local",
          id: "local",
          options: { channels: ["feed"] },
        }, {
          resolve: "@medusajs/medusa/notification-sendgrid",
          id: "sendgrid",
          options: {
            channels: ["email"],
            api_key: process.env.SENDGRID_API_KEY,
            from: process.env.SENDGRID_FROM,
          },
        }],
      },
    }] : []),
    ...(melhorEnvioMode === "sandbox" || melhorEnvioMode === "production" ? [{
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [{
          resolve: "@medusajs/medusa/fulfillment-manual",
          id: "manual",
        }, {
          resolve: "./src/modules/melhor-envio",
          id: "br",
          options: {
            mode: melhorEnvioMode,
            token: process.env.MELHOR_ENVIO_TOKEN,
            userAgent: process.env.MELHOR_ENVIO_USER_AGENT,
            services: process.env.MELHOR_ENVIO_SERVICES || "1,2",
          },
        }],
      },
    }] : []),
    ...(mercadoPagoMode === "test" || mercadoPagoMode === "production" ? [{
      resolve: "@medusajs/medusa/payment",
      key: Modules.PAYMENT,
      options: {
        providers: [{
          resolve: "./src/modules/mercado-pago",
          id: "br",
          options: {
            accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
            webhookSecret: process.env.MERCADO_PAGO_WEBHOOK_SECRET,
            storefrontUrl: process.env.MERCADO_PAGO_STOREFRONT_URL,
            sandbox: mercadoPagoMode === "test",
            installments: process.env.MERCADO_PAGO_MAX_INSTALLMENTS,
          },
        }],
      },
    }] : []),
  ],
})
