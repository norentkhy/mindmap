function convertPathsVsCode(configVsCode) {
  const { paths } = configVsCode.compilerOptions

  const aliasAndPathExtensions = Object.entries(paths)

  return aliasAndPathExtensions.reduce(
    (jestModuleMapper, aliasAndPathExtension) => {
      const [aliasVsCode, [pathExtensionVsCode]] = aliasAndPathExtension
      const alias = aliasVsCode.slice(0, -2)
      const pathExtension = pathExtensionVsCode.slice(2, -2)

      if (alias.includes('images')) return jestModuleMapper
      return {
        ...jestModuleMapper,
        [`^${alias}/(.*)$`]: `<rootDir>/${pathExtension}/$1`,
      }
    },
    {}
  )
}

module.exports = convertPathsVsCode
