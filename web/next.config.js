const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig = {
  productionBrowserSourceMaps: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/apps',
        permanent: false,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: {
          // 指定 Worker 文件的输出路径，例如 /static/worker/[hash].worker.js
          filename: 'static/worker/[hash].worker.js',
          // 指定 Worker 文件的公共路径，用于引入 Worker 文件
          publicPath: '/_next/',
        },
      })
    }

    return config
  },
}

module.exports = withMDX(nextConfig)
