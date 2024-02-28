'use client'

import * as React from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import { ServerActionResult, type Chat } from '@/lib/types'
import {
  AlertDialog,
  AlertDialogProps,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { IconSpinner } from '@/components/ui/icons'

interface ChatDeleteDialogProps extends AlertDialogProps {
  chat: Pick<Chat, 'id'>
  onDelete: () => void
  removeChat: (id: string) => ServerActionResult<void>
}

export function ChatDeleteDialog({
  chat,
  onDelete,
  removeChat,
  ...props
}: ChatDeleteDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your chat message and remove your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={event => {
              event.preventDefault()
              startTransition(async () => {
                const result = await removeChat(chat.id)

                if (result && 'error' in result) {
                  toast.error(result.error)
                  return
                }

                router.push('/')
                toast.success('Chat deleted')
                onDelete()
              })
            }}
          >
            {isPending && <IconSpinner className="mr-2 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
