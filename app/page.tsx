"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { characters, generalResponses } from "./data";

type Match = (typeof characters)[number] | null;

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const saved = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = saved;
    }
  }
  return row[b.length];
}

function findCharacter(input: string): Match {
  const query = normalize(input);
  if (!query) return null;
  const exact = characters.find((character) =>
    [character.name, ...character.aliases].some((alias) => normalize(alias) === query),
  );
  if (exact) return exact;
  if (query.length < 4) return null;
  let best: { character: (typeof characters)[number]; score: number } | null = null;
  for (const character of characters) {
    for (const alias of [character.name, ...character.aliases]) {
      const candidate = normalize(alias);
      const allowed = query.length >= 9 ? 2 : 1;
      const score = distance(query, candidate);
      if (score <= allowed && (!best || score < best.score)) best = { character, score };
    }
  }
  return best?.character ?? null;
}

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildReply(match: Match) {
  const count = 1 + Math.floor(Math.random() * 3);
  const picked = new Set<string>();
  if (match) picked.add(randomItem(match.responses));
  while (picked.size < count) {
    const useCharacter = match && Math.random() < 0.55;
    picked.add(randomItem(useCharacter ? match.responses : generalResponses));
  }
  return Array.from(picked).slice(0, count);
}

export default function Home() {
  const [name, setName] = useState("");
  const [reply, setReply] = useState<string[]>([]);
  const [match, setMatch] = useState<Match>(null);
  const [submittedName, setSubmittedName] = useState("");
  const [sequence, setSequence] = useState(0);
  const replyRef = useRef<HTMLElement>(null);
  const suggestions = useMemo(() => {
    const query = normalize(name);
    if (!query) return [];
    return characters.filter((c) => normalize(c.name).includes(query) || c.aliases.some((a) => normalize(a).includes(query))).slice(0, 5);
  }, [name]);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (!name.trim()) return;
    const found = findCharacter(name);
    setMatch(found);
    setSubmittedName(name.trim());
    setReply(buildReply(found));
    setSequence((value) => value + 1);
    window.setTimeout(() => replyRef.current?.focus(), 80);
  }

  return (
    <main>
      <div className="ambient" aria-hidden="true"><span /><span /><span /></div>
      <nav className="nav" aria-label="Stillroom">
        <a className="wordmark" href="#top" aria-label="Stillroom home"><i />STILLROOM</a>
        <span>A quiet conversation</span>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow"><span />Take a breath. Think of someone.</div>
        <h1>Who do you need<br />right now?</h1>
        <p className="intro">Enter the name of your comfort character. They might have something you need to hear.</p>

        <form className="search" onSubmit={submit}>
          <label htmlFor="character-name">Comfort character</label>
          <div className="input-row">
            <div className="input-wrap">
              <input
                id="character-name"
                autoComplete="off"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter their name"
                aria-describedby="search-hint"
              />
              {suggestions.length > 0 && normalize(name) !== normalize(suggestions[0].name) && (
                <div className="suggestions" role="listbox" aria-label="Character suggestions">
                  {suggestions.map((character) => (
                    <button key={character.name} type="button" onClick={() => setName(character.name)}>
                      <span>{character.name}</span><small>{character.source}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="submit" type="submit" disabled={!name.trim()}>
              Get a reply <span aria-hidden="true">→</span>
            </button>
          </div>
          <p id="search-hint" className="hint">Press Enter when you’re ready.</p>
        </form>

        {reply.length > 0 && (
          <section className="reply-card" key={sequence} ref={replyRef} tabIndex={-1} aria-live="polite" aria-label="Your reply">
            <div className="reply-topline">
              <span>{match ? match.name : submittedName}</span>
              <span>For you, right now</span>
            </div>
            <div className="reply-copy">
              {reply.map((line) => <p key={line}>{line}</p>)}
            </div>
            <div className="reply-actions">
              <button type="button" onClick={() => { setReply(buildReply(match)); setSequence((value) => value + 1); }}>
                Another reply <span aria-hidden="true">↗</span>
              </button>
              <span>Stay as long as you need</span>
            </div>
          </section>
        )}

        <div className="scroll-note" aria-hidden="true"><span />Take your time</div>
      </section>

      <footer><span>STILLROOM</span><span>Nothing leaves this room.</span></footer>
    </main>
  );
}
