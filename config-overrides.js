const {
  override,
  fixBabelImports,
  addLessLoader,
  addBabelPlugin,
} = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true, // change importing css to less
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      // modifyVars: {
      //   "@text-color": "#263238",
      //   "@heading-color": "#263238",
      //   "@primary-color": "#0F5EF7",
      //   "@item-hover-bg": "#eceff1"
      // },
    },
  }),
  addBabelPlugin(["jsx-control-statements"])
);
