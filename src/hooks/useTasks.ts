
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Task, Todo } from '../types'
import { useAuth } from './useAuth'
import { format, startOfMonth, endOfMonth } from 'date-fns'

export const useTasks = (selectedDate: Date) => {
  const { session } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 月の最初の日と最後の日を計算
  const startOfSelectedMonth = format(startOfMonth(selectedDate), 'yyyy-MM-dd')
  const endOfSelectedMonth = format(endOfMonth(selectedDate), 'yyyy-MM-dd')

  useEffect(() => {
    if (!session?.user?.id || !supabase) {
      setLoading(false)
      return
    }

    const fetchTasksAndTodos = async () => {
      setLoading(true)
      setError(null)
      try {
        // ユーザーの全タスクを取得
        const { data: tasksData, error: tasksError } = await supabase! // 非nullアサーション
          .from('tasks')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: true })

        if (tasksError) throw tasksError
        setTasks(tasksData || [])

        // 選択された月の完了状態をすべて取得
        const { data: todosData, error: todosError } = await supabase! // 非nullアサーション
          .from('todos')
          .select('*')
          .eq('user_id', session.user.id)
          .gte('completed_at', startOfSelectedMonth) // 月の最初の日以降
          .lte('completed_at', endOfSelectedMonth)   // 月の最後の日以前

        if (todosError) throw todosError
        setTodos(todosData || [])

      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching tasks or todos:', err)
      } finally {
        setLoading(false)
      }
    }

    // selectedDateの月が変わったときに再フェッチ
    fetchTasksAndTodos()
  }, [session?.user?.id, startOfSelectedMonth, endOfSelectedMonth])

  const addTask = async (task_name: string) => {
    if (!session?.user?.id || !supabase) return
    try {
      const { data, error } = await supabase! // 非nullアサーション
        .from('tasks')
        .insert({ user_id: session.user.id, task_name })
        .select()
      if (error) throw error
      if (data) {
        setTasks((prev) => [...prev, data[0]])
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error adding task:', err)
    }
  }

  const updateTaskName = async (id: string, new_task_name: string) => {
    if (!session?.user?.id || !supabase) return
    try {
      const { error } = await supabase! // 非nullアサーション
        .from('tasks')
        .update({ task_name: new_task_name })
        .eq('id', id)
        .eq('user_id', session.user.id)
      if (error) throw error
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, task_name: new_task_name } : task))
      )
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating task name:', err)
    }
  }

  const deleteTask = async (id: string) => {
    if (!session?.user?.id || !supabase) return
    try {
      const { error } = await supabase! // 非nullアサーション
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id)
      if (error) throw error
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (err: any) {
      setError(err.message)
      console.error('Error deleting task:', err)
    }
  }

  const toggleTodoCompletion = async (taskId: string, isCompleted: boolean) => {
    if (!session?.user?.id || !supabase) return
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd') // 現在選択されている日付を使用
      if (isCompleted) {
        // 完了として記録
        const { data, error } = await supabase! // 非nullアサーション
          .from('todos')
          .insert({ user_id: session.user.id, task_id: taskId, is_completed: true, completed_at: formattedDate })
          .select()
        if (error) throw error
        if (data) {
          setTodos((prev) => [...prev, data[0]])
        }
      } else {
        // 未完了として記録（todosから削除）
        const { error } = await supabase
          .from('todos')
          .delete()
          .eq('task_id', taskId)
          .eq('user_id', session.user.id)
          .eq('completed_at', formattedDate)
        if (error) throw error
        setTodos((prev) => prev.filter((todo) => !(todo.task_id === taskId && todo.completed_at === formattedDate)))
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error toggling todo completion:', err)
    }
  }

  return {
    tasks,
    todos,
    loading,
    error,
    addTask,
    updateTaskName,
    deleteTask,
    toggleTodoCompletion,
  }
}
