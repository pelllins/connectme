import { Menu } from 'lucide-react';
import logo from '../../assets/aebbc99c5019a5d73b5dea49e781c0f6420182a9.png';

interface HeaderProps {
  showMenu?: boolean;
  onMenuClick?: () => void;
  title?: string;
  showLogo?: boolean;
}

export function Header({ showMenu = false, onMenuClick, title = 'Io e il Polimi', showLogo = false }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-[#0F3352] via-[#0f3f68] to-[#1b6c8d] px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between rounded-2xl px-4 py-3 bg-white/5 backdrop-blur border border-white/10">
        <div className="flex items-center gap-3">
          {showLogo ? (
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="Connect-me" 
                className="h-10 w-auto object-contain drop-shadow"
              />
              <span className="text-white/80 text-sm">Connetti studenti, crea gruppi</span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-white/70 text-xs uppercase tracking-[0.14em]">Area personale</span>
              <h1 className="text-white font-semibold text-lg leading-tight">{title}</h1>
            </div>
          )}
        </div>
        
        {showMenu && (
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/15"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
}