import { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Search, Sparkles, Plus, X, SlidersHorizontal, Maximize2, Users } from 'lucide-react';
import { PostIt, Category, Campus } from '../types';
import { PostItNote } from './PostItNote';
import { PostItDetail } from './PostItDetail';
import { CreatePostItModal } from './CreatePostItModal';
import { CustomDragLayer } from './CustomDragLayer';
import { motion } from 'motion/react';

interface BachecaProps {
  postIts: PostIt[];
  onUpdatePostItPosition: (id: string, x: number, y: number) => void;
  onCreatePostIt: (postIt: Omit<PostIt, 'id' | 'position' | 'participants'>) => void;
  onParticipate: (id: string) => void;
  joinedIds?: string[];
}

export function Bacheca({ postIts, onUpdatePostItPosition, onCreatePostIt, onParticipate, joinedIds = [] }: BachecaProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);
  const [detailPostIt, setDetailPostIt] = useState<PostIt | null>(null);
  const [isPerTeActive, setIsPerTeActive] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showJoinedOnly, setShowJoinedOnly] = useState(false);
  
  // Zoom state
  const [zoom, setZoom] = useState(1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Touch zoom state
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState(1);
  const [touchCenter, setTouchCenter] = useState({ x: 0, y: 0 });

  const categories: Category[] = ['Studio', 'Social', 'Sport', 'Passioni/Interessi', 'Pausa Caffè', 'Pranzo'];
  const campuses: Campus[] = ['Leonardo', 'Bovisa'];
  const days = ['Oggi', 'Domani', 'Questa Settimana'];

  // Check if a post-it matches the current filters
  const isPostItActive = (post: PostIt) => {
    if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && post.category !== selectedCategory) {
      return false;
    }
    if (selectedCampus && post.campus !== selectedCampus) {
      return false;
    }
    if (showJoinedOnly && !joinedIds.includes(post.id)) {
      return false;
    }
    return true;
  };

  const handlePostItClick = (postId: string) => {
    setHighlightedPostId(postId);
  };

  const handlePostItDoubleClick = (postIt: PostIt) => {
    setDetailPostIt(postIt);
  };

  const handleParticipateClick = () => {
    if (!detailPostIt) return;
    const isJoined = (detailPostIt.participantIds || []).includes('10123456'); // Marco's matricola
    const delta = isJoined ? -1 : 1;
    onParticipate(detailPostIt.id);
    setDetailPostIt({ 
      ...detailPostIt, 
      participants: Math.max(0, (detailPostIt.participants || 0) + delta),
    });
  };

  const handleCloseDetail = () => {
    setDetailPostIt(null);
  };

  const clearFilter = (type: 'category' | 'campus' | 'day') => {
    if (type === 'category') setSelectedCategory(null);
    if (type === 'campus') setSelectedCampus(null);
    if (type === 'day') setSelectedDay(null);
  };

  const handleResetZoom = () => {
    if (!containerRef.current) {
      setZoom(1);
      return;
    }
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate the center point of the viewport
    const viewportCenterX = rect.width / 2;
    const viewportCenterY = rect.height / 2;
    
    // Current scroll position
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
    
    // Point in content coordinates at current zoom
    const contentCenterX = (scrollLeft + viewportCenterX) / zoom;
    const contentCenterY = (scrollTop + viewportCenterY) / zoom;
    
    // Reset zoom
    setZoom(1);
    
    // Adjust scroll to keep the center point centered at zoom 1
    setTimeout(() => {
      container.scrollLeft = contentCenterX * 1 - viewportCenterX;
      container.scrollTop = contentCenterY * 1 - viewportCenterY;
    }, 0);
  };

  // Wheel zoom centered on mouse position
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Mouse position relative to container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Current scroll position
      const scrollLeft = container.scrollLeft;
      const scrollTop = container.scrollTop;
      
      // Point in content coordinates before zoom
      const pointX = (scrollLeft + mouseX) / zoom;
      const pointY = (scrollTop + mouseY) / zoom;
      
      // Calculate new zoom
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newZoom = Math.max(0.3, Math.min(2, zoom + delta));
      
      // Update zoom
      setZoom(newZoom);
      
      // Adjust scroll
      container.scrollLeft = pointX * newZoom - mouseX;
      container.scrollTop = pointY * newZoom - mouseY;
    }
  };

  // Touch zoom with center point preservation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Calculate distance between touches
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Calculate center point between touches
      const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
      const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
      
      // Store initial state
      setInitialPinchDistance(distance);
      setInitialZoom(zoom);
      setTouchCenter({
        x: (container.scrollLeft + centerX) / zoom,
        y: (container.scrollTop + centerY) / zoom,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance !== null) {
      e.preventDefault();
      
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Calculate current distance
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Calculate new zoom
      const scale = currentDistance / initialPinchDistance;
      const newZoom = Math.max(0.3, Math.min(2, initialZoom * scale));
      
      // Calculate current center point
      const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
      const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
      
      // Update zoom
      setZoom(newZoom);
      
      // Adjust scroll
      container.scrollLeft = touchCenter.x * newZoom - centerX;
      container.scrollTop = touchCenter.y * newZoom - centerY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      setInitialPinchDistance(null);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Filter Bar - Compact Mobile Design */}
        <div className="px-2 md:px-4 py-2 md:py-4 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto rounded-xl md:rounded-2xl bg-white/90 backdrop-blur border border-slate-200 shadow-sm px-2 md:px-5 py-2 md:py-4">
            {/* First Row - Per Te and Search */}
            <div className="flex items-center gap-1.5 md:gap-3 mb-2 md:mb-3">
              <button
                onClick={() => setIsPerTeActive(!isPerTeActive)}
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-all border ${
                  isPerTeActive 
                    ? 'bg-gradient-to-r from-[#8D7ED4] to-[#3CA9D3] text-white border-transparent shadow-md shadow-[#8D7ED4]/30' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                <Sparkles className={`w-3 md:w-4 h-3 md:h-4 ${isPerTeActive ? 'fill-purple-400' : ''}`} />
                <span className="hidden sm:inline">Per Te</span>
              </button>

              <button
                onClick={() => setShowJoinedOnly(!showJoinedOnly)}
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-all border ${
                  showJoinedOnly
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
                title="Mostra solo i post-it a cui partecipi"
              >
                <Users className="w-3 md:w-4 h-3 md:h-4" />
                <span className="hidden sm:inline">Partecipi</span>
                <span className={`text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-full ${
                  showJoinedOnly ? 'bg-emerald-200 text-emerald-900' : 'bg-white text-slate-700'
                }`}>
                  {joinedIds.length}
                </span>
              </button>

              <div className="flex-1 relative">
                <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 md:pl-10 pr-2 md:pr-4 py-1.5 md:py-3 text-sm md:text-base border border-slate-200 rounded-lg md:rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#8D7ED4] shadow-inner"
                />
              </div>
            </div>

            {/* Second Row - Filter Buttons */}
            <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto pb-1">
              {/* Category Filter */}
              {!selectedCategory ? (
                <div className="relative">
                  <select
                    value=""
                    onChange={(e) => setSelectedCategory(e.target.value as Category)}
                    className="appearance-none px-2 md:px-4 py-1.5 md:py-2.5 pr-8 md:pr-10 text-xs md:text-sm bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200 cursor-pointer border border-slate-200 shadow-sm"
                  >
                    <option value="">Categoria</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <SlidersHorizontal className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 text-slate-500 pointer-events-none" />
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm bg-purple-100 text-purple-800 rounded-lg border border-purple-200 shadow-sm"
                >
                  <span>{selectedCategory}</span>
                  <button onClick={() => clearFilter('category')}>
                    <X className="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </motion.div>
              )}

              {/* Campus Filter */}
              {!selectedCampus ? (
                <div className="relative">
                  <select
                    value=""
                    onChange={(e) => setSelectedCampus(e.target.value as Campus)}
                    className="appearance-none px-2 md:px-4 py-1.5 md:py-2.5 pr-8 md:pr-10 text-xs md:text-sm bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200 cursor-pointer border border-slate-200 shadow-sm"
                  >
                    <option value="">Campus</option>
                    {campuses.map((campus) => (
                      <option key={campus} value={campus}>{campus}</option>
                    ))}
                  </select>
                  <SlidersHorizontal className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 text-slate-500 pointer-events-none" />
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm bg-cyan-100 text-cyan-800 rounded-lg border border-cyan-200 shadow-sm"
                >
                  <span>{selectedCampus}</span>
                  <button onClick={() => clearFilter('campus')}>
                    <X className="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </motion.div>
              )}

              {/* Day Filter */}
              {!selectedDay ? (
                <div className="relative">
                  <select
                    value=""
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="appearance-none px-2 md:px-4 py-1.5 md:py-2.5 pr-8 md:pr-10 text-xs md:text-sm bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200 cursor-pointer border border-slate-200 shadow-sm"
                  >
                    <option value="">Giorno</option>
                    {days.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <SlidersHorizontal className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 text-slate-500 pointer-events-none" />
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm bg-orange-100 text-orange-800 rounded-lg border border-orange-200 shadow-sm"
                >
                  <span>{selectedDay}</span>
                  <button onClick={() => clearFilter('day')}>
                    <X className="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Bacheca Area with Zoom and Scroll */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-auto bg-gradient-to-br from-gray-50 to-gray-100"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="absolute"
            style={{
              width: '4000px',
              height: '3000px',
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {/* Grid background */}
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            
            {/* Post-its */}
            {postIts.map((postIt) => (
              <PostItNote
                key={postIt.id}
                postIt={postIt}
                onClick={() => handlePostItClick(postIt.id)}
                onDoubleClick={() => handlePostItDoubleClick(postIt)}
                onPositionChange={onUpdatePostItPosition}
                isHighlighted={highlightedPostId === postIt.id}
                isFiltered={!isPostItActive(postIt)}
                zoom={zoom}
                isJoined={joinedIds.includes(postIt.id)}
              />
            ))}
          </div>
        </div>

        {/* Zoom Reset Control */}
        {zoom !== 1 && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-32 left-6 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleResetZoom}
              className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-[#8D7ED4]"
              title="Ritorna alla vista normale (100%)"
            >
              <Maximize2 className="w-6 h-6 text-[#8D7ED4]" />
            </motion.button>
          </motion.div>
        )}

        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-24 right-8 w-16 h-16 bg-gradient-to-r from-[#8D7ED4] to-[#3CA9D3] rounded-full shadow-2xl flex items-center justify-center hover:opacity-90 transition-opacity z-50"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-8 h-8 text-white" />
        </motion.button>

        {/* Custom Drag Layer */}
        <CustomDragLayer zoom={zoom} />

        {/* Detail View */}
        <PostItDetail 
          postIt={detailPostIt} 
          onClose={handleCloseDetail} 
          onParticipate={handleParticipateClick}
          isJoined={detailPostIt ? joinedIds.includes(detailPostIt.id) : false}
        />

        {/* Create PostIt Modal */}
        <CreatePostItModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={onCreatePostIt}
        />
      </div>
    </DndProvider>
  );
}