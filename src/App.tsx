import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SiteLoader from './components/SiteLoader';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Teams from './pages/Teams';
import Contact from './pages/Contact';
import CertificateSearch from './pages/CertificateSearch';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
      <SiteLoader />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:eventId/certificate" element={<CertificateSearch />} />
          <Route path="event-details" element={<EventDetails />} />
          <Route path="teams" element={<Teams />} />
          <Route path="contact" element={<Contact />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
