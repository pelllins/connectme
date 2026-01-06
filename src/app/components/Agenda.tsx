import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Calendar } from './ui/calendar';

export function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock events - in a real app, these would come from your backend
  const events: Record<string, Array<{ title: string; time: string; location: string; color: string }>> = {
    '2026-01-06': [
      { title: 'Lezione Analisi I', time: '09:00', location: 'Campus Leonardo', color: '#5B92FF' },
      { title: 'Gruppo Studio', time: '14:00', location: 'Biblioteca', color: '#FFB772' },
    ],
    '2026-01-07': [
      { title: 'Esame Fisica', time: '10:30', location: 'Campus Bovisa', color: '#FF704E' },
    ],
    '2026-01-10': [
      { title: 'Aperitivo', time: '18:00', location: 'Bar Campus', color: '#FF704E' },
    ],
  };

  const dateKey = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
  const dayEvents = dateKey && events[dateKey] ? events[dateKey] : [];

  const hasEvent = (date: Date) => {
    const key = date.toISOString().split('T')[0];
    return key in events;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-6 h-6 text-[#0F3352]" />
                <h2 className="text-slate-900 font-semibold">Calendario</h2>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
              />
            </div>
          </div>

          {/* Events Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
              {/* Date Header */}
              <div className="mb-6">
                <h3 className="text-slate-900 text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                  {selectedDate
                    ? selectedDate.toLocaleDateString('it-IT', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Seleziona una data'}
                </h3>
                <p className="text-slate-500 mt-1">
                  {dayEvents.length > 0
                    ? `${dayEvents.length} ${dayEvents.length === 1 ? 'evento' : 'eventi'} previsto${dayEvents.length === 1 ? '' : 'i'}`
                    : 'Nessun evento in agenda'}
                </p>
              </div>

              {/* Events List */}
              <div className="space-y-4">
                {dayEvents.length > 0 ? (
                  dayEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-gradient-to-br hover:bg-slate-50 transition-colors"
                      style={{
                        borderLeft: `4px solid ${event.color}`,
                      }}
                    >
                      {/* Color Dot */}
                      <div
                        className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: event.color }}
                      />

                      {/* Event Content */}
                      <div className="flex-1">
                        <h4 className="text-slate-900 font-semibold text-lg mb-2">
                          {event.title}
                        </h4>
                        <div className="flex flex-col gap-2 text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span className="text-sm">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <button className="px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
                        style={{ backgroundColor: `${event.color}20`, color: event.color }}
                      >
                        Dettagli
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarIcon className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-slate-500 text-lg">Nessun evento in questa data</p>
                    <p className="text-slate-400 text-sm mt-1">Seleziona un'altra data dal calendario</p>
                  </div>
                )}
              </div>

              {/* Upcoming Events Summary */}
              {dayEvents.length === 0 && (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h4 className="text-slate-900 font-semibold mb-4">Prossimi eventi</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(events).map(([date, evts]) => {
                      const eventDate = new Date(date);
                      const isUpcoming = eventDate > new Date();
                      if (!isUpcoming) return null;
                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(eventDate)}
                          className="text-left p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <p className="text-sm font-semibold text-slate-800">
                            {eventDate.toLocaleDateString('it-IT', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {evts[0].title}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
