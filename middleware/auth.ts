
export default defineNuxtRouteMiddleware(async (to) => {
  await useSupabaseUser().value?.getSession?.()

  const user = useSupabaseUser()
  if (to.meta.authRequired && !user.value) {
    return navigateTo('/login')
  }
})