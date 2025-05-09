import { Category } from '@/types/Category';
import React, { useEffect, useState } from 'react';

interface Props {
  selectedCategories: Category[]
  setSelectedCategories: (categories: Category[]) => void
}

export const CategoriesSelected: React.FC<Props> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const [categories,setCategories] = useState<Category[]>([]);

  

  useEffect(() => {
    const fetcher = async () => {
      const res =await fetch('/api/admin/categories');
      const { categories } = await res.json();
      setCategories(categories);
    };

    fetcher();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map((option) => Number(option.value));
    const selected = categories.filter((category) => 
      selectedIds.includes(category.id)
    );
    setSelectedCategories(selected);
  };

  return (
    <div className='mb-4'>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        カテゴリーを選択
      </label>
      <select
        multiple
        value={selectedCategories.map((c) => c.id.toString())}
        onChange={handleChange}
        className='w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <p className='text-xs text-gray-500 mt-1'></p>  
    </div>
  );
};