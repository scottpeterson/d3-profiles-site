// Public settings for the School Report Cards site. The anon key is safe in
// a public page: it identifies the project, and the database access rules
// decide what each signed-in account may read.
window.PROFILES_CONFIG = {
  supabaseUrl: "SET_SUPABASE_URL",
  supabaseAnonKey: "SET_SUPABASE_ANON_KEY",
  // The Stripe Payment Link for School Report Cards (test mode until launch).
  buyUrl: "SET_STRIPE_PAYMENT_LINK_URL",
};
