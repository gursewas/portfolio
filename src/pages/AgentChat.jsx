import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://scope-of-work-api-production.up.railway.app";

const QUESTIONS = [
  {
    key: "project_owner",
    label: "01",
    question: "Who is the project owner?",
    placeholder: "e.g., City of Sacramento",
  },
  {
    key: "project_objective",
    label: "02",
    question: "What is the project objective?",
    placeholder: "e.g., Design and construct a new pedestrian bridge",
  },
  {
    key: "project_budget",
    label: "03",
    question: "Estimated project budget?",
    placeholder: "e.g., $500,000",
  },
  {
    key: "project_info",
    label: "04",
    question: "Project information?",
    placeholder: "e.g., Roadway Design & Culvert Construction",
  },
  {
    key: "technical_services",
    label: "05",
    question: "What technical services are needed?",
    placeholder: "e.g., Structural analysis, geotechnical investigation, surveying",
  },
  {
    key: "completion_estimate",
    label: "06",
    question: "Estimated project completion?",
    placeholder: "e.g., December 2027",
  },
];

export default function AgentChat() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState("");
  const [phase, setPhase] = useState("form"); // form | loading | done
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
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
    setError(null);

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const json = await res.json();
      setResponseText(json.report || "No report generated.");
      setPhase("done");
    } catch (err) {
      setError(err.message);
      setPhase("done");
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const res = await fetch(`${API_URL}/to-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report: responseText,
          project_owner: answers.project_owner || "scope_of_work",
        }),
      });
      if (!res.ok) throw new Error(`PDF error: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "scope_of_work.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setCurrentInput("");
    setPhase("form");
    setResponseText("");
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

        .agent-loading {
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }
        .agent-loading-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          color: #999;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }
        .agent-loading-sub {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #ccc;
        }

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
          <span className="agent-title">Scope AI</span>
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
                {step < QUESTIONS.length - 1 ? "Next" : "Generate"}
              </button>
            </div>
          </div>
        )}

        {phase === "loading" && (
          <div className="agent-loading">
            <div className="agent-loading-text">Generating Scope of Work...</div>
            <div className="agent-loading-sub">This may take a few minutes</div>
          </div>
        )}

        {phase === "done" && (
          <div className="agent-response-wrap">
            {responseText && (
              <>
                <div className="agent-response-label">Scope of Work</div>
                <div className="agent-response" ref={responseRef}>
                  {responseText}
                </div>
              </>
            )}

            {error && <div className="agent-error">{error}</div>}

            <div className="agent-btn-row agent-reset">
              <button
                className="agent-btn"
                onClick={handleDownloadPdf}
                disabled={downloadingPdf || !responseText}
              >
                {downloadingPdf ? "Generating PDF..." : "Download PDF"}
              </button>
              <button className="agent-btn agent-btn-back" onClick={handleReset}>
                New Report
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
