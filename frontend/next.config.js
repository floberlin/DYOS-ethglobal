/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'utils/styles')],
        implementation: 'sass', // Use Dart Sass,
        silenceDeprecations: ['legacy-js-api'], // its an issue with next js 15 and sass loader, needs an update
    },

    reactStrictMode: false,
    trailingSlash: false,
    images: {
        formats: ["image/avif", "image/webp"],
    },
    typescript: {
        ignoreBuildErrors: true
    },

    // async headers() {
    //     return [
    //         {
    //             source: '/(.*)',
    //             headers: [
    //                 {
    //                     key: 'Content-Security-Policy',
    //                     value: "default-src 'self'; script-src 'self' 'nonce-2726c7f26c'; connect-src 'self' https://auth.privy.io; img-src 'self'; style-src 'self';",
    //                 },
    //             ],
    //         },
    //     ];
    // },

};

module.exports = nextConfig;