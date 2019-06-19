module.exports = {
  chainWebpack: config => {
    config.plugin("monaco").use(require("monaco-editor-webpack-plugin"));
  }
};
