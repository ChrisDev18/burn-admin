'use server'

import { deleteSession } from '@/app/api/auth/session'
import { redirect } from 'next/navigation'

export async function logoutAction() {
  await deleteSession();
  redirect('/');
}