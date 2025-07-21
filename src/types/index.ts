
export interface Task {
  id: string;
  user_id: string;
  task_name: string;
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  task_id: string;
  is_completed: boolean;
  completed_at: string; // YYYY-MM-DD 形式を想定
}
