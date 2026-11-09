// Public settings for the School Report Cards site. The anon key is safe in
// a public page: it identifies the project, and the database access rules
// decide what each signed-in account may read.
window.PROFILES_CONFIG = {
  supabaseUrl: "https://mudjxkxsedftopjfyrtf.supabase.co",
  supabaseAnonKey: "sb_publishable_qmCR_y32gLpmVYqfUl0yqA_NDdOVNPR",
  // The Stripe Payment Link for School Report Cards (test mode until launch).
  buyUrl: "https://buy.stripe.com/14AfZi1ix27g9qv7579sk03",
};
