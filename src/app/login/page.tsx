'use client'

import { supabase } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import styles from "./page.module.css"

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { error} = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('ログインに失敗しました')
    } else {
      router.replace('/admin/posts')
    }
  }

  return(
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
              placeholder="name@company.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div>
          <label
            htmlFor="password"
            className={styles.label}
          >
            パスワード
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="********"
            className={styles.input}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button type="submit" className={styles.button}>
             ログイン
          </button>
        </div>
      </form>
    </div>
  )
}