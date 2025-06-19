// File: src/components/TeamsPanel.jsx
function TeamsPanel({
  teams,
  users,
  isModalOpen,
  setIsModalOpen,
  newTeamName,
  setNewTeamName,
  selectedUsers,
  setSelectedUsers,
  onCreateTeam,
  onDeleteTeam,
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Teams</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          + Add Team
        </button>
      </div>

      <ul className="space-y-2 mb-6">
        {teams.map((team) => (
          <li
            key={team.id}
            className="p-3 rounded-lg border bg-white shadow-sm flex justify-between items-center"
          >
            <h4 className="font-semibold text-gray-800">{team.name}</h4>
            <button
              onClick={() => onDeleteTeam(team.id)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create New Team</h2>
            <form onSubmit={onCreateTeam} className="space-y-4">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Team name"
                className="w-full border px-3 py-2 rounded-md"
              />

              <select
                multiple
                value={selectedUsers}
                onChange={(e) =>
                  setSelectedUsers(
                    Array.from(e.target.selectedOptions, (option) => Number(option.value))
                  )
                }
                className="w-full border px-3 py-2 rounded-md h-32"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamsPanel;
