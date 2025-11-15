"use client";

export default function UsersPage() {
  const users = [
    { id: 1, name: "Rahul Sharma", email: "rahul@example.com" },
    { id: 2, name: "Anita Verma", email: "anita@example.com" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Users</h1>

      <div className="bg-white p-6 rounded-xl shadow-xl overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 text-blue-600 cursor-pointer">View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
