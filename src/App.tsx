import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Dumbbell,
  Calendar,
  BarChart3,
  Info,
  RefreshCw,
  Check,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Moon,
  Flame,
  Award,
  TrendingUp,
  Copy,
  CheckCircle2,
  X,
  ChevronRight,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Sparkles,
  FileText,
  Layers
} from 'lucide-react';

// ============================================================================
// 1. EXERCISE DATABASE & TAILORED GYM ALTERNATIVES
// ============================================================================
// Tailored specifically to the user's gym equipment:
// Technogym Dual Adjustable Pulleys, Dumbbells, Adjustable/Flat Benches,
// Stability Balls, Roman Chair, Rowing Machine, and Treadmill.

const EXERCISE_LIBRARY = {
  // --- DAY 1: UPPER BODY A (CHEST & BACK FOCUS) ---
  flat_db_bench: {
    id: 'flat_db_bench',
    name: 'Flat Dumbbell Bench Press',
    equipment: 'Dumbbells & Flat Bench',
    muscles: 'Pectorals, Anterior Deltoids, Triceps',
    tempo: '3-1-1-0 (3s lower, 1s pause)',
    wristTip: 'Use a semi-neutral (45-degree) grip to reduce shoulder and wrist strain while maximizing chest stretch.',
    instructions: [
      'Sit on the flat bench with dumbbells resting on your thighs. Kick them up one by one as you lie back.',
      'Plant feet firmly on the floor, retract shoulder blades into the pad, and maintain a slight natural arch.',
      'Lower the dumbbells with elbows tucked at ~45° until handles reach outer chest level.',
      'Drive the weights back up smoothly without clanking them together at the top.'
    ],
    alternatives: ['cable_chest_press', 'incline_db_press', 'weighted_pushups']
  },
  cable_chest_press: {
    id: 'cable_chest_press',
    name: 'Standing Dual-Pulley Chest Press',
    equipment: 'Technogym Dual Pulleys',
    muscles: 'Pectorals, Core Stabilizers, Triceps',
    tempo: '2-1-1-1',
    wristTip: 'Use rubberized D-handles and keep wrists stacked directly behind knuckles.',
    instructions: [
      'Set both Technogym pulleys to chest height and attach single D-handles.',
      'Step forward into a staggered stance for stability, keeping core braced.',
      'Press handles forward and slightly inward until arms are extended.',
      'Control the return until hands align with your chest.'
    ],
    alternatives: ['flat_db_bench', 'incline_db_press', 'weighted_pushups']
  },
  weighted_pushups: {
    id: 'weighted_pushups',
    name: 'Deficit / Tempo Push-Ups',
    equipment: 'Dumbbells (as handles) or Floor',
    muscles: 'Pectorals, Triceps, Anterior Core',
    tempo: '3-1-1-0',
    wristTip: 'Grip hex dumbbells on the floor to keep wrists in a completely neutral, pain-free alignment.',
    instructions: [
      'Place two sturdy dumbbells shoulder-width apart on the floor and grip the handles.',
      'Assume a rigid high-plank position with glutes and abs engaged.',
      'Lower your chest between the dumbbells for a deeper stretch.',
      'Push explosively back to full lockout.'
    ],
    alternatives: ['flat_db_bench', 'cable_chest_press', 'incline_db_press']
  },

  cable_row: {
    id: 'cable_row',
    name: 'Dual-Pulley Seated / Kneeling Row',
    equipment: 'Technogym Dual Pulleys & Bench',
    muscles: 'Mid-Back (Rhomboids, Traps), Lats, Biceps',
    tempo: '2-1-1-1 (1s squeeze)',
    wristTip: 'Use neutral-grip handles or rope attachment to keep wrists straight throughout the pull.',
    instructions: [
      'Set both pulleys to mid-torso height. Sit on the end of a bench or kneel tall facing the machine.',
      'Grab both handles with palms facing each other (neutral grip).',
      'Pull elbows straight back past your ribs, squeezing shoulder blades together.',
      'Extend arms forward with control, letting shoulder blades protract slightly.'
    ],
    alternatives: ['single_arm_db_row', 'chest_supported_db_row', 'stability_ball_db_row']
  },
  chest_supported_db_row: {
    id: 'chest_supported_db_row',
    name: 'Chest-Supported Incline DB Row',
    equipment: 'Dumbbells & Adjustable Bench',
    muscles: 'Upper Back, Lats, Rear Delts',
    tempo: '2-1-1-1',
    wristTip: 'Neutral palms-facing grip eliminates forearm torque.',
    instructions: [
      'Set the adjustable bench to a 30–45° incline.',
      'Lie chest-down on the bench with dumbbells hanging straight below shoulders.',
      'Drive elbows toward your hips while squeezing upper back muscles.',
      'Lower slowly to full arm extension.'
    ],
    alternatives: ['cable_row', 'single_arm_db_row', 'stability_ball_db_row']
  },
  stability_ball_db_row: {
    id: 'stability_ball_db_row',
    name: 'Stability Ball Chest-Supported Row',
    equipment: 'Dumbbells & Stability Ball',
    muscles: 'Upper Back, Lats, Core Stabilizers',
    tempo: '2-1-1-1',
    wristTip: 'Neutral grip; focus on smooth control rather than momentum.',
    instructions: [
      'Rest your upper abdomen and chest firmly on a large stability ball with toes planted wide.',
      'Hold dumbbells beneath you with palms facing each other.',
      'Row the weights up toward your ribcage while keeping torso steady on the ball.',
      'Lower with control.'
    ],
    alternatives: ['cable_row', 'chest_supported_db_row', 'single_arm_db_row']
  },

  incline_db_press: {
    id: 'incline_db_press',
    name: 'Incline Dumbbell Press (30°)',
    equipment: 'Dumbbells & Adjustable Bench',
    muscles: 'Upper Chest (Clavicular Head), Front Delts, Triceps',
    tempo: '3-0-1-0',
    wristTip: 'Keep knuckles pointed toward the ceiling—avoid letting wrists bend backward.',
    instructions: [
      'Set the adjustable bench to a low incline (around 30 degrees, 1–2 notches up).',
      'Press dumbbells upward over your upper chest.',
      'Lower under control until upper arms are slightly below parallel to the floor.',
      'Press back to starting position.'
    ],
    alternatives: ['decline_db_press', 'low_to_high_cable_fly', 'flat_db_bench']
  },
  decline_db_press: {
    id: 'decline_db_press',
    name: 'Decline Bench Dumbbell Press',
    equipment: 'Dumbbells & Decline/Adjustable Bench',
    muscles: 'Lower & Mid Pectorals, Triceps',
    tempo: '2-1-1-0',
    wristTip: 'Semi-neutral grip keeps shoulders packed and wrists comfortable.',
    instructions: [
      'Secure legs on the decline bench and lie back holding dumbbells.',
      'Press dumbbells straight up over your lower chest.',
      'Lower slowly until elbows reach 90 degrees, then press back up.'
    ],
    alternatives: ['incline_db_press', 'low_to_high_cable_fly', 'flat_db_bench']
  },
  low_to_high_cable_fly: {
    id: 'low_to_high_cable_fly',
    name: 'Low-to-High Cable Fly',
    equipment: 'Technogym Dual Pulleys',
    muscles: 'Upper Chest, Anterior Delts',
    tempo: '2-1-1-1',
    wristTip: 'Maintain a soft elbow bend and keep wrists neutral throughout the arc.',
    instructions: [
      'Set both pulleys to the lowest setting with D-handles.',
      'Step forward slightly and bring handles upward and together in a wide hugging arc to chin height.',
      'Squeeze upper chest hard for 1 second, then lower slowly.'
    ],
    alternatives: ['incline_db_press', 'decline_db_press', 'flat_db_bench']
  },

  dual_pulley_lat_pulldown: {
    id: 'dual_pulley_lat_pulldown',
    name: 'Kneeling Dual-Pulley Lat Pulldown',
    equipment: 'Technogym Dual Pulleys',
    muscles: 'Latissimus Dorsi, Teres Major, Biceps',
    tempo: '2-1-1-1',
    wristTip: 'Using independent dual handles lets your wrists rotate naturally from pronated to neutral.',
    instructions: [
      'Set both pulleys to the highest setting with single handles.',
      'Kneel tall on a mat/floor centered between the columns.',
      'Pull handles down toward your upper chest while driving elbows down and in.',
      'Control the ascent until arms are fully overhead.'
    ],
    alternatives: ['straight_arm_pulldown', 'cable_pullover', 'single_arm_db_row']
  },
  straight_arm_pulldown: {
    id: 'straight_arm_pulldown',
    name: 'Straight-Arm Rope Pulldown',
    equipment: 'Technogym High Pulley & Rope',
    muscles: 'Latissimus Dorsi, Serratus, Long Head Triceps',
    tempo: '2-1-1-1',
    wristTip: 'Hold the rubber rope ends with thumbs up (neutral grip) to eliminate wrist flexion.',
    instructions: [
      'Attach the rope to a high pulley and step back with a slight hip hinge.',
      'Keeping arms nearly straight (soft elbow bend), sweep the rope down to your thighs.',
      'Pause and squeeze lats at the bottom, then return slowly to eye level.'
    ],
    alternatives: ['dual_pulley_lat_pulldown', 'cable_pullover', 'db_pullover']
  },

  cable_bicep_curls: {
    id: 'cable_bicep_curls',
    name: 'Rope / Dual-Handle Cable Curls',
    equipment: 'Technogym Low Pulley',
    muscles: 'Biceps Brachii, Brachialis',
    tempo: '2-1-1-1',
    wristTip: 'Using the rope attachment keeps wrists in a neutral hammer position, protecting tendons.',
    instructions: [
      'Set pulley to the lowest setting with the rope or dual handles.',
      'Pin elbows at your sides and curl handles up toward your shoulders.',
      'Squeeze biceps at the top without swinging your torso, then lower for 2 full seconds.'
    ],
    alternatives: ['incline_hammer_curls', 'db_alternating_curls']
  },
  db_alternating_curls: {
    id: 'db_alternating_curls',
    name: 'Standing Dumbbell Supinating Curls',
    equipment: 'Dumbbells',
    muscles: 'Biceps Brachii, Forearms',
    tempo: '2-1-1-0',
    wristTip: 'Start in a neutral grip at the bottom and rotate smoothly as you lift.',
    instructions: [
      'Stand tall holding dumbbells at your sides with palms facing in.',
      'Curl one dumbbell up while rotating palm upward.',
      'Lower under control and repeat on the opposite arm.'
    ],
    alternatives: ['cable_bicep_curls', 'incline_hammer_curls']
  },

  cable_tricep_pushdown: {
    id: 'cable_tricep_pushdown',
    name: 'Cable Rope Tricep Pushdowns',
    equipment: 'Technogym High Pulley & Rope',
    muscles: 'Triceps Brachii (Lateral & Medial Heads)',
    tempo: '2-1-1-1',
    wristTip: 'Rope attachment allows natural outward wrist flare at lockout without joint compression.',
    instructions: [
      'Set pulley to top position with rope attachment.',
      'Tuck elbows tightly to your ribs and hinge slightly forward.',
      'Extend forearms downward, splitting the rope ends apart at full lockout.',
      'Return slowly until forearms are parallel to the floor.'
    ],
    alternatives: ['overhead_cable_tricep', 'db_skullcrushers']
  },
  db_skullcrushers: {
    id: 'db_skullcrushers',
    name: 'Flat Bench Neutral-Grip DB Extensions',
    equipment: 'Dumbbells & Flat Bench',
    muscles: 'Triceps Brachii',
    tempo: '3-1-1-0',
    wristTip: 'Palms face each other throughout the entire movement for maximum wrist comfort.',
    instructions: [
      'Lie flat on the bench holding dumbbells straight above your shoulders, palms facing inward.',
      'Keeping upper arms stationary, bend elbows to lower dumbbells beside your ears.',
      'Extend elbows back to lockout.'
    ],
    alternatives: ['cable_tricep_pushdown', 'overhead_cable_tricep']
  },

  // --- DAY 2: LOWER BODY & CORE ---
  db_goblet_squat: {
    id: 'db_goblet_squat',
    name: 'Heavy Dumbbell Goblet Squat',
    equipment: 'Heavy Dumbbell',
    muscles: 'Quadriceps, Glutes, Core',
    tempo: '3-1-1-0',
    wristTip: 'Cup the top hex head of the dumbbell under your palms like a goblet—zero wrist extension.',
    instructions: [
      'Hold one heavy dumbbell vertically against your upper chest, elbows tucked down.',
      'Set feet slightly wider than shoulder-width with toes turned out 15–20°.',
      'Sit hips down between your knees until thighs are at least parallel to the floor.',
      'Drive through mid-foot to stand tall.'
    ],
    alternatives: ['db_front_squat', 'bulgarian_split_squat', 'db_lunges']
  },
  db_front_squat: {
    id: 'db_front_squat',
    name: 'Dual Dumbbell Front Squat',
    equipment: 'Pair of Dumbbells',
    muscles: 'Quadriceps, Glutes, Upper Back',
    tempo: '3-1-1-0',
    wristTip: 'Rest one head of each dumbbell on your front deltoids with palms facing each other.',
    instructions: [
      'Clean two dumbbells up to shoulder height, resting them lightly on your front delts.',
      'Keep chest proud and core braced.',
      'Squat down with control, keeping knees tracking over toes, and stand back up.'
    ],
    alternatives: ['db_goblet_squat', 'bulgarian_split_squat', 'db_lunges']
  },

  db_rdl: {
    id: 'db_rdl',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    equipment: 'Pair of Dumbbells',
    muscles: 'Hamstrings, Glutes, Spinal Erectors',
    tempo: '3-1-1-0',
    wristTip: 'Keep dumbbells close to thighs with neutral/semi-neutral grip.',
    instructions: [
      'Stand with feet hip-width apart, knees softly unlocked, holding dumbbells in front of thighs.',
      'Push your hips straight backward while keeping your spine completely neutral.',
      'Lower dumbbells to mid-shin until you feel a deep hamstring stretch.',
      'Drive hips forward to return to standing.'
    ],
    alternatives: ['roman_chair_back_ext', 'stability_ball_ham_curl']
  },

  bulgarian_split_squat: {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squats',
    equipment: 'Dumbbells & Flat Bench',
    muscles: 'Quadriceps, Glutes, Adductors',
    tempo: '2-1-1-0',
    wristTip: 'Hold dumbbells hanging straight at your sides with relaxed, neutral wrists.',
    instructions: [
      'Stand ~2 feet in front of a flat bench and place the top of your back foot on the pad.',
      'Lower your back knee straight down toward the floor while keeping front shin mostly vertical.',
      'Push powerfully through your front heel to rise.'
    ],
    alternatives: ['db_lunges', 'db_goblet_squat']
  },

  stability_ball_ham_curl: {
    id: 'stability_ball_ham_curl',
    name: 'Stability Ball Hamstring Curls',
    equipment: 'Stability Ball',
    muscles: 'Hamstrings, Glutes, Deep Core',
    tempo: '2-1-1-1',
    wristTip: 'Hands rest flat on the floor for balance—no wrist loading.',
    instructions: [
      'Lie on your back with heels elevated on top of the stability ball.',
      'Bridge your hips up into a straight line from shoulders to heels.',
      'Curl the ball toward your glutes by bending your knees while keeping hips lifted.',
      'Extend legs slowly back out.'
    ],
    alternatives: ['db_rdl', 'roman_chair_back_ext']
  },

  cable_crunches: {
    id: 'cable_crunches',
    name: 'High-Position Kneeling Cable Crunches',
    equipment: 'Technogym High Pulley & Rope',
    muscles: 'Rectus Abdominis (Upper & Lower Abs)',
    tempo: '2-1-1-1',
    wristTip: 'Hold rope handles beside your temples/forehead with neutral wrists.',
    instructions: [
      'Set pulley to highest setting with the rope attachment and kneel facing the stack.',
      'Hold the rope ends beside your head and lock your hips stationary.',
      'Curl your ribcage down toward your pelvis, exhaling forcefully at the bottom.',
      'Slowly uncurl back up without letting your hips sit back.'
    ],
    alternatives: ['decline_bench_crunches', 'stability_ball_crunches']
  },
  decline_bench_crunches: {
    id: 'decline_bench_crunches',
    name: 'Decline Bench Crunches',
    equipment: 'Decline / Adjustable Bench',
    muscles: 'Rectus Abdominis',
    tempo: '2-1-1-1',
    wristTip: 'Cross arms over chest or hold a light dumbbell plate snugly against sternum.',
    instructions: [
      'Hook ankles securely under the roller pads of the decline bench.',
      'Lower torso partway down, keeping tension on the abs.',
      'Curl shoulders and upper back up toward knees, squeezing abs for 1 second.'
    ],
    alternatives: ['cable_crunches', 'stability_ball_crunches']
  },
  stability_ball_crunches: {
    id: 'stability_ball_crunches',
    name: 'Stability Ball Weighted Crunches',
    equipment: 'Stability Ball & Optional Dumbbell',
    muscles: 'Rectus Abdominis',
    tempo: '2-1-1-1',
    wristTip: 'Keep hands lightly behind ears or hold a dumbbell across chest.',
    instructions: [
      'Lie with lower/mid-back supported over the curve of the stability ball, feet planted.',
      'Extend slightly over the ball for a full abdominal stretch.',
      'Crunch ribcage upward, lifting shoulder blades off the ball.'
    ],
    alternatives: ['cable_crunches', 'decline_bench_crunches']
  },

  stability_ball_russian_twists: {
    id: 'stability_ball_russian_twists',
    name: 'Stability Ball / Decline Russian Twists',
    equipment: 'Stability Ball or Bench & Dumbbell',
    muscles: 'Internal & External Obliques, Transverse Abdominis',
    tempo: '1-0-1-0 (Controlled)',
    wristTip: 'Cup both ends of a light dumbbell horizontally.',
    instructions: [
      'Sit on the stability ball (or decline bench) and lean back at a 45° angle with flat spine.',
      'Rotate your ribcage smoothly from left to right, keeping hips steady.',
      'Follow the movement with your eyes and shoulders, not just your arms.'
    ],
    alternatives: ['cable_woodchoppers', 'db_side_bends']
  },

  // --- DAY 3: PUSH (SHOULDERS, CHEST, TRICEPS) ---
  seated_db_ohp: {
    id: 'seated_db_ohp',
    name: 'Seated Dumbbell Overhead Press',
    equipment: 'Dumbbells & Adjustable Bench',
    muscles: 'Anterior & Lateral Deltoids, Triceps',
    tempo: '2-1-1-0',
    wristTip: 'Use a neutral or 45-degree angle grip to give shoulder joints extra clearance and keep wrists stacked.',
    instructions: [
      'Set the adjustable bench to a near-vertical angle (75–80°).',
      'Start with dumbbells at ear level, elbows slightly forward of your torso.',
      'Press weights overhead until arms are extended without shrugging traps.',
      'Lower under control to ear level.'
    ],
    alternatives: ['standing_single_arm_press', 'incline_db_press']
  },
  standing_single_arm_press: {
    id: 'standing_single_arm_press',
    name: 'Standing Single-Arm Neutral DB Press',
    equipment: 'Single Dumbbell',
    muscles: 'Deltoids, Triceps, Anti-Lateral Core',
    tempo: '2-1-1-0',
    wristTip: 'Full neutral palm-in grip is maximally friendly on wrists and shoulders.',
    instructions: [
      'Stand tall holding one dumbbell at shoulder height with palm facing inward.',
      'Brace glutes and abs to prevent leaning sideways.',
      'Press straight overhead, lower slowly, and complete all reps before switching sides.'
    ],
    alternatives: ['seated_db_ohp', 'incline_db_press']
  },

  pushups_or_decline: {
    id: 'pushups_or_decline',
    name: 'Decline DB Press / Weighted Push-Ups',
    equipment: 'Dumbbells & Bench',
    muscles: 'Pectorals, Front Delts, Triceps',
    tempo: '3-1-1-0',
    wristTip: 'Grip dumbbell handles on floor for push-ups or use neutral grip on decline bench.',
    instructions: [
      'Set bench to decline (or set up on dumbbell handles on floor).',
      'Lower chest with a 3-second negative to full stretch.',
      'Press smoothly back up while keeping core tight.'
    ],
    alternatives: ['flat_db_bench', 'cable_chest_press']
  },

  cable_lateral_raises: {
    id: 'cable_lateral_raises',
    name: 'Single-Arm Cable Lateral Raises',
    equipment: 'Technogym Low Pulley',
    muscles: 'Lateral (Side) Deltoids',
    tempo: '2-1-1-1',
    wristTip: 'Keep wrist flat and lead the lift with your elbow and pinky side slightly.',
    instructions: [
      'Set one pulley to the lowest notch with a D-handle.',
      'Stand sideways to the machine, holding the handle with your outside hand.',
      'Raise arm out to the side up to shoulder height with a slight elbow bend.',
      'Lower slowly against constant cable tension.'
    ],
    alternatives: ['db_lateral_raises']
  },
  db_lateral_raises: {
    id: 'db_lateral_raises',
    name: 'Seated Dumbbell Lateral Raises',
    equipment: 'Dumbbells & Bench',
    muscles: 'Lateral Deltoids',
    tempo: '2-1-1-1',
    wristTip: 'Keep thumbs slightly higher than or level with pinkies to avoid shoulder impingement.',
    instructions: [
      'Sit upright on the edge of a bench with dumbbells at your sides.',
      'Raise arms outward to shoulder height without swinging torso.',
      'Pause briefly at the top and lower over 2–3 seconds.'
    ],
    alternatives: ['cable_lateral_raises']
  },

  overhead_cable_tricep: {
    id: 'overhead_cable_tricep',
    name: 'Overhead Cable Rope Tricep Extensions',
    equipment: 'Technogym Pulley & Rope',
    muscles: 'Triceps Brachii (Long Head Emphasis)',
    tempo: '2-1-1-0',
    wristTip: 'Neutral hammer grip on the rope completely relieves wrist strain.',
    instructions: [
      'Set pulley to hip/mid height with rope attachment and face away in a staggered stance.',
      'Bring rope overhead with elbows pointed up and forward.',
      'Extend elbows fully forward/upward, squeezing triceps hard.',
      'Allow forearms to drop behind head for a deep stretch.'
    ],
    alternatives: ['cable_tricep_pushdown', 'db_skullcrushers']
  },

  cable_woodchoppers: {
    id: 'cable_woodchoppers',
    name: 'Cable Rotations / Woodchoppers',
    equipment: 'Technogym Mid Pulley',
    muscles: 'Obliques, Transverse Abdominis, Serratus',
    tempo: '2-1-1-1',
    wristTip: 'Interlock fingers over a single handle or hold rope ends with straight wrists.',
    instructions: [
      'Set pulley to sternum height and stand perpendicular to the column.',
      'Grab the handle with both hands, arms extended.',
      'Rotate torso powerfully across your body while pivoting back foot slightly.',
      'Control the return back toward the weight stack.'
    ],
    alternatives: ['stability_ball_russian_twists', 'db_side_bends']
  },

  // --- DAY 4: PULL (BACK, REAR DELTS, BICEPS) ---
  neutral_pulldown: {
    id: 'neutral_pulldown',
    name: 'Neutral-Grip Dual-Pulley Pulldowns',
    equipment: 'Technogym High Pulleys',
    muscles: 'Lats, Lower Traps, Brachialis',
    tempo: '2-1-1-1',
    wristTip: 'Palms face each other throughout the pull—ideal for wrist and elbow longevity.',
    instructions: [
      'Set both high pulleys with D-handles and kneel or sit centered beneath them.',
      'Pull handles down toward your collarbones with palms facing inward.',
      'Drive elbows down into your sides and hold the contraction for 1 second.'
    ],
    alternatives: ['dual_pulley_lat_pulldown', 'cable_pullover']
  },

  cable_face_pulls: {
    id: 'cable_face_pulls',
    name: 'High-Pulley Rope Face Pulls',
    equipment: 'Technogym High Pulley & Rope',
    muscles: 'Rear Deltoids, Rotator Cuff, Mid-Traps',
    tempo: '2-1-1-1',
    wristTip: 'Hold rope with thumbs pointing backward toward you for healthy external shoulder rotation.',
    instructions: [
      'Set pulley to upper-chest/face height with the rope attachment.',
      'Pull the center of the rope toward your forehead while pulling the ends apart.',
      'Finish in a "double-bicep" pose with hands beside your ears, squeezing rear delts.'
    ],
    alternatives: ['rear_delt_db_fly']
  },
  rear_delt_db_fly: {
    id: 'rear_delt_db_fly',
    name: 'Chest-Supported Rear Delt DB Fly',
    equipment: 'Dumbbells & Incline Bench',
    muscles: 'Posterior Deltoids, Rhomboids',
    tempo: '2-1-1-1',
    wristTip: 'Neutral palms-facing grip keeps wrists aligned.',
    instructions: [
      'Lie chest-down on a 30° incline bench holding light dumbbells.',
      'Sweep arms out wide to the sides with a soft elbow bend until parallel to floor.',
      'Lower slowly without letting weights touch at the bottom.'
    ],
    alternatives: ['cable_face_pulls']
  },

  single_arm_db_row: {
    id: 'single_arm_db_row',
    name: 'Single-Arm Bench-Supported DB Row',
    equipment: 'Heavy Dumbbell & Flat Bench',
    muscles: 'Lats, Rhomboids, Rear Delts, Core',
    tempo: '2-1-1-1',
    wristTip: 'Place your support hand as a fist or grip the edge of the bench if flat-palm support bothers your wrist.',
    instructions: [
      'Place one knee and same-side hand/fist on the flat bench; plant opposite foot wide.',
      'Let the heavy dumbbell hang straight down with a neutral palm-in grip.',
      'Pull the dumbbell back toward your hip pocket (not straight up to shoulder).',
      'Lower slowly to full lat stretch.'
    ],
    alternatives: ['cable_row', 'chest_supported_db_row']
  },

  incline_hammer_curls: {
    id: 'incline_hammer_curls',
    name: 'Incline Dumbbell Hammer Curls',
    equipment: 'Dumbbells & Adjustable Bench',
    muscles: 'Brachialis, Biceps Long Head, Brachioradialis',
    tempo: '2-1-1-0',
    wristTip: 'Hammer (neutral) grip is the gold standard for zero wrist strain while building arm thickness.',
    instructions: [
      'Set adjustable bench to 60° and sit back with arms hanging straight down, palms facing in.',
      'Curl dumbbells up while keeping elbows pinned behind your torso.',
      'Lower smoothly to full arm extension.'
    ],
    alternatives: ['cable_bicep_curls', 'db_alternating_curls']
  },

  roman_chair_back_ext: {
    id: 'roman_chair_back_ext',
    name: 'Roman Chair Back Extensions',
    equipment: 'Roman Chair (45° Hyperextension)',
    muscles: 'Spinal Erectors, Glutes, Hamstrings',
    tempo: '2-1-1-1',
    wristTip: 'Cross arms across chest or hold a dumbbell snugly against sternum.',
    instructions: [
      'Adjust thigh pad so your hip crease sits just above the top edge.',
      'Hinge forward at the hips with a flat back until torso is angled downward.',
      'Squeeze glutes and lower back to raise torso until body forms a straight line (avoid hyperextending).'
    ],
    alternatives: ['db_rdl', 'stability_ball_ham_curl']
  },

  // --- DAY 5: FULL BODY POWER & CORE ---
  db_floor_press: {
    id: 'db_floor_press',
    name: 'Dumbbell Floor Press (or Flat Bench)',
    equipment: 'Dumbbells & Mat/Bench',
    muscles: 'Pectorals, Triceps, Front Delts',
    tempo: '2-1-1-0',
    wristTip: 'Floor stops elbows at 90°, protecting anterior shoulders while neutral grip protects wrists.',
    instructions: [
      'Lie flat on the floor with knees bent, holding dumbbells above chest.',
      'Lower upper arms until triceps gently touch the floor; pause 1 second to kill momentum.',
      'Press powerfully back up.'
    ],
    alternatives: ['flat_db_bench', 'cable_chest_press']
  },

  db_lunges: {
    id: 'db_lunges',
    name: 'Dumbbell Reverse / Walking Lunges',
    equipment: 'Pair of Dumbbells',
    muscles: 'Quadriceps, Glutes, Hamstrings, Calves',
    tempo: '2-0-1-0',
    wristTip: 'Dumbbells hang naturally at sides with neutral wrists.',
    instructions: [
      'Stand tall holding dumbbells at your sides.',
      'Step backward (or forward) into a deep lunge until both knees form ~90° angles.',
      'Drive through the front foot to return to standing.'
    ],
    alternatives: ['bulgarian_split_squat', 'db_goblet_squat']
  },

  cable_pullover: {
    id: 'cable_pullover',
    name: 'Kneeling / Standing Cable Pullovers',
    equipment: 'Technogym High Pulley & Rope/Bar',
    muscles: 'Latissimus Dorsi, Serratus Anterior, Core',
    tempo: '3-1-1-1',
    wristTip: 'Use rope attachment with neutral grip to eliminate wrist tension.',
    instructions: [
      'Set pulley high, step back, and hinge torso slightly forward.',
      'Keep elbows softly locked and sweep arms down in an arc to your hips.',
      'Control the upward stretch until biceps align beside your ears.'
    ],
    alternatives: ['straight_arm_pulldown', 'db_pullover']
  },
  db_pullover: {
    id: 'db_pullover',
    name: 'Flat Bench Dumbbell Pullover',
    equipment: 'Single Dumbbell & Flat Bench',
    muscles: 'Lats, Pectorals, Serratus',
    tempo: '3-1-1-0',
    wristTip: 'Cup the inner plate of one dumbbell with both hands.',
    instructions: [
      'Lie across or along a flat bench holding one dumbbell over your chest.',
      'With a slight bend in elbows, lower the dumbbell backward over your head until you feel a deep lat stretch.',
      'Pull back over your chest.'
    ],
    alternatives: ['cable_pullover', 'straight_arm_pulldown']
  },

  db_side_bends: {
    id: 'db_side_bends',
    name: 'Single-Arm Dumbbell Side Bends',
    equipment: 'Single Heavy Dumbbell',
    muscles: 'Obliques, Quadratus Lumborum',
    tempo: '2-1-1-0',
    wristTip: 'Natural suitcase carry grip—completely neutral wrist.',
    instructions: [
      'Stand tall holding one heavy dumbbell at your side like a suitcase.',
      'Slide the dumbbell straight down your outer thigh by bending strictly sideways (no twisting).',
      'Pull back upright using your opposite oblique.'
    ],
    alternatives: ['cable_woodchoppers', 'stability_ball_russian_twists']
  },

  finisher_circuit: {
    id: 'finisher_circuit',
    name: 'Metabolic Core & Leg Finisher (2 Rounds)',
    equipment: 'Bodyweight & High Pulley Rope',
    muscles: 'Full Core, Quads, Cardiovascular Conditioning',
    tempo: 'Continuous Flow (No Rest Between Moves)',
    wristTip: 'Perform planks on forearms/elbows rather than hands to give wrists complete rest.',
    instructions: [
      '1. Forearm Plank Hold: 45 seconds (brace abs & glutes tightly).',
      '2. High-Pulley Cable Crunches: 15 controlled reps.',
      '3. Bodyweight Air Squats: 20 brisk reps.',
      'Rest 45 seconds after completing all three, then repeat for Round 2.'
    ],
    alternatives: []
  }
};

