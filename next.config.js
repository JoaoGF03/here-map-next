/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.node = {
      ...config.node,
      global: false,
    }

    // Important: return the modified config
    return config
  },
}

module.exports = nextConfig
