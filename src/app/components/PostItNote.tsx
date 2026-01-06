import { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Users } from 'lucide-react';
import { PostIt } from '../types';
import { motion } from 'motion/react';

interface PostItNoteProps {
  postIt: PostIt;
  onClick: () => void;
  onDoubleClick: () => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  isHighlighted: boolean;
  isFiltered?: boolean;
  zoom?: number;
  isJoined?: boolean;
}

export function PostItNote({ 
  postIt, 
  onClick, 
  onDoubleClick, 
  onPositionChange,
  isHighlighted,
  isFiltered = false,
  zoom = 1,
  isJoined = false
}: PostItNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  
  const [{ isDragging: isBeingDragged }, dragRef, preview] = useDrag({
    type: 'POST_IT',
    item: () => {
      setIsDragging(true);
      return { 
        id: postIt.id, 
        originalX: postIt.position.x, 
        originalY: postIt.position.y, 
        zoom,
        postIt // Pass the whole postIt for the CustomDragLayer
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      setIsDragging(false);
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        // Compensate for zoom - divide by zoom to get actual content displacement
        const newX = Math.max(0, Math.round(item.originalX + delta.x / zoom));
        const newY = Math.max(0, Math.round(item.originalY + delta.y / zoom));
        onPositionChange(postIt.id, newX, newY);
      }
      setDragOffset({ x: 0, y: 0 });
    },
  });

  // Hide the default HTML5 drag preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // Random rotation for natural post-it look
  const rotation = ((parseInt(postIt.id, 36) % 10) - 5) * 0.8; // -4 to +4 degrees

  // Determina il colore della puntina in base alla categoria
  const getPinColor = () => {
    switch (postIt.category) {
      case 'Studio':
        return '#5B92FF'; // Blu
      case 'Social':
        return '#FF704E'; // Arancione/Rosso
      case 'Sport':
        return '#FFB772'; // Giallo/Arancione chiaro
      case 'Passioni/Interessi':
        return '#85DE91'; // Verde
      case 'Pausa Caffè':
        return '#E895FF'; // Viola chiaro
      case 'Pranzo':
        return '#FB2E74'; // Rosa
      default:
        return '#8D7ED4'; // Viola
    }
  };

  const pinColor = getPinColor();

  // Calculate age effect (0 = new, 1 = very old)
  const getAgeEffect = () => {
    if (!postIt.createdAt) return 0;
    
    const now = new Date();
    const created = new Date(postIt.createdAt);
    const ageInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    
    // Max aging effect after 30 days
    const maxAgeDays = 30;
    const ageRatio = Math.min(ageInDays / maxAgeDays, 1);
    
    return ageRatio;
  };

  const ageEffect = getAgeEffect();
  
  // Apply aging effect to color (reduce saturation and increase brightness slightly)
  const getAgedColor = (originalColor: string) => {
    // Convert age effect to filter values
    // As it ages: reduce saturation (more gray) and increase brightness (faded)
    const saturation = 100 - (ageEffect * 40); // From 100% to 60%
    const brightness = 100 + (ageEffect * 20); // From 100% to 120%
    
    return {
      backgroundColor: originalColor,
      filter: `saturate(${saturation}%) brightness(${brightness}%)`,
    };
  };

  const colorStyle = getAgedColor(postIt.color);

  return (
    <motion.div
      ref={dragRef}
      initial={{ scale: 0, rotate: rotation }}
      animate={{ 
        scale: isDragging ? 1.05 : 1, 
        rotate: rotation,
        zIndex: isHighlighted ? 50 : isDragging ? 100 : 1,
        opacity: isFiltered ? 0.25 : (isDragging ? 0.3 : 1),
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
      }}
      className={`absolute select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: postIt.position.x,
        top: postIt.position.y,
        width: '240px',
        minHeight: '200px',
        pointerEvents: isFiltered ? 'none' : 'auto',
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {/* Pin/Thumbtack */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        {/* Puntina da disegno stilizzata e carina */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ombra sottile */}
          <ellipse cx="12" cy="19" rx="2.5" ry="0.8" fill="black" opacity="0.12" />
          {/* Asta metallica */}
          <line x1="12" y1="8" x2="12" y2="17" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
          {/* Testa della puntina (sfera colorata) */}
          <circle cx="12" cy="6" r="5" fill={pinColor} />
          {/* Overlay per dare profondità */}
          <circle cx="12" cy="6" r="5" fill="url(#pinShine)" />
          {/* Riflesso carino */}
          <circle cx="10.5" cy="4.5" r="2" fill="white" opacity="0.5" />
          {/* Definizioni gradiente */}
          <defs>
            <radialGradient id="pinShine" cx="35%" cy="35%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Post-it Body */}
      <div 
        className={`rounded-lg p-4 shadow-lg transition-all ${
          isHighlighted ? 'shadow-2xl scale-105' : 'hover:shadow-xl'
        } ${
          isJoined ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-100' : ''
        }`}
        style={{ 
          ...colorStyle,
          boxShadow: isHighlighted 
            ? '0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.2)'
            : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
        }}
      >
        <div className="mb-3">
          <span className="text-gray-800 font-medium">{postIt.category}</span>
        </div>

        {isJoined && (
          <div className="absolute -top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800 shadow">
            <Users className="w-3 h-3" />
            <span>Partecipo</span>
          </div>
        )}
        
        <p className="text-gray-900 mb-4 line-clamp-4">{postIt.content}</p>
        
        <div className="flex items-center gap-4 text-gray-700">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{postIt.participants}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{postIt.campus}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
