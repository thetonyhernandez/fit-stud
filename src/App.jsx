import { useState, useEffect } from "react";

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const FULL_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const DAY_FOCUS = {
  Mon: "🦵 Heavy Leg Day", Tue: "💪 Chest & Triceps", Wed: "🔙 Back & Biceps",
  Thu: "⚡ Full Body Functional", Fri: "🍑 Glute & Leg Day", Sat: "😴 Rest Day", Sun: "😴 Rest Day",
};

const DEFAULT_WORKOUTS = {
  Mon: [
    {id:1, name:"Deadlifts", sets:5, reps:6, video:"XxWcirHIwVo"},
    {id:2, name:"Walking Lunges", sets:4, reps:20, video:"kRzcRkKy1ns"},
    {id:3, name:"Leg Extensions", sets:4, reps:13, video:"YyvSfVjQeL0"},
    {id:4, name:"Seated Hamstring Curl", sets:4, reps:13, video:"y19_9B0s2uA"},
    {id:5, name:"Standing Calf Raises", sets:5, reps:17, video:"M4-G8p8fmc"},
    {id:6, name:"Goblet Squats", sets:4, reps:12, video:"MeIiIdhvXT4"},
    {id:7, name:"Hip Abductor Machine", sets:4, reps:15, video:"G_8LItOiZ0Q"},
    {id:8, name:"Hip Adductor Machine", sets:4, reps:15, video:"G_8LItOiZ0Q"},
    {id:9, name:"Weighted Russian Twists", sets:4, reps:20, video:"wkD8rjkodUI"},
  ],
  Tue: [
    {id:10, name:"Flat Bench Press", sets:5, reps:6, video:"rT7DgCr-3pg"},
    {id:11, name:"Incline Dumbbell Press", sets:4, reps:10, video:"8iPEnn-ltC8"},
    {id:12, name:"Chest Fly / Cable Fly", sets:4, reps:12, video:"eozdVDA78K0"},
    {id:13, name:"Push-Ups", sets:3, reps:15, video:"IODxDxX7oi4"},
    {id:14, name:"Tricep Rope Pushdowns", sets:4, reps:12, video:"vB5OHsJ3EME"},
    {id:15, name:"Overhead Tricep Extensions", sets:4, reps:12, video:"_gsUck-7M74"},
    {id:16, name:"Dips", sets:3, reps:12, video:"2z8JmcrW-As"},
    {id:17, name:"Dumbbell Shoulder Press", sets:4, reps:10, video:"qEwKCR5JCog"},
    {id:18, name:"Weighted Russian Twists", sets:4, reps:20, video:"wkD8rjkodUI"},
  ],
  Wed: [
    {id:19, name:"Pull-Ups / Assisted Pull-Ups", sets:4, reps:8, video:"eGo4IYlbE5g"},
    {id:20, name:"Barbell Rows", sets:5, reps:8, video:"vT2GjY_Umpw"},
    {id:21, name:"Lat Pulldowns", sets:4, reps:12, video:"CAwf7n6Luuc"},
    {id:22, name:"Seated Cable Rows", sets:4, reps:12, video:"HJSVR_67OlM"},
    {id:23, name:"Dumbbell Rows", sets:4, reps:10, video:"roCP6wCXPqo"},
    {id:24, name:"Pec Deck Rear Delt Fly", sets:4, reps:15, video:"EA7u4Q_8HQ0"},
    {id:25, name:"Rear Delt Fly Machine", sets:4, reps:15, video:"6yMdhi2DVao"},
    {id:26, name:"EZ Bar Curls", sets:4, reps:12, video:"kwG2ipFRgfo"},
    {id:27, name:"Hammer Curls", sets:4, reps:12, video:"zC3nLlEvin4"},
    {id:28, name:"Preacher Curls", sets:3, reps:15, video:"fIWP-FRFNU0"},
    {id:29, name:"Weighted Russian Twists", sets:4, reps:20, video:"wkD8rjkodUI"},
  ],
  Thu: [
    {id:30, name:"Sled Pushes", sets:8, reps:1, video:"5VxTpqj7A"},
    {id:31, name:"Cable Lat Pulldowns", sets:4, reps:12, video:"CAwf7n6Luuc"},
    {id:32, name:"Cable Rows", sets:4, reps:12, video:"HJSVR_67OlM"},
    {id:33, name:"Cable Face Pulls", sets:4, reps:15, video:"rep-qVOkqgk"},
    {id:34, name:"Cable Woodchoppers", sets:4, reps:15, video:"AU-4zSxzi0I"},
    {id:35, name:"Kettlebell Swings", sets:4, reps:20, video:"YSxHifyImin"},
    {id:36, name:"Walking Lunges", sets:3, reps:20, video:"kRzcRkKy1ns"},
    {id:37, name:"Battle Ropes / Row Machine", sets:5, reps:1, video:"Y6nFmyQ5SR0"},
    {id:38, name:"Push-Ups", sets:3, reps:15, video:"IODxDxX7oi4"},
    {id:39, name:"Farmer Carries", sets:4, reps:1, video:"Fkzk_RqlYig"},
    {id:40, name:"Weighted Russian Twists", sets:4, reps:20, video:"wkD8rjkodUI"},
  ],
  Fri: [
    {id:41, name:"Romanian Deadlifts", sets:5, reps:10, video:"2SHsk9AzdjA"},
    {id:42, name:"Walking Lunges", sets:5, reps:20, video:"kRzcRkKy1ns"},
    {id:43, name:"Hip Thrusts", sets:5, reps:12, video:"LM8XHLYJoYs"},
    {id:44, name:"Seated Hamstring Curl", sets:4, reps:15, video:"y19_9B0s2uA"},
    {id:45, name:"Leg Extensions", sets:4, reps:15, video:"YyvSfVjQeL0"},
    {id:46, name:"Hip Abductor Machine", sets:5, reps:20, video:"G_8LItOiZ0Q"},
    {id:47, name:"Bulgarian Split Squats", sets:4, reps:10, video:"2C-uNgKwPLE"},
    {id:48, name:"Standing Calf Raises", sets:5, reps:20, video:"M4-G8p8fmc"},
    {id:49, name:"Goblet Squats", sets:4, reps:12, video:"MeIiIdhvXT4"},
    {id:50, name:"Weighted Russian Twists", sets:4, reps:20, video:"wkD8rjkodUI"},
  ],
  Sat: [], Sun: [],
};

// localStorage helpers
const load = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
};
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

// Check if this is first time (no saved workouts)
const EMPTY_WORKOUTS = {Sun:[], Mon:[], Tue:[], Wed:[], Thu:[], Fri:[], Sat:[]};

let nextId = 200;

