import { upload } from '@vercel/blob/client';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default defineEventHandler(async (event) => {
  debugger
  const body = await readBody(event) as HandleUploadBody;
  const request = event.node.req;
  // try {
  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (
      pathname,
      /* clientPayload */
    ) => {
      // Generate a client token for the browser to upload the file
      // ⚠️ Authenticate and authorize users before generating the token.
      // Otherwise, you're allowing anonymous uploads.

      return {
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
        tokenPayload: JSON.stringify({
          // optional, sent to your server on upload completion
          // you could pass a user id from auth, or a value from clientPayload
        }),
      };
    },
    onUploadCompleted: async ({ blob, tokenPayload }) => {
      // Get notified of client upload completion
      // ⚠️ This will not work on `localhost` websites,
      // Use ngrok or similar to get the full upload flow

      console.log('blob upload completed', blob, tokenPayload);

      try {
        // Run any logic after the file upload completed
        // const { userId } = JSON.parse(tokenPayload);
        // await db.update({ avatar: blob.url, userId });
      } catch (error) {
        throw new Error('Could not update user');
      }
    },
  });

  return jsonResponse;
  // }
  // catch (error) {
  //   console.error('Error:', error);
  //   throw createError({
  //     statusCode: 500,
  //     message: 'Error uploading file'
  //   });
  // }
})

