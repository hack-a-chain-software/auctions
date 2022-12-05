/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly AUCTION_STYLE_COLORS_BACKGROUND: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly envPrefix: 'AUCTION_';
}