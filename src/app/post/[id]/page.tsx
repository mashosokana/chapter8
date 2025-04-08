"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "./Page.module.scss";
import { MicroCmsPost } from "@/app/types/MicroCmsPost";

const DetailsPage: React.FC =() => {

  const params = useParams();
  const id = params?.id;

  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    const fetcher =async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://gungun.microcms.io/api/v1/blog/${id}`,
          {
            headers: {
              'X-MICROCMS-API-KEY': process.env
            .NEXT_PUBLIC_MICROCMS_API_KEY as string,
            },
          },
        );
        const data = await res.json();
        console.log("取得した記事データ", data);
        setPost(data);
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
            src={post.thumbnail.url}
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
                  <div key={category.id} className={styles.postCategory}>
                    {category.name}
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