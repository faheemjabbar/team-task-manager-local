// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchDashboardUser,
  getTasks,
  getTeams,
  getAllUsers,
  logoutUser,
  deleteTask,
  deleteTeam,
  createTeam,
  addUserToTeam,
} from '../utils/api';
import TaskModal from '../components/TaskModal';
import TasksPanel from '../components/TasksPanel';
import TeamsPanel from '../components/TeamsPanel';

function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    async function loadData() {
      const userData = await fetchDashboardUser();
      const taskData = await getTasks();
      const teamData = await getTeams();
      const usersData = await getAllUsers();

      if (userData.user) setUser(userData.user);
      if (Array.isArray(taskData)) setTasks(taskData);
      if (Array.isArray(teamData)) setTeams(teamData);
      if (Array.isArray(usersData)) setUsers(usersData);

      setLoading(false);
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    navigate('/login');
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      await deleteTeam(teamId);
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      setTasks((prev) => prev.filter((t) => t.team_id !== teamId));
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return alert('Team name is required');
    if (selectedUsers.length === 0) return alert('Select at least one member');

    const result = await createTeam({ name: newTeamName });
    if (result.team) {
      const teamId = result.team.id;
      for (const userId of selectedUsers) {
        await addUserToTeam({ team_id: teamId, user_id: userId });
      }
      setTeams((prev) => [...prev, result.team]);
      setNewTeamName('');
      setSelectedUsers([]);
      setIsTeamModalOpen(false);
    } else {
      alert('Failed to create team');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Team Task Manager</h1>
          <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Welcome to the Dashboard</h2>
          {user && (
            <div className="text-gray-700">
              <p><strong>Name:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <TasksPanel
            tasks={tasks}
            users={users}
            teams={teams}
            onDelete={handleDeleteTask}
            onEdit={(task) => {
              setSelectedTask(task);
              setIsModalOpen(true);
            }}
            onAdd={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
          />

          <TeamsPanel
            teams={teams}
            users={users}
            isModalOpen={isTeamModalOpen}
            setIsModalOpen={setIsTeamModalOpen}
            newTeamName={newTeamName}
            setNewTeamName={setNewTeamName}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            onCreateTeam={handleCreateTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        </div>

        {isModalOpen && (
          <TaskModal
            teams={teams}
            users={users}
            selectedTask={selectedTask}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTask(null);
            }}
            onTaskCreated={(updatedTask) => {
              setTasks((prev) =>
                selectedTask
                  ? prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
                  : [...prev, updatedTask]
              );
            }}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
