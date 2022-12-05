const env = require('dotenv').config({ path: `./.env` }).parsed;

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
      return `rgba(${color.r},${color.g},${color.b},${color.a ? color.a : opacity ? opacity : 1})`;
    }
    return 'transparent';
  };
}

function envColor(name) {
  if(process.env[name])
    return colorParse(process.env[name]);
  if(env[name])
    return colorParse(env[name]);
  throw new Error(`Environment variable ${name} is not defined.`);
}

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: envColor('AUCTION_STYLE_COLORS_BACKGROUND')
      }
    },
  },
  plugins: [],
};
