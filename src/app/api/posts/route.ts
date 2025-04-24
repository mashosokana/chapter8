import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async () => {
  try {
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
      //作成日時の順で取得
      orderBy: {
        createdAt: 'desc',
      },
    })

    //レスポンスを返す
    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200})
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400})
  }
}