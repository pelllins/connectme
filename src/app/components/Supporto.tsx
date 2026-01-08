import { ArrowUpRight } from 'lucide-react';

export function Supporto() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <h1 className="text-3xl font-semibold text-[#15325B] mb-2">Supporto</h1>
        <p className="text-[#15325B] text-base font-normal mb-4">Contattaci per capire qual è la modalità di assistenza più adatta e risolvere il problema.</p>
        <button className="w-full rounded-full bg-[#294CFF] text-white text-lg font-medium py-3 mb-6">Contattaci</button>
      </div>

      {/* Servizi di segreteria */}
      <div className="bg-[#D7DEE7] text-[#15325B] font-semibold text-lg px-5 py-2">Servizi di segreteria</div>
      <div className="bg-white">
        <div className="px-5 py-4 border-b border-[#E6EAF2] flex items-start justify-between">
          <div>
            <div className="font-semibold text-[#15325B]">Prenota appuntamento</div>
            <div className="text-[#15325B] text-sm font-normal">Prenota un appuntamento in presenza o a distanza.</div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#294CFF] mt-1" />
        </div>
        <div className="px-5 py-4 border-b border-[#E6EAF2] flex items-start justify-between">
          <div>
            <div className="font-semibold text-[#15325B]">Code segreteria</div>
            <div className="text-[#15325B] text-sm font-normal">Visualizza lo stato delle code in segreteria.</div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#294CFF] mt-1" />
        </div>
      </div>

      {/* Altri servizi */}
      <div className="bg-[#D7DEE7] text-[#15325B] font-semibold text-lg px-5 py-2 mt-2">Altri servizi</div>
      <div className="bg-white">
        <div className="px-5 py-4 border-b border-[#E6EAF2] flex items-start justify-between">
          <div>
            <div className="font-semibold text-[#15325B]">Segnalazione guasti</div>
            <div className="text-[#15325B] text-sm font-normal">Segnala guasti o problematiche relativi all’infrastruttura Polimi.</div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#294CFF] mt-1" />
        </div>
        <div className="px-5 py-4 border-b border-[#E6EAF2] flex items-start justify-between">
          <div>
            <div className="font-semibold text-[#15325B]">Contatti e strutture</div>
            <div className="text-[#15325B] text-sm font-normal">Visualizza contatti e strutture</div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#294CFF] mt-1" />
        </div>
        <div className="px-5 py-4">
          <div className="font-semibold text-[#15325B]">Condividi i tuoi feedback</div>
        </div>
      </div>
    </div>
  );
}
