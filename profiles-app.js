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

  let session = null;

  async function currentSession() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    session = data.session;
    return session;
  }

  // Opens the welcome dialog on the account's first visit. The dismissal is
  // stored in the auth user's metadata, so it shows once per account rather
  // than once per device.
  function showWelcome() {
    const dialog = document.getElementById("welcome");
    const meta = (session && session.user.user_metadata) || {};
    if (!dialog || meta.welcomed) return;
    const done = () => client.auth.updateUser({ data: { welcomed: true } });
    dialog.addEventListener("close", done, { once: true });
    document.getElementById("welcomeGo").addEventListener("click", () => dialog.close());
    dialog.showModal();
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
    if (!(await currentSession())) return leave("signin.html");
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

  window.PROFILES = { client, configured, currentSession, loadSchools, loadDetails, sendLink, showWelcome };
})();
