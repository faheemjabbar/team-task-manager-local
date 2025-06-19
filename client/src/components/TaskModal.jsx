// File: src/components/TaskModal.jsx
import { useEffect, useState } from 'react';
import { createTask, updateTask, getTeamMembers } from '../utils/api';

function TaskModal({ teams, users, selectedTask, onClose, onTaskCreated }) {
  const isEditing = Boolean(selectedTask);
  const [task, setTask] = useState({
    title: '',
    description: '',
    team_id: '',
    assignee_id: '',
    status: 'Pending',
  });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (isEditing && selectedTask) {
      setTask({
        title: selectedTask.title || '',
        description: selectedTask.description || '',
        team_id: selectedTask.team_id || '',
        assignee_id: selectedTask.assignee_id || '',
        status: selectedTask.status || 'Pending',
      });
    }
  }, [selectedTask]);

  useEffect(() => {
    async function loadMembers() {
      if (task.team_id) {
        const result = await getTeamMembers(task.team_id);
        if (Array.isArray(result)) setMembers(result);
      }
    }
    loadMembers();
  }, [task.team_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = isEditing
        ? await updateTask(selectedTask.id, task)
        : await createTask(task);

      if (result.task) {
        onTaskCreated(result.task);
        onClose();
      } else {
        alert('Failed to save task');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={task.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={task.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            name="team_id"
            value={task.team_id}
            onChange={async (e) => {
              const teamId = Number(e.target.value);
              setTask((prev) => ({ ...prev, team_id: teamId, assignee_id: '' }));
              const refreshed = await getTeamMembers(teamId);
              setMembers(refreshed);
            }}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>

          <select
            name="assignee_id"
            value={task.assignee_id}
            onChange={(e) => setTask({ ...task, assignee_id: Number(e.target.value) })}
            className="w-full border px-3 py-2 rounded"
            disabled={!members.length}
            required
          >
            <option value="">Assign to</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.username} ({member.email})
              </option>
            ))}
          </select>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
