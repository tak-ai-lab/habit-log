import { useState, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useTasks } from '../hooks/useTasks'
import { format, addDays, subDays, isToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, getDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { Task } from '../types'
import styled from 'styled-components'
import { LoadingSpinner } from '../components/LoadingSpinner'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    margin: 0;
    font-size: 2em;
    color: #6a0dad; /* 紫系のアクセントカラー */
  }

  button {
    padding: 8px 15px;
    font-size: 0.9em;
    background-color: #f0e6fa; /* 淡い紫 */
    color: #6a0dad;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e0d6f0;
    }
  }
`;

const ViewToggle = styled.div`
  margin-bottom: 20px;

  button {
    margin: 0 5px;
    background-color: #f0e6fa;
    color: #6a0dad;
    border: none;
    border-radius: 5px;
    padding: 8px 15px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e0d6f0;
    }

    &:disabled {
      background-color: #dcdcdc;
      color: #a0a0a0;
      cursor: not-allowed;
    }
  }
`;

const DateNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  button {
    margin: 0 5px;
    background-color: #f0e6fa;
    color: #6a0dad;
    border: none;
    border-radius: 5px;
    padding: 8px 15px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e0d6f0;
    }
  }

  span {
    font-size: 1.2em;
    font-weight: bold;
    color: #6a0dad;
  }
`;

const TaskForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
  }

  button {
    background-color: #6a0dad;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #5a0c9d;
    }
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eee;
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:last-child {
      border-bottom: none;
    }

    input[type="checkbox"] {
      margin-right: 10px;
      transform: scale(1.2);
      accent-color: #6a0dad; /* チェックボックスの色 */
    }

    span {
      flex-grow: 1;
      text-align: left;
      cursor: pointer;
      color: #333;

      &.completed {
        text-decoration: line-through;
        color: #999;
      }
    }

    input[type="text"] {
      flex-grow: 1;
      padding: 5px;
      border: 1px solid #6a0dad;
      border-radius: 3px;
    }

    button {
      margin-left: 10px;
      padding: 5px 10px;
      font-size: 0.8em;
      background-color: #f0e6fa;
      color: #6a0dad;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #e0d6f0;
      }
    }
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h2 {
    margin: 0;
    color: #6a0dad;
  }

  button {
    background-color: #f0e6fa;
    color: #6a0dad;
    border: none;
    border-radius: 5px;
    padding: 8px 15px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e0d6f0;
    }
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(7, 1fr);
    font-size: 0.7em;
  }
`;

const CalendarDayHeader = styled.div`
  font-weight: bold;
  padding: 5px;
  background-color: #f0e6fa;
  border-radius: 5px;
  color: #6a0dad;
