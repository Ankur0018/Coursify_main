import { Star, IndianRupee } from "lucide-react";
import Spinner from "./Spinner";

const GRADIENTS = [
  "from-violet-500 to-purple-700",
  "from-blue-500 to-indigo-700",
  "from-emerald-500 to-teal-700",
  "from-orange-500 to-red-600",
  "from-pink-500 to-rose-700",
  "from-sky-500 to-cyan-700",
];

export default function CourseCard({ course, isEnrolled, onEnroll, isLoading }) {
  const gradient = GRADIENTS[course.title.charCodeAt(0) % GRADIENTS.length];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col group">
      {/* Thumbnail */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} overflow-hidden flex-shrink-0`}>
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <span className="text-6xl">📚</span>
        </div>
        {course.price === 0 && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            FREE
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 line-clamp-2 text-sm leading-snug mb-1.5">
          {course.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">
          {course.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={11} className="fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">4.8</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-0.5">
            <IndianRupee size={15} className="text-gray-800" />
            <span className="text-lg font-extrabold text-gray-900">{course.price}</span>
          </div>
          {isEnrolled ? (
            <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
              ✓ Enrolled
            </span>
          ) : (
            <button
              onClick={() => onEnroll(course._id)}
              disabled={isLoading}
              className="bg-brand-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-60 flex items-center gap-1.5 min-w-[88px] justify-center"
            >
              {isLoading ? <Spinner size="sm" light /> : "Enroll Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
