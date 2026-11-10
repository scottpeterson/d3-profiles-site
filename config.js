// Public settings for the School Report Cards site. The anon key is safe in
// a public page: it identifies the project, and the database access rules
// decide what each signed-in account may read.
window.PROFILES_CONFIG = {
  supabaseUrl: "https://mudjxkxsedftopjfyrtf.supabase.co",
  supabaseAnonKey: "sb_publishable_qmCR_y32gLpmVYqfUl0yqA_NDdOVNPR",
  // The live Stripe Payment Link for School Report Cards.
  buyUrl: "https://buy.stripe.com/5kQcN60et5js6ejexz9sk04",
};
