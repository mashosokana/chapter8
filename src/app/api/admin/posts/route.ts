import { PrismaClient } from '@prisma/client'
import { NextRequest,NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const prisma = new PrismaClient()

export const GET = async (request:NextRequest) => {
  const token = request.headers.get('Authorization') ?.replace('Bearer ', '') ?? ''

  const supabase = supabaseServer(token)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ status: '認証エラー' }, {status: 401 })

  }
  try {
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            }
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ status: 'OK', posts: posts }, {status: 200 })
  } catch (error) {
    console.error('*/api/postsでエラー', error);
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, {status: 400 })
  }
}

interface CreatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailImageKey: string
}

export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ??''
  const supabase = supabaseServer(token)
  const { data: { user }, error } = await supabase.auth.getUser()

  if ( error || !user) {
    return NextResponse.json({ status: '認証エラー' },{ status: 401 })
  }

  try {
    const body = await request.json()

    const { title, content, categories, thumbnailImageKey }: CreatePostRequestBody = body

    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      })
    }

    return NextResponse.json ({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}