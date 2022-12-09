/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly AUCTION_BACKGROUND_COLOR: string;
  readonly AUCTION_BACKGROUND_IMAGE: string;
  readonly AUCTION_BACKGROUND_COVER: string;
  readonly AUCTION_BACKGROUND_BLUR: string;

  readonly AUCTION_GENERAL_TITLE: string;
  readonly AUCTION_GENERAL_FAVICON: string;
  readonly AUCTION_GENERAL_LANGUAGE: string;

  readonly AUCTION_COLOR_GRADIENT: string;
  readonly AUCTION_COLOR_BUTTON_GRADIENT: string;
  readonly AUCTION_COLOR_TAB: string;
  readonly AUCTION_COLOR_BUTTON: string;
  readonly AUCTION_COLOR_HIGHLIGHT: string;
  readonly AUCTION_COLOR_SUCCESS: string;
  readonly AUCTION_COLOR_ERROR: string;
  readonly AUCTION_COLOR_PARAGRAPH: string;
  readonly AUCTION_COLOR_TITLE: string;
  readonly AUCTION_COLOR_TEXT: string;
  readonly AUCTION_COLOR_CAPTION: string;
  readonly AUCTION_COLOR_OUTLINE: string;
  readonly AUCTION_COLOR_SKELETON: string;
  readonly AUCTION_COLOR_BID: string;
  readonly AUCTION_COLOR_INPUT: string;
  readonly AUCTION_COLOR_PLACEHOLDER: string;
  readonly AUCTION_COLOR_SEARCH_TOKEN: string;
  readonly AUCTION_COLOR_SHADOW_NAVBAR: string;
  readonly AUCTION_COLOR_SHADOW_TAB: string;
  readonly AUCTION_COLOR_SHADOW_SMALLER: string;
  readonly AUCTION_COLOR_SHADOW_SMALL: string;
  readonly AUCTION_COLOR_SHADOW_MEDIUM: string;
  readonly AUCTION_COLOR_SHADOW_LARGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly envPrefix: 'AUCTION_';
}