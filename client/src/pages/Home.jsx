import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Zap, Users, Shield, ArrowRight, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

const CATEGORIES = ["Web Dev", "Design", "Data Science", "Marketing", "Finance", "Photography"];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    if (user) {
      navigate(user.role === "instructor" ? "/instructor" : "/dashboard", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    api.get("/courses").then((res) => {
      if (res.ok) setCourses(res.data.courses.slice(0, 8));
      setLoadingCourses(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-brand-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-purple-900 opacity-90" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-300 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-2 bg-brand-600/40 text-brand-300 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-brand-600/30 mb-6">
            <Zap size={12} /> The new way to learn online
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Learn from the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-purple-300">
              Best in the World
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Unlock your potential with expert-led courses. Learn at your own pace, anywhere, anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-brand-400 transition-colors"
            >
              Start Learning Free <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-white/20 transition-colors"
            >
              Log in
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 text-sm text-gray-400">
            {[["10,000+", "Students"], ["500+", "Courses"], ["50+", "Instructors"], ["4.8★", "Avg Rating"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold text-white mb-0.5">{val}</div>
                <div>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-gray-200 py-5 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-3 justify-center flex-wrap">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to="/login"
              className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50 transition-colors whitespace-nowrap"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Featured Courses</h2>
            <p className="text-gray-500 mt-1">Handpicked courses to get you started</p>
          </div>
          <Link to="/login" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loadingCourses ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={false}
                onEnroll={() => navigate("/login")}
                isLoading={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p>No courses yet. Be the first instructor to create one!</p>
            <Link to="/signup?role=instructor" className="mt-4 inline-flex items-center gap-1.5 text-brand-600 font-semibold text-sm">
              Become an Instructor <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white border-y border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Why Coursify?</h2>
            <p className="text-gray-500 mt-2">Everything you need to learn and grow</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: <Star size={24} className="text-brand-600" />, title: "Expert Instructors", desc: "Learn directly from industry professionals with years of real-world experience." },
              { icon: <Zap size={24} className="text-brand-600" />, title: "Self-paced", desc: "Study at your own schedule. No deadlines, no pressure — just progress." },
              { icon: <Shield size={24} className="text-brand-600" />, title: "Lifetime Access", desc: "Purchase once and access your courses forever, including all future updates." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl hover:bg-brand-50 transition-colors">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-600 to-purple-700 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Users size={40} className="text-white/50 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Ready to start learning?</h2>
          <p className="text-brand-200 mb-8">Join thousands of learners already on Coursify.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-brand-50 transition-colors">
            Create Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© 2025 <strong className="text-white">Coursify</strong> — Learn Without Limits</p>
        <div className="flex justify-center gap-6 mt-3">
          {[["Log in", "/login"], ["Sign up", "/signup"]].map(([label, to]) => (
            <Link key={label} to={to} className="hover:text-white transition-colors">{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
