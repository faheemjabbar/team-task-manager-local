import { useState } from 'react';

function TasksPanel({ tasks, users, teams, onDelete, onEdit, onAdd }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchTeam = filterTeam ? task.team_id === Number(filterTeam) : true;
    const matchAssignee = filterAssignee ? task.assignee_id === Number(filterAssignee) : true;

    return matchSearch && matchTeam && matchAssignee;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
        <button
          onClick={onAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          + Add Task
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border px-3 py-2 rounded-md shadow-sm"
        />
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="w-full border px-3 py-2 rounded-md shadow-sm"
        >
          <option value="">All Teams</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          className="w-full border px-3 py-2 rounded-md shadow-sm"
        >
          <option value="">All Assignees</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
      </div>

      {filteredTasks.length > 0 ? (
        <ul className="space-y-4">
          {filteredTasks.map(task => (
            <li
              key={task.id}
              className="p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition"
            >
              <h3
                className="font-semibold text-blue-600 hover:underline cursor-pointer text-lg"
                onClick={() => onEdit(task)}
              >
                {task.title}
              </h3>
              <p className="text-gray-700 mt-1">{task.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    task.status === 'Done'
                      ? 'bg-green-100 text-green-700'
                      : task.status === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {task.status || 'Pending'}
                </span>
                <button
                  onClick={() => onDelete(task.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No matching tasks found.</p>
      )}
    </div>
  );
}

export default TasksPanel;
