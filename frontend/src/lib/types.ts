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
    id: number
    name: string
    video_url: string
  }
  
  export interface RoutineExercise {
    day_of_week: number
    order:      number
    exercise:   Pick<Exercise, 'name' | 'video_url'>  // solo enviamos nombre y url al crear
    reps_range: string
  }
  
  export interface Routine {
    week_number: number
    id:      number
    name:    string
    client:  number
    items:   RoutineExercise[]
  }