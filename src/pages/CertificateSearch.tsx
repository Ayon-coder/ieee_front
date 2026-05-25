import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { api } from '../lib/api';
import type { EventRecord, ParticipantRecord } from '../lib/api';
import { CertificateBackdrop } from '../components/PageBackdrops';

type EventData = EventRecord;
type StudentData = ParticipantRecord;
type SearchResult = ParticipantRecord;

const CertificateSearch = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { event?: EventData } | null;

  const [event, setEvent] = useState<EventData | null>(locationState?.event ?? null);
  const [participants, setParticipants] = useState<StudentData[]>([]);
  const [searchName, setSearchName] = useState('');
  const [suggestions, setSuggestions] = useState<StudentData[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [certificateData, setCertificateData] = useState<SearchResult | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [searching, setSearching] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const certRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchEventAndParticipants = async () => {
      if (!eventId) {
        setLoadingEvent(false);
        setError('Invalid event ID.');
        return;
      }

      setLoadingEvent(true);
      try {
        let targetEvent = locationState?.event ?? null;

        if (!targetEvent) {
          const events = await api.getEvents();
          targetEvent = (events as EventData[]).find((item) => item.id === eventId) ?? null;
        }

        if (!targetEvent) {
          setError('Event not found.');
          setEvent(null);
          return;
        }

        setEvent(targetEvent);
        setError('');

        setLoadingParticipants(true);
        try {
          const studentRows = await api.getParticipants(targetEvent.id);
          setParticipants((studentRows as StudentData[]) ?? []);
          setSuggestions((studentRows as StudentData[]) ?? []);
        } catch {
          setParticipants([]);
        } finally {
          setLoadingParticipants(false);
        }
      } catch {
        setError('Failed to load event details.');
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEventAndParticipants();
  }, [eventId, locationState]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!event || !searchName.trim()) {
      return;
    }

    setSearching(true);
    setError('');
    setCertificateData(null);

    try {
      const result = await api.searchStudent(searchName, event.id) as { found: boolean; data?: SearchResult };
      if (result.found && result.data) {
        setCertificateData(result.data);
      } else {
        setError('Name not found in this event. Please check spelling and try again.');
      }
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const updateSuggestions = (value: string) => {
    if (!value) {
      setSuggestions(participants.slice(0, 10));
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      return;
    }

    const q = value.trim().toLowerCase();
    const matches = participants.filter(p => (p.name || '').toLowerCase().includes(q));
    setSuggestions(matches.slice(0, 10));
    setShowSuggestions(true);
    setHighlightedIndex(matches.length ? 0 : -1);
  };

  const handleInputChange = (v: string) => {
    setSearchName(v);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    // debounce small local filtering
    debounceRef.current = window.setTimeout(() => updateSuggestions(v), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        const name = suggestions[highlightedIndex].name;
        setSearchName(name);
        setShowSuggestions(false);
        selectParticipant(name);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const clearSearch = () => {
    setSearchName('');
    setCertificateData(null);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    setSuggestions(participants.slice(0, 10));
  };

  const selectParticipant = async (name: string) => {
    setSearchName(name);
    if (!event) {
      return;
    }

    setSearching(true);
    setError('');
    setCertificateData(null);

    try {
      const result = await api.searchStudent(name, event.id) as { found: boolean; data?: SearchResult };
      if (result.found && result.data) {
        setCertificateData(result.data);
      } else {
        setError('Name not found in this event.');
      }
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const downloadPDF = async () => {
    if (!certRef.current || !certificateData) {
      return;
    }

    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${certificateData.name.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch {
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const namePos = event?.styling?.namePosition ?? { x: 400, y: 300, width: 160, height: 60 };
  const certWidth = event?.styling?.width ?? 800;
  const certHeight = event?.styling?.height ?? 600;
  const fontColor = event?.styling?.fontColor ?? '#000000';
  const fontFamily = event?.styling?.fontFamily ?? 'Arial';
  const textSize = event?.styling?.textSize ?? 36;

  const textX = namePos.x + (namePos.width ?? 0) / 2;
  const textY = namePos.y + (namePos.height ?? 0) / 2;

  const dynamicFontSize = useMemo(() => {
    if (!certificateData?.name) {
      return textSize;
    }

    const boxWidth = namePos.width ?? 150;
    const boxHeight = namePos.height ?? 60;
    const padding = 10;

    const tempSpan = document.createElement('span');
    tempSpan.style.position = 'absolute';
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.style.fontFamily = fontFamily;
    tempSpan.style.fontWeight = 'bold';
    tempSpan.textContent = certificateData.name;
    document.body.appendChild(tempSpan);

    let bestFitSize = 8;
    let minSize = 8;
    let maxSize = 120;

    for (let i = 0; i < 12 && minSize <= maxSize; i += 1) {
      const mid = Math.round((minSize + maxSize) / 2);
      tempSpan.style.fontSize = `${mid}px`;

      const textWidth = tempSpan.offsetWidth + padding * 2;
      const textHeight = tempSpan.offsetHeight + padding * 2;

      if (textWidth <= boxWidth && textHeight <= boxHeight) {
        bestFitSize = mid;
        minSize = mid + 1;
      } else {
        maxSize = mid - 1;
      }
    }

    document.body.removeChild(tempSpan);
    return bestFitSize;
  }, [certificateData?.name, fontFamily, namePos.height, namePos.width, textSize]);

  if (loadingEvent) {
    return (
      <main className="pt-24 pb-20 px-12">
        <section className="max-w-7xl mx-auto py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Loading certificate portal...</p>
        </section>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="pt-24 pb-20 px-12">
        <section className="max-w-4xl mx-auto py-16 text-center glass-panel rounded-3xl border border-outline-variant/20">
          <h2 className="font-headline text-3xl font-bold mb-3">Event Not Found</h2>
          <p className="text-on-surface-variant mb-6">The certificate section for this event could not be loaded.</p>
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="btn-gradient py-3 px-6 rounded-xl font-headline font-bold text-on-primary text-sm tracking-wide"
          >
            Back to Events
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 px-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <CertificateBackdrop />
      </div>
      <section className="max-w-7xl mx-auto mb-8 relative">
        <button
          type="button"
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Events
        </button>
      </section>

      <section className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        <article className="xl:col-span-2 glass-panel rounded-3xl border border-outline-variant/20 p-8">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-2">
            {event.name} <span className="text-gradient">Certificates</span>
          </h1>
          <p className="text-on-surface-variant mb-8">Search your name to preview and download your certificate.</p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6" autoComplete="off">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
              <input
                type="text"
                value={searchName}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => updateSuggestions(searchName)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-surface-container-low/50 border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant p-1"
                aria-label="Clear"
              >
                ✕
              </button>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-surface rounded-xl border border-outline-variant/20 shadow-lg overflow-hidden">
                  {suggestions.map((s, idx) => (
                    <button
                      key={`${s.name}-${idx}`}
                      type="button"
                      onClick={() => { setSearchName(s.name); setShowSuggestions(false); selectParticipant(s.name); }}
                      className={`w-full text-left px-4 py-2 hover:bg-surface-container-high/40 ${idx === highlightedIndex ? 'bg-surface-container-high/60' : ''}`}
                    >
                      <div className="font-medium truncate">{s.name}</div>
                      <div className="text-xs text-on-surface-variant">{s.position || 'Participant'}</div>
                    </button>
                  ))}
                </div>
              )}
              {showSuggestions && suggestions.length === 0 && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-surface rounded-xl border border-outline-variant/20 shadow-lg px-4 py-2 text-on-surface-variant">No matches</div>
              )}
            </div>
            <button
              type="submit"
              disabled={searching}
              className="btn-gradient py-3 px-8 rounded-xl font-headline font-bold text-on-primary text-sm tracking-wide disabled:opacity-60"
            >
              {searching ? 'Searching...' : 'Find Certificate'}
            </button>
          </form>
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-on-surface-variant">Participants: {participants.length}</div>
            <div className="text-xs text-on-surface-variant">Matches: {showSuggestions ? suggestions.length : certificateData ? 1 : 0}</div>
          </div>

          {error ? (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl p-4 mb-6">
              {error}
            </div>
          ) : null}

          {certificateData ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="font-headline text-2xl font-bold">Certificate Preview</h2>
                <button
                  type="button"
                  onClick={downloadPDF}
                  disabled={downloading}
                  className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-primary/40 text-on-surface hover:bg-primary/10 transition-colors disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  {downloading ? 'Preparing PDF...' : 'Download PDF'}
                </button>
              </div>

              <div className="overflow-auto border border-outline-variant/20 rounded-2xl bg-surface-container-lowest/50 p-3">
                <div
                  ref={certRef}
                  className="relative bg-white mx-auto shadow-sm"
                  style={{
                    width: `${certWidth}px`,
                    height: `${certHeight}px`,
                    backgroundImage: `url(${event.template?.svgUrl || event.styling?.svgUrl || ''})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div
                    className="absolute font-bold whitespace-nowrap"
                    style={{
                      left: `${textX}px`,
                      top: `${textY}px`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: `${dynamicFontSize}px`,
                      fontFamily,
                      color: fontColor,
                      fontWeight: 'bold'
                    }}
                  >
                    {certificateData.name}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-on-surface-variant text-sm">Search a participant name to render the certificate preview here.</div>
          )}
        </article>

        <aside className="glass-panel rounded-3xl border border-outline-variant/20 p-6 h-fit">
          <h3 className="font-headline text-xl font-bold mb-2">Participant List</h3>
          <p className="text-on-surface-variant text-sm mb-4">Click a name to auto-fill and preview instantly.</p>

          {loadingParticipants ? (
            <div className="text-on-surface-variant text-sm">Loading participants...</div>
          ) : participants.length === 0 ? (
            <div className="text-on-surface-variant text-sm">No participants found for this event.</div>
          ) : (
            <div className="max-h-[560px] overflow-auto space-y-2 pr-1">
              {participants.map((person, index) => (
                <button
                  type="button"
                  key={`${person.name}-${index}`}
                  onClick={() => selectParticipant(person.name)}
                  className="w-full text-left px-3 py-3 rounded-xl border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high/40 transition-colors"
                >
                  <p className="font-medium text-on-surface truncate">{person.name}</p>
                  <p className="text-xs text-on-surface-variant">{person.position || 'Participant'}</p>
                </button>
              ))}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

export default CertificateSearch;
