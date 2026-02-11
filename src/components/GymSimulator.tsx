"use client";

import { useState, useEffect, useCallback } from "react";

const DEFAULT_PERSONAS = [
  { id: 1, name: "Marcus (USA)", age: 28, type: "hardcore", emoji: "💪", color: "#E74C3C", traits: "American bodybuilder, goes to gym 6 days/week. OBSESSED with macros - needs exact protein grams per serving. Compares everything to Optimum Nutrition Gold Standard. Will only buy if protein content is 25g+ per serving and price is under $1.50/serving. Skeptical of 'pharmaceutical grade' marketing.", speed: 0.4, size: 42 },
  { id: 2, name: "Sofia (Brazil)", age: 32, type: "wellness", emoji: "🧘‍♀️", color: "#9B59B6", traits: "Brazilian yoga instructor and wellness influencer with 50K followers. EXTREMELY picky about artificial ingredients - refuses anything with sucralose or aspartame. Values organic, plant-based options. Will buy ONLY if package is Instagram-worthy and ingredients are 100% natural. Willing to pay premium for clean label.", speed: 0.3, size: 38 },
  { id: 3, name: "Hiroshi (Japan)", age: 45, type: "businessman", emoji: "💼", color: "#3498DB", traits: "Japanese salaryman, overworked, stress eating problem. Doctor warned about diabetes risk. ZERO fitness knowledge - intimidated by gym culture. Needs foolproof instructions in Japanese. Will trust pharmaceutical brands over sports brands. Wants something that doesn't taste like medicine. Price is secondary to convenience.", speed: 0.35, size: 44 },
  { id: 4, name: "Elena (Russia)", age: 25, type: "fitness", emoji: "🏋️‍♀️", color: "#E91E63", traits: "Russian fitness model and TikTok creator (200K followers). Posts daily workout content. OBSESSED with aesthetics - product must photograph well. Compares protein to European luxury brands. Will promote products that sponsor her. Skeptical of Asian brands unless they have premium positioning. Needs 'clean' formula for her lean bulk phase.", speed: 0.45, size: 36 },
  { id: 5, name: "Rajesh (India)", age: 52, type: "senior", emoji: "🚶", color: "#27AE60", traits: "Indian IT professional, sedentary lifestyle led to muscle loss (sarcopenia). Doctor recommended protein supplementation. VERY price-conscious - converts everything to rupees. Vegetarian, needs clarity on protein source. Trusts pharmaceutical companies more than supplement brands. Concerned about kidney health. Needs small serving sizes.", speed: 0.2, size: 40 },
  { id: 6, name: "Carlos (Mexico)", age: 19, type: "student", emoji: "⚡", color: "#F39C12", traits: "Mexican college soccer player on tight budget. Shares protein tub with 3 roommates. CANNOT afford premium brands - buys whatever is cheapest per serving. Taste is CRITICAL (won't finish bad-tasting protein). Influenced by teammates' recommendations. Doesn't read labels carefully. Will buy if friends approve and price is right.", speed: 0.5, size: 34 },
  { id: 7, name: "Amina (UAE)", age: 30, type: "mama", emoji: "👶", color: "#1ABC9C", traits: "Emirati new mother, postpartum recovery focus. EXTREMELY cautious about ingredients due to breastfeeding. Reads every ingredient. Will Google anything unfamiliar. Prefers products certified halal. Willing to pay premium for safety-tested, pharmaceutical-grade products. Needs single-hand preparation (baby in other arm). Values small packaging.", speed: 0.25, size: 38 },
  { id: 8, name: "Johan (Germany)", age: 23, type: "muscle", emoji: "🦾", color: "#8E44AD", traits: "German engineering student and amateur bodybuilder. EXTREMELY analytical - compares amino acid profiles of 10+ brands before buying. Imports US/European protein usually. Skeptical of Japanese brands (assumes lower protein content). Will ONLY buy if BCAA ratio is optimal (2:1:1) and leucine content is high. Needs scientific studies backing claims.", speed: 0.42, size: 40 },
];

