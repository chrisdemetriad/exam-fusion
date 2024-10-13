/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@tabler/icons-react"],
	images: {
		domains: ["avatars.githubusercontent.com"],
	},
	experimental: {
		optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
	},
};

export default nextConfig;
