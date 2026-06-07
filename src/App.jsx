<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>FitStud Coach</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; padding: 0; background: #0B0B0B; }
  * { box-sizing: border-box; }
  input:focus, textarea:focus, select:focus { border-color: #D4AF37 !important; }
  ::placeholder { color: #6A6A6A; }
</style>
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
<div id="root"></div>
<script type="text/babel" data-presets="react">
const { useState, useEffect } = React;

const SUPABASE_URL = "https://txddetoycdwoatruhojs.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4ZGRldG95Y2R3b2F0cnVob2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwOTIxNTAsImV4cCI6MjA5NTY2ODE1MH0.Od-MYlkLSPh8S7LYwzchgJig2r0iOzbPyNrMyDpIcMw";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
const AI_ENDPOINT = "/api/ai";

const C = {
  bg: "#0B0B0B", panel: "#141414", panel2: "#0F0F0F", card: "#1A1A1A",
  border: "#2A2A2A", borderSoft: "#202020", gold: "#D4AF37", goldSoft: "#D4AF371A",
  red: "#E53935", redSoft: "#E539351A", text: "#FFFFFF", muted: "#9A9A9A", faint: "#6A6A6A",
};
const FB = "'Inter', system-ui, sans-serif";
const FD = "'Bebas Neue', system-ui, sans-serif";
const disp = (e = {}) => ({ fontFamily: FD, letterSpacing: 0.8, textTransform: "uppercase", ...e });
const inputStyle = { width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 10, background: C.panel2, border: "1px solid " + C.border, color: C.text, fontSize: 14, fontFamily: FB, outline: "none" };
const btnGold = { background: C.gold, color: "#0B0B0B", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FB };
const btnRed = { background: C.red, color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FB };
const btnGhost = { background: C.card, color: C.text, border: "1px solid " + C.border, borderRadius: 10, padding: "9px 14px", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: FB };

async function aiGenerate(kind, brief) {
  if (!AI_ENDPOINT) throw new Error("AI is not connected yet.");
  const sys = kind === "workout"
    ? 'You are an elite strength coach. Return ONLY valid JSON, no prose: {"name":"","focus":"","days":[{"name":"Day 1","exercises":[{"name":"","sets":4,"reps":"8-10"}]}]}'
    : 'You are a nutrition coach. Return ONLY valid JSON, no prose: {"name":"","kcal":2200,"protein":180,"carbs":200,"fat":70,"meals":[{"name":"Breakfast","items":[""]}]}';
  const res = await fetch(AI_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: sys + "\n\nClient brief: " + brief }], max_tokens: 2500 }) });
  const data = await res.json();
  if (data.error) throw new Error(typeof data.error === "string" ? data.error : (data.error.message || "AI error"));
  const text = (data.content && data.content.map((b) => b.text || "").join("")) || data.text || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

function Logo({ size = 28 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: size, height: size, borderRadius: 9, background: "linear-gradient(135deg,#E9C75A,#C49A2A)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={disp({ color: "#0B0B0B", fontSize: size * 0.62, lineHeight: 1, letterSpacing: 0 })}>F</span>
      </div>
      <span style={disp({ fontSize: size * 0.56, color: C.text, letterSpacing: 1.5 })}>FIT<span style={{ color: C.gold }}>STUD</span></span>
    </div>
  );
}
function Stat({ label, value, accent }) {
  return (
    <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 16, padding: "16px 18px", flex: 1, minWidth: 150 }}>
      <div style={{ color: C.muted, fontSize: 13 }}>{label}</div>
      <div style={disp({ fontSize: 36, color: accent || C.text, marginTop: 8, lineHeight: 0.9 })}>{value}</div>
    </div>
  );
}
function Field({ label, children }) { return <div style={{ marginBottom: 12 }}><label style={{ color: C.muted, fontSize: 12.5, fontWeight: 600 }}>{label}</label>{children}</div>; }
function fmtDate(d) { if (!d) return "—"; try { return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); } catch (e) { return "—"; } }
function H1({ children }) { return <h1 style={disp({ fontSize: 32, color: C.text, margin: "0 0 4px" })}>{children}</h1>; }

function Login() {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function go() { setErr(""); setBusy(true);
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: pw });
    setBusy(false); if (error) setErr(error.message); }
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FB,
      backgroundImage: "radial-gradient(900px 500px at 80% -10%, rgba(212,175,55,0.10), transparent), radial-gradient(700px 400px at 0% 110%, rgba(229,57,53,0.08), transparent)" }}>
      <div style={{ width: 380, background: C.panel, border: "1px solid " + C.border, borderRadius: 22, padding: 34 }}>
        <Logo size={34} />
        <div style={{ color: C.gold, fontSize: 11, letterSpacing: 3, marginTop: 12, marginBottom: 22, fontWeight: 600 }}>COACH CONSOLE</div>
        <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@email.com" /></Field>
        <Field label="Password"><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} style={inputStyle} placeholder="••••••••" /></Field>
        {err && <div style={{ color: C.red, fontSize: 12.5, marginBottom: 10 }}>{err}</div>}
        <button onClick={go} disabled={busy} style={{ ...btnRed, width: "100%", padding: 14, marginTop: 8, ...disp({ letterSpacing: 1.5, fontSize: 18 }) }}>{busy ? "SIGNING IN..." : "LOG IN"}</button>
        <div style={{ color: C.faint, fontSize: 11.5, textAlign: "center", marginTop: 16 }}>Use the same email and password as your FitStud account</div>
      </div>
    </div>
  );
}

function readInvite() {
  try {
    const u = new URLSearchParams(window.location.search).get("invite");
    if (u) { localStorage.setItem("fitstud_invite", u); return u; }
    return localStorage.getItem("fitstud_invite") || "";
  } catch (e) { return ""; }
}
function clearInvite() { try { localStorage.removeItem("fitstud_invite"); } catch (e) {} }
function randCode() {
  const ch = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s = "";
  for (let i = 0; i < 8; i++) s += ch[Math.floor(Math.random() * ch.length)];
  return s;
}

function Signup({ code }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [done, setDone] = useState("");
  async function go() {
    setErr(""); setDone(""); setBusy(true);
    const { data, error } = await sb.auth.signUp({ email: email.trim(), password: pw });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    if (!data.session) setDone("Account created. Check your email to confirm, then open this same invite link again to finish setup.");
    // If a session is returned, the app will apply the invite and route you in automatically.
  }
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FB,
      backgroundImage: "radial-gradient(900px 500px at 80% -10%, rgba(212,175,55,0.10), transparent), radial-gradient(700px 400px at 0% 110%, rgba(229,57,53,0.08), transparent)" }}>
      <div style={{ width: 380, background: C.panel, border: "1px solid " + C.border, borderRadius: 22, padding: 34 }}>
        <Logo size={34} />
        <div style={{ color: C.gold, fontSize: 11, letterSpacing: 3, marginTop: 12, marginBottom: 14, fontWeight: 600 }}>JOIN AS A COACH</div>
        <div style={{ background: C.goldSoft, color: C.gold, borderRadius: 10, padding: "8px 12px", fontSize: 12.5, marginBottom: 18 }}>You have an invite to FitStud Coach. Create your account to get started.</div>
        <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@email.com" /></Field>
        <Field label="Password"><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} style={inputStyle} placeholder="Choose a password" /></Field>
        {err && <div style={{ color: C.red, fontSize: 12.5, marginBottom: 10 }}>{err}</div>}
        {done && <div style={{ color: C.gold, fontSize: 12.5, marginBottom: 10 }}>{done}</div>}
        <button onClick={go} disabled={busy} style={{ ...btnRed, width: "100%", padding: 14, marginTop: 8, ...disp({ letterSpacing: 1.5, fontSize: 18 }) }}>{busy ? "CREATING..." : "CREATE ACCOUNT"}</button>
        <div onClick={() => { clearInvite(); window.location.search = ""; }} style={{ color: C.faint, fontSize: 11.5, textAlign: "center", marginTop: 16, cursor: "pointer" }}>Already have an account? Log in</div>
      </div>
    </div>
  );
}

