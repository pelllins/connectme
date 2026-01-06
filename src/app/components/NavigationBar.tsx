import { Home, Calendar, GraduationCap, StickyNote, Building2 } from 'lucide-react';

interface NavigationBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function NavigationBar({ activeSection, onSectionChange }: NavigationBarProps) {
  const sections = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'polimi', label: 'Io e il Polimi', icon: GraduationCap },
    { id: 'bacheca', label: 'Bacheca', icon: StickyNote },
    { id: 'campus', label: 'Campus', icon: Building2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-6px_30px_rgba(15,51,82,0.12)]">
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex items-center justify-around py-3 gap-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all text-xs font-medium ${
                  isActive
                    ? 'bg-[#0F3352] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
