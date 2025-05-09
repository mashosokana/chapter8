'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "../_components/Layout.module.css"
import { useRouteGuard } from "./_hooks/useRouteGuard"


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useRouteGuard()
  const pathname = usePathname()
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.sidebar}>
        <nav>
          <Link
            href="/admin/posts"
            className={isSelected('/admin/posts') ? "active " + styles.link : styles.link}
          >
            記事一覧
          </Link>
          <Link
            href="/admin/categories"
            className={isSelected('/admin/categories') ? "active " + styles.link : styles.link}
          >
            カテゴリー一覧
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>{children}</main>
    </div>
  )
}