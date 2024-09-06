/// <reference types="@rsbuild/core/types" />
interface ImportMetaEnv {
  readonly GLOB_APP_TITLE: string;
  readonly APP_BASE_API: string;
  readonly APP_HOMEPAGE: string;
  readonly APP_ENV: "development" | "production";
  readonly COZE_URL: string;
  AI_BASE_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
