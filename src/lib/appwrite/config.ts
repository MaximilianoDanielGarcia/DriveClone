export const appwriteConfig = {
    endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    proyectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
    userCollecionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION,
    filesCollecionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION,
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
    secretKey: process.env.NEXT_APPWRITE_SECRET_KEY
}