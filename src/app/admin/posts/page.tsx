"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Post } from "@/types/post"
import styles from './page.module.css'


export default function Page() {
  const [posts,setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/admin/posts')
      const { posts } = await res.json()
      setPosts(posts)
    }

    fetcher()
  }, [])

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