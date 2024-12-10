/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@tabler/icons-react"],
	images: {
		domains: ["avatars.githubusercontent.com"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh*.googleusercontent.com",
				port: "",
				pathname: "/**",
			},
		],
	},
	experimental: {
		optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