function WorkoutBuilder({ onSave, onCancel, busy, clients, presetClientId }) {
  const [name, setName] = useState(""); const [focus, setFocus] = useState("");
  const [days, setDays] = useState([{ name: "Day 1", exercises: [{ name: "", sets: 3, reps: "8-12" }] }]);
  const [brief, setBrief] = useState(""); const [aiErr, setAiErr] = useState(""); const [aiBusy, setAiBusy] = useState(false);
  const [forClient, setForClient] = useState(presetClientId || "");
  const setDay = (i, p) => setDays((ds) => ds.map((d, k) => k === i ? { ...d, ...p } : d));
  const setEx = (di, ei, p) => setDays((ds) => ds.map((d, k) => k === di ? { ...d, exercises: d.exercises.map((e, j) => j === ei ? { ...e, ...p } : e) } : d));
  const addDay = () => setDays((ds) => [...ds, { name: "Day " + (ds.length + 1), exercises: [{ name: "", sets: 3, reps: "8-12" }] }]);
  const addEx = (di) => setDays((ds) => ds.map((d, k) => k === di ? { ...d, exercises: [...d.exercises, { name: "", sets: 3, reps: "8-12" }] } : d));
  const rmEx = (di, ei) => setDays((ds) => ds.map((d, k) => k === di ? { ...d, exercises: d.exercises.filter((_, j) => j !== ei) } : d));
  const rmDay = (di) => setDays((ds) => ds.filter((_, k) => k !== di));
  async function runAI() { setAiErr(""); setAiBusy(true);
    try { const p = await aiGenerate("workout", brief); setName(p.name || ""); setFocus(p.focus || "");
      if (Array.isArray(p.days) && p.days.length) setDays(p.days.map((d) => ({ name: d.name || "Day", exercises: (d.exercises || []).map((e) => ({ name: e.name || "", sets: e.sets || 3, reps: e.reps || "" })) })));
    } catch (e) { setAiErr(e.message); } setAiBusy(false); }
  const sel = { ...inputStyle, cursor: "pointer" };
  return (
    <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, padding: 22 }}>
      <h2 style={disp({ fontSize: 22, color: C.text, margin: "0 0 6px" })}>NEW WORKOUT PROGRAM</h2>
      <Field label="Build for client (optional — auto-assigns on save)">
        <select value={forClient} onChange={(e) => setForClient(e.target.value)} style={sel}>
          <option value="">Just save to library (assign later)</option>
          {(clients || []).map((c) => <option key={c.id} value={c.id}>{c.full_name || c.email}</option>)}
        </select>
      </Field>
      <div style={{ background: C.panel2, border: "1px solid " + C.gold + "55", borderRadius: 12, padding: 16, margin: "8px 0 18px" }}>
        <div style={disp({ color: C.gold, fontSize: 17, marginBottom: 8 })}>✨ AI Workout Builder</div>
        <textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="e.g. 4-day upper/lower for intermediate lifter, goal hypertrophy" style={{ ...inputStyle, minHeight: 56, resize: "vertical" }} />
        {aiErr && <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>{aiErr}</div>}
        <button onClick={runAI} disabled={aiBusy} style={{ ...btnGold, marginTop: 10 }}>{aiBusy ? "Generating…" : "Generate plan"}</button>
      </div>
      <Field label="Program name"><input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Hypertrophy 5-Day Split" /></Field>
      <Field label="Focus"><input value={focus} onChange={(e) => setFocus(e.target.value)} style={inputStyle} placeholder="Muscle gain" /></Field>
      {days.map((d, di) => (
        <div key={di} style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <input value={d.name} onChange={(e) => setDay(di, { name: e.target.value })} style={{ ...inputStyle, marginTop: 0, fontWeight: 700, flex: 1 }} />
            <button onClick={() => rmDay(di)} style={{ ...btnGhost, color: C.red }}>Remove day</button>
          </div>
          {d.exercises.map((ex, ei) => (
            <div key={ei} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input value={ex.name} onChange={(e) => setEx(di, ei, { name: e.target.value })} placeholder="Exercise" style={{ ...inputStyle, marginTop: 0, flex: 2 }} />
              <input type="number" value={ex.sets} onChange={(e) => setEx(di, ei, { sets: e.target.value })} placeholder="Sets" style={{ ...inputStyle, marginTop: 0, width: 70 }} />
              <input value={ex.reps} onChange={(e) => setEx(di, ei, { reps: e.target.value })} placeholder="Reps" style={{ ...inputStyle, marginTop: 0, width: 90 }} />
              <button onClick={() => rmEx(di, ei)} style={{ ...btnGhost, padding: "9px 12px" }}>✕</button>
            </div>
          ))}
          <button onClick={() => addEx(di)} style={{ ...btnGhost, marginTop: 4 }}>+ Add exercise</button>
        </div>
      ))}
      <button onClick={addDay} style={{ ...btnGhost, marginBottom: 18 }}>+ Add day</button>
      <div style={{ display: "flex", gap: 10 }}>
        <button disabled={busy || !name} onClick={() => onSave({ name, focus, days_per_week: days.length, structure: days }, forClient || null)} style={{ ...btnGold, opacity: (busy || !name) ? 0.5 : 1 }}>{busy ? "Saving…" : (forClient ? "Save & assign" : "Save program")}</button>
        <button onClick={onCancel} style={btnGhost}>Cancel</button>
      </div>
    </div>
  );
}

function MealBuilder({ onSave, onCancel, busy, clients, nutrition, presetClientId }) {
  const [name, setName] = useState(""); const [m, setM] = useState({ kcal: 2200, protein: 180, carbs: 200, fat: 70 });
  const [meals, setMeals] = useState([{ name: "Breakfast", items: [""] }]);
  const [aiErr, setAiErr] = useState(""); const [aiBusy, setAiBusy] = useState(false);
  const [forClient, setForClient] = useState(presetClientId || "");
  const [goal, setGoal] = useState("Any"); const [diet, setDiet] = useState("Any");
  const [allergies, setAllergies] = useState(""); const [cals, setCals] = useState(""); const [perDay, setPerDay] = useState(4);
  const [notes, setNotes] = useState("");
  const setMeal = (i, p) => setMeals((ms) => ms.map((x, k) => k === i ? { ...x, ...p } : x));
  const setItem = (mi, ii, v) => setMeals((ms) => ms.map((x, k) => k === mi ? { ...x, items: x.items.map((it, j) => j === ii ? v : it) } : x));
  const addMeal = () => setMeals((ms) => [...ms, { name: "Meal " + (ms.length + 1), items: [""] }]);
  const addItem = (mi) => setMeals((ms) => ms.map((x, k) => k === mi ? { ...x, items: [...x.items, ""] } : x));
  const rmItem = (mi, ii) => setMeals((ms) => ms.map((x, k) => k === mi ? { ...x, items: x.items.filter((_, j) => j !== ii) } : x));
  const rmMeal = (mi) => setMeals((ms) => ms.filter((_, k) => k !== mi));

  async function runAI() { setAiErr(""); setAiBusy(true);
    try {
      let brief = "Create a meal plan with " + perDay + " meals per day" + (cals ? " at about " + cals + " kcal/day." : ".");
      if (nutrition) {
        const g = nutrition.goals.find((x) => x.name === goal);
        const d = nutrition.diets.find((x) => x.name === diet);
        if (g) brief += " Goal: " + g.name + " — " + g.desc + " Protein " + g.protein + ", carbs " + g.carbs + ", fat " + g.fat + ".";
        if (d) brief += " Diet: " + d.name + " — only use compatible foods. Avoid: " + d.avoid.join(", ") + ".";
        const dietKey = (diet !== "Any") ? diet.toLowerCase() : null;
        const foodsUse = nutrition.foods.filter((f) => !dietKey || (f.diets || []).indexOf(dietKey) >= 0);
        brief += " Build meals from these foods with their macros: " + foodsUse.map((f) => f.name + " (" + f.serving + ": " + f.kcal + "kcal " + f.p + "P/" + f.c + "C/" + f.f + "F)").join("; ") + ".";
        brief += " Rules: " + nutrition.rules.join(" ");
      }
      if (allergies) brief += " Strictly avoid these allergens/foods: " + allergies + ".";
      if (notes) brief += " Extra notes: " + notes + ".";
      brief += " Each item must include a portion size.";
      const p = await aiGenerate("meal", brief);
      setName(p.name || ""); setM({ kcal: p.kcal || 0, protein: p.protein || 0, carbs: p.carbs || 0, fat: p.fat || 0 });
      if (Array.isArray(p.meals) && p.meals.length) setMeals(p.meals.map((x) => ({ name: x.name || "Meal", items: x.items || [""] })));
    } catch (e) { setAiErr(e.message); } setAiBusy(false); }

  const sel = { ...inputStyle, cursor: "pointer" };
  const goalOpts = nutrition ? nutrition.goals.map((g) => g.name) : [];
  const dietOpts = nutrition ? nutrition.diets.map((d) => d.name) : [];
  return (
    <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, padding: 22 }}>
      <h2 style={disp({ fontSize: 22, color: C.text, margin: "0 0 6px" })}>NEW MEAL PLAN</h2>
      <Field label="Build for client (optional — auto-assigns on save)">
        <select value={forClient} onChange={(e) => setForClient(e.target.value)} style={sel}>
          <option value="">Just save to library (assign later)</option>
          {(clients || []).map((c) => <option key={c.id} value={c.id}>{c.full_name || c.email}</option>)}
        </select>
      </Field>

      <div style={{ background: C.panel2, border: "1px solid " + C.gold + "55", borderRadius: 12, padding: 16, margin: "8px 0 18px" }}>
        <div style={disp({ color: C.gold, fontSize: 17, marginBottom: 4 })}>✨ AI Meal Builder</div>
        <div style={{ color: C.faint, fontSize: 12, marginBottom: 12 }}>Set the client's needs — the AI builds it from your Nutrition Library.</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 150 }}><Field label="Goal"><select value={goal} onChange={(e) => setGoal(e.target.value)} style={sel}><option>Any</option>{goalOpts.map((g) => <option key={g}>{g}</option>)}</select></Field></div>
          <div style={{ flex: 1, minWidth: 150 }}><Field label="Diet type"><select value={diet} onChange={(e) => setDiet(e.target.value)} style={sel}><option>Any</option>{dietOpts.map((d) => <option key={d}>{d}</option>)}</select></Field></div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 110 }}><Field label="Daily calories"><input type="number" value={cals} onChange={(e) => setCals(e.target.value)} style={inputStyle} placeholder="2200" /></Field></div>
          <div style={{ flex: 1, minWidth: 110 }}><Field label="Meals per day"><input type="number" value={perDay} onChange={(e) => setPerDay(e.target.value)} style={inputStyle} /></Field></div>
        </div>
        <Field label="Allergies / foods to avoid"><input value={allergies} onChange={(e) => setAllergies(e.target.value)} style={inputStyle} placeholder="e.g. dairy, peanuts, shellfish" /></Field>
        <Field label="Extra notes (optional)"><input value={notes} onChange={(e) => setNotes(e.target.value)} style={inputStyle} placeholder="e.g. likes simple prep, no fish" /></Field>
        {!nutrition && <div style={{ color: C.red, fontSize: 11.5, marginBottom: 8 }}>Nutrition library not loaded — add nutrition.json and redeploy for library-grounded plans.</div>}
        {aiErr && <div style={{ color: C.muted, fontSize: 12, marginBottom: 8 }}>{aiErr}</div>}
        <button onClick={runAI} disabled={aiBusy} style={btnGold}>{aiBusy ? "Generating…" : "Generate plan"}</button>
      </div>

      <Field label="Plan name"><input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Lean Bulk 2800" /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        {["kcal", "protein", "carbs", "fat"].map((k) => (<div key={k} style={{ flex: 1 }}><Field label={k}><input type="number" value={m[k]} onChange={(e) => setM({ ...m, [k]: e.target.value })} style={inputStyle} /></Field></div>))}
      </div>
      {meals.map((meal, mi) => (
        <div key={mi} style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <input value={meal.name} onChange={(e) => setMeal(mi, { name: e.target.value })} style={{ ...inputStyle, marginTop: 0, fontWeight: 700, flex: 1 }} />
            <button onClick={() => rmMeal(mi)} style={{ ...btnGhost, color: C.red }}>Remove meal</button>
          </div>
          {meal.items.map((it, ii) => (
            <div key={ii} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input value={it} onChange={(e) => setItem(mi, ii, e.target.value)} placeholder="e.g. 200g chicken, 1 cup rice" style={{ ...inputStyle, marginTop: 0, flex: 1 }} />
              <button onClick={() => rmItem(mi, ii)} style={{ ...btnGhost, padding: "9px 12px" }}>✕</button>
            </div>
          ))}
          <button onClick={() => addItem(mi)} style={{ ...btnGhost, marginTop: 4 }}>+ Add item</button>
        </div>
      ))}
      <button onClick={addMeal} style={{ ...btnGhost, marginBottom: 18 }}>+ Add meal</button>
      <div style={{ display: "flex", gap: 10 }}>
        <button disabled={busy || !name} onClick={() => onSave({ name, kcal: +m.kcal, protein: +m.protein, carbs: +m.carbs, fat: +m.fat, structure: meals }, forClient || null)} style={{ ...btnGold, opacity: (busy || !name) ? 0.5 : 1 }}>{busy ? "Saving…" : (forClient ? "Save & assign" : "Save meal plan")}</button>
        <button onClick={onCancel} style={btnGhost}>Cancel</button>
      </div>
    </div>
  );
}

