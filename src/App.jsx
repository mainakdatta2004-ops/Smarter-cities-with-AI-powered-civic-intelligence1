import React, { useState, useEffect, useRef } from 'react';

// Pre-defined dataset for live feedback simulation
const INITIAL_FEEDBACKS = [
  { text: "The new bike lanes on District 4 are amazing, feel much safer!", sentiment: "positive" },
  { text: "Buses are constantly delayed during the 8 AM rush hour. Please optimize route 12.", sentiment: "negative" },
  { text: "Streetlight outage near the Central Library corner.", sentiment: "negative" },
  { text: "Participatory budget meeting scheduled for Thursday. Glad to see local votes count.", sentiment: "neutral" },
  { text: "Smart bins are a great addition, streets look much cleaner.", sentiment: "positive" }
];

export default function App() {
  // --- UI States ---
  const [activeLayer, setActiveLayer] = useState('mobility');
  const [activeCase, setActiveCase] = useState('singapore');
  const [activeGovLayer, setActiveGovLayer] = useState(1);
  const [reflectionFocus, setReflectionFocus] = useState('smart');

  // --- Live System Monitor State (Hero) ---
  const [systemMetrics, setSystemMetrics] = useState({
    unifiedSystems: 184,
    latency: 42,
    humanReview: 92.4,
    dataPrivate: 100
  });

  // --- Widget 1: Mobility States ---
  const [signalMode, setSignalMode] = useState('adaptive'); // 'schedule' or 'adaptive'
  const [trafficDelay, setTrafficDelay] = useState(16); // in seconds
  const [activeLight, setActiveLight] = useState('green'); // 'red', 'yellow', 'green'
  const [trafficSpike, setTrafficSpike] = useState(false);

  // --- Widget 2: Public Safety States ---
  const [ethicalPolicing, setEthicalPolicing] = useState(true);
  const [dispatchTime, setDispatchTime] = useState(4.8); // in minutes
  const [safetyLogs, setSafetyLogs] = useState([
    { time: "20:41", tag: "Logistics", event: "Emergency unit pre-positioned at Station 3.", type: "system" },
    { time: "20:43", tag: "Dispatch", event: "Medical response dispatched to Sector 2. Estimated travel: 4.5m", type: "system" }
  ]);

  // --- Widget 3: Utilities States ---
  const [solarInput, setSolarInput] = useState(65);
  const [windInput, setWindInput] = useState(40);
  const [isScanningLeak, setIsScanningLeak] = useState(false);
  const [leakStatus, setLeakStatus] = useState('idle'); // 'idle', 'scanning', 'detected'

  // --- Widget 4: Civic Voice States ---
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [newComment, setNewComment] = useState('');
  const [sentimentStats, setSentimentStats] = useState({ positive: 2, neutral: 1, negative: 2 });

  // --- Refs ---
  const feedbackEndRef = useRef(null);

  // --- Simulation Effects ---

  // 1. Hero system metrics tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        latency: Math.max(35, Math.min(50, prev.latency + (Math.random() > 0.5 ? 1 : -1))),
        unifiedSystems: prev.unifiedSystems + (Math.random() > 0.95 ? 1 : 0)
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // 2. Traffic Signal Alternation loop
  useEffect(() => {
    let intervalTime = signalMode === 'adaptive' ? 2500 : 5000;
    const timer = setInterval(() => {
      setActiveLight(prev => {
        if (prev === 'green') return 'yellow';
        if (prev === 'yellow') return 'red';
        return 'green';
      });
    }, intervalTime);
    return () => clearInterval(timer);
  }, [signalMode]);

  // 3. Auto-adjust traffic metrics based on state
  useEffect(() => {
    let baseDelay = signalMode === 'adaptive' ? 16 : 28;
    if (trafficSpike) {
      setTrafficDelay(baseDelay + 24);
      // Auto resolve spike after some time
      const resolveTime = signalMode === 'adaptive' ? 3000 : 7000;
      const timer = setTimeout(() => {
        setTrafficSpike(false);
        setTrafficDelay(baseDelay);
      }, resolveTime);
      return () => clearTimeout(timer);
    } else {
      setTrafficDelay(baseDelay);
    }
  }, [signalMode, trafficSpike]);

  // 4. Safety Logs Generator
  useEffect(() => {
    const events = [
      "Water pressure sensor anomaly resolved in Grid B.",
      "Grid response: Dynamic solar storage routed to commercial hub.",
      "Emergency call: Fire dispatch initiated in District 5.",
      "Smart waste compactor full alert - Route 3 updated."
    ];
    const timer = setInterval(() => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setSafetyLogs(prev => [
        ...prev.slice(-6),
        { time, tag: "System", event: randomEvent, type: "system" }
      ]);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  // 5. Recalculate Dispatch Time based on Ethical Mode
  useEffect(() => {
    setDispatchTime(ethicalPolicing ? 4.8 : 6.2);
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (ethicalPolicing) {
      setSafetyLogs(prev => [
        ...prev,
        { time, tag: "Security", event: "Equitable Dispatch Active: Live routing optimized with bias checks.", type: "info" }
      ]);
    } else {
      setSafetyLogs(prev => [
        ...prev,
        { time, tag: "Security", event: "Standard Dispatch Active: Predictive policing models paused to audit bias.", type: "warn" }
      ]);
    }
  }, [ethicalPolicing]);

  // 6. Recalculate feedback stats on feed updates
  useEffect(() => {
    const stats = feedbacks.reduce((acc, curr) => {
      acc[curr.sentiment]++;
      return acc;
    }, { positive: 0, neutral: 0, negative: 0 });
    setSentimentStats(stats);
    if (feedbackEndRef.current) {
      feedbackEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [feedbacks]);

  // --- Handlers ---
  const triggerTrafficSpike = () => {
    setTrafficSpike(true);
  };

  const handleSolarChange = (e) => {
    setSolarInput(parseInt(e.target.value));
  };

  const handleWindChange = (e) => {
    setWindInput(parseInt(e.target.value));
  };

  const scanForLeaks = () => {
    setIsScanningLeak(true);
    setLeakStatus('scanning');
    setTimeout(() => {
      setIsScanningLeak(false);
      setLeakStatus('detected');
    }, 2500);
  };

  const analyzeSentimentText = (text) => {
    const posWords = ["good", "great", "love", "amazing", "clean", "safe", "happy"];
    const negWords = ["bad", "late", "delayed", "broken", "danger", "outage", "slow", "noise"];
    const lower = text.toLowerCase();
    
    let isPos = posWords.some(w => lower.includes(w));
    let isNeg = negWords.some(w => lower.includes(w));
    
    if (isPos && !isNeg) return "positive";
    if (isNeg && !isPos) return "negative";
    return "neutral";
  };

  const submitCivicVoice = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const sentiment = analyzeSentimentText(newComment);
    const newEntry = { text: newComment, sentiment };
    
    setFeedbacks(prev => [...prev, newEntry]);
    setNewComment('');
  };

  // --- 3D Hover Tilt Effects (React Implementation) ---
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc;
    const dy = (y - yc) / yc;
    card.style.transform = `rotateY(${dx * 9}deg) rotateX(${-dy * 9}deg) translateZ(10px)`;
  };

  const handleCardMouseLeave = (e) => {
    e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
  };

  // --- Content Datasets ---
  const layerContent = {
    mobility: {
      tag: "Layer 01 // Transportation",
      title: "Traffic & Mobility",
      icon: "🚦",
      text: (
        <>
          <p>Traditional urban transit relies on historical averages and rigid schedules, resulting in bottleneck grids and wasted carbon emissions. AI-powered mobility layers revolutionize this through <strong>Adaptive Traffic Control Systems (ATCS)</strong> and predictive congestion management.</p>
          <p>By analyzing real-time data from cameras, GPS coordinates, and road-bed sensors, AI algorithms dynamically adjust traffic light cycles. If a sensor detects a sudden influx of vehicles from a sporting event, it extends green lights on primary arterial roads, preventing a cascade of congestion. Google's <em>Project Green Light</em>, for example, uses AI to model traffic flow and recommend light timing adjustments, reducing stops at intersections by up to 30%.</p>
          <p>Furthermore, machine learning models predict bottleneck formations 30 to 60 minutes in advance, suggesting dynamic rerouting for municipal bus fleets and commercial vehicles. The result is a fluid, self-healing transit network that reduces carbon footprints while returning hours of lost time to commuting citizens.</p>
        </>
      ),
      widget: (
        <div className="widget-container">
          <div className="widget-title">
            <span>TRAFFIC FLOW CONTROLLER</span>
            <span className="status">AI Status: {signalMode === 'adaptive' ? 'Adaptive Active' : 'Static Loop'}</span>
          </div>
          
          <div className="traffic-grid-widget">
            <div className="traffic-simulation-visual">
              <div className="traffic-intersection">
                <div className={`signal-light red ${activeLight === 'red' ? 'active' : ''}`}></div>
                <div className={`signal-light yellow ${activeLight === 'yellow' ? 'active' : ''}`}></div>
                <div className={`signal-light green ${activeLight === 'green' ? 'active' : ''}`}></div>
              </div>
              <div style={{ flexGrow: 1, paddingLeft: '20px' }}>
                <p style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--text-hi)', fontWeight: '600' }}>
                  {activeLight === 'green' ? 'Route 1: GO' : activeLight === 'yellow' ? 'Route 1: TRANSITION' : 'Route 1: STOP'}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-lo)' }}>
                  Cycle timing: {signalMode === 'adaptive' ? 'Dynamic Sensors (2.5s)' : 'Fixed Timer (5.0s)'}
                </p>
              </div>
            </div>

            <div className="traffic-stats-bar">
              <div className="stats-bar-header">
                <span>Average Intersection Delay</span>
                <span>{trafficDelay}s</span>
              </div>
              <div className="bar-outer">
                <div className="bar-inner" style={{ width: `${Math.min(100, (trafficDelay / 60) * 100)}%` }}></div>
              </div>
            </div>

            {trafficSpike && (
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--amber)', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
                ⚠️ Congestion spike detected! AI recalibrating light cycles...
              </p>
            )}

            <div className="widget-controls">
              <button 
                className={`widget-btn ${signalMode === 'adaptive' ? 'active-opt' : ''}`}
                onClick={() => setSignalMode('adaptive')}
              >
                AI Adaptive Mode
              </button>
              <button 
                className={`widget-btn ${signalMode === 'schedule' ? 'active-opt' : ''}`}
                onClick={() => setSignalMode('schedule')}
              >
                Fixed Schedule Mode
              </button>
            </div>
            
            <button 
              className="widget-btn" 
              style={{ background: 'rgba(255,107,107,0.1)', borderColor: 'rgba(255,107,107,0.3)', color: 'var(--red)', marginTop: '8px' }}
              onClick={triggerTrafficSpike}
              disabled={trafficSpike}
            >
              {trafficSpike ? "Resolving Spike..." : "Trigger Congestion Spike"}
            </button>
          </div>
        </div>
      )
    },
    safety: {
      tag: "Layer 02 // Protection",
      title: "Public Safety & Response",
      icon: "🛡️",
      text: (
        <>
          <p>Modern public safety uses AI to optimize emergency response networks. Incident dispatch systems analyze historical response data, weather patterns, traffic density, and live 911 calls to pre-position emergency services. By placing ambulances and fire engines in localized hotspots before incidents occur, cities save critical minutes when lives are on the line.</p>
          <p>However, the application of AI in public safety is also the site of intense ethical debate, particularly regarding <strong>predictive policing</strong>. Software designed to forecast crime hotspots often relies on historically biased arrest data, codifying and compounding systemic inequalities. When algorithms direct officers to patrol specific neighborhoods based on past arrest numbers, it creates a self-fulfilling loop: more patrols lead to more arrests, which the AI interprets as validation of its model.</p>
          <p>To realize the benefits of AI in public safety, cities must draw a hard line: using algorithms for logistics, resource allocation, and emergency response speed, while keeping human oversight and structural transparency at the center of law enforcement analytics.</p>
        </>
      ),
      widget: (
        <div className="widget-container">
          <div className="widget-title">
            <span>DISPATCH &amp; SECURITY CONTROLS</span>
            <span className="status" style={{ color: ethicalPolicing ? 'var(--cyan)' : 'var(--amber)', background: ethicalPolicing ? 'var(--cyan-bg)' : 'var(--amber-bg)', borderColor: ethicalPolicing ? 'var(--cyan)' : 'var(--amber)' }}>
              {ethicalPolicing ? 'Equitable Mode' : 'Logistics Only'}
            </span>
          </div>

          <div className="safety-widget-inner">
            <div className="traffic-stats-bar">
              <div className="stats-bar-header">
                <span>Avg Emergency Dispatch Delay</span>
                <span>{dispatchTime}m</span>
              </div>
              <div className="bar-outer">
                <div className="bar-inner" style={{ 
                  width: `${(dispatchTime / 8) * 100}%`,
                  background: ethicalPolicing ? 'linear-gradient(90deg, var(--cyan), var(--purple))' : 'linear-gradient(90deg, var(--amber), var(--red))'
                }}></div>
              </div>
            </div>

            <div className="safety-log">
              {safetyLogs.map((log, i) => (
                <div className="log-entry" key={i}>
                  <span className="time">[{log.time}]</span>
                  <span className="tag" style={{ color: log.type === 'warn' ? 'var(--amber)' : log.type === 'info' ? 'var(--cyan)' : 'var(--text-lo)' }}>
                    {log.tag}
                  </span>
                  <span className="event">{log.event}</span>
                </div>
              ))}
              <div ref={feedbackEndRef} />
            </div>

            <div className="toggle-switch-container">
              <div className="toggle-switch-lbl">
                <span className="main">Ethical Hotspot Allocation</span>
                <span className="sub">Prevent bias in spatial security patrol dispatches</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={ethicalPolicing} 
                  onChange={(e) => setEthicalPolicing(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      )
    },
    utilities: {
      tag: "Layer 03 // Infrastructure",
      title: "Smart Utilities & Grids",
      icon: "⚡",
      text: (
        <>
          <p>Behind the visible facade of the city lies its life support: water, waste, and electricity. Civic intelligence makes these invisible networks intelligent. <strong>Smart Grids</strong> utilize AI to balance fluctuating renewable energy sources like wind and solar against real-time residential demand, dynamically routing power and scheduling charging cycles to avoid catastrophic outages.</p>
          <p>In water management, up to 30% of treated municipal water is lost to underground leaks before it ever reaches a tap. AI models process acoustic data from pipe sensors, isolating the specific frequency of a high-pressure leak from standard urban noise. This allows utility teams to pinpoint and repair fractures before they cause major street sinkholes.</p>
          <p>Even waste management is optimized: IoT sensors in dumpsters alert collection routes when they are near capacity, eliminating empty-bin pick-ups, lowering city fuel budgets, and reducing overall urban noise pollution.</p>
        </>
      ),
      widget: (
        <div className="widget-container">
          <div className="widget-title">
            <span>GRID &amp; INFRASTRUCTURE PANEL</span>
            <span className="status">Grid Balance: Stable</span>
          </div>

          <div className="utility-grid-visuals">
            <div className="utility-sources">
              <div className="source-control">
                <div className="source-header">
                  <span className="label">Solar Feed</span>
                  <span className="val">{solarInput}%</span>
                </div>
                <input 
                  type="range" 
                  className="utility-slider" 
                  min="0" 
                  max="100" 
                  value={solarInput} 
                  onChange={handleSolarChange} 
                />
              </div>
              <div className="source-control">
                <div className="source-header">
                  <span className="label">Wind Feed</span>
                  <span className="val">{windInput}%</span>
                </div>
                <input 
                  type="range" 
                  className="utility-slider" 
                  min="0" 
                  max="100" 
                  value={windInput} 
                  onChange={handleWindChange} 
                />
              </div>
            </div>

            <div className="leak-detector-wave">
              <div className="wave-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Acoustic Leak Detection</span>
                <span style={{ color: leakStatus === 'detected' ? 'var(--cyan)' : leakStatus === 'scanning' ? 'var(--amber)' : 'var(--text-lo)' }}>
                  {leakStatus === 'detected' ? 'LEAK SPOTTED (SECTOR 9)' : leakStatus === 'scanning' ? 'ANALYZING...' : 'GRID IDLE'}
                </span>
              </div>
              <div className="wave-svg-container">
                <svg width="100%" height="100%" viewBox="0 0 300 40" preserveAspectRatio="none">
                  {leakStatus === 'scanning' ? (
                    <path 
                      className="wave-line"
                      d="M0,20 Q15,0 30,20 T60,20 T90,20 T120,20 T150,20 T180,20 T210,20 T240,20 T270,20 T300,20" 
                      fill="none" 
                      stroke="var(--amber)" 
                      strokeWidth="2"
                    />
                  ) : leakStatus === 'detected' ? (
                    <path 
                      d="M0,20 Q15,20 30,20 T60,20 T90,5 105,35 120,5 135,35 150,20 T180,20 T210,20 T240,20 T270,20 T300,20" 
                      fill="none" 
                      stroke="var(--cyan)" 
                      strokeWidth="2"
                    />
                  ) : (
                    <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                  )}
                </svg>
              </div>
              <button 
                className="widget-btn" 
                style={{ height: '30px', padding: '0 8px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={scanForLeaks}
                disabled={isScanningLeak}
              >
                {isScanningLeak ? "Scanning pipe acoustics..." : "Trigger Grid Leak Scan"}
              </button>
            </div>
          </div>
        </div>
      )
    },
    voice: {
      tag: "Layer 04 // Democratic Feedback",
      title: "Citizen Engagement",
      icon: "🗣️",
      text: (
        <>
          <p>Civic intelligence is a two-way street. AI bridges the gap between residents and city planners, transforming citizen engagement from bureaucratic frustration to active collaboration.</p>
          <p>Natural Language Processing (NLP) models power municipal conversational interfaces, allowing residents to report code violations, ask questions about public services, and navigate permits instantly. Behind the scenes, sentiment analysis engines process public consultation transcripts, forum posts, and policy feedback, mapping out community sentiment on major rezonings or municipal proposals. Instead of sorting through thousands of repetitive emails, city counselors receive structured, aggregated summaries of what their constituents actually care about.</p>
          <p>Furthermore, AI-driven participatory budgeting platforms help translate, categorize, and prioritize resident-submitted proposals, aligning municipal spending directly with the neighborhood's collective vote.</p>
        </>
      ),
      widget: (
        <div className="widget-container">
          <div className="widget-title">
            <span>RESIDENT POLICY FEEDBACK</span>
            <span className="status">AI Sentiment Analyzer</span>
          </div>

          <div className="voice-widget-inner">
            <div className="sentiment-analysis-board">
              <div className="sentiment-metrics">
                <div className="sentiment-stat pos">
                  <div className="lbl">Positive</div>
                  <div className="val">{sentimentStats.positive}</div>
                </div>
                <div className="sentiment-stat neu">
                  <div className="lbl">Neutral</div>
                  <div className="val">{sentimentStats.neutral}</div>
                </div>
                <div className="sentiment-stat neg">
                  <div className="lbl">Negative</div>
                  <div className="val">{sentimentStats.negative}</div>
                </div>
              </div>

              <div className="feedback-scroll">
                {feedbacks.map((f, i) => (
                  <div className="bubble-msg" key={i}>
                    <span className="text">"{f.text}"</span>
                    <span className={`sent-badge ${f.sentiment.substring(0, 3)}`}>
                      {f.sentiment.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={submitCivicVoice} className="input-post-row">
              <input 
                type="text" 
                className="voice-input"
                placeholder="Submit your civic proposal/issue..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" className="voice-send-btn">➔</button>
            </form>
          </div>
        </div>
      )
    }
  };

  const caseContent = {
    singapore: {
      title: "Singapore's Smart Nation Initiative",
      text: "Singapore stands as the pioneer of state-level digital twins. Through its 'Virtual Singapore' project—a dynamic, 3D replica of the entire island city-state—the government leverages AI simulation to model urban solutions before physical execution. Urban planners use Virtual Singapore to run simulations of wind flow to design naturally cooler public housing complexes, assess solar potential on building roofs, and analyze pedestrian evacuation paths in transit hubs during emergency events. AI also powers predictive maintenance, flagging structural issues in the state's massive public housing blocks, which house over 80% of Singapore's residents.",
      metrics: [
        { val: "100%", label: "3D semantic mapping of all building structures and urban typography." },
        { val: "80%+", label: "Of housing blocks optimized for energy capture and wind cooling." }
      ],
      schema: {
        sysName: "VIRTUAL_SINGAPORE_CORE",
        model: "3D_SEMAPHORE_TWIN_AI",
        stream: "WIND_THERMAL_FLOWS",
        efficiency: "88.4% SOLAR_CAPTURE_POTENTIAL",
        simulation: "98.6% SIMULATION_CONF"
      }
    },
    barcelona: {
      title: "Barcelona's Open-Source Sensor Network",
      text: "Barcelona approached the smart city from the bottom up. Implementing the 'Sentilo' open-source sensor platform and the digital democracy portal 'Decidim', Barcelona combined physical smart infrastructure with democratic digital sovereignty. The city's famous 'Superblocks' (Superilles)—neighborhoods closed off to through-traffic to prioritize pedestrians—are monitored by smart sensors measuring air quality, noise, and traffic. Additionally, smart trash compactors reduce vehicle runs, and adaptive streetlights dim during empty hours. Crucially, the Decidim platform has allowed over 100,000 citizens to directly write and vote on municipal budgets, proving that technology can empower citizens rather than simply monitor them.",
      metrics: [
        { val: "30%", label: "Reduction in street lighting energy costs through adaptive LED dimming." },
        { val: "20%", label: "Reduction in garbage truck mileage via smart routing sensors." }
      ],
      schema: {
        sysName: "SENTILO_PLATFORM_V4",
        model: "OPEN_SOURCE_MUNICIPAL",
        stream: "480 ACTIVE_NOISE_SENSORS",
        efficiency: "105,420 VALIDATED_DECIDIM_VOTERS",
        simulation: "9 ACTIVE_SUPERBLOCK_DEPLOYMENTS"
      }
    },
    seoul: {
      title: "Seoul's S-Dot IoT Network & Digital Mayor",
      text: "Seoul utilizes one of the most dense IoT sensor installations in the world, known as the 'S-Dot' network. Over 10,000 sensors collect environmental metrics including particulate matter, noise, wind speed, ultraviolet light, and pedestrian movement patterns. This data feeds directly into Seoul's 'Digital Mayor's Office', a massive real-time dashboard displaying traffic patterns, safety incidents, environmental status, and citizen feedback directly to decision-makers. AI vision models scan municipal CCTV feeds, detecting anomalies such as elderly falls, physical altercations, or fire hazards, reducing emergency dispatch dispatch times by 40%.",
      metrics: [
        { val: "10,000+", label: "S-Dot IoT nodes continuously measuring environmental signals." },
        { val: "40%", label: "Reduction in dispatch delays for CCTV-detected medical anomalies." }
      ],
      schema: {
        sysName: "SEOUL_S_DOT_DASHBOARD",
        model: "ONLINE_SCANNING_CCTV_VISION",
        stream: "10,240 ENV_SENSORS",
        efficiency: "1.6x FASTER_EMERGENCY_DISPATCH",
        simulation: "AUTO_MUNICIPAL_ADJUST_DUST_ALERTS"
      }
    }
  };

  const govLayerDetails = {
    1: {
      title: "Policy & Governance Layer // Human Oversight",
      text: "Every automated municipal dispatch or routing choice must be subject to clear rules defined by human civic planners. Algorithms do not define policy; they execute it. Helsinki and Amsterdam's Public AI Registries exemplify this, documenting the training data, logical limits, and human managers responsible for each municipal model."
    },
    2: {
      title: "Infrastructure Signal Layer // Algorithmic Transparency",
      text: "The algorithms operating traffic signals, power grids, and water pumps must be auditable and built on open standards. Utilizing proprietary black-box software from private contractors compromises public control over essential infrastructure. Code and system metrics must be transparent to ensure safety, auditability, and fairness."
    },
    3: {
      title: "Resident & Sensor Input Layer // Privacy First",
      text: "All physical sensors (IoT nodes, cameras, environmental monitors) must employ local processing (Edge AI) to strip personally identifiable information at the source. Video feeds should detect a pedestrian fall without ever uploading or saving the individual's face. Data must remain a public good, protected from monetization."
    }
  };

  return (
    <>
      {/* Background Floating Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="wrap">
        {/* Navigation */}
        <nav className="nav">
          <a href="#" className="nav-brand">
            <span className="nav-dot"></span>Civic Intelligence
          </a>
          <div className="nav-links">
            <a href="#intro">Introduction</a>
            <a href="#layers">Civic Layers</a>
            <a href="#deployments">Deployments</a>
            <a href="#challenges">Challenges</a>
            <a href="#governance">Governance</a>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="eyebrow">Spatial civic systems — 2026 concept</div>
        <h1 class="hero">The city, rendered<br />as <em>living intelligence</em>.</h1>
        <p className="sub">
          A spatial computing layer for urban governance — where mobility, safety, utilities, and citizen voice are no longer separate departments, but one continuous, ambient system you can see, question, and shape in real time.
        </p>

        {/* Live Metrics Strip (Hero Widget) */}
        <div className="system-monitor-hero">
          <div className="monitor-item">
            <div className="val">
              <span className="status-pulse"></span>
              {systemMetrics.unifiedSystems}
            </div>
            <div className="lbl">Unified Municipal Systems</div>
          </div>
          <div className="monitor-item">
            <div className="val">{systemMetrics.latency}ms</div>
            <div className="lbl">Sensor-To-Decision Latency</div>
          </div>
          <div className="monitor-item">
            <div className="val">{systemMetrics.humanReview}%</div>
            <div className="lbl">Decisions With Human Review</div>
          </div>
          <div className="monitor-item">
            <div className="val">0 / SECURE</div>
            <div className="lbl">Data Sold To Third Parties</div>
          </div>
        </div>

        <div className="cta-row">
          <a href="#intro" className="btn btn-primary">Read the Essay</a>
          <a href="#layers" className="btn btn-ghost">Explore Live Widgets</a>
        </div>

        {/* Introduction Panel */}
        <div className="section-header" id="intro">
          <div className="section-label">01 // Orientation</div>
          <h2 className="section-title">Introduction: The Ambient City</h2>
        </div>

        <div className="intro-panel">
          <div className="intro-grid">
            <div className="intro-text">
              <p>Imagine waking up in a city that breathes with you. The streetlights outside your window dimmed hours ago, responding to empty sidewalks, yet they flare to a warm brilliance as a late-shift nurse walks home. As you step onto the electric bus, it doesn’t follow a rigid, archaic timetable; its route was dynamically optimized ten minutes ago based on a sudden surge of commuters at the local plaza. Beneath the asphalt, acoustic sensors detect a microscopic fracture in a main water pipe, automatically dispatching a maintenance crew before a single drop is wasted.</p>
              <p>This is not science fiction; it is the manifestation of the ambient city—an urban environment powered by <strong>Civic Intelligence</strong>. Civic intelligence represents the collective capacity of a city to sense, process, learn, and act on information to improve the shared well-being of its residents. Rather than viewing urban governance as a series of isolated bureaucratic silos, civic intelligence integrates human participation, IoT sensor networks, and artificial intelligence into a singular, responsive feedback loop.</p>
              <p>In modern urban planning, AI acts as the connective tissue of this system. By digesting millions of data points from disparate networks, AI transitions city halls from reactive fire-fighting to proactive stewardship, fundamentally redefining how cities are governed, maintained, and experienced.</p>
            </div>
            <div className="intro-quote">
              <blockquote>
                "Civic intelligence is not about replacing municipal leadership with algorithms. It is about creating an ambient infrastructure that makes the city's collective needs legible, and its responses equitable."
              </blockquote>
              <cite>Spatial Systems Registry</cite>
            </div>
          </div>
        </div>

        {/* Interactive 3D Windows (Layers Preview) */}
        <div className="section-header" id="layers">
          <div className="section-label">02 // Systems Architecture</div>
          <h2 className="section-title">Four Civic Layers, One Field of View</h2>
        </div>

        <p style={{ color: 'var(--text-mid)', marginBottom: '32px', maxWidth: '600px', fontSize: '15px' }}>
          Select a civic layer window below to explore its systems architecture and run its live interactive simulation dashboard.
        </p>

        <div className="windows">
          <div 
            className={`window ${activeLayer === 'mobility' ? 'active' : ''}`}
            onClick={() => setActiveLayer('mobility')}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="window-top">
              <div className="window-icon">🚦</div>
              <h3>Mobility</h3>
              <p>Adaptive signal timing and dynamic transit routing that adjust to real-time congestion, not fixed schedules.</p>
            </div>
            <div className="window-metric"><span>▲</span> 23% less commute delay</div>
          </div>

          <div 
            className={`window ${activeLayer === 'safety' ? 'active' : ''}`}
            onClick={() => setActiveLayer('safety')}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="window-top">
              <div className="window-icon">🛡️</div>
              <h3>Public safety</h3>
              <p>Emergency response routed by live risk mapping, prioritizing transparency and human oversight on dispatches.</p>
            </div>
            <div className="window-metric"><span>▲</span> 1.4 min faster response</div>
          </div>

          <div 
            className={`window ${activeLayer === 'utilities' ? 'active' : ''}`}
            onClick={() => setActiveLayer('utilities')}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="window-top">
              <div className="window-icon">⚡</div>
              <h3>Utilities</h3>
              <p>Smart grids and water systems that predict structural strain and leaks before they cause outages.</p>
            </div>
            <div className="window-metric"><span>▲</span> 17% fewer grid outages</div>
          </div>

          <div 
            className={`window ${activeLayer === 'voice' ? 'active' : ''}`}
            onClick={() => setActiveLayer('voice')}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="window-top">
              <div className="window-icon">🗣️</div>
              <h3>Civic voice</h3>
              <p>Resident input synthesized into policy signal, ensuring community feedback is prioritized, not buried.</p>
            </div>
            <div className="window-metric"><span>▲</span> 3.2x more residents heard</div>
          </div>
        </div>

        {/* Deep Dive & Simulation Panel */}
        <div className="dashboard-display">
          <div className="body-section">
            <div className="body-meta">
              <span className="body-icon">{layerContent[activeLayer].icon}</span>
              <span className="body-tag">{layerContent[activeLayer].tag}</span>
              <h3>{layerContent[activeLayer].title}</h3>
              <div className="body-content">
                {layerContent[activeLayer].text}
              </div>
            </div>
            <div>
              {layerContent[activeLayer].widget}
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="stats">
          <div className="stat"><div className="num">23%</div><div className="label">Commute Delay Cut</div></div>
          <div className="stat"><div className="num">1.4m</div><div className="label">Faster Emergency Dispatch</div></div>
          <div className="stat"><div className="num">17%</div><div className="label">Outages Avoided</div></div>
          <div className="stat"><div className="num">3.2x</div><div className="label">Citizen Engagement Boost</div></div>
        </div>

        {/* Real-World Case Studies */}
        <div className="section-header" id="deployments">
          <div className="section-label">03 // Field Deployments</div>
          <h2 class="section-title">Real-World Case Studies</h2>
        </div>

        <div className="cases-panel">
          <div className="cases-tabs">
            <button 
              className={`tab-btn ${activeCase === 'singapore' ? 'active' : ''}`}
              onClick={() => setActiveCase('singapore')}
            >
              Singapore (Smart Nation)
            </button>
            <button 
              className={`tab-btn ${activeCase === 'barcelona' ? 'active' : ''}`}
              onClick={() => setActiveCase('barcelona')}
            >
              Barcelona (Sentilo &amp; Superblocks)
            </button>
            <button 
              className={`tab-btn ${activeCase === 'seoul' ? 'active' : ''}`}
              onClick={() => setActiveCase('seoul')}
            >
              Seoul (Smart Seoul &amp; S-Dot)
            </button>
          </div>

          <div className="case-content active">
            <div className="case-info">
              <h3>{caseContent[activeCase].title}</h3>
              <p>{caseContent[activeCase].text}</p>
              <div className="case-metrics">
                {caseContent[activeCase].metrics.map((metric, idx) => (
                  <div className="case-metric-card" key={idx}>
                    <div className="num">{metric.val}</div>
                    <div className="label">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="case-visual">
              <div className="case-visual-schema">
                <div className="schema-line">
                  <span>SYSTEM_NAME</span>
                  <span>{caseContent[activeCase].schema.sysName}</span>
                </div>
                <div className="schema-line">
                  <span>MODEL_TYPE</span>
                  <span>{caseContent[activeCase].schema.model}</span>
                </div>
                <div className="schema-line">
                  <span>ACTIVE_STREAM</span>
                  <span>{caseContent[activeCase].schema.stream}</span>
                </div>
                <div className="schema-line">
                  <span>SYSTEM_EFFICIENCY</span>
                  <span>{caseContent[activeCase].schema.efficiency}</span>
                </div>
                <div className="schema-line">
                  <span>SIMULATION_CONF</span>
                  <span>{caseContent[activeCase].schema.simulation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges & Criticisms */}
        <div className="section-header" id="challenges">
          <div className="section-label">04 // Risk Analysis</div>
          <h2 class="section-title">The Shadows in the Smart City</h2>
        </div>

        <div className="challenges-panel">
          <p className="sub">
            Building a responsive city requires immense volumes of data. If implemented without boundaries, civic intelligence risks shifting from public empowerment to automated surveillance.
          </p>

          <div className="challenges-grid">
            <div className="challenge-card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
              <div className="challenge-header">
                <span className="icon">🔒</span>
                <h4>Data Privacy &amp; Consent</h4>
              </div>
              <p>When public squares, streetlights, and parks are embedded with sensors and cameras, consent becomes impossible. Citizens are monitored simply by existing in public spaces. Without strict regulations, this data risks being commercialized or compiled into pervasive profiles by private vendors contracted to build the city's infrastructure.</p>
            </div>

            <div className="challenge-card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
              <div className="challenge-header">
                <span className="icon">⚖️</span>
                <h4>Algorithmic Bias</h4>
              </div>
              <p>AI models are trained on historical data, which inevitably reflects past systemic biases. Whether in facial recognition accuracy discrepancies among minority groups, or allocation models that favor wealthy neighborhoods with higher reporting frequencies, biased inputs codify and accelerate structural inequalities.</p>
            </div>

            <div className="challenge-card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
              <div className="challenge-header">
                <span className="icon">📱</span>
                <h4>The Digital Divide</h4>
              </div>
              <p>Relying heavily on digital feedback tools and app-based incident reporting can exclude significant portions of the population. The elderly, unhoused, and low-income individuals who lack digital literacy or smartphone access risk having their needs ignored, effectively erasing them from the city's optimization models.</p>
            </div>

            <div className="challenge-card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
              <div className="challenge-header">
                <span className="icon">🤖</span>
                <h4>Automation Over-reliance</h4>
              </div>
              <p>Treating highly complex social, economic, and political issues as basic mathematical optimization puzzles is a fundamental category error. AI can tell you where a pothole is, but it cannot decide how a city should invest in long-term social mobility, nor should it replace democratic deliberation with statistical utility.</p>
            </div>
          </div>
        </div>

        {/* The Path Forward: Layered Governance */}
        <div className="section-header" id="governance">
          <div className="section-label">05 // Ethical Framework</div>
          <h2 class="section-title">The Path Forward: Human-Centered AI Governance</h2>
        </div>

        <div className="depth-panel">
          <div className="depth-grid">
            <div>
              <h2>Responsible, Layered Governance</h2>
              <p>To prevent smart cities from becoming panopticons, urban AI must adopt a layered, transparent structure. Every decision layer of the city—from environmental sensors up to administrative policy—should remain auditable by the citizens it serves.</p>
              <p>We propose a three-tiered governance framework that prioritizes human agency over absolute automation. Click on the spatial stack to explore each critical layer of responsible city management.</p>
              
              <div className="layer-details-display">
                <h4>{govLayerDetails[activeGovLayer].title}</h4>
                <p>{govLayerDetails[activeGovLayer].text}</p>
              </div>
            </div>

            <div className="layer-stack stacked">
              <div 
                className={`layer layer-1`} 
                style={{ 
                  borderColor: activeGovLayer === 1 ? 'var(--cyan)' : 'var(--glass-border)',
                  boxShadow: activeGovLayer === 1 ? '0 0 20px rgba(88, 214, 255, 0.3)' : '0 20px 40px -14px rgba(0,0,0,0.5)'
                }}
                onClick={() => setActiveGovLayer(1)}
              >
                <span><span className="dot" style={{ background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }}></span> Policy &amp; Governance Layer</span>
                <span>human oversight</span>
              </div>
              
              <div 
                className={`layer layer-2`}
                style={{ 
                  borderColor: activeGovLayer === 2 ? 'var(--amber)' : 'var(--glass-border)',
                  boxShadow: activeGovLayer === 2 ? '0 0 20px rgba(255, 183, 101, 0.3)' : '0 20px 40px -14px rgba(0,0,0,0.5)'
                }}
                onClick={() => setActiveGovLayer(2)}
              >
                <span><span className="dot" style={{ background: 'var(--amber)', boxShadow: '0 0 8px var(--amber)' }}></span> Infrastructure Signal Layer</span>
                <span>transparency</span>
              </div>

              <div 
                className={`layer layer-3`}
                style={{ 
                  borderColor: activeGovLayer === 3 ? '#ffffff' : 'var(--glass-border)',
                  boxShadow: activeGovLayer === 3 ? '0 0 20px rgba(255, 255, 255, 0.2)' : '0 20px 40px -14px rgba(0,0,0,0.5)'
                }}
                onClick={() => setActiveGovLayer(3)}
              >
                <span><span className="dot" style={{ background: '#ffffff', boxShadow: '0 0 8px #ffffff' }}></span> Resident &amp; Sensor Input Layer</span>
                <span>privacy first</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion Panel */}
        <div className="section-header">
          <div className="section-label">06 // Synthesis</div>
          <h2 class="section-title">Conclusion: Smarter vs. More Efficient</h2>
        </div>

        <div className="conclusion-panel">
          <div className="conclusion-content">
            <p>As we stand at the precipice of spatial and ambient computing, a critical question emerges: <strong>Does artificial intelligence make cities smarter, or does it simply make them more efficient?</strong></p>
            <p>The distinction is profound. Efficiency is transactional; it is about optimizing resource usage—reducing bus delays, lowering electricity bills, routing sanitation trucks via the shortest paths. Efficiency asks: <em>"How do we do this faster and cheaper?"</em></p>
            <p className="emphasis">Intelligence, however, is relational and ethical. It is the capacity to ask: <em>"Are we doing the right thing in the first place?"</em> It involves prioritizing equity over speed, ensuring that marginalized voices are heard, and remembering that a city is not a machine to be optimized, but a community of human beings to be supported.</p>
            <p>If AI is deployed purely to maximize speed and minimize municipal costs, it will result in cold, hyper-monitored environments that treat citizens as variables. But if AI is harnessed as a tool for <strong>Civic Intelligence</strong>—rooted in open data registers, robust human-in-the-loop oversight, and inclusive digital democratic models—it can help build cities that are not just highly efficient, but deeply humane, resilient, and truly smart.</p>
            
            {/* Reflective interactive toggle */}
            <div className="conclusion-interactive">
              <p>Reflect on your city's governance model:</p>
              <div className="toggle-btn-group">
                <button 
                  className={`toggle-option ${reflectionFocus === 'efficient' ? 'active' : ''}`}
                  onClick={() => setReflectionFocus('efficient')}
                >
                  Focus on Efficiency
                </button>
                <button 
                  className={`toggle-option ${reflectionFocus === 'smart' ? 'active' : ''}`}
                  onClick={() => setReflectionFocus('smart')}
                >
                  Focus on Intelligence
                </button>
              </div>
              <div className="toggle-result">
                {reflectionFocus === 'efficient' ? (
                  <span style={{ color: 'var(--amber)' }}>
                    <strong>Priority:</strong> Maximize speed, cost-reductions, and algorithmic optimization. <br />
                    <strong>Risk:</strong> Risk of surveillance states, digital exclusion, and treating citizens as numbers.
                  </span>
                ) : (
                  <span style={{ color: 'var(--cyan)' }}>
                    <strong>Priority:</strong> Maximize public equity, digital rights, and democratic voice. <br />
                    <strong>Reward:</strong> Authentic civic intelligence, resilient infrastructure, and inclusive governance.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer>
          civic intelligence — a spatial systems concept for human-centered urban governance // 2026
        </footer>
      </div>
    </>
  );
}
