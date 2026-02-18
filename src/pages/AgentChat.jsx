import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://civil-agent-production.up.railway.app";

const QUESTIONS = [
  {
    key: "project_owner",
    label: "01",
    question: "Who is the project owner?",
    placeholder: "e.g., City of Sacramento",
  },
  {
    key: "design_info",
    label: "02",
    question: "Design & engineering information?",
    placeholder: "e.g., Roadway Design, Bridge Construction, Wastewater Systems",
  },
  {
    key: "technical_services",
    label: "03",
    question: "What technical services are needed?",
    placeholder: "e.g., Structural analysis, geotechnical investigation, surveying",
  },
  {
    key: "completion_estimate",
    label: "04",
    question: "Estimated project completion?",
    placeholder: "e.g., December 2027",
  },
  {
    key: "project_objective",
    label: "05",
    question: "What is the project objective?",
    placeholder: "e.g., Design and construct a new pedestrian bridge over the American River",
  },
];

export default function AgentChat() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState("");
  const [phase, setPhase] = useState("form"); // form | loading | streaming | done
  const [responseText, setResponseText] = useState("");
  const [searches, setSearches] = useState([]);
  const [error, setError] = useState(null);
  const responseRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (phase === "form" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step, phase]);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [responseText]);

  const handleNext = () => {
    if (!currentInput.trim()) return;
    const q = QUESTIONS[step];
    const updated = { ...answers, [q.key]: currentInput.trim() };
    setAnswers(updated);
    setCurrentInput("");

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      submitResearch(updated);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const submitResearch = async (data) => {
    setPhase("loading");
    setResponseText("");
    setSearches([]);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setPhase("streaming");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            const eventType = line.slice(7).trim();
            // Next line should be data
            continue;
          }
          if (line.startsWith("data: ")) {
            const raw = line.slice(6);
            if (!raw || raw === "{}") continue;
            try {
              const parsed = JSON.parse(raw);
              if (parsed.text) {
                setResponseText((prev) => prev + parsed.text);
              }
              if (parsed.query) {
                setSearches((prev) => [...prev, parsed.query]);
              }
              if (parsed.error) {
                setError(parsed.error);
              }
            } catch {
              // skip unparseable lines
            }
          }
        }
      }
      setPhase("done");
    } catch (err) {
      setError(err.message);
      setPhase("done");
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setCurrentInput("");
    setPhase("form");
    setResponseText("");
    setSearches([]);
    setError(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&display=swap');

        .agent-page {
          min-height: 100vh;
          background: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          display: flex;
          flex-direction: column;
        }

        .agent-header {
          width: 100%;
          padding: 28px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.92);
        }

        .agent-back {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #000;
          text-decoration: none;
          padding: 6px 12px;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .agent-back:hover {
          color: #fff;
          background: #000;
        }

        .agent-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
        }

        .agent-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          max-width: 680px;
          margin: 0 auto;
          width: 100%;
        }

        /* Progress dots */
        .agent-progress {
          display: flex;
          gap: 10px;
          margin-bottom: 48px;
        }
        .agent-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e5e5e5;
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .agent-dot.done {
          background: #000;
        }
        .agent-dot.active {
          background: #000;
          transform: scale(1.4);
        }

        /* Question */
        .agent-question-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #ccc;
          letter-spacing: 0.06em;
          margin-bottom: 12px;
        }
        .agent-question {
          font-size: 24px;
          font-weight: 500;
          margin-bottom: 32px;
          line-height: 1.3;
        }

        .agent-input {
          width: 100%;
          font-size: 16px;
          padding: 16px 0;
          border: none;
          border-bottom: 2px solid #e5e5e5;
          outline: none;
          background: transparent;
          font-family: inherit;
          transition: border-color 0.3s ease;
        }
        .agent-input:focus {
          border-color: #000;
        }
        .agent-input::placeholder {
          color: #ccc;
        }

        .agent-btn-row {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          margin-top: 24px;
          gap: 12px;
        }

        .agent-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 32px;
          border: 2px solid #000;
          background: #000;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .agent-btn:hover {
          background: #fff;
          color: #000;
        }
        .agent-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .agent-btn:disabled:hover {
          background: #000;
          color: #fff;
        }

        .agent-btn-back {
          background: #fff;
          color: #000;
        }
        .agent-btn-back:hover {
          background: #000;
          color: #fff;
        }

        /* Loading / streaming */
        .agent-status {
          width: 100%;
          text-align: center;
        }
        .agent-status-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: #999;
          letter-spacing: 0.06em;
          margin-bottom: 24px;
        }
        .agent-searches {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 32px;
        }
        .agent-search-item {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #bbb;
          padding: 6px 12px;
          background: #fafafa;
          border: 1px solid #f0f0f0;
        }

        /* Response */
        .agent-response-wrap {
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
          padding: 48px 24px;
          flex: 1;
        }
        .agent-response-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 24px;
        }
        .agent-response {
          font-size: 15px;
          line-height: 1.85;
          color: #333;
          white-space: pre-wrap;
          word-wrap: break-word;
          max-height: 60vh;
          overflow-y: auto;
          padding-right: 8px;
        }
        .agent-response::-webkit-scrollbar {
          width: 4px;
        }
        .agent-response::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 2px;
        }

        .agent-error {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: #c00;
          padding: 16px;
          border: 1px solid #fdd;
          background: #fff5f5;
          margin-top: 16px;
        }

        .agent-reset {
          margin-top: 32px;
        }

        @media (max-width: 480px) {
          .agent-body { padding: 32px 16px; }
          .agent-question { font-size: 20px; }
          .agent-response-wrap { padding: 32px 16px; }
          .agent-btn { padding: 12px 24px; font-size: 12px; }
        }
      `}</style>

      <div className="agent-page">
        <header className="agent-header">
          <Link to="/" className="agent-back">Portfolio</Link>
          <span className="agent-title">Research Agent</span>
        </header>

        {phase === "form" && (
          <div className="agent-body">
            <div className="agent-progress">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`agent-dot ${i < step ? "done" : ""} ${i === step ? "active" : ""}`}
                />
              ))}
            </div>

            <div className="agent-question-num">{QUESTIONS[step].label}</div>
            <h2 className="agent-question">{QUESTIONS[step].question}</h2>

            <input
              ref={inputRef}
              className="agent-input"
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={QUESTIONS[step].placeholder}
            />

            <div className="agent-btn-row">
              {step > 0 && (
                <button
                  className="agent-btn agent-btn-back"
                  onClick={() => {
                    const prevKey = QUESTIONS[step - 1].key;
                    setCurrentInput(answers[prevKey] || "");
                    setStep(step - 1);
                  }}
                >
                  Back
                </button>
              )}
              <button
                className="agent-btn"
                onClick={handleNext}
                disabled={!currentInput.trim()}
              >
                {step < QUESTIONS.length - 1 ? "Next" : "Submit"}
              </button>
            </div>
          </div>
        )}

        {(phase === "loading" || phase === "streaming" || phase === "done") && (
          <div className="agent-response-wrap">
            {phase === "loading" && (
              <div className="agent-status">
                <div className="agent-status-text">Researching your project...</div>
              </div>
            )}

            {searches.length > 0 && (
              <div className="agent-searches">
                {searches.map((q, i) => (
                  <div key={i} className="agent-search-item">Searching: {q}</div>
                ))}
              </div>
            )}

            {responseText && (
              <>
                <div className="agent-response-label">Scope of Work</div>
                <div className="agent-response" ref={responseRef}>
                  {responseText}
                </div>
              </>
            )}

            {error && <div className="agent-error">{error}</div>}

            {phase === "done" && (
              <button className="agent-btn agent-reset" onClick={handleReset}>
                New Research
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
