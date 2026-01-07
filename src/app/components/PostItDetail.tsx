import { X, Users, MapPin, Calendar, BookOpen, Sparkles } from 'lucide-react';
import { PostIt } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PostItDetailProps {
  postIt: PostIt | null;
  onClose: () => void;
  onParticipate?: () => void;
  isJoined?: boolean;
}

export function PostItDetail({ postIt, onClose, onParticipate, isJoined = false }: PostItDetailProps) {
  if (!postIt) return null;

  const accentGradient = `linear-gradient(135deg, ${postIt.color}, #0F3352)`;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Studio':
        return <BookOpen className="w-6 h-6" />;
      case 'Social':
        return <Users className="w-6 h-6" />;
      case 'Sport':
        return <Sparkles className="w-6 h-6" />;
      default:
        return <BookOpen className="w-6 h-6" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden bg-white border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 text-slate-700 hover:bg-white shadow"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Accent Header */}
            <div className="h-32" style={{ background: accentGradient }} />

            {/* Content Card */}
            <div className="p-8 -mt-14 relative">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-100 text-slate-800">
                    {getCategoryIcon(postIt.category)}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Categoria</p>
                    <h2 className="text-slate-900 text-lg font-semibold">{postIt.category}</h2>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200 text-slate-700 bg-slate-50">
                    <Users className="w-4 h-4" />
                    <span>{postIt.participants}</span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="mb-6">
                  <p className="text-slate-800 text-lg whitespace-pre-wrap leading-relaxed">
                    {postIt.content}
                  </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 border border-slate-100">
                    <MapPin className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-xs text-slate-500">Campus</p>
                      <p className="text-sm font-semibold text-slate-800">{postIt.campus}</p>
                    </div>
                  </div>

                  {postIt.date && (
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 border border-slate-100">
                      <Calendar className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-xs text-slate-500">Data</p>
                        <p className="text-sm font-semibold text-slate-800">{postIt.date}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 border border-slate-100">
                    <Users className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-xs text-slate-500">Partecipanti</p>
                      <p className="text-sm font-semibold text-slate-800">{postIt.participants}</p>
                    </div>
                  </div>
                </div>

                {/* Join/Leave Button */}
                <button 
                  onClick={onParticipate}
                  className={`w-full py-4 rounded-xl font-semibold transition-all border shadow-md ${
                    isJoined 
                      ? 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50' 
                      : 'bg-gradient-to-r from-[#8D7ED4] to-[#3CA9D3] text-white border-transparent hover:opacity-95'
                  }`}
                >
                  {isJoined ? 'Disiscriviti' : 'Partecipa!'}
                </button>
              </div>
            </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}