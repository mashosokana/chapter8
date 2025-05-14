import { Category } from '@/types/Category';
import React, { useEffect, useState } from 'react';
import useSupabaseSession from '@/app/_hooks/useSupabaseSession';
import styles from './CategoriesSelect.module.css';

interface Props {
  selectedCategories: Category[]
  setSelectedCategories: (categories: Category[]) => void
}

export const CategoriesSelected: React.FC<Props> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const [categories,setCategories] = useState<Category[]>([]);
  const { token, isLoading  } = useSupabaseSession();

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      console.warn("認証トークンがみつかりません");
      return;
    }

    const fetcherCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("カテゴリー取得失敗");

          const { categories } = await res.json();
          setCategories(categories);
      } catch (error) {
        console.error("カテゴリーの取得エラー:", error);
      }
    };

    fetcherCategories();
  }, [token, isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map((option) => Number(option.value));
    const selected = categories.filter((category) => 
      selectedIds.includes(category.id)
    );
    setSelectedCategories(selected);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        カテゴリーを選択
      </label>
      <select
        multiple
        value={selectedCategories.map((c) => c.id.toString())}
        onChange={handleChange}
        className={styles.select}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id} className={styles.option}>
            {category.name}
          </option>
        ))}
      </select>
      <p className={styles.helperText}>複数選択できます</p>  
    </div>
  );
};
