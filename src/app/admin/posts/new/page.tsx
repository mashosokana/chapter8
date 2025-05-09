"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PostForm } from "../_components/PostForm"
import { Category } from "@/types/Category"
import useSupabaseSession from "@/app/_hooks/useSupabaseSession"
import styles from "./page.module.css"

export default function Page() {
  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
  const [thumbnailImageKey,setThumbnailImageKey] = useState('')
  const [categories,setCategories] = useState<Category[]>([])
  const { token } = useSupabaseSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      alert('認証が切れてます。再ログインしてください')
      return
    }


    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, thumbnailImageKey, categories }),
    })

    if (!res.ok) {
      alert('記事の作成に失敗しました')
      return
    }

    const { id } = await res.json()

    router.push(`/admin/posts/${id}`)

    alert('記事を作成しました')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>記事作成</h1>
      </div>
      
      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        />
    </div>
  )
}