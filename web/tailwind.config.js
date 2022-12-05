const env = require('dotenv').config({ path: `./.env` }).parsed;

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
      },
      backgroundColor: {
        color: envColor('AUCTION_STYLE_BACKGROUND_COLOR'),
        shield: envColor('AUCTION_STYLE_BACKGROUND_COVER')
      },
      backgroundImage: {
        image: useEnv('AUCTION_STYLE_BACKGROUND_IMAGE')
      },
      backdropBlur: {
        cover: useEnv('AUCTION_STYLE_BACKGROUND_BLUR')
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
