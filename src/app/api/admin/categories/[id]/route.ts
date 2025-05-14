import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
import { supabaseServer } from "@/lib/supabase-server"
import { SupabaseClient } from "@supabase/supabase-js"

const prisma = new PrismaClient()

//認証処理の追加
async function assertAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
  const supabase = supabaseServer(token) as SupabaseClient

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    console.error("認証エラー", error)
    throw new Error("UNAUTHORIZED")
  }
}

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