import { Menu, Calendar, User, StickyNote, MessageCircle } from 'lucide-react';

interface NavigationBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function NavigationBar({ activeSection, onSectionChange }: NavigationBarProps) {
  const sections = [
    { id: 'home', label: 'HOME', icon: Menu },
    { id: 'agenda', label: 'AGENDA', icon: Calendar },
    { id: 'polimi', label: 'IO E IL POLIMI', icon: User },
    { id: 'bacheca', label: 'BACHECA', icon: StickyNote },
    { id: 'supporto', label: 'SUPPORTO', icon: MessageCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#15325B] shadow-[0_-6px_30px_rgba(21,50,91,0.25)]" style={{height: '76px'}}>
      <div className="max-w-7xl mx-auto px-1 md:px-3 h-full">
        <div className="flex items-center justify-around h-full pt-1 pb-3 md:pt-1 md:pb-4 gap-0.5 md:gap-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`flex flex-col items-center gap-1 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl transition-all text-xs md:text-sm font-medium text-white hover:bg-white/10 w-full`}
              >
                <Icon className={`w-5 md:w-6 h-5 md:h-6 mb-0.5 ${isActive ? 'text-[#5B92FF]' : 'text-white'}`} />
                <span
                  className={`block text-[9px] md:text-[11px] leading-none font-light truncate max-w-[60px] md:max-w-[80px] mt-[-2px] ${isActive ? 'text-[#5B92FF]' : 'text-white/90'}`}
                  title={section.label}
                >
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
