import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
export const client = sanityClient({
	projectId: '2esdp4m3',
	dataset: 'production',
	apiVersion: '2022-09-29', // use current UTC date - see "specifying API version"!
	//false for development
	token: process.env.SANITY_TOKEN,
	//#TODO enable for production
	useCdn: true, // `false` if you want to ensure fresh data
});
const builder = imageUrlBuilder(client);
export const urlFor = (source: SanityImageSource) => {
	return builder.image(source);
};
