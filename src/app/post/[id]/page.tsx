"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "./Page.module.scss";


type Post = {
  thumbnailUrl: string;
  createdAt: string;
  title: string;
  content: string;
  id: string;
  categories: string[];
}

const DetailsPage: React.FC =() => {

  const params = useParams();
  const id = params?.id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    const fetcher =async () => {
      try {
        const res = await fetch(
          `https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`
        );
        const data = await res.json();
        console.log("取得した記事データ", data);
        setPost(data.post);
      } catch (error) {
        console.error("記事の詳細の取得に失敗しました",error);
      }
      setLoading(false);
    };

    fetcher();
  },[id]);

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (!post) {
    return <div>記事が見つかりません</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.post}>
        <div className={styles.postImage}>
          <Image
            height={400}
            width={800}
            src={post.thumbnailUrl}
            alt= ""
            className={styles.img}
          />  
        </div>
        <div className={styles.postContent}>
          <div className={styles.postInfo}>
            <div className={styles.postData}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className={styles.postCategories}>
              {post.categories.map((category) => (
                  <div key={category} className={styles.postCategory}>
                    {category}
                  </div> 
              ))}
            </div>
          </div>
          <div className={styles.postTitle}>{post.title}</div>
          <div
            className={styles.postBody}
            dangerouslySetInnerHTML={{__html: post.content }} 
          />
        </div>
      </div>
    </div>          
  );
};

export default DetailsPage;