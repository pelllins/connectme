


import { Bell, Settings } from 'lucide-react';
import polimiLogo from '../../assets/politecnico-di-milano-vector-logo.png';

export function HomePage() {
	return (
		<div className="min-h-screen bg-[#F5F7FA] pb-24">
			{/* Header Polimi senza barra blu */}
			<div className="flex items-center justify-between px-5 pt-8 pb-3 bg-transparent">
				<img src={polimiLogo} alt="Politecnico Milano 1863" className="h-12" onError={e => { e.currentTarget.style.display = 'none'; }} />
				<div className="flex items-center gap-2">
					<div className="relative">
						<Bell className="w-6 h-6 text-[#15325B]" />
						<span className="absolute -top-2 -right-2 bg-[#294CFF] text-white text-xs rounded-full px-1">1</span>
					</div>
					<Settings className="w-6 h-6 text-[#15325B] ml-2" />
				</div>
			</div>

			{/* Messaggio di benvenuto */}
			<div className="px-5 pt-4 pb-2">
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<span className="text-[#294CFF] text-xl font-semibold">Niccolò</span>
						<span className="text-[#15325B] text-xl font-medium">, c’è qualcosa che dovresti controllare</span>
					</div>
				</div>
			</div>

			{/* Notifiche */}
			<div className="bg-[#D7DEE7] px-5 py-2 text-[#15325B] font-semibold text-lg">Notifiche</div>
			<div className="bg-[#E9EFF6] px-5 py-4">
				<div className="flex items-center gap-4 mb-2">
					<div className="w-14 h-14 rounded-full bg-[#15325B] flex items-center justify-center">
						{/* Placeholder per icona evento */}
					</div>
					<div className="flex-1">
						<div className="text-[#15325B] text-xs font-medium mb-1">10 DIC</div>
						<div className="text-[#15325B] font-bold text-base">Eventi</div>
						<div className="text-[#15325B] text-sm font-normal mb-1">Aggiorna l'app! Update now! * Nuova navigazione mappe nella sezione Campus *</div>
						<button className="flex items-center gap-1 text-[#294CFF] font-semibold text-sm mt-1">VAI ALLA NOTIFICA <span className="ml-1">→</span></button>
					</div>
				</div>
			</div>

			{/* In evidenza */}
			<div className="bg-[#D7DEE7] px-5 py-2 text-[#15325B] font-semibold text-lg">In evidenza</div>
			<div className="bg-[#E9EFF6] px-5 py-4">
				<div className="flex items-center gap-4 mb-2">
					<div className="w-14 h-14 rounded-full bg-[#15325B] flex items-center justify-center">
						{/* Placeholder per icona esame */}
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<span className="text-[#15325B] text-3xl font-bold leading-none">08</span>
							<span className="text-[#15325B] text-base font-medium">GEN</span>
						</div>
						<div className="text-[#15325B] font-bold text-base">Esame</div>
						<div className="text-[#15325B] text-sm font-normal mb-1">TYPE DESIGN</div>
						<button className="flex items-center gap-1 text-[#294CFF] font-semibold text-sm mt-1">Apri dettaglio <span className="ml-1">→</span></button>
					</div>
				</div>
				{/* Paginazione */}
				<div className="flex items-center justify-center gap-2 mt-4">
					<span className="w-3 h-3 rounded-full bg-[#294CFF] inline-block" />
					<span className="w-3 h-3 rounded-full bg-[#D7DEE7] inline-block" />
					<span className="w-3 h-3 rounded-full bg-[#D7DEE7] inline-block" />
					<span className="w-3 h-3 rounded-full bg-[#D7DEE7] inline-block" />
					<span className="w-3 h-3 rounded-full bg-[#D7DEE7] inline-block" />
				</div>
			</div>
		</div>
	);
}
