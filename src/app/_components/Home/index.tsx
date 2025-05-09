"use client";

import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Link from "next/link";
import { Post } from "@/types/post";


const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading,setLoading] = useState<boolean>(true);

    useEffect (() => {
      const fetcher = async () => {
        setLoading(true);
        try {
          console.log("記事一覧を取得中...");
          const res = await fetch(`/api/posts`);

          if (!res.ok) {
            console.error('一覧取得でステータスError', res.status);
            setPosts([]);
            return;
          }

          const data = await res.json();
          console.log("取得した記事一覧", data);

          if (data.posts) {
            setPosts(data.posts);
          } else {
            console.warn("記事が存在しません");
            setPosts([]);
          }
        } catch (error) {
          console.error("記事一覧の取得に失敗しました", error);
          setPosts([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetcher()
    }, [])
    
    if (loading) {
      return <div>読み込み中...</div>;
    }

    if (posts.length === 0) {
      return <div>記事が見つかりません</div>;
    }

  return (
    <div>
      <ul className={styles.container}>
        {posts.map((post) => (
            <li key={post.id} className={styles.list}>
              <Link href={`/post/${post.id}`} className={styles.ling}>
                  <div className={styles.post}>
                    <div className={styles.postContent}>
                      <div className={styles.postInfo}>
                        <div className={styles.postDate}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className={styles.postCategories}>
                        {(post.postCategories || []).map((pc, id) => (
                          <p key={id} className={styles.postCategory}>
                           {pc.category.name}
                          </p>
                        ))}  
                        </div>
                      </div>
                      <p className={styles.postTitle}>{post.title}</p>
                      <div 
                        className={styles.postBody}
                        dangerouslySetInnerHTML={{__html:post.content}} 
                      />
                    </div>
                  </div>
              </Link>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;