import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { CommandCenter } from './pages/CommandCenter';
import { MonthlyReport } from './pages/MonthlyReport';
import { Passport } from './pages/Passport';
import { PassportGroup } from './pages/PassportGroup';
import { PassportDzo } from './pages/PassportDzo';
import { PassportCompare } from './pages/PassportCompare';
import { Incidents } from './pages/Incidents';
import { IncidentDetail } from './pages/IncidentDetail';
import { Korgau } from './pages/Korgau';
import { Audit } from './pages/Audit';
import { Measures } from './pages/Measures';
import { Policies } from './pages/Policies';
import { Opo } from './pages/Opo';
import { DeclarationDetail } from './pages/DeclarationDetail';
import { Contractors } from './pages/Contractors';
import { Ptw } from './pages/Ptw';
import { Transport } from './pages/Transport';
import { Forms } from './pages/Forms';
import { Forecast } from './pages/Forecast';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/command" element={<CommandCenter />} />
        <Route path="/command/report" element={<MonthlyReport />} />
        <Route path="/passport" element={<Passport />} />
        <Route path="/passport/compare" element={<PassportCompare />} />
        <Route path="/passport/:group" element={<PassportGroup />} />
        <Route path="/passport/:group/:dzo" element={<PassportDzo />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/korgau" element={<Korgau />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/incidents/:id" element={<IncidentDetail />} />
        <Route path="/opo" element={<Opo />} />
        <Route path="/opo/declaration/:id" element={<DeclarationDetail />} />
        <Route path="/contractors" element={<Contractors />} />
        <Route path="/measures" element={<Measures />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/ptw" element={<Ptw />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/forecast" element={<Forecast />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