export default function FitStud() {
  const now = new Date();
  const today = DAYS[now.getDay()];
  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  const [view, setView] = useState("week");
  const [calMonth, setCalMonth] = useState(todayMonth);
  const [calYear, setCalYear] = useState(todayYear);
  const [selectedDay, setSelectedDay] = useState(today);
  const [workouts, setWorkouts] = useState(() => load("fs_workouts", null));
  const [setData, setSetDataState] = useState(() => load("fs_setdata", {}));
  const [showAdd, setShowAdd] = useState(false);
  const [addTab, setAddTab] = useState("manual");
  const [newEx, setNewEx] = useState({name:"", sets:"", reps:"", video:""});
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [videoPlayer, setVideoPlayer] = useState(null);
  const [showPlanner, setShowPlanner] = useState(false);
  const [plannerPrompt, setPlannerPrompt] = useState("");
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerError, setPlannerError] = useState("");
  const [plannerPreview, setPlannerPreview] = useState(null);
  const [plannerMode, setPlannerMode] = useState("replace");
  const [editMode, setEditMode] = useState(false);
  const [moveModal, setMoveModal] = useState(null);
  const [history, setHistory] = useState(() => load("fs_history", {}));
  const [showHistory, setShowHistory] = useState(false);
  const [historyDetail, setHistoryDetail] = useState(null);
  const [library, setLibrary] = useState(() => load("fs_library", []));
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryTarget, setLibraryTarget] = useState(null);
  const [showSetup, setShowSetup] = useState(() => load("fs_workouts", null) === null);

  // Auto-save to localStorage whenever data changes
  useEffect(() => { if (workouts) save("fs_workouts", workouts); }, [workouts]);
  useEffect(() => { save("fs_setdata", setData); }, [setData]);
  useEffect(() => { save("fs_history", history); }, [history]);
  useEffect(() => { save("fs_library", library); }, [library]);

  const exercises = (workouts || EMPTY_WORKOUTS)[selectedDay] || [];

  const getSet = (exId, i) => setData[selectedDay + "-" + exId + "-" + i] || {reps:"", weight:"", done:false};

  const updateSet = (exId, i, field, val) => {
    const key = selectedDay + "-" + exId + "-" + i;
    setSetDataState(prev => ({...prev, [key]: {...getSet(exId, i), [field]: val}}));
  };

  const toggleDone = (exId, i) => updateSet(exId, i, "done", !getSet(exId, i).done);

  const doneCount = (exId, total) => Array.from({length: total}, (_, i) => getSet(exId, i).done).filter(Boolean).length;

  const allDone = exercises.length > 0 && exercises.every(ex => doneCount(ex.id, ex.sets) === ex.sets);
  const safeWorkouts = workouts || EMPTY_WORKOUTS;

  const addExerciseToDay = (day, ex) => setWorkouts(prev => ({...prev, [day]: [...(prev[day]||[]), ex]}));

  const removeExercise = (exId) => setWorkouts(prev => ({...prev, [selectedDay]: prev[selectedDay].filter(e => e.id !== exId)}));

  const addSet = (exId) => setWorkouts(prev => ({...prev, [selectedDay]: prev[selectedDay].map(ex => ex.id === exId ? {...ex, sets: ex.sets+1} : ex)}));

  const removeSet = (exId) => setWorkouts(prev => ({...prev, [selectedDay]: prev[selectedDay].map(ex => ex.id === exId && ex.sets > 1 ? {...ex, sets: ex.sets-1} : ex)}));

  const moveUp = (idx) => {
    if (idx === 0) return;
    setWorkouts(prev => {
      const list = [...(prev[selectedDay]||[])];
      [list[idx-1], list[idx]] = [list[idx], list[idx-1]];
      return {...prev, [selectedDay]: list};
    });
  };

  const moveDown = (idx) => {
    setWorkouts(prev => {
      const list = [...(prev[selectedDay]||[])];
      if (idx >= list.length-1) return prev;
      [list[idx], list[idx+1]] = [list[idx+1], list[idx]];
      return {...prev, [selectedDay]: list};
    });
  };

  const moveToDay = (ex, targetDay) => {
    setWorkouts(prev => ({
      ...prev,
      [selectedDay]: (prev[selectedDay]||[]).filter(e => e.id !== ex.id),
      [targetDay]: [...(prev[targetDay]||[]), ex],
    }));
    setMoveModal(null);
  };

  const saveToHistory = () => {
    const key = todayYear + "-" + String(todayMonth+1).padStart(2,"0") + "-" + String(todayDate).padStart(2,"0") + "-" + selectedDay;
    setHistory(prev => ({
      ...prev,
      [key]: {
        day: selectedDay,
        fullDay: FULL_DAYS[DAYS.indexOf(selectedDay)],
        date: MONTHS[todayMonth] + " " + todayDate + ", " + todayYear,
        exercises: exercises.map(ex => ({...ex, sets: Array.from({length: ex.sets}, (_, i) => getSet(ex.id, i))})),
        completedAt: new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}),
      }
    }));
  };

  const saveToLibrary = () => {
    const entry = {
      id: Date.now(),
      name: FULL_DAYS[DAYS.indexOf(selectedDay)] + " · " + MONTHS[todayMonth] + " " + todayDate,
      day: selectedDay,
      date: MONTHS[todayMonth] + " " + todayDate + ", " + todayYear,
      exercises: exercises.map(ex => ({name:ex.name, sets:ex.sets, reps:ex.reps, video:ex.video||""})),
    };
    setLibrary(prev => [entry, ...prev]);
  };

  const loadFromLibrary = (entry, targetDay) => {
    const newExs = entry.exercises.map(ex => ({id:nextId++, name:ex.name, sets:ex.sets, reps:ex.reps, video:ex.video||""}));
    setWorkouts(prev => ({...prev, [targetDay]: [...(prev[targetDay]||[]), ...newExs]}));
    setShowLibrary(false);
    setLibraryTarget(null);
    setSelectedDay(targetDay);
    setView("week");
  };

  const deleteFromLibrary = (id) => setLibrary(prev => prev.filter(e => e.id !== id));

  const dayProgress = (day) => {
    const exs = safeWorkouts[day] || [];
    if (!exs.length) return null;
    let done = 0, total = 0;
    exs.forEach(ex => { total += ex.sets; done += doneCount(ex.id, ex.sets); });
    return {done, total};
  };

  const buildStats = () => {
    let totalVolume = 0, totalReps = 0, totalSets = 0;
    const exStats = exercises.map(ex => {
      let exVol = 0, exReps = 0, bestSet = null;
      Array.from({length: ex.sets}, (_, i) => {
        const s = getSet(ex.id, i);
        if (s.done) {
          const r = parseInt(s.reps) || ex.reps;
          const w = parseFloat(s.weight) || 0;
          exReps += r; exVol += r*w; totalReps += r; totalVolume += r*w; totalSets++;
          if (!bestSet || r*w > bestSet.vol) bestSet = {set:i+1, reps:r, weight:w, vol:r*w};
        }
      });
      return {name:ex.name, volume:exVol, reps:exReps, bestSet};
    });
    return {totalVolume, totalReps, totalSets, exStats};
  };

  const addManual = () => {
    if (!newEx.name || !newEx.sets || !newEx.reps) return;
    addExerciseToDay(selectedDay, {id:nextId++, name:newEx.name, sets:parseInt(newEx.sets), reps:parseInt(newEx.reps), video:newEx.video||""});
    setNewEx({name:"", sets:"", reps:"", video:""});
    setShowAdd(false);
  };

  const addWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true); setAiError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:"You are a fitness assistant. Return ONLY a valid JSON array of exercise objects. No explanation, no markdown. Each object has: name (string), sets (number), reps (number), video (string, YouTube video ID or empty). Example: [{\"name\":\"Push-ups\",\"sets\":3,\"reps\":12,\"video\":\"IODxDxX7oi4\"}]",
          messages:[{role:"user", content:aiPrompt}],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const parsed = JSON.parse(text.trim());
      parsed.forEach(ex => addExerciseToDay(selectedDay, {id:nextId++, name:ex.name, sets:ex.sets, reps:ex.reps, video:ex.video||""}));
      setAiPrompt(""); setShowAdd(false);
    } catch(e) { setAiError("Could not parse response. Try rephrasing."); }
    setAiLoading(false);
  };

  const generatePlan = async () => {
    if (!plannerPrompt.trim()) return;
    setPlannerLoading(true); setPlannerError(""); setPlannerPreview(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:2000,
          system:"You are a fitness coach. Return ONLY a valid JSON object with keys Sun,Mon,Tue,Wed,Thu,Fri,Sat. Each value is an array of exercises with: name, sets, reps, video (YouTube ID or empty string). Rest days = []. No explanation, no markdown. Example: {\"Sun\":[],\"Mon\":[{\"name\":\"Bench Press\",\"sets\":4,\"reps\":8,\"video\":\"rT7DgCr-3pg\"}],\"Tue\":[],\"Wed\":[],\"Thu\":[],\"Fri\":[],\"Sat\":[]}",
          messages:[{role:"user", content:plannerPrompt}],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const parsed = JSON.parse(text.trim());
      if (!DAYS.some(d => Array.isArray(parsed[d]))) throw new Error("Invalid");
      setPlannerPreview(parsed);
    } catch(e) { setPlannerError("Could not generate plan. Try describing it more clearly."); }
    setPlannerLoading(false);
  };

  const applyPlan = () => {
    if (!plannerPreview) return;
    setWorkouts(prev => {
      const next = {...prev};
      DAYS.forEach(day => {
        if (!Array.isArray(plannerPreview[day])) return;
        const newExs = plannerPreview[day].map(ex => ({id:nextId++, name:ex.name, sets:ex.sets, reps:ex.reps, video:ex.video||""}));
        next[day] = plannerMode === "replace" ? newExs : [...(prev[day]||[]), ...newExs];
      });
      return next;
    });
    setPlannerPreview(null); setPlannerPrompt(""); setShowPlanner(false);
  };

  const getLastRecord = (exName, setIndex) => {
    const keys = Object.keys(history).sort((a,b) => b.localeCompare(a));
    for (const key of keys) {
      const rec = history[key];
      const histEx = rec.exercises?.find(e => e.name === exName);
      if (histEx && histEx.sets[setIndex]) {
        const hs = histEx.sets[setIndex];
        if (hs.reps || hs.weight) return {reps: hs.reps || "", weight: hs.weight || ""};
      }
    }
    return null;
  };

  // Month calendar
  const getDaysInMonth = (m, y) => new Date(y, m+1, 0).getDate();
  const getFirstDay = (m, y) => new Date(y, m, 1).getDay();
  const daysInMonth = getDaysInMonth(calMonth, calYear);
  const firstDay = getFirstDay(calMonth, calYear);
  const calCells = [];
  for (let i = 0; i < firstDay; i++) calCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calCells.push(d);
  while (calCells.length % 7 !== 0) calCells.push(null);

  const stats = buildStats();
  const inp = {width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:12, color:"#f1f5f9", fontSize:15, outline:"none", boxSizing:"border-box"};

  // First time setup screen
  if (showSetup) {
    return (
      <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0a0f 0%,#111827 50%,#0d1117 100%)", fontFamily:"'DM Sans',system-ui,sans-serif", color:"#e2e8f0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center"}}>
        <div style={{fontSize:48, marginBottom:16}}>💪</div>
        <div style={{fontSize:32, fontWeight:800, color:"#f8fafc", letterSpacing:-1, marginBottom:8}}>Fit Stud</div>
        <div style={{fontSize:15, color:"#64748b", marginBottom:48, lineHeight:1.6}}>Your personal AI-powered workout tracker</div>

        <div style={{width:"100%", maxWidth:360, display:"flex", flexDirection:"column", gap:12}}>
          <button onClick={() => {
            setWorkouts(DEFAULT_WORKOUTS);
            setShowSetup(false);
          }} style={{padding:"16px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:16, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer"}}>
            🏋️ Load Month 1 Program
          </button>

          <button onClick={() => {
            setWorkouts(EMPTY_WORKOUTS);
            setShowSetup(false);
          }} style={{padding:"16px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, color:"#e2e8f0", fontSize:16, fontWeight:600, cursor:"pointer"}}>
            ✨ Start Fresh — Build My Own
          </button>
        </div>

        <div style={{marginTop:32, fontSize:12, color:"#334155", lineHeight:1.8}}>
          Your data is saved privately on your device.<br/>Nothing is shared with anyone.
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0a0f 0%,#111827 50%,#0d1117 100%)", fontFamily:"'DM Sans',system-ui,sans-serif", color:"#e2e8f0", paddingBottom:80}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{padding:"24px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.02)"}}>
        <div style={{fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"#64748b", marginBottom:4}}>Your</div>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div style={{fontSize:28, fontWeight:700, letterSpacing:-1, color:"#f8fafc"}}>Fit Stud</div>
          <div style={{display:"flex", gap:8}}>
            <button onClick={() => setShowLibrary(true)} style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"8px 12px", color:"#94a3b8", fontSize:12, fontWeight:600, cursor:"pointer"}}>📚 Library</button>
            <button onClick={() => {setShowPlanner(true); setPlannerPreview(null); setPlannerError("");}} style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"8px 12px", color:"#94a3b8", fontSize:12, fontWeight:600, cursor:"pointer"}}>🗓 Plan</button>
          </div>
        </div>
        <div style={{fontSize:13, color:"#475569", marginTop:2}}>{FULL_DAYS[now.getDay()]} · {MONTHS[todayMonth]} {todayYear}</div>
      </div>

      {/* View toggle */}
      <div style={{display:"flex", margin:"12px 16px 0", background:"rgba(255,255,255,0.04)", borderRadius:12, padding:4}}>
        {["week","month"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{flex:1, padding:"9px", borderRadius:9, border:"none", cursor:"pointer", background:view===v?"linear-gradient(135deg,#4f46e5,#7c3aed)":"transparent", color:view===v?"#fff":"#64748b", fontSize:13, fontWeight:600}}>
            {v === "week" ? "📅 Week" : "🗓 Month"}
          </button>
        ))}
      </div>

      {/* WEEK VIEW */}
      {view === "week" && (
        <div>
          {/* Day strip */}
          <div style={{display:"flex", gap:8, padding:"16px 12px", overflowX:"auto"}}>
            {DAYS.map(day => {
              const p = dayProgress(day);
              const isSel = day === selectedDay;
              const isToday = day === today;
              return (
                <button key={day} onClick={() => {setSelectedDay(day); setShowStats(false);}} style={{flex:"0 0 auto", display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"10px 14px", borderRadius:16, minWidth:48, cursor:"pointer", border:isSel?"1.5px solid #6366f1":"1.5px solid rgba(255,255,255,0.07)", background:isSel?"linear-gradient(135deg,#4f46e5,#7c3aed)":isToday?"rgba(99,102,241,0.1)":"rgba(255,255,255,0.03)"}}>
                  <span style={{fontSize:11, letterSpacing:1, color:isSel?"#c7d2fe":"#64748b", textTransform:"uppercase"}}>{day}</span>
                  <span style={{width:28, height:28, borderRadius:"50%", background:isSel?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:isSel?"#fff":"#94a3b8"}}>
                    {p ? (p.done===p.total?"✓":String(p.done)) : (safeWorkouts[day]?.length ? String(safeWorkouts[day].length) : "—")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Day header */}
          <div style={{padding:"0 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:20, fontWeight:700, color:"#f1f5f9"}}>{FULL_DAYS[DAYS.indexOf(selectedDay)]}</div>
              <div style={{fontSize:15, fontWeight:600, color:"#a5b4fc", marginTop:2}}>{DAY_FOCUS[selectedDay]}</div>
              <div style={{fontSize:12, color:"#475569", marginTop:2}}>{exercises.length} exercise{exercises.length!==1?"s":""}</div>
            </div>
            <div style={{display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end"}}>
              {allDone && <button onClick={() => {saveToHistory(); saveToLibrary(); setShowStats(true);}} style={{background:"linear-gradient(135deg,#059669,#10b981)", border:"none", borderRadius:12, padding:"8px 12px", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer"}}>📊 Stats</button>}
              <button onClick={() => setShowHistory(true)} style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"8px 12px", color:"#94a3b8", fontSize:12, fontWeight:600, cursor:"pointer"}}>📖</button>
              <button onClick={() => setEditMode(e => !e)} style={{background:editMode?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.05)", border:editMode?"1px solid rgba(251,191,36,0.4)":"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"8px 12px", color:editMode?"#fbbf24":"#94a3b8", fontSize:12, fontWeight:600, cursor:"pointer"}}>{editMode?"✓ Done":"✏️ Edit"}</button>
              <button onClick={() => setShowAdd(true)} style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:12, padding:"8px 14px", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer"}}>+ Add</button>
            </div>
          </div>

          {/* Exercise list */}
          <div style={{padding:"0 16px", display:"flex", flexDirection:"column", gap:14}}>
            {exercises.length === 0 && (
              <div style={{textAlign:"center", padding:"40px 20px", color:"#334155", fontSize:14, border:"1.5px dashed rgba(255,255,255,0.07)", borderRadius:20}}>
                <div style={{fontSize:32, marginBottom:10}}>🏋️</div>Rest day or tap + Add
              </div>
            )}
            {exercises.map((ex, exIdx) => {
              const done = doneCount(ex.id, ex.sets);
              const finished = done === ex.sets;
              return (
                <div key={ex.id} style={{background:finished?"rgba(99,102,241,0.08)":"rgba(255,255,255,0.03)", border:finished?"1.5px solid rgba(99,102,241,0.3)":"1.5px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"16px"}}>
                  {/* Edit controls */}
                  {editMode && (
                    <div style={{display:"flex", gap:6, marginBottom:10, alignItems:"center"}}>
                      <button onClick={() => moveUp(exIdx)} style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, width:32, height:32, color:"#94a3b8", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>↑</button>
                      <button onClick={() => moveDown(exIdx)} style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, width:32, height:32, color:"#94a3b8", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>↓</button>
                      <button onClick={() => setMoveModal(ex)} style={{background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.25)", borderRadius:8, padding:"4px 10px", color:"#a5b4fc", fontSize:11, fontWeight:600, cursor:"pointer"}}>Move day →</button>
                      <div style={{flex:1}} />
                      <button onClick={() => removeExercise(ex.id)} style={{background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"4px 8px", color:"#f87171", fontSize:11, cursor:"pointer"}}>Remove</button>
                    </div>
                  )}
                  {/* Card header */}
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12}}>
                    <div>
                      <div style={{fontSize:17, fontWeight:700, color:finished?"#a5b4fc":"#f1f5f9"}}>{ex.name}</div>
                      <div style={{fontSize:12, color:"#64748b", marginTop:3}}>{ex.sets} sets · target {ex.reps} reps · {done}/{ex.sets} done</div>
                    </div>
                    <div style={{display:"flex", gap:8, alignItems:"center"}}>
                      {ex.video && <button onClick={() => setVideoPlayer({videoId:ex.video, title:ex.name})} style={{background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"4px 8px", color:"#f87171", fontSize:11, fontWeight:600, cursor:"pointer"}}>▶ Watch</button>}
                      {!editMode && <button onClick={() => removeExercise(ex.id)} style={{background:"rgba(255,255,255,0.05)", border:"none", borderRadius:8, padding:"4px 8px", color:"#475569", fontSize:13, cursor:"pointer"}}>✕</button>}
                    </div>
                  </div>
                  {/* + / - Set */}
                  <div style={{display:"flex", gap:8, marginBottom:10}}>
                    <button onClick={() => removeSet(ex.id)} style={{flex:1, padding:"9px", background:ex.sets<=1?"rgba(255,255,255,0.02)":"rgba(239,68,68,0.08)", border:ex.sets<=1?"1px solid rgba(255,255,255,0.05)":"1px solid rgba(239,68,68,0.3)", borderRadius:10, color:ex.sets<=1?"#334155":"#f87171", fontSize:14, fontWeight:700, cursor:ex.sets<=1?"not-allowed":"pointer"}}>− Set</button>
                    <button onClick={() => addSet(ex.id)} style={{flex:1, padding:"9px", background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:10, color:"#a5b4fc", fontSize:14, fontWeight:700, cursor:"pointer"}}>+ Set</button>
                  </div>
                  {/* Column headers */}
                  <div style={{display:"grid", gridTemplateColumns:"32px 52px 1fr 1fr 44px", gap:6, marginBottom:6, padding:"0 2px"}}>
                    <div /><div style={{fontSize:9, color:"#334155", textTransform:"uppercase", textAlign:"center"}}>Last</div>
                    <div style={{fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:1, textAlign:"center"}}>Reps</div>
                    <div style={{fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:1, textAlign:"center"}}>Weight</div>
                    <div style={{fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:1, textAlign:"center"}}>✓</div>
                  </div>
                  {/* Set rows */}
                  <div style={{display:"flex", flexDirection:"column", gap:8}}>
                    {Array.from({length: ex.sets}, (_, i) => {
                      const s = getSet(ex.id, i);
                      const last = getLastRecord(ex.name, i);
                      return (
                        <div key={i} style={{display:"grid", gridTemplateColumns:"32px 52px 1fr 1fr 44px", gap:6, alignItems:"center", background:s.done?"rgba(99,102,241,0.1)":"rgba(255,255,255,0.03)", border:s.done?"1px solid rgba(99,102,241,0.25)":"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"8px 6px"}}>
                          <div style={{fontSize:11, fontWeight:700, color:s.done?"#a5b4fc":"#475569", textAlign:"center"}}>S{i+1}</div>
                          <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"4px 2px", minHeight:40}}>
                            {last ? (
                              <>
                                <span style={{fontSize:11, fontWeight:700, color:"#475569", lineHeight:1.2}}>{last.reps || "—"}</span>
                                <span style={{fontSize:9, color:"#334155", lineHeight:1.2}}>{last.weight ? last.weight + "lb" : "bw"}</span>
                              </>
                            ) : <span style={{fontSize:9, color:"#2d3748"}}>—</span>}
                          </div>
                          <input type="number" inputMode="numeric" placeholder={String(ex.reps)} value={s.reps} onChange={e => updateSet(ex.id, i, "reps", e.target.value)} style={{width:"100%", padding:"10px 4px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, color:"#f1f5f9", fontSize:15, fontWeight:600, outline:"none", textAlign:"center", boxSizing:"border-box"}} />
                          <input type="number" inputMode="decimal" placeholder="0" value={s.weight} onChange={e => updateSet(ex.id, i, "weight", e.target.value)} style={{width:"100%", padding:"10px 4px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, color:"#f1f5f9", fontSize:15, fontWeight:600, outline:"none", textAlign:"center", boxSizing:"border-box"}} />
                          <button onClick={() => toggleDone(ex.id, i)} style={{width:40, height:40, borderRadius:10, border:s.done?"none":"1.5px solid rgba(255,255,255,0.15)", background:s.done?"linear-gradient(135deg,#4f46e5,#7c3aed)":"rgba(255,255,255,0.04)", color:s.done?"#fff":"#64748b", fontSize:18, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>{s.done?"✓":"○"}</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MONTH VIEW */}
      {view === "month" && (
        <div style={{padding:"16px"}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
            <button onClick={() => { if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }} style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, width:38, height:38, color:"#94a3b8", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>‹</button>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:20, fontWeight:700, color:"#f1f5f9"}}>{MONTHS[calMonth]}</div>
              <div style={{fontSize:13, color:"#475569"}}>{calYear}</div>
            </div>
            <button onClick={() => { if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }} style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, width:38, height:38, color:"#94a3b8", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>›</button>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:6}}>
            {["S","M","T","W","T","F","S"].map((d,i) => <div key={i} style={{textAlign:"center", fontSize:11, fontWeight:700, color:"#475569", padding:"4px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4}}>
            {calCells.map((date, idx) => {
              if (!date) return <div key={idx} />;
              const dayName = DAYS[new Date(calYear, calMonth, date).getDay()];
              const exs = workouts[dayName] || [];
              const isToday = date===todayDate && calMonth===todayMonth && calYear===todayYear;
              const p = dayProgress(dayName);
              const isComplete = p && p.done===p.total;
              return (
                <button key={idx} onClick={() => {setSelectedDay(dayName); setView("week");}} style={{aspectRatio:"1", borderRadius:12, border:isToday?"1.5px solid #6366f1":"1.5px solid rgba(255,255,255,0.06)", background:isToday?"rgba(99,102,241,0.15)":isComplete?"rgba(5,150,105,0.12)":exs.length?"rgba(99,102,241,0.07)":"rgba(255,255,255,0.02)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2}}>
                  <span style={{fontSize:13, fontWeight:isToday?800:500, color:isToday?"#a5b4fc":isComplete?"#34d399":exs.length?"#e2e8f0":"#475569"}}>{date}</span>
                  {exs.length > 0 && (
                    <div style={{display:"flex", gap:2}}>
                      {exs.slice(0,3).map((_,i) => <div key={i} style={{width:4, height:4, borderRadius:"50%", background:isComplete?"#34d399":"#6366f1"}} />)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{display:"flex", gap:16, marginTop:16, justifyContent:"center"}}>
            {[{color:"#6366f1",label:"Has workout"},{color:"#34d399",label:"Completed"},{color:"rgba(99,102,241,0.4)",label:"Today",border:"1.5px solid #6366f1"}].map(item => (
              <div key={item.label} style={{display:"flex", alignItems:"center", gap:6}}>
                <div style={{width:10, height:10, borderRadius:"50%", background:item.color, border:item.border}} />
                <span style={{fontSize:11, color:"#475569"}}>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:20, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"14px 16px"}}>
            <div style={{fontSize:12, color:"#64748b", letterSpacing:1, textTransform:"uppercase", marginBottom:12}}>{MONTHS[calMonth]} Summary</div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10}}>
              {[
                {icon:"💪", value:DAYS.filter(d=>(workouts[d]||[]).length>0).length, label:"Active Days"},
                {icon:"📋", value:DAYS.reduce((a,d)=>a+(workouts[d]||[]).length,0), label:"Exercises"},
                {icon:"😴", value:7-DAYS.filter(d=>(workouts[d]||[]).length>0).length, label:"Rest Days"},
              ].map(s => (
                <div key={s.label} style={{textAlign:"center", padding:"10px 6px", background:"rgba(99,102,241,0.06)", borderRadius:12}}>
                  <div style={{fontSize:18, marginBottom:4}}>{s.icon}</div>
                  <div style={{fontSize:18, fontWeight:700, color:"#a5b4fc"}}>{s.value}</div>
                  <div style={{fontSize:10, color:"#475569", marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginTop:16}}>
            <div style={{fontSize:12, color:"#64748b", letterSpacing:1, textTransform:"uppercase", marginBottom:10}}>Schedule</div>
            {DAYS.filter(d=>(workouts[d]||[]).length>0).map(day => (
              <div key={day} onClick={() => {setSelectedDay(day); setView("week");}} style={{display:"flex", alignItems:"center", gap:12, padding:"10px 12px", marginBottom:6, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, cursor:"pointer"}}>
                <div style={{minWidth:40, fontSize:12, fontWeight:700, color:"#6366f1", textTransform:"uppercase"}}>{day}</div>
                <div style={{flex:1, fontSize:12, color:"#94a3b8"}}>{(safeWorkouts[day]||[]).map(e=>e.name).join(", ")}</div>
                <div style={{fontSize:11, color:"#475569"}}>{(safeWorkouts[day]||[]).length} ex</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEO PLAYER */}
      {videoPlayer && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(12px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:400, padding:"20px 16px"}} onClick={() => setVideoPlayer(null)}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
              <div>
                <div style={{fontSize:11, color:"#6366f1", letterSpacing:2, textTransform:"uppercase", marginBottom:3}}>How-To Guide</div>
                <div style={{fontSize:17, fontWeight:700, color:"#f1f5f9"}}>{videoPlayer.title}</div>
              </div>
              <button onClick={() => setVideoPlayer(null)} style={{background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, width:36, height:36, color:"#94a3b8", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>✕</button>
            </div>
            <div style={{position:"relative", width:"100%", paddingBottom:"56.25%", borderRadius:16, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)", background:"#000"}}>
              <iframe src={"https://www.youtube.com/embed/" + videoPlayer.videoId + "?autoplay=1&rel=0&modestbranding=1"} title={videoPlayer.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none"}} />
            </div>
            <div style={{marginTop:12, padding:"10px 14px", background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.15)", borderRadius:12, fontSize:12, color:"#64748b", textAlign:"center"}}>Watch the tutorial then come back to log your sets 💪</div>
          </div>
        </div>
      )}

      {/* LIBRARY MODAL */}
      {showLibrary && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", backdropFilter:"blur(12px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:500}} onClick={() => {setShowLibrary(false); setLibraryTarget(null);}}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480, background:"#13151f", borderRadius:"24px 24px 0 0", padding:"24px 20px 52px", border:"1px solid rgba(255,255,255,0.08)", borderBottom:"none", maxHeight:"88vh", overflowY:"auto"}}>
            <div style={{width:36, height:4, background:"#334155", borderRadius:2, margin:"0 auto 20px"}} />
            {libraryTarget ? (
              <>
                <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
                  <button onClick={() => setLibraryTarget(null)} style={{background:"rgba(255,255,255,0.06)", border:"none", borderRadius:8, padding:"6px 10px", color:"#94a3b8", fontSize:13, cursor:"pointer"}}>← Back</button>
                  <div style={{fontSize:16, fontWeight:700, color:"#f1f5f9"}}>Load onto which day?</div>
                </div>
                <div style={{display:"flex", flexDirection:"column", gap:8}}>
                  {DAYS.map(day => (
                    <button key={day} onClick={() => loadFromLibrary(libraryTarget, day)} style={{padding:"13px 16px", background:day===today?"rgba(99,102,241,0.1)":"rgba(255,255,255,0.03)", border:day===today?"1px solid rgba(99,102,241,0.3)":"1px solid rgba(255,255,255,0.07)", borderRadius:14, color:"#e2e8f0", fontSize:14, fontWeight:600, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                      <span>{FULL_DAYS[DAYS.indexOf(day)]}</span>
                      <div style={{display:"flex", gap:8, alignItems:"center"}}>
                        {day===today && <span style={{fontSize:10, color:"#6366f1", background:"rgba(99,102,241,0.15)", padding:"2px 6px", borderRadius:6}}>TODAY</span>}
                        <span style={{fontSize:11, color:"#475569"}}>{(safeWorkouts[day]||[]).length} exercises</span>
                        <span style={{color:"#475569"}}>›</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{fontSize:20, fontWeight:700, color:"#f1f5f9", marginBottom:4}}>📚 Workout Library</div>
                <div style={{fontSize:13, color:"#64748b", marginBottom:20}}>Saved workouts you can reload onto any day</div>
                {library.length === 0 ? (
                  <div style={{textAlign:"center", padding:"40px 20px", color:"#334155", fontSize:13}}>
                    <div style={{fontSize:36, marginBottom:12}}>📚</div>
                    <div style={{color:"#475569", marginBottom:8}}>Library is empty</div>
                    <div style={{fontSize:12, color:"#334155", lineHeight:1.6}}>Complete a workout and tap 📊 Stats — it saves automatically.</div>
                  </div>
                ) : library.map(entry => (
                  <div key={entry.id} style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"14px", marginBottom:10}}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10}}>
                      <div>
                        <div style={{fontSize:14, fontWeight:700, color:"#f1f5f9"}}>{entry.name}</div>
                        <div style={{fontSize:11, color:"#475569", marginTop:2}}>{entry.exercises.length} exercises · {entry.date}</div>
                      </div>
                      <button onClick={() => deleteFromLibrary(entry.id)} style={{background:"none", border:"none", color:"#334155", fontSize:16, cursor:"pointer"}}>✕</button>
                    </div>
                    <div style={{display:"flex", flexWrap:"wrap", gap:6, marginBottom:12}}>
                      {entry.exercises.map((ex,i) => <span key={i} style={{background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.15)", borderRadius:8, padding:"3px 8px", fontSize:11, color:"#a5b4fc"}}>{ex.name} {ex.sets}×{ex.reps}</span>)}
                    </div>
                    <button onClick={() => setLibraryTarget(entry)} style={{width:"100%", padding:"10px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:10, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer"}}>Load onto a day →</button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* MOVE TO DAY MODAL */}
      {moveModal && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, padding:20}} onClick={() => setMoveModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:360, background:"#13151f", borderRadius:20, padding:"24px 20px", border:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{fontSize:16, fontWeight:700, color:"#f1f5f9", marginBottom:4}}>Move Exercise</div>
            <div style={{fontSize:13, color:"#64748b", marginBottom:16}}>Move <span style={{color:"#a5b4fc", fontWeight:600}}>{moveModal.name}</span> to:</div>
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {DAYS.filter(d => d!==selectedDay).map(day => (
                <button key={day} onClick={() => moveToDay(moveModal, day)} style={{padding:"12px 16px", background:"rgba(99,102,241,0.07)", border:"1px solid rgba(99,102,241,0.15)", borderRadius:12, color:"#e2e8f0", fontSize:14, fontWeight:600, cursor:"pointer", display:"flex", justifyContent:"space-between"}}>
                  <span>{FULL_DAYS[DAYS.indexOf(day)]}</span>
                  <span style={{fontSize:11, color:"#475569"}}>{(safeWorkouts[day]||[]).length} exercises</span>
                </button>
              ))}
            </div>
            <button onClick={() => setMoveModal(null)} style={{width:"100%", marginTop:14, padding:"12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, color:"#64748b", fontSize:14, cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {showHistory && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(12px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:500}} onClick={() => {setShowHistory(false); setHistoryDetail(null);}}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480, background:"#13151f", borderRadius:"24px 24px 0 0", padding:"24px 20px 48px", border:"1px solid rgba(255,255,255,0.08)", borderBottom:"none", maxHeight:"88vh", overflowY:"auto"}}>
            <div style={{width:36, height:4, background:"#334155", borderRadius:2, margin:"0 auto 20px"}} />
            {historyDetail ? (
              <>
                <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
                  <button onClick={() => setHistoryDetail(null)} style={{background:"rgba(255,255,255,0.06)", border:"none", borderRadius:8, padding:"6px 10px", color:"#94a3b8", fontSize:13, cursor:"pointer"}}>← Back</button>
                  <div>
                    <div style={{fontSize:17, fontWeight:700, color:"#f1f5f9"}}>{history[historyDetail].fullDay}</div>
                    <div style={{fontSize:12, color:"#64748b"}}>{history[historyDetail].date} · {history[historyDetail].completedAt}</div>
                  </div>
                </div>
                {history[historyDetail].exercises.map((ex, ei) => (
                  <div key={ei} style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"12px 14px", marginBottom:10}}>
                    <div style={{fontSize:15, fontWeight:700, color:"#f1f5f9", marginBottom:8}}>{ex.name}</div>
                    {ex.sets.map((s, si) => (
                      <div key={si} style={{display:"flex", gap:12, fontSize:12, color:"#64748b", marginBottom:4}}>
                        <span style={{color:"#475569", minWidth:32}}>S{si+1}</span>
                        <span>{s.reps || ex.reps} reps</span>
                        {s.weight && <span style={{color:"#a5b4fc"}}>{s.weight} lbs</span>}
                        {s.done && <span style={{color:"#34d399"}}>✓</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <>
                <div style={{fontSize:20, fontWeight:700, color:"#f1f5f9", marginBottom:4}}>📖 Workout History</div>
                <div style={{fontSize:13, color:"#64748b", marginBottom:20}}>All completed workouts</div>
                {Object.keys(history).length === 0 ? (
                  <div style={{textAlign:"center", padding:"40px 20px", color:"#334155", fontSize:13}}>
                    <div style={{fontSize:32, marginBottom:10}}>🗂️</div>No history yet. Complete a workout and tap 📊 Stats!
                  </div>
                ) : Object.entries(history).sort((a,b) => b[0].localeCompare(a[0])).map(([key, rec]) => (
                  <button key={key} onClick={() => setHistoryDetail(key)} style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"12px 14px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", marginBottom:8, textAlign:"left"}}>
                    <div>
                      <div style={{fontSize:14, fontWeight:700, color:"#f1f5f9"}}>{rec.fullDay}</div>
                      <div style={{fontSize:12, color:"#64748b", marginTop:2}}>{rec.date} · {rec.completedAt}</div>
                      <div style={{fontSize:11, color:"#475569", marginTop:2}}>{rec.exercises.length} exercises</div>
                    </div>
                    <div style={{fontSize:20, color:"#334155"}}>›</div>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* STATS MODAL */}
      {showStats && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(10px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200}} onClick={() => setShowStats(false)}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480, background:"#13151f", borderRadius:"24px 24px 0 0", padding:"24px 20px 44px", border:"1px solid rgba(255,255,255,0.08)", borderBottom:"none", maxHeight:"85vh", overflowY:"auto"}}>
            <div style={{width:36, height:4, background:"#334155", borderRadius:2, margin:"0 auto 20px"}} />
            <div style={{fontSize:20, fontWeight:700, color:"#f1f5f9", marginBottom:4}}>🏆 Workout Complete!</div>
            <div style={{fontSize:13, color:"#64748b", marginBottom:20}}>{FULL_DAYS[DAYS.indexOf(selectedDay)]} · Performance Summary</div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20}}>
              {[
                {label:"Total Volume", value:stats.totalVolume>0?stats.totalVolume.toLocaleString()+" lbs":"—", icon:"🏋️"},
                {label:"Total Reps", value:stats.totalReps, icon:"🔁"},
                {label:"Sets Done", value:stats.totalSets, icon:"✅"},
              ].map(s => (
                <div key={s.label} style={{background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:14, padding:"12px 8px", textAlign:"center"}}>
                  <div style={{fontSize:20, marginBottom:4}}>{s.icon}</div>
                  <div style={{fontSize:15, fontWeight:700, color:"#a5b4fc"}}>{s.value}</div>
                  <div style={{fontSize:10, color:"#475569", marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:12, color:"#64748b", letterSpacing:1, textTransform:"uppercase", marginBottom:10}}>Per Exercise</div>
            {stats.exStats.map((ex, idx) => (
              <div key={idx} style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"12px 14px", marginBottom:10}}>
                <div style={{fontSize:15, fontWeight:700, color:"#f1f5f9", marginBottom:8}}>{ex.name}</div>
                <div style={{display:"flex", gap:16, flexWrap:"wrap"}}>
                  <div><span style={{fontSize:11, color:"#475569"}}>Volume </span><span style={{fontSize:13, fontWeight:600, color:"#a5b4fc"}}>{ex.volume>0?ex.volume.toLocaleString()+" lbs":"—"}</span></div>
                  <div><span style={{fontSize:11, color:"#475569"}}>Reps </span><span style={{fontSize:13, fontWeight:600, color:"#a5b4fc"}}>{ex.reps}</span></div>
                  {ex.bestSet && ex.bestSet.weight>0 && <div><span style={{fontSize:11, color:"#475569"}}>Best </span><span style={{fontSize:13, fontWeight:600, color:"#34d399"}}>S{ex.bestSet.set}: {ex.bestSet.reps}r × {ex.bestSet.weight}lbs</span></div>}
                </div>
              </div>
            ))}
            <button onClick={() => setShowStats(false)} style={{width:"100%", marginTop:20, padding:"14px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer"}}>Done 💪</button>
          </div>
        </div>
      )}

      {/* ADD EXERCISE MODAL */}
      {showAdd && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100}} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480, background:"#13151f", borderRadius:"24px 24px 0 0", padding:"24px 20px 40px", border:"1px solid rgba(255,255,255,0.08)", borderBottom:"none"}}>
            <div style={{width:36, height:4, background:"#334155", borderRadius:2, margin:"0 auto 20px"}} />
            <div style={{fontSize:18, fontWeight:700, marginBottom:16, color:"#f1f5f9"}}>Add Exercise · {FULL_DAYS[DAYS.indexOf(selectedDay)]}</div>
            <div style={{display:"flex", gap:8, marginBottom:20, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:4}}>
              {["manual","ai"].map(tab => (
                <button key={tab} onClick={() => setAddTab(tab)} style={{flex:1, padding:"8px", borderRadius:9, border:"none", cursor:"pointer", background:addTab===tab?"linear-gradient(135deg,#4f46e5,#7c3aed)":"transparent", color:addTab===tab?"#fff":"#64748b", fontSize:13, fontWeight:600}}>
                  {tab==="manual"?"✏️ Manual":"✨ Ask AI"}
                </button>
              ))}
            </div>
            {addTab === "manual" ? (
              <>
                {[{label:"Exercise Name",key:"name",placeholder:"e.g. Bench Press",type:"text"},{label:"Sets",key:"sets",placeholder:"e.g. 4",type:"number"},{label:"Target Reps",key:"reps",placeholder:"e.g. 8",type:"number"},{label:"Video URL (optional)",key:"video",placeholder:"YouTube video ID",type:"text"}].map(f => (
                  <div key={f.key} style={{marginBottom:14}}>
                    <label style={{fontSize:11, color:"#64748b", letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:6}}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={newEx[f.key]} onChange={e => setNewEx(prev => ({...prev, [f.key]:e.target.value}))} style={inp} />
                  </div>
                ))}
                <button onClick={addManual} style={{width:"100%", padding:"14px", background:(!newEx.name||!newEx.sets||!newEx.reps)?"rgba(99,102,241,0.3)":"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:700, cursor:(newEx.name&&newEx.sets&&newEx.reps)?"pointer":"not-allowed", marginTop:8}}>Add Exercise</button>
              </>
            ) : (
              <>
                <div style={{fontSize:13, color:"#64748b", marginBottom:12}}>Describe what you want and AI fills in the details.</div>
                <textarea placeholder='e.g. "Add 4 sets of push-ups and 3 sets of dips"' value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={3} style={{...inp, resize:"none", fontFamily:"inherit"}} />
                {aiError && <div style={{color:"#f87171", fontSize:12, marginTop:8}}>{aiError}</div>}
                <button onClick={addWithAI} disabled={aiLoading||!aiPrompt.trim()} style={{width:"100%", padding:"14px", marginTop:14, background:(!aiPrompt.trim()||aiLoading)?"rgba(99,102,241,0.3)":"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:700, cursor:(!aiPrompt.trim()||aiLoading)?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
                  {aiLoading ? <><span style={{display:"inline-block", width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite"}} /> Adding...</> : "✨ Add with AI"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* WEEK PLANNER MODAL */}
      {showPlanner && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(10px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:300}} onClick={() => setShowPlanner(false)}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480, background:"#13151f", borderRadius:"24px 24px 0 0", padding:"24px 20px 44px", border:"1px solid rgba(255,255,255,0.08)", borderBottom:"none", maxHeight:"90vh", overflowY:"auto"}}>
            <div style={{width:36, height:4, background:"#334155", borderRadius:2, margin:"0 auto 20px"}} />
            <div style={{fontSize:20, fontWeight:700, color:"#f1f5f9", marginBottom:4}}>🗓 Plan Your Week</div>
            <div style={{fontSize:13, color:"#64748b", marginBottom:16}}>Describe your plan and AI schedules everything automatically.</div>
            {["Push/pull/legs: Mon push, Tue pull, Wed legs, Thu push, Fri pull, Sat legs", "5-day upper/lower: Mon upper, Tue lower, Wed rest, Thu upper, Fri lower", "Build me a 5-day strength program with compound lifts"].map((ex,i) => (
              <button key={i} onClick={() => setPlannerPrompt(ex)} style={{display:"block", width:"100%", textAlign:"left", background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.15)", borderRadius:10, padding:"8px 12px", color:"#94a3b8", fontSize:12, cursor:"pointer", marginBottom:6, lineHeight:1.4}}>{ex}</button>
            ))}
            <textarea placeholder="Describe your weekly workout plan..." value={plannerPrompt} onChange={e => {setPlannerPrompt(e.target.value); setPlannerPreview(null); setPlannerError("");}} rows={4} style={{...inp, resize:"none", fontFamily:"inherit", lineHeight:1.5, marginTop:8}} />
            {plannerError && <div style={{color:"#f87171", fontSize:12, marginTop:8}}>{plannerError}</div>}
            {plannerPreview && (
              <div style={{marginTop:16}}>
                <div style={{fontSize:11, color:"#34d399", letterSpacing:1, textTransform:"uppercase", marginBottom:10}}>✓ Preview — {DAYS.filter(d=>plannerPreview[d]?.length>0).length} active days</div>
                {DAYS.map(day => {
                  const exs = plannerPreview[day] || [];
                  return (
                    <div key={day} style={{display:"flex", gap:10, alignItems:"flex-start", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                      <div style={{minWidth:36, fontSize:11, fontWeight:700, color:exs.length?"#a5b4fc":"#334155", textTransform:"uppercase", letterSpacing:1, paddingTop:2}}>{day}</div>
                      <div style={{flex:1}}>
                        {exs.length===0 ? <span style={{fontSize:12, color:"#334155"}}>Rest</span> : exs.map((ex,i) => (
                          <div key={i} style={{fontSize:12, color:"#94a3b8", marginBottom:2}}>
                            <span style={{color:"#e2e8f0", fontWeight:600}}>{ex.name}</span>
                            <span style={{color:"#475569"}}> · {ex.sets}×{ex.reps}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div style={{display:"flex", gap:8, marginTop:14, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:4}}>
                  {["replace","add"].map(m => (
                    <button key={m} onClick={() => setPlannerMode(m)} style={{flex:1, padding:"8px", borderRadius:9, border:"none", cursor:"pointer", background:plannerMode===m?"linear-gradient(135deg,#4f46e5,#7c3aed)":"transparent", color:plannerMode===m?"#fff":"#64748b", fontSize:13, fontWeight:600}}>
                      {m==="replace"?"🔄 Replace":"➕ Add to current"}
                    </button>
                  ))}
                </div>
                <button onClick={applyPlan} style={{width:"100%", padding:"14px", marginTop:10, background:"linear-gradient(135deg,#059669,#10b981)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer"}}>Apply Plan ✓</button>
              </div>
            )}
            {!plannerPreview && (
              <button onClick={generatePlan} disabled={plannerLoading||!plannerPrompt.trim()} style={{width:"100%", padding:"14px", marginTop:14, background:(!plannerPrompt.trim()||plannerLoading)?"rgba(99,102,241,0.3)":"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:700, cursor:(!plannerPrompt.trim()||plannerLoading)?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
                {plannerLoading ? <><span style={{display:"inline-block", width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite"}} /> Generating...</> : "✨ Generate Plan"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
