module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { targets: { node: 'current' } }],
    'babel-preset-expo',
  ],
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-private-methods'],
};
