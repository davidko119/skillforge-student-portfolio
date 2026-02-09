import { ID, Models, Query } from 'appwrite';
import { databases, APPWRITE_DATABASE_ID, APPWRITE_USERS_COLLECTION_ID } from './appwriteClient';
import { User } from './types';

export async function getUserByEmail(email: string): Promise<Models.Document | null> {
  const res = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_USERS_COLLECTION_ID,
    [Query.equal('email', email)]
  );

  return res.documents[0] ?? null;
}

export async function upsertUser(user: User): Promise<Models.Document> {
  const existing = await getUserByEmail(user.email);

  const payload = {
    appUserId: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    role: user.role,
    skills: user.skills,
    certificates: user.certificates,
    projects: user.projects,
    education: user.education,
    experience: user.experience,
    languages: user.languages,
    savedOpportunityIds: user.savedOpportunityIds,
    socialLinks: user.socialLinks,
  };

  if (existing) {
    return await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      existing.$id,
      payload
    );
  }

  return await databases.createDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_USERS_COLLECTION_ID,
    ID.unique(),
    payload
  );
}

