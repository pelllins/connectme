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
      className="bg-[#0F3352] w-full"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        minHeight: 'calc(env(safe-area-inset-top) + 44px)',
        height: 'calc(env(safe-area-inset-top) + 44px)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.04)'
      }}
    />
  );
}