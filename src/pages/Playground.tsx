import { useState, useRef } from 'react'
import DialogBox from '../components/DialogBox'

type Nodes = {
  [k: string]: {
    text: string
    responses: { text: string; nextId?: string; action?: any }[]
    autoNext?: string
  }
}

export default function Playground() {
  const [open, setOpen] = useState(false)
  const [nodes, setNodes] = useState<Nodes>({ start: { text: '', responses: [] } })
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const buildNodes = (prompt: string): Nodes => {
    const ai = `Réponse auto: ${prompt.toUpperCase()}`
    const summary =
      prompt.length > 140 ? `Résumé: ${prompt.slice(0, 140)}…` : `Résumé: ${prompt}`
    return {
      start: {
        text: `Message: ${prompt}\nQue veux-tu faire ?`,
        responses: [
          { text: 'Réponse auto', nextId: 'ai' },
          { text: 'Résumé', nextId: 'summary' },
          { text: 'Nouvelle question', action: { type: 'emit', event: 'new_question' } },
          { text: 'Fermer', action: { type: 'close' } },
        ],
      },
      ai: {
        text: ai,
        responses: [
          { text: 'Encore (reformuler)', nextId: 'ai2' },
          { text: 'Nouvelle question', action: { type: 'emit', event: 'new_question' } },
          { text: 'Fermer', action: { type: 'close' } },
        ],
      },
      ai2: {
        text: `Variation: ${prompt.split('').reverse().join('')}`,
        responses: [
          { text: 'Revenir', nextId: 'start' },
          { text: 'Nouvelle question', action: { type: 'emit', event: 'new_question' } },
          { text: 'Fermer', action: { type: 'close' } },
        ],
      },
      summary: {
        text: summary,
        responses: [
          { text: 'Revenir', nextId: 'start' },
          { text: 'Nouvelle question', action: { type: 'emit', event: 'new_question' } },
          { text: 'Fermer', action: { type: 'close' } },
        ],
      },
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const p = input.trim()
    if (!p) return
    setNodes(buildNodes(p))
    setOpen(true)
  }

  const handleAction = (a: any) => {
    if (!a) return
    switch (a.type) {
      case 'emit':
        if (a.event === 'new_question') {
          setOpen(false)
          setTimeout(() => inputRef.current?.focus(), 0)
        }
        break
      case 'close':
      default:
        break
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tape un message…"
          className="flex-1 px-3 py-2 rounded border border-neutral-700 bg-neutral-900 text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-500"
        >
          Valider
        </button>
      </form>

      {open && (
        <DialogBox
          dialogueNodes={nodes}
          initialNodeId="start"
          onAction={handleAction}
          onDialogueEnd={() => setOpen(false)}
        />
      )}

      <div className="mt-4">
        {Array.from({ length: 100 }, (_, i) => (
          <p key={i}>Index: {i}</p>
        ))}
      </div>
    </div>
  )
}
