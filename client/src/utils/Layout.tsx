// import React, { useState } from "react";

// import { Sidebar, Header } from "../components/navbar";

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout = ({ children }: LayoutProps) => {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <Sidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

//       {/* Backdrop */}
//       {mobileOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-30 lg:hidden"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex-1 flex flex-col overflow-y-auto">
//         <Header onHamburgerClick={() => setMobileOpen(true)} />
//         <main className="flex-1 p-6 bg-gray-50">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