// ============================================================================
// 2. 5-DAY WORKOUT SCHEDULE STRUCTURE
// ============================================================================
const WEEKLY_SCHEDULE = [
  {
    dayId: 'day1',
    shortLabel: 'Mon',
    dayLabel: 'Day 1',
    title: 'Upper Body A',
    subtitle: 'Chest & Back Focus',
    duration: '40–45 min',
    isRest: false,
    focusNote: 'Antagonistic supersets (A1/A2) pair chest pressing with back rowing to maximize blood flow and halve rest time.',
    groups: [
      {
        code: 'Superset A',
        restSeconds: 60,
        items: [
          { slotId: 'd1_a1', tag: 'A1', defaultExerciseId: 'flat_db_bench', sets: 4, repRange: '8–10 reps' },
          { slotId: 'd1_a2', tag: 'A2', defaultExerciseId: 'cable_row', sets: 4, repRange: '8–10 reps' }
        ]
      },
      {
        code: 'Superset B',
        restSeconds: 60,
        items: [
          { slotId: 'd1_b1', tag: 'B1', defaultExerciseId: 'incline_db_press', sets: 3, repRange: '10–12 reps' },
          { slotId: 'd1_b2', tag: 'B2', defaultExerciseId: 'dual_pulley_lat_pulldown', sets: 3, repRange: '10–12 reps' }
        ]
      },
      {
        code: 'Superset C',
        restSeconds: 45,
        items: [
          { slotId: 'd1_c1', tag: 'C1', defaultExerciseId: 'cable_bicep_curls', sets: 3, repRange: '12–15 reps' },
          { slotId: 'd1_c2', tag: 'C2', defaultExerciseId: 'cable_tricep_pushdown', sets: 3, repRange: '12–15 reps' }
        ]
      }
    ]
  },
  {
    dayId: 'day2',
    shortLabel: 'Tue',
    dayLabel: 'Day 2',
    title: 'Lower Body & Core',
    subtitle: 'Quads, Posterior Chain & Abs',
    duration: '40–45 min',
    isRest: false,
    focusNote: 'Heavy quad-dominant squats paired with hip-hinge hamstrings, finishing with weighted cable and stability ball core work.',
    groups: [
      {
        code: 'Superset A',
        restSeconds: 60,
        items: [
          { slotId: 'd2_a1', tag: 'A1', defaultExerciseId: 'db_goblet_squat', sets: 4, repRange: '8–10 reps' },
          { slotId: 'd2_a2', tag: 'A2', defaultExerciseId: 'db_rdl', sets: 4, repRange: '10–12 reps' }
        ]
      },
      {
        code: 'Superset B',
        restSeconds: 60,
        items: [
          { slotId: 'd2_b1', tag: 'B1', defaultExerciseId: 'bulgarian_split_squat', sets: 3, repRange: '10 / leg' },
          { slotId: 'd2_b2', tag: 'B2', defaultExerciseId: 'stability_ball_ham_curl', sets: 3, repRange: '12–15 reps' }
        ]
      },
      {
        code: 'Superset C',
        restSeconds: 45,
        items: [
          { slotId: 'd2_c1', tag: 'C1', defaultExerciseId: 'cable_crunches', sets: 3, repRange: '15 reps' },
          { slotId: 'd2_c2', tag: 'C2', defaultExerciseId: 'stability_ball_russian_twists', sets: 3, repRange: '20 total' }
        ]
      }
    ]
  },
  {
    dayId: 'rest1',
    shortLabel: 'Wed',
    dayLabel: 'Rest',
    title: 'Active Recovery',
    subtitle: 'Mid-Week Growth & Mobility',
    duration: '15–20 min (Optional)',
    isRest: true,
    focusNote: 'Muscle fibers repair and grow during recovery. Keep protein high and hit 8,000+ steps or light treadmill incline walking.',
    recoveryTips: [
      { title: 'Caloric Surplus Check', detail: 'Maintain +300 to +500 kcal above maintenance with 1.6–2.2g protein per kg of bodyweight.' },
      { title: 'Optional 15-Min Flush', detail: 'Light incline treadmill walk or gentle rowing machine pace (Zone 2) to clear soreness.' },
      { title: 'Thoracic & Hip Mobility', detail: 'Spend 5 minutes doing stability ball thoracic extensions and hip flexor stretches.' }
    ]
  },
  {
    dayId: 'day3',
    shortLabel: 'Thu',
    dayLabel: 'Day 3',
    title: 'Push Focus',
    subtitle: 'Shoulders, Chest & Triceps',
    duration: '35–40 min',
    isRest: false,
    focusNote: 'Vertical overhead pressing paired with horizontal push volume, isolated side delts, and rotational core stability.',
    groups: [
      {
        code: 'Superset A',
        restSeconds: 60,
        items: [
          { slotId: 'd3_a1', tag: 'A1', defaultExerciseId: 'seated_db_ohp', sets: 4, repRange: '8–10 reps' },
          { slotId: 'd3_a2', tag: 'A2', defaultExerciseId: 'pushups_or_decline', sets: 4, repRange: '10–12 reps' }
        ]
      },
      {
        code: 'Superset B',
        restSeconds: 45,
        items: [
          { slotId: 'd3_b1', tag: 'B1', defaultExerciseId: 'cable_lateral_raises', sets: 3, repRange: '12–15 reps' },
          { slotId: 'd3_b2', tag: 'B2', defaultExerciseId: 'overhead_cable_tricep', sets: 3, repRange: '12–15 reps' }
        ]
      },
      {
        code: 'Core Finisher',
        restSeconds: 45,
        items: [
          { slotId: 'd3_f1', tag: 'FIN', defaultExerciseId: 'cable_woodchoppers', sets: 3, repRange: '10 / side' }
        ]
      }
    ]
  },
  {
    dayId: 'day4',
    shortLabel: 'Fri',
    dayLabel: 'Day 4',
    title: 'Pull Focus',
    subtitle: 'Back Width, Rear Delts & Biceps',
    duration: '35–40 min',
    isRest: false,
    focusNote: 'Vertical pulling paired with rear-delt health work, heavy unilateral rows, and neutral-grip arm thickness.',
    groups: [
      {
        code: 'Superset A',
        restSeconds: 60,
        items: [
          { slotId: 'd4_a1', tag: 'A1', defaultExerciseId: 'neutral_pulldown', sets: 4, repRange: '8–10 reps' },
          { slotId: 'd4_a2', tag: 'A2', defaultExerciseId: 'cable_face_pulls', sets: 4, repRange: '12–15 reps' }
        ]
      },
      {
        code: 'Superset B',
        restSeconds: 60,
        items: [
          { slotId: 'd4_b1', tag: 'B1', defaultExerciseId: 'single_arm_db_row', sets: 3, repRange: '10 / arm' },
          { slotId: 'd4_b2', tag: 'B2', defaultExerciseId: 'incline_hammer_curls', sets: 3, repRange: '12–15 reps' }
        ]
      },
      {
        code: 'Posterior Finisher',
        restSeconds: 45,
        items: [
          { slotId: 'd4_f1', tag: 'FIN', defaultExerciseId: 'roman_chair_back_ext', sets: 3, repRange: '12 reps' }
        ]
      }
    ]
  },
  {
    dayId: 'day5',
    shortLabel: 'Sat',
    dayLabel: 'Day 5',
    title: 'Full Body & Core',
    subtitle: 'Hypertrophy Density & Finisher',
    duration: '35–45 min',
    isRest: false,
    focusNote: 'High-frequency second stimulus for chest, legs, and lats, capped off with a metabolic core & squat circuit.',
    groups: [
      {
        code: 'Superset A',
        restSeconds: 60,
        items: [
          { slotId: 'd5_a1', tag: 'A1', defaultExerciseId: 'db_floor_press', sets: 3, repRange: '10 reps' },
          { slotId: 'd5_a2', tag: 'A2', defaultExerciseId: 'db_lunges', sets: 3, repRange: '10 / leg' }
        ]
      },
      {
        code: 'Superset B',
        restSeconds: 45,
        items: [
          { slotId: 'd5_b1', tag: 'B1', defaultExerciseId: 'cable_pullover', sets: 3, repRange: '12–15 reps' },
          { slotId: 'd5_b2', tag: 'B2', defaultExerciseId: 'db_side_bends', sets: 3, repRange: '12 / side' }
        ]
      },
      {
        code: 'Metabolic Circuit',
        restSeconds: 45,
        items: [
          { slotId: 'd5_f1', tag: 'CIR', defaultExerciseId: 'finisher_circuit', sets: 2, repRange: '45s + 15 + 20' }
        ]
      }
    ]
  },
  {
    dayId: 'rest2',
    shortLabel: 'Sun',
    dayLabel: 'Rest',
    title: 'Full Rest & Review',
    subtitle: 'Weekly Reflection & Prep',
    duration: 'Rest Day',
    isRest: true,
    focusNote: 'Review your Weekly Report in the Analytics tab, identify lifts ready for progressive overload next week, and sleep 7.5–9 hours.',
    recoveryTips: [
      { title: 'Progressive Overload Audit', detail: 'Check which exercises hit the top of your rep range across all sets—bump weight up by 1–2.5 kg next week.' },
      { title: 'Hydration & Electrolytes', detail: 'Replenish glycogen and fluids ahead of Monday’s Upper Body A session.' },
      { title: 'Deep Sleep Priority', detail: 'Growth hormone peaks during deep slow-wave sleep; aim for 8 hours tonight.' }
    ]
  }
];

