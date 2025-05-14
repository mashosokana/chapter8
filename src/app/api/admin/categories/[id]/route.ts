import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
import { assertAuth } from "@/app/_utils/assertAuth";

const prisma = new PrismaClient()

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    await assertAuth(request);

    const { id } = params;
    const category = await prisma.category.findUnique({
      where: {id: Number(id),},
    });

    if (!category) {
      return NextResponse.json({ status: 'カテゴリが見つかりませんでした' }, { status: 404 })
    }

    return NextResponse.json({ status: 'OK', category }, { status: 200 }) 
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      console.warn("認証エラー", error);
      return NextResponse.json({ status: '認証エラー'}, {status: 401})
    } else {
      console.error("era-");
      return NextResponse.json({ status: (error as Error).message }, { status: 400 })
    }
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string} },
) => { 
  try {
    await assertAuth(request);

    const { id } = params
    const { name } = await request.json()
  
    const category = await prisma.category.update({
      where: {id: Number(id) },
      data: { name },
    });

    return NextResponse.json({ status: 'OK', category }, { status: 200});
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: '認証エラー' }, {status: 401});
    }
      return NextResponse.json({ status: (error as Error).message }, { status: 400});
  }
};



export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    await assertAuth(request);
  
    const { id } = params
    await prisma.category.delete({
      where: {id: Number(id) },
    });

    return NextResponse.json({ status: 'OK' }, { status: 200 })
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: '認証エラー' }, { status: 401 });
    }
    return NextResponse.json({ status: (error as Error).message }, { status: 400 });
  }
};