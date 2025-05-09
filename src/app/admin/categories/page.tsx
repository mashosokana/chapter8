'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Category } from "@/types/Category"
import styles from './page.module.css'

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetcher =async () => {
      const res =await fetch('/api/admin/categories')
      const { categories } = await res.json()
      setCategories(categories)
    }

    fetcher()
  },[])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>カテゴリー一覧</h1>
        <Link href="/admin/categories/new" className={styles.newButton}>
          新規作成
        </Link>
      </div>

      <div className={styles.categoryList}>
        {categories.map((category) => (
          <Link href={`/admin/categories/${category.id}`} key={category.id}>
            <div className={styles.categoryItem}>
              <div className={styles.categoryName}>{category.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}