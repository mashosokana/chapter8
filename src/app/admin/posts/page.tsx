"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Post } from "@/types/post"
import styles from './page.module.css'
import useSupabaseSession from "@/app/_hooks/useSupabaseSession"



export default function Page() {
  const [posts,setPosts] = useState<Post[]>([])
  const { token } = useSupabaseSession()

  useEffect(() => {
    if (!token) return

    const fetcher = async () => {
      const res = await fetch('/api/admin/posts', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      const { posts } = await res.json()
      setPosts([...posts])
    }

    fetcher()
  }, [token])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>記事一覧</h1>
        <Link href="/admin/posts/new" className={styles.newButton}>
          新規作成
        </Link>
      </div>

      <div className={styles.postList}>
        {posts.map((post) => (
          <Link href={`/admin/posts/${post.id}`} key={post.id}>
            <div className={styles.postItem}>
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}