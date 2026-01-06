import { CreditCard, BookOpen, Mail, Users, FileText, ClipboardList, Sparkles } from 'lucide-react';
import { Card } from './ui/card';
import { UserProfile, PostIt } from '../types';

interface HomePageProps {
  userProfile: UserProfile;
  recentPostIts: PostIt[];
  onViewAllPosts: () => void;
}

export function HomePage({ userProfile, recentPostIts, onViewAllPosts }: HomePageProps) {
  const quickActions = [
    { id: 'cards', label: 'Carte', icon: CreditCard },
    { id: 'rubrica', label: 'Rubrica', icon: Users },
    { id: 'webeep', label: 'WeBeep', icon: BookOpen },
    { id: 'webmail', label: 'Webmail', icon: Mail },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Studio':
        return <BookOpen className="w-4 h-4" />;
      case 'Social':
        return <Users className="w-4 h-4" />;
      case 'Sport':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F3352] via-[#0f3f68] to-[#1b6c8d] pb-24">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Hero */}
        <div className="rounded-3xl bg-white/10 border border-white/15 shadow-2xl backdrop-blur p-6 md:p-8 flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-white/70 text-sm uppercase tracking-[0.18em] mb-2">Bentornato</p>
            <h1 className="text-white text-2xl md:text-3xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {userProfile.name} {userProfile.surname}
            </h1>
            <p className="text-white/80 mt-3 text-sm md:text-base">
              Scopri cosa succede in campus e raggiungi subito la bacheca per unirti ai gruppi.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={onViewAllPosts}
                className="px-4 py-2.5 rounded-xl bg-white text-[#0F3352] font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Vai alla bacheca
              </button>
              <button
                className="px-4 py-2.5 rounded-xl border border-white/30 text-white/90 hover:bg-white/10 transition-colors"
              >
                Crea un post-it
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 border border-white/15 shadow-lg">
            <img
              src={userProfile.avatar}
              alt={`${userProfile.name} ${userProfile.surname}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/60 shadow-md"
            />
            <div>
              <p className="text-white font-semibold">Mat. {userProfile.matricola}</p>
              <p className="text-white/70 text-sm">{userProfile.email}</p>
            </div>
          </div>
        </div>

        {/* Profile + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-lg p-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img
                src={userProfile.avatar}
                alt={`${userProfile.name} ${userProfile.surname}`}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <h2 className="text-slate-900 text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{userProfile.name}</h2>
                <p className="text-slate-600 text-sm">{userProfile.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500">Campus</p>
                <p className="text-slate-900 font-semibold">Leonardo</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500">Bacheca</p>
                <p className="text-slate-900 font-semibold">3 novità</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 font-semibold">Azioni rapide</h3>
              <span className="text-slate-500 text-sm">Preferiti</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:-translate-y-0.5 transition-all shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0F3352] via-[#184d75] to-[#3CA9D3] text-white flex items-center justify-center shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-slate-800 text-sm font-medium">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Exams + Bacheca */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 p-6 bg-white border border-slate-200 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-6 h-6 text-[#0F3352]" />
              <h3 className="text-slate-900 font-semibold">Esami</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="text-3xl text-[#0F3352] mb-1 font-semibold">3</div>
                <div className="text-slate-600 text-sm">Iscrizioni</div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="text-3xl text-[#0F3352] mb-1 font-semibold">2</div>
                <div className="text-slate-600 text-sm">Esiti</div>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 p-6 bg-white border border-slate-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-slate-900 font-semibold">Bacheca</h3>
                <p className="text-slate-500 text-sm">Ultime attività dalla board</p>
              </div>
              <button 
                onClick={onViewAllPosts}
                className="px-3 py-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 text-sm font-semibold"
              >
                Vedi tutto
              </button>
            </div>
            <div className="space-y-3">
              {recentPostIts.map((post) => (
                <div 
                  key={post.id}
                  className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex gap-3 items-start shadow-[0_6px_20px_rgba(15,51,82,0.05)]"
                  style={{ boxShadow: '0 10px 30px rgba(15,51,82,0.06)' }}
                >
                  <div 
                    className="p-2 rounded-lg border border-slate-100"
                    style={{ backgroundColor: `${post.color}26` }}
                  >
                    {getCategoryIcon(post.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-900 font-semibold">{post.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 text-sm">{post.campus}</span>
                    </div>
                    <p className="text-slate-700 line-clamp-2">{post.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
