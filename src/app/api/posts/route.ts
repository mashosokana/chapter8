import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async () => {
  try {
    console.log("記事一覧を取得中...");

    const posts = await prisma.post.findMany({
      include:{
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log("📝 記事一覧:", posts);

    if (!posts || posts.length === 0) {
      console.warn("記事が見つかりません")
      return NextResponse.json({ status: '記事が見つかりませんでした' }, { status: 404 })
    }
    
    //レスポンスを返す
    return NextResponse.json({status: 'OK', posts }, { status: 200 })        
  } catch (error) {
    console.error("エラー:", (error as Error).message)
    return NextResponse.json({ status: `エラーが発生しました: ${(error as Error).message}` }, { status: 400})
  }
}