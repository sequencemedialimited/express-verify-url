const {
  env: {
    NODE_ENV = 'development'
  }
} = process

function env () {
  return (
    NODE_ENV === 'production'
  )
}

const presets = [
  [
    '@babel/env', {
      targets: {
        node: 'current'
      },
      useBuiltIns: 'usage',
      corejs: 3
    }
  ]
]

const plugins = [
  [
    'module-resolver',
    {
      root: ['./src'],
      cwd: 'babelrc',
      alias: {
        '#src': './src/index.cjs',
        '#status': './src/status.cjs'
      }
    }
  ],
  [
    'minify-dead-code-elimination',
    {
      optimizeRawSize: true
    }
  ]
]

module.exports = (api) => {
  if (api) api.cache.using(env)

  return {
    presets,
    plugins
  }
}
