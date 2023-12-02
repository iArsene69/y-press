/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "edtdkxiftcyowinrvzqv.supabase.co"
            },
            {
                hostname: "github.com"
            }
        ]
    }
}

module.exports = nextConfig
