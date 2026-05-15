import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/lib/auth/auth';

const f = createUploadthing();

// FileRouter for your app
export const ourFileRouter = {
  // Profile image uploader
  profileImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error('Unauthorized');
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Profile upload complete for userId:', metadata.userId);
      console.log('File URL:', file.ufsUrl);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // Product images uploader (multiple)
  productImages: f({ image: { maxFileSize: '8MB', maxFileCount: 10 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user || session.user.role !== 'entrepreneur') {
        throw new Error('Unauthorized');
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Product image upload complete for userId:', metadata.userId);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // Service images uploader
  serviceImages: f({ image: { maxFileSize: '8MB', maxFileCount: 6 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user || session.user.role !== 'entrepreneur') {
        throw new Error('Unauthorized');
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Service image upload complete for userId:', metadata.userId);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // Cover image uploader
  coverImage: f({ image: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user || session.user.role !== 'entrepreneur') {
        throw new Error('Unauthorized');
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Cover image upload complete for userId:', metadata.userId);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
