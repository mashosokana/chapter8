import { PrismaClient } from '@prisma/client'
import {  NextResponse } from "next/server"

const prisma = new PrismaClient()

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({status: 'OK', categories}, { status: 200})
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message}, { status: 400})
    }
  }
}

//POST: 管理者_カテゴリー新規作成API

interface CreateCategoryRequestBody {
  name:string
}

export const POST = async (request: Request) => {
  try {
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
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, {status: 400})
    }
  }
}

