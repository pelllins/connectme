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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F3352] shadow-[0_-6px_30px_rgba(15,51,82,0.25)]">
      <div className="max-w-7xl mx-auto px-1 md:px-3">
        <div className="flex items-center justify-around py-2 md:py-3 gap-0.5 md:gap-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`flex flex-col items-center gap-0.5 md:gap-1 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all text-[10px] md:text-xs font-medium text-white hover:bg-white/10`}
              >
                <Icon className={`w-4 md:w-6 h-4 md:h-6 ${isActive ? 'text-[#5B92FF]' : 'text-white'}`} />
                <span className="hidden xs:inline text-white/90">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
