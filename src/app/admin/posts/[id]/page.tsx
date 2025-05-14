'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useSupabaseSession from "@/app/_hooks/useSupabaseSession"
import { PostForm } from "../_components/PostForm"
import { Category } from "@/types/Category"
import { Post } from '@/types/post'
import styles from './page.module.css'
import { supabase } from "@/utils/supabase"
import Image from "next/image"


export default function Page() {
  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
  const [thumbnailImageKey,setThumbnailImageKey] = useState('')
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null)
  const [categories,setCategories] = useState<Category[]>([])
  const [isloading, setIsloading] = useState(true)

  const { id } = useParams()
  const router = useRouter()
  const { token, isLoading } = useSupabaseSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      alert('ログインが切れてます')
      return
    }

    await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, thumbnailImageKey, categories }),
    })

    alert('記事を更新しました。')
  }

  const handleDeletePost = async () => {
    if (!confirm('記事を削除しますか？')) return
    if (!token) {
      alert('ログインが切れてます')
      return
    }

    await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`},
    })

    alert('記事を削除しました。')
    router.push('/admin/posts')
  }

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      console.warn("認証トークンがみつかりません");
      return;
    }

    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`,{
          headers: { Authorization: `Bearer ${token}`},
        });
        
        if (!res.ok) {
          const { status } = await res.json()
          alert(`取得失敗: ${status}`)
          router.replace('/admin/posts')
          return
        }
        
        const { post }: { post: Post } = await res.json()
        console.log("取得した記事データ:", post)
        
        setTitle(post.title)
        setContent(post.content)
        setThumbnailImageKey(post.thumbnailImageKey ?? '')
        setCategories(post.postCategories.map((pc) => pc.category))
        
        if (post.thumbnailImageKey) {
          const { data } =  await supabase.storage
            .from("post-thumbnail")
            .getPublicUrl(post.thumbnailImageKey)
  
         if (data.publicUrl) {
            console.log("公開URL取得:", data.publicUrl)
            setThumbnailImageUrl(data.publicUrl)
          } 
        }
        
        setIsloading(false);

      } catch (error) {
        console.error("記事取得エラー", error);
        setIsloading(false);
      }
    };

    fetcher();
  }, [id, token, isLoading, router]);

  if (isloading) return <p>loading...</p>

  return (
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h1 className={styles.heading}>記事編集</h1>
      </div>
      
      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
      />

      {thumbnailImageUrl ? (
        <div className="mt-4">
          <Image 
            src={thumbnailImageUrl} 
            alt="サムネイル"
            width={400}
            height={300} 
          />
        </div>
      ) : (
        <div className="mt-4">
          <Image
            src="https://placehold.jp/800x400.png" 
            alt="プレビューなし" 
            width={400} 
            height={300}
          />
        </div>
      )}  
    </div>
  )
}