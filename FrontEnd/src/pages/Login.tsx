import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/Logo-SisConPP.png";
import Wave from "../components/Wave/Wave";
import { loginUsuario } from "../services/api";
import { toast } from "react-toastify";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

function Login() {
  const [usuario, setUsuario] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const data = await loginUsuario({ login: usuario, senha });

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      
      toast.success(`Bem-vindo(a), ${data.usuario.nomeCompleto|| 'Usuário'}!`);
      
      navigate("/tela-inicial");
    } catch (error: unknown) {
      console.error("Erro no login:", error);
      let mensagem = "Falha ao entrar. Verifique suas credenciais.";
      
      if (error instanceof Error) {
        const axiosError = error as Error & { response?: { data?: { message?: string } } };
        mensagem = axiosError.response?.data?.message || error.message || mensagem;
      }
      
      setErro(mensagem);
      toast.error(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full bg-neutral-background overflow-hidden flex flex-col justify-center items-center">
    
      <div className="w-full max-w-md px-4 z-20">
        
        <div className="bg-surface-containerLowest p-8 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm">
          
          <div className="flex flex-col items-center mb-8">
            <img 
                src={imgLogo} 
                alt="SisConPP" 
                className="h-24 w-auto drop-shadow-md mb-4 hover:scale-105 transition-transform duration-300" 
            />
            <h2 className="text-2xl font-bold text-primary-dark tracking-tight">
              Acesso ao Sistema
            </h2>
            <p className="text-sm text-neutral-onSurface opacity-60">
              Entre com suas credenciais para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary-dark ml-1 uppercase tracking-wider">
                Usuário
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-containerHigh border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-neutral-onBackground placeholder:text-neutral-onVariant/50"
                  placeholder="Digite seu login"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-primary-dark uppercase tracking-wider">
                  Senha
                </label>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                
                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-surface-containerHigh border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-neutral-onBackground placeholder:text-neutral-onVariant/50"
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
               
               <div className="flex justify-end mt-1">
                <button
                  type="button"
                  className="text-xs font-medium text-secondary hover:text-secondary-dark hover:underline transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            {erro && (
              <div className="bg-error-container/20 p-3 rounded-lg border border-error-container">
                 <p className="text-error text-sm text-center font-medium">{erro}</p>
              </div>
            )}

            <button
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark hover:shadow-primary-dark/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-6"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                "Acessar Painel"
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-neutral-onSurface opacity-40 mt-8">
          © {new Date().getFullYear()} SisConPP - Todos os direitos reservados.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-10 opacity-90 pointer-events-none">
        <Wave />
      </div>
    </div>
  );
}

export default Login;