
/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/database"], 

    
    webpack: (config, { isServer }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@/components': require('path').join(__dirname, 'components/'),
            '@/lib': require('path').join(__dirname, 'lib/'),
            '@': require('path').join(__dirname, './'),
        };
        return config;
    },
};

module.exports = nextConfig;