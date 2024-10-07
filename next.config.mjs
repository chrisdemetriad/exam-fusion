/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@tabler/icons-react"],
	images: {
		domains: ["avatars.githubusercontent.com"],
	},
};

export default nextConfig;
