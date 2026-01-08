import { CreditCard, BookOpen, Mail, Users, RefreshCw, ArrowUpRight, UserCircle2 } from 'lucide-react';
import { UserProfile, PostIt } from '../types';

interface IoEIlPolimiProps {
  userProfile: UserProfile;
  imminentActivity?: { name: string; date: string; time: string; };
  exams?: { iscrizioni: number; esiti: number; };
}

export function IoEIlPolimi({ userProfile, imminentActivity, exams }: IoEIlPolimiProps) {
  const quickActions = [
    { id: 'cards', label: 'Carte', icon: CreditCard },
    { id: 'rubrica', label: 'Rubrica', icon: Users },
    { id: 'webeep', label: 'WeBeep', icon: BookOpen },
    { id: 'webmail', label: 'Webmail', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <h1 className="text-[1.45rem] font-medium text-[#15325B] tracking-[-0.02em]">Io e il Polimi</h1>
        <a href="#" className="text-[0.95rem] font-normal text-[#0F3352] flex items-center gap-1 tracking-tight hover:underline">
          Servizi Online <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="bg-white rounded-2xl mx-4 px-4 py-6 flex flex-col items-center shadow-sm">
        <img
          src={userProfile.avatar}
          alt={userProfile.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-[#E6EAF2] mb-2"
        />
        <div className="text-[#0F3352] text-2xl font-bold leading-tight">{userProfile.name}</div>
        <div className="text-[#0F3352] text-lg font-light -mt-1 mb-1">{userProfile.matricola}</div>
        <div className="text-[#0F3352] text-[15px] font-light mb-1">{userProfile.email}</div>
        <div className="text-[#0F3352] text-[14px] font-light mb-2">Vedi servizi come: Student – 269898 <button className="inline-block align-middle ml-1"><RefreshCw className="w-4 h-4 inline" /></button></div>
        <div className="flex w-full justify-between mt-3 mb-1">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.id} className="flex flex-col items-center flex-1">
                <span className="w-11 h-11 rounded-full bg-[#2563eb] flex items-center justify-center mb-1">
                  <Icon className="w-5 h-5 text-white" />
                </span>
                <span className="text-[#0F3352] text-xs font-light">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-7 px-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[#0F3352] text-xl font-light">Le mie attività</div>
        </div>
        <div className="bg-white rounded-xl p-4 flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <UserCircle2 className="w-6 h-6 text-[#0F3352]" />
            <div>
              <div className="text-[#0F3352] font-medium text-base">{imminentActivity?.name || 'TYPE DESIGN'}</div>
              <div className="text-[#0F3352] text-xs font-light">{imminentActivity?.date || 'GIO 08 GEN'} | {imminentActivity?.time || '09:15 - 13:15'}</div>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#2563eb]" />
        </div>
        <div className="text-[#0F3352] text-xl font-light mb-2 mt-6">Esami</div>
        <div className="bg-white rounded-xl p-4 flex items-center justify-between mb-5">
          <div className="flex flex-col items-center flex-1">
            <div className="text-2xl font-bold text-[#0F3352]">{exams?.iscrizioni ?? 1}</div>
            <div className="text-xs font-light text-[#0F3352]">ISCRIZIONI EFFETTUATE</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="text-2xl font-bold text-[#0F3352]">{exams?.esiti ?? 0}</div>
            <div className="text-xs font-light text-[#0F3352]">ESITI</div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#2563eb]" />
        </div>
        <div className="text-[#0F3352] text-xl font-light mb-2 mt-6">Carriera didattica</div>
        {/* Qui puoi aggiungere la lista della carriera didattica */}
      </div>
    </div>
  );
}
