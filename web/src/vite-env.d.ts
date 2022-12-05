/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly AUCTION_STYLE_BACKGROUND_COLOR: string;
  readonly AUCTION_STYLE_BACKGROUND_IMAGE: string;
  readonly AUCTION_STYLE_BACKGROUND_COVER: string;
  readonly AUCTION_STYLE_BACKGROUND_BLUR: string;

  readonly AUCTION_GENERAL_TITLE: string;
  readonly AUCTION_GENERAL_FAVICON: string;
  readonly AUCTION_GENERAL_LANGUAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly envPrefix: 'AUCTION_';
}