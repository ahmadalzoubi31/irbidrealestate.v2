export default defineNuxtRouteMiddleware((to) => {
    const { status, signIn } = useAuth()

    // Return immediately if user is already authenticated
    // TODO: validate cookies and/or token here
    if (status.value === 'authenticated') {
        return
    }

    // /ads/676b279f0e085198d8751785/generate
    const pathArray = to.path.split('/')

    if (pathArray.some((path) => path === 'generate')) {
        return
    }

    if (to.path === '/auth/login') {
        return
    }

    return "/auth/login"
    /**
     * We cannot directly call and/or return `signIn` here as `signIn` uses async composables under the hood, leading to "nuxt instance undefined errors", see https://github.com/nuxt/framework/issues/5740#issuecomment-1229197529
     *
     * So to avoid calling it, we return it immediately.
     */
    // return signIn(undefined, { callbackUrl: to.path }) as ReturnType<typeof navigateTo>
})