import { Menu, Calendar, User, StickyNote, MessageCircle } from 'lucide-react';

interface NavigationBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function NavigationBar({ activeSection, onSectionChange }: NavigationBarProps) {
  const sections = [
    { id: 'home', label: 'Home', icon: Menu },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'polimi', label: 'Io e il Polimi', icon: User },
    { id: 'bacheca', label: 'Bacheca', icon: StickyNote },
    { id: 'supporto', label: 'Supporto', icon: MessageCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F3352] shadow-[0_-6px_30px_rgba(15,51,82,0.25)]" style={{height: '76px'}}>
      <div className="max-w-7xl mx-auto px-1 md:px-3 h-full">
        <div className="flex items-center justify-around h-full py-2 md:py-3 gap-0.5 md:gap-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`flex flex-col items-center gap-1 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl transition-all text-xs md:text-sm font-medium text-white hover:bg-white/10 w-full`}
              >
                <Icon className={`w-7 md:w-8 h-7 md:h-8 mb-0.5 ${isActive ? 'text-[#5B92FF]' : 'text-white'}`} />
                <span
                  className={`block text-[10px] md:text-xs leading-none font-light truncate max-w-[72px] md:max-w-[90px] ${isActive ? 'text-[#5B92FF]' : 'text-white/90'}`}
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
