import { Category } from "@/types/Category"
import React from "react"
import { CategoriesSelected } from './CategoriesSelect'
import styles from "./PostForm.module.css"

interface Props {
  mode: 'new' | 'edit'
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  thumbnailUrl: string
  setThumbnailUrl: (thumbnailUrl: string) => void
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
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  setCategories,
  onSubmit,
  onDelete,
}) => {
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
        <label htmlFor="thumbnailUrl" className={styles.label}>サムネイルURL</label>
        <input
          id="thumbnailUrl"
          className={styles.input}
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
        />
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