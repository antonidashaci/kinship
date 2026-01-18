"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Plus, Check, Trash2, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import type { ShoppingItem, ShoppingCategory } from "@/lib/types"

interface ShoppingListClientProps {
    items: ShoppingItem[]
    currentUserId: string
    familyId: string
}

const categories: { value: ShoppingCategory; label: string; icon: string }[] = [
    { value: "groceries", label: "Groceries", icon: "🥦" },
    { value: "household", label: "Household", icon: "🏠" },
    { value: "personal", label: "Personal", icon: "🧴" },
    { value: "general", label: "General", icon: "📦" },
]

export function ShoppingListClient({
    items: initialItems,
    currentUserId,
    familyId,
}: ShoppingListClientProps) {
    const [items, setItems] = useState<ShoppingItem[]>(initialItems)
    const [newItem, setNewItem] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<ShoppingCategory>("groceries")
    const [showPurchased, setShowPurchased] = useState(false)
    const [isAdding, setIsAdding] = useState(false)

    const unpurchasedItems = items.filter((i) => !i.is_purchased)
    const purchasedItems = items.filter((i) => i.is_purchased)

    const handleAddItem = async () => {
        if (!newItem.trim()) return
        setIsAdding(true)

        const supabase = createClient()
        const { data, error } = await supabase
            .from("shopping_items")
            .insert({
                family_id: familyId,
                item_name: newItem.trim(),
                category: selectedCategory,
                added_by: currentUserId,
            })
            .select("*, added_by_profile:profiles!added_by(full_name)")
            .single()

        if (!error && data) {
            setItems([data, ...items])
            setNewItem("")
        }
        setIsAdding(false)
    }

    const handleTogglePurchased = async (item: ShoppingItem) => {
        const supabase = createClient()
        const { error } = await supabase
            .from("shopping_items")
            .update({ is_purchased: !item.is_purchased })
            .eq("id", item.id)

        if (!error) {
            setItems(items.map((i) => (i.id === item.id ? { ...i, is_purchased: !i.is_purchased } : i)))
        }
    }

    const handleDelete = async (itemId: string) => {
        const supabase = createClient()
        const { error } = await supabase.from("shopping_items").delete().eq("id", itemId)

        if (!error) {
            setItems(items.filter((i) => i.id !== itemId))
        }
    }

    const handleClearPurchased = async () => {
        const supabase = createClient()
        const purchasedIds = purchasedItems.map((i) => i.id)
        const { error } = await supabase.from("shopping_items").delete().in("id", purchasedIds)

        if (!error) {
            setItems(items.filter((i) => !i.is_purchased))
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-emerald-500" />
                        Shopping List
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {unpurchasedItems.length} items to get
                    </p>
                </div>
            </div>

            {/* Add Item Form */}
            <GlassCard className="p-4">
                <div className="flex gap-2 mb-3">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${selectedCategory === cat.value
                                    ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white"
                                    : "bg-white/30 hover:bg-white/50"
                                }`}
                            onClick={() => setSelectedCategory(cat.value)}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add an item..."
                        className="flex-1 px-4 py-2 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-emerald-400"
                        onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                    />
                    <GlassButton onClick={handleAddItem} disabled={isAdding || !newItem.trim()}>
                        <Plus className="w-4 h-4" />
                    </GlassButton>
                </div>
            </GlassCard>

            {/* Items List */}
            {unpurchasedItems.length === 0 && purchasedItems.length === 0 ? (
                <GlassCard className="p-8 text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 text-emerald-500 opacity-50" />
                    <p className="text-muted-foreground">
                        Your shopping list is empty. Add some items!
                    </p>
                </GlassCard>
            ) : (
                <div className="space-y-4">
                    {/* Unpurchased Items by Category */}
                    {categories.map((cat) => {
                        const catItems = unpurchasedItems.filter((i) => i.category === cat.value)
                        if (catItems.length === 0) return null
                        return (
                            <GlassCard key={cat.value} className="p-4">
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <span>{cat.icon}</span>
                                    {cat.label}
                                    <span className="text-sm text-muted-foreground">({catItems.length})</span>
                                </h3>
                                <div className="space-y-2">
                                    <AnimatePresence>
                                        {catItems.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/20 transition-colors"
                                            >
                                                <button
                                                    onClick={() => handleTogglePurchased(item)}
                                                    className="w-6 h-6 rounded-full border-2 border-emerald-400 flex items-center justify-center hover:bg-emerald-400/20 transition-colors"
                                                >
                                                    {item.is_purchased && <Check className="w-4 h-4 text-emerald-500" />}
                                                </button>
                                                <span className="flex-1">{item.item_name}</span>
                                                {item.quantity > 1 && (
                                                    <span className="text-sm text-muted-foreground">×{item.quantity}</span>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1 rounded-full hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </GlassCard>
                        )
                    })}

                    {/* Purchased Items */}
                    {purchasedItems.length > 0 && (
                        <GlassCard className="p-4 opacity-60">
                            <div className="flex items-center justify-between mb-3">
                                <button
                                    className="font-medium flex items-center gap-2"
                                    onClick={() => setShowPurchased(!showPurchased)}
                                >
                                    <Check className="w-4 h-4 text-emerald-500" />
                                    Purchased ({purchasedItems.length})
                                </button>
                                <button
                                    onClick={handleClearPurchased}
                                    className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    Clear all
                                </button>
                            </div>
                            <AnimatePresence>
                                {showPurchased && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        {purchasedItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-3 p-2 rounded-xl"
                                            >
                                                <button
                                                    onClick={() => handleTogglePurchased(item)}
                                                    className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                                                >
                                                    <Check className="w-4 h-4 text-white" />
                                                </button>
                                                <span className="flex-1 line-through text-muted-foreground">
                                                    {item.item_name}
                                                </span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </GlassCard>
                    )}
                </div>
            )}
        </div>
    )
}
