'use client'
import { useRouter } from "next/navigation"
import { FilledButton } from "@/components/buttons/filledButton"

export default function() {
  const router = useRouter()
  return (
    <div>
      <FilledButton onClick={() => router.push("/createGuide")}>Create Guide</FilledButton>
    </div>
  )
}