const env = require('dotenv').config({ path: `./.env` }).parsed;

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tab: envColor('AUCTION_COLOR_TAB'),
        button: envColor('AUCTION_COLOR_BUTTON'),
        highlight: envColor('AUCTION_COLOR_HIGHLIGHT'),
        success: envColor('AUCTION_COLOR_SUCCESS'),
        error: envColor('AUCTION_COLOR_ERROR'),
        paragraph: envColor('AUCTION_COLOR_PARAGRAPH'),
        title: envColor('AUCTION_COLOR_TITLE'),
        text: envColor('AUCTION_COLOR_TEXT'),
        caption: envColor('AUCTION_COLOR_CAPTION'),
        outline: envColor('AUCTION_COLOR_OUTLINE'),
        skeleton: envColor('AUCTION_COLOR_SKELETON'),
        bid: envColor('AUCTION_COLOR_BID'),
        input: envColor('AUCTION_COLOR_INPUT'),
        placeholder: envColor('AUCTION_COLOR_PLACEHOLDER'),
        'search-token': envColor('AUCTION_COLOR_SEARCH_TOKEN'),
      },
      backgroundColor: {
        color: envColor('AUCTION_BACKGROUND_COLOR'),
        shield: envColor('AUCTION_BACKGROUND_COVER')
      },
      backgroundImage: {
        image: useEnv('AUCTION_BACKGROUND_IMAGE'),
        space: useEnv('AUCTION_COLOR_GRADIENT')
      },
      backdropBlur: {
        cover: useEnv('AUCTION_BACKGROUND_BLUR')
      },
      fontSize: {
        title: ['1.25rem', {
          lineHeight: '1em',
          letterSpacing: '.2em',
          fontWeight: '700',
          fontFamily: ['Poppins', 'sans-serif'],
          fontcolor: envColor('AUCTION_COLOR_TITLE'),
        }],
      },
      borderRadius: {
        none: 0,
        sm: '.625rem',     // 10px
        DEFAULT: '.75rem', // 12px
        md: '.9375rem',    // 15px
        lg: '1.25rem',     // 20px
        large: '1.5rem'    // 24px
      },
      dropShadow: {
        navbar: `0px 4px 15px ${envColor('AUCTION_COLOR_SHADOW_NAVBAR')}`,
        tab: `0px 2px 10px ${envColor('AUCTION_COLOR_SHADOW_TAB')}`,
        sm: `0px 4px 10px ${envColor('AUCTION_COLOR_SHADOW_SMALLER')}`,
        md: `0px 4px 20px ${envColor('AUCTION_COLOR_SHADOW_SMALL')}`,
        DEFAULT: `0px 4px 20px ${envColor('AUCTION_COLOR_SHADOW_MEDIUM')}`,
        lg: `0px 4px 30px ${envColor('AUCTION_COLOR_SHADOW_LARGE')}`,
      }
    },
  },
  plugins: [],
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: result[4] ? parseInt(result[4], 16) : null
  };
}

function colorParse(color) {
  return ({ opacity }) => {
    if(color.startsWith('rgba'))
      return color;
    else if(color.startsWith('rgb'))
      return color.replaceAll('rgb', 'rgba')
          .replaceAll(')', `,${opacity ? opacity : 1})`)
    else if(color.startsWith('#')) {
      color = hexToRgb(color);
      return `rgba(${color.r},${color.g},${color.b},${color.a ? color.a/100 : opacity ? opacity : 1})`;
    }
    return 'transparent';
  };
}

function envColor(name) {
    return colorParse(useEnv(name));
}

function useEnv(name) {
  if(process.env[name])
    return process.env[name];
  if(env[name])
    return env[name];
  throw new Error(`Environment variable ${name} is not defined.`);
}
