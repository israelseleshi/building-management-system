'use client'

import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  dark?: boolean
  compact?: boolean
  className?: string
}

export function BrandLogo({ dark = false, compact = false, className }: BrandLogoProps) {
  const primary = dark ? '#FFFFFF' : '#1F3549'
  const accent = '#42D3BB'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        style={{
          width: compact ? 30 : 36,
          height: compact ? 30 : 36,
          borderRadius: 10,
          background: dark
            ? 'linear-gradient(145deg, rgba(255,255,255,0.2), rgba(255,255,255,0.06))'
            : 'linear-gradient(145deg, #1f3549, #2b5673)',
          border: dark ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(31,53,73,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: dark ? '0 8px 20px rgba(0,0,0,0.2)' : '0 8px 20px rgba(31,53,73,0.18)',
        }}
      >
        <Building2 style={{ width: compact ? 15 : 18, height: compact ? 15 : 18, color: dark ? 'white' : accent }} />
        <span
          style={{
            position: 'absolute',
            bottom: 3,
            right: 3,
            width: compact ? 6 : 7,
            height: compact ? 6 : 7,
            borderRadius: 999,
            backgroundColor: accent,
          }}
        />
      </div>
      <div className="leading-none">
        <div style={{ fontSize: compact ? '0.95rem' : '1.15rem', fontWeight: 800, color: primary, letterSpacing: '-0.02em' }}>
          BMS
        </div>
        {!compact && (
          <div style={{ fontSize: '0.62rem', fontWeight: 600, color: dark ? 'rgba(255,255,255,0.8)' : '#5f6f85', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Building OS
          </div>
        )}
      </div>
    </div>
  )
}

