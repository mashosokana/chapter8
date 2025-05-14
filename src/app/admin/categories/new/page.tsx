'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import styles from './page.module.css'
import { CategoryForm } from '../_components/CategoryForm'
import useSupabaseSession from "@/app/_hooks/useSupabaseSession"

export default function Page() {
  const [name,setName] = useState('')
  const router = useRouter()
  const { token } = useSupabaseSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

      <CategoryForm
        mode="new"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
      />  
    </div>
  )
}