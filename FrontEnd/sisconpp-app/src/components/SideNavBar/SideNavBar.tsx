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
} from "lucide-react";
import imgLogoLight from "../../assets/Logo-Light-SisConPP.png";

type UserRole = "SECRETARIO" | "AVALIADOR" | "AUXILIAR";

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const location = useLocation(); // Hook para saber a rota atual

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      setUserRole(usuario.funcao as UserRole);
    }
  }, []);

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
    <aside
      className={`h-screen sticky top-0 transition-all duration-300 flex flex-col ${isOpen ? "w-72" : "w-20"
        } bg-primary-dark border-r border-primary shadow-2xl z-50`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-10 bg-surface-bright border border-outline-variant text-primary rounded-full p-1.5 shadow-md hover:bg-primary hover:text-white transition-all z-50"
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Cabeçalho / Logo */}
      <div className={`flex flex-col items-center py-6 px-4 transition-all duration-300 ${isOpen ? 'gap-3' : 'gap-0'}`}>
        <img
          src={imgLogoLight}
          alt="SisConPP"
          className={`transition-all duration-300 ${isOpen ? "w-20 h-20" : "w-10 h-10"}`}
        />

        {isOpen && (
          <div className="text-center animate-fadeIn">
            <h1 className="text-white font-bold text-lg tracking-wide">SisConPP</h1>
            <p className="text-primary-onContainer text-[10px] uppercase tracking-wider opacity-80">
              Gestão de Concursos
            </p>
          </div>
        )}
      </div>

      <div className="w-full h-px bg-primary/30 mb-2 mx-auto w-[90%]" />

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 
  [&::-webkit-scrollbar]:w-1.5  [&::-webkit-scrollbar-track]:bg-transparent   [&::-webkit-scrollbar-thumb]:bg-primary/30
  [&::-webkit-scrollbar-thumb]:rounded-full  hover:[&::-webkit-scrollbar-thumb]:bg-primary/60 
">
        {filteredMenuItems.map(({ label, icon: Icon, href }) => {
          const isActive = location.pathname === href;

          return (
            <Link
              key={label}
              to={href}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30 font-semibold"
                  : "text-primary-onContainer/80 hover:bg-primary/20 hover:text-white"
                }
              `}
            >
              <div className={`${!isOpen && "mx-auto"}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 hidden"}`}>
                {label}
              </span>

              {!isOpen && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-neutral-surface text-neutral-onSurface text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary/30">
        <button
          onClick={handleLogout}
          className={`
                flex items-center gap-3 w-full px-3 py-3 rounded-xl text-error-container hover:bg-error-container hover:text-error-onContainer transition-all duration-200
                ${!isOpen && "justify-center"}
            `}
        >
          <LogOut size={22} />
          {isOpen && <span className="font-medium">Sair do Sistema</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;