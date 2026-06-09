'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="border-b border-gray-800 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono font-bold text-green-400 text-lg">
          <span className="text-gray-500">{'>'}</span> Quiz SQL
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/ranking" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
            Ranking
          </Link>
          {user ? (
            <>
              <Link
                href="/quiz"
                className="text-sm bg-green-500 hover:bg-green-400 text-gray-950 font-semibold px-4 py-1.5 rounded-lg transition-colors"
              >
                Jogar
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-green-500 hover:bg-green-400 text-gray-950 font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
