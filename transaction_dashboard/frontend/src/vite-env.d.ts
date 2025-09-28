/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_VERSION: string
  readonly VITE_API_PREFIX: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_ENV: string
  readonly VITE_ENABLE_REAL_TIME: string
  readonly VITE_ENABLE_EXPORTS: string
  readonly VITE_ENABLE_DEBUG_MODE: string
  readonly VITE_CHART_ANIMATION_DURATION: string
  readonly VITE_DEFAULT_PAGE_SIZE: string
  readonly VITE_SHOW_DEV_TOOLS: string
  readonly VITE_LOG_LEVEL: string
  // Variables nativas de Vite
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}