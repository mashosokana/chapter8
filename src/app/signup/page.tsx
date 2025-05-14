'use client'

import { supabase } from "@/utils/supabase" //初期設定ファイル
import { useState } from "react"
import styles from "./page.module.css"


export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!supabase || !supabase.auth) {
      alert('Supabaseが正しく初期化されていません。')
      return
    }

    const { error } =await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    })
    if (error) {
      alert('登録に失敗しました')
    } else {
      setEmail('')
      setPassword('')
      alert('確認メールを送信しました。')
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label
          htmlFor="email" className={styles.label}>
        メールアドレス  
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className={styles.input}
          placeholder="name@comoany.com"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />    
        </div>

        <div>
          <label htmlFor="password" className={styles.label}>
           パスワード 
          </label>
          <input
          type="password"
          id="password"
          className={styles.input}
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />  
        </div>

        <div>
          <button type="submit" className={styles.button}>
            登録
         </button>  
        </div>
      </form>
    </div>
  )
}