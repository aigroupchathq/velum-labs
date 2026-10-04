import React, { useState, useRef, useEffect } from 'react'
import type { Match, Message, Profile } from '../types'
import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  Video,
  Send,
  Smile,
  Image as ImageIcon,
  Info,
} from 'lucide-react'

interface ChatViewProps {
  match: Match
  messages: Message[]
  onSendMessage: (matchId: string, text: string, isGif?: boolean, mediaUrl?: string) => void
  onBack: () => void
  onViewProfile: (profile: Profile) => void
  isTyping: boolean
}

export const ChatView: React.FC<ChatViewProps> = ({
  match,
  messages,
  onSendMessage,
  onBack,
  onViewProfile,
  isTyping,
}) => {
  const [inputText, setInputText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages or typing change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim()) return
    onSendMessage(match.id, inputText.trim())
    setInputText('')
    setShowEmojiPicker(false)
  }

  const handleSendGif = () => {
    // Send a fun greeting GIF
    const gifs = [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=500&q=80',
    ]
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)]
    onSendMessage(match.id, 'Sent a GIF', true, randomGif)
  }

  const quickEmojis = ['❤️', '🔥', '😂', '✨', '☕', '👋', '😍', '🍷']

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111418] relative z-20">
      {/* Chat Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-[#111418]/95 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div
            onClick={() => onViewProfile(match.profile)}
            className="relative cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-rose-500/80 shadow-sm group-hover:scale-105 transition">
              <img
                src={match.profile.photos[0]}
                alt={match.profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#111418] rounded-full"></span>
          </div>

          {/* Name & Status */}
          <div onClick={() => onViewProfile(match.profile)} className="cursor-pointer">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1 leading-tight">
              {match.profile.name}
              {match.profile.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
              )}
            </h3>
            <span className="text-[11px] text-emerald-500 font-medium">Online now</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-gray-400">
          <button
            onClick={() => alert('Video calling is available for verified matches!')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            title="Video Call"
          >
            <Video className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={() => alert('Audio calling is available for verified matches!')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            title="Audio Call"
          >
            <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={() => onViewProfile(match.profile)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            title="View Profile Details"
          >
            <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Match Profile Welcome Card */}
        <div className="flex flex-col items-center text-center py-6 border-b border-gray-100 dark:border-gray-800/80">
          <div
            onClick={() => onViewProfile(match.profile)}
            className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-rose-500 mb-2 cursor-pointer hover:scale-105 transition"
          >
            <img
              src={match.profile.photos[0]}
              alt={match.profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            You matched with {match.profile.name}
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            Matched {match.matchedAt} • {match.profile.distance} miles away
          </p>

          {match.profile.passions && (
            <div className="flex flex-wrap justify-center gap-1 mt-3 max-w-xs">
              {match.profile.passions.map((p) => (
                <span
                  key={p}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Messages List */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user'
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-brand-gradient text-white rounded-br-xs'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-xs'
                }`}
              >
                {msg.mediaUrl && (
                  <div className="rounded-xl overflow-hidden mb-2 max-w-xs">
                    <img
                      src={msg.mediaUrl}
                      alt="Media"
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  </div>
                )}
                <p>{msg.text}</p>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          )
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
              <img
                src={match.profile.photos[0]}
                alt={match.profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 py-2 px-3 rounded-2xl rounded-bl-xs flex items-center gap-1 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker Shortcuts Bar */}
      {showEmojiPicker && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/90 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 overflow-x-auto">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setInputText((prev) => prev + emoji)
              }}
              className="text-xl p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Message Input Bottom Bar */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111418] shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* GIF button */}
          <button
            type="button"
            onClick={handleSendGif}
            className="p-2 text-gray-400 hover:text-rose-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Send GIF"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-400 hover:text-amber-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Emoji shortcuts"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Input text */}
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-full bg-brand-gradient text-white disabled:opacity-40 hover:shadow-md transition active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
