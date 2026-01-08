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
    <header
      className="w-full fixed top-0 left-0 z-50"
      style={{ background: '#15325B', minHeight: 'env(safe-area-inset-top, 24px)', height: 'max(env(safe-area-inset-top, 24px), 24px)' }}
    >
      <div style={{ height: 'env(safe-area-inset-top, 24px)' }} />
    </header>
  );
}