import Vue from 'vue';
import { createUploadLink } from 'apollo-upload-client';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

export const client = new ApolloClient({
	link: createUploadLink({ uri: 'http://localhost:4000' }),
	cache: new InMemoryCache(),
	ssrMode: true
});

export const upload = async (file) => {
	const mutation = gql`
		mutation($file: Upload!) {
			singleUpload(file: $file) {
				id
				url
				filename
				mimetype
				encoding
			}
		}
	`;
	return (await client.mutate({ mutation, variables: { file } })).data.singleUpload;
};

Vue.prototype.$fuc = client;

Vue.prototype.$upload = upload;
