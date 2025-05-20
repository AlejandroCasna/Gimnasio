// frontend/src/lib/types.ts

export interface Profile {
  username:   string
  first_name: string
  last_name:  string
  email:      string
  phone:      string
  weight:     number
  age:        number
  height:     number
  groups:     string[]
}

export interface Client {
  id:         number
  username:   string
  first_name: string
  last_name:  string
  email:      string
  groups:     string[]
}

export interface Exercise {
  id?: number
  name: string
  video_url: string
}

export interface RoutineExercise {
  id?: number
  // ahora incluimos todo el Exercise, no sólo name/video_url
  exercise: Exercise
  day_of_week: number
  reps_range: string
  order: number
}

  
  export interface Routine {
    week_number: number
    id:      number
    name:    string
    client:  number
    items:   RoutineExercise[]
  }

  
  // frontend/src/lib/types.ts

export interface Trainer {
  id: number
  first_name: string
  last_name: string
  // …
}

export interface ChatThread {
  id: number
  client: number
  trainer: number
  trainer_username: string
  client_username:  string
  last_message_preview: string
}

export interface Message {
  timestamp: string | number | Date
  created: string | number | Date
  id: number
  thread: number
  author: number
  author_username: string
  text: string
  created_at: string
}

