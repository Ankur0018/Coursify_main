import { useEffect, useState } from "react";
import { Search, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

// Compact card for "My Learning" panel
function EnrolledCard({ course }) {
  const GRADIENTS = [
    "from-violet-500 to-purple-700",
    "from-blue-500 to-indigo-700",
    "from-emerald-500 to-teal-700",
    "from-orange-500 to-red-600",
    "from-pink-500 to-rose-700",
  ];
  const gradient = GRADIENTS[course.title.charCodeAt(0) % GRADIENTS.length];

  return (
    <div className="flex-shrink-0 w-56 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-28 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        {course.imageUrl && (
          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover absolute inset-0" />
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="text-4xl">📚</span>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-xs text-gray-900 line-clamp-2 leading-snug mb-2">{course.title}</h4>
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
          ✓ Enrolled
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingEnrolled, setLoadingEnrolled] = useState(true);
  const [loadingPurchase, setLoadingPurchase] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadCourses();
    loadEnrolled();
  }, []);

  const loadCourses = async () => {
    const res = await api.get("/courses");
    if (res.ok) setAllCourses(res.data.courses);
    setLoadingCourses(false);
  };

  const loadEnrolled = async () => {
    const res = await api.get("/purchases");
    if (res.ok) {
      const courses = res.data.purchases.map((p) => p.courseId).filter(Boolean).filter((c) => typeof c === "object");
      setEnrolledCourses(courses);
      setEnrolledIds(new Set(courses.map((c) => String(c._id))));
    }
    setLoadingEnrolled(false);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEnroll = async (courseId) => {
    setLoadingPurchase(courseId);
    const res = await api.post("/purchases", { courseId });
    if (res.ok) {
      showToast("Successfully enrolled! 🎉");
      await loadEnrolled();
    } else {
      showToast(res.data.message || "Enrollment failed", "error");
    }
    setLoadingPurchase(null);
  };

  const filtered = allCourses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Welcome Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {loadingEnrolled ? "Loading..." : `${enrolledCourses.length} course${enrolledCourses.length !== 1 ? "s" : ""} enrolled`}
              </p>
            </div>
            {/* Stat pills */}
            <div className="flex gap-3">
              <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-center min-w-[90px]">
                <div className="text-xl font-extrabold text-brand-600">{allCourses.length}</div>
                <div className="text-xs text-gray-500 mt-0.5">Available</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-center min-w-[90px]">
                <div className="text-xl font-extrabold text-emerald-600">{enrolledCourses.length}</div>
                <div className="text-xs text-gray-500 mt-0.5">Enrolled</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: All Courses ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-brand-600" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Explore All Courses</h2>
              <p className="text-xs text-gray-500">{allCourses.length} courses available</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white w-64"
            />
          </div>
        </div>

        {loadingCourses ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={enrolledIds.has(String(course._id))}
                onEnroll={handleEnroll}
                isLoading={loadingPurchase === course._id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-medium">No courses match your search.</p>
            <button onClick={() => setSearch("")} className="mt-3 text-sm text-brand-600 font-semibold hover:underline">
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* ── SECTION 2: My Learning Panel ── */}
      {!loadingEnrolled && enrolledCourses.length > 0 && (
        <div className="border-t border-gray-200 bg-white mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Panel header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <GraduationCap size={16} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">My Learning</h2>
                <p className="text-xs text-gray-500">{enrolledCourses.length} course{enrolledCourses.length !== 1 ? "s" : ""} in progress</p>
              </div>
            </div>

            {/* Horizontal scroll of enrolled courses */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {enrolledCourses.map((course) => (
                <EnrolledCard key={course._id} course={course} />
              ))}
              {/* Ghost card to encourage scrolling */}
              {enrolledCourses.length >= 4 && (
                <div className="flex-shrink-0 w-56 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400">
                  Scroll for more →
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty enrolled state */}
      {!loadingEnrolled && enrolledCourses.length === 0 && (
        <div className="border-t border-gray-200 bg-white mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <GraduationCap size={16} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">My Learning</h2>
            </div>
            <GraduationCap size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">You haven't enrolled in any courses yet.</p>
            <p className="text-gray-400 text-sm">Browse above and click <strong>Enroll Now</strong> to get started!</p>
          </div>
        </div>
      )}
    </div>
  );
}
