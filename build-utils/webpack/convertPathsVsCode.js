function convertPathsVsCode(configVsCode, createPathWebpack) {
  const { paths } = configVsCode.compilerOptions

  const aliasAndPathExtensions = Object.entries(paths)

  return aliasAndPathExtensions.reduce(
    (webpackAlias, aliasAndPathExtension) => {
      const [aliasVsCode, [pathExtensionVsCode]] = aliasAndPathExtension
      const alias = aliasVsCode.slice(0, -2)
      const pathExtension = pathExtensionVsCode.slice(0, -2)

      return {
        ...webpackAlias,
        [alias]: createPathWebpack(pathExtension),
      }
    },
    {}
  )
}

module.exports = convertPathsVsCode
