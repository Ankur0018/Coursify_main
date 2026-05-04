import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, LayoutDashboard } from "lucide-react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

const EMPTY_FORM = { title: "", description: "", price: "", imageUrl: "" };

function FormField({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = async () => {
    setLoading(true);
    const res = await api.get("/courses/mine");
    if (res.ok) setCourses(res.data.courses);
    setLoading(false);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditId(course._id);
    setForm({ title: course.title, description: course.description, price: String(course.price), imageUrl: course.imageUrl || "" });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormErrors({});
    const payload = { ...form, price: parseFloat(form.price) };
    setSaving(true);
    const res = editId
      ? await api.put(`/courses/${editId}`, payload)
      : await api.post("/courses", payload);
    setSaving(false);
    if (res.ok) {
      setModalOpen(false);
      showToast(editId ? "Course updated!" : "Course created!");
      loadCourses();
    } else {
      if (res.data.errors) setFormErrors(Object.fromEntries(Object.entries(res.data.errors).map(([k, v]) => [k, v[0]])));
      else showToast(res.data.message || "Save failed", "error");
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    const res = await api.del(`/courses/${id}`);
    setDeleteId(null);
    if (res.ok) {
      showToast("Course deleted.");
      loadCourses();
    } else {
      showToast(res.data.message || "Delete failed", "error");
    }
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <LayoutDashboard size={20} className="text-brand-600" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Instructor Dashboard</h1>
              <p className="text-gray-500 text-sm mt-0.5">Welcome, {user?.firstName} — manage your courses</p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors"
          >
            <Plus size={16} /> New Course
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Courses", value: courses.length, color: "text-brand-600", bg: "bg-brand-50 border-brand-100" },
            { label: "Published", value: courses.length, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Total Students", value: "—", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} border rounded-xl p-4`}>
              <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
              <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Course Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <BookOpen size={16} className="text-brand-500" /> My Courses
            </h2>
            <span className="text-xs text-gray-400">{courses.length} total</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 px-4">
              <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
              <h3 className="font-bold text-gray-700 mb-1">No courses yet</h3>
              <p className="text-gray-400 text-sm mb-5">Create your first course to start teaching.</p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-700"
              >
                <Plus size={15} /> Create First Course
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Description</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 max-w-xs line-clamp-1">{course.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{new Date(course.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-gray-500 max-w-xs line-clamp-1 text-xs">{course.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">₹{course.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(course)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            disabled={deleteId === course._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-60"
                          >
                            {deleteId === course._id ? <Spinner size="sm" /> : <><Trash2 size={12} /> Delete</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        title={editId ? "Edit Course" : "Create New Course"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? <><Spinner size="sm" light /> Saving...</> : editId ? "Save Changes" : "Create Course"}
            </button>
          </>
        }
      >
        <FormField label="Course Title *" error={formErrors.title}>
          <input type="text" value={form.title} onChange={set("title")} placeholder="e.g. Complete JavaScript Bootcamp" className={inputCls} />
        </FormField>
        <FormField label="Description *" error={formErrors.description}>
          <textarea value={form.description} onChange={set("description")} placeholder="What will students learn?" rows={4} className={inputCls} style={{ resize: "vertical" }} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Price (₹) *" error={formErrors.price}>
            <input type="number" value={form.price} onChange={set("price")} placeholder="499" min="0" className={inputCls} />
          </FormField>
          <FormField label="Image URL" error={formErrors.imageUrl}>
            <input type="url" value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://..." className={inputCls} />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
