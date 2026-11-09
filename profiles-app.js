// Sign-in and data loading for School Report Cards. app.html (built by
// generate_school_profiles.py --app) calls PROFILES.loadSchools() before it
// draws anything and PROFILES.loadDetails() when a profile opens.
(function () {
  const cfg = window.PROFILES_CONFIG;
  const configured = cfg && !cfg.supabaseUrl.startsWith("SET_");
  const client = configured
    ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)
    : null;

  // Stops the page script without drawing, after sending the visitor elsewhere.
  function leave(url) {
    location.replace(url);
    return new Promise(() => {});
  }

  async function currentSession() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data.session;
  }

  function showAccount(email) {
    const el = document.getElementById("account");
    if (el) el.textContent = "Signed in as " + email;
    const out = document.getElementById("signOut");
    if (out) {
      out.addEventListener("click", async () => {
        await client.auth.signOut();
        location.replace("signin.html?signedout=1");
      });
    }
  }

  async function loadSchools() {
    if (!client) return leave("signin.html?setup=1");
    const session = await currentSession();
    if (!session) return leave("signin.html");
    const { data, error } = await client.from("school_profiles").select("summary");
    if (error) return leave("signin.html?error=1");
    // The access rules return no rows to an account without a paid,
    // unexpired purchase.
    if (!data.length) return leave("signin.html?noaccess=1");
    showAccount(session.user.email);
    return data.map((row) => row.summary);
  }

  async function loadDetails(teams) {
    const missing = teams.filter((t) => !t.detail);
    if (!missing.length) return;
    const { data, error } = await client
      .from("school_profiles")
      .select("name, detail")
      .in("name", missing.map((t) => t.team));
    if (error) throw error;
    const byName = Object.fromEntries(data.map((row) => [row.name, row.detail]));
    for (const t of missing) {
      const detail = byName[t.team];
      if (!detail) continue;
      t.detail = detail;
      t.hero = detail.hero;
    }
  }

  async function sendLink(email, redirectTo) {
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
    });
    return error;
  }

  window.PROFILES = { client, configured, currentSession, loadSchools, loadDetails, sendLink };
})();
