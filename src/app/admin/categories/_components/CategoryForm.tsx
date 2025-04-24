import React from "react"
import styles from "./CategoryForm.module.css"

interface Props {
  mode: 'new' | 'edit'
  name: string
  setName:(title: string) => void
  onSubmit: (e: React.FormEvent) => void
  onDelete?: () => void
}

export const CategoryForm: React.FC<Props> = ({
  mode,
  name,
  setName,
  onSubmit,
  onDelete,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inputWrapper}>
        <label htmlFor="title" className={styles.label}>
          カテゴリー名
        </label>
        <input
          type="text"
          id="title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
      </div>

      <button type="submit" className={styles.button}>
        {mode === 'new' ? '作成' : '更新'}
      </button>

      {mode === 'edit' && (
        <button
          type="button"
          className={`${styles.button} ${styles.deleteButton}`}
          onClick={onDelete}
        >
          削除
        </button>
      )}
    </form>
  )
}