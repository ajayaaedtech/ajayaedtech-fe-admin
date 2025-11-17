export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-400 text-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="opacity-90 text-lg">Welcome to Ajayaa Admin — where every number tells a story.</p>
      </div>

      {/* Stats Row */}
      

      {/* Info Card */}
      <div className="bg-white p-8 rounded-xl shadow-md border">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <p className="text-gray-600 mb-4">
          Use the menu on the left to manage users, courses, and broader operations.  
          Tradition teaches discipline, and discipline keeps the system running smooth.
        </p>

        <ul className="space-y-3 text-red-600 font-medium">
          <li>→ Manage Users</li>
          <li>→ Add or Edit Courses</li>
          <li>→ Review System Activity</li>
        </ul>
      </div>

    </div>
  );
}
