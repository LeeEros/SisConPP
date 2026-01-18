import { Routes, Route, Navigate } from "react-router-dom";
import { RoutesPaths } from "./models/enums/RouterPaths";
import Login from "./pages/Login";
import TelaInicial from "./pages/TelaInicial";
import RT from "./pages/RT";
import CTG from "./pages/CTG";
import Avaliadores from "./pages/Avaliadores";
import { ToastContainer } from 'react-toastify';
import Auxiliares from "./pages/Auxiliares";
import Candidatos from "./pages/Candidato";
import Concurso from "./pages/Concurso";
import Comissao from "./pages/Comissao";
import SorteioDanca from "./pages/SorteioDanca";
import PrivateRoute from "./components/PrivateRoute";
import ProvaPraticaCriacao from "./pages/ProvaPraticaCriacao";
import ProvaTeoricaCriacao from "./pages/ProvaTeoricaCriacao";
import AvaliacaoPage from "./pages/AvaliacaoPratica";
import AvaliacaoTeoricaPage from "./pages/AvaliacaoTeorica";
import RelatoriosPage from "./pages/Relatorios";
import RecursosPage from "./pages/Recursos";

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tela-inicial"element={<PrivateRoute><TelaInicial /></PrivateRoute>}/>

          <Route path={RoutesPaths.TelaInicial} element={<TelaInicial />} />
          <Route path={RoutesPaths.RT} element={<RT />} />
          <Route path={RoutesPaths.CTG} element={<CTG />} />
          <Route path={RoutesPaths.Avaliadores} element={<Avaliadores />} />
          <Route path={RoutesPaths.Auxiliares} element={<Auxiliares />} />
          <Route path={RoutesPaths.Candidatos} element={<Candidatos />} />
          <Route path={RoutesPaths.Concurso} element={<Concurso />} />
          <Route path={RoutesPaths.Comissao} element={<Comissao />} />
          <Route path={RoutesPaths.SorteioDanca} element={<SorteioDanca />} />
          <Route path={RoutesPaths.ProvaPraticaCriacao} element={<ProvaPraticaCriacao/>} />
          <Route path={RoutesPaths.ProvaTeoricaCriacao} element={<ProvaTeoricaCriacao/>}/>
          <Route path={RoutesPaths.avaliacaoPratica} element={<AvaliacaoPage/>} />
          <Route path={RoutesPaths.AvaliacaoTeorica} element={<AvaliacaoTeoricaPage/>}/>
          <Route path={RoutesPaths.Relatoriois} element={<RelatoriosPage/>} />
          <Route path={RoutesPaths.Recursos} element={<RecursosPage/>} />

        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3500}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </>
      );
}

      export default App;