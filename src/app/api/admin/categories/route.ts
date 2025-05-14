import { PrismaClient } from '@prisma/client'
import {  NextResponse, NextRequest } from "next/server"
import { assertAuth } from "@/app/_utils/assertAuth";

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
  try {
    await assertAuth(request)

    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({status: 'OK', categories}, { status: 200})
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: '認証エラー'}, { status: 401})
    }
    return NextResponse.json({ status: (error as Error).message }, { status: 400 })
  }
}

//POST: 管理者_カテゴリー新規作成API

interface CreateCategoryRequestBody {
  name:string
}

export const POST = async (request: NextRequest) => {
  try {
    await assertAuth(request)

    const body = await request.json()

    const { name }: CreateCategoryRequestBody = body

    const data = await prisma.category.create({
      data: { 
        name,
       },
    })

    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    }, { status: 200 })
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: '認証エラー' }, {status: 401})
    }
    return NextResponse.json({ status: (error as Error).message }, { status: 400 })
  }
}

