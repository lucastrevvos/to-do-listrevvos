module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // outros plugins, se tiver…
      "react-native-reanimated/plugin", // <- TEM que ser o ÚLTIMO
    ],
  };
};