function AssignRow({ label, clients, onAssign }) {
  const [sel, setSel] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
      <select value={sel} onChange={(e) => setSel(e.target.value)} style={{ ...inputStyle, marginTop: 0, flex: 1 }}>
        <option value="">Assign {label} to a client…</option>
        {clients.map((c) => <option key={c.id} value={c.id}>{c.email}</option>)}
      </select>
      <button disabled={!sel} onClick={() => { onAssign(sel); setSel(""); }} style={{ ...btnGold, opacity: sel ? 1 : 0.5 }}>Assign</button>
    </div>
  );
}

function AddToClient({ clients, onPick, label }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={() => setOpen(!open)} style={btnGold}>{open ? "Close" : "+ Add to client"}</button>
      {open && (
        <div style={{ marginTop: 8, background: C.card, border: "1px solid " + C.border, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", color: C.faint, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid " + C.border }}>Send {label || "this"} to</div>
          {(clients || []).length === 0 && <div style={{ color: C.faint, padding: 14, fontSize: 13 }}>No clients yet.</div>}
          {(clients || []).map((c) => (
            <div key={c.id} onClick={() => { onPick(c.id); setOpen(false); }} style={{ padding: "11px 14px", borderBottom: "1px solid " + C.borderSoft, cursor: "pointer", color: C.text, fontSize: 14, fontWeight: 600 }}>{c.full_name || c.email}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Sidebar shell ----------------
function NavItem({ label, active, soon, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", textAlign: "left", padding: "9px 12px", marginBottom: 3, borderRadius: 9, border: "none", cursor: "pointer", background: active ? C.goldSoft : "transparent", color: active ? C.gold : C.muted, fontFamily: FB, fontSize: 14, fontWeight: active ? 700 : 600 }}>
      <span>{label}</span>{soon && <span style={{ fontSize: 9.5, color: C.faint, border: "1px solid " + C.border, borderRadius: 999, padding: "1px 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>soon</span>}
    </button>
  );
}
function SectionLabel({ children }) { return <div style={{ color: C.faint, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, padding: "14px 12px 6px" }}>{children}</div>; }

function AppShell({ profile, brandName, main, other, active, setActive, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, color: C.text, fontFamily: FB }}>
      <aside style={{ width: 238, background: C.panel2, borderRight: "1px solid " + C.border, padding: "18px 14px", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "0 6px 14px" }}><Logo size={26} /></div>
        <div style={{ padding: "10px 8px", background: C.card, border: "1px solid " + C.border, borderRadius: 11, marginBottom: 6 }}>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{brandName}</div>
          <div style={{ color: C.gold, fontSize: 10.5, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>{profile.role}</div>
        </div>
        <SectionLabel>Main</SectionLabel>
        {main.map((it) => <NavItem key={it.id} label={it.label} soon={it.soon} active={active === it.id} onClick={() => setActive(it.id)} />)}
        <SectionLabel>Other</SectionLabel>
        {other.map((it) => <NavItem key={it.id} label={it.label} soon={it.soon} active={active === it.id} onClick={() => setActive(it.id)} />)}
        <div style={{ flex: 1 }} />
        <div style={{ borderTop: "1px solid " + C.border, paddingTop: 12 }}>
          <div style={{ color: C.faint, fontSize: 11, marginBottom: 8, padding: "0 8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.email}</div>
          <button onClick={() => sb.auth.signOut()} style={{ ...btnGhost, width: "100%" }}>Log out</button>
        </div>
      </aside>
      <main style={{ flex: 1, minWidth: 0, padding: 28, overflowY: "auto", maxWidth: 1100 }}>{children}</main>
    </div>
  );
}

function SoonPage({ title, desc }) {
  return (
    <div>
      <H1>{title}</H1>
      <div style={{ background: C.panel, border: "1px dashed " + C.border, borderRadius: 16, padding: 40, textAlign: "center", marginTop: 18 }}>
        <div style={disp({ fontSize: 20, color: C.gold })}>Coming soon</div>
        <div style={{ color: C.muted, fontSize: 14, marginTop: 8, maxWidth: 460, margin: "8px auto 0" }}>{desc}</div>
      </div>
    </div>
  );
}

function SettingsPage({ profile, settings, onSaved }) {
  const [f, setF] = useState({ business_name: "", logo_url: "", primary_color: "#D4AF37", accent_color: "#E53935" });
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  useEffect(() => { if (settings) setF({ business_name: settings.business_name || "", logo_url: settings.logo_url || "", primary_color: settings.primary_color || "#D4AF37", accent_color: settings.accent_color || "#E53935" }); }, [settings]);
  const wl = settings && settings.plan === "whitelabel";
  async function save() { setBusy(true); setMsg("");
    const { error } = await sb.from("coaches").update(f).eq("id", profile.id);
    setBusy(false); if (error) { setMsg(error.message); return; } setMsg("Saved."); onSaved && onSaved(); }
  return (
    <div>
      <H1>Settings</H1>
      <p style={{ color: C.muted, marginTop: 0, fontSize: 14 }}>Your plan: <span style={{ color: C.gold, fontWeight: 700, textTransform: "uppercase" }}>{settings ? settings.plan : "free"}</span></p>
      <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, padding: 22, marginTop: 16, maxWidth: 560 }}>
        <h2 style={disp({ fontSize: 20, color: C.text, margin: "0 0 4px" })}>White-label branding</h2>
        <p style={{ color: C.faint, fontSize: 12.5, marginTop: 0, marginBottom: 16 }}>{wl ? "On the white-label plan, these brand the experience your clients see." : "Branding applies on the $70 white-label plan. You can set it up now and it activates when you upgrade."}</p>
        <Field label="Business name"><input value={f.business_name} onChange={(e) => setF({ ...f, business_name: e.target.value })} style={inputStyle} placeholder="Your Coaching Co." /></Field>
        <Field label="Logo URL"><input value={f.logo_url} onChange={(e) => setF({ ...f, logo_url: e.target.value })} style={inputStyle} placeholder="https://…/logo.png" /></Field>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><Field label="Primary color"><input value={f.primary_color} onChange={(e) => setF({ ...f, primary_color: e.target.value })} style={inputStyle} placeholder="#D4AF37" /></Field></div>
          <div style={{ flex: 1 }}><Field label="Accent color"><input value={f.accent_color} onChange={(e) => setF({ ...f, accent_color: e.target.value })} style={inputStyle} placeholder="#E53935" /></Field></div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
          <button onClick={save} disabled={busy} style={btnGold}>{busy ? "Saving…" : "Save branding"}</button>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 26, height: 26, borderRadius: 7, background: f.primary_color, border: "1px solid " + C.border }} />
            <span style={{ width: 26, height: 26, borderRadius: 7, background: f.accent_color, border: "1px solid " + C.border }} />
          </div>
          {msg && <span style={{ color: msg === "Saved." ? C.gold : C.red, fontSize: 13 }}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}

// ---------------- Nutrition library ----------------
function NutritionLibrary({ embedded }) {
  const [data, setData] = useState(null); const [err, setErr] = useState(""); const [tab, setTab] = useState("goals");
  const [foodQ, setFoodQ] = useState(""); const [foodCat, setFoodCat] = useState("All");
  useEffect(() => { (async () => {
    try { const res = await fetch("/nutrition.json"); if (!res.ok) throw new Error("Could not load nutrition.json"); setData(await res.json()); }
    catch (e) { setErr(e.message); }
  })(); }, []);
  if (err) return <div><H1>Nutrition Library</H1><div style={{ background: C.panel, border: "1px dashed " + C.border, borderRadius: 16, padding: 30, marginTop: 16, color: C.muted }}>The library file is not loaded yet. Add <span style={{ color: C.gold }}>nutrition.json</span> to your repo and redeploy, then refresh. ({err})</div></div>;
  if (!data) return <div><H1>Nutrition Library</H1><div style={{ color: C.muted, marginTop: 16 }}>Loading…</div></div>;

  const tabs = [["goals", "Goals"], ["diets", "Diet Types"], ["activity", "Activity"], ["foods", "Food Database"], ["swaps", "Food Swaps"], ["supplements", "Supplements"], ["conditions", "Conditions"], ["allergies", "Allergies"], ["rules", "AI Rules"]];
  const card = { background: C.panel, border: "1px solid " + C.border, borderRadius: 16, padding: 18, marginBottom: 12 };
  const chip = (active, on) => ({ background: active ? C.goldSoft : "transparent", color: active ? C.gold : C.muted, border: "1px solid " + (active ? C.gold + "55" : C.border), borderRadius: 999, padding: "6px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FB, whiteSpace: "nowrap" });
  const tag = (t) => <span key={t} style={{ fontSize: 10.5, color: C.gold, background: C.goldSoft, borderRadius: 6, padding: "2px 7px", marginRight: 5, textTransform: "capitalize" }}>{t}</span>;
  const pill = (t, i) => <span key={i} style={{ fontSize: 12, color: C.muted, background: C.card, border: "1px solid " + C.border, borderRadius: 7, padding: "3px 9px", marginRight: 6, marginBottom: 6, display: "inline-block" }}>{t}</span>;
  const cats = ["All", "Protein", "Carb", "Fruit", "Vegetable", "Fat"];
  const foods = data.foods.filter((f) => (foodCat === "All" || f.category === foodCat) && (!foodQ || f.name.toLowerCase().indexOf(foodQ.toLowerCase()) >= 0));

  return (
    <div>
      {!embedded && <H1>Nutrition Library</H1>}
      {!embedded && <p style={{ color: C.muted, marginTop: 0, fontSize: 14 }}>The built-in knowledge base your meal plans and AI generator draw from.</p>}
      <div style={{ display: "flex", gap: 8, margin: embedded ? "4px 0 16px" : "16px 0", overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map(([id, lbl]) => <button key={id} onClick={() => setTab(id)} style={chip(tab === id)}>{lbl}</button>)}
      </div>

      {tab === "goals" && data.goals.map((g) => (
        <div key={g.name} style={card}>
          <div style={disp({ fontSize: 21, color: C.gold })}>{g.name}</div>
          <div style={{ color: C.muted, fontSize: 13.5, margin: "4px 0 12px" }}>{g.desc}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Stat label="Calories" value={<span style={{ fontSize: 15, fontFamily: FB, fontWeight: 700 }}>{g.calories}</span>} />
            <Stat label="Protein" value={<span style={{ fontSize: 15, fontFamily: FB, fontWeight: 700 }}>{g.protein}</span>} />
            <Stat label="Carbs" value={<span style={{ fontSize: 15, fontFamily: FB, fontWeight: 700 }}>{g.carbs}</span>} />
            <Stat label="Fat" value={<span style={{ fontSize: 15, fontFamily: FB, fontWeight: 700 }}>{g.fat}</span>} />
          </div>
          <div style={{ color: C.faint, fontSize: 12.5, marginTop: 12 }}>Timing: <span style={{ color: C.muted }}>{g.timing}</span></div>
          <div style={{ marginTop: 8 }}>{g.bestFoods.map((x, i) => pill(x, i))}</div>
          <div style={{ color: C.faint, fontSize: 12.5, marginTop: 6 }}>Limit: {g.limit.join(", ")}</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 8, fontStyle: "italic" }}>{g.structure}</div>
        </div>
      ))}

      {tab === "diets" && data.diets.map((d) => (
        <div key={d.name} style={card}>
          <div style={disp({ fontSize: 21, color: C.gold })}>{d.name}</div>
          <div style={{ color: C.muted, fontSize: 13.5, margin: "4px 0 10px" }}>{d.desc}</div>
          <div style={{ color: C.faint, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Protein sources</div>
          <div style={{ marginTop: 4, marginBottom: 8 }}>{d.protein.map((x, i) => pill(x, i))}</div>
          <div style={{ color: C.faint, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Carb sources</div>
          <div style={{ marginTop: 4, marginBottom: 8 }}>{d.carbs.map((x, i) => pill(x, i))}</div>
          <div style={{ color: C.faint, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Fat sources</div>
          <div style={{ marginTop: 4, marginBottom: 10 }}>{d.fats.map((x, i) => pill(x, i))}</div>
          <div style={{ color: C.faint, fontSize: 12.5 }}>Avoid: {d.avoid.join(", ")}</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 8 }}><span style={{ color: C.gold }}>Example dinner:</span> {d.dinner.join(" · ")}</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}><span style={{ color: C.gold }}>Macros:</span> {d.macros}</div>
        </div>
      ))}

      {tab === "activity" && data.activity.map((a) => (
        <div key={a.name} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={disp({ fontSize: 20, color: C.gold })}>{a.name}</div>
            <span style={{ color: C.gold, fontWeight: 700, fontFamily: FB }}>{a.multiplier}</span>
          </div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>Training: {a.frequency} · Protein: {a.protein}</div>
          <div style={{ color: C.faint, fontSize: 12.5, marginTop: 4 }}>Hydration: {a.hydration}</div>
          <div style={{ color: C.faint, fontSize: 12.5, marginTop: 4 }}>Recovery: {a.recovery}</div>
        </div>
      ))}

      {tab === "foods" && (
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <input value={foodQ} onChange={(e) => setFoodQ(e.target.value)} placeholder="Search foods" style={{ ...inputStyle, maxWidth: 240, marginTop: 0 }} />
            {cats.map((c) => <button key={c} onClick={() => setFoodCat(c)} style={chip(foodCat === c)}>{c}</button>)}
          </div>
          <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.3fr repeat(5, 0.7fr)", padding: "10px 16px", color: C.faint, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid " + C.border }}>
              <span>Food</span><span>Serving</span><span>Kcal</span><span>P</span><span>C</span><span>F</span><span>Fiber</span>
            </div>
            {foods.length === 0 && <div style={{ color: C.faint, padding: 20, textAlign: "center" }}>No foods match.</div>}
            {foods.map((f) => (
              <div key={f.name} style={{ display: "grid", gridTemplateColumns: "2fr 1.3fr repeat(5, 0.7fr)", padding: "12px 16px", borderBottom: "1px solid " + C.borderSoft, fontSize: 13.5, alignItems: "center" }}>
                <span style={{ color: C.text, fontWeight: 600, fontSize: 14.5 }}>{f.name}</span>
                <span style={{ color: C.muted, fontSize: 12.5 }}>{f.serving}</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>{f.kcal}</span>
                <span style={{ color: C.muted }}>{f.p}g</span><span style={{ color: C.muted }}>{f.c}g</span><span style={{ color: C.muted }}>{f.f}g</span><span style={{ color: C.muted }}>{f.fiber}g</span>
              </div>
            ))}
          </div>
          <div style={{ color: C.faint, fontSize: 12, marginTop: 8 }}>{foods.length} foods shown.</div>
        </div>
      )}

      {tab === "swaps" && data.swaps.map((s) => (
        <div key={s.category} style={card}>
          <div style={disp({ fontSize: 18, color: C.gold, marginBottom: 8 })}>{s.category}</div>
          {s.items.map((it, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: i < s.items.length - 1 ? "1px solid " + C.borderSoft : "none" }}>
              <span style={{ color: C.text, fontWeight: 600, fontSize: 13.5 }}>{it.from}</span>
              <span style={{ color: C.faint, fontSize: 13 }}> → {it.to.join(", ")}</span>
            </div>
          ))}
        </div>
      ))}

      {tab === "supplements" && data.supplements.map((s) => (
        <div key={s.name} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={disp({ fontSize: 19, color: C.gold })}>{s.name}</div>
            <span style={{ color: C.muted, fontSize: 12.5 }}>{s.dose}</span>
          </div>
          <div style={{ color: C.muted, fontSize: 13.5, marginTop: 6 }}>{s.benefits}</div>
          <div style={{ color: C.faint, fontSize: 12.5, marginTop: 6 }}>Timing: {s.timing} · Best for: {s.goals}</div>
        </div>
      ))}

      {tab === "conditions" && data.conditions.map((c) => (
        <div key={c.name} style={card}>
          <div style={disp({ fontSize: 19, color: C.gold })}>{c.name}</div>
          <div style={{ color: C.muted, fontSize: 13.5, margin: "4px 0 8px" }}>{c.goals}</div>
          <div style={{ color: C.faint, fontSize: 12.5 }}>Encouraged: <span style={{ color: C.muted }}>{c.encouraged.join(", ")}</span></div>
          <div style={{ color: C.faint, fontSize: 12.5, marginTop: 4 }}>Limit: <span style={{ color: C.muted }}>{c.limited.join(", ")}</span></div>
          <div style={{ color: C.faint, fontSize: 12.5, marginTop: 4 }}>Macros: {c.macros}</div>
          <div style={{ color: C.red, fontSize: 12, marginTop: 8 }}>{c.note}</div>
        </div>
      ))}

      {tab === "allergies" && data.allergies.map((a) => (
        <div key={a.name} style={card}>
          <div style={disp({ fontSize: 19, color: C.gold })}>{a.name}</div>
          <div style={{ color: C.faint, fontSize: 12.5, marginTop: 6 }}>Avoid: <span style={{ color: C.muted }}>{a.avoid.join(", ")}</span></div>
          <div style={{ color: C.faint, fontSize: 12.5, marginTop: 4 }}>Safe: <span style={{ color: C.muted }}>{a.safe.join(", ")}</span></div>
          <div style={{ color: C.faint, fontSize: 12.5, marginTop: 4 }}>Swaps: <span style={{ color: C.muted }}>{a.subs.join(", ")}</span></div>
        </div>
      ))}

      {tab === "rules" && (
        <div style={card}>
          <div style={disp({ fontSize: 18, color: C.gold, marginBottom: 10 })}>Rules the AI follows</div>
          {data.rules.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: i < data.rules.length - 1 ? "1px solid " + C.borderSoft : "none" }}>
              <span style={{ color: C.gold, fontWeight: 700, fontFamily: FD }}>{i + 1}</span>
              <span style={{ color: C.muted, fontSize: 13.5 }}>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Exercise library ----------------
function ExerciseLibrary({ embedded }) {
  const [data, setData] = useState(null); const [err, setErr] = useState("");
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All"); const [sel, setSel] = useState(null);
  useEffect(() => { (async () => {
    try { const r = await fetch("/exercises.json"); if (!r.ok) throw new Error("Could not load exercises.json"); setData(await r.json()); }
    catch (e) { setErr(e.message); }
  })(); }, []);
  if (err) return <div><H1>Exercise Library</H1><div style={{ background: C.panel, border: "1px dashed " + C.border, borderRadius: 16, padding: 30, marginTop: 16, color: C.muted }}>Add <span style={{ color: C.gold }}>exercises.json</span> to your repo and redeploy, then refresh. ({err})</div></div>;
  if (!data) return <div><H1>Exercise Library</H1><div style={{ color: C.muted, marginTop: 16 }}>Loading…</div></div>;
  const diffColor = (d) => d === "Advanced" ? C.red : (d === "Beginner" ? C.gold : C.muted);
  const chip = (active) => ({ background: active ? C.goldSoft : "transparent", color: active ? C.gold : C.muted, border: "1px solid " + (active ? C.gold + "55" : C.border), borderRadius: 999, padding: "6px 13px", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: FB, whiteSpace: "nowrap" });

  if (sel) {
    const list2 = ["form", "tips", "mistakes"];
    const labels = { form: "Form", tips: "Coaching tips", mistakes: "Common mistakes" };
    return (
      <div>
        <button onClick={() => setSel(null)} style={{ ...btnGhost, marginBottom: 14 }}>← All exercises</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <H1>{sel.name}</H1>
          <span style={{ ...chip(false), color: C.gold, borderColor: C.gold + "55" }}>{sel.category}</span>
          <span style={{ ...chip(false), color: diffColor(sel.difficulty), borderColor: diffColor(sel.difficulty) + "55" }}>{sel.difficulty}</span>
        </div>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 0 }}>{sel.description}</p>
        <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ color: C.faint, fontSize: 12.5 }}>Primary: <span style={{ color: C.text }}>{sel.primary}</span></div>
          {sel.secondary && sel.secondary.length > 0 && <div style={{ color: C.faint, fontSize: 12.5, marginTop: 3 }}>Secondary: <span style={{ color: C.muted }}>{sel.secondary.join(", ")}</span></div>}
          <div style={{ color: C.faint, fontSize: 12.5, marginTop: 3 }}>Equipment: <span style={{ color: C.muted }}>{sel.equipment}</span></div>
          <a href={sel.video} target="_blank" rel="noreferrer" style={{ ...btnGold, textDecoration: "none", display: "inline-block", marginTop: 12 }}>▶ Watch demo</a>
        </div>
        {list2.map((k) => (
          <div key={k} style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={disp({ fontSize: 16, color: C.gold, marginBottom: 8 })}>{labels[k]}</div>
            {(sel[k] || []).map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "5px 0" }}>
                <span style={{ color: C.gold, fontFamily: FD, fontSize: k === "form" ? 14 : 12 }}>{k === "form" ? (i + 1) : "•"}</span>
                <span style={{ color: C.muted, fontSize: 13.5 }}>{it}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  const list = data.exercises.filter((e) => (cat === "All" || e.category === cat) && (!q || e.name.toLowerCase().indexOf(q.toLowerCase()) >= 0));
  return (
    <div>
      {!embedded && <H1>Exercise Library</H1>}
      {!embedded && <p style={{ color: C.muted, marginTop: 0, fontSize: 14 }}>{data.exercises.length} exercises with form, tips, and video. Tap any one for the full breakdown.</p>}
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exercises" style={{ ...inputStyle, maxWidth: 320, marginTop: 8 }} />
      <div style={{ display: "flex", gap: 8, margin: "12px 0", overflowX: "auto", paddingBottom: 4 }}>
        {["All"].concat(data.categories).map((c) => <button key={c} onClick={() => setCat(c)} style={chip(cat === c)}>{c}</button>)}
      </div>
      <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, overflow: "hidden" }}>
        {list.length === 0 && <div style={{ color: C.faint, padding: 22, textAlign: "center" }}>No exercises match.</div>}
        {list.map((e) => (
          <div key={e.name + e.category} onClick={() => setSel(e)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid " + C.borderSoft, cursor: "pointer", gap: 8 }}>
            <div>
              <div style={{ color: C.text, fontWeight: 600, fontSize: 15.5 }}>{e.name}</div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 3 }}>{e.primary} · {e.equipment}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11.5, color: diffColor(e.difficulty) }}>{e.difficulty}</span>
              <span style={{ color: C.muted }}>›</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ color: C.muted, fontSize: 12.5, marginTop: 8 }}>{list.length} shown.</div>
    </div>
  );
}

// ---------------- Coach app ----------------
function CoachApp({ profile }) {
  const [active, setActive] = useState("overview");
  const [builder, setBuilder] = useState(null);
  const [selClient, setSelClient] = useState(null);
  const [mealSub, setMealSub] = useState("plans");
  const [wkSub, setWkSub] = useState("programs");
  const [clients, setClients] = useState([]); const [programs, setPrograms] = useState([]);
  const [mealplans, setMealplans] = useState([]); const [assignments, setAssignments] = useState([]);
  const [settings, setSettings] = useState(null); const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); const [msg, setMsg] = useState("");
  const [nutrition, setNutrition] = useState(null);

  async function loadAll() {
    const me = profile.id;
    const [cl, pr, mp, asg, st] = await Promise.all([
      sb.from("profiles").select("id,email,created_at,full_name,meal_gen,workout_gen").eq("coach_id", me),
      sb.from("workout_programs").select("*").eq("coach_id", me).order("created_at", { ascending: false }),
      sb.from("meal_plans").select("*").eq("coach_id", me).order("created_at", { ascending: false }),
      sb.from("assignments").select("*").eq("coach_id", me),
      sb.from("coaches").select("*").eq("id", me).maybeSingle(),
    ]);
    setClients(cl.data || []); setPrograms(pr.data || []); setMealplans(mp.data || []);
    setAssignments(asg.data || []); setSettings(st.data); setLoading(false);
    try { const r = await fetch("/nutrition.json"); if (r.ok) setNutrition(await r.json()); } catch (e) {}
  }
  useEffect(() => { loadAll(); }, []);
  function flash(t) { setMsg(t); setTimeout(() => setMsg(""), 2500); }

  async function saveProgram(p, clientId) { setSaving(true);
    const { data, error } = await sb.from("workout_programs").insert({ coach_id: profile.id, name: p.name, focus: p.focus, days_per_week: p.days_per_week, structure: p.structure }).select("id").single();
    setSaving(false); if (error) { flash(error.message); return; } setBuilder(null);
    if (clientId) { await assign("workout", data.id, clientId); flash("Saved and assigned."); } else { flash("Program saved."); loadAll(); } }
  async function saveMeal(p, clientId) { setSaving(true);
    const { data, error } = await sb.from("meal_plans").insert({ coach_id: profile.id, name: p.name, kcal: p.kcal, protein: p.protein, carbs: p.carbs, fat: p.fat, structure: p.structure }).select("id").single();
    setSaving(false); if (error) { flash(error.message); return; } setBuilder(null);
    if (clientId) { await assign("meal", data.id, clientId); flash("Saved and assigned."); } else { flash("Meal plan saved."); loadAll(); } }
  async function assign(kind, refId, clientId) {
    await sb.from("assignments").delete().eq("client_id", clientId).eq("kind", kind);
    const row = { coach_id: profile.id, client_id: clientId, kind };
    if (kind === "workout") row.program_id = refId; else row.meal_plan_id = refId;
    const { error } = await sb.from("assignments").insert(row);
    if (error) { flash(error.message); return; } flash("Assigned."); loadAll();
  }
  async function setAccess(clientId, meal, workout) {
    const { data: r } = await sb.rpc("set_client_access", { p_client: clientId, p_meal: meal, p_workout: workout });
    if (r === "ok") { flash("Access updated"); loadAll(); } else { flash("Could not update access"); }
  }

  const main = [
    { id: "overview", label: "Overview" }, { id: "clients", label: "Clients" }, { id: "nutrition", label: "Nutrition Library" }, { id: "exercises", label: "Exercise Library" },
    { id: "messages", label: "Messages", soon: true }, { id: "scheduling", label: "Scheduling", soon: true },
    { id: "payments", label: "Payments", soon: true }, { id: "announcements", label: "Announcements", soon: true },
  ];
  const other = [{ id: "settings", label: "Settings" }];
  const brandName = (settings && settings.business_name) || "FitStud Coach";
  const plan = settings && settings.plan ? settings.plan : "free";

  function Overview() {
    return (
      <div>
        <H1>Overview</H1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 14 }}>Plan: <span style={{ color: C.gold, fontWeight: 700, textTransform: "uppercase" }}>{plan}</span></p>
        <div style={{ display: "flex", gap: 14, marginTop: 18, flexWrap: "wrap" }}>
          <Stat label="Active clients" value={clients.length} accent={C.gold} />
          <Stat label="Workout programs" value={programs.length} />
          <Stat label="Meal plans" value={mealplans.length} />
          <Stat label="Client limit" value={plan === "free" ? (settings ? settings.client_limit : 5) : "∞"} />
        </div>
        <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, padding: 20, marginTop: 18 }}>
          <div style={disp({ fontSize: 18, color: C.text, marginBottom: 6 })}>Quick start</div>
          <div style={{ color: C.muted, fontSize: 13.5 }}>Open a client to build right for them, or create a program or meal plan in the libraries. Use the ✨ AI button to draft one in seconds.</div>
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button onClick={() => { setActive("exercises"); setWkSub("programs"); setBuilder("workout"); }} style={btnGold}>✨ New program</button>
            <button onClick={() => { setActive("nutrition"); setMealSub("plans"); setBuilder("meal"); }} style={btnGhost}>✨ New meal plan</button>
            <button onClick={() => setActive("clients")} style={btnGhost}>View clients</button>
          </div>
        </div>
      </div>
    );
  }

  function Clients() {
    return (
      <div>
        <H1>Your Clients</H1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 14 }}>{clients.length}/{plan === "free" ? (settings ? settings.client_limit : 5) : "∞"} clients · tap a client to open their page</p>
        <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, overflow: "hidden", marginTop: 16 }}>
          {clients.length === 0 && <div style={{ color: C.muted, padding: 24, textAlign: "center", fontSize: 14 }}>No clients yet.</div>}
          {clients.map((c) => {
            const wp = assignments.find((a) => a.client_id === c.id && a.kind === "workout");
            const mp = assignments.find((a) => a.client_id === c.id && a.kind === "meal");
            const wpName = wp ? (programs.find((p) => p.id === wp.program_id) || {}).name : null;
            const mpName = mp ? (mealplans.find((p) => p.id === mp.meal_plan_id) || {}).name : null;
            return (
              <div key={c.id} onClick={() => setSelClient(c)} style={{ padding: "15px 18px", borderBottom: "1px solid " + C.borderSoft, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div>
                  <div style={{ color: C.text, fontWeight: 600, fontSize: 16 }}>{c.full_name || c.email}</div>
                  <div style={{ color: C.muted, fontSize: 13, marginTop: 3 }}>Program: <span style={{ color: wpName ? C.gold : C.muted }}>{wpName || "none"}</span> · Meal: <span style={{ color: mpName ? C.gold : C.muted }}>{mpName || "none"}</span></div>
                </div>
                <span style={{ color: C.muted, fontSize: 20 }}>›</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function ClientDetail({ client }) {
    const c = clients.find((x) => x.id === client.id) || client;
    const [gen, setGen] = useState(null);
    const tog = (on) => ({ fontSize: 12, fontWeight: 700, borderRadius: 999, padding: "5px 13px", cursor: "pointer", fontFamily: FB, border: "1px solid " + (on ? C.gold + "55" : C.border), background: on ? C.goldSoft : "transparent", color: on ? C.gold : C.muted });
    const wp = assignments.find((a) => a.client_id === c.id && a.kind === "workout");
    const mp = assignments.find((a) => a.client_id === c.id && a.kind === "meal");
    const wpName = wp ? (programs.find((p) => p.id === wp.program_id) || {}).name : null;
    const mpName = mp ? (mealplans.find((p) => p.id === mp.meal_plan_id) || {}).name : null;
    const joined = c.created_at ? new Date(c.created_at).toLocaleDateString() : "—";

    if (gen === "workout") return (<div><button onClick={() => setGen(null)} style={{ ...btnGhost, marginBottom: 14 }}>← Back to client</button><WorkoutBuilder busy={saving} clients={clients} presetClientId={c.id} onSave={async (p, cid) => { await saveProgram(p, cid); setGen(null); }} onCancel={() => setGen(null)} /></div>);
    if (gen === "meal") return (<div><button onClick={() => setGen(null)} style={{ ...btnGhost, marginBottom: 14 }}>← Back to client</button><MealBuilder busy={saving} clients={clients} nutrition={nutrition} presetClientId={c.id} onSave={async (p, cid) => { await saveMeal(p, cid); setGen(null); }} onCancel={() => setGen(null)} /></div>);

    const sectionTitle = (t) => <div style={disp({ fontSize: 17, color: C.text, margin: "0 0 10px" })}>{t}</div>;
    const cardS = { background: C.panel, border: "1px solid " + C.border, borderRadius: 16, padding: 20, marginBottom: 14 };
    return (
      <div>
        <button onClick={() => setSelClient(null)} style={{ ...btnGhost, marginBottom: 14 }}>← All clients</button>
        <H1>{c.full_name || c.email}</H1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 13.5 }}>{c.email}{c.phone ? " · " + c.phone : ""} · joined {joined}</p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
          <Stat label="Current program" value={<span style={{ fontSize: 15, fontFamily: FB, fontWeight: 700, color: wpName ? C.gold : C.muted }}>{wpName || "None"}</span>} />
          <Stat label="Current meal plan" value={<span style={{ fontSize: 15, fontFamily: FB, fontWeight: 700, color: mpName ? C.gold : C.muted }}>{mpName || "None"}</span>} />
        </div>

        <div style={cardS}>
          {sectionTitle("Build for this client")}
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>Generate a fresh plan with AI — it auto-assigns to {c.full_name || "this client"} when you save.</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => setGen("workout")} style={{ ...btnGold, ...disp({ fontSize: 15 }) }}>✨ Generate workout</button>
            <button onClick={() => setGen("meal")} style={{ ...btnGold, ...disp({ fontSize: 15 }) }}>✨ Generate meal plan</button>
          </div>
        </div>

        <div style={cardS}>
          {sectionTitle("Assign an existing program")}
          {programs.length === 0 ? <div style={{ color: C.muted, fontSize: 13 }}>No programs yet — generate one above.</div>
            : programs.map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid " + C.borderSoft }}>
                <span style={{ color: C.text, fontSize: 14 }}>{p.name}</span>
                <button onClick={() => assign("workout", p.id, c.id)} style={{ ...btnGhost, color: wp && wp.program_id === p.id ? C.gold : C.muted }}>{wp && wp.program_id === p.id ? "Assigned" : "Assign"}</button>
              </div>
            ))}
        </div>

        <div style={cardS}>
          {sectionTitle("Assign an existing meal plan")}
          {mealplans.length === 0 ? <div style={{ color: C.muted, fontSize: 13 }}>No meal plans yet — generate one above.</div>
            : mealplans.map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid " + C.borderSoft }}>
                <span style={{ color: C.text, fontSize: 14 }}>{p.name}</span>
                <button onClick={() => assign("meal", p.id, c.id)} style={{ ...btnGhost, color: mp && mp.meal_plan_id === p.id ? C.gold : C.muted }}>{mp && mp.meal_plan_id === p.id ? "Assigned" : "Assign"}</button>
              </div>
            ))}
        </div>

        <div style={cardS}>
          {sectionTitle("Self-generate access")}
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>Off means this client follows the plans you assign. On lets them generate their own in the client app.</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setAccess(c.id, !c.meal_gen, !!c.workout_gen)} style={tog(c.meal_gen)}>Meal AI {c.meal_gen ? "ON" : "OFF"}</button>
            <button onClick={() => setAccess(c.id, !!c.meal_gen, !c.workout_gen)} style={tog(c.workout_gen)}>Workout AI {c.workout_gen ? "ON" : "OFF"}</button>
          </div>
        </div>
      </div>
    );
  }

  function WorkoutLibrary() {
    if (builder === "workout") return <WorkoutBuilder busy={saving} clients={clients} onSave={saveProgram} onCancel={() => setBuilder(null)} />;
    const subChip = (a) => ({ background: a ? C.goldSoft : "transparent", color: a ? C.gold : C.muted, border: "1px solid " + (a ? C.gold + "55" : C.border), borderRadius: 999, padding: "6px 16px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: FB });
    return (
      <div>
        <H1>Exercise Library</H1>
        <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
          <button onClick={() => setWkSub("programs")} style={subChip(wkSub === "programs")}>My Programs</button>
          <button onClick={() => setWkSub("exercises")} style={subChip(wkSub === "exercises")}>Exercise Catalog</button>
        </div>
        {wkSub === "exercises" ? <ExerciseLibrary embedded /> : (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <button onClick={() => setBuilder("workout")} style={{ ...btnGold, ...disp({ fontSize: 15, letterSpacing: 0.5 }) }}>✨ AI Workout Builder</button>
              <button onClick={() => setBuilder("workout")} style={btnGhost}>+ Build manually</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {programs.length === 0 && <div style={{ color: C.muted, fontSize: 14 }}>No programs yet — build your first one above.</div>}
              {programs.map((p) => (
                <div key={p.id} style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 14, padding: 16 }}>
                  <div style={disp({ fontSize: 20, color: C.text })}>{p.name}</div>
                  <div style={{ color: C.muted, fontSize: 13.5, marginTop: 3 }}>{p.days_per_week} days/week · {p.focus || "—"} · {(p.structure || []).reduce((n, d) => n + (d.exercises ? d.exercises.length : 0), 0)} exercises</div>
                  <AddToClient clients={clients} label="program" onPick={(cid) => assign("workout", p.id, cid)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function MealLibrary() {
    if (builder === "meal") return <MealBuilder busy={saving} clients={clients} nutrition={nutrition} onSave={saveMeal} onCancel={() => setBuilder(null)} />;
    const subChip = (a) => ({ background: a ? C.goldSoft : "transparent", color: a ? C.gold : C.muted, border: "1px solid " + (a ? C.gold + "55" : C.border), borderRadius: 999, padding: "6px 16px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: FB });
    return (
      <div>
        <H1>Nutrition Library</H1>
        <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
          <button onClick={() => setMealSub("plans")} style={subChip(mealSub === "plans")}>My Meal Plans</button>
          <button onClick={() => setMealSub("reference")} style={subChip(mealSub === "reference")}>Reference</button>
        </div>
        {mealSub === "reference" ? <NutritionLibrary embedded /> : (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <button onClick={() => setBuilder("meal")} style={{ ...btnGold, ...disp({ fontSize: 15, letterSpacing: 0.5 }) }}>✨ AI Meal Builder</button>
              <button onClick={() => setBuilder("meal")} style={btnGhost}>+ Build manually</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mealplans.length === 0 && <div style={{ color: C.muted, fontSize: 14 }}>No meal plans yet — build your first one above.</div>}
              {mealplans.map((p) => (
                <div key={p.id} style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 14, padding: 16 }}>
                  <div style={disp({ fontSize: 20, color: C.text })}>{p.name}</div>
                  <div style={{ color: C.muted, fontSize: 13.5, marginTop: 3 }}>{p.kcal} kcal · {p.protein}P / {p.carbs}C / {p.fat}F · {(p.structure || []).length} meals</div>
                  <AddToClient clients={clients} label="meal plan" onPick={(cid) => assign("meal", p.id, cid)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  let page = null;
  if (loading) page = <div style={{ color: C.muted }}>Loading…</div>;
  else if (active === "overview") page = <Overview />;
  else if (active === "clients") page = selClient ? <ClientDetail client={selClient} /> : <Clients />;
  else if (active === "nutrition") page = <MealLibrary />;
  else if (active === "exercises") page = <WorkoutLibrary />;
  else if (active === "settings") page = <SettingsPage profile={profile} settings={settings} onSaved={loadAll} />;
  else if (active === "messages") page = <SoonPage title="Messages" desc="Real-time chat with your clients, one-to-one. Coming next." />;
  else if (active === "scheduling") page = <SoonPage title="Scheduling" desc="A calendar for sessions, availability, and bookings." />;
  else if (active === "payments") page = <SoonPage title="Payments" desc="Charge clients and run subscriptions through Stripe." />;
  else if (active === "announcements") page = <SoonPage title="Announcements" desc="Broadcast updates to your whole roster at once." />;

  return (
    <AppShell profile={profile} brandName={brandName} main={main} other={other} active={active} setActive={(id) => { setActive(id); setBuilder(null); setSelClient(null); }}>
      {msg && <div style={{ background: C.goldSoft, color: C.gold, borderRadius: 10, padding: "8px 12px", fontSize: 13, marginBottom: 16 }}>{msg}</div>}
      {page}
    </AppShell>
  );
}

// ---------------- Admin settings ----------------
function Card({ children, style }) { return <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, padding: 22, marginTop: 16, maxWidth: 640, ...(style || {}) }}>{children}</div>; }
function H2({ children }) { return <h2 style={disp({ fontSize: 20, color: C.text, margin: "0 0 4px" })}>{children}</h2>; }

function CoachPlanRow({ c, freeLimit, onSaved }) {
  const [plan, setPlan] = useState(c.plan || "free");
  const [limit, setLimit] = useState(c.client_limit != null ? c.client_limit : freeLimit);
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  function pick(v) { setPlan(v); setLimit(v === "free" ? freeLimit : 999999); }
  async function save() { setBusy(true); setMsg("");
    const { error } = await sb.from("coaches").upsert({ id: c.id, plan: plan, client_limit: Number(limit) });
    setBusy(false); if (error) { setMsg(error.message); return; } setMsg("Saved"); onSaved && onSaved(); }
  const sel = { ...inputStyle, width: "auto", marginTop: 0, padding: "8px 10px", cursor: "pointer" };
  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid " + C.borderSoft }}>
      <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{c.email}</div>
      <div style={{ color: C.faint, fontSize: 12, marginBottom: 8 }}>{c.business_name || "No business name set"}</div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <select value={plan} onChange={(e) => pick(e.target.value)} style={sel}>
          <option value="free">Free — 5 clients</option>
          <option value="pro">Pro — $50/mo</option>
          <option value="whitelabel">White-label — $70/mo</option>
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: C.muted, fontSize: 12.5 }}>Limit</span>
          <input value={limit} onChange={(e) => setLimit(e.target.value)} style={{ ...inputStyle, width: 86, marginTop: 0, padding: "8px 10px" }} />
          {Number(limit) >= 9999 && <span style={{ color: C.gold, fontSize: 14 }}>∞</span>}
        </div>
        <button onClick={save} disabled={busy} style={btnGold}>{busy ? "…" : "Save"}</button>
        {msg && <span style={{ color: msg === "Saved" ? C.gold : C.red, fontSize: 12.5 }}>{msg}</span>}
      </div>
    </div>
  );
}

function AdminSettings({ profile, coaches, pricing, onReload }) {
  const price = pricing || { price_pro: 50, price_whitelabel: 70, free_client_limit: 5 };
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [accMsg, setAccMsg] = useState("");
  async function changeEmail() { setAccMsg("");
    if (!email.trim()) { setAccMsg("Enter a new email first."); return; }
    const { error } = await sb.auth.updateUser({ email: email.trim() });
    setAccMsg(error ? error.message : "Check your new inbox to confirm the change."); }
  async function changePw() { setAccMsg("");
    if (pw.length < 6) { setAccMsg("Password needs at least 6 characters."); return; }
    const { error } = await sb.auth.updateUser({ password: pw });
    if (error) { setAccMsg(error.message); return; } setAccMsg("Password updated."); setPw(""); }

  const [pr, setPr] = useState({ price_pro: price.price_pro, price_whitelabel: price.price_whitelabel, free_client_limit: price.free_client_limit });
  useEffect(() => { setPr({ price_pro: price.price_pro, price_whitelabel: price.price_whitelabel, free_client_limit: price.free_client_limit }); }, [pricing]);
  const [prBusy, setPrBusy] = useState(false); const [prMsg, setPrMsg] = useState("");
  async function savePricing() { setPrBusy(true); setPrMsg("");
    const { error } = await sb.from("platform_settings").upsert({ id: 1, price_pro: Number(pr.price_pro), price_whitelabel: Number(pr.price_whitelabel), free_client_limit: Number(pr.free_client_limit) });
    setPrBusy(false); if (error) { setPrMsg(error.message); return; } setPrMsg("Saved."); onReload && onReload(); }

  const proN = coaches.filter((c) => c.plan === "pro").length;
  const wlN = coaches.filter((c) => c.plan === "whitelabel").length;
  const freeN = coaches.filter((c) => !c.plan || c.plan === "free").length;
  const mrr = proN * Number(price.price_pro) + wlN * Number(price.price_whitelabel);
  const half = { flex: 1, minWidth: 130 };

  return (
    <div>
      <H1>Settings</H1>
      <p style={{ color: C.muted, marginTop: 0, fontSize: 14 }}>Platform owner controls.</p>

      <Card>
        <H2>My account</H2>
        <p style={{ color: C.faint, fontSize: 12.5, marginTop: 0, marginBottom: 14 }}>Signed in as {profile.email}</p>
        <Field label="New email"><input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="new@email.com" /></Field>
        <button onClick={changeEmail} style={btnGhost}>Update email</button>
        <div style={{ height: 1, background: C.border, margin: "18px 0" }} />
        <Field label="New password"><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} style={inputStyle} placeholder="••••••••" /></Field>
        <button onClick={changePw} style={btnGhost}>Update password</button>
        {accMsg && <div style={{ color: accMsg.indexOf("updated") >= 0 || accMsg.indexOf("Check") >= 0 ? C.gold : C.red, fontSize: 13, marginTop: 12 }}>{accMsg}</div>}
      </Card>

      <Card>
        <H2>Coach plans &amp; limits</H2>
        <p style={{ color: C.faint, fontSize: 12.5, marginTop: 0, marginBottom: 6 }}>Set a coach to a paid tier the moment they pay you. Pro and White-label unlock unlimited clients.</p>
        {coaches.length === 0
          ? <div style={{ color: C.faint, padding: "16px 0", fontSize: 13.5 }}>No coaches yet.</div>
          : coaches.map((c) => <CoachPlanRow key={c.id} c={c} freeLimit={Number(price.free_client_limit)} onSaved={onReload} />)}
      </Card>

      <Card>
        <H2>Plan pricing</H2>
        <p style={{ color: C.faint, fontSize: 12.5, marginTop: 0, marginBottom: 14 }}>These numbers feed the billing summary below.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={half}><Field label="Pro $/mo"><input value={pr.price_pro} onChange={(e) => setPr({ ...pr, price_pro: e.target.value })} style={inputStyle} /></Field></div>
          <div style={half}><Field label="White-label $/mo"><input value={pr.price_whitelabel} onChange={(e) => setPr({ ...pr, price_whitelabel: e.target.value })} style={inputStyle} /></Field></div>
          <div style={half}><Field label="Free tier client limit"><input value={pr.free_client_limit} onChange={(e) => setPr({ ...pr, free_client_limit: e.target.value })} style={inputStyle} /></Field></div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
          <button onClick={savePricing} disabled={prBusy} style={btnGold}>{prBusy ? "Saving…" : "Save pricing"}</button>
          {prMsg && <span style={{ color: prMsg === "Saved." ? C.gold : C.red, fontSize: 13 }}>{prMsg}</span>}
        </div>
        {!pricing && <div style={{ color: C.red, fontSize: 12, marginTop: 12 }}>Run the one-time database step (sent in chat) so pricing can save.</div>}
      </Card>

      <Card>
        <H2>Billing</H2>
        <p style={{ color: C.faint, fontSize: 12.5, marginTop: 0, marginBottom: 14 }}>Estimated monthly revenue from your coaches.</p>
        <div style={disp({ fontSize: 48, color: C.gold, lineHeight: 0.9 })}>${mrr}<span style={{ fontSize: 16, color: C.muted }}> /mo</span></div>
        <div style={{ display: "flex", gap: 14, marginTop: 18, flexWrap: "wrap" }}>
          <Stat label="Free coaches" value={freeN} />
          <Stat label={"Pro · $" + price.price_pro} value={proN} accent={C.gold} />
          <Stat label={"White-label · $" + price.price_whitelabel} value={wlN} accent={C.gold} />
        </div>
        <div style={{ color: C.faint, fontSize: 12, marginTop: 16 }}>Automatic card billing through Stripe is coming. For now, mark each coach paid in the section above when money lands in your account.</div>
      </Card>
    </div>
  );
}

// ---------------- Admin invites ----------------
function AdminInvites({ profile }) {
  const [list, setList] = useState([]); const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("pro"); const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  function flash(t) { setMsg(t); setTimeout(() => setMsg(""), 2500); }
  async function load() { const { data } = await sb.from("invites").select("*").order("created_at", { ascending: false }); setList(data || []); setLoading(false); }
  useEffect(() => { load(); }, []);
  async function generate() {
    setBusy(true);
    const code = randCode();
    const limit = plan === "free" ? 5 : 999999;
    const { error } = await sb.from("invites").insert({ code: code, plan: plan, client_limit: limit, note: note, created_by: profile.id });
    setBusy(false); if (error) { flash(error.message); return; } setNote(""); flash("Invite created"); load();
  }
  function linkFor(code) { return window.location.origin + window.location.pathname + "?invite=" + code; }
  function copy(code) { try { navigator.clipboard.writeText(linkFor(code)); flash("Link copied"); } catch (e) { flash("Could not copy - long-press the link to copy"); } }
  const planLabel = { free: "Free", pro: "Pro ($50 value)", whitelabel: "White-label ($70 value)" };
  return (
    <div>
      <H1>Invites</H1>
      <p style={{ color: C.muted, marginTop: 0, fontSize: 14 }}>Create a one-time link that signs a coach up on a plan you choose - free of charge.</p>
      {msg && <div style={{ background: C.goldSoft, color: C.gold, borderRadius: 10, padding: "8px 12px", fontSize: 13, margin: "12px 0" }}>{msg}</div>}
      <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, padding: 22, marginTop: 8, maxWidth: 640 }}>
        <H2>New invite</H2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 160 }}><Field label="Grants plan">
            <select value={plan} onChange={(e) => setPlan(e.target.value)} style={inputStyle}>
              <option value="free">Free - 5 clients</option>
              <option value="pro">Pro - unlimited (free of charge)</option>
              <option value="whitelabel">White-label - unlimited + branding (free of charge)</option>
            </select>
          </Field></div>
          <div style={{ flex: 1, minWidth: 160 }}><Field label="Note (optional)"><input value={note} onChange={(e) => setNote(e.target.value)} style={inputStyle} placeholder="e.g. John from gym expo" /></Field></div>
        </div>
        <button onClick={generate} disabled={busy} style={btnGold}>{busy ? "Creating…" : "Generate invite link"}</button>
      </div>

      <H2>{loading ? "" : "Your invites"}</H2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8, maxWidth: 640 }}>
        {!loading && list.length === 0 && <div style={{ color: C.faint, fontSize: 13.5 }}>No invites yet.</div>}
        {list.map((iv) => (
          <div key={iv.code} style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 14, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div>
                <span style={disp({ fontSize: 20, color: C.gold, letterSpacing: 2 })}>{iv.code}</span>
                <span style={{ color: C.muted, fontSize: 12.5, marginLeft: 10 }}>{planLabel[iv.plan] || iv.plan}</span>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: iv.used_at ? C.faint : C.gold, border: "1px solid " + C.border, borderRadius: 999, padding: "2px 10px", textTransform: "uppercase" }}>{iv.used_at ? "Used" : "Active"}</span>
            </div>
            {iv.note && <div style={{ color: C.faint, fontSize: 12, marginTop: 4 }}>{iv.note}</div>}
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
              <input readOnly value={linkFor(iv.code)} style={{ ...inputStyle, marginTop: 0, flex: 1, color: C.muted, fontSize: 12 }} />
              <button onClick={() => copy(iv.code)} style={btnGhost}>Copy link</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Admin offers ----------------
function AdminOffers({ profile }) {
  const [list, setList] = useState([]); const [loading, setLoading] = useState(true);
  const [f, setF] = useState({ code: "", kind: "percent", amount: "", applies_to: "all", note: "" });
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  function flash(t) { setMsg(t); setTimeout(() => setMsg(""), 2500); }
  async function load() { const { data } = await sb.from("offers").select("*").order("created_at", { ascending: false }); setList(data || []); setLoading(false); }
  useEffect(() => { load(); }, []);
  async function create() {
    if (!f.code.trim()) { flash("Enter a code"); return; }
    setBusy(true);
    const { error } = await sb.from("offers").insert({ code: f.code.trim().toUpperCase(), kind: f.kind, amount: Number(f.amount) || 0, applies_to: f.applies_to, note: f.note });
    setBusy(false); if (error) { flash(error.message); return; } setF({ code: "", kind: "percent", amount: "", applies_to: "all", note: "" }); flash("Offer saved"); load();
  }
  async function toggle(o) { await sb.from("offers").update({ active: !o.active }).eq("id", o.id); load(); }
  async function remove(o) { await sb.from("offers").delete().eq("id", o.id); load(); }
  const half = { flex: 1, minWidth: 130 };
  return (
    <div>
      <H1>Offers</H1>
      <p style={{ color: C.muted, marginTop: 0, fontSize: 14 }}>Create and manage discount codes.</p>
      <div style={{ background: C.redSoft, color: C.red, borderRadius: 10, padding: "8px 12px", fontSize: 12.5, margin: "12px 0", maxWidth: 640 }}>These are stored and ready. They start reducing real payments once card billing (Stripe) is connected.</div>
      {msg && <div style={{ background: C.goldSoft, color: C.gold, borderRadius: 10, padding: "8px 12px", fontSize: 13, marginBottom: 12 }}>{msg}</div>}
      <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, padding: 22, maxWidth: 640 }}>
        <H2>New offer</H2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={half}><Field label="Code"><input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} style={inputStyle} placeholder="LAUNCH20" /></Field></div>
          <div style={half}><Field label="Type">
            <select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })} style={inputStyle}>
              <option value="percent">Percent off</option>
              <option value="fixed">Dollars off</option>
            </select>
          </Field></div>
          <div style={half}><Field label={f.kind === "percent" ? "Percent (%)" : "Amount ($)"}><input value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} style={inputStyle} placeholder={f.kind === "percent" ? "20" : "10"} /></Field></div>
          <div style={half}><Field label="Applies to">
            <select value={f.applies_to} onChange={(e) => setF({ ...f, applies_to: e.target.value })} style={inputStyle}>
              <option value="all">All paid plans</option>
              <option value="pro">Pro only</option>
              <option value="whitelabel">White-label only</option>
            </select>
          </Field></div>
        </div>
        <Field label="Note (optional)"><input value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} style={inputStyle} placeholder="e.g. Black Friday" /></Field>
        <button onClick={create} disabled={busy} style={btnGold}>{busy ? "Saving…" : "Save offer"}</button>
      </div>

      <H2>{loading ? "" : "Your offers"}</H2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8, maxWidth: 640 }}>
        {!loading && list.length === 0 && <div style={{ color: C.faint, fontSize: 13.5 }}>No offers yet.</div>}
        {list.map((o) => (
          <div key={o.id} style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <span style={disp({ fontSize: 20, color: C.gold, letterSpacing: 2 })}>{o.code}</span>
              <span style={{ color: C.muted, fontSize: 12.5, marginLeft: 10 }}>{o.kind === "percent" ? o.amount + "% off" : "$" + o.amount + " off"} · {o.applies_to === "all" ? "all paid plans" : o.applies_to}</span>
              {o.note && <div style={{ color: C.faint, fontSize: 12, marginTop: 3 }}>{o.note}</div>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => toggle(o)} style={{ ...btnGhost, color: o.active ? C.gold : C.faint }}>{o.active ? "Active" : "Off"}</button>
              <button onClick={() => remove(o)} style={{ ...btnGhost, color: C.red }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Admin app ----------------
function PlanBadge({ plan }) {
  const p = plan || "free";
  const label = p === "whitelabel" ? "White-label" : p.charAt(0).toUpperCase() + p.slice(1);
  return <span style={{ fontSize: 11, fontWeight: 700, color: p === "free" ? C.muted : C.gold, border: "1px solid " + (p === "free" ? C.border : C.gold + "55"), borderRadius: 999, padding: "2px 10px", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>;
}
function matchQ(p, q) {
  if (!q) return true; q = q.toLowerCase();
  return [p.email, p.full_name, p.phone, p.business_name].some((v) => (v || "").toLowerCase().indexOf(q) >= 0);
}

function AdminApp({ profile }) {
  const [active, setActive] = useState("overview");
  const [coaches, setCoaches] = useState([]); const [clients, setClients] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selCoach, setSelCoach] = useState(null);
  const [coachQ, setCoachQ] = useState(""); const [clientQ, setClientQ] = useState("");
  async function load() {
    const { data: cp } = await sb.from("profiles").select("id,email,created_at,role,full_name,phone").eq("role", "coach");
    const { data: settings } = await sb.from("coaches").select("*");
    const merged = (cp || []).map((p) => ({ ...p, ...((settings || []).find((s) => s.id === p.id) || {}) }));
    const { data: cl } = await sb.from("profiles").select("id,email,created_at,coach_id,full_name,phone").eq("role", "client");
    const { data: ps } = await sb.from("platform_settings").select("*").eq("id", 1).maybeSingle();
    setCoaches(merged); setClients(cl || []); setPricing(ps || null); setLoading(false);
  }
  useEffect(() => { load(); }, []);
  const main = [{ id: "overview", label: "Overview" }, { id: "coaches", label: "Coaches" }, { id: "clients", label: "Clients" }, { id: "invites", label: "Invites" }, { id: "offers", label: "Offers" }];
  const other = [{ id: "revenue", label: "Revenue", soon: true }, { id: "settings", label: "Settings" }];
  const row = { padding: "13px 18px", borderBottom: "1px solid " + C.borderSoft, display: "flex", justifyContent: "space-between", color: C.text, fontSize: 13.5 };
  let page = null;
  if (loading) page = <div style={{ color: C.muted }}>Loading…</div>;
  else if (active === "overview") page = (
    <div><H1>Admin Console</H1><p style={{ color: C.muted, marginTop: 0 }}>Every coach and client across FitStud.</p>
      <div style={{ display: "flex", gap: 14, marginTop: 18 }}><Stat label="Coaches signed up" value={coaches.length} accent={C.gold} /><Stat label="Total clients" value={clients.length} /></div>
    </div>);
  else if (active === "coaches") page = selCoach ? (
    <div>
      <button onClick={() => setSelCoach(null)} style={{ ...btnGhost, marginBottom: 14 }}>← All coaches</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <H1>{selCoach.business_name || selCoach.full_name || selCoach.email}</H1>
        <PlanBadge plan={selCoach.plan} />
      </div>
      <p style={{ color: C.muted, marginTop: 0, fontSize: 13.5 }}>{selCoach.email}{selCoach.phone ? " · " + selCoach.phone : ""}</p>
      {(() => {
        const theirs = clients.filter((c) => c.coach_id === selCoach.id);
        return (
          <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, overflow: "hidden", marginTop: 12 }}>
            <div style={{ padding: "12px 18px", color: C.faint, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid " + C.border }}>{theirs.length} client{theirs.length === 1 ? "" : "s"}</div>
            {theirs.length === 0 && <div style={{ color: C.faint, padding: 24, textAlign: "center" }}>No clients yet.</div>}
            {theirs.map((c) => <div key={c.id} style={row}><span style={{ color: C.text, fontWeight: 600 }}>{c.full_name || c.email}</span><span style={{ color: C.muted }}>{c.email}</span></div>)}
          </div>
        );
      })()}
    </div>
  ) : (
    <div><H1>Coaches</H1>
      <input value={coachQ} onChange={(e) => setCoachQ(e.target.value)} placeholder="Search coaches by name, email, or phone" style={{ ...inputStyle, maxWidth: 420, marginTop: 14 }} />
      <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, overflow: "hidden", marginTop: 14 }}>
        {coaches.length === 0 && <div style={{ color: C.faint, padding: 24, textAlign: "center" }}>No coaches yet.</div>}
        {coaches.filter((c) => matchQ(c, coachQ)).map((c) => {
          const n = clients.filter((x) => x.coach_id === c.id).length;
          return (
            <div key={c.id} onClick={() => setSelCoach(c)} style={{ ...row, cursor: "pointer" }}>
              <span><span style={{ color: C.text, fontWeight: 600 }}>{c.business_name || c.full_name || c.email}</span><span style={{ color: C.faint, fontSize: 12, marginLeft: 8 }}>{n} client{n === 1 ? "" : "s"} ›</span></span>
              <PlanBadge plan={c.plan} />
            </div>
          );
        })}
      </div>
    </div>);
  else if (active === "clients") page = (
    <div><H1>All Clients</H1>
      <input value={clientQ} onChange={(e) => setClientQ(e.target.value)} placeholder="Search clients by name, email, or phone" style={{ ...inputStyle, maxWidth: 420, marginTop: 14 }} />
      <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 16, overflow: "hidden", marginTop: 14 }}>
        {clients.length === 0 && <div style={{ color: C.faint, padding: 24, textAlign: "center" }}>No clients yet.</div>}
        {clients.filter((c) => matchQ(c, clientQ)).map((c) => {
          const coach = coaches.find((co) => co.id === c.coach_id);
          return (
            <div key={c.id} style={row}>
              <span><span style={{ color: C.text, fontWeight: 600 }}>{c.full_name || c.email}</span><span style={{ color: C.faint, fontSize: 12, marginLeft: 8 }}>{c.email}</span></span>
              {c.coach_id
                ? <span style={{ color: C.muted, fontSize: 12.5 }}>Coach: {coach ? (coach.business_name || coach.email) : "—"}</span>
                : <span style={{ fontSize: 11, fontWeight: 700, color: C.red, border: "1px solid " + C.red + "55", borderRadius: 999, padding: "2px 10px", textTransform: "uppercase", letterSpacing: 0.5 }}>Solo · no coach</span>}
            </div>
          );
        })}
      </div>
    </div>);
  else if (active === "invites") page = <AdminInvites profile={profile} />;
  else if (active === "offers") page = <AdminOffers profile={profile} />;
  else if (active === "revenue") page = <SoonPage title="Revenue" desc="Track coach subscriptions and MRR across the platform." />;
  else if (active === "settings") page = <AdminSettings profile={profile} coaches={coaches} pricing={pricing} onReload={load} />;
  return <AppShell profile={profile} brandName="FitStud HQ" main={main} other={other} active={active} setActive={(id) => { setSelCoach(null); setActive(id); }}>{page}</AppShell>;
}

function App() {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null); const [perr, setPerr] = useState("");
  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => { setSession(s); if (!s) setProfile(null); });
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (!session) return; (async () => {
    const code = readInvite();
    const { data, error } = await sb.from("profiles").select("id,email,role,coach_id").eq("id", session.user.id).maybeSingle();
    if (error) { setPerr(error.message); return; }
    const prof = data || { id: session.user.id, email: session.user.email, role: "client" };
    if (code && prof.role !== "coach" && prof.role !== "admin") {
      const { data: r } = await sb.rpc("redeem_invite", { invite_code: code });
      clearInvite();
      if (r === "ok") { window.location.search = ""; return; }
    }
    setProfile(prof);
  })(); }, [session]);
  if (session === undefined) return <div style={{ minHeight: "100vh", background: C.bg }} />;
  if (!session) return readInvite() ? <Signup code={readInvite()} /> : <Login />;
  if (!profile) return <div style={{ minHeight: "100vh", background: C.bg, color: C.muted, fontFamily: FB, display: "flex", alignItems: "center", justifyContent: "center" }}>{perr || "Loading…"}</div>;
  if (profile.role === "admin") return <AdminApp profile={profile} />;
  if (profile.role === "coach") return <CoachApp profile={profile} />;
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: FB, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 28 }}>
      <Logo size={32} />
      <h1 style={disp({ fontSize: 28, color: C.text, marginTop: 20 })}>This is a client account</h1>
      <p style={{ color: C.muted, maxWidth: 420 }}>The coach console is for coaches and admins. Clients use the FitStud app.</p>
      <button onClick={() => sb.auth.signOut()} style={{ ...btnGhost, marginTop: 16 }}>Log out</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>
</body>
</html>
