"use client";

import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Link from "next/link";
import { MicroCmsPost } from "@/app/types/MicroCmsPost";


const Home: React.FC = () => {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  const [loading,setLoading] = useState<boolean>(true);

    useEffect (() => {
      const fetcher = async () => {
        setLoading(true);
        try {
          const res = await fetch("https://gungun.microcms.io/api/v1/blog", {
            headers: {
              'X-MICROCMS-API-KEY': process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,
            },
          })
          const { contents } = await res.json()
          setPosts(contents)
        } catch (error) {
          console.error("記事一覧の取得に失敗しました", error);
        }
        setLoading(false);
      };
      
      fetcher()
    }, [])
    
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
                        {post.categories.map((category, id) => (
                          <p key={id} className={styles.postCategory}>
                           {category.name}
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