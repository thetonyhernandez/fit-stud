import { useState, useEffect, useCallback, useRef } from "react";

import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://txddetoycdwoatruhojs.supabase.co";
const SUPABASE_KEY = "sb_publishable_T9zfSOIL4-1ROn3csWw1qw_FK-DNbaW";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
    {id:10, name:"Flat Bench Press", sets:5, reps:6, video:"dblHPPUfRtE"},
    {id:11, name:"Incline Dumbbell Press", sets:4, reps:10, video:"8iPEnn-ltC8"},
    {id:12, name:"Chest Fly / Cable Fly", sets:4, reps:12, video:"Iwe6AmxVf7o"},
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


const EXERCISE_LIBRARY = [
  { category:"Push", icon:"💪", subs:[
    { name:"Chest", exercises:[
      {name:"Flat Bench Press", sets:4, reps:8, video:"dblHPPUfRtE", desc:"Lower the bar to your chest under control and press upward until your arms are extended."},
      {name:"Incline Dumbbell Press", sets:4, reps:10, video:"8iPEnn-ltC8", desc:"Press the dumbbells upward from an incline bench and lower slowly to chest level."},
      {name:"Decline Bench Press", sets:4, reps:10, video:"LfyQTbGjhKo", desc:"Lower the bar to your lower chest and press upward while maintaining control."},
      {name:"Chest Fly", sets:4, reps:12, video:"Iwe6AmxVf7o", desc:"Bring your arms together in a wide arc and squeeze your chest at the center."},
      {name:"Cable Fly", sets:4, reps:12, video:"Iwe6AmxVf7o", desc:"Pull the handles together in front of your chest while maintaining a slight bend in your elbows."},
      {name:"Push-Up", sets:3, reps:15, video:"IODxDxX7oi4", desc:"Keep your body straight and lower your chest to the floor before pressing back up."},
    ]},
    { name:"Shoulders", exercises:[
      {name:"Dumbbell Shoulder Press", sets:4, reps:10, video:"qEwKCR5JCog", desc:"Press the dumbbells overhead and lower them back to shoulder level with control."},
      {name:"Arnold Press", sets:4, reps:10, video:"6Z15_WdXmVw", desc:"Rotate your palms outward as you press overhead and reverse the movement on the way down."},
      {name:"Lateral Raises", sets:3, reps:15, video:"ygWMEFQNJxM", desc:"Raise the dumbbells out to your sides until shoulder height and lower slowly."},
      {name:"Front Raises", sets:3, reps:12, video:"gkbSqBBHqvI", desc:"Lift the weight straight in front of you to shoulder height and lower under control."},
    ]},
    { name:"Triceps", exercises:[
      {name:"Tricep Rope Pushdown", sets:4, reps:12, video:"vB5OHsJ3EME", desc:"Push the rope downward while keeping your elbows tucked close to your sides."},
      {name:"Overhead Tricep Extension", sets:4, reps:12, video:"_gsUck-7M74", desc:"Lower the weight behind your head and extend your arms upward."},
      {name:"Dips", sets:3, reps:12, video:"2z8JmcrW-As", desc:"Lower your body by bending your elbows and push yourself back to the starting position."},
      {name:"Skull Crushers", sets:4, reps:12, video:"d_KZxkY_5cM", desc:"Lower the weight toward your forehead and extend your arms back to the top."},
    ]},
  ]},
  { category:"Pull", icon:"🔙", subs:[
    { name:"Back", exercises:[
      {name:"Pull-Ups", sets:4, reps:8, video:"eGo4IYlbE5g", desc:"Pull your chest toward the bar and lower yourself with control."},
      {name:"Lat Pulldown", sets:4, reps:12, video:"CAwf7n6Luuc", desc:"Pull the bar to your upper chest while driving your elbows down."},
      {name:"Close-Grip Lat Pulldown", sets:4, reps:12, video:"CAwf7n6Luuc", desc:"Pull the handle toward your upper chest while keeping your elbows close to your body."},
      {name:"Seated Cable Row", sets:4, reps:12, video:"HJSVR_67OlM", desc:"Pull the handle toward your torso and squeeze your shoulder blades together."},
      {name:"Barbell Row", sets:4, reps:8, video:"vT2GjY_Umpw", desc:"Pull the bar toward your stomach while keeping your back flat."},
      {name:"Dumbbell Row", sets:4, reps:10, video:"roCP6wCXPqo", desc:"Pull the dumbbell toward your hip and lower it slowly."},
      {name:"T-Bar Row", sets:4, reps:10, video:"j3SNFNAvLYE", desc:"Pull the handle toward your chest and squeeze your back at the top."},
      {name:"Face Pull", sets:4, reps:15, video:"rep-qVOkqgk", desc:"Pull the rope toward your face with elbows high and squeeze your rear delts."},
      {name:"Rear Delt Fly", sets:4, reps:15, video:"6yMdhi2DVao", desc:"Open your arms outward and squeeze your rear shoulders."},
      {name:"Pec Deck Rear Delt Fly", sets:4, reps:15, video:"EA7u4Q_8HQ0", desc:"Push the handles outward in a reverse fly motion and squeeze your upper back."},
    ]},
    { name:"Biceps", exercises:[
      {name:"EZ Bar Curl", sets:4, reps:12, video:"kwG2ipFRgfo", desc:"Curl the bar toward your shoulders and lower slowly."},
      {name:"Barbell Curl", sets:4, reps:12, video:"kwG2ipFRgfo", desc:"Curl the weight without swinging and maintain control throughout."},
      {name:"Dumbbell Curl", sets:4, reps:12, video:"ykJmrZ5v0Oo", desc:"Curl the dumbbells toward your shoulders while keeping elbows stationary."},
      {name:"Hammer Curl", sets:4, reps:12, video:"zC3nLlEvin4", desc:"Keep your palms facing inward and curl the weights upward."},
      {name:"Preacher Curl", sets:3, reps:15, video:"fIWP-FRFNU0", desc:"Curl the weight while resting your arms on the pad and lower slowly."},
    ]},
  ]},
  { category:"Legs", icon:"🦵", subs:[
    { name:"Quads", exercises:[
      {name:"Goblet Squat", sets:4, reps:12, video:"MeIiIdhvXT4", desc:"Hold the weight at your chest and squat while keeping your chest up."},
      {name:"Barbell Squat", sets:4, reps:6, video:"ultWZbUMPL8", desc:"Lower your hips until your thighs are parallel to the floor and stand back up."},
      {name:"Front Squat", sets:4, reps:8, video:"uYumuL_G_V0", desc:"Keep the bar on the front of your shoulders and squat while staying upright."},
      {name:"Leg Press", sets:4, reps:12, video:"IZxyjW7MPJQ", desc:"Press the platform away from your body and return under control."},
      {name:"Leg Extension", sets:4, reps:15, video:"YyvSfVjQeL0", desc:"Extend your legs until straight and squeeze your quads at the top."},
    ]},
    { name:"Hamstrings", exercises:[
      {name:"Deadlift", sets:5, reps:5, video:"XxWcirHIwVo", desc:"Lift the weight by driving through your heels while keeping your back straight."},
      {name:"Romanian Deadlift", sets:4, reps:10, video:"2SHsk9AzdjA", desc:"Push your hips back and lower the weight until you feel a hamstring stretch."},
      {name:"Seated Hamstring Curl", sets:4, reps:12, video:"y19_9B0s2uA", desc:"Curl the pad downward using your hamstrings and return slowly."},
      {name:"Lying Hamstring Curl", sets:4, reps:12, video:"y19_9B0s2uA", desc:"Curl the weight toward your glutes and lower with control."},
    ]},
    { name:"Athletic Legs", exercises:[
      {name:"Walking Lunges", sets:4, reps:20, video:"kRzcRkKy1ns", desc:"Step forward into a lunge and continue alternating legs while walking."},
      {name:"Bulgarian Split Squat", sets:4, reps:10, video:"2C-uNgKwPLE", desc:"Lower your body using one leg while the rear foot remains elevated."},
    ]},
    { name:"Calves", exercises:[
      {name:"Standing Calf Raise", sets:5, reps:20, video:"gwLzBv9RP30", desc:"Raise your heels high and slowly lower them back down."},
      {name:"Seated Calf Raise", sets:4, reps:20, video:"gwLzBv9RP30", desc:"Lift your heels upward and pause before lowering slowly."},
    ]},
  ]},
  { category:"Glutes", icon:"🍑", subs:[
    { name:"Glute Exercises", exercises:[
      {name:"Hip Thrust", sets:4, reps:12, video:"xDmFkJxPzeM", desc:"Drive your hips upward and squeeze your glutes at the top."},
      {name:"Glute Bridge", sets:4, reps:15, video:"jQkKeL4Cg8M", desc:"Lift your hips from the floor while squeezing your glutes."},
      {name:"Cable Kickback", sets:4, reps:15, video:"jFENS0YA0Bc", desc:"Kick your leg backward against resistance while keeping your torso stable."},
      {name:"Hip Abductor Machine", sets:4, reps:15, video:"G_8LItOiZ0Q", desc:"Push your knees outward and squeeze your glutes."},
      {name:"Sumo Squat", sets:4, reps:12, video:"aVFHn7B3RXI", desc:"Use a wide stance and squat while keeping your chest up."},
      {name:"Step-Ups", sets:4, reps:12, video:"dQqApCGd5Ss", desc:"Step onto a platform and drive through your lead leg."},
      {name:"Single-Leg Romanian Deadlift", sets:4, reps:10, video:"2SHsk9AzdjA", desc:"Hinge at the hips while balancing on one leg and return to standing."},
    ]},
  ]},
  { category:"Core & Abs", icon:"⚡", subs:[
    { name:"Core", exercises:[
      {name:"Weighted Crunch", sets:4, reps:20, video:"wkD8rjkodUI", desc:"Hold a weight against your chest and crunch upward."},
      {name:"Russian Twist", sets:4, reps:20, video:"wkD8rjkodUI", desc:"Rotate side to side while keeping your core tight."},
      {name:"Cable Crunch", sets:4, reps:15, video:"e4iSCKRHaQk", desc:"Pull the rope downward by contracting your abs."},
      {name:"Hanging Leg Raise", sets:4, reps:15, video:"hdng3Nm1x_E", desc:"Raise your legs while hanging and lower under control."},
      {name:"Reverse Crunch", sets:4, reps:20, video:"Xyd_fa5zoEU", desc:"Lift your hips off the floor using your lower abs."},
      {name:"Plank", sets:3, reps:1, video:"ASdvN_XEl_c", desc:"Hold a straight-body position while bracing your core."},
      {name:"Side Plank", sets:3, reps:1, video:"_6vjo5omkMQ", desc:"Support your body on one side and maintain a straight line."},
      {name:"Bicycle Crunch", sets:4, reps:20, video:"1we3bh9uhqY", desc:"Alternate elbow-to-knee movements while keeping tension on the abs."},
      {name:"Ab Wheel Rollout", sets:4, reps:12, video:"YXubBPBDkSE", desc:"Roll forward while maintaining a tight core and return slowly."},
      {name:"Cable Woodchopper", sets:4, reps:15, video:"AU-4zSxzi0I", desc:"Rotate your torso while pulling the cable across your body."},
    ]},
  ]},
  { category:"Functional", icon:"🔥", subs:[
    { name:"Functional Fitness", exercises:[
      {name:"Sled Push", sets:4, reps:1, video:"SItS3bwnSmI", desc:"Drive the sled forward using powerful leg drive and full-body tension."},
      {name:"Sled Pull", sets:4, reps:1, video:"SItS3bwnSmI", desc:"Pull the sled toward you with a rope while keeping your core tight."},
      {name:"Farmer Carry", sets:4, reps:1, video:"Fkzk_RqlYig", desc:"Walk with heavy weights in each hand while keeping your core braced."},
      {name:"Kettlebell Swing", sets:4, reps:20, video:"ZYgRuQoh6Qc", desc:"Hinge at the hips and drive the kettlebell forward with explosive hip extension."},
      {name:"Battle Ropes", sets:4, reps:1, video:"Y6nFmyQ5SR0", desc:"Alternate waves or slam the ropes while maintaining a strong athletic stance."},
      {name:"SkiErg", sets:4, reps:1, video:"", desc:"Pull the handles down explosively while engaging your core and arms."},
      {name:"Box Jump", sets:4, reps:8, video:"52FsXzBKGgE", desc:"Jump onto the box with both feet and land softly before stepping back down."},
      {name:"Medicine Ball Slams", sets:4, reps:12, video:"KN4LkwSvE_c", desc:"Raise the ball overhead and slam it down with maximum force."},
    ]},
    { name:"Conditioning", exercises:[
      {name:"HIIT Sprints", sets:8, reps:1, video:"", desc:"Sprint at maximum effort for 20-30 seconds followed by equal rest."},
      {name:"Assault Bike", sets:5, reps:1, video:"", desc:"Pedal and push-pull the handles at high intensity for set intervals."},
      {name:"Rowing Intervals", sets:5, reps:1, video:"", desc:"Row at maximum effort for timed intervals with brief recovery periods."},
      {name:"Burpees", sets:4, reps:10, video:"dZgVxmf6jkA", desc:"Drop to the floor, perform a push-up, jump up and repeat continuously."},
      {name:"Jump Rope", sets:5, reps:1, video:"", desc:"Jump rope continuously keeping a steady rhythm and light on your feet."},
    ]},
    { name:"Cardio", exercises:[
      {name:"Walking", sets:1, reps:1, video:"", desc:"Maintain a brisk walking pace to elevate your heart rate."},
      {name:"Running", sets:1, reps:1, video:"", desc:"Maintain steady pace focusing on form — arms relaxed, upright posture."},
      {name:"Stair Climber", sets:1, reps:1, video:"", desc:"Climb at a steady pace while keeping your chest up and core engaged."},
      {name:"Rowing Machine", sets:1, reps:1, video:"", desc:"Drive with your legs first then pull the handle to your lower chest."},
      {name:"Cycling", sets:1, reps:1, video:"", desc:"Maintain steady cadence with resistance appropriate to your fitness level."},
    ]},
  ]},
  { category:"Mobility", icon:"🧘", subs:[
    { name:"Mobility & Recovery", exercises:[
      {name:"Hip Mobility", sets:2, reps:10, video:"", desc:"Move through full range hip circles and stretches to improve joint mobility."},
      {name:"Ankle Mobility", sets:2, reps:10, video:"", desc:"Perform ankle circles and calf stretches to improve ankle range of motion."},
      {name:"Shoulder Mobility", sets:2, reps:10, video:"", desc:"Use arm circles and cross-body stretches to loosen shoulder joints."},
      {name:"Thoracic Spine Mobility", sets:2, reps:10, video:"", desc:"Use a foam roller or cat-cow movements to improve upper back mobility."},
      {name:"Full Body Mobility", sets:1, reps:1, video:"", desc:"Flow through a sequence of mobility exercises covering all major joints."},
      {name:"Foam Rolling", sets:1, reps:1, video:"", desc:"Roll slowly over tight muscle groups pausing on tender spots for 30 seconds."},
      {name:"Active Recovery", sets:1, reps:1, video:"", desc:"Light movement like walking or swimming to promote blood flow and recovery."},
    ]},
  ]},
];

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
  const [showCongrats, setShowCongrats] = useState(false);
  const [theme, setTheme] = useState(() => load("fs_theme", "gold"));
  const [videoPlayer, setVideoPlayer] = useState(null);
  const [showPlanner, setShowPlanner] = useState(false);
  const [plannerPrompt, setPlannerPrompt] = useState("");
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerError, setPlannerError] = useState("");
  const [plannerPreview, setPlannerPreview] = useState(null);
  const [plannerMode, setPlannerMode] = useState("replace");
  const [editMode, setEditMode] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const dragIndexRef = useRef(null);
  const [moveModal, setMoveModal] = useState(null);
  const [history, setHistory] = useState(() => load("fs_history", {}));
  const [showHistory, setShowHistory] = useState(false);
  const [historyDetail, setHistoryDetail] = useState(null);
  const [library, setLibrary] = useState(() => load("fs_library", []));
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryTarget, setLibraryTarget] = useState(null);
  const [libView, setLibView] = useState("categories"); // "categories" | "subcats" | "exercise"
  const [libCategory, setLibCategory] = useState(null);
  const [libSubcat, setLibSubcat] = useState(null);
  const [libExercise, setLibExercise] = useState(null);
  const [showSetup, setShowSetup] = useState(() => load("fs_workouts", null) === null);
  const [setupPrompt, setSetupPrompt] = useState("");
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState("");
  const [setupStep, setSetupStep] = useState("welcome"); // "welcome" | "questionnaire" | "building"
  const [userProfile, setUserProfile] = useState({
    goal: "", level: "", days: "", gender: "", age: "", equipment: "", injuries: ""
  });

  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState("");
  const [syncStatus, setSyncStatus] = useState("idle"); // "idle" | "saving" | "saved"
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [statsPeriod, setStatsPeriod] = useState("weekly");
  const [nutritionPeriod, setNutritionPeriod] = useState("daily");
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  const [mealPlanStep, setMealPlanStep] = useState("questions");
  const [mealProfile, setMealProfile] = useState({
    height:"", weight:"", goalWeight:"", goal:"",
    breakfastTime:"7:00 AM", lastMealTime:"7:00 PM",
    dietType:"", allergies:"", mealsPerDay:"3", activityLevel:""
  });
  const [mealPlanWeek, setMealPlanWeek] = useState(0); // 0-3 for 4 weeks
  const [checkedMeals, setCheckedMeals] = useState(() => JSON.parse(localStorage.getItem("fs_checked_meals")||"{}"));
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState("");
  const [mealPlan, setMealPlan] = useState(() => load("fs_mealplan", null));
  const [mealPlanError, setMealPlanError] = useState("");
  const [touchSwipeStart, setTouchSwipeStart] = useState(null);
  const [nutrition, setNutrition] = useState(() => load("fs_nutrition", {}));
  const [showNutrition, setShowNutrition] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileTab, setProfileTab] = useState("info"); // "info" | "progress" | "gallery" | "settings"
  const [profileData, setProfileData] = useState(() => load("fs_profile", {name:"", age:"", weight:"", height:"", goal:"", language:"English"}));
  const [avatarUrl, setAvatarUrl] = useState(() => load("fs_avatar", null));
  const [progressPhotos, setProgressPhotos] = useState(() => load("fs_progress_photos", {}));
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [messages, setMessages] = useState(() => load("fs_messages", [
    {id:1, from:"coach", text:"Welcome to FitStud! I am here to help you reach your goals. Feel free to message me anytime 💪", time:"Today"},
  ]));
  const [newMessage, setNewMessage] = useState("");

  // Auto-save to localStorage whenever data changes
  useEffect(() => { if (workouts) save("fs_workouts", workouts); }, [workouts]);
  useEffect(() => { save("fs_theme", theme); }, [theme]);
  useEffect(() => { save("fs_setdata", setData); }, [setData]);
  useEffect(() => { save("fs_history", history); }, [history]);
  useEffect(() => { save("fs_library", library); }, [library]);
  useEffect(() => { save("fs_nutrition", nutrition); }, [nutrition]);
  useEffect(() => { save("fs_profile", profileData); }, [profileData]);
  useEffect(() => { if(mealPlan) save("fs_mealplan", mealPlan); }, [mealPlan]);
  useEffect(() => { localStorage.setItem("fs_checked_meals", JSON.stringify(checkedMeals)); }, [checkedMeals]);
  useEffect(() => { save("fs_avatar", avatarUrl); }, [avatarUrl]);
  useEffect(() => { save("fs_progress_photos", progressPhotos); }, [progressPhotos]);
  useEffect(() => { save("fs_messages", messages); }, [messages]);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) loadFromSupabase(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadFromSupabase(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadFromSupabase = async (userId) => {
    try {
      const [w, s, h, l] = await Promise.all([
        supabase.from("user_workouts").select("workouts").eq("user_id", userId).single(),
        supabase.from("user_setdata").select("setdata").eq("user_id", userId).single(),
        supabase.from("user_history").select("history").eq("user_id", userId).single(),
        supabase.from("user_library").select("library").eq("user_id", userId).single(),
      ]);
      if (w.data?.workouts) { setWorkouts(w.data.workouts); setShowSetup(false); }
      if (s.data?.setdata) setSetDataState(s.data.setdata);
      if (h.data?.history) setHistory(h.data.history);
      if (l.data?.library) setLibrary(l.data.library);
    } catch(e) { console.log("Load error", e); }
  };

  const saveToSupabase = useCallback(async (table, field, data) => {
    if (!user) return;
    setSyncStatus("saving");
    try {
      const existing = await supabase.from(table).select("id").eq("user_id", user.id).single();
      if (existing.data) {
        await supabase.from(table).update({ [field]: data, updated_at: new Date().toISOString() }).eq("user_id", user.id);
      } else {
        await supabase.from(table).insert({ user_id: user.id, [field]: data });
      }
      setSyncStatus("saved");
      setTimeout(() => setSyncStatus("idle"), 2000);
    } catch(e) { console.log("Save error", e); setSyncStatus("idle"); }
  }, [user]);

  // Sync to Supabase when data changes
  useEffect(() => { if (user && workouts) saveToSupabase("user_workouts", "workouts", workouts); }, [workouts, user]);
  useEffect(() => { if (user) saveToSupabase("user_setdata", "setdata", setData); }, [setData, user]);
  useEffect(() => { if (user) saveToSupabase("user_history", "history", history); }, [history, user]);
  useEffect(() => { if (user) saveToSupabase("user_library", "library", library); }, [library, user]);

  const uploadAvatar = async (file) => {
    if (!user || !file) return;
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const path = user.id + "/avatar." + ext;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        setAvatarUrl(data.publicUrl + "?t=" + Date.now());
      }
    } catch(e) { console.log("Avatar upload error", e); }
    setUploadingAvatar(false);
  };

  const uploadProgressPhoto = async (file, monthKey) => {
    if (!user || !file) return;
    setUploadingPhoto(true);
    try {
      const ext = file.name.split(".").pop();
      const path = user.id + "/" + monthKey + "_" + Date.now() + "." + ext;
      const { error } = await supabase.storage.from("progress-photos").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("progress-photos").getPublicUrl(path);
        setProgressPhotos(prev => ({
          ...prev,
          [monthKey]: [...(prev[monthKey]||[]), data.publicUrl]
        }));
      }
    } catch(e) { console.log("Photo upload error", e); }
    setUploadingPhoto(false);
  };

  const getProgressPct = () => {
    const totalWorkouts = Object.keys(history).length;
    const target = 20;
    return Math.min(100, Math.round((totalWorkouts / target) * 100));
  };

  const handleSignUp = async () => {
    if (!authEmail || !authPassword) return;
    setAuthSubmitting(true); setAuthError("");
    const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    if (error) setAuthError(error.message);
    else { setShowAuth(false); setAuthEmail(""); setAuthPassword(""); }
    setAuthSubmitting(false);
  };

  const handleLogin = async () => {
    if (!authEmail || !authPassword) return;
    setAuthSubmitting(true); setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) setAuthError(error.message);
    else { setShowAuth(false); setAuthEmail(""); setAuthPassword(""); }
    setAuthSubmitting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const exercises = (workouts || EMPTY_WORKOUTS)[selectedDay] || [];
  // Reset finished banner when switching days
  useEffect(() => { setWorkoutFinished(false); }, [selectedDay]);

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

  const handleDragEnd = () => {
    const di = dragIndexRef.current;
    setDragOver(prev => {
      if (di !== null && prev !== null && di !== prev) {
        setWorkouts(w => {
          const list = [...(w[selectedDay]||[])];
          const [moved] = list.splice(di, 1);
          list.splice(prev, 0, moved);
          return {...w, [selectedDay]: list};
        });
      }
      return null;
    });
    setDragIndex(null);
    dragIndexRef.current = null;
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

  const QUOTES = [
    { msg: "You showed up. That is already more than most people did today.", emoji: "🔥" },
    { msg: "Every rep, every set — you are building a version of yourself that will not quit.", emoji: "💪" },
    { msg: "The pain you feel today is the strength you will feel tomorrow.", emoji: "⚡" },
    { msg: "You did not come this far to only come this far. Keep going.", emoji: "🚀" },
    { msg: "Champions are not born. They are built — exactly like you are doing right now.", emoji: "🏆" },
    { msg: "One workout closer to the body and life you are working for.", emoji: "🎯" },
    { msg: "Discipline is choosing what you want most over what you want now. You chose right.", emoji: "👑" },
    { msg: "Your future self is thanking you right now.", emoji: "✨" },
    { msg: "Greatness is not given. It is earned. Today you earned it.", emoji: "💎" },
    { msg: "The hardest part was starting. You did that. The rest is just details.", emoji: "🦁" },
  ];
  const getQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

  const THEMES = {
    gold: {
      bg: "#0B0B0B",
      card: "rgba(212,175,55,0.06)",
      cardBorder: "rgba(212,175,55,0.15)",
      cardActive: "rgba(212,175,55,0.12)",
      cardActiveBorder: "rgba(212,175,55,0.5)",
      accent: "linear-gradient(135deg,#D4AF37,#B8941F)",
      accentSolid: "#D4AF37",
      accentLight: "rgba(212,175,55,0.15)",
      accentBorder: "rgba(212,175,55,0.4)",
      accentText: "#D4AF37",
      accentMuted: "rgba(212,175,55,0.1)",
      text: "#FFFFFF",
      textSub: "#a1a1aa",
      textMuted: "#71717a",
      textDim: "#3f3f46",
      header: "rgba(0,0,0,0.6)",
      headerBorder: "rgba(212,175,55,0.15)",
      input: "rgba(212,175,55,0.06)",
      inputBorder: "rgba(212,175,55,0.2)",
      modal: "#111111",
      dayActive: "linear-gradient(135deg,#D4AF37,#B8941F)",
      dayActiveBorder: "#D4AF37",
      dayToday: "rgba(212,175,55,0.12)",
      handle: "#3f3f46",
      statBg: "rgba(212,175,55,0.08)",
      statBorder: "rgba(212,175,55,0.2)",
      toggleBg: "rgba(255,255,255,0.04)",
    },
    dark: {
      bg: "linear-gradient(135deg,#0a0a0f 0%,#111827 50%,#0d1117 100%)",
      card: "rgba(255,255,255,0.03)",
      cardBorder: "rgba(255,255,255,0.07)",
      cardActive: "rgba(229,57,53,0.08)",
      cardActiveBorder: "rgba(229,57,53,0.3)",
      accent: "linear-gradient(135deg,#E53935,#b71c1c)",
      accentSolid: "#E53935",
      accentLight: "rgba(229,57,53,0.15)",
      accentBorder: "rgba(229,57,53,0.3)",
      accentText: "#ef9a9a",
      accentMuted: "rgba(229,57,53,0.1)",
      text: "#f8fafc",
      textSub: "#94a3b8",
      textMuted: "#475569",
      textDim: "#334155",
      header: "rgba(255,255,255,0.02)",
      headerBorder: "rgba(255,255,255,0.06)",
      input: "rgba(255,255,255,0.07)",
      inputBorder: "rgba(255,255,255,0.12)",
      modal: "#13151f",
      dayActive: "linear-gradient(135deg,#E53935,#b71c1c)",
      dayActiveBorder: "#E53935",
      dayToday: "rgba(229,57,53,0.1)",
      handle: "#334155",
      statBg: "rgba(229,57,53,0.08)",
      statBorder: "rgba(229,57,53,0.2)",
      toggleBg: "rgba(255,255,255,0.04)",
    },
    light: {
      bg: "linear-gradient(135deg,#f8fafc 0%,#f1f5f9 50%,#e2e8f0 100%)",
      card: "rgba(255,255,255,0.9)",
      cardBorder: "rgba(0,0,0,0.08)",
      cardActive: "rgba(212,175,55,0.06)",
      cardActiveBorder: "rgba(212,175,55,0.3)",
      accent: "linear-gradient(135deg,#D4AF37,#B8941F)",
      accentSolid: "#D4AF37",
      accentLight: "rgba(212,175,55,0.1)",
      accentBorder: "rgba(212,175,55,0.3)",
      accentText: "#B8941F",
      accentMuted: "rgba(212,175,55,0.08)",
      text: "#0f172a",
      textSub: "#475569",
      textMuted: "#64748b",
      textDim: "#94a3b8",
      header: "rgba(255,255,255,0.8)",
      headerBorder: "rgba(0,0,0,0.08)",
      input: "rgba(0,0,0,0.04)",
      inputBorder: "rgba(0,0,0,0.12)",
      modal: "#ffffff",
      dayActive: "linear-gradient(135deg,#D4AF37,#B8941F)",
      dayActiveBorder: "#D4AF37",
      dayToday: "rgba(212,175,55,0.08)",
      handle: "#cbd5e1",
      statBg: "rgba(212,175,55,0.06)",
      statBorder: "rgba(212,175,55,0.2)",
      toggleBg: "rgba(0,0,0,0.04)",
    },
  };
  const t = THEMES[theme] || THEMES.gold;

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

  // Detect if exercise is time-based vs weight-based
  const getTodayKey = () => {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  };

  const getTodayNutrition = () => nutrition[getTodayKey()] || {calories:0, protein:0, carbs:0, fat:0, water:0, steps:0};

  const updateNutrition = (field, val) => {
    const key = getTodayKey();
    setNutrition(prev => ({...prev, [key]: {...(prev[key]||{calories:0,protein:0,carbs:0,fat:0,water:0,steps:0}), [field]: parseFloat(val)||0}}));
  };

  const isTimeBased = (name) => {
    const timeKeywords = ["sled","ski","row machine","battle rope","farmer carry","farmer carries","cardio","run","sprint","plank","hold","carry","carries","skierg","bike","rower","jump rope","box jump","burpee","mountain climber","bear crawl"];
    return timeKeywords.some(k => name.toLowerCase().includes(k));
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
  const inp = {width:"100%", padding:"12px 14px", background:t.input, border:"1.5px solid " + t.inputBorder, borderRadius:12, color:t.text, fontSize:15, outline:"none", boxSizing:"border-box"};

  // First time setup screen
  if (authLoading) {
    return (
      <div style={{minHeight:"100vh", background:"#0B0B0B", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16}}>
        <div style={{fontSize:24, fontWeight:900, letterSpacing:3, color:"#FFFFFF", fontFamily:"Montserrat,sans-serif", textTransform:"uppercase"}}>FITSTUD</div>
        <div style={{fontSize:9, letterSpacing:3, color:"#D4AF37", fontFamily:"Montserrat,sans-serif", fontWeight:600}}>FORGE YOUR LEGACY</div>
        <div style={{marginTop:16, width:24, height:24, border:"2px solid rgba(212,175,55,0.3)", borderTopColor:"#D4AF37", borderRadius:"50%", animation:"spin 0.8s linear infinite"}} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0a0a0f 0%,#111827 50%,#0d1117 100%)", fontFamily:"Poppins,system-ui,sans-serif", color:"#e2e8f0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center"}}>
        <div style={{fontSize:48, marginBottom:16}}>💪</div>
        <div style={{fontSize:32, fontWeight:900, color:"#FFFFFF", letterSpacing:4, marginBottom:4, fontFamily:"Montserrat,sans-serif", textTransform:"uppercase"}}>FITSTUD</div>
        <div style={{fontSize:11, letterSpacing:4, textTransform:"uppercase", color:"#D4AF37", marginBottom:8, fontFamily:"Montserrat,sans-serif", fontWeight:600}}>FORGE YOUR LEGACY</div>
        <div style={{fontSize:14, color:"#71717a", marginBottom:48, lineHeight:1.6, fontFamily:"Poppins,sans-serif"}}>The all-in-one workout tracker built for coaches and athletes</div>

        <div style={{width:"100%", maxWidth:380, display:"flex", flexDirection:"column", gap:12}}>
          <button onClick={() => {
            setWorkouts(DEFAULT_WORKOUTS);
            setShowSetup(false);
          }} style={{padding:"16px", background:"linear-gradient(135deg,#D4AF37,#B8941F)", border:"none", borderRadius:16, color:"#000", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Montserrat,sans-serif", letterSpacing:1, textTransform:"uppercase"}}>
            Load Month 1 Program
          </button>

          {/* AI Plan Builder - Questionnaire */}
          {setupStep === "welcome" && (
            <button onClick={() => setSetupStep("questionnaire")} style={{width:"100%", padding:"16px", background:"rgba(212,175,55,0.08)", border:"1px solid rgba(212,175,55,0.3)", borderRadius:16, color:"#D4AF37", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Montserrat,sans-serif", letterSpacing:1, textTransform:"uppercase"}}>
              ✨ Build My Custom Plan with AI
            </button>
          )}

          {setupStep === "questionnaire" && (
            <div style={{background:"rgba(212,175,55,0.05)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:16, padding:"16px", width:"100%"}}>
              <div style={{fontSize:13, fontWeight:800, color:"#D4AF37", marginBottom:16, fontFamily:"Montserrat,sans-serif", letterSpacing:1, textTransform:"uppercase"}}>Tell us about yourself</div>

              {/* Goal */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11, color:"#D4AF37", letterSpacing:1, textTransform:"uppercase", marginBottom:6, fontFamily:"Montserrat,sans-serif"}}>Your Goal</div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:6}}>
                  {["Gain Muscle","Lose Weight","Build Strength","Improve Agility","Full Body Conditioning","Athletic Performance"].map(g => (
                    <button key={g} onClick={() => setUserProfile(p => ({...p, goal:g}))} style={{padding:"8px", background:userProfile.goal===g?"linear-gradient(135deg,#D4AF37,#B8941F)":"rgba(212,175,55,0.06)", border:"1px solid " + (userProfile.goal===g?"#D4AF37":"rgba(212,175,55,0.2)"), borderRadius:8, color:userProfile.goal===g?"#000":"#D4AF37", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"Poppins,sans-serif"}}>{g}</button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11, color:"#D4AF37", letterSpacing:1, textTransform:"uppercase", marginBottom:6, fontFamily:"Montserrat,sans-serif"}}>Fitness Level</div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6}}>
                  {["Beginner","Intermediate","Advanced"].map(l => (
                    <button key={l} onClick={() => setUserProfile(p => ({...p, level:l}))} style={{padding:"8px", background:userProfile.level===l?"linear-gradient(135deg,#D4AF37,#B8941F)":"rgba(212,175,55,0.06)", border:"1px solid " + (userProfile.level===l?"#D4AF37":"rgba(212,175,55,0.2)"), borderRadius:8, color:userProfile.level===l?"#000":"#D4AF37", fontSize:11, fontWeight:700, cursor:"pointer"}}>{l}</button>
                  ))}
                </div>
              </div>

              {/* Days */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11, color:"#D4AF37", letterSpacing:1, textTransform:"uppercase", marginBottom:6, fontFamily:"Montserrat,sans-serif"}}>Days per Week</div>
                <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6}}>
                  {["2","3","4","5","6"].map(d => (
                    <button key={d} onClick={() => setUserProfile(p => ({...p, days:d}))} style={{padding:"8px", background:userProfile.days===d?"linear-gradient(135deg,#D4AF37,#B8941F)":"rgba(212,175,55,0.06)", border:"1px solid " + (userProfile.days===d?"#D4AF37":"rgba(212,175,55,0.2)"), borderRadius:8, color:userProfile.days===d?"#000":"#D4AF37", fontSize:13, fontWeight:700, cursor:"pointer"}}>{d}</button>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11, color:"#D4AF37", letterSpacing:1, textTransform:"uppercase", marginBottom:6, fontFamily:"Montserrat,sans-serif"}}>Equipment</div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6}}>
                  {["Full Gym","Home Gym","No Equipment"].map(e => (
                    <button key={e} onClick={() => setUserProfile(p => ({...p, equipment:e}))} style={{padding:"8px", background:userProfile.equipment===e?"linear-gradient(135deg,#D4AF37,#B8941F)":"rgba(212,175,55,0.06)", border:"1px solid " + (userProfile.equipment===e?"#D4AF37":"rgba(212,175,55,0.2)"), borderRadius:8, color:userProfile.equipment===e?"#000":"#D4AF37", fontSize:11, fontWeight:700, cursor:"pointer"}}>{e}</button>
                  ))}
                </div>
              </div>

              {/* Injuries optional */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11, color:"#D4AF37", letterSpacing:1, textTransform:"uppercase", marginBottom:6, fontFamily:"Montserrat,sans-serif"}}>Any injuries? (optional)</div>
                <input type="text" placeholder="e.g. bad knees, lower back pain..." value={userProfile.injuries} onChange={e => setUserProfile(p => ({...p, injuries:e.target.value}))}
                  style={{width:"100%", padding:"10px 12px", background:"rgba(212,175,55,0.06)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:10, color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"Poppins,sans-serif"}} />
              </div>

              {setupError && <div style={{color:"#f87171", fontSize:12, marginBottom:10, textAlign:"center"}}>{setupError}</div>}

              <button
                onClick={async () => {
                  if (!userProfile.goal || !userProfile.level || !userProfile.days || !userProfile.equipment) {
                    setSetupError("Please select your goal, level, days and equipment.");
                    return;
                  }
                  setSetupLoading(true); setSetupError("");
                  try {
                    const prompt = "Create a " + userProfile.days + "-day per week workout program for someone who wants to " + userProfile.goal + ". Fitness level: " + userProfile.level + ". Equipment: " + userProfile.equipment + (userProfile.injuries ? ". Injuries/limitations: " + userProfile.injuries : "") + ". Make it challenging but appropriate for their level.";
                    const res = await fetch("https://api.anthropic.com/v1/messages", {
                      method:"POST", headers:{"Content-Type":"application/json"},
                      body: JSON.stringify({
                        model:"claude-sonnet-4-20250514", max_tokens:2000,
                        system:"You are an expert personal trainer. Based on the user profile, create a personalized weekly workout program. Return ONLY a valid JSON object with keys Sun,Mon,Tue,Wed,Thu,Fri,Sat. Each value is an array of exercises: name (string), sets (number), reps (number), video (YouTube video ID or empty string). Rest days = empty array []. No explanation, no markdown, no extra text. Just the JSON.",
                        messages:[{role:"user", content: prompt}],
                      }),
                    });
                    const data = await res.json();
                    const raw = data.content?.find(b => b.type === "text")?.text || "";
                    const cleaned = raw.replace(/```json|```/g, "").trim();
                    const parsed = JSON.parse(cleaned);
                    if (!DAYS.some(d => Array.isArray(parsed[d]))) throw new Error("Invalid response");
                    setWorkouts(parsed);
                    setShowSetup(false);
                  } catch(e) {
                    setSetupError("Could not generate plan. Please try again.");
                  }
                  setSetupLoading(false);
                }}
                disabled={setupLoading}
                style={{width:"100%", padding:"14px", background:setupLoading?"rgba(212,175,55,0.3)":"linear-gradient(135deg,#D4AF37,#B8941F)", border:"none", borderRadius:12, color:"#000", fontSize:14, fontWeight:800, cursor:setupLoading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"Montserrat,sans-serif", letterSpacing:1}}
              >
                {setupLoading ? <><span style={{display:"inline-block", width:16, height:16, border:"2px solid rgba(0,0,0,0.3)", borderTopColor:"#000", borderRadius:"50%", animation:"spin 0.8s linear infinite"}} /> Building your plan...</> : "BUILD MY PROGRAM →"}
              </button>
              <button onClick={() => {setSetupStep("welcome"); setSetupError("");}} style={{width:"100%", marginTop:8, padding:"10px", background:"transparent", border:"none", color:"#52525b", fontSize:12, cursor:"pointer"}}>← Back</button>
            </div>
          )}

          <button onClick={() => {
            setWorkouts(EMPTY_WORKOUTS);
            setShowSetup(false);
          }} style={{padding:"14px", background:"transparent", border:"1px solid rgba(212,175,55,0.15)", borderRadius:16, color:"#52525b", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"Poppins,sans-serif"}}>
            Start empty — I will add workouts myself
          </button>
        </div>

        <div style={{marginTop:24, fontSize:11, color:"#3f3f46", lineHeight:1.8, textAlign:"center", fontFamily:"Poppins,sans-serif"}}>
          Your data is encrypted and saved securely<br/>Nothing is shared with anyone
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh", background:t.bg, fontFamily:"Poppins,system-ui,sans-serif", color:t.text, paddingBottom:80, border:"none", outline:"none", margin:0, boxSizing:"border-box"}}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        * { font-family: 'Poppins', system-ui, sans-serif; margin:0; padding:0; box-sizing:border-box; }
        html, body, #root { background: #0B0B0B; min-height: 100vh; min-height: -webkit-fill-available; }
        h1,h2,h3,.heading { font-family: 'Montserrat', system-ui, sans-serif; }
      `}</style>

      {/* Header */}
      <div style={{padding:"24px 20px 16px", borderBottom:"1px solid " + t.headerBorder, background:t.header, margin:0}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div>
              <div style={{fontSize:24, fontWeight:900, letterSpacing:3, color:t.text, fontFamily:"Montserrat,sans-serif", textTransform:"uppercase", lineHeight:1}}>FITSTUD</div>
              <div style={{fontSize:9, letterSpacing:3, textTransform:"uppercase", color:t.accentText, fontFamily:"Montserrat,sans-serif", fontWeight:600, lineHeight:1, marginTop:3}}>FORGE YOUR LEGACY</div>
            </div>
          <div style={{display:"flex", gap:6, alignItems:"center"}}>
            {/* Sync indicator */}
            {syncStatus === "saving" && <div style={{fontSize:10, color:t.textMuted, letterSpacing:1}}>Saving...</div>}
            {syncStatus === "saved" && <div style={{fontSize:10, color:"#10b981", letterSpacing:1}}>✓ Saved</div>}
            <button onClick={() => setShowLibrary(true)} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:12, padding:"8px 10px", color:t.textSub, fontSize:12, fontWeight:600, cursor:"pointer"}}>📚</button>
            <button onClick={() => {setShowPlanner(true); setPlannerPreview(null); setPlannerError("");}} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:12, padding:"8px 10px", color:t.textSub, fontSize:12, fontWeight:600, cursor:"pointer"}}>🗓</button>
            {user ? (
              <button onClick={(e) => { e.stopPropagation(); setShowProfile(true); }} style={{width:34, height:34, background:avatarUrl?"transparent":t.card, border:"1px solid " + t.cardBorder, borderRadius:"50%", overflow:"hidden", cursor:"pointer", padding:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                {avatarUrl ? <img src={avatarUrl} style={{width:"100%", height:"100%", objectFit:"cover"}} alt="avatar" /> : <span style={{fontSize:16}}>👤</span>}
              </button>
            ) : (
              <button onClick={() => {setShowAuth(true); setAuthMode("login");}} style={{background:t.accent, border:"none", borderRadius:12, padding:"8px 12px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer"}}>Login</button>
            )}
          </div>
        </div>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8}}>
          <div style={{fontSize:13, color:t.textMuted}}>{FULL_DAYS[now.getDay()]} · {MONTHS[todayMonth]} {todayYear}</div>
          <div style={{display:"flex", gap:6}}>
            {[["gold","★"],["dark","🌙"],["light","☀️"]].map(([th, icon]) => (
              <button key={th} onClick={() => setTheme(th)} style={{width:28, height:28, borderRadius:"50%", border:theme===th?"2px solid " + t.accentSolid:"1px solid " + t.cardBorder, background:theme===th?"#dc2626":"rgba(255,255,255,0.05)", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>{icon}</button>
            ))}
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div style={{display:"flex", margin:"12px 16px 0", background:t.toggleBg, borderRadius:12, padding:4}}>
        {[["week","📅 Week"],["month","🗓 Month"],["dashboard","📊 Stats"],["nutrition","🥗 Nutrition"]].map(([v,label]) => (
          <button key={v} onClick={() => setView(v)} style={{flex:1, padding:"9px", borderRadius:9, border:"none", cursor:"pointer", background:view===v?t.accent:"transparent", color:view===v?"#fff":t.textMuted, fontSize:12, fontWeight:700, textShadow:view===v?"0 1px 3px rgba(0,0,0,0.8)":"none"}}>
            {label}
          </button>
        ))}
      </div>

      {/* WEEK VIEW */}
      {view === "week" && (
        <div>
          {/* Day strip - sliding 7-day window */}
          <div
            onTouchStart={e => setTouchSwipeStart(e.touches[0].clientX)}
            onTouchEnd={e => {
              if (touchSwipeStart === null) return;
              const diff = touchSwipeStart - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 40) {
                const newOffset = weekOffset + (diff > 0 ? 1 : -1);
                setWeekOffset(newOffset);
                // Update selected day to same weekday in new week
                setSelectedDay(selectedDay);
              }
              setTouchSwipeStart(null);
            }}
            style={{display:"flex", gap:8, padding:"16px 12px 8px", overflowX:"auto", scrollbarWidth:"none", WebkitOverflowScrolling:"touch"}}>
            {Array.from({length:7}, (_, i) => {
              // Rolling 7-day window starting from today + offset days
              const base = new Date();
              const slotDate = new Date(base);
              slotDate.setDate(base.getDate() + (weekOffset * 7) + i);

              const dateNum = slotDate.getDate();
              const dateMonth = slotDate.getMonth();
              const dateYear = slotDate.getFullYear();
              const dayName = DAYS[slotDate.getDay()];
              const dayLabel = DAYS[slotDate.getDay()];

              // Is this today?
              const realToday = new Date();
              const isToday = dateNum === realToday.getDate() && dateMonth === realToday.getMonth() && dateYear === realToday.getFullYear();

              // Check history for completed workout on this exact date
              const histKey = dateYear + "-" + String(dateMonth+1).padStart(2,"0") + "-" + String(dateNum).padStart(2,"0") + "-" + dayName;
              const isCompleted = !!history[histKey];

              const isSel = dayName === selectedDay && weekOffset === 0 ? isToday || weekOffset === 0 : false;
              const isSelDay = dayName === selectedDay;
              const hasWorkout = (safeWorkouts[dayName]||[]).length > 0;

              return (
                <button key={i} onClick={() => { setSelectedDay(dayName); setShowStats(false); }} style={{
                  flex:"0 0 auto", display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                  padding:"10px 8px", borderRadius:16, minWidth:56, cursor:"pointer",
                  border: isToday ? "1.5px solid " + t.accentSolid : isCompleted ? "1.5px solid #22c55e" : isSelDay ? "1.5px solid " + t.accentBorder : "1.5px solid " + t.cardBorder,
                  background: isToday ? t.accentMuted : isCompleted ? "rgba(34,197,94,0.12)" : isSelDay ? t.card : t.card,
                  boxShadow: isSelDay ? "0 0 0 2px " + t.accentSolid : "none",
                }}>
                  <span style={{fontSize:10, letterSpacing:1, textTransform:"uppercase", fontWeight:700,
                    color: isToday ? t.accentText : isCompleted ? "#22c55e" : isSelDay ? t.accentText : t.textMuted
                  }}>{dayLabel}</span>
                  <span style={{fontSize:18, fontWeight:800, lineHeight:1,
                    color: isToday ? t.accentText : isCompleted ? "#22c55e" : isSelDay ? t.text : t.text
                  }}>{dateNum}</span>
                  <span style={{width:6, height:6, borderRadius:"50%",
                    background: isCompleted ? "#22c55e" : isToday ? t.accentSolid : hasWorkout ? t.accentBorder : "transparent"
                  }} />
                </button>
              );
            })}
          </div>
          {/* Week nav arrows + label */}
          <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:16, padding:"2px 16px 8px"}}>
            <button onClick={() => setWeekOffset(p => p-1)} style={{background:"none", border:"none", color:t.textMuted, fontSize:22, cursor:"pointer", padding:"4px 10px"}}>‹</button>
            <span style={{fontSize:11, color:t.textMuted, letterSpacing:1}}>
              {weekOffset === 0 ? "THIS WEEK" : weekOffset > 0 ? "+" + weekOffset + " WEEK" + (Math.abs(weekOffset)>1?"S":"") : Math.abs(weekOffset) + " WEEK" + (Math.abs(weekOffset)>1?"S":"") + " AGO"}
            </span>
            <button onClick={() => setWeekOffset(p => p+1)} style={{background:"none", border:"none", color:t.textMuted, fontSize:22, cursor:"pointer", padding:"4px 10px"}}>›</button>
          </div>

          {/* Day header */}
          <div style={{padding:"0 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:20, fontWeight:800, color:t.text, fontFamily:"Montserrat,sans-serif", textTransform:"uppercase", letterSpacing:1}}>{FULL_DAYS[DAYS.indexOf(selectedDay)]}</div>
              <div style={{fontSize:15, fontWeight:600, color:t.accentText, marginTop:2}}>{DAY_FOCUS[selectedDay]}</div>
              <div style={{fontSize:12, color:"#475569", marginTop:2}}>{exercises.length} exercise{exercises.length!==1?"s":""}</div>
            </div>
            <div style={{display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end"}}>
              {allDone && <button onClick={() => {saveToHistory(); saveToLibrary(); setWorkoutFinished(true); setShowCongrats(true);}} style={{background:"linear-gradient(135deg,#059669,#10b981)", border:"none", borderRadius:12, padding:"8px 12px", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer"}}>📊 Stats</button>}
              <button onClick={() => setShowHistory(true)} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:12, padding:"8px 12px", color:t.textSub, fontSize:12, fontWeight:600, cursor:"pointer"}}>📖</button>
              <button onClick={() => setEditMode(e => !e)} style={{background:editMode?t.accentLight:t.card, border:"1px solid " + (editMode?t.accentBorder:t.cardBorder), borderRadius:12, padding:"8px 12px", color:editMode?"#fbbf24":"#94a3b8", fontSize:12, fontWeight:600, cursor:"pointer"}}>{editMode?"✓ Done":"✏️ Edit"}</button>
              <button onClick={() => setShowAdd(true)} style={{background:t.accent, border:"none", borderRadius:12, padding:"8px 14px", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer"}}>+ Add</button>
            </div>
          </div>

          {/* Good job banner */}
          {workoutFinished && (
            <div style={{
              margin:"0 16px 12px",
              padding:"12px 16px",
              background:"linear-gradient(135deg,rgba(212,175,55,0.12),rgba(184,148,31,0.08))",
              border:"1px solid rgba(212,175,55,0.3)",
              borderRadius:14,
              display:"flex", alignItems:"center", gap:10,
            }}>
              <div style={{width:8, height:8, borderRadius:"50%", background:"#10b981", flexShrink:0}} />
              <div>
                <div style={{fontSize:14, fontWeight:800, color:"#D4AF37", fontFamily:"Montserrat,sans-serif", letterSpacing:1}}>WORKOUT SAVED</div>
                <div style={{fontSize:12, color:"rgba(212,175,55,0.7)", marginTop:2}}>Great work! Your progress has been recorded.</div>
              </div>
            </div>
          )}

          {/* Exercise list */}
          <div style={{padding:"0 16px", display:"flex", flexDirection:"column", gap:14}}>
            {exercises.length === 0 && (
              <div style={{textAlign:"center", padding:"40px 20px", color:"#334155", fontSize:14, border:"1.5px dashed " + t.cardBorder, borderRadius:20}}>
                <div style={{fontSize:32, marginBottom:10}}>🏋️</div>Rest day or tap + Add
              </div>
            )}
            {exercises.map((ex, exIdx) => {
              const done = doneCount(ex.id, ex.sets);
              const finished = done === ex.sets;
              return (
                <div key={ex.id}
                  data-excard
                  style={{background:finished?t.cardActive:t.card, border:"1px solid " + (finished?t.accentSolid:t.cardBorder), outline:"none", borderRadius:20, padding:"16px", opacity:dragIndex === exIdx ? 0.4 : 1, transform:dragIndex === exIdx ? "scale(0.97)" : "scale(1)", transition:"all 0.15s", boxShadow:dragIndex === exIdx ? "0 8px 32px rgba(212,175,55,0.4)" : "none"}}>
                  {/* Edit controls */}
                  {editMode && (
                    <div style={{display:"flex", gap:6, marginBottom:10, alignItems:"center"}}>
                      {/* Hamburger drag handle - works on mobile touch */}
                      <div
                        draggable
                        onDragStart={() => { setDragIndex(exIdx); dragIndexRef.current = exIdx; }}
                        onDragOver={e => { e.preventDefault(); setDragOver(exIdx); }}
                        onDragEnd={handleDragEnd}
                        onTouchStart={e => {
                          e.stopPropagation();
                          setDragIndex(exIdx);
                          dragIndexRef.current = exIdx;
                          setTouchStartY(e.touches[0].clientY);
                        }}
                        onTouchMove={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          const y = e.touches[0].clientY;
                          const cards = document.querySelectorAll("[data-excard]");
                          let found = false;
                          cards.forEach((card, ci) => {
                            const rect = card.getBoundingClientRect();
                            if (y >= rect.top && y <= rect.bottom && !found) {
                              found = true;
                              setDragOver(ci);
                            }
                          });
                        }}
                        onTouchEnd={e => {
                          e.stopPropagation();
                          handleDragEnd();
                        }}
                        style={{
                          display:"flex", flexDirection:"column", gap:4, padding:"12px 14px",
                          background:t.accentMuted, border:"1px solid " + t.accentBorder,
                          borderRadius:8, cursor:"grab", alignItems:"center", justifyContent:"center",
                          opacity: dragOver === exIdx ? 0.5 : 1, touchAction:"none",
                          userSelect:"none", WebkitUserSelect:"none",
                        }}
                      >
                        {[0,1,2].map(i => <div key={i} style={{width:20, height:2.5, background:t.accentText, borderRadius:1}} />)}
                      </div>
                      <button onClick={() => setMoveModal(ex)} style={{background:t.accentMuted, border:"1px solid " + t.accentBorder, borderRadius:8, padding:"6px 12px", color:t.accentText, fontSize:11, fontWeight:600, cursor:"pointer"}}>Move day →</button>
                      <div style={{flex:1}} />
                      <button onClick={() => removeExercise(ex.id)} style={{background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"6px 10px", color:"#f87171", fontSize:12, cursor:"pointer", fontWeight:600}}>Remove</button>
                    </div>
                  )}
                  {/* Card header */}
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12}}>
                    <div>
                      <div style={{fontSize:17, fontWeight:700, color:finished?t.accentText:(theme==="light"?"#000000":"#FFFFFF")}}>{ex.name}</div>
                      <div style={{fontSize:12, color:theme==="light"?"#000000":"#ffffff", marginTop:3, textShadow:theme==="light"?"none":"0 1px 4px rgba(0,0,0,0.8)"}}>{ex.sets} sets · target {ex.reps} reps · {done}/{ex.sets} done</div>
                    </div>
                    <div style={{display:"flex", gap:8, alignItems:"center"}}>
                      {ex.video && <button onClick={() => setVideoPlayer({videoId:ex.video, title:ex.name})} style={{background:t.accentLight, border:"1px solid " + t.accentBorder, borderRadius:8, padding:"4px 8px", color:t.accentText, fontSize:11, fontWeight:600, cursor:"pointer"}}>▶ Watch</button>}
                      {!editMode && <button onClick={() => removeExercise(ex.id)} style={{background:t.card, border:"none", borderRadius:8, padding:"4px 8px", color:t.textMuted, fontSize:13, cursor:"pointer"}}>✕</button>}
                    </div>
                  </div>
                  {/* + / - Set */}
                  <div style={{display:"flex", gap:8, marginBottom:10}}>
                    <button onClick={() => removeSet(ex.id)} style={{flex:1, padding:"9px", background:ex.sets<=1?"rgba(255,255,255,0.02)":"rgba(239,68,68,0.08)", border:ex.sets<=1?"1px solid " + t.cardBorder:"1px solid " + t.accentBorder, borderRadius:10, color:ex.sets<=1?"#334155":"#f87171", fontSize:14, fontWeight:700, cursor:ex.sets<=1?"not-allowed":"pointer"}}>− Set</button>
                    <button onClick={() => addSet(ex.id)} style={{flex:1, padding:"9px", background:"rgba(99,102,241,0.1)", border:"1px solid " + t.accentBorder, borderRadius:10, color:t.accentText, fontSize:14, fontWeight:700, cursor:"pointer"}}>+ Set</button>
                  </div>
                  {/* Column headers */}
                  {(() => { const timeBased = isTimeBased(ex.name); return (
                  <div style={{display:"grid", gridTemplateColumns:"32px 52px 1fr 1fr 44px", gap:6, marginBottom:6, padding:"0 2px"}}>
                    <div /><div style={{fontSize:9, color:"#ffffff", textTransform:"uppercase", textAlign:"center", letterSpacing:1, textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>Last</div>
                    <div style={{fontSize:10, color:"#ffffff", textTransform:"uppercase", letterSpacing:1, textAlign:"center", textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>{timeBased ? "Rounds" : "Reps"}</div>
                    <div style={{fontSize:10, color:"#ffffff", textTransform:"uppercase", letterSpacing:1, textAlign:"center", textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>{timeBased ? "Time (s)" : "Weight"}</div>
                    <div style={{fontSize:10, color:"#ffffff", textTransform:"uppercase", letterSpacing:1, textAlign:"center", textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>✓</div>
                  </div>
                  ); })()}
                  {/* Set rows */}
                  <div style={{display:"flex", flexDirection:"column", gap:8}}>
                    {Array.from({length: ex.sets}, (_, i) => {
                      const s = getSet(ex.id, i);
                      const last = getLastRecord(ex.name, i);
                      return (
                        <div key={i} style={{display:"grid", gridTemplateColumns:"32px 52px 1fr 1fr 44px", gap:6, alignItems:"center", background:s.done?t.accentMuted:t.card, border:"1px solid " + (s.done?t.accentSolid:t.cardBorder), borderRadius:12, padding:"8px 6px"}}>
                          <div style={{fontSize:11, fontWeight:700, color:s.done?t.accentText:"#ffffff", textAlign:"center", textShadow:"0 1px 4px rgba(0,0,0,0.9)"}}>S{i+1}</div>
                          <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:t.accentMuted, borderRadius:8, padding:"4px 2px", minHeight:40, border:"1px solid " + t.accentBorder}}>
                            {last ? (
                              <>
                                <span style={{fontSize:11, fontWeight:700, color:t.textSub, lineHeight:1.2}}>{last.reps || "—"}</span>
                                <span style={{fontSize:9, color:t.accentText, lineHeight:1.2}}>{last.weight ? last.weight + "lb" : "bw"}</span>
                              </>
                            ) : <span style={{fontSize:12, color:t.accentText, fontWeight:700}}>—</span>}
                          </div>
                          <input type="number" inputMode="numeric" placeholder="0" value={s.reps === 0 || s.reps === "0" || !s.reps ? "" : s.reps} onChange={e => updateSet(ex.id, i, "reps", e.target.value)} style={{width:"100%", padding:"10px 4px", background:t.input, border:"1px solid " + t.inputBorder, borderRadius:10, color:t.text, fontSize:15, fontWeight:600, outline:"none", textAlign:"center", boxSizing:"border-box"}} />
                          <input type="number" inputMode="decimal" placeholder="0" value={s.weight} onChange={e => updateSet(ex.id, i, "weight", e.target.value)} style={{width:"100%", padding:"10px 4px", background:t.input, border:"1px solid " + t.inputBorder, borderRadius:10, color:t.text, fontSize:15, fontWeight:600, outline:"none", textAlign:"center", boxSizing:"border-box"}} />
                          <button onClick={() => toggleDone(ex.id, i)} style={{width:40, height:40, borderRadius:10, border:s.done?"none":"2px solid rgba(212,175,55,0.5)", background:s.done?t.accent:t.card, color:s.done?"#fff":"rgba(212,175,55,0.7)", fontSize:18, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>{s.done?"✓":"○"}</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── DONE WORKOUT BUTTON ── */}
          {exercises.length > 0 && (
            <div style={{padding:"20px 16px 8px"}}>
              <button
                onClick={() => {saveToHistory(); saveToLibrary(); setShowCongrats(true);}}
                style={{
                  width:"100%", padding:"18px",
                  background:"linear-gradient(135deg,#D4AF37 0%,#F5E070 40%,#D4AF37 60%,#B8941F 100%)",
                  border:"none", borderRadius:14,
                  color:"#000", fontSize:14, fontWeight:800,
                  cursor:"pointer",
                  boxShadow:"0 4px 20px rgba(212,175,55,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                  letterSpacing:1, fontFamily:"Montserrat,sans-serif",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                }}
              >
                {allDone ? "SAVE & FINISH" : "SAVE & FINISH"}
              </button>
              {!allDone && (
                <div style={{textAlign:"center", fontSize:11, color:t.textMuted, marginTop:8}}>
                  You can finish anytime — your progress is saved
                </div>
              )}
            </div>
          )}

        </div>
      )}



      {/* NUTRITION TRACKING */}
      {view === "nutrition" && (() => {
        const today = getTodayNutrition();
        const last7 = Array.from({length:7}, (_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (6-i));
          const key = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
          const day = DAYS[d.getDay()];
          return {key, day, ...(nutrition[key]||{calories:0,protein:0,carbs:0,fat:0,water:0,steps:0})};
        });
        const goals = {calories:2000, protein:150, carbs:200, fat:65, water:8, steps:10000};

        return (
          <div style={{padding:"16px"}}>
            <div style={{fontSize:16, fontWeight:800, color:t.text, marginBottom:12, fontFamily:"Montserrat,sans-serif", letterSpacing:1}}>NUTRITION</div>
            <div style={{display:"flex", gap:4, background:t.toggleBg, borderRadius:12, padding:4, marginBottom:12}}>
              {[["daily","Day"],["weekly","Week"],["monthly","Month"],["yearly","Year"]].map(([p,label]) => (
                <button key={p} onClick={() => setNutritionPeriod(p)} style={{flex:1, padding:"8px 4px", borderRadius:9, border:"none", background:nutritionPeriod===p?t.accent:"transparent", color:nutritionPeriod===p?"#000":t.textMuted, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Montserrat,sans-serif"}}>{label}</button>
              ))}
            </div>

            {/* Nutrition action buttons */}
            <div style={{display:"flex", gap:10, marginBottom:16}}>
              <button onClick={() => { setShowMealPlanner(true); setMealPlanStep("questions"); setMealPlanError(""); }}
                style={{flex:1, padding:"14px", background:"linear-gradient(135deg,#D4AF37,#B8941F)", border:"none", borderRadius:14, color:"#000", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"Montserrat,sans-serif", letterSpacing:0.5}}>
                Generate My Meal Plan
              </button>
              <button onClick={() => { setShowScanner(true); setScanResult(null); setScanError(""); }}
                style={{padding:"14px 16px", background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, color:t.text, fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap"}}>
                📷 Scan Meal
              </button>
            </div>

            {nutritionPeriod !== "daily" && (
              <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, padding:"14px 16px", marginBottom:16}}>
                <div style={{fontSize:11, color:t.accentText, letterSpacing:2, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:12, fontWeight:700}}>
                  {nutritionPeriod === "weekly" ? "This Week" : nutritionPeriod === "monthly" ? "This Month" : "This Year"} Averages
                </div>
                {(() => {
                  const now3 = new Date();
                  const keys = Object.keys(nutrition).filter(k => {
                    const d = new Date(k);
                    if (nutritionPeriod === "weekly") return (now3-d)/(1000*60*60*24) <= 7;
                    if (nutritionPeriod === "monthly") return d.getMonth()===now3.getMonth() && d.getFullYear()===now3.getFullYear();
                    if (nutritionPeriod === "yearly") return d.getFullYear()===now3.getFullYear();
                    return false;
                  });
                  const avg = (field) => keys.length ? Math.round(keys.reduce((a,k) => a+(nutrition[k]?.[field]||0), 0)/keys.length) : 0;
                  return (
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10}}>
                      {[{label:"Avg Cal",val:avg("calories"),unit:"kcal",color:"#F5D070"},{label:"Avg Protein",val:avg("protein"),unit:"g",color:"#ef4444"},{label:"Avg Steps",val:avg("steps").toLocaleString(),unit:"steps",color:"#34d399"}].map(s => (
                        <div key={s.label} style={{textAlign:"center", padding:"10px 6px", background:t.toggleBg, borderRadius:12}}>
                          <div style={{fontSize:18, fontWeight:800, color:s.color}}>{s.val}</div>
                          <div style={{fontSize:9, color:t.textMuted, marginTop:2}}>{s.unit}</div>
                          <div style={{fontSize:9, color:t.textMuted}}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
            <div style={{fontSize:12, color:t.textMuted, marginBottom:16}}>{FULL_DAYS[new Date().getDay()]} · {MONTHS[new Date().getMonth()]} {new Date().getDate()}</div>

            {/* Today's macros input */}
            <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:16, padding:"16px", marginBottom:16}}>
              <div style={{fontSize:12, fontWeight:700, color:t.accentText, letterSpacing:2, textTransform:"uppercase", marginBottom:14, fontFamily:"Montserrat,sans-serif"}}>Today's Intake</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
                {[
                  {key:"calories", label:"Calories", unit:"kcal", goal:goals.calories, color:"#F5D070"},
                  {key:"protein", label:"Protein", unit:"g", goal:goals.protein, color:"#ef4444"},
                  {key:"carbs", label:"Carbs", unit:"g", goal:goals.carbs, color:"#f97316"},
                  {key:"fat", label:"Fat", unit:"g", goal:goals.fat, color:"#a78bfa"},
                  {key:"water", label:"Water", unit:"glasses", goal:goals.water, color:"#38bdf8"},
                  {key:"steps", label:"Steps", unit:"steps", goal:goals.steps, color:"#34d399"},
                ].map(item => {
                  const val = today[item.key] || 0;
                  const pct = Math.min(100, Math.round((val/item.goal)*100));
                  return (
                    <div key={item.key} style={{background:t.toggleBg, borderRadius:12, padding:"12px"}}>
                      <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
                        <span style={{fontSize:11, color:t.textSub, fontWeight:600}}>{item.label}</span>
                        <span style={{fontSize:10, color:t.textMuted}}>{pct}%</span>
                      </div>
                      <input
                        type="number" inputMode="decimal"
                        placeholder="0"
                        value={today[item.key] || ""}
                        onChange={e => updateNutrition(item.key, e.target.value)}
                        style={{width:"100%", padding:"8px", background:"rgba(255,255,255,0.05)", border:"1px solid " + t.cardBorder, borderRadius:8, color:t.text, fontSize:16, fontWeight:700, outline:"none", textAlign:"center", boxSizing:"border-box", marginBottom:6}}
                      />
                      <div style={{fontSize:9, color:t.textMuted, textAlign:"center"}}>{item.unit} · goal: {item.goal}</div>
                      {/* Progress bar */}
                      <div style={{height:4, background:t.cardBorder, borderRadius:2, marginTop:6}}>
                        <div style={{height:4, width:pct+"%", background:item.color, borderRadius:2, transition:"width 0.3s"}} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly summary */}
            <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:16, padding:"16px", marginBottom:16}}>
              <div style={{fontSize:12, fontWeight:700, color:t.accentText, letterSpacing:2, textTransform:"uppercase", marginBottom:14, fontFamily:"Montserrat,sans-serif"}}>Weekly Overview</div>
              <div style={{display:"flex", alignItems:"flex-end", gap:6, height:80, marginBottom:8}}>
                {last7.map((d, i) => {
                  const pct = Math.min(100, Math.round(((d.calories||0)/goals.calories)*100));
                  const isToday = i === 6;
                  return (
                    <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4}}>
                      <div style={{width:"100%", borderRadius:"4px 4px 0 0", background:isToday?"linear-gradient(135deg,#D4AF37,#B8941F)":d.calories>0?"rgba(212,175,55,0.3)":"rgba(255,255,255,0.05)", height:Math.max(4,(pct/100)*72)+"px", transition:"all 0.3s"}} />
                      <div style={{fontSize:9, color:isToday?t.accentText:t.textMuted, textTransform:"uppercase", fontWeight:isToday?700:400}}>{d.day}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{fontSize:11, color:t.textMuted, textAlign:"center"}}>Calorie intake — last 7 days</div>
            </div>

            {/* 7-day averages */}
            <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:16, padding:"16px"}}>
              <div style={{fontSize:12, fontWeight:700, color:t.accentText, letterSpacing:2, textTransform:"uppercase", marginBottom:14, fontFamily:"Montserrat,sans-serif"}}>7-Day Averages</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10}}>
                {[
                  {label:"Avg Calories", value:Math.round(last7.reduce((a,d)=>a+(d.calories||0),0)/7), unit:"kcal", color:"#F5D070"},
                  {label:"Avg Protein", value:Math.round(last7.reduce((a,d)=>a+(d.protein||0),0)/7), unit:"g", color:"#ef4444"},
                  {label:"Avg Steps", value:Math.round(last7.reduce((a,d)=>a+(d.steps||0),0)/7).toLocaleString(), unit:"steps", color:"#34d399"},
                ].map(s => (
                  <div key={s.label} style={{textAlign:"center", padding:"10px 6px", background:t.toggleBg, borderRadius:12}}>
                    <div style={{fontSize:18, fontWeight:800, color:s.color}}>{s.value}</div>
                    <div style={{fontSize:9, color:t.textMuted, marginTop:2}}>{s.unit}</div>
                    <div style={{fontSize:9, color:t.textMuted}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* STATS DASHBOARD */}
      {view === "dashboard" && (() => {
        // Filter by period
        const now2 = new Date();
        const allEntries = Object.entries(history).sort((a,b) => b[0].localeCompare(a[0]));
        const filterByPeriod = (entries, period) => {
          return entries.filter(([key]) => {
            const d = new Date(key);
            if (period === "daily") { return d.toDateString() === now2.toDateString(); }
            if (period === "weekly") { const diff = (now2 - d) / (1000*60*60*24); return diff <= 7; }
            if (period === "monthly") { return d.getMonth() === now2.getMonth() && d.getFullYear() === now2.getFullYear(); }
            if (period === "yearly") { return d.getFullYear() === now2.getFullYear(); }
            return true;
          });
        };
        const historyEntries = filterByPeriod(allEntries, statsPeriod);
        const totalWorkouts = historyEntries.length;
        
        // Calculate streak
        let streak = 0;
        const today2 = new Date();
        for (let i = 0; i < 30; i++) {
          const d = new Date(today2); d.setDate(d.getDate() - i);
          const dayName = DAYS[d.getDay()];
          const key = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0") + "-" + dayName;
          if (history[key]) streak++;
          else if (i > 0) break;
        }

        // Total volume and reps across all history
        let allTimeVolume = 0, allTimeReps = 0, allTimeSets = 0;
        historyEntries.forEach(([,rec]) => {
          rec.exercises?.forEach(ex => {
            ex.sets?.forEach(s => {
              if (s.done) {
                allTimeReps += parseInt(s.reps) || ex.reps || 0;
                allTimeVolume += (parseInt(s.reps)||ex.reps||0) * (parseFloat(s.weight)||0);
                allTimeSets++;
              }
            });
          });
        });

        // PRs per exercise
        const prs = {};
        historyEntries.forEach(([,rec]) => {
          rec.exercises?.forEach(ex => {
            ex.sets?.forEach(s => {
              if (s.done && s.weight) {
                const w = parseFloat(s.weight);
                if (!prs[ex.name] || w > prs[ex.name]) prs[ex.name] = w;
              }
            });
          });
        });

        // Last 7 workouts volume
        const last7 = historyEntries.slice(0, 7).map(([key, rec]) => {
          let vol = 0;
          rec.exercises?.forEach(ex => {
            ex.sets?.forEach(s => {
              if (s.done) vol += (parseInt(s.reps)||ex.reps||0) * (parseFloat(s.weight)||0);
            });
          });
          const parts = key.split("-");
          return { label: parts[3] || "?", vol, date: rec.date };
        }).reverse();

        const maxVol = Math.max(...last7.map(d => d.vol), 1);

        return (
          <div style={{padding:"16px"}}>
            {/* Top stats */}
            <div style={{fontSize:16, fontWeight:700, color:"#f1f5f9", marginBottom:12}}>Your Progress</div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20}}>
              {[
                {icon:"🔥", value:streak, label:"Day Streak"},
                {icon:"💪", value:totalWorkouts, label:"Workouts Done"},
                {icon:"🏋️", value:allTimeVolume>0?Math.round(allTimeVolume/1000)+"k lbs":"—", label:"Total Volume"},
                {icon:"🔁", value:allTimeReps||"—", label:"Total Reps"},
              ].map(s => (
                <div key={s.label} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:16, padding:"14px", display:"flex", alignItems:"center", gap:12}}>
                  <div style={{fontSize:28}}>{s.icon}</div>
                  <div>
                    <div style={{fontSize:22, fontWeight:800, color:"#a5b4fc"}}>{s.value}</div>
                    <div style={{fontSize:11, color:"#475569", marginTop:2}}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Volume chart - last 7 workouts */}
            {last7.length > 0 && last7.some(d => d.vol > 0) && (
              <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:16, padding:"16px", marginBottom:20}}>
                <div style={{fontSize:13, fontWeight:700, color:"#f1f5f9", marginBottom:16}}>📈 Volume — Last {last7.length} Workouts</div>
                <div style={{display:"flex", alignItems:"flex-end", gap:6, height:80}}>
                  {last7.map((d, i) => (
                    <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4}}>
                      <div style={{
                        width:"100%", borderRadius:"4px 4px 0 0",
                        background: d.vol > 0 ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "rgba(255,255,255,0.05)",
                        height: d.vol > 0 ? Math.max(8, (d.vol/maxVol)*72) + "px" : "4px",
                        transition:"all 0.3s",
                      }} />
                      <div style={{fontSize:9, color:"#475569", textTransform:"uppercase"}}>{d.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Records */}
            {Object.keys(prs).length > 0 && (
              <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:16, padding:"16px", marginBottom:20}}>
                <div style={{fontSize:13, fontWeight:700, color:"#f1f5f9", marginBottom:12}}>🏆 Personal Records</div>
                <div style={{display:"flex", flexDirection:"column", gap:8}}>
                  {Object.entries(prs).sort((a,b) => b[1]-a[1]).slice(0,10).map(([name, weight]) => (
                    <div key={name} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:"rgba(99,102,241,0.06)", borderRadius:10}}>
                      <span style={{fontSize:13, color:"#e2e8f0", fontWeight:600}}>{name}</span>
                      <span style={{fontSize:14, fontWeight:800, color:"#fbbf24"}}>{weight} lbs 🏅</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent workouts */}
            {historyEntries.length > 0 && (
              <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:16, padding:"16px", marginBottom:20}}>
                <div style={{fontSize:13, fontWeight:700, color:"#f1f5f9", marginBottom:12}}>📅 Recent Workouts</div>
                {historyEntries.slice(0,5).map(([key, rec]) => {
                  let vol = 0, reps = 0;
                  rec.exercises?.forEach(ex => {
                    ex.sets?.forEach(s => {
                      if (s.done) { reps += parseInt(s.reps)||ex.reps||0; vol += (parseInt(s.reps)||ex.reps||0)*(parseFloat(s.weight)||0); }
                    });
                  });
                  return (
                    <div key={key} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid " + t.cardBorder}}>
                      <div>
                        <div style={{fontSize:13, fontWeight:700, color:"#f1f5f9"}}>{rec.fullDay}</div>
                        <div style={{fontSize:11, color:"#475569", marginTop:2}}>{rec.date} · {rec.exercises?.length} exercises</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        {vol > 0 && <div style={{fontSize:12, fontWeight:700, color:"#a5b4fc"}}>{vol.toLocaleString()} lbs</div>}
                        <div style={{fontSize:11, color:"#475569"}}>{reps} reps</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {historyEntries.length === 0 && (
              <div style={{textAlign:"center", padding:"40px 20px", color:"#334155", fontSize:13}}>
                <div style={{fontSize:48, marginBottom:12}}>📊</div>
                <div style={{color:"#475569", marginBottom:8, fontSize:15, fontWeight:600}}>No data yet</div>
                <div style={{fontSize:12, color:"#334155", lineHeight:1.6}}>Complete workouts and tap 📊 Stats to start tracking your progress!</div>
              </div>
            )}
          </div>
        );
      })()}

      {/* MONTH VIEW */}
      {view === "month" && (
        <div style={{padding:"16px"}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
            <button onClick={() => { if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:10, width:38, height:38, color:"#94a3b8", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>‹</button>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:20, fontWeight:700, color:t.text}}>{MONTHS[calMonth]}</div>
              <div style={{fontSize:13, color:"#475569"}}>{calYear}</div>
            </div>
            <button onClick={() => { if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:10, width:38, height:38, color:"#94a3b8", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>›</button>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:6}}>
            {["S","M","T","W","T","F","S"].map((d,i) => <div key={i} style={{textAlign:"center", fontSize:11, fontWeight:700, color:"#475569", padding:"4px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4}}>
            {calCells.map((date, idx) => {
              if (!date) return <div key={idx} />;
              const dow = new Date(calYear, calMonth, date).getDay();
              const dayName = DAYS[dow];
              const isToday = date===todayDate && calMonth===todayMonth && calYear===todayYear;

              // Check history for actual completed workout on this specific date
              const histKey = calYear + "-" + String(calMonth+1).padStart(2,"0") + "-" + String(date).padStart(2,"0") + "-" + dayName;
              const wasCompleted = !!history[histKey];

              // Check if this is today and workout is in progress
              const p = isToday ? dayProgress(dayName) : null;
              const inProgress = p && p.done > 0 && p.done < p.total;

              return (
                <button key={idx} onClick={() => {setSelectedDay(dayName); setView("week");}} style={{
                  aspectRatio:"1", borderRadius:12, cursor:"pointer",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2,
                  border: isToday ? "1.5px solid " + t.accentSolid : wasCompleted ? "1.5px solid #22c55e" : "1px solid " + t.cardBorder,
                  background: wasCompleted ? "rgba(34,197,94,0.12)" : isToday ? t.accentMuted : t.card,
                }}>
                  <span style={{fontSize:14, fontWeight:isToday||wasCompleted?700:400, color:wasCompleted?"#22c55e":isToday?t.accentText:t.text, lineHeight:1}}>{date}</span>
                  {wasCompleted && <div style={{width:5, height:5, borderRadius:"50%", background:"#22c55e"}} />}
                  {isToday && !wasCompleted && <div style={{width:5, height:5, borderRadius:"50%", background:t.accentSolid}} />}
                </button>
              );
            })}
          </div>
          <div style={{display:"flex", gap:16, marginTop:16, justifyContent:"center"}}>
            {[{color:"#22c55e",label:"Completed"},{color:"rgba(212,175,55,0.8)",label:"Today"}].map(item => (
              <div key={item.label} style={{display:"flex", alignItems:"center", gap:6}}>
                <div style={{width:10, height:10, borderRadius:"50%", background:item.color, border:item.border}} />
                <span style={{fontSize:11, color:"#475569"}}>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:20, background:t.card, border:"1px solid " + t.cardBorder, borderRadius:16, padding:"14px 16px"}}>
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
              <div key={day} onClick={() => {setSelectedDay(day); setView("week");}} style={{display:"flex", alignItems:"center", gap:12, padding:"10px 12px", marginBottom:6, background:t.card, border:"1px solid " + t.cardBorder, borderRadius:12, cursor:"pointer"}}>
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
              <button onClick={() => setVideoPlayer(null)} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:10, width:36, height:36, color:"#94a3b8", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>✕</button>
            </div>
            <div style={{position:"relative", width:"100%", paddingBottom:"56.25%", borderRadius:16, overflow:"hidden", border:"1px solid " + t.cardBorder, background:"#000"}}>
              <iframe src={"https://www.youtube.com/embed/" + videoPlayer.videoId + "?autoplay=1&rel=0&modestbranding=1"} title={videoPlayer.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none"}} />
            </div>
            <div style={{marginTop:12, padding:"10px 14px", background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.15)", borderRadius:12, fontSize:12, color:"#64748b", textAlign:"center"}}>Watch the tutorial then come back to log your sets 💪</div>
          </div>
        </div>
      )}

      {/* EXERCISE LIBRARY MODAL */}
      {showLibrary && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(12px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:500}} onClick={() => {setShowLibrary(false); setLibView("categories"); setLibCategory(null); setLibExercise(null);}}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480, background:t.modal, borderRadius:"24px 24px 0 0", border:"1px solid " + t.cardBorder, borderBottom:"none", maxHeight:"90vh", display:"flex", flexDirection:"column"}}>
            {/* Header */}
            <div style={{padding:"16px 20px 12px", borderBottom:"1px solid " + t.cardBorder, display:"flex", alignItems:"center", gap:12, flexShrink:0}}>
              {libView !== "categories" && (
                <button onClick={() => { if(libView==="exercise"){setLibView("subcats");setLibExercise(null);} else if(libView==="subcats"){setLibView("categories");setLibCategory(null);} }} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:10, width:34, height:34, color:t.textSub, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>←</button>
              )}
              <div style={{flex:1}}>
                <div style={{fontSize:15, fontWeight:800, color:t.text, fontFamily:"Montserrat,sans-serif", letterSpacing:1}}>
                  {libView==="categories" ? "EXERCISE LIBRARY" : libView==="subcats" ? libCategory?.category.toUpperCase() : libExercise?.name.toUpperCase()}
                </div>
                {libView==="categories" && <div style={{fontSize:11, color:t.textMuted, marginTop:2}}>Browse and add to your workout</div>}
              </div>
              <button onClick={() => {setShowLibrary(false); setLibView("categories"); setLibCategory(null); setLibExercise(null);}} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:10, width:34, height:34, color:t.textSub, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>✕</button>
            </div>
            {/* Body */}
            <div style={{overflowY:"auto", flex:1, padding:"12px 16px 40px"}}>
              {/* CATEGORIES */}
              {libView==="categories" && (
                <div style={{display:"flex", flexDirection:"column", gap:10, marginTop:4}}>
                  {EXERCISE_LIBRARY.map(cat => (
                    <button key={cat.category} onClick={() => {setLibCategory(cat); setLibView("subcats");}} style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", background:t.card, border:"1px solid " + t.cardBorder, borderRadius:16, cursor:"pointer", width:"100%", textAlign:"left"}}>
                      <div style={{display:"flex", alignItems:"center", gap:14}}>
                        <div style={{width:44, height:44, borderRadius:12, background:t.accentMuted, border:"1px solid " + t.accentBorder, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22}}>{cat.icon}</div>
                        <div>
                          <div style={{fontSize:15, fontWeight:700, color:t.text, fontFamily:"Montserrat,sans-serif"}}>{cat.category}</div>
                          <div style={{fontSize:12, color:t.textMuted, marginTop:2}}>{cat.subs.reduce((a,s)=>a+s.exercises.length,0)} exercises · {cat.subs.length} muscle groups</div>
                        </div>
                      </div>
                      <div style={{fontSize:18, color:t.accentText}}>›</div>
                    </button>
                  ))}
                </div>
              )}
              {/* SUBCATEGORIES */}
              {libView==="subcats" && libCategory && (
                <div style={{display:"flex", flexDirection:"column", gap:8, marginTop:4}}>
                  {libCategory.subs.map(sub => (
                    <div key={sub.name} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, overflow:"hidden"}}>
                      <div style={{padding:"10px 14px", borderBottom:"1px solid " + t.cardBorder}}>
                        <div style={{fontSize:11, fontWeight:700, color:t.accentText, letterSpacing:2, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif"}}>{sub.name}</div>
                      </div>
                      {sub.exercises.map((ex, i) => (
                        <button key={ex.name} onClick={() => {setLibExercise(ex); setLibView("exercise");}} style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", background:"transparent", border:"none", borderBottom:i<sub.exercises.length-1?"1px solid " + t.cardBorder:"none", cursor:"pointer", width:"100%", textAlign:"left"}}>
                          <div>
                            <div style={{fontSize:14, color:t.text, fontWeight:500}}>{ex.name}</div>
                            <div style={{fontSize:11, color:t.textMuted, marginTop:2}}>{ex.sets} sets × {ex.reps} reps</div>
                          </div>
                          <div style={{display:"flex", alignItems:"center", gap:8}}>
                            {ex.video && <div style={{width:28, height:28, borderRadius:8, background:"rgba(239,68,68,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#f87171"}}>▶</div>}
                            <div style={{fontSize:16, color:t.accentText}}>›</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {/* EXERCISE DETAIL */}
              {libView==="exercise" && libExercise && (
                <div style={{marginTop:4}}>
                  {libExercise.video ? (
                    <div style={{position:"relative", width:"100%", paddingBottom:"56.25%", borderRadius:16, overflow:"hidden", background:"#000", marginBottom:16}}>
                      <iframe src={"https://www.youtube.com/embed/" + libExercise.video + "?rel=0&modestbranding=1"} title={libExercise.name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none"}} />
                    </div>
                  ) : (
                    <div style={{width:"100%", height:120, borderRadius:16, background:t.card, border:"1px solid " + t.cardBorder, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, flexDirection:"column", gap:6}}>
                      <div style={{fontSize:28}}>🎬</div>
                      <div style={{fontSize:12, color:t.textMuted}}>Video coming soon</div>
                    </div>
                  )}
                  <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, padding:"14px 16px", marginBottom:14}}>
                    <div style={{fontSize:11, color:t.accentText, letterSpacing:2, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:8, fontWeight:700}}>How to perform</div>
                    <div style={{fontSize:14, color:t.text, lineHeight:1.7}}>{libExercise.desc}</div>
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16}}>
                    {[{label:"Default Sets", val:libExercise.sets},{label:"Default Reps", val:libExercise.reps}].map(s => (
                      <div key={s.label} style={{background:t.accentMuted, border:"1px solid " + t.accentBorder, borderRadius:12, padding:"12px", textAlign:"center"}}>
                        <div style={{fontSize:24, fontWeight:800, color:t.accentText}}>{s.val}</div>
                        <div style={{fontSize:11, color:t.textMuted, marginTop:2}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:11, color:t.textMuted, letterSpacing:1, textTransform:"uppercase", marginBottom:10, fontFamily:"Montserrat,sans-serif", fontWeight:700}}>Add to day</div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                    {DAYS.map(day => (
                      <button key={day} onClick={() => { addExerciseToDay(day, {id:nextId++, name:libExercise.name, sets:libExercise.sets, reps:libExercise.reps, video:libExercise.video||""}); setShowLibrary(false); setLibView("categories"); setSelectedDay(day); setView("week"); }} style={{padding:"10px", background:day===selectedDay?t.accent:t.card, border:"1px solid " + (day===selectedDay?t.accentSolid:t.cardBorder), borderRadius:10, color:day===selectedDay?"#000":t.text, fontSize:13, fontWeight:day===selectedDay?700:500, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <span>{FULL_DAYS[DAYS.indexOf(day)].slice(0,3)}</span>
                        {day===selectedDay && <span style={{fontSize:10, fontWeight:700}}>NOW</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* MOVE TO DAY MODAL */}
      {moveModal && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, padding:20}} onClick={() => setMoveModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:360, background:"#13151f", borderRadius:20, padding:"24px 20px", border:"1px solid " + t.cardBorder}}>
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
            <button onClick={() => setMoveModal(null)} style={{width:"100%", marginTop:14, padding:"12px", background:"rgba(255,255,255,0.05)", border:"1px solid " + t.cardBorder, borderRadius:12, color:"#64748b", fontSize:14, cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {showHistory && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(12px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:500}} onClick={() => {setShowHistory(false); setHistoryDetail(null);}}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480, background:t.modal, borderRadius:"24px 24px 0 0", padding:"24px 20px 48px", border:"1px solid " + t.cardBorder, borderBottom:"none", maxHeight:"88vh", overflowY:"auto"}}>
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
                  <div key={ei} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, padding:"12px 14px", marginBottom:10}}>
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
                  <button key={key} onClick={() => setHistoryDetail(key)} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, padding:"12px 14px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", marginBottom:8, textAlign:"left"}}>
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

      {/* PHOTO MEAL SCANNER */}
      {showScanner && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(16px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:600}}>
          <div style={{width:"100%", maxWidth:480, background:t.modal, borderRadius:"24px 24px 0 0", border:"1px solid " + t.cardBorder, borderBottom:"none", maxHeight:"88vh", display:"flex", flexDirection:"column"}}>
            <div style={{padding:"16px 20px 12px", borderBottom:"1px solid " + t.cardBorder, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0}}>
              <div>
                <div style={{fontSize:15, fontWeight:800, color:t.text, fontFamily:"Montserrat,sans-serif", letterSpacing:1}}>SCAN YOUR MEAL</div>
                <div style={{fontSize:11, color:t.textMuted, marginTop:2}}>Take a photo to estimate calories and macros</div>
              </div>
              <button onClick={() => setShowScanner(false)} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:10, width:34, height:34, color:t.textSub, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>✕</button>
            </div>
            <div style={{overflowY:"auto", flex:1, padding:"20px"}}>
              {!scanResult && !scanLoading && (
                <div style={{display:"flex", flexDirection:"column", gap:12}}>
                  <div style={{textAlign:"center", padding:"32px 20px", background:t.card, border:"2px dashed " + t.accentBorder, borderRadius:16}}>
                    <div style={{fontSize:48, marginBottom:12}}>📷</div>
                    <div style={{fontSize:14, color:t.text, fontWeight:600, marginBottom:8}}>Take or upload a photo of your meal</div>
                    <div style={{fontSize:12, color:t.textMuted, marginBottom:20}}>AI will estimate calories, protein, carbs and fat</div>
                    <label style={{display:"inline-block", padding:"12px 24px", background:"linear-gradient(135deg,#D4AF37,#B8941F)", borderRadius:12, color:"#000", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"Montserrat,sans-serif"}}>
                      Choose Photo
                      <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={async e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setScanLoading(true); setScanError("");
                        try {
                          const reader = new FileReader();
                          reader.onload = async (ev) => {
                            const base64 = ev.target.result.split(",")[1];
                            const mediaType = file.type;
                            const res = await fetch("https://api.anthropic.com/v1/messages", {
                              method:"POST", headers:{"Content-Type":"application/json"},
                              body: JSON.stringify({
                                model:"claude-sonnet-4-20250514", max_tokens:1000,
                                system:"You are a nutrition expert. Analyze food images and provide accurate nutritional estimates. Return ONLY valid JSON, no markdown.",
                                messages:[{role:"user", content:[
                                  {type:"image", source:{type:"base64", media_type:mediaType, data:base64}},
                                  {type:"text", text:"Analyze this meal photo. Identify all foods and estimate portions. Return JSON: {meal_name, description, foods:[{name, amount, calories, protein, carbs, fat}], totals:{calories, protein, carbs, fat}, confidence_note}"}
                                ]}]
                              })
                            });
                            const data = await res.json();
                            const raw = data.content?.find(b => b.type==="text")?.text || "";
                            const cleaned = raw.replace(/```json|```/g,"").trim();
                            const parsed = JSON.parse(cleaned);
                            setScanResult({...parsed, imageUrl: ev.target.result});
                            setScanLoading(false);
                          };
                          reader.readAsDataURL(file);
                        } catch(e) {
                          setScanError("Could not analyze photo. Please try again.");
                          setScanLoading(false);
                        }
                      }} />
                    </label>
                  </div>
                  {scanError && <div style={{color:"#f87171", fontSize:12, textAlign:"center"}}>{scanError}</div>}
                  <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:12, padding:"12px 14px"}}>
                    <div style={{fontSize:11, color:t.accentText, fontWeight:700, marginBottom:6}}>HOW IT WORKS</div>
                    <div style={{fontSize:12, color:t.textMuted, lineHeight:1.7}}>
                      1. Take a clear photo of your meal{"
"}
                      2. AI identifies all food items{"
"}
                      3. Estimates portions and macros{"
"}
                      4. Add to your daily nutrition log
                    </div>
                  </div>
                </div>
              )}

              {scanLoading && (
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 20px", gap:20}}>
                  <div style={{width:48, height:48, border:"3px solid rgba(212,175,55,0.3)", borderTopColor:"#D4AF37", borderRadius:"50%", animation:"spin 0.8s linear infinite"}} />
                  <div style={{fontSize:15, fontWeight:700, color:t.text}}>Analyzing your meal...</div>
                  <div style={{fontSize:12, color:t.textMuted}}>Identifying foods and calculating macros</div>
                </div>
              )}

              {scanResult && !scanLoading && (
                <div>
                  {scanResult.imageUrl && (
                    <div style={{width:"100%", borderRadius:16, overflow:"hidden", marginBottom:16, maxHeight:200}}>
                      <img src={scanResult.imageUrl} style={{width:"100%", height:"100%", objectFit:"cover"}} alt="meal" />
                    </div>
                  )}
                  <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, padding:"14px 16px", marginBottom:12}}>
                    <div style={{fontSize:15, fontWeight:700, color:t.text, marginBottom:4}}>{scanResult.meal_name}</div>
                    <div style={{fontSize:12, color:t.textMuted, marginBottom:12, lineHeight:1.5}}>{scanResult.description}</div>
                    {scanResult.foods && scanResult.foods.map((food, i) => (
                      <div key={i} style={{fontSize:12, color:t.textMuted, marginBottom:4, paddingLeft:8}}>
                        • {food.amount} {food.name} — {food.calories} cal, {food.protein}g protein
                      </div>
                    ))}
                  </div>

                  {scanResult.totals && (
                    <div style={{background:t.accentMuted, border:"1px solid " + t.accentBorder, borderRadius:14, padding:"14px 16px", marginBottom:16}}>
                      <div style={{fontSize:11, fontWeight:700, color:t.accentText, letterSpacing:2, textTransform:"uppercase", marginBottom:10, fontFamily:"Montserrat,sans-serif"}}>Estimated Totals</div>
                      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                        {[{l:"Calories",v:scanResult.totals.calories,u:"kcal",c:"#F5D070"},{l:"Protein",v:scanResult.totals.protein,u:"g",c:"#ef4444"},{l:"Carbs",v:scanResult.totals.carbs,u:"g",c:"#f97316"},{l:"Fat",v:scanResult.totals.fat,u:"g",c:"#a78bfa"}].map(m => (
                          <div key={m.l} style={{textAlign:"center", padding:"10px", background:t.card, borderRadius:10}}>
                            <div style={{fontSize:20, fontWeight:800, color:m.c}}>{m.v}</div>
                            <div style={{fontSize:10, color:t.textMuted}}>{m.u}</div>
                            <div style={{fontSize:10, color:t.textMuted}}>{m.l}</div>
                          </div>
                        ))}
                      </div>
                      {scanResult.confidence_note && <div style={{fontSize:11, color:t.textMuted, marginTop:10, fontStyle:"italic"}}>{scanResult.confidence_note}</div>}
                    </div>
                  )}

                  <div style={{display:"flex", gap:10}}>
                    <button onClick={() => {
                      if (scanResult.totals) {
                        const todayKey = getTodayKey();
                        setNutrition(n => ({...n, [todayKey]: {
                          calories: (n[todayKey]?.calories||0) + (scanResult.totals.calories||0),
                          protein: (n[todayKey]?.protein||0) + (scanResult.totals.protein||0),
                          carbs: (n[todayKey]?.carbs||0) + (scanResult.totals.carbs||0),
                          fat: (n[todayKey]?.fat||0) + (scanResult.totals.fat||0),
                          water: n[todayKey]?.water||0,
                          steps: n[todayKey]?.steps||0,
                        }}));
                      }
                      setShowScanner(false);
                      setView("nutrition");
                    }} style={{flex:1, padding:"14px", background:"linear-gradient(135deg,#D4AF37,#B8941F)", border:"none", borderRadius:12, color:"#000", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"Montserrat,sans-serif"}}>
                      Add to Today
                    </button>
                    <button onClick={() => setScanResult(null)} style={{padding:"14px 16px", background:t.card, border:"1px solid " + t.cardBorder, borderRadius:12, color:t.textSub, fontSize:13, cursor:"pointer"}}>
                      Retake
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MEAL PLANNER MODAL */}
      {showMealPlanner && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(16px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:600}}>
          <div style={{width:"100%", maxWidth:480, background:t.modal, borderRadius:"24px 24px 0 0", border:"1px solid " + t.cardBorder, borderBottom:"none", maxHeight:"90vh", display:"flex", flexDirection:"column"}}>
            <div style={{padding:"16px 20px 12px", borderBottom:"1px solid " + t.cardBorder, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0}}>
              <div>
                <div style={{fontSize:15, fontWeight:800, color:t.text, fontFamily:"Montserrat,sans-serif", letterSpacing:1}}>MY MEAL PLAN</div>
                <div style={{fontSize:11, color:t.textMuted, marginTop:2}}>Personalized nutrition for your goals</div>
              </div>
              <button onClick={() => setShowMealPlanner(false)} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:10, width:34, height:34, color:t.textSub, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>✕</button>
            </div>
            <div style={{overflowY:"auto", flex:1, padding:"16px 20px 40px"}}>

              {/* QUESTIONS */}
              {mealPlanStep === "questions" && (
                <div style={{display:"flex", flexDirection:"column", gap:14}}>

                  {/* Height + Weight */}
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
                    <div>
                      <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:6, fontWeight:700}}>Height</div>
                      <input type="text" placeholder='e.g. 5ft 11in' value={mealProfile.height} onChange={e => setMealProfile(p => ({...p, height:e.target.value}))}
                        style={{width:"100%", padding:"12px", background:t.input, border:"1px solid " + t.inputBorder, borderRadius:10, color:t.text, fontSize:14, outline:"none", boxSizing:"border-box"}} />
                    </div>
                    <div>
                      <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:6, fontWeight:700}}>Current Weight</div>
                      <input type="text" placeholder="e.g. 185 lbs" value={mealProfile.weight} onChange={e => setMealProfile(p => ({...p, weight:e.target.value}))}
                        style={{width:"100%", padding:"12px", background:t.input, border:"1px solid " + t.inputBorder, borderRadius:10, color:t.text, fontSize:14, outline:"none", boxSizing:"border-box"}} />
                    </div>
                  </div>

                  {/* Goal */}
                  <div>
                    <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:8, fontWeight:700}}>My Goal</div>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                      {["Build Strength","Get Leaner","Gain Muscle","Lose Weight","Maintain Weight","Athletic Performance"].map(g => (
                        <button key={g} onClick={() => setMealProfile(p => ({...p, goal:g}))} style={{padding:"10px", background:mealProfile.goal===g?t.accent:t.card, border:"1px solid " + (mealProfile.goal===g?t.accentSolid:t.cardBorder), borderRadius:10, color:mealProfile.goal===g?"#000":t.text, fontSize:12, fontWeight:mealProfile.goal===g?700:400, cursor:"pointer"}}>{g}</button>
                      ))}
                    </div>
                  </div>

                  {/* Goal weight */}
                  <div>
                    <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:6, fontWeight:700}}>Goal Weight (optional)</div>
                    <input type="text" placeholder="e.g. 175 lbs" value={mealProfile.goalWeight} onChange={e => setMealProfile(p => ({...p, goalWeight:e.target.value}))}
                      style={{width:"100%", padding:"12px", background:t.input, border:"1px solid " + t.inputBorder, borderRadius:10, color:t.text, fontSize:14, outline:"none", boxSizing:"border-box"}} />
                  </div>

                  {/* Meal times */}
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
                    <div>
                      <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:6, fontWeight:700}}>First Meal Time</div>
                      <input type="time" value={mealProfile.breakfastTime} onChange={e => setMealProfile(p => ({...p, breakfastTime:e.target.value}))}
                        style={{width:"100%", padding:"12px", background:t.input, border:"1px solid " + t.inputBorder, borderRadius:10, color:t.text, fontSize:14, outline:"none", boxSizing:"border-box"}} />
                    </div>
                    <div>
                      <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:6, fontWeight:700}}>Last Meal Time</div>
                      <input type="time" value={mealProfile.lastMealTime} onChange={e => setMealProfile(p => ({...p, lastMealTime:e.target.value}))}
                        style={{width:"100%", padding:"12px", background:t.input, border:"1px solid " + t.inputBorder, borderRadius:10, color:t.text, fontSize:14, outline:"none", boxSizing:"border-box"}} />
                    </div>
                  </div>

                  {/* Diet type */}
                  <div>
                    <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:8, fontWeight:700}}>Diet Type</div>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8}}>
                      {["Regular","Keto","Vegan","Vegetarian","Paleo","Mediterranean"].map(d => (
                        <button key={d} onClick={() => setMealProfile(p => ({...p, dietType:d}))} style={{padding:"10px", background:mealProfile.dietType===d?t.accent:t.card, border:"1px solid " + (mealProfile.dietType===d?t.accentSolid:t.cardBorder), borderRadius:10, color:mealProfile.dietType===d?"#000":t.text, fontSize:12, fontWeight:mealProfile.dietType===d?700:400, cursor:"pointer"}}>{d}</button>
                      ))}
                    </div>
                  </div>

                  {/* Activity level */}
                  <div>
                    <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:8, fontWeight:700}}>Activity Level</div>
                    <div style={{display:"flex", flexDirection:"column", gap:8}}>
                      {[["Sedentary","Little to no exercise"],["Light","1-3 days/week"],["Moderate","3-5 days/week — your level"],["Heavy","6-7 days/week"],["Athlete","2x/day training"]].map(([level, desc]) => (
                        <button key={level} onClick={() => setMealProfile(p => ({...p, activityLevel:level}))} style={{padding:"10px 14px", background:mealProfile.activityLevel===level?t.accentMuted:t.card, border:"1px solid " + (mealProfile.activityLevel===level?t.accentSolid:t.cardBorder), borderRadius:10, cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:13, color:mealProfile.activityLevel===level?t.accentText:t.text, fontWeight:mealProfile.activityLevel===level?700:400}}>{level}</div>
                            <div style={{fontSize:11, color:t.textMuted}}>{desc}</div>
                          </div>
                          {mealProfile.activityLevel===level && <div style={{width:8, height:8, borderRadius:"50%", background:t.accentSolid}} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meals per day */}
                  <div>
                    <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:8, fontWeight:700}}>Meals Per Day</div>
                    <div style={{display:"flex", gap:8}}>
                      {["2","3","4","5","6"].map(n => (
                        <button key={n} onClick={() => setMealProfile(p => ({...p, mealsPerDay:n}))} style={{flex:1, padding:"12px", background:mealProfile.mealsPerDay===n?t.accent:t.card, border:"1px solid " + (mealProfile.mealsPerDay===n?t.accentSolid:t.cardBorder), borderRadius:10, color:mealProfile.mealsPerDay===n?"#000":t.text, fontSize:15, fontWeight:700, cursor:"pointer"}}>{n}</button>
                      ))}
                    </div>
                  </div>

                  {/* Allergies */}
                  <div>
                    <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:6, fontWeight:700}}>Allergies / Foods to Avoid</div>
                    <input type="text" placeholder="e.g. gluten, dairy, nuts..." value={mealProfile.allergies} onChange={e => setMealProfile(p => ({...p, allergies:e.target.value}))}
                      style={{width:"100%", padding:"12px", background:t.input, border:"1px solid " + t.inputBorder, borderRadius:10, color:t.text, fontSize:14, outline:"none", boxSizing:"border-box"}} />
                  </div>

                  {mealPlanError && <div style={{color:"#f87171", fontSize:12, textAlign:"center"}}>{mealPlanError}</div>}

                  <button onClick={async () => {
                    if (!mealProfile.goal || !mealProfile.dietType || !mealProfile.activityLevel) {
                      setMealPlanError("Please fill in goal, diet type and activity level.");
                      return;
                    }
                    setMealPlanStep("loading"); setMealPlanError("");
                    try {
                      const macroTarget = mealProfile.goal.includes("Lean") || mealProfile.goal.includes("Lose") ? "calorie deficit (15-20% below TDEE)" : mealProfile.goal.includes("Strength") || mealProfile.goal.includes("Muscle") ? "calorie surplus (10-15% above TDEE)" : "maintenance calories";
                      const prompt = "Create a detailed 4-week rotating meal plan. User profile: Height: " + (mealProfile.height||"not specified") + ", Weight: " + (mealProfile.weight||"not specified") + ", Goal: " + mealProfile.goal + (mealProfile.goalWeight ? ", Goal weight: " + mealProfile.goalWeight : "") + ", Diet: " + mealProfile.dietType + ", Activity: " + mealProfile.activityLevel + ", Meals per day: " + mealProfile.mealsPerDay + ", First meal: " + mealProfile.breakfastTime + ", Last meal: " + mealProfile.lastMealTime + (mealProfile.allergies ? ", Avoid: " + mealProfile.allergies : "") + ". Use " + macroTarget + ". Return ONLY valid JSON with this structure: {week1:{monday:{meals:[{time,name,foods:[{item,amount,calories,protein,carbs,fat}],totalCalories,totalProtein,totalCarbs,totalFat}]},tuesday:...,wednesday:...,thursday:...,friday:...,saturday:...,sunday:...},week2:...,week3:...,week4:...,dailyTotals:{calories,protein,carbs,fat},notes}. Use specific real foods with accurate macros. Times based on first meal " + mealProfile.breakfastTime + " and last meal " + mealProfile.lastMealTime + ". No markdown, just JSON.";
                      const res = await fetch("https://api.anthropic.com/v1/messages", {
                        method:"POST", headers:{"Content-Type":"application/json"},
                        body: JSON.stringify({
                          model:"claude-sonnet-4-20250514", max_tokens:4000,
                          system:"You are an expert sports nutritionist and dietitian with deep knowledge of food macros. Create detailed, realistic meal plans with specific foods and accurate nutritional data. Return ONLY valid JSON, no markdown, no explanation.",
                          messages:[{role:"user", content:prompt}]
                        })
                      });
                      const data = await res.json();
                      const raw = data.content?.find(b => b.type==="text")?.text || "";
                      const cleaned = raw.replace(/```json|```/g,"").trim();
                      const parsed = JSON.parse(cleaned);
                      setMealPlan(parsed);
                      setMealPlanStep("plan");
                    } catch(e) {
                      setMealPlanError("Could not generate plan. Please try again.");
                      setMealPlanStep("questions");
                    }
                  }} disabled={!mealProfile.goal || !mealProfile.dietType || !mealProfile.activityLevel}
                    style={{width:"100%", padding:"16px", background:(!mealProfile.goal||!mealProfile.dietType||!mealProfile.activityLevel)?"rgba(212,175,55,0.3)":"linear-gradient(135deg,#D4AF37,#B8941F)", border:"none", borderRadius:14, color:"#000", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"Montserrat,sans-serif", letterSpacing:1}}>
                    Generate My Meal Plan
                  </button>
                </div>
              )}

              {/* LOADING */}
              {mealPlanStep === "loading" && (
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 20px", gap:20}}>
                  <div style={{width:48, height:48, border:"3px solid rgba(212,175,55,0.3)", borderTopColor:"#D4AF37", borderRadius:"50%", animation:"spin 0.8s linear infinite"}} />
                  <div style={{fontSize:15, fontWeight:700, color:t.text, fontFamily:"Montserrat,sans-serif"}}>Building your 4-week plan...</div>
                  <div style={{fontSize:12, color:t.textMuted, textAlign:"center", lineHeight:1.6}}>Calculating your calories, macros and meal schedule based on your goals</div>
                </div>
              )}

              {/* PLAN VIEW */}
              {mealPlanStep === "plan" && mealPlan && (
                <div>
                  {/* Header */}
                  <div style={{background:t.accentMuted, border:"1px solid " + t.accentBorder, borderRadius:14, padding:"14px 16px", marginBottom:16}}>
                    <div style={{fontSize:13, fontWeight:800, color:t.accentText, marginBottom:4, fontFamily:"Montserrat,sans-serif"}}>{mealProfile.goal} — {mealProfile.dietType} Plan</div>
                    <div style={{fontSize:11, color:t.textMuted}}>{mealProfile.activityLevel} activity · {mealProfile.mealsPerDay} meals/day</div>
                    {mealPlan.dailyTotals && (
                      <div style={{display:"flex", gap:8, marginTop:10, flexWrap:"wrap"}}>
                        {[{l:"Calories",v:mealPlan.dailyTotals.calories,c:"#F5D070"},{l:"Protein",v:mealPlan.dailyTotals.protein+"g",c:"#ef4444"},{l:"Carbs",v:mealPlan.dailyTotals.carbs+"g",c:"#f97316"},{l:"Fat",v:mealPlan.dailyTotals.fat+"g",c:"#a78bfa"}].map(m => (
                          <div key={m.l} style={{padding:"4px 10px", borderRadius:8, background:t.card, fontSize:11}}>
                            <span style={{color:t.textMuted}}>{m.l}: </span><span style={{color:m.c, fontWeight:700}}>{m.v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Week selector */}
                  <div style={{display:"flex", gap:6, marginBottom:16}}>
                    {["Week 1","Week 2","Week 3","Week 4"].map((w,i) => (
                      <button key={i} onClick={() => setMealPlanWeek(i)} style={{flex:1, padding:"8px 4px", background:mealPlanWeek===i?t.accent:t.card, border:"1px solid " + (mealPlanWeek===i?t.accentSolid:t.cardBorder), borderRadius:10, color:mealPlanWeek===i?"#000":t.text, fontSize:11, fontWeight:700, cursor:"pointer"}}>{w}</button>
                    ))}
                  </div>

                  {/* Days */}
                  {(() => {
                    const weekKey = ["week1","week2","week3","week4"][mealPlanWeek];
                    const weekData = mealPlan[weekKey] || {};
                    const dayNames = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
                    return dayNames.map(day => {
                      const dayData = weekData[day];
                      if (!dayData || !dayData.meals) return null;
                      return (
                        <div key={day} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, padding:"14px", marginBottom:10}}>
                          <div style={{fontSize:12, fontWeight:800, color:t.accentText, textTransform:"uppercase", letterSpacing:2, marginBottom:10, fontFamily:"Montserrat,sans-serif"}}>{day}</div>
                          {dayData.meals.map((meal, mi) => {
                            const mealKey = weekKey + "-" + day + "-" + mi;
                            const isChecked = checkedMeals[mealKey];
                            return (
                              <div key={mi} style={{marginBottom:12, paddingBottom:12, borderBottom:mi<dayData.meals.length-1?"1px solid " + t.cardBorder:"none", opacity:isChecked?0.6:1}}>
                                <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6}}>
                                  <div style={{flex:1}}>
                                    <div style={{fontSize:11, color:t.textMuted, marginBottom:2}}>{meal.time}</div>
                                    <div style={{fontSize:14, fontWeight:700, color:isChecked?t.accentText:t.text, textDecoration:isChecked?"line-through":"none"}}>{meal.name}</div>
                                  </div>
                                  <button onClick={() => {
                                    setCheckedMeals(prev => {
                                      const updated = {...prev, [mealKey]: !prev[mealKey]};
                                      if (!prev[mealKey] && meal.totalCalories) {
                                        const todayKey = getTodayKey();
                                        setNutrition(n => ({...n, [todayKey]: {
                                          calories: (n[todayKey]?.calories||0) + (meal.totalCalories||0),
                                          protein: (n[todayKey]?.protein||0) + (meal.totalProtein||0),
                                          carbs: (n[todayKey]?.carbs||0) + (meal.totalCarbs||0),
                                          fat: (n[todayKey]?.fat||0) + (meal.totalFat||0),
                                          water: n[todayKey]?.water||0,
                                          steps: n[todayKey]?.steps||0,
                                        }}));
                                      }
                                      return updated;
                                    });
                                  }} style={{width:32, height:32, borderRadius:"50%", border:"2px solid " + (isChecked?t.accentSolid:t.cardBorder), background:isChecked?t.accent:"transparent", color:isChecked?"#000":t.textMuted, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:8}}>
                                    {isChecked ? "✓" : "○"}
                                  </button>
                                </div>
                                {meal.foods && meal.foods.map((food, fi) => (
                                  <div key={fi} style={{fontSize:12, color:t.textMuted, paddingLeft:8, marginBottom:2}}>• {food.amount} {food.item} — {food.calories} cal, {food.protein}g P</div>
                                ))}
                                <div style={{display:"flex", gap:6, marginTop:6, flexWrap:"wrap"}}>
                                  {[{l:"Cal",v:meal.totalCalories,c:"#F5D070"},{l:"P",v:meal.totalProtein+"g",c:"#ef4444"},{l:"C",v:meal.totalCarbs+"g",c:"#f97316"},{l:"F",v:meal.totalFat+"g",c:"#a78bfa"}].map(m => (
                                    <span key={m.l} style={{fontSize:10, padding:"2px 6px", borderRadius:6, background:t.toggleBg, color:m.c, fontWeight:700}}>{m.l}: {m.v}</span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    });
                  })()}

                  <div style={{display:"flex", gap:10, marginTop:8}}>
                    <button onClick={() => setShowMealPlanner(false)} style={{flex:1, padding:"14px", background:"linear-gradient(135deg,#D4AF37,#B8941F)", border:"none", borderRadius:12, color:"#000", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"Montserrat,sans-serif"}}>Done</button>
                    <button onClick={() => setMealPlanStep("questions")} style={{padding:"14px 16px", background:t.card, border:"1px solid " + t.cardBorder, borderRadius:12, color:t.textSub, fontSize:13, cursor:"pointer"}}>Redo</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {showProfile && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.95)", backdropFilter:"blur(16px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:600}}>
          <div style={{width:"100%", maxWidth:480, background:t.modal, borderRadius:"24px 24px 0 0", border:"1px solid " + t.cardBorder, borderBottom:"none", maxHeight:"92vh", display:"flex", flexDirection:"column"}}>

            {/* Header */}
            <div style={{padding:"16px 20px 0", flexShrink:0}}>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
                <div style={{fontSize:15, fontWeight:800, color:t.text, fontFamily:"Montserrat,sans-serif", letterSpacing:1}}>MY PROFILE</div>
                <button onClick={() => setShowProfile(false)} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:10, width:34, height:34, color:t.textSub, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>✕</button>
              </div>

              {/* Avatar + name */}
              <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:16}}>
                <div style={{position:"relative"}}>
                  <div style={{width:72, height:72, borderRadius:"50%", background:t.accentMuted, border:"2px solid " + t.accentSolid, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center"}}>
                    {avatarUrl ? <img src={avatarUrl} style={{width:"100%", height:"100%", objectFit:"cover"}} alt="avatar" /> : <span style={{fontSize:32}}>👤</span>}
                  </div>
                  <label style={{position:"absolute", bottom:0, right:0, width:24, height:24, borderRadius:"50%", background:t.accent, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:12}}>
                    {uploadingAvatar ? "⌛" : "📷"}
                    <input type="file" accept="image/*" style={{display:"none"}} onChange={e => { if(e.target.files[0]) uploadAvatar(e.target.files[0]); }} />
                  </label>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:17, fontWeight:700, color:t.text}}>{profileData.name || (user?.email?.split("@")[0]) || "Athlete"}</div>
                  <div style={{fontSize:12, color:t.textMuted, marginTop:2}}>{user?.email || "Not logged in"}</div>
                  {/* Progress bar */}
                  <div style={{marginTop:8}}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                      <span style={{fontSize:10, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif"}}>Monthly Progress</span>
                      <span style={{fontSize:10, color:t.accentText, fontWeight:700}}>{getProgressPct()}%</span>
                    </div>
                    <div style={{height:6, background:t.cardBorder, borderRadius:3}}>
                      <div style={{height:6, width:getProgressPct()+"%", background:"linear-gradient(135deg,#D4AF37,#B8941F)", borderRadius:3, transition:"width 0.5s", boxShadow:"0 0 8px rgba(212,175,55,0.5)"}} />
                    </div>
                    <div style={{fontSize:10, color:t.textMuted, marginTop:3}}>{Object.keys(history).length} workouts completed · goal: 20/month</div>
                  </div>
                </div>
              </div>

              {/* Tab bar */}
              <div style={{display:"flex", gap:4, background:t.toggleBg, borderRadius:12, padding:4, marginBottom:0}}>
                {[["info","Info"],["gallery","Gallery"],["settings","Settings"]].map(([tab, label]) => (
                  <button key={tab} onClick={() => setProfileTab(tab)} style={{flex:1, padding:"8px 4px", borderRadius:9, border:"none", background:profileTab===tab?t.accent:"transparent", color:profileTab===tab?"#000":t.textMuted, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Montserrat,sans-serif"}}>{label}</button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div style={{overflowY:"auto", flex:1, padding:"16px 20px 40px"}}>

              {/* MESSAGES at top always */}
              <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:16, marginBottom:16, overflow:"hidden"}}>
                <div style={{padding:"10px 14px", borderBottom:"1px solid " + t.cardBorder, display:"flex", alignItems:"center", gap:8}}>
                  <div style={{width:8, height:8, borderRadius:"50%", background:"#22c55e"}} />
                  <span style={{fontSize:12, fontWeight:700, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif"}}>Coach Messages</span>
                </div>
                <div style={{maxHeight:160, overflowY:"auto", padding:"8px 14px"}}>
                  {messages.map(msg => (
                    <div key={msg.id} style={{display:"flex", gap:8, marginBottom:10, justifyContent:msg.from==="coach"?"flex-start":"flex-end"}}>
                      {msg.from==="coach" && <div style={{width:28, height:28, borderRadius:"50%", background:t.accentMuted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0}}>🏋️</div>}
                      <div style={{maxWidth:"80%", padding:"8px 12px", borderRadius:msg.from==="coach"?"4px 14px 14px 14px":"14px 4px 14px 14px", background:msg.from==="coach"?t.card:t.accentMuted, border:"1px solid " + t.cardBorder}}>
                        <div style={{fontSize:13, color:t.text, lineHeight:1.5}}>{msg.text}</div>
                        <div style={{fontSize:10, color:t.textMuted, marginTop:4}}>{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{padding:"8px 14px", borderTop:"1px solid " + t.cardBorder, display:"flex", gap:8}}>
                  <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Message your coach..." onKeyDown={e => { if(e.key==="Enter" && newMessage.trim()) { setMessages(prev => [...prev, {id:Date.now(), from:"user", text:newMessage.trim(), time:"Just now"}]); setNewMessage(""); }}}
                    style={{flex:1, padding:"8px 12px", background:t.input, border:"1px solid " + t.inputBorder, borderRadius:10, color:t.text, fontSize:13, outline:"none"}} />
                  <button onClick={() => { if(newMessage.trim()) { setMessages(prev => [...prev, {id:Date.now(), from:"user", text:newMessage.trim(), time:"Just now"}]); setNewMessage(""); }}} style={{padding:"8px 14px", background:t.accent, border:"none", borderRadius:10, color:"#000", fontSize:13, fontWeight:700, cursor:"pointer"}}>Send</button>
                </div>
              </div>

              {/* INFO TAB */}
              {profileTab==="info" && (
                <div style={{display:"flex", flexDirection:"column", gap:10}}>
                  {[
                    {key:"name", label:"Full Name", placeholder:"Your name", type:"text"},
                    {key:"age", label:"Age", placeholder:"Your age", type:"number"},
                    {key:"weight", label:"Weight (lbs)", placeholder:"Current weight", type:"number"},
                    {key:"height", label:"Height (ft/in)", placeholder:"e.g. 5ft 11in", type:"text"},
                  ].map(field => (
                    <div key={field.key}>
                      <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:6, fontWeight:600}}>{field.label}</div>
                      <input type={field.type} placeholder={field.placeholder} value={profileData[field.key]||""} onChange={e => setProfileData(p => ({...p, [field.key]:e.target.value}))}
                        style={{width:"100%", padding:"12px 14px", background:t.input, border:"1px solid " + t.inputBorder, borderRadius:12, color:t.text, fontSize:15, outline:"none", boxSizing:"border-box"}} />
                    </div>
                  ))}
                  <div>
                    <div style={{fontSize:11, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:6, fontWeight:600}}>Fitness Goal</div>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                      {["Gain Muscle","Lose Weight","Build Strength","Improve Agility","Full Body","Athletic Performance"].map(g => (
                        <button key={g} onClick={() => setProfileData(p => ({...p, goal:g}))} style={{padding:"10px", background:profileData.goal===g?t.accent:t.card, border:"1px solid " + (profileData.goal===g?t.accentSolid:t.cardBorder), borderRadius:10, color:profileData.goal===g?"#000":t.text, fontSize:12, fontWeight:profileData.goal===g?700:400, cursor:"pointer"}}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setShowProfile(false)} style={{width:"100%", padding:"14px", background:"linear-gradient(135deg,#D4AF37,#B8941F)", border:"none", borderRadius:14, color:"#000", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"Montserrat,sans-serif", letterSpacing:1, marginTop:8}}>SAVE PROFILE</button>
                </div>
              )}

              {/* GALLERY TAB */}
              {profileTab==="gallery" && (
                <div>
                  <div style={{fontSize:12, color:t.textMuted, marginBottom:16, lineHeight:1.6}}>Track your transformation month by month. Add before & after photos to see your progress over time.</div>
                  {["Month 1","Month 2","Month 3","Month 4","Month 5","Month 6"].map(month => {
                    const key = month.replace(" ","_").toLowerCase();
                    const photos = progressPhotos[key] || [];
                    return (
                      <div key={month} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, padding:"14px", marginBottom:10}}>
                        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10}}>
                          <div style={{fontSize:13, fontWeight:700, color:t.accentText, fontFamily:"Montserrat,sans-serif", letterSpacing:1}}>{month.toUpperCase()}</div>
                          <label style={{padding:"6px 12px", background:t.accentMuted, border:"1px solid " + t.accentBorder, borderRadius:8, color:t.accentText, fontSize:11, fontWeight:600, cursor:"pointer"}}>
                            {uploadingPhoto ? "Uploading..." : "+ Add Photo"}
                            <input type="file" accept="image/*" style={{display:"none"}} onChange={e => { if(e.target.files[0]) uploadProgressPhoto(e.target.files[0], key); }} />
                          </label>
                        </div>
                        {photos.length > 0 ? (
                          <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6}}>
                            {photos.map((url, i) => (
                              <div key={i} style={{aspectRatio:"1", borderRadius:8, overflow:"hidden", background:t.toggleBg}}>
                                <img src={url} style={{width:"100%", height:"100%", objectFit:"cover"}} alt={"progress " + i} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{textAlign:"center", padding:"20px", color:t.textMuted, fontSize:12}}>No photos yet — add your first photo!</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SETTINGS TAB */}
              {profileTab==="settings" && (
                <div style={{display:"flex", flexDirection:"column", gap:10}}>
                  {/* Change password */}
                  <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, padding:"14px"}}>
                    <div style={{fontSize:12, fontWeight:700, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:12}}>Change Password</div>
                    <input type="password" placeholder="New password" id="newpw"
                      style={{width:"100%", padding:"12px", background:t.input, border:"1px solid " + t.inputBorder, borderRadius:10, color:t.text, fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:8}} />
                    <button onClick={async () => {
                      const pw = document.getElementById("newpw").value;
                      if (!pw || pw.length < 6) return;
                      const { error } = await supabase.auth.updateUser({ password: pw });
                      if (!error) { alert("Password updated!"); document.getElementById("newpw").value = ""; }
                      else alert("Error: " + error.message);
                    }} style={{width:"100%", padding:"11px", background:t.accent, border:"none", borderRadius:10, color:"#000", fontSize:13, fontWeight:700, cursor:"pointer"}}>Update Password</button>
                  </div>

                  {/* Language */}
                  <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, padding:"14px"}}>
                    <div style={{fontSize:12, fontWeight:700, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:12}}>Language</div>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                      {["English","Español","Français","Português"].map(lang => (
                        <button key={lang} onClick={() => setProfileData(p => ({...p, language:lang}))} style={{padding:"10px", background:profileData.language===lang?t.accent:t.card, border:"1px solid " + (profileData.language===lang?t.accentSolid:t.cardBorder), borderRadius:10, color:profileData.language===lang?"#000":t.text, fontSize:13, fontWeight:profileData.language===lang?700:400, cursor:"pointer"}}>{lang}</button>
                      ))}
                    </div>
                  </div>

                  {/* Notifications placeholder */}
                  <div style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, padding:"14px"}}>
                    <div style={{fontSize:12, fontWeight:700, color:t.accentText, letterSpacing:1, textTransform:"uppercase", fontFamily:"Montserrat,sans-serif", marginBottom:12}}>Notifications</div>
                    {[["Daily workout reminder","Remind me to train every day"],["Missed day alert","Alert me when I skip a day"],["Weekly summary","Get weekly progress summary"]].map(([label, desc]) => (
                      <div key={label} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid " + t.cardBorder}}>
                        <div>
                          <div style={{fontSize:13, color:t.text, fontWeight:500}}>{label}</div>
                          <div style={{fontSize:11, color:t.textMuted}}>{desc}</div>
                        </div>
                        <div style={{width:44, height:24, borderRadius:12, background:t.accentMuted, border:"1px solid " + t.accentBorder, position:"relative", cursor:"pointer"}}>
                          <div style={{position:"absolute", right:2, top:2, width:20, height:20, borderRadius:"50%", background:t.accentText}} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Logout */}
                  <button onClick={() => { handleLogout(); setShowProfile(false); }} style={{width:"100%", padding:"14px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:14, color:"#f87171", fontSize:14, fontWeight:700, cursor:"pointer", marginTop:8}}>Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {showAuth && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", backdropFilter:"blur(16px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:600}} onClick={() => setShowAuth(false)}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480, background:t.modal, borderRadius:"24px 24px 0 0", padding:"28px 24px 48px", border:"1px solid " + t.cardBorder, borderBottom:"none"}}>
            <div style={{width:36, height:4, background:t.handle, borderRadius:2, margin:"0 auto 24px"}} />

            {/* Logo */}
            <div style={{textAlign:"center", marginBottom:24}}>
              <div style={{fontSize:22, fontWeight:900, letterSpacing:3, color:t.text, fontFamily:"Montserrat,sans-serif", textTransform:"uppercase"}}>FITSTUD</div>
              <div style={{fontSize:9, letterSpacing:3, color:t.accentText, fontFamily:"Montserrat,sans-serif", fontWeight:600, marginTop:3}}>FORGE YOUR LEGACY</div>
            </div>

            {/* Tab toggle */}
            <div style={{display:"flex", gap:0, marginBottom:24, background:t.toggleBg, borderRadius:12, padding:4}}>
              {["login","signup"].map(m => (
                <button key={m} onClick={() => { setAuthMode(m); setAuthError(""); }} style={{flex:1, padding:"10px", borderRadius:9, border:"none", cursor:"pointer", background:authMode===m?t.accent:"transparent", color:authMode===m?"#fff":t.textMuted, fontSize:14, fontWeight:700, fontFamily:"Montserrat,sans-serif", textTransform:"uppercase", letterSpacing:1}}>
                  {m === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Form */}
            <div style={{display:"flex", flexDirection:"column", gap:12}}>
              <input type="email" placeholder="Email address" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                style={{...{width:"100%", padding:"14px", background:t.input, border:"1.5px solid " + t.inputBorder, borderRadius:12, color:t.text, fontSize:15, outline:"none", boxSizing:"border-box", fontFamily:"Poppins,sans-serif"}}} />
              <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                style={{...{width:"100%", padding:"14px", background:t.input, border:"1.5px solid " + t.inputBorder, borderRadius:12, color:t.text, fontSize:15, outline:"none", boxSizing:"border-box", fontFamily:"Poppins,sans-serif"}}} />
            </div>

            {authError && <div style={{color:"#f87171", fontSize:12, marginTop:10, textAlign:"center"}}>{authError}</div>}

            <button
              onClick={authMode === "login" ? handleLogin : handleSignUp}
              disabled={!!authSubmitting}
              style={{width:"100%", padding:"16px", marginTop:20, background:authSubmitting?"rgba(212,175,55,0.3)":t.accent, border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:800, cursor:authSubmitting?"not-allowed":"pointer", fontFamily:"Montserrat,sans-serif", letterSpacing:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8}}
            >
              {authSubmitting ? <><span style={{display:"inline-block", width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite"}} /> {authMode === "login" ? "Logging in..." : "Creating account..."}</> : authMode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
            </button>

            <div style={{textAlign:"center", marginTop:16, fontSize:12, color:t.textMuted}}>
              {authMode === "login" ? "Do not have an account? " : "Already have an account? "}
              <span onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} style={{color:t.accentText, cursor:"pointer", fontWeight:600}}>
                {authMode === "login" ? "Sign up free" : "Login"}
              </span>
            </div>

            <div style={{textAlign:"center", marginTop:12, fontSize:11, color:t.textDim}}>
              Your data is encrypted and saved securely in the cloud
            </div>
          </div>
        </div>
      )}

      {/* CONGRATS POPUP */}
      {showCongrats && (() => {
        const q = getQuote();
        return (
          <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(16px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600, padding:"24px"}}
            onClick={() => setShowCongrats(false)}>
            <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:380, background:"linear-gradient(135deg,#13151f,#1e1b4b)", border:"1px solid rgba(99,102,241,0.4)", borderRadius:28, padding:"36px 28px", textAlign:"center", position:"relative", overflow:"hidden"}}>
              
              {/* Glow effect */}
              <div style={{position:"absolute", top:-40, left:"50%", transform:"translateX(-50%)", width:200, height:200, background:"radial-gradient(circle,rgba(99,102,241,0.3) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none"}} />
              
              {/* Emoji */}
              <div style={{fontSize:64, marginBottom:16, lineHeight:1}}>{q.emoji}</div>
              
              {/* Title */}
              <div style={{fontSize:26, fontWeight:900, color:"#f8fafc", marginBottom:8, letterSpacing:1, fontFamily:"Montserrat,sans-serif", textTransform:"uppercase"}}>
                Workout Complete!
              </div>
              <div style={{fontSize:13, color:"#6366f1", fontWeight:600, letterSpacing:2, textTransform:"uppercase", marginBottom:24}}>
                {FULL_DAYS[DAYS.indexOf(selectedDay)]}
              </div>

              {/* Motivational quote */}
              <div style={{background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:16, padding:"16px 20px", marginBottom:28}}>
                <div style={{fontSize:15, color:"#e2e8f0", lineHeight:1.6, fontStyle:"italic"}}>
                  "{q.msg}"
                </div>
              </div>

              {/* Buttons */}
              <div style={{display:"flex", flexDirection:"column", gap:10}}>
                <button onClick={() => {setShowCongrats(false); setShowStats(true);}} style={{width:"100%", padding:"14px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:14, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer"}}>
                  📊 View My Stats
                </button>
                <button onClick={() => setShowCongrats(false)} style={{width:"100%", padding:"14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, color:"#94a3b8", fontSize:15, fontWeight:600, cursor:"pointer"}}>
                  Done
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* STATS MODAL */}
      {showStats && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(10px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200}} onClick={() => setShowStats(false)}>
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480, background:t.modal, borderRadius:"24px 24px 0 0", padding:"24px 20px 44px", border:"1px solid " + t.cardBorder, borderBottom:"none", maxHeight:"85vh", overflowY:"auto"}}>
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
              <div key={idx} style={{background:t.card, border:"1px solid " + t.cardBorder, borderRadius:14, padding:"12px 14px", marginBottom:10}}>
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
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480, background:t.modal, borderRadius:"24px 24px 0 0", padding:"24px 20px 40px", border:"1px solid " + t.cardBorder, borderBottom:"none"}}>
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
          <div onClick={e => e.stopPropagation()} style={{width:"100%", maxWidth:480, background:t.modal, borderRadius:"24px 24px 0 0", padding:"24px 20px 44px", border:"1px solid " + t.cardBorder, borderBottom:"none", maxHeight:"90vh", overflowY:"auto"}}>
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
                    <div key={day} style={{display:"flex", gap:10, alignItems:"flex-start", padding:"8px 0", borderBottom:"1px solid " + t.cardBorder}}>
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
