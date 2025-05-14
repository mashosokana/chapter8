import { NextRequest,NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import { assertAuth } from "@/app/_utils/assertAuth";

const prisma = new PrismaClient()

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string} }) => {
  try {
    await assertAuth(request)
    
    const postId = Number(params.id)
    if (isNaN(postId) || !params.id) {
      return NextResponse.json({ status: '無効なIDです'}, { status: 400})
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(params.id) },
      include: {
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
    })

    if (!post) {
      return NextResponse.json({ status: '記事が見つかりませんでした'},{ status: 404})
    }
    
    return NextResponse.json({ status: 'OK', post }, { status:  200 })  
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED')
      return NextResponse.json({ status: '認証エラー' }, { status: 401 })

    return NextResponse.json({ status: (error as Error).message }, { status:400})
  }
}

export const PUT =async (
  request:NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    await assertAuth(request)

    const { id } = params
    const { 
      title, 
      content, 
      categories, 
      thumbnailImageKey,
    }: UpdatePostRequestBody = await request.json()

    //記事の更新
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    //カテゴリの更新
    await prisma.postCategory.deleteMany({ where: { postId: parseInt(id) } })
    await prisma.postCategory.createMany({
      data: categories.map((c) => ({
        postId: post.id,
        categoryId: c.id,
      })), 
    })

    return NextResponse.json({ status: 'OK', post },{status: 200})
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED')
      return NextResponse.json({ status: '認証エラー' }, {status: 401 })

    return NextResponse.json({ status: (error as Error).message }, { status: 400})
  }
}




//DELETE
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try  {
    await assertAuth(request)

    await prisma.post.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ status: 'OK' }, {status: 200})
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED')
      return NextResponse.json({ status: '認証エラー' }, { status: 401 }) 

    return NextResponse.json({ status: (error as Error).message }, { status: 400})
  }
}

interface UpdatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailImageKey: string
}