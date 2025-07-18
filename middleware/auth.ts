export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // if (!user) {
  //   return navigateTo('/login')
  // }

  if (process.client) {
    const user = useSupabaseUser()
    if (to.meta.authRequired && !user.value) {
      return navigateTo('/login')
    }
  }
})