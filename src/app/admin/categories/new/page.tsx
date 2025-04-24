'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import styles from './page.module.css'


export default function Page() {
  const [name,setName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name}),
    })

    const { id } = await res.json()
    
    router.push(`/admin/categories/${id}`)

    alert('カテゴリーを作成しました。')
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>カテゴリー作成</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <label htmlFor="name" className={styles.label}>カテゴリー名</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submitButton}>作成</button>
      </form>
    </div>
  )
}