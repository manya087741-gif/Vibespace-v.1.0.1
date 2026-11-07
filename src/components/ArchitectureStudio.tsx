import React, { useState } from 'react';
import {
  SYSTEM_ARCHITECTURE_SPEC,
  UI_UX_GUIDELINES,
  IMPLEMENTATION_ROADMAP,
  STARTER_CODE_SNIPPETS,
} from '../data/architectureDocs';
import {
  Database,
  Layers,
  Sparkles,
  ShieldAlert,
  Code2,
  Copy,
  Check,
  CheckCircle2,
  FileCode,
  Server,
  Zap,
  Lock,
} from 'lucide-react';
import { sound } from '../utils/audioSynth';

export const ArchitectureStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'uiux' | 'roadmap' | 'snippets'>('snippets');
  const [activeSnippetTab, setActiveSnippetTab] = useState<'android' | 'ios' | 'reactNative' | 'flutter'>('android');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    sound.playHeartPop();
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 pb-28 text-slate-200">
      {/* Studio Header */}
      <div className="mb-6 border-b border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src="/app-icon.png"
              alt="VibeSpace App Icon"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-xl ring-2 ring-violet-500/30 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold">
                  Engineering Specification & System Blueprint
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-emerald-400">Production-Ready</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                VibeSpace Architectural Engine
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Comprehensive architectural blueprint, zero-knowledge database schemas, 120Hz gesture guidelines, and native anti-screenshot security code for Android and iOS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(SYSTEM_ARCHITECTURE_SPEC.databaseSchemaSql, 'all_sql')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copiedKey === 'all_sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all_sql' ? 'SQL Copied!' : 'Export DDL Schema'}</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs (Segmented Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-6">
          <button
            onClick={() => setActiveTab('snippets')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              activeTab === 'snippets'
                ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-950/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Anti-Screenshot Code (Android/iOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              activeTab === 'schema'
                ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-950/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>PostgreSQL Schema & ERD</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              activeTab === 'architecture'
                ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-950/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Server className="w-4 h-4 text-cyan-400" />
            <span>System Architecture & CDN</span>
          </button>

          <button
            onClick={() => setActiveTab('uiux')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              activeTab === 'uiux'
                ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-950/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>UI/UX Benchmarks vs Instagram</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              activeTab === 'roadmap'
                ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-950/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Implementation Roadmap</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STARTER CODE SNIPPETS (Anti-Screenshot Protection) */}
      {activeTab === 'snippets' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-rose-400" /> Hardware-Level Screenshot & Screen-Recording Prevention
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Native bridges implementing Android 14+ <code className="text-rose-300 font-mono">FLAG_SECURE</code> and iOS <code className="text-rose-300 font-mono">UITextField.isSecureTextEntry</code> window sublayers.
                </p>
              </div>

              {/* Sub-Tabs for Platforms */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
                <button
                  onClick={() => setActiveSnippetTab('android')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeSnippetTab === 'android' ? 'bg-slate-800 text-emerald-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Android (Kotlin)
                </button>
                <button
                  onClick={() => setActiveSnippetTab('ios')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeSnippetTab === 'ios' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  iOS (Swift)
                </button>
                <button
                  onClick={() => setActiveSnippetTab('reactNative')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeSnippetTab === 'reactNative' ? 'bg-slate-800 text-violet-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  React Native (TS)
                </button>
                <button
                  onClick={() => setActiveSnippetTab('flutter')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeSnippetTab === 'flutter' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Flutter (Dart)
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
                <span className="font-mono text-slate-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-violet-400" />
                  {activeSnippetTab === 'android'
                    ? 'android/app/src/main/kotlin/ScreenSecurityPlugin.kt'
                    : activeSnippetTab === 'ios'
                    ? 'ios/Runner/ScreenSecurityPlugin.swift'
                    : activeSnippetTab === 'reactNative'
                    ? 'src/hooks/useScreenSecurity.ts'
                    : 'lib/services/screen_security_service.dart'}
                </span>
                <button
                  onClick={() => {
                    const snippet =
                      activeSnippetTab === 'android'
                        ? STARTER_CODE_SNIPPETS.androidKotlin
                        : activeSnippetTab === 'ios'
                        ? STARTER_CODE_SNIPPETS.iosSwift
                        : activeSnippetTab === 'reactNative'
                        ? STARTER_CODE_SNIPPETS.reactNativeBridge
                        : STARTER_CODE_SNIPPETS.flutterPlugin;
                    copyToClipboard(snippet, activeSnippetTab);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1"
                >
                  {copiedKey === activeSnippetTab ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Snippet
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-[500px]">
                {activeSnippetTab === 'android' && STARTER_CODE_SNIPPETS.androidKotlin}
                {activeSnippetTab === 'ios' && STARTER_CODE_SNIPPETS.iosSwift}
                {activeSnippetTab === 'reactNative' && STARTER_CODE_SNIPPETS.reactNativeBridge}
                {activeSnippetTab === 'flutter' && STARTER_CODE_SNIPPETS.flutterPlugin}
              </pre>
            </div>
          </div>

          {/* Technical Explanations Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> How Android FLAG_SECURE Works
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Applying <code className="text-emerald-300 font-mono">WindowManager.LayoutParams.FLAG_SECURE</code> treats the window surface as secure at the GPU display compositor level. Any attempt to take a screenshot via hardware buttons, adb screencap, or third-party recorder renders a black rectangle. On Android 14 (API 34), we bind to <code className="text-emerald-300 font-mono">registerScreenCaptureCallback</code> to fire instant creator alert events.
              </p>
            </div>

            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span> How iOS Secure Canvas Masking Works
              </h3>
              <p className="text-slate-300 leading-relaxed">
                iOS lacks a direct <code className="text-cyan-300 font-mono">FLAG_SECURE</code> flag. However, UIKit internally applies private DRM protection to any view hosting a <code className="text-cyan-300 font-mono">UITextField(isSecureTextEntry: true)</code>. By embedding our Flutter/React Native canvas inside that sublayer, iOS system compositor automatically blacks out the feed in screenshots, screen recordings, AirPlay mirroring, and the app switcher!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POSTGRESQL SCHEMA & ERD */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" /> Relational & Cryptographic Database Schema
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  PostgreSQL 16 DDL with zero-knowledge Signal prekey bundles, auto-expiring stories, and E2EE message ratchets.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(SYSTEM_ARCHITECTURE_SPEC.databaseSchemaSql, 'ddl_tab')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 flex items-center gap-1.5"
              >
                {copiedKey === 'ddl_tab' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'ddl_tab' ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <pre className="p-4 overflow-x-auto text-xs font-mono text-emerald-300/90 leading-relaxed max-h-[520px]">
                {SYSTEM_ARCHITECTURE_SPEC.databaseSchemaSql}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM ARCHITECTURE & CDN */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" /> End-to-End System Topology
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {SYSTEM_ARCHITECTURE_SPEC.overview}
            </p>

            <div className="space-y-3 pt-2">
              {SYSTEM_ARCHITECTURE_SPEC.techStack.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                    <span className="font-bold text-white">{item.layer}</span>
                    <span className="font-mono text-violet-400 font-semibold">{item.technology}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UI/UX GUIDELINES & INSTAGRAM BENCHMARKS */}
      {activeTab === 'uiux' && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> UI/UX Principles & Instagram Comparison
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{UI_UX_GUIDELINES.philosophy}</p>
            </div>

            {/* Core Principles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {UI_UX_GUIDELINES.principles.map((p, i) => (
                <div key={i} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <h3 className="text-xs font-bold text-slate-100 mb-1">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.details}</p>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3">
                Head-to-Head Benchmark: Instagram vs VibeSpace
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">Specification Dimension</th>
                      <th className="p-3 text-rose-400">Instagram (Legacy)</th>
                      <th className="p-3 text-emerald-400">VibeSpace (Next-Gen)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {UI_UX_GUIDELINES.instagramComparison.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-slate-200">{row.metric}</td>
                        <td className="p-3 text-slate-400">{row.instagram}</td>
                        <td className="p-3 font-medium text-emerald-300">{row.vibespace}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" /> 6-Phase Engineering Roadmap
            </h2>

            <div className="space-y-4">
              {IMPLEMENTATION_ROADMAP.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-bold text-white text-sm">{item.phase}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400">{item.duration}</span>
                      <span className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 pt-1 text-xs text-slate-300">
                    {item.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <span className="text-violet-400 mt-0.5">▹</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
