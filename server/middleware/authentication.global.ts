import { getServerSession } from '#auth'
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  // if (!session) {
  //   throw createError({
  //     statusMessage: 'Unauthenticated',
  //     statusCode: 403
  //   })
  // }
  const loggedUserName = session?.user?.name; // Replace this with the actual logged in user name
  // Middleware 1
  // prisma.$use(async (params, next) => {
  //   const before = Date.now()

  //   const result = await next(params)

  //   const after = Date.now()

  //   console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)

  //   return result
  // })
  prisma.$use(async (params, next) => {
    const models = ['Building', 'User', 'Apartment', 'Payment', 'Ad', 'Order', 'Claim', 'AppFile'];
    if (models.includes(params.model as string)) {
      if (params.action === 'create') {
        params.args.data.createdBy = loggedUserName;
      }
      if (params.action === 'update') {
        params.args.data.updatedBy = loggedUserName;
      }
    }

    return next(params)
  })

})