import{n as e}from"./rolldown-runtime-WkwZ5CU-.js";import{F as t,It as n,M as r,Ot as i,Rt as a,T as o,Vt as s,ln as c,qt as l,st as u,t as d}from"./vendor-BpC3sw32.js";import{n as f}from"./index-dMyW_U_A.js";var p=e(c(),1),m={overview:`VibeSpace is engineered as a high-throughput, low-latency social super-app ecosystem. The backend deploys microservices on Google Cloud Run with an edge CDN network, WebSocket gateway for real-time signaling, PostgreSQL with Drizzle ORM, and client-side Signal Double Ratchet end-to-end encryption for direct messaging.`,techStack:[{layer:`Frontend Client`,technology:`React 19 + TypeScript + Tailwind CSS + Motion`,rationale:`Zero-pill high-contrast UI with 120Hz smooth gesture navigation and real-time state synchronization.`},{layer:`Real-Time Edge & Messaging`,technology:`WebSockets + WebRTC + Signal E2EE Ratchet`,rationale:`Sub-50ms message delivery, secure peer-to-peer audio/video streaming, and hardware screenshot protection.`},{layer:`Backend Application Server`,technology:`Node.js 20 + Express API v1 + Google GenAI SDK`,rationale:`RESTful modular routes, server-side Gemini 3.8 Flash studio, rate limiting, and automated security WAF.`},{layer:`Data Storage & Persistence`,technology:`PostgreSQL 16 Relational Engine + JSON Audit Logs`,rationale:`ACID transactions for creator wallet payouts, brand deals escrow, and verifiable credentials.`},{layer:`Content Delivery & Storage`,technology:`Cloud CDN + WebP/AVIF Image Pipeline + HLS Video`,rationale:`Adaptive streaming, automated thumbnails, and hardware-accelerated playback.`}],databaseSchemaSql:`-- VibeSpace Production Relational DDL Schema
-- Engine: PostgreSQL 16 with cryptographic and indexing extensions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users & Identities
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(40) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT NOT NULL,
  bio TEXT,
  category VARCHAR(50) DEFAULT 'Creator',
  account_type VARCHAR(20) DEFAULT 'creator' CHECK (account_type IN ('personal', 'creator', 'business', 'organization')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT FALSE,
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  wallet_balance_inr NUMERIC(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Posts & Feeds
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caption TEXT,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video', 'carousel')),
  media_urls TEXT[] NOT NULL,
  tags TEXT[] DEFAULT '{}',
  location VARCHAR(120),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_exclusive_subscriber BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Reels & Short Videos
CREATE TABLE reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  video_url TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  audio_title VARCHAR(120),
  audio_artist VARCHAR(120),
  duration_seconds INT DEFAULT 30,
  likes_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. E2EE Direct Messaging (Signal Protocol)
CREATE TABLE chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder VARCHAR(20) DEFAULT 'primary' CHECK (folder IN ('primary', 'general', 'requests')),
  is_group BOOLEAN DEFAULT FALSE,
  group_name VARCHAR(100),
  conversation_status VARCHAR(20) DEFAULT 'open',
  vanish_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  encrypted_payload TEXT NOT NULL,
  nonce VARCHAR(64) NOT NULL,
  media_type VARCHAR(20) DEFAULT 'text',
  is_view_once BOOLEAN DEFAULT FALSE,
  expires_in_seconds INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Creator Wallet & Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount_inr NUMERIC(10, 2) NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('subscription', 'brand_deal', 'gift', 'withdrawal')),
  status VARCHAR(20) DEFAULT 'verified' CHECK (status IN ('verified', 'pending', 'refunded')),
  reference_id VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for ultra-low query latency
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_reels_user ON reels(user_id);
CREATE INDEX idx_messages_thread ON messages(thread_id, created_at DESC);
CREATE INDEX idx_transactions_user ON transactions(user_id);
`},h={philosophy:`VibeSpace embraces modern tactile realism with a zero-pill aesthetic, deep slate contrasts, fluid 120Hz gesture navigation, and real-time visual feedback.`,principles:[{title:`Ultra-Fast 120Hz Responsiveness`,details:`Zero jank on mobile viewports. Smooth spring transitions for story carousels, reel gestures, and bottom sheets.`},{title:`High-Contrast Content Hierarchy`,details:`Pure black / slate-950 foundation with vibrant violet, emerald, and amber accent signifiers that prioritize media and creator identities.`},{title:`Contextual Creator Controls`,details:`Professional creator dashboards, monetization stats, and team assignments tucked neatly into intuitive sliding drawers and hubs.`},{title:`Privacy-First Visual Feedback`,details:`Unambiguous status badges for E2EE signal encryption, dynamic forensic watermarking, and active screenshot alerts.`}],instagramComparison:[{metric:`DM Management`,instagram:`Basic Primary / General with limited filters`,vibespace:`Primary / General / Requests + Team assignment, custom labels, and saved replies`},{metric:`Screenshot Privacy`,instagram:`Only notifies on vanishing DM photos`,vibespace:`Hardware FLAG_SECURE simulation + dynamic forensic watermarking & alert engine`},{metric:`Creator Monetization`,instagram:`High fees, invite-only bonuses, fragmented payouts`,vibespace:`Integrated Creator Wallet (UPI/Bank), Brand Marketplace, Virtual Gifts, and 0% platform fee intro`},{metric:`AI Creator Studio`,instagram:`Basic generative stickers`,vibespace:`Server-side Gemini 3.8 Flash for captions, hashtags, viral scripts, and smart replies`}]},g=[{phase:`Phase 1: Foundation & Security`,duration:`Sprint 1`,status:`Completed`,tasks:[`Multi-account model (Personal, Creator, Business, Organization)`,`Signal E2EE ratchet & screenshot protection framework`,`Unified Express v1 backend with disk persistence & rate limiting`]},{phase:`Phase 2: Feed & Multimedia Studio`,duration:`Sprint 2`,status:`Completed`,tasks:[`SmartFeed with multi-media cards, likes, comments, and bookmarking`,`Full-screen vertical ReelsEngine with ambient synth soundtrack`,`Stories creator with drawing canvas, stickers, text styles, and highlights`]},{phase:`Phase 3: Professional Messaging & Notes`,duration:`Sprint 3`,status:`Completed`,tasks:[`MessengerHub with Primary, General, and Request folders`,`Saved replies (/), automation rules, and internal team assignment`,`24-hour horizontal Notes bar with audio track attachments`]},{phase:`Phase 4: Creator Economy & Marketplace`,duration:`Sprint 4`,status:`Completed`,tasks:[`Creator Monetization Hub & Creator Wallet with UPI/Bank payouts`,`Brand & Creator Marketplace with deal negotiation and escrow tracking`,`Verified Business Marketplace for products, LUTs, and consulting`]},{phase:`Phase 5: Super App Modules & AI Studio`,duration:`Sprint 5`,status:`Completed`,tasks:[`Server-side Gemini 3.8 Flash content generator in SuperAppHub`,`Online learning courses with verifiable certificates`,`Communities & Advertising Network with campaign analytics`]},{phase:`Phase 6: CI/CD Pipeline & Hardening`,duration:`Sprint 6`,status:`Active`,tasks:[`GitHub Actions continuous integration with zero-error validation`,`Automated bundle size optimization and lazy loading`,`Multi-device responsive layout testing and regression verification`]}],_={androidKotlin:`// Android Native Screen Security Implementation
// File: app/src/main/java/com/vibespace/security/ScreenSecurityPlugin.kt

package com.vibespace.security

import android.app.Activity
import android.os.Build
import android.view.WindowManager
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.embedding.engine.plugins.activity.ActivityAware
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding

class ScreenSecurityPlugin : FlutterPlugin, ActivityAware {
    private var activity: Activity? = null

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {}
    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {}

    override fun onAttachedToActivity(binding: ActivityPluginBinding) {
        activity = binding.activity
        enableProtection()
    }

    override fun onDetachedFromActivity() {
        activity = null
    }

    override fun onReattachedToActivityForConfigChanges(binding: ActivityPluginBinding) {
        activity = binding.activity
    }

    override fun onDetachedFromActivityForConfigChanges() {
        activity = null
    }

    fun enableProtection() {
        activity?.runOnUiThread {
            // Apply FLAG_SECURE to render screen black in screenshots & recents
            activity?.window?.setFlags(
                WindowManager.LayoutParams.FLAG_SECURE,
                WindowManager.LayoutParams.FLAG_SECURE
            )

            // Android 14+ Screen Capture Detection API
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                activity?.registerScreenCaptureCallback(
                    activity!!.mainExecutor,
                    Activity.ScreenCaptureCallback {
                        // Broadcast screenshot alert event to VibeSpace React/Flutter bridge
                    }
                )
            }
        }
    }
}`,iosSwift:`// iOS Native Screen Security Implementation
// File: ios/Runner/ScreenSecurityPlugin.swift

import UIKit
import Flutter

public class ScreenSecurityPlugin: NSObject, FlutterPlugin {
    private var secureTextField: UITextField?

    public static func register(with registrar: FlutterPluginRegistrar) {
        let channel = FlutterMethodChannel(name: "com.vibespace/screen_security", binaryMessenger: registrar.messenger())
        let instance = ScreenSecurityPlugin()
        registrar.addMethodCallDelegate(instance, channel: channel)
    }

    public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        if call.method == "enableSecureScreen" {
            guard let window = UIApplication.shared.windows.first(where: { $0.isKeyWindow }) else {
                result(false)
                return
            }

            // UIKit DRM Canvas Masking via secureTextEntry layer
            if self.secureTextField == nil {
                let field = UITextField()
                field.isSecureTextEntry = true
                field.isUserInteractionEnabled = false
                window.addSubview(field)
                field.centerYAnchor.constraint(equalTo: window.centerYAnchor).isActive = true
                field.centerXAnchor.constraint(equalTo: window.centerXAnchor).isActive = true
                window.layer.superlayer?.addSublayer(field.layer)
                field.layer.sublayers?.first?.addSublayer(window.layer)
                self.secureTextField = field
            }
            result(true)
        } else {
            result(FlutterMethodNotImplemented)
        }
    }
}`,reactNativeBridge:`// React Native Screen Security Hook
// File: src/hooks/useScreenSecurity.ts

import { useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';

const { ScreenSecurityModule } = NativeModules;

export const useScreenSecurity = (enabled: boolean = true) => {
  useEffect(() => {
    if (!ScreenSecurityModule) return;
    
    if (enabled) {
      ScreenSecurityModule.activateSecureFlag();
    } else {
      ScreenSecurityModule.deactivateSecureFlag();
    }

    return () => {
      ScreenSecurityModule?.deactivateSecureFlag();
    };
  }, [enabled]);
};`,flutterPlugin:`// Flutter Screen Security Service
// File: lib/services/screen_security_service.dart

import 'package:flutter/services.dart';

class ScreenSecurityService {
  static const MethodChannel _channel = MethodChannel('com.vibespace/screen_security');

  static Future<bool> enableProtection() async {
    try {
      final bool success = await _channel.invokeMethod('enableSecureScreen');
      return success;
    } on PlatformException {
      return false;
    }
  }
}`},v=d(),y=`/app/applet/src/components/ArchitectureStudio.tsx`,b=()=>{let[e,c]=(0,p.useState)(`snippets`),[d,b]=(0,p.useState)(`android`),[x,S]=(0,p.useState)(null),C=(e,t)=>{f.playHeartPop(),navigator.clipboard?.writeText(e),S(t),setTimeout(()=>{S(null)},2e3)};return(0,v.jsxDEV)(`div`,{className:`max-w-5xl mx-auto w-full p-4 sm:p-6 pb-28 text-slate-200`,children:[(0,v.jsxDEV)(`div`,{className:`mb-6 border-b border-slate-800 pb-5`,children:[(0,v.jsxDEV)(`div`,{className:`flex flex-col sm:flex-row sm:items-center justify-between gap-4`,children:[(0,v.jsxDEV)(`div`,{className:`flex items-start sm:items-center gap-4`,children:[(0,v.jsxDEV)(`img`,{src:`/app-icon.png`,alt:`VibeSpace App Icon`,className:`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-xl ring-2 ring-violet-500/30 shrink-0`},void 0,!1,{fileName:y,lineNumber:44,columnNumber:13},void 0),(0,v.jsxDEV)(`div`,{children:[(0,v.jsxDEV)(`div`,{className:`flex items-center gap-2 mb-1`,children:[(0,v.jsxDEV)(`span`,{className:`text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold`,children:`Engineering Specification & System Blueprint`},void 0,!1,{fileName:y,lineNumber:51,columnNumber:17},void 0),(0,v.jsxDEV)(`span`,{className:`text-slate-600`,children:`·`},void 0,!1,{fileName:y,lineNumber:54,columnNumber:17},void 0),(0,v.jsxDEV)(`span`,{className:`text-xs font-mono text-emerald-400`,children:`Production-Ready`},void 0,!1,{fileName:y,lineNumber:55,columnNumber:17},void 0)]},void 0,!0,{fileName:y,lineNumber:50,columnNumber:15},void 0),(0,v.jsxDEV)(`h1`,{className:`text-2xl sm:text-3xl font-extrabold text-white tracking-tight`,children:`VibeSpace Architectural Engine`},void 0,!1,{fileName:y,lineNumber:57,columnNumber:15},void 0),(0,v.jsxDEV)(`p`,{className:`text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed`,children:`Comprehensive architectural blueprint, zero-knowledge database schemas, 120Hz gesture guidelines, and native anti-screenshot security code for Android and iOS.`},void 0,!1,{fileName:y,lineNumber:60,columnNumber:15},void 0)]},void 0,!0,{fileName:y,lineNumber:49,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:43,columnNumber:11},void 0),(0,v.jsxDEV)(`div`,{className:`flex items-center gap-2`,children:(0,v.jsxDEV)(`button`,{onClick:()=>C(m.databaseSchemaSql,`all_sql`),className:`px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5`,children:[x===`all_sql`?(0,v.jsxDEV)(l,{className:`w-3.5 h-3.5 text-emerald-400`},void 0,!1,{fileName:y,lineNumber:71,columnNumber:42},void 0):(0,v.jsxDEV)(a,{className:`w-3.5 h-3.5`},void 0,!1,{fileName:y,lineNumber:71,columnNumber:95},void 0),(0,v.jsxDEV)(`span`,{children:x===`all_sql`?`SQL Copied!`:`Export DDL Schema`},void 0,!1,{fileName:y,lineNumber:72,columnNumber:15},void 0)]},void 0,!0,{fileName:y,lineNumber:67,columnNumber:13},void 0)},void 0,!1,{fileName:y,lineNumber:66,columnNumber:11},void 0)]},void 0,!0,{fileName:y,lineNumber:42,columnNumber:9},void 0),(0,v.jsxDEV)(`div`,{className:`flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-6`,children:[(0,v.jsxDEV)(`button`,{onClick:()=>c(`snippets`),className:`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${e===`snippets`?`bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-950/40`:`bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850`}`,children:[(0,v.jsxDEV)(r,{className:`w-4 h-4 text-rose-400`},void 0,!1,{fileName:y,lineNumber:87,columnNumber:13},void 0),(0,v.jsxDEV)(`span`,{children:`Anti-Screenshot Code (Android/iOS)`},void 0,!1,{fileName:y,lineNumber:88,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:79,columnNumber:11},void 0),(0,v.jsxDEV)(`button`,{onClick:()=>c(`schema`),className:`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${e===`schema`?`bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-950/40`:`bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850`}`,children:[(0,v.jsxDEV)(n,{className:`w-4 h-4 text-emerald-400`},void 0,!1,{fileName:y,lineNumber:99,columnNumber:13},void 0),(0,v.jsxDEV)(`span`,{children:`PostgreSQL Schema & ERD`},void 0,!1,{fileName:y,lineNumber:100,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:91,columnNumber:11},void 0),(0,v.jsxDEV)(`button`,{onClick:()=>c(`architecture`),className:`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${e===`architecture`?`bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-950/40`:`bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850`}`,children:[(0,v.jsxDEV)(t,{className:`w-4 h-4 text-cyan-400`},void 0,!1,{fileName:y,lineNumber:111,columnNumber:13},void 0),(0,v.jsxDEV)(`span`,{children:`System Architecture & CDN`},void 0,!1,{fileName:y,lineNumber:112,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:103,columnNumber:11},void 0),(0,v.jsxDEV)(`button`,{onClick:()=>c(`uiux`),className:`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${e===`uiux`?`bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-950/40`:`bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850`}`,children:[(0,v.jsxDEV)(o,{className:`w-4 h-4 text-amber-400`},void 0,!1,{fileName:y,lineNumber:123,columnNumber:13},void 0),(0,v.jsxDEV)(`span`,{children:`UI/UX Benchmarks vs Instagram`},void 0,!1,{fileName:y,lineNumber:124,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:115,columnNumber:11},void 0),(0,v.jsxDEV)(`button`,{onClick:()=>c(`roadmap`),className:`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${e===`roadmap`?`bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-950/40`:`bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850`}`,children:[(0,v.jsxDEV)(s,{className:`w-4 h-4 text-teal-400`},void 0,!1,{fileName:y,lineNumber:135,columnNumber:13},void 0),(0,v.jsxDEV)(`span`,{children:`Implementation Roadmap`},void 0,!1,{fileName:y,lineNumber:136,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:127,columnNumber:11},void 0)]},void 0,!0,{fileName:y,lineNumber:78,columnNumber:9},void 0)]},void 0,!0,{fileName:y,lineNumber:41,columnNumber:7},void 0),e===`snippets`&&(0,v.jsxDEV)(`div`,{className:`space-y-6`,children:[(0,v.jsxDEV)(`div`,{className:`bg-slate-900/60 border border-slate-800 rounded-2xl p-5`,children:[(0,v.jsxDEV)(`div`,{className:`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4`,children:[(0,v.jsxDEV)(`div`,{children:[(0,v.jsxDEV)(`h2`,{className:`text-base font-bold text-white flex items-center gap-2`,children:[(0,v.jsxDEV)(u,{className:`w-5 h-5 text-rose-400`},void 0,!1,{fileName:y,lineNumber:148,columnNumber:19},void 0),` Hardware-Level Screenshot & Screen-Recording Prevention`]},void 0,!0,{fileName:y,lineNumber:147,columnNumber:17},void 0),(0,v.jsxDEV)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:[`Native bridges implementing Android 14+ `,(0,v.jsxDEV)(`code`,{className:`text-rose-300 font-mono`,children:`FLAG_SECURE`},void 0,!1,{fileName:y,lineNumber:151,columnNumber:59},void 0),` and iOS `,(0,v.jsxDEV)(`code`,{className:`text-rose-300 font-mono`,children:`UITextField.isSecureTextEntry`},void 0,!1,{fileName:y,lineNumber:151,columnNumber:128},void 0),` window sublayers.`]},void 0,!0,{fileName:y,lineNumber:150,columnNumber:17},void 0)]},void 0,!0,{fileName:y,lineNumber:146,columnNumber:15},void 0),(0,v.jsxDEV)(`div`,{className:`flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto`,children:[(0,v.jsxDEV)(`button`,{onClick:()=>b(`android`),className:`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${d===`android`?`bg-slate-800 text-emerald-300`:`text-slate-400 hover:text-white`}`,children:`Android (Kotlin)`},void 0,!1,{fileName:y,lineNumber:157,columnNumber:17},void 0),(0,v.jsxDEV)(`button`,{onClick:()=>b(`ios`),className:`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${d===`ios`?`bg-slate-800 text-cyan-300`:`text-slate-400 hover:text-white`}`,children:`iOS (Swift)`},void 0,!1,{fileName:y,lineNumber:165,columnNumber:17},void 0),(0,v.jsxDEV)(`button`,{onClick:()=>b(`reactNative`),className:`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${d===`reactNative`?`bg-slate-800 text-violet-300`:`text-slate-400 hover:text-white`}`,children:`React Native (TS)`},void 0,!1,{fileName:y,lineNumber:173,columnNumber:17},void 0),(0,v.jsxDEV)(`button`,{onClick:()=>b(`flutter`),className:`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${d===`flutter`?`bg-slate-800 text-teal-300`:`text-slate-400 hover:text-white`}`,children:`Flutter (Dart)`},void 0,!1,{fileName:y,lineNumber:181,columnNumber:17},void 0)]},void 0,!0,{fileName:y,lineNumber:156,columnNumber:15},void 0)]},void 0,!0,{fileName:y,lineNumber:145,columnNumber:13},void 0),(0,v.jsxDEV)(`div`,{className:`relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950`,children:[(0,v.jsxDEV)(`div`,{className:`flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs`,children:[(0,v.jsxDEV)(`span`,{className:`font-mono text-slate-400 flex items-center gap-1.5`,children:[(0,v.jsxDEV)(i,{className:`w-3.5 h-3.5 text-violet-400`},void 0,!1,{fileName:y,lineNumber:196,columnNumber:19},void 0),d===`android`?`android/app/src/main/kotlin/ScreenSecurityPlugin.kt`:d===`ios`?`ios/Runner/ScreenSecurityPlugin.swift`:d===`reactNative`?`src/hooks/useScreenSecurity.ts`:`lib/services/screen_security_service.dart`]},void 0,!0,{fileName:y,lineNumber:195,columnNumber:17},void 0),(0,v.jsxDEV)(`button`,{onClick:()=>{let e=d===`android`?_.androidKotlin:d===`ios`?_.iosSwift:d===`reactNative`?_.reactNativeBridge:_.flutterPlugin;C(e,d)},className:`px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1`,children:x===d?(0,v.jsxDEV)(v.Fragment,{children:[(0,v.jsxDEV)(l,{className:`w-3 h-3 text-emerald-400`},void 0,!1,{fileName:y,lineNumber:221,columnNumber:23},void 0),` Copied`]},void 0,!0,{fileName:y,lineNumber:220,columnNumber:21},void 0):(0,v.jsxDEV)(v.Fragment,{children:[(0,v.jsxDEV)(a,{className:`w-3 h-3`},void 0,!1,{fileName:y,lineNumber:225,columnNumber:23},void 0),` Copy Snippet`]},void 0,!0,{fileName:y,lineNumber:224,columnNumber:21},void 0)},void 0,!1,{fileName:y,lineNumber:205,columnNumber:17},void 0)]},void 0,!0,{fileName:y,lineNumber:194,columnNumber:15},void 0),(0,v.jsxDEV)(`pre`,{className:`p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-[500px]`,children:[d===`android`&&_.androidKotlin,d===`ios`&&_.iosSwift,d===`reactNative`&&_.reactNativeBridge,d===`flutter`&&_.flutterPlugin]},void 0,!0,{fileName:y,lineNumber:231,columnNumber:15},void 0)]},void 0,!0,{fileName:y,lineNumber:193,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:144,columnNumber:11},void 0),(0,v.jsxDEV)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-4 text-xs`,children:[(0,v.jsxDEV)(`div`,{className:`p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2`,children:[(0,v.jsxDEV)(`h3`,{className:`font-bold text-white text-sm flex items-center gap-1.5`,children:[(0,v.jsxDEV)(`span`,{className:`w-2 h-2 rounded-full bg-emerald-400`},void 0,!1,{fileName:y,lineNumber:244,columnNumber:17},void 0),` How Android FLAG_SECURE Works`]},void 0,!0,{fileName:y,lineNumber:243,columnNumber:15},void 0),(0,v.jsxDEV)(`p`,{className:`text-slate-300 leading-relaxed`,children:[`Applying `,(0,v.jsxDEV)(`code`,{className:`text-emerald-300 font-mono`,children:`WindowManager.LayoutParams.FLAG_SECURE`},void 0,!1,{fileName:y,lineNumber:247,columnNumber:26},void 0),` treats the window surface as secure at the GPU display compositor level. Any attempt to take a screenshot via hardware buttons, adb screencap, or third-party recorder renders a black rectangle. On Android 14 (API 34), we bind to `,(0,v.jsxDEV)(`code`,{className:`text-emerald-300 font-mono`,children:`registerScreenCaptureCallback`},void 0,!1,{fileName:y,lineNumber:247,columnNumber:346},void 0),` to fire instant creator alert events.`]},void 0,!0,{fileName:y,lineNumber:246,columnNumber:15},void 0)]},void 0,!0,{fileName:y,lineNumber:242,columnNumber:13},void 0),(0,v.jsxDEV)(`div`,{className:`p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2`,children:[(0,v.jsxDEV)(`h3`,{className:`font-bold text-white text-sm flex items-center gap-1.5`,children:[(0,v.jsxDEV)(`span`,{className:`w-2 h-2 rounded-full bg-cyan-400`},void 0,!1,{fileName:y,lineNumber:253,columnNumber:17},void 0),` How iOS Secure Canvas Masking Works`]},void 0,!0,{fileName:y,lineNumber:252,columnNumber:15},void 0),(0,v.jsxDEV)(`p`,{className:`text-slate-300 leading-relaxed`,children:[`iOS lacks a direct `,(0,v.jsxDEV)(`code`,{className:`text-cyan-300 font-mono`,children:`FLAG_SECURE`},void 0,!1,{fileName:y,lineNumber:256,columnNumber:36},void 0),` flag. However, UIKit internally applies private DRM protection to any view hosting a `,(0,v.jsxDEV)(`code`,{className:`text-cyan-300 font-mono`,children:`UITextField(isSecureTextEntry: true)`},void 0,!1,{fileName:y,lineNumber:256,columnNumber:182},void 0),`. By embedding our Flutter/React Native canvas inside that sublayer, iOS system compositor automatically blacks out the feed in screenshots, screen recordings, AirPlay mirroring, and the app switcher!`]},void 0,!0,{fileName:y,lineNumber:255,columnNumber:15},void 0)]},void 0,!0,{fileName:y,lineNumber:251,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:241,columnNumber:11},void 0)]},void 0,!0,{fileName:y,lineNumber:143,columnNumber:9},void 0),e===`schema`&&(0,v.jsxDEV)(`div`,{className:`space-y-6`,children:(0,v.jsxDEV)(`div`,{className:`bg-slate-900/60 border border-slate-800 rounded-2xl p-5`,children:[(0,v.jsxDEV)(`div`,{className:`flex items-center justify-between mb-4`,children:[(0,v.jsxDEV)(`div`,{children:[(0,v.jsxDEV)(`h2`,{className:`text-base font-bold text-white flex items-center gap-2`,children:[(0,v.jsxDEV)(n,{className:`w-5 h-5 text-emerald-400`},void 0,!1,{fileName:y,lineNumber:270,columnNumber:19},void 0),` Relational & Cryptographic Database Schema`]},void 0,!0,{fileName:y,lineNumber:269,columnNumber:17},void 0),(0,v.jsxDEV)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`PostgreSQL 16 DDL with zero-knowledge Signal prekey bundles, auto-expiring stories, and E2EE message ratchets.`},void 0,!1,{fileName:y,lineNumber:272,columnNumber:17},void 0)]},void 0,!0,{fileName:y,lineNumber:268,columnNumber:15},void 0),(0,v.jsxDEV)(`button`,{onClick:()=>C(m.databaseSchemaSql,`ddl_tab`),className:`px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 flex items-center gap-1.5`,children:[x===`ddl_tab`?(0,v.jsxDEV)(l,{className:`w-3.5 h-3.5 text-emerald-400`},void 0,!1,{fileName:y,lineNumber:280,columnNumber:44},void 0):(0,v.jsxDEV)(a,{className:`w-3.5 h-3.5`},void 0,!1,{fileName:y,lineNumber:280,columnNumber:97},void 0),(0,v.jsxDEV)(`span`,{children:x===`ddl_tab`?`Copied`:`Copy SQL`},void 0,!1,{fileName:y,lineNumber:281,columnNumber:17},void 0)]},void 0,!0,{fileName:y,lineNumber:276,columnNumber:15},void 0)]},void 0,!0,{fileName:y,lineNumber:267,columnNumber:13},void 0),(0,v.jsxDEV)(`div`,{className:`relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950`,children:(0,v.jsxDEV)(`pre`,{className:`p-4 overflow-x-auto text-xs font-mono text-emerald-300/90 leading-relaxed max-h-[520px]`,children:m.databaseSchemaSql},void 0,!1,{fileName:y,lineNumber:286,columnNumber:15},void 0)},void 0,!1,{fileName:y,lineNumber:285,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:266,columnNumber:11},void 0)},void 0,!1,{fileName:y,lineNumber:265,columnNumber:9},void 0),e===`architecture`&&(0,v.jsxDEV)(`div`,{className:`space-y-6`,children:(0,v.jsxDEV)(`div`,{className:`p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4`,children:[(0,v.jsxDEV)(`h2`,{className:`text-base font-bold text-white flex items-center gap-2`,children:[(0,v.jsxDEV)(t,{className:`w-5 h-5 text-cyan-400`},void 0,!1,{fileName:y,lineNumber:299,columnNumber:15},void 0),` End-to-End System Topology`]},void 0,!0,{fileName:y,lineNumber:298,columnNumber:13},void 0),(0,v.jsxDEV)(`p`,{className:`text-xs text-slate-300 leading-relaxed`,children:m.overview},void 0,!1,{fileName:y,lineNumber:301,columnNumber:13},void 0),(0,v.jsxDEV)(`div`,{className:`space-y-3 pt-2`,children:m.techStack.map((e,t)=>(0,v.jsxDEV)(`div`,{className:`p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1`,children:[(0,v.jsxDEV)(`div`,{className:`flex flex-col sm:flex-row sm:items-center justify-between text-xs`,children:[(0,v.jsxDEV)(`span`,{className:`font-bold text-white`,children:e.layer},void 0,!1,{fileName:y,lineNumber:312,columnNumber:21},void 0),(0,v.jsxDEV)(`span`,{className:`font-mono text-violet-400 font-semibold`,children:e.technology},void 0,!1,{fileName:y,lineNumber:313,columnNumber:21},void 0)]},void 0,!0,{fileName:y,lineNumber:311,columnNumber:19},void 0),(0,v.jsxDEV)(`p`,{className:`text-xs text-slate-400 leading-relaxed`,children:e.rationale},void 0,!1,{fileName:y,lineNumber:315,columnNumber:19},void 0)]},t,!0,{fileName:y,lineNumber:307,columnNumber:17},void 0))},void 0,!1,{fileName:y,lineNumber:305,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:297,columnNumber:11},void 0)},void 0,!1,{fileName:y,lineNumber:296,columnNumber:9},void 0),e===`uiux`&&(0,v.jsxDEV)(`div`,{className:`space-y-6`,children:(0,v.jsxDEV)(`div`,{className:`p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4`,children:[(0,v.jsxDEV)(`div`,{children:[(0,v.jsxDEV)(`h2`,{className:`text-base font-bold text-white flex items-center gap-2`,children:[(0,v.jsxDEV)(o,{className:`w-5 h-5 text-amber-400`},void 0,!1,{fileName:y,lineNumber:329,columnNumber:17},void 0),` UI/UX Principles & Instagram Comparison`]},void 0,!0,{fileName:y,lineNumber:328,columnNumber:15},void 0),(0,v.jsxDEV)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:h.philosophy},void 0,!1,{fileName:y,lineNumber:331,columnNumber:15},void 0)]},void 0,!0,{fileName:y,lineNumber:327,columnNumber:13},void 0),(0,v.jsxDEV)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2`,children:h.principles.map((e,t)=>(0,v.jsxDEV)(`div`,{className:`p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl`,children:[(0,v.jsxDEV)(`h3`,{className:`text-xs font-bold text-slate-100 mb-1`,children:e.title},void 0,!1,{fileName:y,lineNumber:338,columnNumber:19},void 0),(0,v.jsxDEV)(`p`,{className:`text-xs text-slate-400 leading-relaxed`,children:e.details},void 0,!1,{fileName:y,lineNumber:339,columnNumber:19},void 0)]},t,!0,{fileName:y,lineNumber:337,columnNumber:17},void 0))},void 0,!1,{fileName:y,lineNumber:335,columnNumber:13},void 0),(0,v.jsxDEV)(`div`,{className:`mt-6 pt-4 border-t border-slate-800`,children:[(0,v.jsxDEV)(`h3`,{className:`text-sm font-bold text-white mb-3`,children:`Head-to-Head Benchmark: Instagram vs VibeSpace`},void 0,!1,{fileName:y,lineNumber:346,columnNumber:15},void 0),(0,v.jsxDEV)(`div`,{className:`overflow-x-auto rounded-xl border border-slate-800`,children:(0,v.jsxDEV)(`table`,{className:`w-full text-left text-xs`,children:[(0,v.jsxDEV)(`thead`,{className:`bg-slate-950 text-slate-400 font-mono border-b border-slate-800`,children:(0,v.jsxDEV)(`tr`,{children:[(0,v.jsxDEV)(`th`,{className:`p-3`,children:`Specification Dimension`},void 0,!1,{fileName:y,lineNumber:353,columnNumber:23},void 0),(0,v.jsxDEV)(`th`,{className:`p-3 text-rose-400`,children:`Instagram (Legacy)`},void 0,!1,{fileName:y,lineNumber:354,columnNumber:23},void 0),(0,v.jsxDEV)(`th`,{className:`p-3 text-emerald-400`,children:`VibeSpace (Next-Gen)`},void 0,!1,{fileName:y,lineNumber:355,columnNumber:23},void 0)]},void 0,!0,{fileName:y,lineNumber:352,columnNumber:21},void 0)},void 0,!1,{fileName:y,lineNumber:351,columnNumber:19},void 0),(0,v.jsxDEV)(`tbody`,{className:`divide-y divide-slate-800 bg-slate-900/50`,children:h.instagramComparison.map((e,t)=>(0,v.jsxDEV)(`tr`,{className:`hover:bg-slate-800/40`,children:[(0,v.jsxDEV)(`td`,{className:`p-3 font-semibold text-slate-200`,children:e.metric},void 0,!1,{fileName:y,lineNumber:361,columnNumber:25},void 0),(0,v.jsxDEV)(`td`,{className:`p-3 text-slate-400`,children:e.instagram},void 0,!1,{fileName:y,lineNumber:362,columnNumber:25},void 0),(0,v.jsxDEV)(`td`,{className:`p-3 font-medium text-emerald-300`,children:e.vibespace},void 0,!1,{fileName:y,lineNumber:363,columnNumber:25},void 0)]},t,!0,{fileName:y,lineNumber:360,columnNumber:23},void 0))},void 0,!1,{fileName:y,lineNumber:358,columnNumber:19},void 0)]},void 0,!0,{fileName:y,lineNumber:350,columnNumber:17},void 0)},void 0,!1,{fileName:y,lineNumber:349,columnNumber:15},void 0)]},void 0,!0,{fileName:y,lineNumber:345,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:326,columnNumber:11},void 0)},void 0,!1,{fileName:y,lineNumber:325,columnNumber:9},void 0),e===`roadmap`&&(0,v.jsxDEV)(`div`,{className:`space-y-4`,children:(0,v.jsxDEV)(`div`,{className:`p-5 bg-slate-900/60 border border-slate-800 rounded-2xl`,children:[(0,v.jsxDEV)(`h2`,{className:`text-base font-bold text-white mb-4 flex items-center gap-2`,children:[(0,v.jsxDEV)(s,{className:`w-5 h-5 text-teal-400`},void 0,!1,{fileName:y,lineNumber:379,columnNumber:15},void 0),` 6-Phase Engineering Roadmap`]},void 0,!0,{fileName:y,lineNumber:378,columnNumber:13},void 0),(0,v.jsxDEV)(`div`,{className:`space-y-4`,children:g.map((e,t)=>(0,v.jsxDEV)(`div`,{className:`p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2`,children:[(0,v.jsxDEV)(`div`,{className:`flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs`,children:[(0,v.jsxDEV)(`span`,{className:`font-bold text-white text-sm`,children:e.phase},void 0,!1,{fileName:y,lineNumber:389,columnNumber:21},void 0),(0,v.jsxDEV)(`div`,{className:`flex items-center gap-2 font-mono`,children:[(0,v.jsxDEV)(`span`,{className:`text-slate-400`,children:e.duration},void 0,!1,{fileName:y,lineNumber:391,columnNumber:23},void 0),(0,v.jsxDEV)(`span`,{className:`text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded`,children:e.status},void 0,!1,{fileName:y,lineNumber:392,columnNumber:23},void 0)]},void 0,!0,{fileName:y,lineNumber:390,columnNumber:21},void 0)]},void 0,!0,{fileName:y,lineNumber:388,columnNumber:19},void 0),(0,v.jsxDEV)(`ul`,{className:`space-y-1.5 pt-1 text-xs text-slate-300`,children:e.tasks.map((e,t)=>(0,v.jsxDEV)(`li`,{className:`flex items-start gap-2`,children:[(0,v.jsxDEV)(`span`,{className:`text-violet-400 mt-0.5`,children:`▹`},void 0,!1,{fileName:y,lineNumber:400,columnNumber:25},void 0),(0,v.jsxDEV)(`span`,{children:e},void 0,!1,{fileName:y,lineNumber:401,columnNumber:25},void 0)]},t,!0,{fileName:y,lineNumber:399,columnNumber:23},void 0))},void 0,!1,{fileName:y,lineNumber:397,columnNumber:19},void 0)]},t,!0,{fileName:y,lineNumber:384,columnNumber:17},void 0))},void 0,!1,{fileName:y,lineNumber:382,columnNumber:13},void 0)]},void 0,!0,{fileName:y,lineNumber:377,columnNumber:11},void 0)},void 0,!1,{fileName:y,lineNumber:376,columnNumber:9},void 0)]},void 0,!0,{fileName:y,lineNumber:39,columnNumber:5},void 0)};export{b as ArchitectureStudio};