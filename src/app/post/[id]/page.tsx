"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "./Page.module.scss";
import { Post } from "@/types/post";
import { supabase } from "@/utils/supabase";


const DetailsPage: React.FC =() => {

  const params = useParams();
  const id = params?.id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetcher =async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        console.log("取得した記事データ", data);
      
        setPost(data.post);

        if (data.post.thumbnailImageKey) {
          const { data: imageData } = await supabase.storage
            .from("post-thumbnail")
            .getPublicUrl(data.post.thumbnailImageKey);
          
          if (imageData.publicUrl) {
            console.log("サムネイルURL", imageData.publicUrl);
            setThumbnailImageUrl(imageData.publicUrl);
          } else {
            console.warn("公開URLが取得できていませんでした");
          }
        } 
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
            src={
              thumbnailImageUrl ?? 'https://placehold.jp/800x400.png'
            }
            alt= "サムネイル"
            className={styles.img}
          />  
        </div>
        <div className={styles.postContent}>
          <div className={styles.postInfo}>
            <div className={styles.postData}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className={styles.postCategories}>
              {post.postCategories.map(({ category }) => (
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