`;

const CalendarDay = styled.div<{ isCurrentMonth: boolean; isTodayDay: boolean }>`
  border: 1px solid #eee;
  padding: 5px;
  min-height: 80px;
  background-color: ${props => props.isCurrentMonth ? (props.isTodayDay ? '#ffe0b2' : '#fff') : '#f0f0f0'};
  opacity: ${props => props.isCurrentMonth ? 1 : 0.6};
  text-align: left;
  font-size: 0.8em;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  div {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }

  .completed-task {
    font-size: 0.7em;
    color: #4CAF50; /* 緑色 */
    word-break: break-all; /* 長いタスク名で折り返す */
  }

  @media (max-width: 768px) {
    min-height: 60px;
    padding: 3px;
    font-size: 0.6em;

    .completed-task {
      font-size: 0.6em;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 20px;
  font-weight: bold;
`;

export const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { tasks, todos, loading, error, addTask, updateTaskName, deleteTask, toggleTodoCompletion } = useTasks(selectedDate)
  const [newTaskName, setNewTaskName] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskName, setEditingTaskName] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list') // 'list' or 'calendar'

  const handleLogout = async () => {
    if (!supabase) {
      alert("Supabase is not configured. Cannot log out.");
      return;
    }
    const { error } = await supabase!.auth.signOut() // 非nullアサーション
    if (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskName.trim()) {
      await addTask(newTaskName)
      setNewTaskName('')
    }
  }

  const handleEditTaskName = (taskId: string, currentTaskName: string) => {
    setEditingTaskId(taskId)
    setEditingTaskName(currentTaskName)
  }

  const handleSaveTaskName = async (taskId: string) => {
    if (editingTaskName.trim()) {
      await updateTaskName(taskId, editingTaskName)
      setEditingTaskId(null)
      setEditingTaskName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
    setEditingTaskName('')
  }

  const isTaskCompleted = (taskId: string) => {
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
    return todos.some(todo => todo.task_id === taskId && todo.completed_at === formattedSelectedDate && todo.is_completed)
  }

  const handleToggleCompletion = async (taskId: string) => {
    await toggleTodoCompletion(taskId, !isTaskCompleted(taskId))
  }

  const handlePrevDay = () => {
    setSelectedDate(subDays(selectedDate, 1))
  }

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1))
  }

  const handleToday = () => {
    setSelectedDate(new Date())
  }

  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1))
  }

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1))
  }

  // カレンダー表示用のデータ生成
  const calendarDays = useMemo(() => {
    const start = startOfMonth(selectedDate)
    const end = endOfMonth(selectedDate)
    const daysInMonth = eachDayOfInterval({ start, end })

    // 月の初日の曜日を取得 (0:日, 1:月, ..., 6:土)
    const firstDayOfWeek = getDay(start)

    // 月の初日までの空白セルを生成
    const emptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => `empty-${i}`)

    return [...emptyCells, ...daysInMonth]
  }, [selectedDate])

  // カレンダー表示で、その日に完了したタスクを取得
  const getCompletedTasksForDay = (date: Date): Task[] => {
    const formattedDate = format(date, 'yyyy-MM-dd')
    const completedTaskIds = todos
      .filter(todo => todo.completed_at === formattedDate && todo.is_completed)
      .map(todo => todo.task_id)
    return tasks.filter(task => completedTaskIds.includes(task.id))
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage>Error: {error}</ErrorMessage>

  return (
    <div>
      <Header>
        <h1>Habit Log</h1>
        <button onClick={handleLogout}>ログアウト</button>
      </Header>

      {/* 表示モード切り替えボタン */}
      <ViewToggle>
        <button onClick={() => setViewMode('list')} disabled={viewMode === 'list'}>タスク</button>
        <button onClick={() => setViewMode('calendar')} disabled={viewMode === 'calendar'}>カレンダー</button>
      </ViewToggle>

      {viewMode === 'list' ? (
        <>
          {/* 日付ナビゲーション (一覧表示時のみ) */}
          <DateNavigation>
            <button onClick={handlePrevDay}>&lt;</button>
            <span>{format(selectedDate, 'yyyy年MM月dd日(EEE)', { locale: ja })} {isToday(selectedDate) && '(今日)'}</span>
            <button onClick={handleNextDay}>&gt;</button>
            <button onClick={handleToday}>今日</button>
          </DateNavigation>

          {/* タスクリスト */}
          <TaskList>
            {tasks.map((task) => (
              <li key={task.id}>
                {editingTaskId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTaskName}
                      onChange={(e) => setEditingTaskName(e.target.value)}
                    />
                    <button onClick={() => handleSaveTaskName(task.id)}>保存</button>
                    <button onClick={() => handleCancelEdit()}>キャンセル</button>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={isTaskCompleted(task.id)}
                      onChange={() => handleToggleCompletion(task.id)}
                    />
                    <span className={isTaskCompleted(task.id) ? 'completed' : ''} onDoubleClick={() => handleEditTaskName(task.id, task.task_name)}>
                      {task.task_name}
                    </span>
                    <button onClick={() => deleteTask(task.id)}>削除</button>
                  </>
                )}
              </li>
            ))}
          </TaskList>

          {/* タスク追加フォーム */}
          <TaskForm onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="新しいタスクを追加"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
            <button type="submit">追加</button>
          </TaskForm>
        </>
      ) : (
        // カレンダー表示
        <div>
          <CalendarHeader>
            <button onClick={handlePrevMonth}>&lt;</button>
            <h2>{format(selectedDate, 'yyyy年MM月')}</h2>
            <button onClick={handleNextMonth}>&gt;</button>
          </CalendarHeader>
          <CalendarGrid>
            {'日,月,火,水,木,金,土'.split(',').map(day => (
              <CalendarDayHeader key={day}>{day}</CalendarDayHeader>
            ))}
            {calendarDays.map((day) => {
              if (typeof day === 'string' && day.startsWith('empty')) {
                return <CalendarDay key={day} isCurrentMonth={false} isTodayDay={false} />;
              }
              const completedTasks = getCompletedTasksForDay(day as Date)
              const isCurrentMonth = isSameMonth(day as Date, selectedDate)
              const isTodayDay = isToday(day as Date)
              return (
                <CalendarDay
                  key={format(day as Date, 'yyyy-MM-dd')}
                  isCurrentMonth={isCurrentMonth}
                  isTodayDay={isTodayDay}
                >
                  <div>{format(day as Date, 'd')}</div>
                  {
                    completedTasks.length > 0 ? (
                      completedTasks.map(task => (
                        <div key={task.id} className="completed-task">✔ {task.task_name}</div>
                      ))
                    ) : null
                  }
                </CalendarDay>
              )
            })}
          </CalendarGrid>
        </div>
      )}
    </div>
  )
}