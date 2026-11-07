export interface TechStackItem {
  layer: string;
  technology: string;
  rationale: string;
}

export interface UIPrinciple {
  title: string;
  details: string;
}

export interface ComparisonRow {
  metric: string;
  instagram: string;
  vibespace: string;
}

export interface RoadmapItem {
  phase: string;
  duration: string;
  status: string;
  tasks: string[];
}

export const SYSTEM_ARCHITECTURE_SPEC = {
  overview:
    'VibeSpace is engineered as a high-throughput, low-latency social super-app ecosystem. The backend deploys microservices on Google Cloud Run with an edge CDN network, WebSocket gateway for real-time signaling, PostgreSQL with Drizzle ORM, and client-side Signal Double Ratchet end-to-end encryption for direct messaging.',
  techStack: [
    {
      layer: 'Frontend Client',
      technology: 'React 19 + TypeScript + Tailwind CSS + Motion',
      rationale:
        'Zero-pill high-contrast UI with 120Hz smooth gesture navigation and real-time state synchronization.',
    },
    {
      layer: 'Real-Time Edge & Messaging',
      technology: 'WebSockets + WebRTC + Signal E2EE Ratchet',
      rationale:
        'Sub-50ms message delivery, secure peer-to-peer audio/video streaming, and hardware screenshot protection.',
    },
    {
      layer: 'Backend Application Server',
      technology: 'Node.js 20 + Express API v1 + Google GenAI SDK',
      rationale:
        'RESTful modular routes, server-side Gemini 3.8 Flash studio, rate limiting, and automated security WAF.',
    },
    {
      layer: 'Data Storage & Persistence',
      technology: 'PostgreSQL 16 Relational Engine + JSON Audit Logs',
      rationale:
        'ACID transactions for creator wallet payouts, brand deals escrow, and verifiable credentials.',
    },
    {
      layer: 'Content Delivery & Storage',
      technology: 'Cloud CDN + WebP/AVIF Image Pipeline + HLS Video',
      rationale:
        'Adaptive streaming, automated thumbnails, and hardware-accelerated playback.',
    },
  ],
  databaseSchemaSql: `-- VibeSpace Production Relational DDL Schema
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
`,
};

export const UI_UX_GUIDELINES = {
  philosophy:
    'VibeSpace embraces modern tactile realism with a zero-pill aesthetic, deep slate contrasts, fluid 120Hz gesture navigation, and real-time visual feedback.',
  principles: [
    {
      title: 'Ultra-Fast 120Hz Responsiveness',
      details:
        'Zero jank on mobile viewports. Smooth spring transitions for story carousels, reel gestures, and bottom sheets.',
    },
    {
      title: 'High-Contrast Content Hierarchy',
      details:
        'Pure black / slate-950 foundation with vibrant violet, emerald, and amber accent signifiers that prioritize media and creator identities.',
    },
    {
      title: 'Contextual Creator Controls',
      details:
        'Professional creator dashboards, monetization stats, and team assignments tucked neatly into intuitive sliding drawers and hubs.',
    },
    {
      title: 'Privacy-First Visual Feedback',
      details:
        'Unambiguous status badges for E2EE signal encryption, dynamic forensic watermarking, and active screenshot alerts.',
    },
  ],
  instagramComparison: [
    {
      metric: 'DM Management',
      instagram: 'Basic Primary / General with limited filters',
      vibespace: 'Primary / General / Requests + Team assignment, custom labels, and saved replies',
    },
    {
      metric: 'Screenshot Privacy',
      instagram: 'Only notifies on vanishing DM photos',
      vibespace: 'Hardware FLAG_SECURE simulation + dynamic forensic watermarking & alert engine',
    },
    {
      metric: 'Creator Monetization',
      instagram: 'High fees, invite-only bonuses, fragmented payouts',
      vibespace: 'Integrated Creator Wallet (UPI/Bank), Brand Marketplace, Virtual Gifts, and 0% platform fee intro',
    },
    {
      metric: 'AI Creator Studio',
      instagram: 'Basic generative stickers',
      vibespace: 'Server-side Gemini 3.8 Flash for captions, hashtags, viral scripts, and smart replies',
    },
  ],
};

export const IMPLEMENTATION_ROADMAP: RoadmapItem[] = [
  {
    phase: 'Phase 1: Foundation & Security',
    duration: 'Sprint 1',
    status: 'Completed',
    tasks: [
      'Multi-account model (Personal, Creator, Business, Organization)',
      'Signal E2EE ratchet & screenshot protection framework',
      'Unified Express v1 backend with disk persistence & rate limiting',
    ],
  },
  {
    phase: 'Phase 2: Feed & Multimedia Studio',
    duration: 'Sprint 2',
    status: 'Completed',
    tasks: [
      'SmartFeed with multi-media cards, likes, comments, and bookmarking',
      'Full-screen vertical ReelsEngine with ambient synth soundtrack',
      'Stories creator with drawing canvas, stickers, text styles, and highlights',
    ],
  },
  {
    phase: 'Phase 3: Professional Messaging & Notes',
    duration: 'Sprint 3',
    status: 'Completed',
    tasks: [
      'MessengerHub with Primary, General, and Request folders',
      'Saved replies (/), automation rules, and internal team assignment',
      '24-hour horizontal Notes bar with audio track attachments',
    ],
  },
  {
    phase: 'Phase 4: Creator Economy & Marketplace',
    duration: 'Sprint 4',
    status: 'Completed',
    tasks: [
      'Creator Monetization Hub & Creator Wallet with UPI/Bank payouts',
      'Brand & Creator Marketplace with deal negotiation and escrow tracking',
      'Verified Business Marketplace for products, LUTs, and consulting',
    ],
  },
  {
    phase: 'Phase 5: Super App Modules & AI Studio',
    duration: 'Sprint 5',
    status: 'Completed',
    tasks: [
      'Server-side Gemini 3.8 Flash content generator in SuperAppHub',
      'Online learning courses with verifiable certificates',
      'Communities & Advertising Network with campaign analytics',
    ],
  },
  {
    phase: 'Phase 6: CI/CD Pipeline & Hardening',
    duration: 'Sprint 6',
    status: 'Active',
    tasks: [
      'GitHub Actions continuous integration with zero-error validation',
      'Automated bundle size optimization and lazy loading',
      'Multi-device responsive layout testing and regression verification',
    ],
  },
];

export const STARTER_CODE_SNIPPETS = {
  androidKotlin: `// Android Native Screen Security Implementation
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
}`,
  iosSwift: `// iOS Native Screen Security Implementation
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
}`,
  reactNativeBridge: `// React Native Screen Security Hook
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
};`,
  flutterPlugin: `// Flutter Screen Security Service
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
}`,
};