const EMOJI_OPTIONS = ["💪","🧘‍♀️","🏃","🏋️‍♀️","🚶","⚡","👶","🦾","👩","👨","🧑","👴","👵","🤸","🚴","🏊","🧗","💃","🕺","🤾","👩‍💼","👨‍💼","👩‍🎓","👨‍🎓","🧑‍⚕️","👷"];
const COLOR_OPTIONS = ["#E74C3C","#9B59B6","#3498DB","#E91E63","#27AE60","#F39C12","#1ABC9C","#8E44AD","#2C3E50","#D35400","#16A085","#C0392B","#7F8C8D","#2980B9"];

// API-based reaction generation
const generateReactionAPI = async (persona: any, concept: string) => {
  try {
    const response = await fetch("/api/generate-reaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona, concept }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    return { text: data.text, sentiment: data.sentiment };
  } catch (error) {
    console.error("Failed to generate AI reaction:", error);
    // Fallback to simple reaction
    return {
      text: `"${concept}"... 興味深いですね。`,
      sentiment: "🤔 Considering",
    };
  }
};

// ─── Persona Editor Modal ───
const PersonaEditor = ({ persona, onSave, onCancel, onDelete, isNew }: any) => {
  const [form, setForm] = useState({ name: persona?.name || "", age: persona?.age || 30, emoji: persona?.emoji || "👩", color: persona?.color || "#3498DB", traits: persona?.traits || "", type: persona?.type || "custom" });
  const u = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  const lbl = { fontSize: "10px", fontWeight: 700, color: "#999", letterSpacing: "0.08em", display: "block", marginBottom: "6px", fontFamily: "'Noto Sans JP', sans-serif" };
  const inp = { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "white", padding: "10px 12px", fontSize: "13px", fontFamily: "'Noto Sans JP', sans-serif", boxSizing: "border-box" as const };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }}>
      <div style={{ background: "#1a1a2e", borderRadius: "20px", padding: "28px", width: "420px", maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "white", fontFamily: "'Noto Sans JP', sans-serif" }}>{isNew ? "✨ Create New Persona" : "✏️ Edit Persona"}</h2>
          <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "8px", color: "#888", padding: "6px 10px", cursor: "pointer", fontSize: "14px" }}>✕</button>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={lbl}>Icon</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>{EMOJI_OPTIONS.map(e => (<button key={e} onClick={() => u("emoji", e)} style={{ fontSize: "22px", padding: "6px", borderRadius: "8px", cursor: "pointer", background: form.emoji === e ? form.color + "33" : "rgba(255,255,255,0.05)", border: form.emoji === e ? "2px solid " + form.color : "2px solid transparent" }}>{e}</button>))}</div>
        </div>
        <div style={{ marginBottom: "14px" }}><label style={lbl}>Name (e.g. Hardcore Gym Bro・Takeshi)</label><input value={form.name} onChange={e => u("name", e.target.value)} placeholder="Enter persona name" style={inp} /></div>
        <div style={{ marginBottom: "14px" }}><label style={lbl}>Age</label><div style={{ display: "flex", alignItems: "center", gap: "12px" }}><input type="range" min={10} max={80} value={form.age} onChange={e => u("age", parseInt(e.target.value))} style={{ flex: 1, accentColor: form.color }} /><span style={{ color: "white", fontSize: "18px", fontWeight: 800, minWidth: "40px", textAlign: "center" }}>{form.age}</span></div></div>
        <div style={{ marginBottom: "14px" }}><label style={lbl}>Type Tag (for analytics)</label><input value={form.type} onChange={e => u("type", e.target.value)} placeholder="e.g. hardcore, wellness, diet" style={inp} /></div>
        <div style={{ marginBottom: "14px" }}><label style={lbl}>Theme Color</label><div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>{COLOR_OPTIONS.map(c => (<button key={c} onClick={() => u("color", c)} style={{ width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", background: c, border: form.color === c ? "3px solid white" : "3px solid transparent", boxShadow: form.color === c ? "0 0 12px " + c + "66" : "none" }} />))}</div></div>
        <div style={{ marginBottom: "20px" }}>
          <label style={lbl}>Traits & Values (drives reaction generation)</label>
          <textarea value={form.traits} onChange={e => u("traits", e.target.value)} placeholder="e.g. Goes to the gym 5x/week. Obsessed with protein content. Prioritizes cost performance. Checks SNS reviews." rows={4} style={{ ...inp, height: "auto", resize: "vertical" as const, lineHeight: 1.6 }} />
          <div style={{ fontSize: "9px", color: "#555", marginTop: "4px", fontFamily: "'Noto Sans JP', sans-serif" }}>💡 Keywords like ingredient, taste, price, beauty, SNS, health, safety will unlock more reaction variations</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "12px", marginBottom: "20px", borderLeft: "4px solid " + form.color }}>
          <div style={{ fontSize: "9px", color: "#666", marginBottom: "6px", letterSpacing: "0.1em", fontWeight: 700 }}>PREVIEW</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "32px" }}>{form.emoji}</span>
            <div><div style={{ fontSize: "13px", fontWeight: 800, color: form.color, fontFamily: "'Noto Sans JP', sans-serif" }}>{form.name || "Unnamed"}</div><div style={{ fontSize: "10px", color: "#888" }}>Age {form.age} ・ {form.type}</div></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {!isNew && <button onClick={() => onDelete(persona.id)} style={{ background: "rgba(231,76,60,0.15)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "10px", color: "#E74C3C", padding: "10px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}>🗑️ Delete</button>}
          <div style={{ flex: 1 }} />
          <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#888", padding: "10px 20px", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
          <button onClick={() => { if (!form.name.trim() || !form.traits.trim()) return; onSave({ ...persona, ...form, speed: persona?.speed || (0.25 + Math.random() * 0.25), size: persona?.size || (34 + Math.floor(Math.random() * 10)) }); }} style={{ background: "linear-gradient(135deg, #FF6B35, #FF3366)", border: "none", borderRadius: "10px", color: "white", padding: "10px 24px", fontSize: "12px", fontWeight: 800, cursor: "pointer", opacity: (!form.name.trim() || !form.traits.trim()) ? 0.4 : 1 }}>{isNew ? "✨ Add" : "💾 Save"}</button>
        </div>
      </div>
    </div>
  );
};

// ─── Sub Components ───
const GymPerson = ({ person, onClick, isReacting }: any) => (
  <div style={{ position: "absolute", left: person.x + "%", top: person.y + "%", transform: "scaleX(" + (person.direction > 0 ? 1 : -1) + ")", transition: "left 0.5s linear, top 0.5s linear", cursor: "pointer", zIndex: person.y > 50 ? 20 : 10, filter: isReacting ? "drop-shadow(0 0 12px " + person.color + ")" : "none" }} onClick={() => onClick(person)} title={person.name}>
    <div style={{ fontSize: person.size + "px", animation: isReacting ? "bounce 0.6s ease infinite" : "walk 0.8s ease-in-out infinite", userSelect: "none" }}>{person.emoji}</div>
    <div style={{ fontSize: "9px", textAlign: "center", color: person.color, fontWeight: 700, textShadow: "0 1px 2px rgba(0,0,0,0.8)", whiteSpace: "nowrap", marginTop: "-4px" }}>{person.name.includes("・") ? person.name.split("・")[1] : person.name.slice(0, 6)}</div>
  </div>
);

const SpeechBubble = ({ reaction, persona, index }: any) => {
  const pos = [{ top: "5%", left: "5%" }, { top: "5%", right: "5%" }, { top: "30%", left: "3%" }, { top: "30%", right: "3%" }, { top: "55%", left: "5%" }, { top: "55%", right: "5%" }, { bottom: "15%", left: "5%" }, { bottom: "15%", right: "5%" }][index % 8];
  return (
    <div style={{ position: "absolute", ...pos, maxWidth: "280px", background: "rgba(255,255,255,0.97)", borderRadius: "16px", padding: "12px 16px", boxShadow: "0 4px 24px rgba(0,0,0,0.15)", zIndex: 100 + index, animation: "fadeSlideIn 0.5s ease " + (index * 0.15) + "s both", borderLeft: "4px solid " + persona.color }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
        <span style={{ fontSize: "18px" }}>{persona.emoji}</span>
        <span style={{ fontSize: "11px", fontWeight: 800, color: persona.color, fontFamily: "'Noto Sans JP', sans-serif" }}>{persona.name}</span>
        <span style={{ fontSize: "9px", color: "#888", marginLeft: "auto" }}>Age {persona.age}</span>
      </div>
      <div style={{ fontSize: "13px", lineHeight: 1.5, color: "#1a1a1a", fontFamily: "'Noto Sans JP', sans-serif" }}>"{reaction.text}"</div>
      <div style={{ marginTop: "6px", fontSize: "10px", color: "#666", display: "flex", justifyContent: "space-between" }}>
        <span>{reaction.sentiment}</span>
        <span style={{ background: persona.color + "22", color: persona.color, padding: "2px 8px", borderRadius: "10px", fontWeight: 700, fontSize: "9px" }}>{persona.type.toUpperCase()}</span>
      </div>
    </div>
  );
};

const GymEquipment = () => (
  <>
    <div style={{ position: "absolute", left: "8%", top: "20%", fontSize: "28px", opacity: 0.6 }}>🏃‍♂️</div>
    <div style={{ position: "absolute", left: "16%", top: "20%", fontSize: "28px", opacity: 0.5 }}>🏃‍♀️</div>
    <div style={{ position: "absolute", right: "10%", top: "22%", fontSize: "26px", opacity: 0.5 }}>🏋️</div>
    <div style={{ position: "absolute", right: "18%", top: "24%", fontSize: "22px", opacity: 0.4 }}>🏋️‍♀️</div>
    <div style={{ position: "absolute", left: "25%", bottom: "20%", fontSize: "20px", opacity: 0.4 }}>💺</div>
    <div style={{ position: "absolute", right: "25%", bottom: "22%", fontSize: "20px", opacity: 0.4 }}>💺</div>
    <div style={{ position: "absolute", left: "5%", top: "60%", fontSize: "22px", opacity: 0.5 }}>🚰</div>
    <div style={{ position: "absolute", top: "4%", left: "42%", color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "0.3em", fontWeight: 300 }}>FITNESS GYM</div>
  </>
);

const AnalyticsPanel = ({ reactions }: any) => {
  if (!reactions.length) return null;
  const sc: any = {}; const tc: any = {};
  reactions.forEach((r: any) => { sc[r.sentiment] = (sc[r.sentiment] || 0) + 1; tc[r.persona.type] = (tc[r.persona.type] || 0) + 1; });
  const ir = reactions.filter((r: any) => r.sentiment.includes("Interest") || r.sentiment.includes("Positive") || r.sentiment.includes("Curious")).length / reactions.length * 100;
  return (
    <div style={{ background: "rgba(15,15,25,0.95)", borderRadius: "12px", padding: "16px", border: "1px solid rgba(255,255,255,0.1)", marginTop: "12px" }}>
      <div style={{ fontSize: "11px", fontWeight: 800, color: "#FF6B35", marginBottom: "10px", letterSpacing: "0.1em" }}>📊 REAL-TIME ANALYTICS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[{ v: reactions.length, l: "Total Reactions", c: "#FF6B35" }, { v: ir.toFixed(0) + "%", l: "Interest Rate", c: "#3498DB" }, { v: Object.keys(tc).length, l: "Persona Types", c: "#27AE60" }].map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
            <div style={{ fontSize: "22px", fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: "9px", color: "#888" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        {Object.entries(sc).map(([s, n]: any) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "#ccc", marginBottom: "3px" }}>
            <span style={{ minWidth: "100px" }}>{s}</span>
            <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ width: (n / reactions.length * 100) + "%", height: "100%", background: "linear-gradient(90deg, #FF6B35, #FF3366)", borderRadius: "2px" }} />
            </div>
            <span style={{ fontSize: "9px", color: "#666" }}>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
export default function GymSimulator() {
  const [personas, setPersonas] = useState(DEFAULT_PERSONAS);
  const [concept, setConcept] = useState("");
  const [activeConcept, setActiveConcept] = useState("");
  const [people, setPeople] = useState<any[]>([]);
  const [visibleReactions, setVisibleReactions] = useState<any[]>([]);
  const [allReactions, setAllReactions] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [reactingIds, setReactingIds] = useState(new Set());
  const [editingPersona, setEditingPersona] = useState<any>(null);
  const [isNewPersona, setIsNewPersona] = useState(false);
  const [sideTab, setSideTab] = useState("control");

  useEffect(() => {
    setPeople(personas.map(p => ({ ...p, x: 10 + Math.random() * 80, y: 15 + Math.random() * 65, direction: Math.random() > 0.5 ? 1 : -1 })));
  }, [personas]);

  useEffect(() => {
    const id = setInterval(() => {
      setPeople(prev => prev.map(p => {
        let nx = p.x + p.direction * p.speed;
        let ny = p.y + Math.sin(Date.now() / 2000 + p.id) * 0.1;
        let nd = p.direction;
        if (nx > 90 || nx < 5) { nd = -nd; nx = Math.max(5, Math.min(90, nx)); }
        ny = Math.max(15, Math.min(80, ny));
        if (Math.random() < 0.005) nd = -nd;
        return { ...p, x: nx, y: ny, direction: nd };
      }));
    }, 50);
    return () => clearInterval(id);
  }, []);

  const handleSave = (updated: any) => {
    if (isNewPersona) {
      const newId = Math.max(0, ...personas.map(p => p.id)) + 1;
      setPersonas(prev => [...prev, { ...updated, id: newId }]);
    } else {
      setPersonas(prev => prev.map(p => p.id === updated.id ? updated : p));
    }
    setEditingPersona(null); setIsNewPersona(false);
  };

  const handleDelete = (id: number) => { setPersonas(prev => prev.filter(p => p.id !== id)); setEditingPersona(null); };

  const triggerReaction = useCallback(async (persona: any) => {
    setReactingIds(prev => new Set([...prev, persona.id]));

    const reaction = await generateReactionAPI(persona, activeConcept || concept || "New Protein Product");
    const r = { text: reaction.text, sentiment: reaction.sentiment, persona, timestamp: Date.now() };

    setVisibleReactions(prev => [...prev.slice(-5), r]);
    setAllReactions(prev => [...prev, r]);
    setTimeout(() => setReactingIds(prev => { const n = new Set(prev); n.delete(persona.id); return n; }), 3000);
  }, [activeConcept, concept]);

  const startSim = useCallback(async () => {
    if (!concept.trim()) return;
    setActiveConcept(concept);
    setIsSimulating(true);
    setVisibleReactions([]);
    setReactingIds(new Set());

    const shuffled = [...personas].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffled.length; i++) {
      const p = shuffled[i];
      await new Promise((resolve) => setTimeout(resolve, i * 800));

      setReactingIds(prev => new Set([...prev, p.id]));

      const reaction = await generateReactionAPI(p, concept);
      const r = { text: reaction.text, sentiment: reaction.sentiment, persona: p, timestamp: Date.now() };

      setVisibleReactions(prev => [...prev.slice(-5), r]);
      setAllReactions(prev => [...prev, r]);

      setTimeout(() => setReactingIds(prev => {
        const n = new Set(prev);
        n.delete(p.id);
        return n;
      }), 4000);
    }

    setTimeout(() => setIsSimulating(false), 2000);
  }, [concept, personas]);

  const clearAll = () => { setVisibleReactions([]); setAllReactions([]); setReactingIds(new Set()); setActiveConcept(""); setIsSimulating(false); };

  const presets = ["Pharma-Grade Protein, Backed by Science", "Feel the Difference — Proven by Research", "Your Daily Beauty Starts with Protein", "Post-Workout Reward Protein"];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", fontFamily: "'Noto Sans JP', sans-serif", color: "white", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;800;900&display=swap');
        @keyframes walk{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes bounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-8px) scale(1.1)}}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes glow{0%,100%{box-shadow:0 8px 32px rgba(255,107,53,0.4),0 0 60px rgba(255,51,102,0.2)}50%{box-shadow:0 8px 48px rgba(255,107,53,0.6),0 0 80px rgba(255,51,102,0.35)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        textarea:focus,input:focus{outline:none}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
      `}</style>

      {/* Header */}
      <div style={{ padding: "16px 24px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,20,0.95)", position: "relative", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2px" }}>
            <div style={{ background: "linear-gradient(135deg, #FF6B35, #FF3366)", borderRadius: "8px", padding: "5px 12px", fontSize: "11px", fontWeight: 800 }}>🧪 TAISHO LAB</div>
            <div style={{ fontSize: "9px", color: "#666", letterSpacing: "0.15em" }}>Virtual Test Marketing Simulator</div>
          </div>
          <h1 style={{ fontSize: "16px", fontWeight: 900, margin: "4px 0 0", background: "linear-gradient(135deg, #fff, #aaa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Fitness Gym — In-Store Simulator</h1>
        </div>
        <div style={{ fontSize: "10px", color: "#555" }}>👥 {personas.length} Personas</div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 76px)" }}>
        {/* Gym View */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(40,40,60,0.8) 0%, rgba(10,10,20,1) 70%), repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px)" }} />
          <div style={{ position: "absolute", top: "12%", left: "8%", color: "rgba(255,255,255,0.15)", fontSize: "9px", letterSpacing: "0.2em", fontWeight: 700 }}>CARDIO ZONE</div>
          <div style={{ position: "absolute", top: "12%", right: "8%", color: "rgba(255,255,255,0.15)", fontSize: "9px", letterSpacing: "0.2em", fontWeight: 700 }}>FREE WEIGHT</div>
          <div style={{ position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.15)", fontSize: "9px", letterSpacing: "0.2em", fontWeight: 700 }}>RECEPTION ▸ EXIT</div>
          <GymEquipment />
          {/* Product Display */}
          <div style={{ position: "absolute", left: "50%", top: "52%", transform: "translate(-50%, -50%)", zIndex: 30, textAlign: "center" }}>
            <div style={{ background: activeConcept ? "linear-gradient(135deg, #FF6B35, #FF3366)" : "linear-gradient(135deg, #555, #333)", borderRadius: "16px", padding: "16px 28px", boxShadow: activeConcept ? "0 8px 32px rgba(255,107,53,0.4), 0 0 60px rgba(255,51,102,0.2)" : "0 4px 16px rgba(0,0,0,0.3)", border: "2px solid rgba(255,255,255,0.2)", transition: "all 0.5s ease", animation: activeConcept ? "glow 2s ease-in-out infinite" : "none" }}>
              <div style={{ fontSize: "32px", marginBottom: "4px" }}>🥤</div>
              <div style={{ color: "white", fontSize: "11px", fontWeight: 800, letterSpacing: "0.05em" }}>TAISHO PHARMA</div>
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "10px" }}>NEW PROTEIN</div>
              {activeConcept && <div style={{ marginTop: "6px", padding: "4px 10px", background: "rgba(255,255,255,0.2)", borderRadius: "8px", color: "white", fontSize: "9px", maxWidth: "120px" }}>{activeConcept.length > 24 ? activeConcept.substring(0, 24) + "..." : activeConcept}</div>}
            </div>
          </div>
          {people.map(p => <GymPerson key={p.id} person={p} isReacting={reactingIds.has(p.id)} onClick={triggerReaction} />)}
          {visibleReactions.slice(-6).map((r, i) => <SpeechBubble key={r.timestamp + "" + i} reaction={r} persona={r.persona} index={i} />)}
          {isSimulating && (
            <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,50,50,0.9)", borderRadius: "20px", padding: "4px 12px", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px", animation: "pulse 1s ease infinite", zIndex: 200 }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} /> SIMULATING
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: "330px", background: "rgba(15,15,25,0.98)", borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "relative", zIndex: 200 }}>
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {[{ k: "control", l: "🚀 Control" }, { k: "personas", l: "👥 Personas" }].map(t => (
              <button key={t.k} onClick={() => setSideTab(t.k)} style={{ flex: 1, padding: "10px", border: "none", cursor: "pointer", background: sideTab === t.k ? "rgba(255,107,53,0.1)" : "transparent", borderBottom: sideTab === t.k ? "2px solid #FF6B35" : "2px solid transparent", color: sideTab === t.k ? "#FF6B35" : "#666", fontSize: "11px", fontWeight: 700, fontFamily: "'Noto Sans JP', sans-serif" }}>{t.l}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {sideTab === "control" && (<>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "10px", fontWeight: 800, color: "#FF6B35", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>💡 PRODUCT CONCEPT / MESSAGING</label>
                <textarea value={concept} onChange={e => setConcept(e.target.value)} placeholder="e.g. Pharma-grade protein backed by clinical research" style={{ width: "100%", height: "72px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", padding: "10px 12px", fontSize: "13px", fontFamily: "'Noto Sans JP', sans-serif", resize: "none", boxSizing: "border-box", lineHeight: 1.5 }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "9px", color: "#666", marginBottom: "6px", letterSpacing: "0.1em", fontWeight: 700 }}>PRESET CONCEPTS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{presets.map((pc, i) => (<button key={i} onClick={() => setConcept(pc)} style={{ background: concept === pc ? "rgba(255,107,53,0.2)" : "rgba(255,255,255,0.05)", border: concept === pc ? "1px solid #FF6B35" : "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: concept === pc ? "#FF6B35" : "#999", padding: "5px 10px", fontSize: "10px", cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}>{pc}</button>))}</div>
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button onClick={startSim} disabled={isSimulating || !concept.trim()} style={{ flex: 1, background: isSimulating ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #FF6B35, #FF3366)", border: "none", borderRadius: "10px", color: "white", padding: "12px", fontSize: "13px", fontWeight: 800, cursor: isSimulating ? "not-allowed" : "pointer", opacity: (!concept.trim() || isSimulating) ? 0.5 : 1 }}>{isSimulating ? "⏳ Observing..." : "🚀 Start Simulation"}</button>
                <button onClick={clearAll} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#888", padding: "12px", fontSize: "11px", cursor: "pointer" }}>🗑️</button>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "10px", fontWeight: 800, color: "#3498DB", letterSpacing: "0.1em", marginBottom: "8px" }}>👥 PERSONAS (click for individual reaction)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {personas.map(p => (
                    <div key={p.id} onClick={() => triggerReaction(p)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", cursor: "pointer", background: reactingIds.has(p.id) ? p.color + "22" : "rgba(255,255,255,0.03)", borderRadius: "8px", borderLeft: "3px solid " + p.color }}>
                      <span style={{ fontSize: "16px" }}>{p.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: p.color }}>{p.name}</div>
                        <div style={{ fontSize: "8px", color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.traits.substring(0, 50)}...</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <AnalyticsPanel reactions={allReactions} />
            </>)}

            {sideTab === "personas" && (<>
              <button onClick={() => { setIsNewPersona(true); setEditingPersona({}); }} style={{ width: "100%", padding: "12px", marginBottom: "12px", background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,51,102,0.15))", border: "1px dashed #FF6B35", borderRadius: "12px", color: "#FF6B35", fontSize: "12px", fontWeight: 800, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}>＋ Add New Persona</button>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {personas.map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", borderLeft: "4px solid " + p.color }}>
                    <span style={{ fontSize: "24px" }}>{p.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: p.color }}>{p.name}</div>
                      <div style={{ fontSize: "9px", color: "#888" }}>Age {p.age} ・ {p.type}</div>
                      <div style={{ fontSize: "9px", color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.traits}</div>
                    </div>
                    <button onClick={() => { setIsNewPersona(false); setEditingPersona(p); }} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "8px", color: "#aaa", padding: "6px 10px", cursor: "pointer", fontSize: "11px", whiteSpace: "nowrap" }}>✏️ Edit</button>
                  </div>
                ))}
              </div>
              {!personas.length && <div style={{ textAlign: "center", padding: "40px 20px", color: "#555", fontSize: "12px" }}>No personas yet. Add one above to get started.</div>}
              <button onClick={() => setPersonas(DEFAULT_PERSONAS)} style={{ width: "100%", marginTop: "16px", padding: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#555", fontSize: "10px", cursor: "pointer" }}>🔄 Reset to Defaults</button>
            </>)}
          </div>
        </div>
      </div>

      {editingPersona && <PersonaEditor persona={editingPersona} isNew={isNewPersona} onSave={handleSave} onCancel={() => { setEditingPersona(null); setIsNewPersona(false); }} onDelete={handleDelete} />}
    </div>
  );
}
