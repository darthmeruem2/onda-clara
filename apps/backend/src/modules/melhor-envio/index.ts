import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import MelhorEnvioProviderService from "./service"

export default ModuleProvider(Modules.FULFILLMENT, { services: [MelhorEnvioProviderService] })
