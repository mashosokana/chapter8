'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import styles from './page.module.css'
import useSupabaseSession from "@/app/_hooks/useSupabaseSession"

interface Category {
  id: number
  name: string
}
const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, isLoading } = useSupabaseSession();
  
  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      console.warn("認証トークンがみつかりません");
      setLoading(false);
      return;
    }

    const fetcher = async () => {      
      try {
        const res = await fetch('/api/admin/categories', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          console.error("カテゴリーの取得に失敗しました");
          setCategories([]);
          return;
        }

        const { categories } = await res.json();
        setCategories(categories ?? []);
      } catch (error) {
        console.error('カテゴリーの取得エラー:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetcher()
  },[token, isLoading]);

  if (loading) return <p>ロード中...</p>;

  if (categories.length === 0) {
    return <p>カテゴリーが見つかりませんでした</p>
  }
  
  return (
    <div className={styles.categoryList}>
       {categories.map((category) => (
        <Link href={`/admin/categories/${category.id}`} key={category.id}>
          <div className={styles.categoryItem}>
            <div className={styles.categoryName}>{category.name}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default CategoriesPage;