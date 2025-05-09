"use client"

import React from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import useSupabaseSession  from "@/app/_hooks/useSupabaseSession";
import { supabase } from "@/utils/supabase";

export const Header: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const { session, isLoading} = useSupabaseSession()
  
  return(
    <header className={styles.header}>
      <Link href="/" className={styles.Link}>
        Blog
      </Link>
      {!isLoading && (
        <div className={styles.nav}>
          {session ? (
            <>
              <Link href="/admin" className={styles.link}>
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
           </>
          ) : (
            <>
              <Link href="/contact" className={styles.link}>
                お問い合わせ
              </Link> 
              <Link href="/login" className={styles.link}>
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}