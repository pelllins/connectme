import { useState } from 'react';
import { X, BookOpen, Users, Sparkles } from 'lucide-react';
import { Category, Campus, PostIt } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { DateTimePicker } from './DateTimePicker';

interface CreatePostItModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (postIt: Omit<PostIt, 'id' | 'position' | 'participants'>) => void;
}

const categoryColors: Record<Category, string> = {
  'Studio': '#3CA9D3',
  'Social': '#FF704E',
  'Sport': '#FF9E3F',
  'Passioni/Interessi': '#58BF4E',
  'Pausa Caffè': '#8D7ED4',
  'Pranzo': '#FB2E74',
};

const categoryIcons: Record<Category, React.ReactNode> = {
  'Studio': <BookOpen className="w-5 h-5" />,
  'Social': <Users className="w-5 h-5" />,
  'Sport': <Sparkles className="w-5 h-5" />,
  'Passioni/Interessi': <Sparkles className="w-5 h-5" />,
  'Pausa Caffè': <Users className="w-5 h-5" />,
  'Pranzo': <Users className="w-5 h-5" />,
};

export function CreatePostItModal({ isOpen, onClose, onSave }: CreatePostItModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('Studio');
  const [campus, setCampus] = useState<Campus>('Leonardo');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!content.trim()) {
      alert('Inserisci il contenuto del post-it!');
      return;
    }

    // Format date and time for display
    let formattedDate = '';
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
      formattedDate = dateObj.toLocaleDateString('it-IT', options);
      
      if (selectedTime) {
        formattedDate += `, ${selectedTime}`;
      }
    }

    onSave({
      title,
      content,
      category,
      campus,
      date: formattedDate || undefined,
      color: categoryColors[category],
      createdAt: new Date().toISOString(), // Ensure createdAt is always set
    });

    // Reset form
    setTitle('');
    setContent('');
    setCategory('Studio');
    setCampus('Leonardo');
    setSelectedDate('');
    setSelectedTime('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col"
          style={{ maxHeight: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="bg-[#15325B] px-4 py-3 flex items-center justify-between flex-shrink-0 rounded-t-2xl text-white shadow-inner">
            <h2 className="text-white text-lg font-semibold">Crea Nuovo Post-it</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Form - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {/* Category Selection */}
            <div>
              <label className="block text-slate-800 mb-2 text-sm font-medium">
                Categoria *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(categoryColors) as Category[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      category === cat
                        ? 'border-[#0F3352] shadow-md scale-105 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="scale-90">{categoryIcons[cat]}</div>
                      <span className="text-xs text-gray-700 text-center leading-tight">{cat}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-slate-800 mb-2 text-sm font-medium">
                Titolo (opzionale)
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Es: Gruppo Studio Analisi"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3352] text-sm bg-white shadow-inner"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-slate-800 mb-2 text-sm font-medium">
                Contenuto *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Descrivi la tua attività, cosa cerchi o cosa proponi..."
                rows={3}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3352] resize-none text-sm bg-white shadow-inner"
              />
            </div>

            {/* Campus Selection */}
            <div>
              <label className="block text-slate-800 mb-2 text-sm font-medium">
                Campus *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Leonardo', 'Bovisa'] as Campus[]).map((camp) => (
                  <button
                    key={camp}
                    type="button"
                    onClick={() => setCampus(camp)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      campus === camp
                        ? 'border-[#0F3352] bg-slate-50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-sm text-gray-700">{camp}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date/Time */}
            <div>
              <label className="block text-slate-800 mb-2 text-sm font-medium">
                Data e Ora (opzionale)
              </label>
              <DateTimePicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
              />
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex gap-2 p-4 border-t border-slate-200 bg-white flex-shrink-0 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="flex-1 px-4 py-2.5 bg-[#15325B] text-white rounded-lg hover:opacity-90 transition-opacity shadow-md text-sm font-medium"
            >
              Pubblica
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
