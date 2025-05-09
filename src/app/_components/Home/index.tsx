"use client";

import React, { useState, useEffect } from "react";
import styles from "../Home/Home.module.css";
import Link from "next/link";

type Post = {
  id: string;
  createdAt: number;
  categories: string[];
  title: string;
  content: string;
}

const Home: React.FC = () => {
  const [posts, stePosts] = useState<Post[]>([]);
  const [loading,setLoading] = useState<boolean>(true);

    useEffect (() => {
      const fetcher = async () => {
        try {
          const res = await fetch(
            "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts"
          );
          const data = await res.json();
          console.log("取得したデータ", data);
          stePosts(data.posts);
        } catch (error) {
          console.error("記事一覧の取得に失敗しました",error);
        }
        setLoading(false);
      };
      fetcher();
    },[]);
    
    if (loading) {
      return <div>読み込み中...</div>;
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
                          {post.categories.map((category: string, id: number) => (
                           <p key={id} className={styles.postCategory}>
                             {category.trim()}
                            </p>
                          ))}
                        </div>
                      </div>
                      <p className={styles.postTotle}>{post.title}</p>
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