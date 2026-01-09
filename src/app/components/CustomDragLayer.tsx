import { useDragLayer } from 'react-dnd';
import { PostIt } from '../types';
import { Users } from 'lucide-react';

interface CustomDragLayerProps {
  zoom: number;
}

export function CustomDragLayer({ zoom }: CustomDragLayerProps) {
  const { itemType, isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || itemType !== 'POST_IT' || !currentOffset) {
    return null;
  }

  const postIt = item.postIt as PostIt;

  // Random rotation for natural post-it look
  const rotation = ((parseInt(postIt.id, 36) % 10) - 5) * 0.8;

  // Determina il colore della puntina in base alla categoria
  const getPinColor = () => {
    switch (postIt.category) {
      case 'Studio':
        return '#3CA9D3';
      case 'Social':
        return '#FF704E';
      case 'Sport':
        return '#FF9E3F';
      case 'Passioni/Interessi':
        return '#58BF4E';
      case 'Pausa Caffè':
        return '#8D7ED4';
      case 'Pranzo':
        return '#FB2E74';
      default:
        return '#8D7ED4';
    }
  };

  const pinColor = getPinColor();

  // Calculate age effect
  const getAgeEffect = () => {
    if (!postIt.createdAt) return 0;
    
    const now = new Date();
    const created = new Date(postIt.createdAt);
    const ageInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    
    const maxAgeDays = 30;
    const ageRatio = Math.min(ageInDays / maxAgeDays, 1);
    
    return ageRatio;
  };

  const ageEffect = getAgeEffect();
  
  const getAgedColor = (originalColor: string) => {
    const saturation = 100 - (ageEffect * 40);
    const brightness = 100 + (ageEffect * 20);
    
    return {
      backgroundColor: originalColor,
      filter: `saturate(${saturation}%) brightness(${brightness}%)`,
    };
  };

  // Nuova palette base
  const baseCategoryColors: Record<string, string> = {
    'Studio': '#3CA9D3',
    'Social': '#FF704E',
    'Sport': '#FF9E3F',
    'Passioni/Interessi': '#58BF4E',
    'Pausa Caffè': '#8D7ED4',
    'Pranzo': '#FB2E74',
  };

  // Usa sempre il colore base della categoria
  const postItColor = baseCategoryColors[postIt.category] || '#3CA9D3';

  const colorStyle = getAgedColor(postItColor);

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 10000,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: currentOffset.x,
          top: currentOffset.y,
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
          transformOrigin: '0 0',
          width: '240px',
          minHeight: '200px',
          opacity: 0.8,
        }}
      >
        {/* Pin/Thumbtack */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="19" rx="2.5" ry="0.8" fill="black" opacity="0.12" />
            <line x1="12" y1="8" x2="12" y2="17" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="12" cy="6" r="5" fill={pinColor} />
            <circle cx="12" cy="6" r="5" fill="url(#pinShine)" />
            <circle cx="10.5" cy="4.5" r="2" fill="white" opacity="0.5" />
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
          className="rounded-lg p-4 shadow-2xl"
          style={{ 
            ...colorStyle,
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.2)'
          }}
        >
          <div className="mb-3">
            <span className="text-gray-800 font-medium">{postIt.category}</span>
          </div>
          
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
      </div>
    </div>
  );
}