// ============================================================================
// 3. DEMO DATA GENERATOR (PAST 2 WEEKS + CURRENT WEEK PROGRESS)
// ============================================================================
const getDateString = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const getWeekKey = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
};

const generateInitialDemoLogs = () => {
  // Generates realistic progression across Week -2, Week -1, and current week
  const demoEntries = [
    // --- TWO WEEKS AGO (14 to 9 days ago) ---
    { date: getDateString(13), dayId: 'day1', slotId: 'd1_a1', exerciseId: 'flat_db_bench', sets: [{ weight: 20, reps: 9, done: true }, { weight: 20, reps: 9, done: true }, { weight: 20, reps: 8, done: true }, { weight: 20, reps: 8, done: true }] },
    { date: getDateString(13), dayId: 'day1', slotId: 'd1_a2', exerciseId: 'cable_row', sets: [{ weight: 35, reps: 10, done: true }, { weight: 35, reps: 10, done: true }, { weight: 35, reps: 9, done: true }, { weight: 35, reps: 9, done: true }] },
    { date: getDateString(13), dayId: 'day1', slotId: 'd1_b1', exerciseId: 'incline_db_press', sets: [{ weight: 16, reps: 10, done: true }, { weight: 16, reps: 10, done: true }, { weight: 16, reps: 10, done: true }] },
    { date: getDateString(13), dayId: 'day1', slotId: 'd1_b2', exerciseId: 'dual_pulley_lat_pulldown', sets: [{ weight: 30, reps: 11, done: true }, { weight: 30, reps: 10, done: true }, { weight: 30, reps: 10, done: true }] },
    { date: getDateString(13), dayId: 'day1', slotId: 'd1_c1', exerciseId: 'cable_bicep_curls', sets: [{ weight: 15, reps: 12, done: true }, { weight: 15, reps: 12, done: true }, { weight: 15, reps: 12, done: true }] },
    { date: getDateString(13), dayId: 'day1', slotId: 'd1_c2', exerciseId: 'cable_tricep_pushdown', sets: [{ weight: 17.5, reps: 13, done: true }, { weight: 17.5, reps: 12, done: true }, { weight: 17.5, reps: 12, done: true }] },

    { date: getDateString(12), dayId: 'day2', slotId: 'd2_a1', exerciseId: 'db_goblet_squat', sets: [{ weight: 24, reps: 9, done: true }, { weight: 24, reps: 9, done: true }, { weight: 24, reps: 8, done: true }, { weight: 24, reps: 8, done: true }] },
    { date: getDateString(12), dayId: 'day2', slotId: 'd2_a2', exerciseId: 'db_rdl', sets: [{ weight: 20, reps: 10, done: true }, { weight: 20, reps: 10, done: true }, { weight: 20, reps: 10, done: true }, { weight: 20, reps: 10, done: true }] },
    { date: getDateString(12), dayId: 'day2', slotId: 'd2_c1', exerciseId: 'cable_crunches', sets: [{ weight: 25, reps: 15, done: true }, { weight: 25, reps: 15, done: true }, { weight: 25, reps: 14, done: true }] },

    { date: getDateString(10), dayId: 'day3', slotId: 'd3_a1', exerciseId: 'seated_db_ohp', sets: [{ weight: 14, reps: 9, done: true }, { weight: 14, reps: 8, done: true }, { weight: 14, reps: 8, done: true }, { weight: 14, reps: 8, done: true }] },
    { date: getDateString(10), dayId: 'day3', slotId: 'd3_b1', exerciseId: 'cable_lateral_raises', sets: [{ weight: 5, reps: 14, done: true }, { weight: 5, reps: 13, done: true }, { weight: 5, reps: 12, done: true }] },

    { date: getDateString(9), dayId: 'day4', slotId: 'd4_a1', exerciseId: 'neutral_pulldown', sets: [{ weight: 35, reps: 9, done: true }, { weight: 35, reps: 9, done: true }, { weight: 35, reps: 8, done: true }, { weight: 35, reps: 8, done: true }] },
    { date: getDateString(9), dayId: 'day4', slotId: 'd4_b1', exerciseId: 'single_arm_db_row', sets: [{ weight: 22, reps: 10, done: true }, { weight: 22, reps: 10, done: true }, { weight: 22, reps: 10, done: true }] },

    // --- LAST WEEK (7 to 2 days ago) ---
    { date: getDateString(6), dayId: 'day1', slotId: 'd1_a1', exerciseId: 'flat_db_bench', sets: [{ weight: 22, reps: 9, done: true }, { weight: 22, reps: 9, done: true }, { weight: 22, reps: 8, done: true }, { weight: 22, reps: 8, done: true }] },
    { date: getDateString(6), dayId: 'day1', slotId: 'd1_a2', exerciseId: 'cable_row', sets: [{ weight: 37.5, reps: 10, done: true }, { weight: 37.5, reps: 10, done: true }, { weight: 37.5, reps: 9, done: true }, { weight: 37.5, reps: 9, done: true }] },
    { date: getDateString(6), dayId: 'day1', slotId: 'd1_b1', exerciseId: 'incline_db_press', sets: [{ weight: 18, reps: 10, done: true }, { weight: 18, reps: 10, done: true }, { weight: 18, reps: 9, done: true }] },
    { date: getDateString(6), dayId: 'day1', slotId: 'd1_b2', exerciseId: 'dual_pulley_lat_pulldown', sets: [{ weight: 32.5, reps: 11, done: true }, { weight: 32.5, reps: 11, done: true }, { weight: 32.5, reps: 10, done: true }] },
    { date: getDateString(6), dayId: 'day1', slotId: 'd1_c1', exerciseId: 'cable_bicep_curls', sets: [{ weight: 17.5, reps: 12, done: true }, { weight: 17.5, reps: 12, done: true }, { weight: 17.5, reps: 11, done: true }] },
    { date: getDateString(6), dayId: 'day1', slotId: 'd1_c2', exerciseId: 'cable_tricep_pushdown', sets: [{ weight: 20, reps: 13, done: true }, { weight: 20, reps: 12, done: true }, { weight: 20, reps: 12, done: true }] },

    { date: getDateString(5), dayId: 'day2', slotId: 'd2_a1', exerciseId: 'db_goblet_squat', sets: [{ weight: 26, reps: 10, done: true }, { weight: 26, reps: 9, done: true }, { weight: 26, reps: 9, done: true }, { weight: 26, reps: 8, done: true }] },
    { date: getDateString(5), dayId: 'day2', slotId: 'd2_a2', exerciseId: 'db_rdl', sets: [{ weight: 22, reps: 11, done: true }, { weight: 22, reps: 10, done: true }, { weight: 22, reps: 10, done: true }, { weight: 22, reps: 10, done: true }] },
    { date: getDateString(5), dayId: 'day2', slotId: 'd2_b1', exerciseId: 'bulgarian_split_squat', sets: [{ weight: 12, reps: 10, done: true }, { weight: 12, reps: 10, done: true }, { weight: 12, reps: 10, done: true }] },
    { date: getDateString(5), dayId: 'day2', slotId: 'd2_c1', exerciseId: 'cable_crunches', sets: [{ weight: 27.5, reps: 15, done: true }, { weight: 27.5, reps: 15, done: true }, { weight: 27.5, reps: 15, done: true }] },

    { date: getDateString(3), dayId: 'day3', slotId: 'd3_a1', exerciseId: 'seated_db_ohp', sets: [{ weight: 16, reps: 9, done: true }, { weight: 16, reps: 8, done: true }, { weight: 16, reps: 8, done: true }, { weight: 16, reps: 8, done: true }] },
    { date: getDateString(3), dayId: 'day3', slotId: 'd3_a2', exerciseId: 'pushups_or_decline', sets: [{ weight: 16, reps: 11, done: true }, { weight: 16, reps: 10, done: true }, { weight: 16, reps: 10, done: true }, { weight: 16, reps: 10, done: true }] },
    { date: getDateString(3), dayId: 'day3', slotId: 'd3_b1', exerciseId: 'cable_lateral_raises', sets: [{ weight: 7.5, reps: 13, done: true }, { weight: 7.5, reps: 12, done: true }, { weight: 7.5, reps: 12, done: true }] },

    { date: getDateString(2), dayId: 'day4', slotId: 'd4_a1', exerciseId: 'neutral_pulldown', sets: [{ weight: 37.5, reps: 10, done: true }, { weight: 37.5, reps: 9, done: true }, { weight: 37.5, reps: 9, done: true }, { weight: 37.5, reps: 8, done: true }] },
    { date: getDateString(2), dayId: 'day4', slotId: 'd4_b1', exerciseId: 'single_arm_db_row', sets: [{ weight: 24, reps: 10, done: true }, { weight: 24, reps: 10, done: true }, { weight: 24, reps: 10, done: true }] },
    { date: getDateString(2), dayId: 'day4', slotId: 'd4_b2', exerciseId: 'incline_hammer_curls', sets: [{ weight: 12, reps: 13, done: true }, { weight: 12, reps: 12, done: true }, { weight: 12, reps: 12, done: true }] },

    { date: getDateString(1), dayId: 'day5', slotId: 'd5_a1', exerciseId: 'db_floor_press', sets: [{ weight: 20, reps: 10, done: true }, { weight: 20, reps: 10, done: true }, { weight: 20, reps: 10, done: true }] },
    { date: getDateString(1), dayId: 'day5', slotId: 'd5_a2', exerciseId: 'db_lunges', sets: [{ weight: 14, reps: 10, done: true }, { weight: 14, reps: 10, done: true }, { weight: 14, reps: 10, done: true }] },
    { date: getDateString(1), dayId: 'day5', slotId: 'd5_b1', exerciseId: 'cable_pullover', sets: [{ weight: 22.5, reps: 14, done: true }, { weight: 22.5, reps: 13, done: true }, { weight: 22.5, reps: 12, done: true }] }
  ];

  const logMap = {};
  demoEntries.forEach((entry) => {
    const key = `${entry.date}_${entry.slotId}`;
    logMap[key] = entry;
  });
  return logMap;
};

