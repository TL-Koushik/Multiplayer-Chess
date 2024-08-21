const conf = {
	URL: String(import.meta.env.VITE_APPWRITE_URL),
	projectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
	projectName: String(import.meta.env.VITE_APPWRITE_PROJECT_NAME),
	collectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
	bucketId: String(import.meta.env.VITE_APP_BUCKET_ID),
	databaseId: String(import.meta.env.VITE_APP_DATABASE_ID),
	API_URL: String(import.meta.env.VITE_APP_WEBSOCKET_URL),
};
export default conf;
