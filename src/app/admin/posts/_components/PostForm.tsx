import { useState, useEffect, ChangeEvent } from "react"
import { Category } from "@/types/Category"
import { CategoriesSelected } from './CategoriesSelect'
import styles from "./PostForm.module.css"
import { supabase } from "@/utils/supabase"
import { v4 as uuidv4 } from "uuid"
import Image from "next/image"

interface Props {
  mode: 'new' | 'edit'
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  thumbnailImageKey: string
  setThumbnailImageKey: (key: string) => void
  categories: Category[]
  setCategories:(categories: Category[]) => void
  onSubmit: (e: React.FormEvent) => void
  onDelete?: () => void
}



export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  onSubmit,
  onDelete,
}) => {
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null)

  //アップロード処理
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>,) => {
    if (!event.target.files || event.target.files.length === 0) return 

    const file = event.target.files[0]
    const filePath = `private/${uuidv4()}`

    const  { data, error } = await supabase.storage
      .from('post-thumbnail')
      .upload(filePath,file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      alert(`アップロード失敗: ${error.message}`)
      return
    }

    console.log("アップロード完了: ", data.path)
    setThumbnailImageKey(data.path)
  }

  //サムネイル画像のURLを取得
  useEffect(() => {
    if (!thumbnailImageKey) return

    const fetcher =async () => {
      console.log("URL取得開始: ", thumbnailImageKey)
      const { data } = await supabase.storage
        .from("post-thumbnail")
        .getPublicUrl(thumbnailImageKey)
      if (data.publicUrl) {
        console.log("公開URL取得: ", data.publicUrl)
        setThumbnailImageUrl(data.publicUrl)  
      }
    }

    fetcher()
  }, [thumbnailImageKey])

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>タイトル</label>
        <input
          id="title"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>内容</label>
        <textarea
          id="content"
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label 
          htmlFor="thumbnailImage" 
          className={styles.label}>
            サムネイルURL
        </label>
        <input
          id="thumbnailImageKey"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {thumbnailImageUrl ? (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={200}
              height={200}
              className={styles.thumbnailImage}
            />
          </div>
        ): (
          <div className="mt-2">
            <Image
              src="https://placehold.jp/800x400.png"
              alt="placeholder"
              width={200}
              height={200}
              className={styles.thumbnailImage}
            />
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>カテゴリー</label>
        <CategoriesSelected
          selectedCategories={categories}
          setSelectedCategories={setCategories}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitButton}>
          {mode === "new" ? "作成" : "更新"}
        </button>
        {mode === "edit" && (
          <button type="button" className={styles.deleteButton} onClick={onDelete}>
            削除
          </button>
        )}
      </div>
    </form>
  )
}