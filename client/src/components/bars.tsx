// import { 
//   Plus, Filter, Calendar, User, AlertCircle, CheckCircle2, Clock, 
//   MoreVertical, Edit2, Trash2, Users, FolderOpen, BarChart3, 
//   FileText, Settings, Bell, Search, ChevronDown, Tag, MessageSquare,
//   TrendingUp, Target, Star, Globe, Shield, Home, BookOpen
// } from 'lucide-react';

// export const Sidebar = () => (
//     <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto">
//       <div className="p-6">
//         <div className="flex items-center gap-3 mb-8">
//           <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//             <Target className="text-white" size={18} />
//           </div>
//           <h1 className="text-xl font-bold text-gray-900">TeamFlow</h1>
//         </div>

//         <nav className="space-y-2">
//           {[
//             { id: 'dashboard', label: 'Dashboard', icon: Home },
//             { id: 'kanban', label: 'Kanban Board', icon: FolderOpen },
//             { id: 'timeline', label: 'Timeline', icon: BarChart3 },
//             { id: 'issues', label: 'Issues', icon: MessageSquare },
//             { id: 'pages', label: 'Pages', icon: BookOpen },
//             { id: 'analytics', label: 'Analytics', icon: TrendingUp }
//           ].map(item => (
//             <button
//               key={item.id}
//               onClick={() => setActiveView(item.id)}
//               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
//                 activeView === item.id 
//                   ? 'bg-blue-50 text-blue-700 border border-blue-200' 
//                   : 'text-gray-600 hover:bg-gray-50'
//               }`}
//             >
//               <item.icon size={18} />
//               {item.label}
//             </button>
//           ))}
//         </nav>

//         <div className="mt-8">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-sm font-semibold text-gray-900">Teams</h3>
//             <button 
//               onClick={() => openCreateModal('team')}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <Plus size={16} />
//             </button>
//           </div>
          
//           <div className="space-y-2">
//             <button
//               onClick={() => setSelectedTeam('all')}
//               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
//                 selectedTeam === 'all' 
//                   ? 'bg-gray-100 text-gray-900' 
//                   : 'text-gray-600 hover:bg-gray-50'
//               }`}
//             >
//               <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
//               All Teams
//             </button>
            
//             {teams.map(team => (
//               <button
//                 key={team.id}
//                 onClick={() => setSelectedTeam(team.id)}
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
//                   selectedTeam === team.id 
//                     ? 'bg-gray-100 text-gray-900' 
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <div className={`w-3 h-3 ${team.color} rounded-full`}></div>
//                 <span className="truncate">{team.name}</span>
//                 {team.isGlobal && <Globe size={12} className="text-gray-400" />}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );


//  export const Header = () => (
//     <header className="ml-64 bg-white border-b border-gray-200 px-6 py-4">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeView}</h2>
//           {selectedTeam !== 'all' && (
//             <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
//               <div className={`w-2 h-2 ${teams.find(t => t.id === selectedTeam)?.color} rounded-full`}></div>
//               <span className="text-sm text-gray-600">{teams.find(t => t.id === selectedTeam)?.name}</span>
//             </div>
//           )}
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//             />
//           </div>
          
//           <button className="p-2 text-gray-400 hover:text-gray-600 relative">
//             <Bell size={20} />
//             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//           </button>

//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
//               {currentUser.avatar}
//             </div>
//             <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
//           </div>
//         </div>
//       </div>
//     </header>
//   );