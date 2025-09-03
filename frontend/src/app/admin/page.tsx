export default function AdminIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid gap-4">
          <a
            href="/admin/projects"
            className="bg-white rounded-xl shadow p-4 hover:shadow-md"
          >
            Projects
          </a>
          <a
            href="/admin/technologies"
            className="bg-white rounded-xl shadow p-4 hover:shadow-md"
          >
            Technologies
          </a>
          <a
            href="/admin/contacts"
            className="bg-white rounded-xl shadow p-4 hover:shadow-md"
          >
            Contacts
          </a>
          <a
            href="/admin/profile"
            className="bg-white rounded-xl shadow p-4 hover:shadow-md"
          >
            Profile
          </a>
        </div>
      </div>
    </div>
  );
}