// ============================================================================
// 4. WEB AUDIO BEEP FOR REST TIMER
// ============================================================================
const playTimerBeep = () => {
  try {
    const AudioCtx =
      window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      gain.gain.setValueAtTime(0.18, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.36);
    });
  } catch (e) {
    // Audio blocked or unsupported
  }
};

// ============================================================================
// 5. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // --- Theme State (auto-detects system preference, allows manual toggle) ---
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('hd_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('hd_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // --- Unit Preference (kg / lbs) ---
  const [unit, setUnit] = useState(() => localStorage.getItem('hd_unit') || 'kg');
  useEffect(() => {
    localStorage.setItem('hd_unit', unit);
  }, [unit]);

  // --- Active View Tab ('workout' | 'analytics') ---
  const [activeTab, setActiveTab] = useState('workout');

  // --- Selected Day ---
  const [selectedDayId, setSelectedDayId] = useState(() => {
    const dayIdx = new Date().getDay(); // 0=Sun, 1=Mon...
    const map = ['rest2', 'day1', 'day2', 'rest1', 'day3', 'day4', 'day5'];
    return map[dayIdx] || 'day1';
  });

  // --- Selected Training Date (Defaults to today so logs attach cleanly) ---
  const [activeDate, setActiveDate] = useState(() => getDateString(0));

  // --- Custom Exercise Swaps: { [slotId]: exerciseId } ---
  const [customSwaps, setCustomSwaps] = useState(() => {
    try {
      const saved = localStorage.getItem('hd_swaps');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('hd_swaps', JSON.stringify(customSwaps));
  }, [customSwaps]);

  // --- Workout Logs: { [`${date}_${slotId}`]: { date, dayId, slotId, exerciseId, sets: [{ weight, reps, done }] } } ---
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('hd_logs');
      if (saved) return JSON.parse(saved);
      const demo = generateInitialDemoLogs();
      localStorage.setItem('hd_logs', JSON.stringify(demo));
      localStorage.setItem('hd_has_demo', 'true');
      return demo;
    } catch {
      return generateInitialDemoLogs();
    }
  });

  const [hasDemoData, setHasDemoData] = useState(() => localStorage.getItem('hd_has_demo') === 'true');

  useEffect(() => {
    try {
      localStorage.setItem('hd_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save logs', e);
    }
  }, [logs]);

  // --- Modals & Drawers State ---
  const [guideExerciseId, setGuideExerciseId] = useState(null);
  const [swapModalContext, setSwapModalContext] = useState(null); // { slotId, currentExerciseId, defaultExerciseId }
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCopied, setReportCopied] = useState(false);
  const [confirmClearModal, setConfirmClearModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Rest Timer State ---
  const [timerDuration, setTimerDuration] = useState(60);
  const [timerRemaining, setTimerRemaining] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinishedFlash, setTimerFinishedFlash] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          setTimerFinishedFlash(true);
          playTimerBeep();
          setTimeout(() => setTimerFinishedFlash(false), 3500);
          return timerDuration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerDuration]);

  const startRestTimer = (seconds = timerDuration) => {
    setTimerDuration(seconds);
    setTimerRemaining(seconds);
    setTimerFinishedFlash(false);
    setTimerRunning(true);
  };

  // --- Helper: Weight Conversion ---
  const displayWeight = (kgVal) => {
    if (kgVal === '' || kgVal === null || kgVal === undefined) return '';
    const num = Number(kgVal);
    if (isNaN(num)) return '';
    return unit === 'kg' ? num : Math.round(num * 2.20462 * 10) / 10;
  };

  const toStorageKg = (inputVal) => {
    if (inputVal === '' || inputVal === null || inputVal === undefined) return '';
    const num = Number(inputVal);
    if (isNaN(num)) return '';
    return unit === 'kg' ? num : Math.round((num / 2.20462) * 100) / 100;
  };

  // --- Helper: Get Most Recent Historical Performance for an Exercise ---
  const getLastPerformance = (exerciseId, beforeDate) => {
    const entries = Object.values(logs)
      .filter((entry) => entry.exerciseId === exerciseId && entry.date < beforeDate && entry.sets?.some((s) => s.done))
      .sort((a, b) => b.date.localeCompare(a.date));
    return entries[0] || null;
  };

  // --- Helper: Get or Initialize Current Slot Log ---
  const getSlotSets = (dayId, slotId, exerciseId, defaultSetCount) => {
    const key = `${activeDate}_${slotId}`;
    if (logs[key] && logs[key].sets) {
      return logs[key].sets;
    }
    const lastPerf = getLastPerformance(exerciseId, activeDate);
    return Array.from({ length: defaultSetCount }, (_, idx) => {
      const prevSet = lastPerf?.sets?.[idx] || lastPerf?.sets?.[0];
      return {
        weight: prevSet ? prevSet.weight : '',
        reps: prevSet ? prevSet.reps : '',
        done: false
      };
    });
  };

  const updateSetField = (dayId, slotId, exerciseId, defaultSetCount, setIdx, field, rawValue) => {
    const key = `${activeDate}_${slotId}`;
    const currentSets = getSlotSets(dayId, slotId, exerciseId, defaultSetCount);
    const updatedSets = currentSets.map((s, idx) => {
      if (idx !== setIdx) return s;
      if (field === 'weight') {
        return { ...s, weight: rawValue === '' ? '' : toStorageKg(rawValue) };
      }
      if (field === 'reps') {
        return { ...s, reps: rawValue === '' ? '' : Number(rawValue) };
      }
      if (field === 'done') {
        const nextDone = !s.done;
        if (nextDone) {
          // Auto-trigger rest timer when a set is checked off!
          startRestTimer(timerDuration);
        }
        return { ...s, done: nextDone };
      }
      return s;
    });

    setLogs((prev) => ({
      ...prev,
      [key]: {
        date: activeDate,
        dayId,
        slotId,
        exerciseId,
        sets: updatedSets
      }
    }));
  };

  // --- Swap Exercise Handler ---
  const handleSelectSwap = (slotId, newExerciseId, dayId, defaultSetCount) => {
    setCustomSwaps((prev) => ({
      ...prev,
      [slotId]: newExerciseId
    }));

    // Update active date log's exerciseId if present
    const key = `${activeDate}_${slotId}`;
    if (logs[key]) {
      setLogs((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          exerciseId: newExerciseId
        }
      }));
    }

    setSwapModalContext(null);
    showToast(`Switched to ${EXERCISE_LIBRARY[newExerciseId]?.name}`);
  };

  const handleResetSwap = (slotId) => {
    setCustomSwaps((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    setSwapModalContext(null);
    showToast('Restored default plan exercise');
  };

  // --- JSON Export / Import / Clear Demo ---
  const fileInputRef = useRef(null);

  const handleExportJSON = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      unit,
      customSwaps,
      logs
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hypertrophy-tracker-backup-${getDateString(0)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.logs) setLogs(parsed.logs);
        if (parsed.customSwaps) setCustomSwaps(parsed.customSwaps);
        if (parsed.unit) setUnit(parsed.unit);
        setHasDemoData(false);
        localStorage.setItem('hd_has_demo', 'false');
        showToast('Workout history imported successfully!');
      } catch {
        showToast('Invalid JSON backup file');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    setLogs({});
    setHasDemoData(false);
    localStorage.setItem('hd_has_demo', 'false');
    setConfirmClearModal(false);
    showToast('All workout logs cleared');
  };

  const handleRestoreDemoData = () => {
    const demo = generateInitialDemoLogs();
    setLogs(demo);
    setHasDemoData(true);
    localStorage.setItem('hd_has_demo', 'true');
    showToast('2-week sample history restored');
  };

  // ============================================================================
  // 6. ANALYTICS & WEEKLY REPORT COMPUTATIONS
  // ============================================================================
  const [selectedLiftChart, setSelectedLiftChart] = useState('flat_db_bench');

  const analytics = useMemo(() => {
    const allEntries = Object.values(logs);
    const completedEntries = allEntries.filter((e) => e.sets && e.sets.some((s) => s.done));

    // Group by ISO week (Monday-based)
    const weeksMap = {};
    completedEntries.forEach((entry) => {
      const wk = getWeekKey(entry.date);
      if (!weeksMap[wk]) {
        weeksMap[wk] = {
          weekStart: wk,
          datesSet: new Set(),
          dayIdsSet: new Set(),
          totalVolumeKg: 0,
          totalSets: 0,
          totalReps: 0,
          exerciseMaxes: {}
        };
      }
      weeksMap[wk].datesSet.add(entry.date);
      weeksMap[wk].dayIdsSet.add(entry.dayId);

      entry.sets.forEach((s) => {
        if (s.done) {
          const w = Number(s.weight) || 0;
          const r = Number(s.reps) || 0;
          weeksMap[wk].totalSets += 1;
          weeksMap[wk].totalReps += r;
          weeksMap[wk].totalVolumeKg += w * r;

          if (w > 0) {
            const prevMax = weeksMap[wk].exerciseMaxes[entry.exerciseId] || 0;
            if (w > prevMax) weeksMap[wk].exerciseMaxes[entry.exerciseId] = w;
          }
        }
      });
    });

    const sortedWeeks = Object.values(weeksMap).sort((a, b) => a.weekStart.localeCompare(b.weekStart));

    // Identify Current / Most Recent Active Week and Previous Week
    const latestWeek = sortedWeeks[sortedWeeks.length - 1] || {
      weekStart: getWeekKey(getDateString(0)),
      datesSet: new Set(),
      dayIdsSet: new Set(),
      totalVolumeKg: 0,
      totalSets: 0,
      totalReps: 0,
      exerciseMaxes: {}
    };
    const prevWeek = sortedWeeks.length >= 2 ? sortedWeeks[sortedWeeks.length - 2] : null;

    // Volume delta percentage
    let volumeDeltaPct = null;
    if (prevWeek && prevWeek.totalVolumeKg > 0) {
      volumeDeltaPct = Math.round(((latestWeek.totalVolumeKg - prevWeek.totalVolumeKg) / prevWeek.totalVolumeKg) * 100);
    }

    // Personal Records (PRs) in latest week vs all prior weeks
    const prsHit = [];
    Object.entries(latestWeek.exerciseMaxes).forEach(([exId, maxW]) => {
      let priorBest = 0;
      sortedWeeks.slice(0, -1).forEach((w) => {
        if ((w.exerciseMaxes[exId] || 0) > priorBest) {
          priorBest = w.exerciseMaxes[exId];
        }
      });
      if (maxW > priorBest && priorBest > 0) {
        prsHit.push({
          exerciseId: exId,
          name: EXERCISE_LIBRARY[exId]?.name || exId,
          newMaxKg: maxW,
          oldMaxKg: priorBest
        });
      }
    });

    // Lift-specific progression points
    const liftHistoryMap = {};
    completedEntries
      .filter((e) => e.exerciseId === selectedLiftChart)
      .forEach((e) => {
        let bestW = 0;
        let vol = 0;
        e.sets.forEach((s) => {
          if (s.done) {
            const w = Number(s.weight) || 0;
            const r = Number(s.reps) || 0;
            if (w > bestW) bestW = w;
            vol += w * r;
          }
        });
        if (!liftHistoryMap[e.date] || bestW > liftHistoryMap[e.date].maxKg) {
          liftHistoryMap[e.date] = { date: e.date, maxKg: bestW, volumeKg: vol };
        }
      });

    const liftSeries = Object.values(liftHistoryMap).sort((a, b) => a.date.localeCompare(b.date));

    // Total unique workout days logged
    const totalSessions = new Set(completedEntries.map((e) => e.date)).size;

    return {
      sortedWeeks,
      latestWeek,
      prevWeek,
      volumeDeltaPct,
      prsHit,
      liftSeries,
      totalSessions
    };
  }, [logs, selectedLiftChart]);

  // --- Generate Printable / Copyable Weekly Report Text ---
  const formattedReportText = useMemo(() => {
    const { latestWeek, prevWeek, volumeDeltaPct, prsHit } = analytics;
    const workoutsDone = latestWeek.datesSet.size;
    const volDisplay = Math.round(displayWeight(latestWeek.totalVolumeKg)).toLocaleString();
    const deltaStr =
      volumeDeltaPct !== null ? ` (${volumeDeltaPct >= 0 ? '+' : ''}${volumeDeltaPct}% vs. prior week)` : '';

    const prLines =
      prsHit.length > 0
        ? prsHit
            .map(
              (pr) =>
                `  • ${pr.name}: ${displayWeight(pr.newMaxKg)} ${unit} (up from ${displayWeight(pr.oldMaxKg)} ${unit})`
            )
            .join('\n')
        : '  • Steady progression maintained across working sets';

    return [
      `🏋️ 5-DAY HIGH-DENSITY HYPERTROPHY — WEEKLY REPORT`,
      `Week of: ${latestWeek.weekStart}`,
      `--------------------------------------------------`,
      `✅ Sessions Completed: ${Math.min(workoutsDone, 5)} / 5 days`,
      `📦 Total Volume Lifted: ${volDisplay} ${unit}${deltaStr}`,
      `🔥 Working Sets Completed: ${latestWeek.totalSets} sets (${latestWeek.totalReps} total reps)`,
      ``,
      `🏆 STRENGTH HIGHLIGHTS & PRs:`,
      prLines,
      ``,
      `📈 NEXT WEEK OVERLOAD FOCUS:`,
      `  • Add +1 rep or +${unit === 'kg' ? '2 kg' : '5 lbs'} on primary A1/A2 compound supersets.`,
      `  • Keep inter-superset rest strict at 45–60 seconds.`
    ].join('\n');
  }, [analytics, unit]);

  const handleCopyReport = () => {
    navigator.clipboard?.writeText(formattedReportText);
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2500);
  };

  // --- Active Day Object & Completion Stats ---
  const currentDay = WEEKLY_SCHEDULE.find((d) => d.dayId === selectedDayId) || WEEKLY_SCHEDULE[0];

  const dayCompletion = useMemo(() => {
    if (currentDay.isRest) return { done: 0, total: 0, pct: 100 };
    let total = 0;
    let done = 0;
    currentDay.groups.forEach((g) => {
      g.items.forEach((item) => {
        const activeExId = customSwaps[item.slotId] || item.defaultExerciseId;
        const sets = getSlotSets(currentDay.dayId, item.slotId, activeExId, item.sets);
        sets.forEach((s) => {
          total += 1;
          if (s.done) done += 1;
        });
      });
    });
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [currentDay, customSwaps, logs, activeDate]);

  // ============================================================================
  // 7. UI RENDER
  // ============================================================================
  const themeBg = darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardBg = darkMode
    ? 'bg-slate-900/90 border-slate-800 shadow-lg shadow-black/20'
    : 'bg-white border-slate-200/90 shadow-sm';
  const subCardBg = darkMode ? 'bg-slate-800/70 border-slate-700/70' : 'bg-slate-100/80 border-slate-200/80';
  const mutedText = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen transition-colors duration-200 pb-28 ${themeBg}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-medium shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Sticky Header */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
          darkMode ? 'bg-slate-950/85 border-slate-800' : 'bg-white/85 border-slate-200'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight leading-tight">
                Hypertrophy <span className="text-indigo-500">5-Day</span>
              </h1>
              <p className={`text-[11px] font-medium ${mutedText}`}>45-Min High-Density Split</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Unit Toggle (kg / lbs) */}
            <button
              onClick={() => setUnit(unit === 'kg' ? 'lbs' : 'kg')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Weight Unit"
            >
              {unit.toUpperCase()}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-colors ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Primary View Switcher Tabs */}
        <div className="max-w-3xl mx-auto px-4 pb-2.5">
          <div className={`grid grid-cols-2 p-1 rounded-xl border ${subCardBg}`}>
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'workout'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : `${mutedText} hover:text-indigo-500`
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Workout Plan</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : `${mutedText} hover:text-indigo-500`
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Weekly Report & Progress</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* VIEW 1: WORKOUT PLAN & LIVE TRACKER                                  */}
      {/* ==================================================================== */}
      {activeTab === 'workout' && (
        <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
          {/* Day Selector Strip */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {WEEKLY_SCHEDULE.map((day) => {
              const isSelected = day.dayId === selectedDayId;
              return (
                <button
                  key={day.dayId}
                  onClick={() => setSelectedDayId(day.dayId)}
                  className={`flex-1 min-w-[74px] py-2.5 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-0.5 ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                      : `${cardBg} hover:border-indigo-400`
                  }`}
                >
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold ${
                      isSelected ? 'text-indigo-200' : mutedText
                    }`}
                  >
                    {day.shortLabel}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold">{day.dayLabel}</span>
                  <span
                    className={`text-[10px] truncate max-w-[68px] ${
                      isSelected ? 'text-indigo-100' : mutedText
                    }`}
                  >
                    {day.isRest ? 'Recover' : day.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Day Overview Banner */}
          <section className={`rounded-2xl border p-4 sm:p-5 ${cardBg}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-500">
                    {currentDay.dayLabel} • {currentDay.shortLabel}
                  </span>
                  <span className={`text-xs font-medium flex items-center gap-1 ${mutedText}`}>
                    <Clock className="w-3.5 h-3.5" /> {currentDay.duration}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-1">{currentDay.title}</h2>
                <p className={`text-xs sm:text-sm font-medium ${mutedText}`}>{currentDay.subtitle}</p>
              </div>

              {!currentDay.isRest && (
                <div className="flex flex-col items-end gap-1.5">
                  <label className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>
                    Log Session Date
                  </label>
                  <input
                    type="date"
                    value={activeDate}
                    onChange={(e) => setActiveDate(e.target.value)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-100'
                        : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  />
                </div>
              )}
            </div>

            <p
              className={`mt-3 text-xs sm:text-sm leading-relaxed p-3 rounded-xl border ${subCardBg}`}
            >
              {currentDay.focusNote}
            </p>

            {/* Session Progress Bar */}
            {!currentDay.isRest && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className={mutedText}>Session Set Completion</span>
                  <span className="text-indigo-500 font-bold">
                    {dayCompletion.done} / {dayCompletion.total} sets ({dayCompletion.pct}%)
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${dayCompletion.pct}%` }}
                  />
                </div>
              </div>
            )}
          </section>

          {/* REST DAY VIEW */}
          {currentDay.isRest ? (
            <section className="space-y-3">
              {currentDay.recoveryTips.map((tip, idx) => (
                <div key={idx} className={`rounded-2xl border p-4 flex items-start gap-3.5 ${cardBg}`}>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">{tip.title}</h3>
                    <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${mutedText}`}>{tip.detail}</p>
                  </div>
                </div>
              ))}
            </section>
          ) : (
            /* WORKOUT SUPERSET GROUPS */
            <div className="space-y-5">
              {currentDay.groups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2.5">
                  {/* Superset Header */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-indigo-500">
                        {group.code}
                      </h3>
                      <span className={`text-xs ${mutedText}`}>
                        ({group.items.length > 1 ? 'Alternate back-to-back' : 'Straight sets'})
                      </span>
                    </div>
                    <button
                      onClick={() => startRestTimer(group.restSeconds)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 flex items-center gap-1 transition-colors"
                    >
                      <Clock className="w-3 h-3" /> {group.restSeconds}s Rest
                    </button>
                  </div>

                  {/* Superset Cards Container */}
                  <div
                    className={`rounded-2xl border overflow-hidden divide-y ${
                      darkMode ? 'border-slate-800 divide-slate-800' : 'border-slate-200 divide-slate-200'
                    }`}
                  >
                    {group.items.map((item) => {
                      const activeExerciseId = customSwaps[item.slotId] || item.defaultExerciseId;
                      const exercise = EXERCISE_LIBRARY[activeExerciseId] || EXERCISE_LIBRARY[item.defaultExerciseId];
                      const isSwapped = Boolean(customSwaps[item.slotId] && customSwaps[item.slotId] !== item.defaultExerciseId);
                      const sets = getSlotSets(currentDay.dayId, item.slotId, activeExerciseId, item.sets);
                      const lastPerf = getLastPerformance(activeExerciseId, activeDate);

                      return (
                        <div key={item.slotId} className={`p-4 transition-colors ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                          {/* Exercise Card Top Row */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              {/* Superset Tag Badge (A1, A2, etc.) */}
                              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-600 text-white shrink-0 mt-0.5 shadow-sm">
                                {item.tag}
                              </span>
                              <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <h4 className="font-bold text-sm sm:text-base leading-snug">{exercise.name}</h4>
                                  {isSwapped && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500">
                                      Swapped
                                    </span>
                                  )}
                                </div>
                                <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-1 ${mutedText}`}>
                                  <span className="font-semibold text-emerald-500">
                                    {item.sets} sets × {item.repRange}
                                  </span>
                                  <span>•</span>
                                  <span>{exercise.equipment}</span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons: Guide & Swap */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => setGuideExerciseId(activeExerciseId)}
                                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                                  darkMode
                                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-indigo-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-500'
                                }`}
                                title="Form Instructions & Wrist Cues"
                              >
                                <Info className="w-4 h-4 text-indigo-500" />
                                <span className="hidden sm:inline">Guide</span>
                              </button>

                              <button
                                onClick={() =>
                                  setSwapModalContext({
                                    slotId: item.slotId,
                                    currentExerciseId: activeExerciseId,
                                    defaultExerciseId: item.defaultExerciseId
                                  })
                                }
                                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                                  darkMode
                                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-500'
                                }`}
                                title="Swap Exercise (Machine Busy / Broken)"
                              >
                                <RefreshCw className="w-4 h-4 text-amber-500" />
                                <span className="hidden sm:inline">Swap</span>
                              </button>
                            </div>
                          </div>

                          {/* Previous Session Reference Pill */}
                          {lastPerf && (
                            <div className={`mt-2.5 text-[11px] flex items-center gap-1.5 ${mutedText}`}>
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>
                                Last ({lastPerf.date}):{' '}
                                <strong className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                                  {lastPerf.sets
                                    .filter((s) => s.done)
                                    .map((s) => `${displayWeight(s.weight)}${unit}×${s.reps}`)
                                    .join(', ')}
                                </strong>
                              </span>
                            </div>
                          )}

                          {/* Interactive Set Logging Table */}
                          <div className="mt-3 space-y-2">
                            <div className={`grid grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>
                              <div className="col-span-2">Set</div>
                              <div className="col-span-4">Weight ({unit})</div>
                              <div className="col-span-4">Reps</div>
                              <div className="col-span-2 text-right">Done</div>
                            </div>

                            {sets.map((setObj, sIdx) => (
                              <div
                                key={sIdx}
                                className={`grid grid-cols-12 gap-2 items-center p-1.5 rounded-xl border transition-all ${
                                  setObj.done
                                    ? darkMode
                                      ? 'bg-emerald-950/30 border-emerald-800/60'
                                      : 'bg-emerald-50/80 border-emerald-200'
                                    : subCardBg
                                }`}
                              >
                                <div className="col-span-2 pl-1.5 text-xs font-extrabold">
                                  #{sIdx + 1}
                                </div>

                                <div className="col-span-4">
                                  <input
                                    type="number"
                                    inputMode="decimal"
                                    placeholder="0"
                                    value={displayWeight(setObj.weight)}
                                    onChange={(e) =>
                                      updateSetField(
                                        currentDay.dayId,
                                        item.slotId,
                                        activeExerciseId,
                                        item.sets,
                                        sIdx,
                                        'weight',
                                        e.target.value
                                      )
                                    }
                                    className={`w-full px-2.5 py-1.5 rounded-lg text-sm font-bold border outline-none focus:ring-2 focus:ring-indigo-500 ${
                                      darkMode
                                        ? 'bg-slate-900 border-slate-700 text-white'
                                        : 'bg-white border-slate-300 text-slate-900'
                                    }`}
                                  />
                                </div>

                                <div className="col-span-4">
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={setObj.reps}
                                    onChange={(e) =>
                                      updateSetField(
                                        currentDay.dayId,
                                        item.slotId,
                                        activeExerciseId,
                                        item.sets,
                                        sIdx,
                                        'reps',
                                        e.target.value
                                      )
                                    }
                                    className={`w-full px-2.5 py-1.5 rounded-lg text-sm font-bold border outline-none focus:ring-2 focus:ring-indigo-500 ${
                                      darkMode
                                        ? 'bg-slate-900 border-slate-700 text-white'
                                        : 'bg-white border-slate-300 text-slate-900'
                                    }`}
                                  />
                                </div>

                                <div className="col-span-2 flex justify-end pr-1">
                                  <button
                                    onClick={() =>
                                      updateSetField(
                                        currentDay.dayId,
                                        item.slotId,
                                        activeExerciseId,
                                        item.sets,
                                        sIdx,
                                        'done'
                                      )
                                    }
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                      setObj.done
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                                        : darkMode
                                        ? 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-emerald-500'
                                        : 'bg-white border border-slate-300 text-slate-400 hover:border-emerald-500'
                                    }`}
                                    aria-label={`Mark Set ${sIdx + 1} Complete`}
                                  >
                                    <Check className="w-5 h-5 stroke-[2.5]" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ==================================================================== */}
      {/* VIEW 2: WEEKLY REPORT & PROGRESS ANALYTICS                           */}
      {/* ==================================================================== */}
      {activeTab === 'analytics' && (
        <main className="max-w-3xl mx-auto px-4 pt-4 space-y-5">
          {/* Demo Data Banner (if active) */}
          {hasDemoData && (
            <div
              className={`rounded-2xl border p-3.5 flex flex-wrap items-center justify-between gap-3 ${
                darkMode
                  ? 'bg-indigo-950/40 border-indigo-800/70 text-indigo-200'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-900'
              }`}
            >
              <div className="text-xs sm:text-sm">
                <span className="font-bold">Sample 2-Week History Loaded:</span> Explore your charts and weekly report below, or clear demo data to start fresh.
              </div>
              <button
                onClick={() => setConfirmClearModal(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shrink-0"
              >
                Clear Demo Data
              </button>
            </div>
          )}

          {/* Header & Generate Report CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">Weekly Performance</h2>
              <p className={`text-xs ${mutedText}`}>
                Active Week of {analytics.latestWeek.weekStart}
              </p>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Weekly Report</span>
            </button>
          </div>

          {/* 4 KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`rounded-2xl border p-4 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${mutedText}`}>Workouts</span>
                <Calendar className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-2 text-2xl font-black">
                {Math.min(analytics.latestWeek.datesSet.size, 5)}
                <span className={`text-sm font-bold ${mutedText}`}> / 5</span>
              </div>
              <p className="text-[11px] text-emerald-500 font-semibold mt-1">
                {Math.round((Math.min(analytics.latestWeek.datesSet.size, 5) / 5) * 100)}% Adherence
              </p>
            </div>

            <div className={`rounded-2xl border p-4 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${mutedText}`}>Volume Lifted</span>
                <Dumbbell className="w-4 h-4 text-violet-500" />
              </div>
              <div className="mt-2 text-2xl font-black">
                {Math.round(displayWeight(analytics.latestWeek.totalVolumeKg)).toLocaleString()}
                <span className={`text-xs font-bold ml-1 ${mutedText}`}>{unit}</span>
              </div>
              <p
                className={`text-[11px] font-semibold mt-1 ${
                  analytics.volumeDeltaPct === null
                    ? mutedText
                    : analytics.volumeDeltaPct >= 0
                    ? 'text-emerald-500'
                    : 'text-amber-500'
                }`}
              >
                {analytics.volumeDeltaPct !== null
                  ? `${analytics.volumeDeltaPct >= 0 ? '+' : ''}${analytics.volumeDeltaPct}% vs last wk`
                  : 'Baseline week'}
              </p>
            </div>

            <div className={`rounded-2xl border p-4 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${mutedText}`}>Sets Done</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2 text-2xl font-black">{analytics.latestWeek.totalSets}</div>
              <p className={`text-[11px] font-medium mt-1 ${mutedText}`}>
                {analytics.latestWeek.totalReps} total reps
              </p>
            </div>

            <div className={`rounded-2xl border p-4 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${mutedText}`}>Total Sessions</span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-black">{analytics.totalSessions}</div>
              <p className="text-[11px] text-emerald-500 font-semibold mt-1">
                {analytics.prsHit.length} PRs this week
              </p>
            </div>
          </div>

          {/* Weekly Volume Bar Chart (SVG) */}
          <section className={`rounded-2xl border p-4 sm:p-5 ${cardBg}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm sm:text-base">Weekly Volume Progression ({unit})</h3>
                <p className={`text-xs ${mutedText}`}>Total tonnage lifted per training week</p>
              </div>
            </div>

            {analytics.sortedWeeks.length === 0 ? (
              <div className={`py-10 text-center text-xs ${mutedText}`}>
                No completed sets logged yet. Check off sets in the Workout Plan tab to see trends!
              </div>
            ) : (
              <div className="w-full pt-2">
                {(() => {
                  const weeks = analytics.sortedWeeks.slice(-6);
                  const maxVol = Math.max(...weeks.map((w) => displayWeight(w.totalVolumeKg)), 100);
                  return (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 items-end h-44 pt-6 px-2">
                      {weeks.map((wk, idx) => {
                        const val = Math.round(displayWeight(wk.totalVolumeKg));
                        const heightPct = Math.max(Math.round((val / maxVol) * 100), 8);
                        const isLatest = idx === weeks.length - 1;
                        return (
                          <div key={wk.weekStart} className="flex flex-col items-center h-full justify-end gap-1.5">
                            <span className="text-[11px] font-extrabold">{val.toLocaleString()}</span>
                            <div className="w-full max-w-[44px] h-28 flex items-end justify-center rounded-t-xl overflow-hidden bg-slate-500/10">
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full rounded-t-xl transition-all duration-500 ${
                                  isLatest
                                    ? 'bg-gradient-to-t from-indigo-600 to-violet-500'
                                    : 'bg-indigo-400/50'
                                }`}
                              />
                            </div>
                            <span className={`text-[10px] font-semibold ${mutedText}`}>
                              {wk.weekStart.slice(5)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </section>

          {/* Exercise Strength Curve (SVG Line Chart) */}
          <section className={`rounded-2xl border p-4 sm:p-5 ${cardBg}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-bold text-sm sm:text-base">Lift Strength Progression</h3>
                <p className={`text-xs ${mutedText}`}>Top working weight ({unit}) over time</p>
              </div>

              <select
                value={selectedLiftChart}
                onChange={(e) => setSelectedLiftChart(e.target.value)}
                className={`text-xs font-bold px-3 py-2 rounded-xl border outline-none ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="flat_db_bench">Flat Dumbbell Bench Press</option>
                <option value="cable_row">Dual-Pulley Seated Row</option>
                <option value="db_goblet_squat">Heavy Dumbbell Goblet Squat</option>
                <option value="db_rdl">Dumbbell Romanian Deadlift</option>
                <option value="seated_db_ohp">Seated DB Overhead Press</option>
                <option value="neutral_pulldown">Neutral-Grip Pulldown</option>
                <option value="single_arm_db_row">Single-Arm DB Row</option>
                <option value="cable_crunches">High-Position Cable Crunches</option>
              </select>
            </div>

            {analytics.liftSeries.length === 0 ? (
              <div className={`py-8 text-center text-xs ${mutedText}`}>
                No logged sets for {EXERCISE_LIBRARY[selectedLiftChart]?.name} yet.
              </div>
            ) : (
              <div className="w-full">
                {(() => {
                  const series = analytics.liftSeries;
                  const weights = series.map((s) => displayWeight(s.maxKg));
                  const minW = Math.max(0, Math.min(...weights) - 5);
                  const maxW = Math.max(...weights) + 5;
                  const range = Math.max(maxW - minW, 1);

                  const svgW = 500;
                  const svgH = 160;
                  const padX = 36;
                  const padY = 24;

                  const points = series.map((pt, idx) => {
                    const x =
                      series.length === 1
                        ? svgW / 2
                        : padX + (idx / (series.length - 1)) * (svgW - padX * 2);
                    const y =
                      svgH - padY - ((displayWeight(pt.maxKg) - minW) / range) * (svgH - padY * 2);
                    return { x, y, label: pt.date.slice(5), val: displayWeight(pt.maxKg) };
                  });

                  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');

                  return (
                    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-44 overflow-visible">
                      {/* Horizontal Guide Lines */}
                      {[0, 0.5, 1].map((t, i) => {
                        const yPos = padY + t * (svgH - padY * 2);
                        return (
                          <line
                            key={i}
                            x1={padX}
                            x2={svgW - padX}
                            y1={yPos}
                            y2={yPos}
                            stroke={darkMode ? '#1e293b' : '#e2e8f0'}
                            strokeDasharray="4 4"
                          />
                        );
                      })}

                      {/* Trend Line */}
                      {points.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={polylineStr}
                        />
                      )}

                      {/* Data Points */}
                      {points.map((p, idx) => (
                        <g key={idx}>
                          <circle cx={p.x} cy={p.y} r="5.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                          <text
                            x={p.x}
                            y={p.y - 11}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="bold"
                            fill={darkMode ? '#f8fafc' : '#0f172a'}
                          >
                            {p.val}
                            {unit}
                          </text>
                          <text
                            x={p.x}
                            y={svgH - 4}
                            textAnchor="middle"
                            fontSize="10"
                            fill={darkMode ? '#94a3b8' : '#64748b'}
                          >
                            {p.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  );
                })()}
              </div>
            )}
          </section>

          {/* Data Backup & Reset Controls */}
          <section className={`rounded-2xl border p-4 sm:p-5 space-y-3 ${cardBg}`}>
            <h3 className="font-bold text-sm">Data Backup & Management</h3>
            <p className={`text-xs ${mutedText}`}>
              Your workouts and exercise swaps auto-save locally on your device. Export a JSON backup anytime.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleExportJSON}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                Export JSON
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-emerald-500" />
                Import JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />

              {!hasDemoData && (
                <button
                  onClick={handleRestoreDemoData}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    darkMode
                      ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                      : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Load Demo History
                </button>
              )}

              <button
                onClick={() => setConfirmClearModal(true)}
                className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset Logs
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ==================================================================== */}
      {/* FLOATING SUPERSET REST TIMER BAR                                     */}
      {/* ==================================================================== */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl">
        <div
          className={`rounded-2xl border px-3.5 py-2.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-2 transition-all ${
            timerFinishedFlash
              ? 'bg-emerald-600 border-emerald-400 text-white'
              : darkMode
              ? 'bg-slate-900/95 border-slate-700 text-slate-100'
              : 'bg-slate-900/95 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm ${
                timerFinishedFlash
                  ? 'bg-white text-emerald-700'
                  : timerRunning
                  ? 'bg-indigo-600 text-white animate-pulse'
                  : 'bg-slate-800 text-indigo-400'
              }`}
            >
              {timerRemaining}s
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">
                {timerFinishedFlash ? 'Rest Complete — Next Superset!' : 'Superset Rest Timer'}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[45, 60, 90].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => startRestTimer(preset)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      timerDuration === preset
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {preset}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              aria-label={timerRunning ? 'Pause Timer' : 'Start Timer'}
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setTimerRunning(false);
                setTimerRemaining(timerDuration);
                setTimerFinishedFlash(false);
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODAL 1: EXERCISE INSTRUCTIONS & WRIST-FRIENDLY COACHING CUES        */}
      {/* ==================================================================== */}
      {guideExerciseId && EXERCISE_LIBRARY[guideExerciseId] && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setGuideExerciseId(null)}
        >
          <div
            className={`w-full max-w-lg rounded-t-3xl sm:rounded-3xl border p-5 sm:p-6 max-h-[88vh] overflow-y-auto shadow-2xl ${
              darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const ex = EXERCISE_LIBRARY[guideExerciseId];
              return (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-500">
                        {ex.equipment}
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold mt-1.5">{ex.name}</h3>
                      <p className={`text-xs font-medium mt-0.5 ${mutedText}`}>
                        Target: <strong className={darkMode ? 'text-slate-200' : 'text-slate-700'}>{ex.muscles}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => setGuideExerciseId(null)}
                      className={`p-2 rounded-xl ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Tempo Pill */}
                  <div className={`mt-4 p-3 rounded-xl border flex items-center justify-between ${subCardBg}`}>
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-500" /> Recommended Tempo
                    </span>
                    <span className="text-xs font-extrabold text-indigo-500">{ex.tempo}</span>
                  </div>

                  {/* Step-by-step Execution */}
                  <div className="mt-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-500 mb-2.5">
                      Step-by-Step Execution
                    </h4>
                    <ol className="space-y-2.5">
                      {ex.instructions.map((step, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Joint & Wrist-Friendly Alignment Note */}
                  <div
                    className={`mt-5 p-3.5 rounded-2xl border flex items-start gap-3 ${
                      darkMode
                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-500">
                        Joint & Wrist-Friendly Grip Cue
                      </div>
                      <p className="text-xs sm:text-sm mt-1 leading-relaxed">{ex.wristTip}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: DYNAMIC EXERCISE SWAPPER (BUSY / BROKEN MACHINE)            */}
      {/* ==================================================================== */}
      {swapModalContext && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSwapModalContext(null)}
        >
          <div
            className={`w-full max-w-lg rounded-t-3xl sm:rounded-3xl border p-5 sm:p-6 max-h-[88vh] overflow-y-auto shadow-2xl ${
              darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const { slotId, currentExerciseId, defaultExerciseId } = swapModalContext;
              const currentEx = EXERCISE_LIBRARY[currentExerciseId];
              const defaultEx = EXERCISE_LIBRARY[defaultExerciseId];

              // Combine default exercise + alternatives from both current and default
              const candidateIds = Array.from(
                new Set([
                  defaultExerciseId,
                  ...(defaultEx?.alternatives || []),
                  ...(currentEx?.alternatives || [])
                ])
              ).filter((id) => id !== currentExerciseId && EXERCISE_LIBRARY[id]);

              return (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-500">
                        Equipment Busy or Broken?
                      </span>
                      <h3 className="text-lg font-extrabold mt-1">Swap Exercise</h3>
                      <p className={`text-xs mt-0.5 ${mutedText}`}>
                        Currently active: <strong>{currentEx?.name}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => setSwapModalContext(null)}
                      className={`p-2 rounded-xl ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {candidateIds.length === 0 ? (
                      <p className={`text-xs ${mutedText}`}>No alternative variations configured for this circuit.</p>
                    ) : (
                      candidateIds.map((altId) => {
                        const altEx = EXERCISE_LIBRARY[altId];
                        const isOriginal = altId === defaultExerciseId;
                        return (
                          <button
                            key={altId}
                            onClick={() => handleSelectSwap(slotId, altId)}
                            className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              darkMode
                                ? 'bg-slate-800/70 border-slate-700 hover:border-indigo-500'
                                : 'bg-slate-50 border-slate-200 hover:border-indigo-500'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">{altEx.name}</span>
                                {isOriginal && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-500">
                                    Plan Default
                                  </span>
                                )}
                              </div>
                              <div className={`text-xs mt-0.5 ${mutedText}`}>
                                {altEx.equipment} • {altEx.muscles}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" />
                          </button>
                        );
                      })
                    )}
                  </div>

                  {currentExerciseId !== defaultExerciseId && (
                    <button
                      onClick={() => handleResetSwap(slotId)}
                      className="mt-4 w-full py-2.5 rounded-xl border border-indigo-500/40 text-indigo-500 text-xs font-bold hover:bg-indigo-500/10 transition-colors"
                    >
                      Reset to Original Plan ({defaultEx?.name})
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: WEEKLY SUMMARY REPORT EXPORT MODAL                          */}
      {/* ==================================================================== */}
      {showReportModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className={`w-full max-w-lg rounded-3xl border p-5 sm:p-6 shadow-2xl ${
              darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-extrabold">Weekly Training Report</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className={`p-2 rounded-xl ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre
              className={`p-4 rounded-2xl border text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto ${subCardBg}`}
            >
              {formattedReportText}
            </pre>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={handleCopyReport}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {reportCopied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Weekly Summary</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: CUSTOM CONFIRMATION DIALOG (NO WINDOW.CONFIRM)              */}
      {/* ==================================================================== */}
      {confirmClearModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setConfirmClearModal(false)}
        >
          <div
            className={`w-full max-w-sm rounded-3xl border p-5 shadow-2xl ${
              darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-extrabold">Clear All Workout Logs?</h3>
            <p className={`text-xs mt-1.5 leading-relaxed ${mutedText}`}>
              This will remove all logged weights, sets, and demo history so you can start tracking from scratch. Your custom exercise swaps will remain intact.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmClearModal(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllData}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Yes, Clear Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
