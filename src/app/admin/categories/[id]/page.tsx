"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import styles from './page.module.css'
import { CategoryForm } from '../_components/CategoryForm'
import useSupabaseSession from "@/app/_hooks/useSupabaseSession"


export default function Page() {
  const [name, setName] = useState('')
  const { id } = useParams()
  const router = useRouter()
  const { token, isLoading  } = useSupabaseSession()

  useEffect(() => {
    if (isLoading || !token) return;

    const controller = new AbortController();

    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`,{
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,  
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          console.error("カテゴリーの取得に失敗しました");
          return;
        }
        const { category } = await res.json()
        console.log("取得したカテゴリー一覧", category);
        setName(category.name)
      } catch (error) {
        if ((error as Error).name !== 'abortError'){
          console.error("カテゴリーの取得エラー", error);
          alert("認証エラーです。もう一度ログインしてください。");
        }
      }  
    };

    fetchCategory();

    return () => controller.abort();
  }, [id, token, isLoading]);

  if (isLoading) return <p>認証情報を確認中...</p>
  if (!token) return <p>ログイン情報が見つかりません。</p>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("更新しました");
      }
  
      alert('カテゴリーを更新しました')
    } catch (error) {
      console.error(error)
      alert('更新エラーが発生しました')
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('カテゴリーを削除しますか？')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("削除しました");

      alert('カテゴリーを削除しました。');
      router.push('/admin/categories');
    } catch (err) {
      console.error(err);
      alert('削除エラーが発生しました')
    }
  }

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