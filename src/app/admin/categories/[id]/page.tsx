"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import styles from './page.module.css'
import { CategoryForm } from '../_components/CategoryForm'

export default function Page() {
  const [name, setName] = useState('')
  const { id } = useParams()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })

    alert('カテゴリーを更新しました。')
  }

  const handleDeletePost = async () => {
    if (!confirm('カテゴリーを削除しますか？')) return

    await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    })

    alert('カテゴリーを削除しました。')

    router.push('/admin/categories')
  }


  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`)
      const { category } = await res.json()
      setName(category.name)
    }

    fetcher()
  },[id])

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>カテゴリー編集</h1>
      <CategoryForm
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        />  
    </div>
  )
}