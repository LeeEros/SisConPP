import { FC, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookText,
  User,
  Users,
  Music,
  ChevronLeft,
  ChevronRight,
  Building2,
  FilePlus,
  CopyPlus,
  BookPlus,
  BookType,
  SquareMenu,
  LogOut,
  Scale,
  Menu,
  X
} from "lucide-react";
import imgLogoLight from "../../assets/Logo-Light-SisConPP.png";

type UserRole = "SECRETARIO" | "AVALIADOR" | "AUXILIAR";

const Sidebar: FC = () => {
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const location = useLocation();

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      setUserRole(usuario.funcao as UserRole);
    }
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/tela-inicial", roles: ["SECRETARIO", "AVALIADOR", "AUXILIAR"] },
    { label: "CTGs", icon: Building2, href: "/ctg", roles: ["SECRETARIO"] },
    { label: "RTs", icon: CopyPlus, href: "/rt", roles: ["SECRETARIO"] },
    { label: "Concursos", icon: LayoutDashboard, href: "/concurso", roles: ["SECRETARIO"] },
    { label: "Candidatos", icon: Users, href: "/candidatos", roles: ["SECRETARIO"] },
    { label: "Avaliadores", icon: BookText, href: "/avaliadores", roles: ["SECRETARIO"] },
    { label: "Auxiliar", icon: User, href: "/auxiliares", roles: ["SECRETARIO"] },
    { label: "Comissões", icon: Users, href: "/comissao", roles: ["SECRETARIO"] },
    { label: "Sortear Danças", icon: Music, href: "/sorteio-danca", roles: ["SECRETARIO", "AUXILIAR"] },
    { label: "Planilhas Prática", icon: FilePlus, href: "/prova-pratica-criacao", roles: ["SECRETARIO"] },
    { label: "Prova Teórica", icon: BookPlus, href: "/prova-teorica-criacao", roles: ["SECRETARIO"] },
    { label: "Avaliação Prática", icon: SquareMenu, href: "/avaliacao-pratica", roles: ["SECRETARIO", "AVALIADOR"] },
    { label: "Avaliação Teórica", icon: BookType, href: "/avaliacao-teorica", roles: ["SECRETARIO"] },
    { label: "Relatórios", icon: BookText, href: "/relatorios", roles: ["SECRETARIO"] },
    { label: "Recursos", icon: Scale, href: "/recursos", roles: ["SECRETARIO"] },
  ];

  const filteredMenuItems = userRole
    ? menuItems.filter((item) => item.roles.includes(userRole))
    : [];

  return (
    <>
      {/* --- BOTÃO DE ABRIR (Mobile) --- */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-primary-dark text-white rounded-lg shadow-lg hover:bg-primary transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* --- SIDEBAR --- */}
      <aside
        className={`
          h-screen bg-primary-dark border-r border-primary shadow-2xl flex flex-col z-50 transition-all duration-300 ease-in-out
          
          /* MOBILE: Fixo, Tela Cheia (inset-0) */
          fixed inset-0 w-full
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}

          /* DESKTOP: Sticky, Larguras Específicas, Reseta a posição */
          md:sticky md:top-0 md:translate-x-0 md:h-screen md:border-r 
          ${isDesktopOpen ? "md:w-72" : "md:w-20"}
        `}
      >
        
        {/* Botão de Fechar (Só aparece no Mobile) */}
        {/* Aumentei um pouco para facilitar o toque na tela cheia */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute top-5 right-5 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
        >
          <X size={28} />
        </button>

        {/* Botão de Colapsar (Só Desktop) */}
        <button
          onClick={() => setIsDesktopOpen(!isDesktopOpen)}
          className="hidden md:flex absolute -right-3 top-10 bg-surface-bright border border-outline-variant text-primary rounded-full p-1.5 shadow-md hover:bg-primary hover:text-white transition-all z-50"
        >
          {isDesktopOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Cabeçalho / Logo */}
        <div className={`flex flex-col items-center py-8 px-4 transition-all duration-300 ${isDesktopOpen ? 'gap-3' : 'gap-0'}`}>
          <img
            src={imgLogoLight}
            alt="SisConPP"
            className={`transition-all duration-300 ${isDesktopOpen ? "w-20 h-20" : "w-10 h-10 md:w-10 md:h-10 w-24 h-24"}`} 
            // No mobile (tela cheia) deixei o logo um pouco maior (w-24)
          />

          <div className={`text-center transition-all duration-300 overflow-hidden ${
            isDesktopOpen ? "opacity-100 max-h-20" : "opacity-0 max-h-0 md:opacity-0 opacity-100" 
          }`}>
            <h1 className="text-white font-bold text-xl md:text-lg tracking-wide whitespace-nowrap mt-2 md:mt-0">SisConPP</h1>
            <p className="text-primary-onContainer text-xs md:text-[10px] uppercase tracking-wider opacity-80 whitespace-nowrap">
              Gestão de Concursos
            </p>
          </div>
        </div>

        <div className="w-[90%] h-px bg-primary/30 mb-2 mx-auto" />

        {/* Navegação (Scroll Oculto) */}
        <nav 
          className="flex-1 overflow-y-auto px-4 md:px-3 py-4 space-y-2 md:space-y-1 
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {filteredMenuItems.map(({ label, icon: Icon, href }) => {
            const isActive = location.pathname === href;

            return (
              <Link
                key={label}
                to={href}
                className={`
                  flex items-center gap-4 md:gap-3 px-4 md:px-3 py-4 md:py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30 font-semibold"
                    : "text-primary-onContainer/80 hover:bg-primary/20 hover:text-white"
                  }
                `}
              >
                <div className={`${!isDesktopOpen ? "mx-auto" : ""}`}>
                  {/* Ícone um pouco maior no mobile para facilitar o toque */}
                  <Icon size={24} className="md:w-[22px] md:h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
                </div>

                <span className={`whitespace-nowrap text-base md:text-sm transition-all duration-300 
                  ${isDesktopOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 hidden md:hidden"}
                `}>
                  {label}
                </span>

                {/* Tooltip Desktop */}
                {!isDesktopOpen && (
                  <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-neutral-surface text-neutral-onSurface text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé */}
        <div className="p-6 md:p-4 border-t border-primary/30 safe-area-bottom">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-3 py-3 rounded-xl text-error-container hover:bg-error-container hover:text-error-onContainer transition-all duration-200
              ${!isDesktopOpen && "justify-center"}
            `}
          >
            <LogOut size={24} className="md:w-[22px] md:h-[22px]" />
            <span className={`whitespace-nowrap text-base md:text-sm ${!isDesktopOpen ? "hidden md:hidden" : "block"}`}>
               Sair do Sistema
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;