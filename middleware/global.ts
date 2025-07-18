export default defineNuxtRouteMiddleware((to) => {
  const publicPaths = ['/', '/login']

  // `to.path` is the raw URL path; ensure it matches exactly
  const isPublic = publicPaths.includes(to.path)

  if (!isPublic && !useSupabaseUser().value) {
    return navigateTo('/login')
  }
})
